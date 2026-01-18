import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Hanya PETUGAS dan ADMIN yang bisa konfirmasi pembayaran denda
    if (session.user.role !== 'PETUGAS' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = params

    const returnItem = await prisma.return.findUnique({
      where: { id },
      include: {
        loan: {
          include: {
            user: true,
            equipment: true,
          },
        },
      },
    })

    if (!returnItem) {
      return NextResponse.json({ error: 'Return not found' }, { status: 404 })
    }

    if (returnItem.denda_dibayar) {
      return NextResponse.json(
        { error: 'Denda sudah dibayar' },
        { status: 400 }
      )
    }

    if (returnItem.denda <= 0) {
      return NextResponse.json(
        { error: 'Tidak ada denda yang harus dibayar' },
        { status: 400 }
      )
    }

    const updatedReturn = await prisma.return.update({
      where: { id },
      data: {
        denda_dibayar: true,
        tanggal_bayar_denda: new Date(),
      },
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
    })

    return NextResponse.json(updatedReturn, { status: 200 })
  } catch (error) {
    console.error('Error paying denda:', error)
    return NextResponse.json(
      { error: 'Failed to pay denda' },
      { status: 500 }
    )
  }
}

