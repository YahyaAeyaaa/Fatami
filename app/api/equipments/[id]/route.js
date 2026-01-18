import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const { id } = params

    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        kategori: true,
      },
    })

    if (!equipment) {
      return NextResponse.json({ error: 'Equipment not found' }, { status: 404 })
    }

    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { nama, kode_alat, kategori_id, stok, deskripsi, image } = body

    const equipment = await prisma.equipment.update({
      where: { id },
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

    return NextResponse.json(equipment)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update equipment' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    await prisma.equipment.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Equipment deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete equipment' },
      { status: 500 }
    )
  }
}

