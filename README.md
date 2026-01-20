# Sistem Peminjaman Alat

Sistem peminjaman alat sederhana dengan 3 role: Admin, Petugas, dan Peminjam.

## Fitur

### Admin
- CRUD Kategori Alat
- CRUD Alat
- CRUD User (Peminjam & Petugas)

### Petugas
- Approval Peminjaman
- Monitoring Pengembalian

### Peminjam
- Melihat daftar alat
- Mengajukan peminjaman
- Mengembalikan alat

## Teknologi

- Next.js 14 (App Router)
- React 18
- Prisma 6
- PostgreSQL
- NextAuth.js
- Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env dan isi DATABASE_URL dengan connection string PostgreSQL Anda
# Contoh: postgresql://user:password@localhost:5432/peminjaman_alat?schema=public
```

3. Setup Prisma:
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migration
npx prisma migrate dev --name init
```

4. Buat user admin pertama menggunakan seeder:
```bash
# Jalankan seeder untuk membuat user default (Admin, Petugas, Peminjam)
npm run prisma:seed

# Atau menggunakan Prisma CLI
npx prisma db seed

# Atau langsung dengan Node.js
node prisma/seed.js
```

**Default credentials setelah seeder:**
- **Admin**: 
  - Username/Email: `admin` atau `admin@gmail.com`
  - Password: `admin123`
- **Petugas**: 
  - Username/Email: `petugas` atau `petugas@gmail.com`
  - Password: `admin123`
- **Peminjam**: 
  - Username/Email: `peminjam` atau `peminjam@gmail.com`
  - Password: `admin123`

> **Catatan**: Seeder akan membuat user jika belum ada, atau update jika sudah ada (upsert).

5. Jalankan development server:
```bash
npm run dev
```

6. Buka browser ke `http://localhost:3000`

## Update Setelah Git Pull

Jika Anda melakukan `git pull` untuk mendapatkan update terbaru dari repository, **WAJIB** menjalankan langkah-langkah berikut:

```bash
# 1. Install dependencies baru (jika ada package baru)
npm install

# 2. Generate Prisma Client (update kode TypeScript/JavaScript)
npx prisma generate

# 3. Update database schema (TERPENTING! Jangan skip ini!)
# Untuk development:
npx prisma migrate dev

# Atau untuk production:
npx prisma migrate deploy

# 4. Restart development server
# Stop server (Ctrl+C) lalu jalankan lagi:
npm run dev
```

> **⚠️ PENTING**: Jika Anda skip langkah `npx prisma migrate dev/deploy`, aplikasi akan error karena database schema belum di-update dengan field-field baru. Error yang muncul biasanya: `500 Internal Server Error` atau `Unknown column` / `column does not exist`.

### Troubleshooting Setelah Git Pull

**Error: "Failed to create return" atau "500 Internal Server Error"**
- **Penyebab**: Database schema belum di-update setelah git pull
- **Solusi**: Jalankan `npx prisma migrate dev` atau `npx prisma migrate deploy`

**Error: "Prisma Client belum di-generate"**
- **Penyebab**: Prisma Client belum di-update setelah schema berubah
- **Solusi**: Jalankan `npx prisma generate`

**Error: "Module not found" atau "Cannot find module"**
- **Penyebab**: Dependencies belum di-install
- **Solusi**: Jalankan `npm install`

## Catatan

- Pastikan PostgreSQL sudah running
- Jangan lupa set `NEXTAUTH_SECRET` di file `.env`
- Password di-hash menggunakan bcryptjs

