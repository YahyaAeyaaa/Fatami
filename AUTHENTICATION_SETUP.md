# Setup Authentication & Seeder

## 1. Run Database Seeder

Seeder akan membuat 3 akun default untuk testing:

```bash
npm run prisma:seed
```

### Default Credentials:

| Role | Username/Email | Password |
|------|---------------|----------|
| **Admin** | `admin` atau `admin@gmail.com` | `admin123` |
| **Petugas** | `petugas` atau `petugas@gmail.com` | `admin123` |
| **Peminjam** | `peminjam` atau `peminjam@gmail.com` | `admin123` |

## 2. Fitur Keamanan

### Middleware Protection
- ✅ Role-based access control
- ✅ Admin tidak bisa akses halaman Petugas/Peminjam
- ✅ Petugas tidak bisa akses halaman Admin/Peminjam
- ✅ Peminjam tidak bisa akses halaman Admin/Petugas
- ✅ Auto redirect ke dashboard sesuai role setelah login
- ✅ Auto redirect ke login jika belum login

### API Protection
Semua API routes sudah dilindungi dengan NextAuth:
- Admin routes: hanya bisa diakses oleh role ADMIN
- Petugas routes: hanya bisa diakses oleh role PETUGAS
- Peminjam routes: hanya bisa diakses oleh role PEMINJAM

## 3. Login Flow

### Cara Login:
1. Buka `http://localhost:3000`
2. Masukkan username atau email
3. Masukkan password
4. Sistem akan otomatis redirect ke dashboard sesuai role:
   - Admin → `/admin`
   - Petugas → `/petugas`
   - Peminjam → `/peminjam`

### Logout:
Klik profile dropdown di navbar, kemudian pilih "Logout"

## 4. Testing Authentication

### Test Admin Access:
```
Login sebagai: admin / admin123
Bisa akses: /admin, /admin/kategori, /admin/alat, /admin/user
Tidak bisa akses: /petugas/*, /peminjam/*
```

### Test Petugas Access:
```
Login sebagai: petugas / admin123
Bisa akses: /petugas, /petugas/approval, /petugas/pengembalian
Tidak bisa akses: /admin/*, /peminjam/*
```

### Test Peminjam Access:
```
Login sebagai: peminjam / admin123
Bisa akses: /peminjam, /peminjam/product, /peminjam/pinjaman, /peminjam/riwayat
Tidak bisa akses: /admin/*, /petugas/*
```

## 5. Troubleshooting

### Jika terjadi error "Unauthorized":
1. Pastikan sudah login
2. Cek role akun Anda sesuai dengan halaman yang diakses
3. Clear cookies browser dan login ulang
4. Restart development server

### Jika seeder error:
1. Pastikan database sudah running
2. Pastikan connection string di `.env` sudah benar
3. Jalankan `npx prisma db push` terlebih dahulu
4. Run seeder lagi dengan `npm run prisma:seed`

### Jika tidak bisa login:
1. Pastikan `NEXTAUTH_SECRET` sudah diset di `.env`
2. Pastikan bcryptjs sudah terinstall: `npm install bcryptjs`
3. Check console browser untuk error messages
4. Verify database connection

## 6. Environment Variables

Pastikan file `.env` memiliki:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/peminjaman_alat?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long"
```

Generate `NEXTAUTH_SECRET` dengan:
```bash
openssl rand -base64 32
```

## 7. Development Notes

- Password di-hash menggunakan bcryptjs dengan salt rounds = 10
- Session menggunakan JWT strategy
- Token expires sesuai default NextAuth (30 hari)
- Refresh token otomatis oleh NextAuth
- CSRF protection enabled by default

