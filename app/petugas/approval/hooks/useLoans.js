/**
 * useLoans Hook (for Petugas)
 * Custom hook untuk mengelola logic loans untuk petugas approval
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as loanService from '@/Service/loanService'
import * as loanApprovalService from '@/Service/loanApprovalService'

export function useLoans() {
  const toast = useToast()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all loans (petugas can see all loans)
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
   * Approve loan
   */
  const approveLoan = useCallback(
    async (loanId) => {
      try {
        setError(null)
        const updatedLoan = await loanApprovalService.approveLoan(loanId)

        // Update local state - remove from pending list
        setLoans((prev) => prev.filter((loan) => loan.id !== loanId))

        toast.success('Berhasil!', 'Peminjaman berhasil disetujui')
        return updatedLoan
      } catch (err) {
        const errorMessage = err.message || 'Failed to approve loan'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error approving loan:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Reject loan
   */
  const rejectLoan = useCallback(
    async (loanId) => {
      try {
        setError(null)
        await loanApprovalService.rejectLoan(loanId)

        // Update local state - remove from pending list
        setLoans((prev) => prev.filter((loan) => loan.id !== loanId))

        toast.success('Berhasil!', 'Peminjaman berhasil ditolak')
        return true
      } catch (err) {
        const errorMessage = err.message || 'Failed to reject loan'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error rejecting loan:', err)
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
    approveLoan,
    rejectLoan,
  }
}

