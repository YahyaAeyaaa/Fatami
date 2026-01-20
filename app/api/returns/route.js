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
        approver: {
          select: {
            id: true,
            username: true,
            nama: true,
            email: true,
          },
        },
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
                email: true,
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
      include: {
        equipment: {
          include: { kategori: true },
        },
        user: {
          select: {
            id: true,
            username: true,
            nama: true,
            email: true,
          },
        },
        approver: {
          select: {
            id: true,
            username: true,
            nama: true,
            email: true,
          },
        },
      },
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

    // Buat pengajuan pengembalian (menunggu approval petugas)
    // Catatan: denda dihitung saat petugas approve (karena tanggal_kembali final baru diketahui saat itu).
    const createdReturn = await prisma.return.create({
      data: {
        loan_id,
        returned_by: session.user.id,
        status: 'PENDING',
        kondisi_alat,
        catatan,
        hari_telat: 0,
        denda: '0',
        denda_dibayar: false,
      },
      include: {
        approver: {
          select: {
            id: true,
            username: true,
            nama: true,
            email: true,
          },
        },
        loan: {
          include: {
            equipment: { include: { kategori: true } },
            user: { select: { id: true, username: true, nama: true, email: true } },
            approver: { select: { id: true, username: true, nama: true, email: true } },
          },
        },
      },
    })

    return NextResponse.json(createdReturn, { status: 201 })
  } catch (error) {
    console.error('Error creating return:', error)
    // Check if error is related to missing database columns
    if (error.message && error.message.includes('Unknown column') || error.message.includes('column') && error.message.includes('does not exist')) {
      return NextResponse.json(
        { 
          error: 'Database schema belum di-update. Silakan jalankan: npx prisma migrate deploy',
          details: error.message 
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { 
        error: 'Failed to create return',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

