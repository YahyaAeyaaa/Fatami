import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

function toLocalDateOnly(dateLike) {
  const d = new Date(dateLike)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function calcLateDays(returnDateLike, deadlineDateLike) {
  if (!returnDateLike || !deadlineDateLike) return 0
  const returnDate = toLocalDateOnly(returnDateLike)
  const deadlineDate = toLocalDateOnly(deadlineDateLike)
  const diffDays = Math.floor((returnDate - deadlineDate) / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Petugas meng-approve pengembalian (barang benar-benar kembali + stok bertambah)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PETUGAS') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const returnRequest = await prisma.return.findUnique({
      where: { id },
      include: {
        loan: {
          include: {
            equipment: {
              include: { kategori: true },
            },
            user: {
              select: { id: true, username: true, nama: true, email: true },
            },
            approver: {
              select: { id: true, username: true, nama: true, email: true },
            },
          },
        },
      },
    })

    if (!returnRequest) {
      return NextResponse.json({ error: 'Return not found' }, { status: 404 })
    }

    if (returnRequest.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Return already processed' },
        { status: 400 }
      )
    }

    if (!returnRequest.loan) {
      return NextResponse.json({ error: 'Loan not found' }, { status: 404 })
    }

    // Data lama kadang sudah tidak konsisten:
    // - Jika loan sudah RETURNED, jangan increment stok lagi. Cukup finalisasi Return menjadi APPROVED.
    // - Jika loan status selain BORROWED/RETURNED, tolak dengan pesan yang lebih jelas.
    if (returnRequest.loan.status === 'RETURNED') {
      const approvedAt = new Date()
      const tanggalKembali =
        returnRequest.loan.tanggal_kembali || returnRequest.tanggal_kembali || approvedAt

      const hariTelat = calcLateDays(tanggalKembali, returnRequest.loan.tanggal_deadline)
      const isLate = hariTelat > 0
      const dendaPerHari = 5000
      const denda = isLate ? hariTelat * dendaPerHari : 0

      const updatedReturn = await prisma.return.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approved_by: session.user.id,
          approved_at: approvedAt,
          tanggal_kembali: tanggalKembali,
          hari_telat: isLate ? hariTelat : 0,
          denda: denda.toString(),
          denda_dibayar: false,
        },
        include: {
          approver: {
            select: { id: true, username: true, nama: true, email: true },
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

      return NextResponse.json(updatedReturn)
    }

    if (returnRequest.loan.status !== 'BORROWED') {
      return NextResponse.json(
        {
          error: `Loan tidak dalam status BORROWED (status sekarang: ${returnRequest.loan.status}). Jika ini data lama yang sudah RETURNED, refresh data; jika belum BORROWED, pengembalian tidak bisa di-approve.`,
        },
        { status: 400 }
      )
    }

    const returnDate = new Date()
    const hariTelat = calcLateDays(returnDate, returnRequest.loan.tanggal_deadline)
    const isLate = hariTelat > 0

    const dendaPerHari = 5000
    const denda = isLate ? hariTelat * dendaPerHari : 0

    const [updatedReturn] = await prisma.$transaction([
      prisma.return.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approved_by: session.user.id,
          approved_at: returnDate,
          tanggal_kembali: returnDate,
          hari_telat: isLate ? hariTelat : 0,
          denda: denda.toString(),
          denda_dibayar: false,
        },
        include: {
          approver: {
            select: { id: true, username: true, nama: true, email: true },
          },
          loan: {
            include: {
              equipment: { include: { kategori: true } },
              user: { select: { id: true, username: true, nama: true, email: true } },
              approver: { select: { id: true, username: true, nama: true, email: true } },
            },
          },
        },
      }),
      prisma.loan.update({
        where: { id: returnRequest.loan_id },
        data: {
          status: 'RETURNED',
          tanggal_kembali: returnDate,
        },
      }),
      prisma.equipment.update({
        where: { id: returnRequest.loan.equipment_id },
        data: {
          stok: { increment: returnRequest.loan.jumlah },
        },
      }),
    ])

    return NextResponse.json(updatedReturn)
  } catch (error) {
    console.error('Error approving return:', error)
    return NextResponse.json(
      { error: 'Failed to approve return' },
      { status: 500 }
    )
  }
}


