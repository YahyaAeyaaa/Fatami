/**
 * useReturns Hook (for Admin Data Pengembalian)
 * Custom hook untuk mengelola logic returns untuk admin
 */

import { useState, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as returnService from '@/Service/returnService'

export function useReturns() {
  const toast = useToast()
  const [returns, setReturns] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all returns
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
      toast.error('Error', 'Gagal memuat data pengembalian')
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
  }
}

