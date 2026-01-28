'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  CheckCircle,
  Package,
  Calendar,
  AlertCircle,
  ArrowRight,
  X,
  Loader2,
} from 'lucide-react'
import Button from '@/components/button'
import { useLoans, useReturns } from './hooks'
import { generateApprovalPdf } from '@/helper/approvalPdf'
import { generateReturnPdf } from '@/helper/returnPdf'

export default function PinjamanPage() {
  const { loans, loading, fetchLoans } = useLoans()
  const { loading: returning, createReturn } = useReturns()
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Filter hanya pinjaman yang aktif (PENDING, APPROVED, BORROWED) - exclude RETURNED dan REJECTED
  const activeLoans = loans.filter(
    (loan) =>
      loan.status === 'PENDING' ||
      loan.status === 'APPROVED' ||
      loan.status === 'BORROWED'
  )

  const getStatusConfig = (loan) => {
    // Jika sudah ada pengajuan pengembalian, tampilkan status khusus (tanpa ubah LoanStatus di DB)
    if (loan?.status === 'BORROWED' && loan?.return?.status === 'PENDING') {
      return {
        label: 'Menunggu Approval Pengembalian',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600',
        bg: 'bg-amber-50',
      }
    }

    switch (loan?.status) {
      case 'PENDING':
        return {
          label: 'Menunggu Approval',
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
          bg: 'bg-amber-50',
        }
      case 'APPROVED':
        return {
          label: 'Disetujui - Menunggu Pengambilan',
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
          bg: 'bg-emerald-50',
        }
      case 'BORROWED':
        return {
          label: 'Sedang Dipinjam',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: Package,
          iconColor: 'text-blue-600',
          bg: 'bg-blue-50',
        }
      default:
        return {
          label: loan?.status,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Package,
          iconColor: 'text-gray-600',
          bg: 'bg-gray-50',
        }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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

  const getDaysUntilDeadline = (deadlineString) => {
    if (!deadlineString) return 0
    const deadlineRaw = new Date(deadlineString)
    const todayRaw = new Date()

    const deadline = new Date(
      deadlineRaw.getFullYear(),
      deadlineRaw.getMonth(),
      deadlineRaw.getDate()
    )
    const today = new Date(
      todayRaw.getFullYear(),
      todayRaw.getMonth(),
      todayRaw.getDate()
    )

    const diffTime = deadline - today
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleKembalikan = (loan) => {
    if (loan.status !== 'BORROWED') {
      return
    }
    // Kalau sudah pernah mengajukan pengembalian, jangan buka modal lagi
    if (loan.return?.status === 'PENDING') {
      return
    }
    setSelectedLoan(loan)
    setShowConfirmModal(true)
  }

  const handleConfirmReturn = async () => {
    if (!selectedLoan) return

    try {
      const created = await createReturn({
        loan_id: selectedLoan.id,
        kondisi_alat: 'Baik', // Default, bisa dikembangkan lebih lanjut
        catatan: '',
      })

      // Otomatis download PDF pengajuan pengembalian (menunggu approval petugas)
      await generateReturnPdf(created, { type: 'REQUEST' })

      // Refresh loans
      await fetchLoans()

      setShowConfirmModal(false)
      setSelectedLoan(null)
    } catch (error) {
      // Error already handled by hook
      console.error('Error returning loan:', error)
    }
  }

  const handleDownloadApproval = async (loan) => {
    try {
      await generateApprovalPdf(loan, { printedByRole: 'PEMINJAM' })
    } catch (error) {
      console.error('Error generating approval PDF:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Pinjaman Saya</h1>
            <p className="text-slate-500 mt-1">
              Kelola pinjaman Anda yang sedang menunggu approval atau sedang dipinjam
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activeLoans.filter((l) => l.status === 'PENDING').length}
                </p>
                <p className="text-sm text-slate-500">Menunggu Approval</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activeLoans.filter((l) => l.status === 'BORROWED').length}
                </p>
                <p className="text-sm text-slate-500">Sedang Dipinjam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : activeLoans.length > 0 ? (
          /* Loans Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeLoans.map((loan) => {
              const statusConfig = getStatusConfig(loan)
              const StatusIcon = statusConfig.icon
              const daysUntilDeadline = getDaysUntilDeadline(loan.tanggal_deadline)

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
                    {loan.equipment?.kategori && (
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
                        {loan.status === 'PENDING' && (
                          <p className="text-sm text-slate-600">
                            Pengajuan Anda sedang ditinjau oleh petugas
                          </p>
                        )}
                        {loan.status === 'APPROVED' && (
                          <p className="text-sm text-slate-600">
                            Pengajuan Anda telah disetujui. Silakan datang ke ruang petugas
                            membawa bukti approval untuk mengambil alat.
                          </p>
                        )}
                        {loan.status === 'BORROWED' && loan.approved_at && (
                          <p className="text-sm text-slate-600">
                            Disetujui pada {formatDateShort(loan.approved_at)}
                          </p>
                        )}
                        {loan.status === 'BORROWED' && loan.return?.status === 'PENDING' && (
                          <p className="text-sm text-slate-600">
                            Pengajuan pengembalian sudah dikirim dan sedang menunggu approval petugas
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Tanggal Pinjam</p>
                          <p className="font-medium text-slate-900">{formatDateShort(loan.tanggal_pinjam)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-slate-500">Deadline Pengembalian</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">
                              {formatDateShort(loan.tanggal_deadline)}
                            </p>
                            {daysUntilDeadline > 0 && daysUntilDeadline <= 3 && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                                {daysUntilDeadline} hari lagi
                              </span>
                            )}
                            {daysUntilDeadline < 0 && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                Melewati deadline
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    {loan.status === 'BORROWED' && loan.return?.status !== 'PENDING' && (
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleKembalikan(loan)}
                          disabled={returning}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span>Kembalikan Alat</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Download Bukti Approval */}
                    {loan.status === 'APPROVED' && (
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleDownloadApproval(loan)}
                          className="w-full flex items-center justify-center gap-2 border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold py-3 px-4 rounded-xl transition-colors"
                        >
                          <span>Download Bukti Approval (PDF)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada pinjaman aktif</h3>
            <p className="text-slate-500 max-w-md">
              Anda belum memiliki pinjaman yang sedang menunggu approval atau sedang dipinjam
            </p>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedLoan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
              {/* Modal Header */}
              <div className="border-b border-slate-200 p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Konfirmasi Pengembalian</h2>
                <button
                  onClick={() => {
                    setShowConfirmModal(false)
                    setSelectedLoan(null)
                  }}
                  disabled={returning}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                    {selectedLoan.equipment?.image ? (
                      <img
                        src={selectedLoan.equipment.image}
                        alt={selectedLoan.equipment.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{selectedLoan.equipment?.nama || 'N/A'}</p>
                    <p className="text-sm text-slate-600">Jumlah: {selectedLoan.jumlah} unit</p>
                  </div>
                </div>

                {/* Confirmation Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pengajuan pengembalian akan menunggu approval</p>
                    <p>Stok alat akan bertambah setelah petugas menyetujui pengembalian.</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    rounded="xl"
                    onClick={() => {
                      setShowConfirmModal(false)
                      setSelectedLoan(null)
                    }}
                    disabled={returning}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    rounded="xl"
                    onClick={handleConfirmReturn}
                    disabled={returning}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400"
                  >
                    {returning ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Mengembalikan...</span>
                      </div>
                    ) : (
                      'Konfirmasi Pengembalian'
                    )}
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
