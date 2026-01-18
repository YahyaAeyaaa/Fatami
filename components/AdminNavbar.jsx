'use client'

import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function AdminNavbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const getPageTitle = () => {
    if (pathname === '/admin') return ''
    if (pathname?.startsWith('/admin/kategori')) return ''
    if (pathname?.startsWith('/admin/alat')) return ''
    if (pathname?.startsWith('/admin/user')) return ''
    return 'Admin'
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const menuItems = [
    {
      name: 'Profile',
      icon: User,
      href: '/admin/profile',
      onClick: () => {
        setIsDropdownOpen(false)
      },
    },
    {
      name: 'Pengaturan',
      icon: Settings,
      href: '/admin/settings',
      onClick: () => {
        setIsDropdownOpen(false)
      },
    },
    {
      name: 'Logout',
      icon: LogOut,
      href: '#',
      onClick: () => {
        setIsDropdownOpen(false)
        handleLogout()
      },
      isLogout: true,
    },
  ]

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Page title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Right side - Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-10 h-10 bg-[#196885] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <p className="text-sm font-medium text-gray-900">{session?.user?.nama || 'Admin'}</p>
                <p className="text-xs text-gray-500">{session?.user?.email || 'admin@gmail.com'}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  
                  if (item.isLogout) {
                    return (
                      <button
                        key={index}
                        onClick={item.onClick}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </button>
                    )
                  }
                  
                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={item.onClick}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

