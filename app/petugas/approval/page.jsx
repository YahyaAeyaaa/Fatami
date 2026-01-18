'use client'

import { useState, useEffect } from 'react'
import {
  Clock,
  Package,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Loader2,
} from 'lucide-react'
import Button from '@/components/button'
import { ModalDelete } from '@/components/modaldelet'
import { useLoans } from './hooks'

export default function ApprovalPage() {
  const { loans, loading, fetchLoans, approveLoan, rejectLoan } = useLoans()
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Filter hanya pinjaman dengan status PENDING
  const pendingLoans = loans.filter((loan) => loan.status === 'PENDING')

  const handleCardClick = (loan) => {
    setSelectedLoan(loan)
    setShowDetailModal(true)
  }

  const handleApprove = async () => {
    if (!selectedLoan) return

    setIsApproving(true)

    try {
      await approveLoan(selectedLoan.id)
      setShowDetailModal(false)
      setSelectedLoan(null)
    } catch (error) {
      // Error already handled by hook
      console.error('Error approving loan:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleRejectClick = () => {
    setShowRejectModal(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedLoan) return

    setIsRejecting(true)

    try {
      await rejectLoan(selectedLoan.id)
      setShowRejectModal(false)
      setShowDetailModal(false)
      setSelectedLoan(null)
    } catch (error) {
      // Error already handled by hook
      console.error('Error rejecting loan:', error)
    } finally {
      setIsRejecting(false)
    }
  }

  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const isStockAvailable = (loan) => {
    return loan.equipment?.stok >= loan.jumlah
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Approval Peminjaman</h1>
            <p className="text-slate-500 mt-1">
              Tinjau dan setujui pengajuan peminjaman alat yang masuk
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm text-slate-600">
            <Clock className="w-4 h-4" />
            <span>{pendingLoans.length} pengajuan menunggu</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
            <p className="text-slate-500">Memuat data...</p>
          </div>
        ) : pendingLoans.length > 0 ? (
          /* Pending Loans Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingLoans.map((loan) => {
              const stockAvailable = isStockAvailable(loan)

              return (
                <div
                  key={loan.id}
                  onClick={() => handleCardClick(loan)}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Image Header */}
                  <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                    {loan.equipment?.image ? (
                      <img
                        src={loan.equipment.image}
                        alt={loan.equipment.nama}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
                      <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 backdrop-blur-sm bg-white/90">
                        Menunggu Approval
                      </span>
                    </div>
                    {/* Stock Warning */}
                    {!stockAvailable && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-100 text-red-700 border border-red-200 backdrop-blur-sm">
                          Stok Tidak Cukup
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Title & User */}
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        {loan.equipment?.nama || 'N/A'}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                        <User className="w-4 h-4" />
                        <span>{loan.user?.nama || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Package className="w-4 h-4" />
                        <span>Jumlah: {loan.jumlah} unit</span>
                        <span>•</span>
                        <span>Stok: {loan.equipment?.stok || 0} unit</span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
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
              <CheckCircle className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada pengajuan pending</h3>
            <p className="text-slate-500 max-w-md">Semua pengajuan peminjaman sudah ditinjau</p>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedLoan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-slate-900">Detail Pengajuan Peminjaman</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedLoan(null)
                  }}
                  disabled={isApproving || isRejecting}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    {selectedLoan.equipment?.image ? (
                      <img
                        src={selectedLoan.equipment.image}
                        alt={selectedLoan.equipment.nama}
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
                        {selectedLoan.equipment?.nama || 'N/A'}
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        {selectedLoan.equipment?.kategori?.nama || '-'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Peminjam</p>
                          <p className="font-medium text-slate-900">
                            {selectedLoan.user?.nama || 'N/A'}
                          </p>
                          {selectedLoan.user?.email && (
                            <p className="text-sm text-slate-600">{selectedLoan.user.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Package className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-500">Jumlah & Stok</p>
                          <div className="flex items-center gap-4 mt-1">
                            <p className="font-medium text-slate-900">
                              Diminta: {selectedLoan.jumlah} unit
                            </p>
                            <span className="text-slate-300">•</span>
                            <p
                              className={`font-medium ${
                                isStockAvailable(selectedLoan) ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              Stok: {selectedLoan.equipment?.stok || 0} unit
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tanggal Pinjam</p>
                    <p className="font-medium text-slate-900">
                      {formatDateShort(selectedLoan.tanggal_pinjam)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Deadline Pengembalian</p>
                    <p className="font-medium text-slate-900">
                      {formatDateShort(selectedLoan.tanggal_deadline)}
                    </p>
                  </div>
                </div>

                {/* Stock Warning */}
                {!isStockAvailable(selectedLoan) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900 mb-1">Stok Tidak Mencukupi</p>
                      <p className="text-sm text-red-800">
                        Stok tersedia ({selectedLoan.equipment?.stok || 0} unit) tidak mencukupi untuk
                        jumlah yang diminta ({selectedLoan.jumlah} unit). Anda dapat menolak pengajuan
                        ini atau menunggu stok tersedia.
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    rounded="xl"
                    onClick={() => {
                      setShowDetailModal(false)
                      setSelectedLoan(null)
                    }}
                    disabled={isApproving || isRejecting}
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    rounded="xl"
                    onClick={handleRejectClick}
                    disabled={isApproving || isRejecting}
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>Tolak</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    rounded="xl"
                    onClick={handleApprove}
                    disabled={isApproving || isRejecting || !isStockAvailable(selectedLoan)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 disabled:bg-emerald-400"
                  >
                    {isApproving ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Menyetujui...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Setujui Peminjaman</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Confirmation Modal */}
        <ModalDelete
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleRejectConfirm}
          title="Tolak Pengajuan Peminjaman"
          message="Apakah Anda yakin ingin menolak pengajuan peminjaman ini? Tindakan ini tidak dapat dibatalkan."
          itemName={
            selectedLoan
              ? `${selectedLoan.equipment?.nama || 'N/A'} - ${selectedLoan.user?.nama || 'N/A'}`
              : ''
          }
          confirmText="Tolak Peminjaman"
          cancelText="Batal"
          isLoading={isRejecting}
        />
      </div>
    </div>
  )
}

