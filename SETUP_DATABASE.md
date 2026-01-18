# Setup Database Connection

## 1. Install Dependencies

Pastikan semua dependencies sudah terinstall:

```bash
npm install
```

## 2. Setup Environment Variables

### Buat file `.env` di root project

Copy file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Atau buat manual file `.env` dengan isi:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/peminjaman_alat?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production-min-32-chars"
```

### Konfigurasi DATABASE_URL

Format DATABASE_URL:
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
```

**Contoh untuk PostgreSQL lokal:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/peminjaman_alat?schema=public"
```

**Contoh untuk PostgreSQL di cloud (Supabase, Railway, dll):**
```env
DATABASE_URL="postgresql://user:password@host.region.provider.com:5432/dbname?schema=public"
```

### Generate NEXTAUTH_SECRET

Untuk development, bisa generate random secret:

```bash
# Di terminal/command prompt
openssl rand -base64 32
```

Atau gunakan online generator: https://generate-secret.vercel.app/32

## 3. Setup Database

### Opsi 1: Menggunakan Prisma Migrate (Recommended)

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database migration
npm run prisma:migrate

# Atau jika ingin push schema langsung tanpa migration
npm run prisma:push
```

### Opsi 2: Manual Setup Database

1. Buat database PostgreSQL:
```sql
CREATE DATABASE peminjaman_alat;
```

2. Push schema ke database:
```bash
npm run prisma:push
```

## 4. Verify Connection

Jalankan Prisma Studio untuk melihat database:

```bash
npm run prisma:studio
```

Ini akan membuka browser di `http://localhost:5555` untuk melihat dan mengelola data.

## 5. Run Development Server

```bash
npm run dev
```

## Troubleshooting

### Error: Can't reach database server
- Pastikan PostgreSQL sudah running
- Cek username, password, host, dan port di DATABASE_URL
- Pastikan database sudah dibuat

### Error: P1001: Can't reach database server
- Cek firewall settings
- Pastikan PostgreSQL menerima koneksi dari localhost
- Untuk cloud database, pastikan IP whitelist sudah benar

### Error: P1003: Database does not exist
- Buat database terlebih dahulu:
```sql
CREATE DATABASE peminjaman_alat;
```

### Error: P1017: Server has closed the connection
- Cek kredensial database (username/password)
- Pastikan database server masih running

## Production Setup

Untuk production, pastikan:
1. Gunakan environment variables yang aman
2. NEXTAUTH_SECRET harus random dan kuat (min 32 karakter)
3. DATABASE_URL harus menggunakan connection pooling jika memungkinkan
4. Jangan commit file `.env` ke repository


