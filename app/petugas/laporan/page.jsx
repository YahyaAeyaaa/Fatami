'use client'

import { useEffect, useRef } from 'react'
import {
  FileText,
  Loader2,
  CheckCircle,
  Clock,
  FileSpreadsheet,
} from 'lucide-react'
import Button from '@/components/button'
import Input from '@/components/InputForm'
import { Dropdown } from '@/components/dropdown'
import { useLaporan } from './hooks'

export default function LaporanPage() {
  const {
    filteredData,
    loading,
    reportType,
    setReportType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fetchData,
    exportToPDF,
    exportToExcel,
    formatDate,
    formatDateShort,
    stats,
  } = useLaporan()

  const printRef = useRef(null)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const reportTypeOptions = [
    { value: 'PINJAMAN', label: 'Laporan Peminjaman' },
    { value: 'PENGEMBALIAN', label: 'Laporan Pengembalian' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Laporan</h1>
            <p className="text-slate-500 mt-1">
              Cetak laporan data peminjaman dan pengembalian alat
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={exportToPDF}
              variant="primary"
              size="md"
              className="flex items-center gap-2"
              disabled={filteredData.length === 0 || loading}
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              onClick={exportToExcel}
              variant="primary"
              size="md"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              disabled={filteredData.length === 0 || loading}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipe Laporan
              </label>
              <Dropdown
                options={reportTypeOptions}
                value={reportType}
                onChange={(value) => setReportType(value)}
                placeholder="Pilih Tipe Laporan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Mulai
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Akhir
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchData}
              variant="outline"
              size="md"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                <p className="text-sm text-slate-500">Total Data</p>
              </div>
            </div>
          </div>
          {reportType === 'PINJAMAN' && (
            <>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.borrowed}</p>
                    <p className="text-sm text-slate-500">Sedang Dipinjam</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stats.returned}</p>
                    <p className="text-sm text-slate-500">Sudah Dikembalikan</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Report Content */}
        <div ref={printRef} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
              <p className="text-slate-500">Memuat data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="p-6">
              {/* Report Header */}
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {reportType === 'PINJAMAN' ? 'Laporan Peminjaman Alat' : 'Laporan Pengembalian Alat'}
                </h2>
                <p className="text-slate-600">
                  Periode: {formatDate(startDate)} - {formatDate(endDate)}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Dicetak pada: {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Report Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {reportType === 'PINJAMAN' ? 'Tanggal Pinjam' : 'Tanggal Kembali'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Peminjam
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Alat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Jumlah
                      </th>
                      {reportType === 'PINJAMAN' && (
                        <>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Deadline
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Status
                          </th>
                        </>
                      )}
                      {reportType === 'PENGEMBALIAN' && (
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Catatan
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {reportType === 'PINJAMAN'
                      ? filteredData.map((loan, index) => (
                          <tr key={loan.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {formatDateShort(loan.tanggal_pinjam)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              <div>{loan.user?.nama || '-'}</div>
                              <div className="text-xs text-slate-500">@{loan.user?.username || '-'}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              <div>{loan.equipment?.nama || '-'}</div>
                              <div className="text-xs text-slate-500">
                                {loan.equipment?.kategori?.nama || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {loan.jumlah} unit
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {formatDateShort(loan.tanggal_deadline)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  loan.status === 'BORROWED'
                                    ? 'bg-blue-100 text-blue-700'
                                    : loan.status === 'RETURNED'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {loan.status === 'BORROWED'
                                  ? 'Dipinjam'
                                  : loan.status === 'RETURNED'
                                  ? 'Dikembalikan'
                                  : loan.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      : filteredData.map((returnItem, index) => (
                          <tr key={returnItem.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {formatDateShort(returnItem.tanggal_kembali || returnItem.created_at)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              <div>{returnItem.loan?.user?.nama || '-'}</div>
                              <div className="text-xs text-slate-500">
                                @{returnItem.loan?.user?.username || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              <div>{returnItem.loan?.equipment?.nama || '-'}</div>
                              <div className="text-xs text-slate-500">
                                {returnItem.loan?.equipment?.kategori?.nama || '-'}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-900">
                              {returnItem.loan?.jumlah || 0} unit
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-900">
                              {returnItem.catatan || '-'}
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              {/* Report Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 text-sm text-slate-600">
                <p>
                  Total: <strong>{filteredData.length}</strong> {reportType === 'PINJAMAN' ? 'peminjaman' : 'pengembalian'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="w-16 h-16 text-slate-400 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada data</h3>
              <p className="text-slate-500 max-w-md">
                {startDate && endDate
                  ? 'Tidak ada data pada periode yang dipilih. Coba ubah filter tanggal.'
                  : 'Pilih tanggal mulai dan tanggal akhir untuk melihat laporan'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
