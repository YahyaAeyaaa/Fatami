/**
 * useDashboard Hook (for Petugas)
 * Custom hook untuk mengelola logic dashboard petugas
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useToast } from '@/components/Toats'
import * as loanService from '@/Service/loanService'

export function useDashboard() {
  const toast = useToast()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all loans
   */
  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loanService.getLoans()
      setLoans(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch loans'
      setError(errorMessage)
      console.error('Error fetching loans:', err)
      toast.error('Error', 'Gagal memuat data dashboard')
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Calculate statistics from loans
   */
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Menunggu Approval (PENDING)
    const pending = loans.filter((loan) => loan.status === 'PENDING').length

    // Disetujui Hari Ini (APPROVED/BORROWED yang approved_at hari ini)
    const approvedToday = loans.filter((loan) => {
      if (!loan.approved_at) return false
      const approvedDate = new Date(loan.approved_at)
      approvedDate.setHours(0, 0, 0, 0)
      return approvedDate.getTime() === today.getTime()
    }).length

    // Sedang Dipinjam (BORROWED)
    const borrowed = loans.filter((loan) => loan.status === 'BORROWED').length

    // Ditolak Hari Ini (REJECTED yang rejected_at hari ini)
    const rejectedToday = loans.filter((loan) => {
      if (loan.status !== 'REJECTED') return false
      // Jika tidak ada rejected_at, cek updated_at
      const rejectedDate = new Date(loan.updated_at || loan.created_at)
      rejectedDate.setHours(0, 0, 0, 0)
      return rejectedDate.getTime() === today.getTime()
    }).length

    return {
      pending,
      approvedToday,
      borrowed,
      rejectedToday,
    }
  }, [loans])

  /**
   * Get pending loans (limit 5)
   */
  const pendingLoans = useMemo(() => {
    return loans
      .filter((loan) => loan.status === 'PENDING')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5)
  }, [loans])

  /**
   * Format date to short format
   */
  const formatDateShort = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }, [])

  return {
    loans,
    loading,
    error,
    stats,
    pendingLoans,
    fetchLoans,
    formatDateShort,
  }
}

