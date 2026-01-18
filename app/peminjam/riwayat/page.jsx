'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  XCircle,
  Package,
  Calendar,
  AlertCircle,
  FileText,
  Clock,
  Loader2,
} from 'lucide-react'
import { useLoans } from '../pinjaman/hooks'

export default function RiwayatPage() {
  const { loans, loading, fetchLoans } = useLoans()
  const [selectedCategory, setSelectedCategory] = useState('Semua') // Semua, RETURNED, REJECTED

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Filter hanya pinjaman yang sudah selesai (RETURNED dan REJECTED) untuk riwayat
  const historyLoans = loans.filter(
    (loan) => loan.status === 'RETURNED' || loan.status === 'REJECTED'
  )

  // Filter riwayat berdasarkan kategori
  const filteredLoans = historyLoans.filter((loan) => {
    if (selectedCategory === 'Semua') return true
    return loan.status === selectedCategory
  })

  // Stats
  const stats = {
    total: historyLoans.length,
    returned: historyLoans.filter((l) => l.status === 'RETURNED').length,
    rejected: historyLoans.filter((l) => l.status === 'REJECTED').length,
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'RETURNED':
        return {
          label: 'Sudah Dikembalikan',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: CheckCircle,
          iconColor: 'text-blue-600',
          bg: 'bg-blue-50',
        }
      case 'REJECTED':
        return {
          label: 'Ditolak',
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: XCircle,
          iconColor: 'text-red-600',
          bg: 'bg-red-50',
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Package,
          iconColor: 'text-gray-600',
          bg: 'bg-gray-50',
        }
    }
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Riwayat Peminjaman</h1>
            <p className="text-slate-500 mt-1">
              Lihat riwayat peminjaman alat yang sudah dikembalikan atau ditolak
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <FileText className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Riwayat</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.returned}</p>
                <p className="text-sm text-slate-500">Sudah Dikembalikan</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.rejected}</p>
                <p className="text-sm text-slate-500">Ditolak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Filter:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('Semua')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === 'Semua'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedCategory('RETURNED')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === 'RETURNED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Dikembalikan
            </button>
            <button
              onClick={() => setSelectedCategory('REJECTED')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedCategory === 'REJECTED'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Ditolak
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat riwayat...</p>
          </div>
        ) : filteredLoans.length > 0 ? (
          /* History Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLoans.map((loan) => {
              const statusConfig = getStatusConfig(loan.status)
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={loan.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    {loan.equipment?.image ? (
                      <img
                        src={loan.equipment.image}
                        alt={loan.equipment.nama}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.color} backdrop-blur-sm bg-white/90`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                    {/* Category Badge */}
                    {loan.equipment?.kategori?.nama && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200">
                          {loan.equipment.kategori.nama}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {loan.equipment?.nama || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Package className="w-4 h-4" />
                        <span>Jumlah: {loan.jumlah} unit</span>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div className={`${statusConfig.bg} rounded-xl p-4 flex items-start gap-3`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-1">{statusConfig.label}</p>
                        {loan.status === 'RETURNED' && loan.tanggal_kembali && (
                          <p className="text-sm text-slate-600">
                            Dikembalikan pada {formatDateShort(loan.tanggal_kembali)}
                          </p>
                        )}
                        {loan.status === 'REJECTED' && loan.approved_at && (
                          <p className="text-sm text-slate-600">
                            Ditolak pada {formatDateShort(loan.approved_at)}
                          </p>
                        )}
                        {loan.status === 'REJECTED' && !loan.approved_at && (
                          <p className="text-sm text-slate-600">Pengajuan ditolak</p>
                        )}
                      </div>
                    </div>

                    {/* Denda Info */}
                    {loan.status === 'RETURNED' && loan.return && loan.return.denda > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs text-red-600 mb-1 font-medium">Denda Keterlambatan</p>
                            <p className="text-xl font-bold text-red-700">
                              Rp {Number(loan.return.denda).toLocaleString('id-ID')}
                            </p>
                            {loan.return.hari_telat > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                Terlambat {loan.return.hari_telat} hari × Rp 5.000/hari
                              </p>
                            )}
                          </div>
                          {loan.return.denda_dibayar ? (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              ✓ Sudah Dibayar
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                              Belum Dibayar
                            </span>
                          )}
                        </div>
                        {loan.return.tanggal_bayar_denda && (
                          <p className="text-xs text-red-600">
                            Dibayar pada: {formatDateTime(loan.return.tanggal_bayar_denda)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Tanggal Pinjam</p>
                          <p className="font-medium text-slate-900">
                            {formatDateShort(loan.tanggal_pinjam)}
                          </p>
                        </div>
                      </div>
                      {loan.status === 'RETURNED' && loan.tanggal_kembali && (
                        <div className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-slate-400" />
                          <div className="flex-1">
                            <p className="text-slate-500">Tanggal Kembali</p>
                            <p className="font-medium text-slate-900">
                              {formatDateShort(loan.tanggal_kembali)}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Deadline</p>
                          <p className="font-medium text-slate-900">
                            {formatDateShort(loan.tanggal_deadline)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada riwayat</h3>
            <p className="text-slate-500 max-w-md">
              {selectedCategory === 'Semua'
                ? 'Anda belum memiliki riwayat peminjaman yang sudah dikembalikan atau ditolak'
                : `Tidak ada riwayat dengan status "${selectedCategory === 'RETURNED' ? 'Dikembalikan' : 'Ditolak'}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
