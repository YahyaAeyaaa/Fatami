/**
 * useReturns Hook (for Petugas)
 * Custom hook untuk mengelola logic returns untuk petugas monitoring
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as returnService from '@/Service/returnService'

export function useReturns() {
  const toast = useToast()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all returns (petugas can see all returns)
   */
  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await returnService.getReturns()
      setReturns(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch returns'
      setError(errorMessage)
      console.error('Error fetching returns:', err)
      toast.error('Error', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Pay denda for a return
   */
  const payDenda = useCallback(async (returnId) => {
    try {
      setLoading(true)
      const updatedReturn = await returnService.payDenda(returnId)
      
      // Update returns list
      setReturns((prevReturns) =>
        prevReturns.map((r) => (r.id === returnId ? updatedReturn : r))
      )
      
      toast.success('Berhasil', 'Denda berhasil dibayar')
      return updatedReturn
    } catch (err) {
      const errorMessage = err.message || 'Failed to pay denda'
      console.error('Error paying denda:', err)
      toast.error('Error', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Approve return request (petugas)
   */
  const approveReturn = useCallback(async (returnId) => {
    try {
      setLoading(true)
      const updatedReturn = await returnService.approveReturn(returnId)

      setReturns((prevReturns) =>
        prevReturns.map((r) => (r.id === returnId ? updatedReturn : r))
      )

      toast.success('Berhasil', 'Pengembalian berhasil di-approve')
      return updatedReturn
    } catch (err) {
      const errorMessage = err.message || 'Failed to approve return'
      console.error('Error approving return:', err)
      toast.error('Error', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    returns,
    loading,
    error,
    fetchReturns,
    approveReturn,
    payDenda,
  }
}

