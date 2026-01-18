'use client'

import { useSession } from 'next-auth/react'
import PetugasNavbar from '@/components/PetugasNavbar'

export default function PetugasLayout({ children }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Middleware will handle unauthorized access, but double-check here
  if (!session || session.user.role !== 'PETUGAS') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PetugasNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

