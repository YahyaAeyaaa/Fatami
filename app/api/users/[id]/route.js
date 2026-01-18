import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        nama: true,
        is_active: true,
        created_at: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch user' },
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
    const { username, password, email, role, nama, is_active } = body

    // Validasi: Admin tidak bisa mengubah role user menjadi ADMIN
    if (role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin tidak dapat mengubah role user menjadi ADMIN' },
        { status: 403 }
      )
    }

    // Validasi: Role harus PETUGAS atau PEMINJAM (jika role diubah)
    if (role && role !== 'PETUGAS' && role !== 'PEMINJAM') {
      return NextResponse.json(
        { error: 'Role harus PETUGAS atau PEMINJAM' },
        { status: 400 }
      )
    }

    // Cek apakah user yang akan diupdate adalah admin
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    })

    if (existingUser && existingUser.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Tidak dapat mengupdate user dengan role ADMIN' },
        { status: 403 }
      )
    }

    const updateData = {
      username,
      email,
      role,
      nama,
      is_active,
    }

    if (password) {
      updateData.password = await hash(password, 10)
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        nama: true,
        is_active: true,
        created_at: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
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

    // Cek apakah user yang akan dihapus adalah admin
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    })

    if (existingUser && existingUser.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus user dengan role ADMIN' },
        { status: 403 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'User deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}

