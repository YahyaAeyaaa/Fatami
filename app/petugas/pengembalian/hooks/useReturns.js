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

  return {
    returns,
    loading,
    error,
    fetchReturns,
  }
}

