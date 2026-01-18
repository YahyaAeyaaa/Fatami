import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // If no token and trying to access protected routes, redirect to login
    if (!token && path !== '/' && !path.startsWith('/api/auth')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If has token and trying to access login page, redirect to their dashboard
    if (token && path === '/') {
      if (token.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      } else if (token.role === 'PETUGAS') {
        return NextResponse.redirect(new URL('/petugas', req.url))
      } else if (token.role === 'PEMINJAM') {
        return NextResponse.redirect(new URL('/peminjam', req.url))
      }
    }

    // Protect admin routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Protect petugas routes
    if (path.startsWith('/petugas')) {
      if (token?.role !== 'PETUGAS') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Protect peminjam routes
    if (path.startsWith('/peminjam')) {
      if (token?.role !== 'PEMINJAM') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public routes (login page)
        if (path === '/' || path.startsWith('/api/auth')) {
          return true
        }

        // All other routes require authentication
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes - except auth which is handled)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

