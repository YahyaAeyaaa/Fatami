import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        nama: true,
        is_active: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
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
    const { username, password, email, role, nama } = body

    // Validasi: Admin tidak bisa membuat user dengan role ADMIN
    if (role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin tidak dapat membuat user dengan role ADMIN' },
        { status: 403 }
      )
    }

    // Validasi: Role harus PETUGAS atau PEMINJAM
    if (role !== 'PETUGAS' && role !== 'PEMINJAM') {
      return NextResponse.json(
        { error: 'Role harus PETUGAS atau PEMINJAM' },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        role,
        nama,
      },
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

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

