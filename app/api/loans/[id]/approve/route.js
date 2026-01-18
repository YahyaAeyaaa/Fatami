import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PETUGAS') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: { equipment: true },
    })

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 })
    }

    if (loan.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Loan already processed' },
        { status: 400 }
      )
    }

    if (loan.equipment.stok < loan.jumlah) {
      return NextResponse.json(
        { error: 'Stock tidak mencukupi' },
        { status: 400 }
      )
    }

    const [updatedLoan, updatedEquipment] = await prisma.$transaction([
      prisma.loan.update({
        where: { id },
        data: {
          status: 'BORROWED',
          approved_by: session.user.id,
          approved_at: new Date(),
        },
        include: {
          equipment: {
            include: {
              kategori: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              nama: true,
            },
          },
        },
      }),
      prisma.equipment.update({
        where: { id: loan.equipment_id },
        data: {
          stok: {
            decrement: loan.jumlah,
          },
        },
      }),
    ])

    return NextResponse.json(updatedLoan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve loan' },
      { status: 500 }
    )
  }
}

