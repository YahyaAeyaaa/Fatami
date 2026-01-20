'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle,
  Package,
  Calendar,
  User,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import Button from '@/components/button'
import { useReturns } from './hooks'
import { generateReturnPdf } from '@/helper/returnPdf'

export default function PengembalianPage() {
  const { returns, loading, fetchReturns, approveReturn, payDenda } = useReturns()
  const [selectedFilter, setSelectedFilter] = useState('Semua') // Semua, Tepat Waktu, Terlambat

  useEffect(() => {
    fetchReturns()
  }, [fetchReturns])

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
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Check if return is late
  const isLate = (returnItem) => {
    if (!returnItem.loan?.tanggal_deadline || !returnItem.tanggal_kembali) return false
    const deadline = new Date(returnItem.loan.tanggal_deadline)
    const returnDate = new Date(returnItem.tanggal_kembali)
    // Set time to end of day for deadline comparison
    deadline.setHours(23, 59, 59, 999)
    return returnDate > deadline
  }

  // Transform returns data to match UI needs
  const transformedReturns = returns.map((returnItem) => ({
    id: returnItem.id,
    user: returnItem.loan?.user || null,
    equipment: returnItem.loan?.equipment || null,
    jumlah: returnItem.loan?.jumlah || 0,
    tanggal_pinjam: returnItem.loan?.tanggal_pinjam,
    tanggal_deadline: returnItem.loan?.tanggal_deadline,
    tanggal_kembali: returnItem.tanggal_kembali,
    kondisi_alat: returnItem.kondisi_alat,
    catatan: returnItem.catatan,
    status: returnItem.loan?.status || 'RETURNED',
    return_status: returnItem.status || 'APPROVED',
    approver: returnItem.approver || null,
    hari_telat: returnItem.hari_telat || 0,
    denda: returnItem.denda ? Number(returnItem.denda) : 0,
    denda_dibayar: returnItem.denda_dibayar || false,
    tanggal_bayar_denda: returnItem.tanggal_bayar_denda,
    raw: returnItem,
  }))

  // Filter returns
  const filteredReturns = transformedReturns.filter((returnItem) => {
    if (selectedFilter === 'Tepat Waktu') return !isLate(returnItem)
    if (selectedFilter === 'Terlambat') return isLate(returnItem)
    return true
  })

  const pendingReturns = transformedReturns.filter((r) => r.return_status === 'PENDING')

  const handleApproveReturn = async (item) => {
    try {
      const updated = await approveReturn(item.id)
      await generateReturnPdf(updated, { type: 'APPROVAL' })
      await fetchReturns()
    } catch (e) {
      console.error('Error approving return:', e)
    }
  }

  // Stats
  const stats = {
    total: transformedReturns.length,
    onTime: transformedReturns.filter((r) => !isLate(r)).length,
    late: transformedReturns.filter((r) => isLate(r)).length,
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Monitoring Pengembalian</h1>
            <p className="text-slate-500 mt-1">
              Pantau pengembalian alat yang telah dikembalikan oleh peminjam
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Pengembalian</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.onTime}</p>
                <p className="text-sm text-slate-500">Tepat Waktu</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.late}</p>
                <p className="text-sm text-slate-500">Terlambat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approval Section */}
        {pendingReturns.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Menunggu Approval Pengembalian</h2>
              <p className="text-sm text-slate-500">
                Peminjam sudah mengajukan pengembalian. Approve untuk mengembalikan status loan dan menambah stok.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingReturns.map((r) => (
                <div key={r.id} className="border border-slate-200 rounded-xl p-4 flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {r.equipment?.image ? (
                      <img
                        src={r.equipment.image}
                        alt={r.equipment.nama}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{r.equipment?.nama || '-'}</p>
                        <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{r.user?.nama || '-'}</span>
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Jumlah: {r.jumlah} unit</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-600">
                      <div>
                        <p className="text-slate-500">Dipinjam</p>
                        <p className="font-medium">{formatDateShort(r.tanggal_pinjam)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Deadline</p>
                        <p className="font-medium">{formatDateShort(r.tanggal_deadline)}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="primary"
                        size="md"
                        rounded="xl"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        onClick={() => handleApproveReturn(r)}
                        disabled={loading}
                      >
                        Approve Pengembalian (Cetak Bukti)
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">Filter:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedFilter('Semua')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === 'Semua'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedFilter('Tepat Waktu')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === 'Tepat Waktu'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Tepat Waktu
            </button>
            <button
              onClick={() => setSelectedFilter('Terlambat')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                selectedFilter === 'Terlambat'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Terlambat
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : filteredReturns.length > 0 ? (
          /* Returns Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReturns.map((returnItem) => {
              const late = isLate(returnItem)

              return (
                <div
                  key={returnItem.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    {returnItem.equipment?.image ? (
                      <img
                        src={returnItem.equipment.image}
                        alt={returnItem.equipment.nama}
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
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm bg-white/90 ${
                          late
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {late ? 'Terlambat' : 'Tepat Waktu'}
                      </span>
                    </div>
                    {/* Category Badge */}
                    {returnItem.equipment?.kategori?.nama && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-slate-700 border border-slate-200">
                          {returnItem.equipment.kategori.nama}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title & User */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {returnItem.equipment?.nama || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{returnItem.user?.nama || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Package className="w-4 h-4" />
                        <span>Jumlah: {returnItem.jumlah} unit</span>
                      </div>
                    </div>

                    {/* Status Info */}
                    <div
                      className={`rounded-xl p-4 flex items-start gap-3 ${
                        late ? 'bg-red-50' : 'bg-emerald-50'
                      }`}
                    >
                      {late ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 mb-1">
                          {late ? 'Dikembalikan Terlambat' : 'Dikembalikan Tepat Waktu'}
                        </p>
                        <p className="text-sm text-slate-600">
                          Dikembalikan pada {formatDateShort(returnItem.tanggal_kembali)}
                        </p>
                        {late && returnItem.hari_telat > 0 && (
                          <p className="text-xs text-red-700 mt-1">
                            Terlambat {returnItem.hari_telat} hari
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Denda Info */}
                    {returnItem.denda > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xs text-red-600 mb-1 font-medium">Denda Keterlambatan</p>
                            <p className="text-xl font-bold text-red-700">
                              Rp {returnItem.denda.toLocaleString('id-ID')}
                            </p>
                            {returnItem.hari_telat > 0 && (
                              <p className="text-xs text-red-600 mt-1">
                                {returnItem.hari_telat} hari × Rp 5.000/hari
                              </p>
                            )}
                          </div>
                          {returnItem.denda_dibayar ? (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              ✓ Sudah Dibayar
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                              Belum Dibayar
                            </span>
                          )}
                        </div>
                        {returnItem.tanggal_bayar_denda && (
                          <p className="text-xs text-red-600">
                            Dibayar pada: {formatDateTime(returnItem.tanggal_bayar_denda)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Pay Denda Button */}
                    {returnItem.denda > 0 && !returnItem.denda_dibayar && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          rounded="xl"
                          onClick={async () => {
                            try {
                              await payDenda(returnItem.id)
                              await fetchReturns()
                            } catch (error) {
                              // Error already handled by hook
                            }
                          }}
                          className="w-full"
                        >
                          Konfirmasi Pembayaran Denda
                        </Button>
                      </div>
                    )}

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Tanggal Pinjam</p>
                          <p className="font-medium text-slate-900">
                            {formatDateShort(returnItem.tanggal_pinjam)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Deadline</p>
                          <p className="font-medium text-slate-900">
                            {formatDateShort(returnItem.tanggal_deadline)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Tanggal Kembali</p>
                          <p className="font-medium text-slate-900">
                            {formatDateShort(returnItem.tanggal_kembali)}
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
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada data pengembalian</h3>
            <p className="text-slate-500 max-w-md">
              {selectedFilter === 'Semua'
                ? 'Belum ada alat yang dikembalikan'
                : `Tidak ada pengembalian dengan status "${selectedFilter}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
