import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get counts
    const [
      totalUsers,
      totalEquipments,
      totalCategories,
      totalLoans,
      pendingLoans,
      approvedLoans,
      rejectedLoans,
      activeLoans,
      totalReturns,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.equipment.count(),
      prisma.category.count(),
      prisma.loan.count(),
      prisma.loan.count({ where: { status: 'PENDING' } }),
      prisma.loan.count({ where: { status: 'APPROVED' } }),
      prisma.loan.count({ where: { status: 'REJECTED' } }),
      prisma.loan.count({ where: { status: 'BORROWED' } }),
      prisma.return.count(),
    ])

    // Get recent loans
    const recentLoans = await prisma.loan.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            nama: true,
            username: true,
          },
        },
        equipment: {
          select: {
            nama: true,
          },
        },
      },
    })

    // Get equipment by category
    const equipmentByCategory = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            equipments: true,
          },
        },
      },
    })

    return NextResponse.json({
      totalUsers,
      totalEquipments,
      totalCategories,
      totalLoans,
      pendingLoans,
      approvedLoans,
      rejectedLoans,
      activeLoans,
      totalReturns,
      recentLoans,
      equipmentByCategory: equipmentByCategory.map((cat) => ({
        name: cat.nama,
        count: cat._count.equipments,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

