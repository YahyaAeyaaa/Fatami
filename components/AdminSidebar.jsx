"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FolderOpen, Package, Users, Menu, X, NotebookTabs, Notebook, BoxIcon, NotebookPen } from "lucide-react"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Kategori",
      href: "/admin/kategori",
      icon: FolderOpen,
    },
    {
      name: "Alat",
      href: "/admin/alat",
      icon: Package,
    },
    {
      name: "User",
      href: "/admin/user",
      icon: Users,
    },
    {
      name: "Data Pinjaman",
      href: "/admin/Data-pinjaman",
      icon: Notebook,
    },
    {
      name: "data pengembalian",
      href: "/admin/Data-pengembalian",
      icon: BoxIcon,
    },
    {
      name: "Log Aktifitas",
      href: "/admin/Log-Aktifitas",
      icon: NotebookPen,
    },
  ]

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white text-slate-700 shadow-lg shadow-slate-200/50 border border-slate-200 hover:bg-slate-50 transition-colors"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out z-40
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a2e3b] rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">SistemAlat</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Menu Label */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative
                    ${
                      active
                        ? "bg-[#1a2e3b] text-white shadow-lg shadow-slate-900/10"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-teal-400" : "text-slate-400 group-hover:text-slate-600"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">© 2026 SistemAlat v1.0</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}
