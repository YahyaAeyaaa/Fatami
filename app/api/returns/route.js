import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let where = {}
    if (session.user.role === 'PEMINJAM') {
      where.returned_by = session.user.id
    }

    const returns = await prisma.return.findMany({
      where,
      include: {
        loan: {
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
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(returns)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch returns' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PEMINJAM') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { loan_id, kondisi_alat, catatan } = body

    const loan = await prisma.loan.findUnique({
      where: { id: loan_id },
      include: { equipment: true },
    })

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 })
    }

    if (loan.status !== 'BORROWED') {
      return NextResponse.json(
        { error: 'Loan tidak dapat dikembalikan' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction([
      prisma.return.create({
        data: {
          loan_id,
          returned_by: session.user.id,
          kondisi_alat,
          catatan,
        },
        include: {
          loan: {
            include: {
              equipment: {
                include: {
                  kategori: true,
                },
              },
            },
          },
        },
      }),
      prisma.loan.update({
        where: { id: loan_id },
        data: {
          status: 'RETURNED',
          tanggal_kembali: new Date(),
        },
      }),
      prisma.equipment.update({
        where: { id: loan.equipment_id },
        data: {
          stok: {
            increment: loan.jumlah,
          },
        },
      }),
    ])

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create return' },
      { status: 500 }
    )
  }
}

