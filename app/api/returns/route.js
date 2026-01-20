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

    // Hitung denda jika telat
    const returnDate = new Date()
    const deadline = new Date(loan.tanggal_deadline)
    deadline.setHours(23, 59, 59, 999) // Set ke akhir hari deadline
    
    const diffTime = returnDate - deadline
    const hariTelat = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const isLate = hariTelat > 0
    
    // Hitung denda: Rp 5.000 per hari telat (bisa disesuaikan)
    const dendaPerHari = 5000
    const denda = isLate ? hariTelat * dendaPerHari : 0

    const result = await prisma.$transaction([
      prisma.return.create({
        data: {
          loan_id,
          returned_by: session.user.id,
          kondisi_alat,
          catatan,
          hari_telat: isLate ? hariTelat : 0,
          denda: denda.toString(), // Convert to string for Decimal type
          denda_dibayar: false,
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
          tanggal_kembali: returnDate,
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

