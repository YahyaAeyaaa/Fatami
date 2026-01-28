/**
 * Script untuk membuat data test denda
 * Menjalankan: node prisma/test-denda.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

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

    // 5. Buat data pinjaman yang masih dipinjam (BELUM DIKEMBALIKAN)
    // Target sesuai request:
    // - tanggal pinjam: 20 Januari 2026
    // - deadline: 29 Januari 2026
    // - status: BORROWED
    // Catatan: Month di JS adalah 0-based (Jan = 0)
    const tanggalPinjam = new Date(2026, 0, 20) // 20 Jan 2026
    const deadline = new Date(2026, 0, 29) // 29 Jan 2026

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
      console.log('✅ Loan BORROWED dibuat (pinjam 20 Jan, deadline 29 Jan)')
    } else {
      // Update loan yang ada untuk test
      loan = await prisma.loan.update({
        where: { id: loan.id },
        data: {
          tanggal_deadline: deadline,
          tanggal_pinjam: tanggalPinjam,
          status: 'BORROWED',
          tanggal_kembali: null,
        },
      })
      console.log('✅ Loan BORROWED diupdate (pinjam 20 Jan, deadline 29 Jan)')
    }

    // 6. Pastikan TIDAK ADA record pengembalian untuk loan ini
    // (karena masih dipinjam, belum ada pengembalian => tidak ada denda)
    await prisma.return.deleteMany({
      where: { loan_id: loan.id },
    })

    console.log('\n📋 Data Test (Masih Dipinjam):')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`Loan ID: ${loan.id}`)
    console.log(`Tanggal Pinjam: ${tanggalPinjam.toLocaleDateString('id-ID')}`)
    console.log(`Deadline: ${deadline.toLocaleDateString('id-ID')}`)
    console.log(`Status Loan: BORROWED (tetap dipinjam)`)
    console.log('Return: (tidak ada)')
    console.log(`Peminjam: ${peminjam.nama} (${peminjam.email})`)
    console.log(`Alat: ${equipment.nama}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n💡 Langkah selanjutnya:')
    console.log('1. Login sebagai peminjam (username: ' + peminjam.username + ', password: admin123)')
    console.log('2. Buka halaman "Pinjaman Saya"')
    console.log('3. Pastikan loan ini masih muncul sebagai "dipinjam" dan BELUM ada data pengembalian/denda')
    console.log('4. Jika kamu kembalikan setelah tanggal 29 Jan, barulah denda muncul')

    console.log('\n🧭 Catatan validasi bug tanggal (harusnya TIDAK telat):')
    console.log('- Jika deadline: 6 April dan dikembalikan: 5 April => hari_telat harus 0')
    console.log('- Denda mulai dihitung hanya jika tanggal_kembali > tanggal_deadline (bukan pada hari deadline)')
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

