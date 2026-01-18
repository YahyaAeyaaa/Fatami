'use client'

import { useSession } from 'next-auth/react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminNavbar from '@/components/AdminNavbar'

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#196885] rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Middleware will handle unauthorized access, but double-check here
  if (!session || session.user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64">
        <AdminNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

