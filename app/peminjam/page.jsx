'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  Package,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  Calendar,
  Search,
  AlertCircle,
  BookOpen,
  Loader2,
} from 'lucide-react'
import { useDashboard } from './hooks'

export default function PeminjamPage() {
  const { stats, upcomingDeadlines, loading, fetchLoans, formatDateShort } = useDashboard()

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Stats configuration
  const statsConfig = [
    {
      title: 'Total Pinjaman',
      value: stats.total.toString(),
      icon: ClipboardList,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pending.toString(),
      icon: Clock,
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
    },
    {
      title: 'Sedang Dipinjam',
      value: stats.borrowed.toString(),
      icon: CheckCircle,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
    },
    {
      title: 'Selesai',
      value: stats.returned.toString(),
      icon: TrendingUp,
      gradient: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
    },
  ]

  // Quick actions
  const quickActions = [
    {
      title: 'Jelajahi Alat',
      description: 'Lihat daftar alat yang tersedia untuk dipinjam',
      icon: Search,
      href: '/peminjam/product',
      color: 'bg-blue-500',
    },
    {
      title: 'Pinjaman Saya',
      description: 'Kelola dan lihat status pinjaman Anda',
      icon: ClipboardList,
      href: '/peminjam/pinjaman',
      color: 'bg-emerald-500',
    },
    {
      title: 'Panduan',
      description: 'Pelajari cara menggunakan sistem peminjaman',
      icon: BookOpen,
      href: '#',
      color: 'bg-violet-500',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header / Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Selamat Datang! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola peminjaman alat Anda dengan mudah dan efisien
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-slate-100 p-3 rounded-xl w-12 h-12 animate-pulse" />
                </div>
                <div className="bg-slate-100 h-8 w-16 rounded mb-2 animate-pulse" />
                <div className="bg-slate-100 h-4 w-24 rounded animate-pulse" />
              </div>
            ))
          ) : (
            statsConfig.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Decorative gradient blob */}
                  <div
                    className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgLight} p-3 rounded-xl`}>
                        <Icon
                          className="w-6 h-6"
                          style={{
                            color: stat.gradient.includes('blue')
                              ? '#3b82f6'
                              : stat.gradient.includes('emerald')
                                ? '#10b981'
                                : stat.gradient.includes('violet')
                                  ? '#8b5cf6'
                                  : '#f59e0b',
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                  </div>

                  {/* Hover indicator */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${stat.gradient.includes('blue') ? '#3b82f6, #2563eb' : stat.gradient.includes('emerald') ? '#10b981, #059669' : stat.gradient.includes('violet') ? '#8b5cf6, #7c3aed' : '#f59e0b, #ea580c'})`,
                    }}
                  />
                </div>
              )
            })
          )}
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Deadline Mendatang</h2>
              <Link
                href="/peminjam/pinjaman"
                className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                Lihat semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
                  <p className="text-slate-500 font-medium">Memuat data...</p>
                </div>
              ) : upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{item.nama_alat}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <p className="text-sm text-slate-500">{formatDateShort(item.tanggal_deadline)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                          item.status === 'Sedang Dipinjam'
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border-amber-200'
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.daysLeft <= 3 && item.daysLeft >= 0 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">{item.daysLeft} hari</span>
                        </div>
                      )}
                      {item.daysLeft < 0 && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-medium">Terlambat</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Tidak ada deadline mendatang</p>
                  <p className="text-sm text-slate-400">Semua pinjaman sudah dikembalikan</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">Aksi Cepat</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="group flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100 hover:border-slate-200"
                  >
                    <div className={`${action.color} p-3 rounded-xl`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{action.title}</p>
                      <p className="text-sm text-slate-500">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 lg:p-8 border border-teal-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-teal-500 rounded-xl">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tips Peminjaman</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span>
                    Pastikan untuk mengembalikan alat sebelum atau tepat pada tanggal deadline yang ditentukan
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span>
                    Periksa kondisi alat sebelum digunakan dan laporkan jika ada kerusakan
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-500 mt-1">•</span>
                  <span>
                    Hubungi petugas jika ada pertanyaan atau kendala dalam peminjaman
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
