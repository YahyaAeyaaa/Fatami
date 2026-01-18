/**
 * useDashboard Hook (for Peminjam)
 * Custom hook untuk mengelola logic dashboard peminjam
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
   * Fetch all loans for current user
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
    const total = loans.length
    const pending = loans.filter((loan) => loan.status === 'PENDING').length
    const borrowed = loans.filter((loan) => loan.status === 'BORROWED').length
    const returned = loans.filter((loan) => loan.status === 'RETURNED').length

    return {
      total,
      pending,
      borrowed,
      returned,
    }
  }, [loans])

  /**
   * Get upcoming deadlines (only BORROWED and PENDING loans)
   */
  const upcomingDeadlines = useMemo(() => {
    const now = new Date()
    const activeLoans = loans.filter(
      (loan) => loan.status === 'BORROWED' || loan.status === 'PENDING'
    )

    return activeLoans
      .map((loan) => {
        if (!loan.tanggal_deadline) return null

        const deadline = new Date(loan.tanggal_deadline)
        const diffTime = deadline - now
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          id: loan.id,
          nama_alat: loan.equipment?.nama || 'N/A',
          tanggal_deadline: loan.tanggal_deadline,
          status: loan.status === 'BORROWED' ? 'Sedang Dipinjam' : 'Menunggu Persetujuan',
          daysLeft: diffDays,
        }
      })
      .filter((item) => item !== null)
      .sort((a, b) => {
        // Sort by days left (ascending)
        return a.daysLeft - b.daysLeft
      })
      .slice(0, 5) // Limit to 5 items
  }, [loans])

  /**
   * Format date to Indonesian format
   */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  /**
   * Format date short
   */
  const formatDateShort = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }, [])

  return {
    loans,
    loading,
    error,
    stats,
    upcomingDeadlines,
    fetchLoans,
    formatDate,
    formatDateShort,
  }
}
