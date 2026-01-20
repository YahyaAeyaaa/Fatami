import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

// Menandai bahwa barang benar-benar sudah diambil / sedang dipinjam
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PETUGAS') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const loan = await prisma.loan.findUnique({
      where: { id },
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
    })

    if (!loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 })
    }

    if (loan.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'Loan must be APPROVED before marked as BORROWED' },
        { status: 400 }
      )
    }

    // Pada tahap ini stok sudah dikurangi saat APPROVE,
    // jadi di sini hanya mengubah status ke BORROWED dan update tanggal_pinjam jika perlu.
    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: {
        status: 'BORROWED',
        // Override tanggal_pinjam ke waktu barang benar-benar diambil
        tanggal_pinjam: new Date(),
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
        approver: {
          select: {
            id: true,
            username: true,
            nama: true,
          },
        },
      },
    })

    return NextResponse.json(updatedLoan)
  } catch (error) {
    console.error('Error marking loan as borrowed:', error)
    return NextResponse.json(
      { error: 'Failed to mark loan as borrowed' },
      { status: 500 }
    )
  }
}


