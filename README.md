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

4. Buat user admin pertama (optional, bisa dilakukan via UI setelah setup):
```bash
npx prisma studio
# Atau gunakan seeder script jika ada
```

5. Jalankan development server:
```bash
npm run dev
```

6. Buka browser ke `http://localhost:3000`

## Catatan

- Pastikan PostgreSQL sudah running
- Jangan lupa set `NEXTAUTH_SECRET` di file `.env`
- Password di-hash menggunakan bcryptjs

