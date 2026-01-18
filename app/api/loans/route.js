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
      where.user_id = session.user.id
    }

    const loans = await prisma.loan.findMany({
      where,
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
        approver: {
          select: {
            id: true,
            username: true,
            nama: true,
          },
        },
        return: true,
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json(loans)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch loans' },
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
    const { equipment_id, jumlah, tanggal_deadline } = body

    const loan = await prisma.loan.create({
      data: {
        user_id: session.user.id,
        equipment_id,
        jumlah: parseInt(jumlah),
        tanggal_deadline: new Date(tanggal_deadline),
      },
      include: {
        equipment: {
          include: {
            kategori: true,
          },
        },
      },
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create loan' },
      { status: 500 }
    )
  }
}

