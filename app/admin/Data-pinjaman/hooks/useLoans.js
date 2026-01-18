/**
 * useLoans Hook (for Admin Data Pinjaman)
 * Custom hook untuk mengelola logic loans untuk admin
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as loanService from '@/Service/loanService'

export function useLoans() {
  const toast = useToast()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all loans (filter only PENDING and BORROWED for admin data pinjaman)
   */
  const fetchLoans = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loanService.getLoans()
      // Filter hanya pinjaman aktif (PENDING dan BORROWED), exclude RETURNED dan REJECTED
      const activeLoans = data.filter(
        (loan) => loan.status === 'PENDING' || loan.status === 'BORROWED'
      )
      setLoans(activeLoans)
      return activeLoans
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch loans'
      setError(errorMessage)
      console.error('Error fetching loans:', err)
      toast.error('Error', 'Gagal memuat data pinjaman')
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    loans,
    loading,
    error,
    fetchLoans,
  }
}

