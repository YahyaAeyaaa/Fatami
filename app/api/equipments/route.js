import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      include: {
        kategori: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(equipments)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch equipments' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { nama, kode_alat, kategori_id, stok, deskripsi, image } = body

    const equipment = await prisma.equipment.create({
      data: {
        nama,
        kode_alat,
        kategori_id,
        stok: parseInt(stok),
        deskripsi,
        image,
      },
      include: {
        kategori: true,
      },
    })

    return NextResponse.json(equipment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create equipment' },
      { status: 500 }
    )
  }
}

