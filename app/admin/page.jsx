"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  Users,
  Package,
  FolderOpen,
  ClipboardList,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  MoreHorizontal,
  Calendar,
  Loader2,
} from "lucide-react"
import { useDashboard } from "./hooks"

export default function AdminPage() {
  const { stats, loading, fetchStats } = useDashboard()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          <p className="text-slate-500 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  const mainStats = [
    {
      title: "Total User",
      value: stats?.totalUsers || 0,
      icon: Users,
      change: "+12%",
      changeType: "positive",
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      href: "/admin/user",
    },
    {
      title: "Total Alat",
      value: stats?.totalEquipments || 0,
      icon: Package,
      change: "+8%",
      changeType: "positive",
      gradient: "from-emerald-500 to-emerald-600",
      bgLight: "bg-emerald-50",
      href: "/admin/alat",
    },
    {
      title: "Total Kategori",
      value: stats?.totalCategories || 0,
      icon: FolderOpen,
      change: "+3%",
      changeType: "positive",
      gradient: "from-violet-500 to-violet-600",
      bgLight: "bg-violet-50",
      href: "/admin/kategori",
    },
    {
      title: "Total Peminjaman",
      value: stats?.totalLoans || 0,
      icon: ClipboardList,
      change: "+24%",
      changeType: "positive",
      gradient: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      href: "#",
    },
  ]

  const loanStats = [
    {
      title: "Pending",
      value: stats?.pendingLoans || 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Disetujui",
      value: stats?.approvedLoans || 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Ditolak",
      value: stats?.rejectedLoans || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Aktif",
      value: stats?.activeLoans || 0,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
  ]

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
      case "BORROWED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200"
      case "RETURNED":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-amber-100 text-amber-700 border-amber-200"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED":
        return "Disetujui"
      case "BORROWED":
        return "Dipinjam"
      case "REJECTED":
        return "Ditolak"
      case "RETURNED":
        return "Dikembalikan"
      default:
        return "Pending"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Selamat Datang Kembali! 👋</h1>
            <p className="text-slate-500 mt-1">Berikut ringkasan sistem peminjaman alat hari ini</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Link
                key={index}
                href={stat.href}
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
                        className={`w-6 h-6 bg-gradient-to-br ${stat.gradient} bg-clip-text`}
                        style={{
                          color: stat.gradient.includes("blue")
                            ? "#3b82f6"
                            : stat.gradient.includes("emerald")
                              ? "#10b981"
                              : stat.gradient.includes("violet")
                                ? "#8b5cf6"
                                : "#f59e0b",
                        }}
                      />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${stat.changeType === "positive" ? "text-emerald-600" : "text-red-600"}`}
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                </div>

                {/* Hover indicator */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${stat.gradient.includes("blue") ? "#3b82f6, #2563eb" : stat.gradient.includes("emerald") ? "#10b981, #059669" : stat.gradient.includes("violet") ? "#8b5cf6, #7c3aed" : "#f59e0b, #ea580c"})`,
                  }}
                />
              </Link>
            )
          })}
        </div>

        {/* Loan Status Overview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Status Peminjaman</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-slate-400" />
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loanStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.title}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Loans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Peminjaman Terbaru</h2>
              <Link
                href="#"
                className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                Lihat semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.recentLoans && stats.recentLoans.length > 0 ? (
                stats.recentLoans.map((loan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                        {loan.user.nama?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{loan.user.nama}</p>
                        <p className="text-sm text-slate-500">{loan.equipment.nama}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusStyle(loan.status)}`}
                    >
                      {getStatusLabel(loan.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada peminjaman</p>
                  <p className="text-sm text-slate-400">Data peminjaman akan muncul di sini</p>
                </div>
              )}
            </div>
          </div>

          {/* Equipment by Category */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Alat per Kategori</h2>
              <Link
                href="/admin/kategori"
                className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
              >
                Lihat semua
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {stats?.equipmentByCategory && stats.equipmentByCategory.length > 0 ? (
                stats.equipmentByCategory.map((cat, index) => {
                  const colors = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500"]
                  const maxCount = Math.max(...stats.equipmentByCategory.map((c) => c.count))
                  const percentage = (cat.count / maxCount) * 100

                  return (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-slate-900">{cat.name}</p>
                        <span className="text-sm font-semibold text-slate-700">{cat.count} alat</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <FolderOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">Belum ada kategori</p>
                  <p className="text-sm text-slate-400">Tambah kategori untuk memulai</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 lg:p-8">
          <h2 className="text-lg font-semibold text-white mb-6">Aksi Cepat</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/admin/kategori"
              className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              <div className="p-3 bg-violet-500 rounded-xl">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Kelola Kategori</p>
                <p className="text-sm text-slate-300">Atur kategori alat</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/admin/alat"
              className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              <div className="p-3 bg-emerald-500 rounded-xl">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Kelola Alat</p>
                <p className="text-sm text-slate-300">Tambah & edit alat</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href="/admin/user"
              className="group flex items-center gap-4 p-5 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all border border-white/10"
            >
              <div className="p-3 bg-blue-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Kelola User</p>
                <p className="text-sm text-slate-300">Manajemen pengguna</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
