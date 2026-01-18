import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'PETUGAS') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const loan = await prisma.loan.update({
      where: { id },
      data: {
        status: 'REJECTED',
      },
    })

    return NextResponse.json(loan)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to reject loan' },
      { status: 500 }
    )
  }
}

