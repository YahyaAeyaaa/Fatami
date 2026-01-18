'use client'

import { useState, useEffect } from 'react'
import {
  Package,
  Calendar,
  User,
  Search,
  CheckCircle,
  X,
  Loader2,
  Eye,
  AlertTriangle,
} from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import { Dropdown } from '@/components/dropdown'
import { useReturns, useReturnFilters, useReturnUtils } from './hooks'

export default function DataPengembalianPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedReturn, setSelectedReturn] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const { returns, loading, fetchReturns } = useReturns()
  const { filteredReturns, stats } = useReturnFilters(returns, searchQuery, statusFilter)
  const { formatDateShort, formatDate, formatDateTime, getDaysLate } = useReturnUtils()

  useEffect(() => {
    fetchReturns()
  }, [fetchReturns])

  const handleRowClick = (returnItem) => {
    setSelectedReturn(returnItem)
    setShowDetailModal(true)
  }

  const statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'ON_TIME', label: 'Tepat Waktu' },
    { value: 'LATE', label: 'Terlambat' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Data Pengembalian</h1>
            <p className="text-slate-500 mt-1">
              Data pengembalian alat yang sudah dikembalikan oleh siswa
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

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Cari nama siswa, username, atau nama alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
              rounded="lg"
              size="md"
            />
          </div>
          <div className="w-full sm:w-64">
            <Dropdown
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              placeholder="Filter Status"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : filteredReturns.length > 0 ? (
          /* Table */
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Siswa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Alat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal Pinjam
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Tanggal Kembali
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Kondisi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredReturns.map((returnItem) => {
                    const daysLate = getDaysLate(returnItem)
                    return (
                      <tr
                        key={returnItem.id}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => handleRowClick(returnItem)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">
                                {returnItem.user?.nama || 'N/A'}
                              </div>
                              <div className="text-sm text-slate-500">
                                @{returnItem.user?.username || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-slate-900">
                            {returnItem.equipment?.nama || 'N/A'}
                          </div>
                          {returnItem.equipment?.kategori && (
                            <div className="text-sm text-slate-500">
                              {returnItem.equipment.kategori.nama}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{returnItem.jumlah} unit</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDateShort(returnItem.tanggal_pinjam)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDateShort(returnItem.tanggal_deadline)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {formatDateShort(returnItem.tanggal_kembali)}
                          </div>
                          {returnItem.late && daysLate > 0 && (
                            <div className="mt-1">
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                Terlambat {daysLate} hari
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                              returnItem.late
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {returnItem.late ? 'Terlambat' : 'Tepat Waktu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {returnItem.kondisi_alat || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRowClick(returnItem)
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-[#113e59] hover:bg-slate-100 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Tidak ada pengembalian yang sesuai'
                : 'Belum ada data pengembalian'}
            </h3>
            <p className="text-slate-500 max-w-md">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Coba ubah kata kunci pencarian atau filter status'
                : 'Data pengembalian akan muncul di sini ketika ada siswa yang mengembalikan alat'}
            </p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedReturn && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">Detail Pengembalian</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedReturn(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Product & User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden">
                    {selectedReturn.equipment?.image ? (
                      <img
                        src={selectedReturn.equipment.image}
                        alt={selectedReturn.equipment.nama}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-24 h-24 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* User & Equipment Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedReturn.equipment?.nama || 'N/A'}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        {selectedReturn.equipment?.kategori?.nama || '-'}
                      </p>
                      {selectedReturn.equipment?.kode_alat && (
                        <p className="text-sm text-slate-600">
                          Kode: {selectedReturn.equipment.kode_alat}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Peminjam</p>
                          <p className="font-medium text-slate-900">
                            {selectedReturn.user?.nama || 'N/A'}
                          </p>
                          {selectedReturn.user?.username && (
                            <p className="text-sm text-slate-600">
                              @{selectedReturn.user.username}
                            </p>
                          )}
                          {selectedReturn.user?.email && (
                            <p className="text-sm text-slate-600">{selectedReturn.user.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Jumlah</p>
                          <p className="font-medium text-slate-900 mt-1">
                            {selectedReturn.jumlah} unit
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        {selectedReturn.late ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        )}
                        <div>
                          <p className="text-xs text-slate-500">Status</p>
                          <p className="font-medium text-slate-900">
                            {selectedReturn.late ? 'Terlambat' : 'Tepat Waktu'}
                          </p>
                          {selectedReturn.late && getDaysLate(selectedReturn) > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              Terlambat {getDaysLate(selectedReturn)} hari
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tanggal Pinjam</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedReturn.tanggal_pinjam)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatDateShort(selectedReturn.tanggal_pinjam)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Deadline Pengembalian</p>
                    <p className="font-medium text-slate-900">
                      {formatDate(selectedReturn.tanggal_deadline)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatDateShort(selectedReturn.tanggal_deadline)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tanggal Kembali</p>
                    <p className="font-medium text-slate-900">
                      {formatDateTime(selectedReturn.tanggal_kembali)}
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      {formatDateShort(selectedReturn.tanggal_kembali)}
                    </p>
                  </div>
                </div>

                {/* Condition & Notes */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Kondisi Alat</p>
                    <p className="font-medium text-slate-900">
                      {selectedReturn.kondisi_alat || '-'}
                    </p>
                  </div>
                  {selectedReturn.catatan && (
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs text-slate-500 mb-1">Catatan</p>
                      <p className="text-sm text-slate-900">{selectedReturn.catatan}</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    rounded="xl"
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedReturn(null)
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    Tutup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

