/**
 * Script untuk membuat data test denda
 * Menjalankan: node prisma/test-denda.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🧪 Membuat data test untuk denda...')

  try {
    // 1. Cari atau buat user peminjam
    let peminjam = await prisma.user.findFirst({
      where: { role: 'PEMINJAM' },
    })

    if (!peminjam) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      peminjam = await prisma.user.create({
        data: {
          username: 'test_peminjam',
          password: hashedPassword,
          email: 'test_peminjam@test.com',
          nama: 'Test Peminjam',
          role: 'PEMINJAM',
          is_active: true,
        },
      })
      console.log('✅ User peminjam dibuat:', peminjam.email)
    } else {
      console.log('✅ Menggunakan user peminjam yang ada:', peminjam.email)
    }

    // 2. Cari atau buat petugas
    let petugas = await prisma.user.findFirst({
      where: { role: 'PETUGAS' },
    })

    if (!petugas) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      petugas = await prisma.user.create({
        data: {
          username: 'test_petugas',
          password: hashedPassword,
          email: 'test_petugas@test.com',
          nama: 'Test Petugas',
          role: 'PETUGAS',
          is_active: true,
        },
      })
      console.log('✅ User petugas dibuat:', petugas.email)
    } else {
      console.log('✅ Menggunakan user petugas yang ada:', petugas.email)
    }

    // 3. Cari atau buat kategori
    let kategori = await prisma.category.findFirst()

    if (!kategori) {
      kategori = await prisma.category.create({
        data: {
          nama: 'Test Kategori',
          deskripsi: 'Kategori untuk testing',
        },
      })
      console.log('✅ Kategori dibuat:', kategori.nama)
    } else {
      console.log('✅ Menggunakan kategori yang ada:', kategori.nama)
    }

    // 4. Cari atau buat equipment
    let equipment = await prisma.equipment.findFirst({
      where: { kategori_id: kategori.id },
    })

    if (!equipment) {
      equipment = await prisma.equipment.create({
        data: {
          nama: 'Alat Test Denda',
          kode_alat: 'TEST-001',
          kategori_id: kategori.id,
          stok: 10,
          deskripsi: 'Alat untuk testing denda',
        },
      })
      console.log('✅ Equipment dibuat:', equipment.nama)
    } else {
      console.log('✅ Menggunakan equipment yang ada:', equipment.nama)
    }

    // 5. Buat loan yang sudah APPROVED/BORROWED dengan deadline yang sudah lewat
    const deadline = new Date()
    deadline.setDate(deadline.getDate() - 5) // Deadline 5 hari yang lalu

    const tanggalPinjam = new Date()
    tanggalPinjam.setDate(tanggalPinjam.getDate() - 10) // Pinjam 10 hari yang lalu

    // Cek apakah sudah ada loan untuk test ini
    let loan = await prisma.loan.findFirst({
      where: {
        user_id: peminjam.id,
        equipment_id: equipment.id,
        status: 'BORROWED',
      },
    })

    if (!loan) {
      // Buat loan baru dengan status BORROWED
      loan = await prisma.loan.create({
        data: {
          user_id: peminjam.id,
          equipment_id: equipment.id,
          jumlah: 1,
          tanggal_pinjam: tanggalPinjam,
          tanggal_deadline: deadline,
          status: 'BORROWED',
          approved_by: petugas.id,
          approved_at: tanggalPinjam,
        },
      })
      console.log('✅ Loan dibuat dengan deadline yang sudah lewat')
    } else {
      // Update loan yang ada untuk test
      loan = await prisma.loan.update({
        where: { id: loan.id },
        data: {
          tanggal_deadline: deadline,
          tanggal_pinjam: tanggalPinjam,
          status: 'BORROWED',
        },
      })
      console.log('✅ Loan diupdate dengan deadline yang sudah lewat')
    }

    console.log('\n📋 Data Test Denda:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Loan ID: ${loan.id}`)
    console.log(`Tanggal Pinjam: ${tanggalPinjam.toLocaleDateString('id-ID')}`)
    console.log(`Deadline: ${deadline.toLocaleDateString('id-ID')}`)
    console.log(`Status: ${loan.status}`)
    console.log(`Peminjam: ${peminjam.nama} (${peminjam.email})`)
    console.log(`Alat: ${equipment.nama}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Langkah selanjutnya:')
    console.log('1. Login sebagai peminjam (username: ' + peminjam.username + ', password: admin123)')
    console.log('2. Buka halaman "Pinjaman Saya"')
    console.log('3. Klik tombol "Kembalikan" untuk alat yang sudah lewat deadline')
    console.log('4. Sistem akan otomatis menghitung denda (5 hari × Rp 5.000 = Rp 25.000)')
    console.log('5. Setelah dikembalikan, cek di halaman "Riwayat" untuk melihat denda')
    console.log('6. Login sebagai petugas/admin untuk konfirmasi pembayaran denda')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('❌ Error saat membuat data test:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

