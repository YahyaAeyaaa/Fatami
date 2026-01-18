const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // Hash password untuk semua users
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@gmail.com',
      nama: 'Admin System',
      role: 'ADMIN',
      is_active: true,
    },
  })
  console.log('✅ Admin created:', admin.email)

  // Seed Petugas
  const petugas = await prisma.user.upsert({
    where: { email: 'petugas@gmail.com' },
    update: {},
    create: {
      username: 'petugas',
      password: hashedPassword,
      email: 'petugas@gmail.com',
      nama: 'Petugas System',
      role: 'PETUGAS',
      is_active: true,
    },
  })
  console.log('✅ Petugas created:', petugas.email)

  // Seed Peminjam
  const peminjam = await prisma.user.upsert({
    where: { email: 'peminjam@gmail.com' },
    update: {},
    create: {
      username: 'peminjam',
      password: hashedPassword,
      email: 'peminjam@gmail.com',
      nama: 'John Doe',
      role: 'PEMINJAM',
      is_active: true,
    },
  })
  console.log('✅ Peminjam created:', peminjam.email)

  console.log('\n🎉 Seeding completed successfully!')
  console.log('\n📝 Default credentials:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Admin:')
  console.log('  Email/Username: admin@gmail.com / admin')
  console.log('  Password: admin123')
  console.log('\nPetugas:')
  console.log('  Email/Username: petugas@gmail.com / petugas')
  console.log('  Password: admin123')
  console.log('\nPeminjam:')
  console.log('  Email/Username: peminjam@gmail.com / peminjam')
  console.log('  Password: admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

