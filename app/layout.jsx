import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/Toats'
import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})

export const metadata = {
  title: 'Sistem Peminjaman Alat',
  description: 'Sistem peminjaman alat sederhana',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

