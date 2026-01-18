/**
 * useLoans Hook
 * Custom hook untuk mengelola logic CRUD loans
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
      toast.error('Error', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Create new loan
   */
  const createLoan = useCallback(
    async (loanData) => {
      try {
        setError(null)
        const newLoan = await loanService.createLoan(loanData)

        // Update local state
        setLoans((prev) => [newLoan, ...prev])

        toast.success('Berhasil!', 'Peminjaman berhasil diajukan')
        return newLoan
      } catch (err) {
        const errorMessage = err.message || 'Failed to create loan'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error creating loan:', err)
        throw err
      }
    },
    [toast]
  )

  return {
    loans,
    loading,
    error,
    fetchLoans,
    createLoan,
  }
}

