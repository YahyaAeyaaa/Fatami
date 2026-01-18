/**
 * useReturns Hook
 * Custom hook untuk mengelola logic returns
 */

import { useState, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as returnService from '@/Service/returnService'

export function useReturns() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Create new return
   */
  const createReturn = useCallback(
    async (returnData) => {
      try {
        setLoading(true)
        setError(null)
        const newReturn = await returnService.createReturn(returnData)

        toast.success('Berhasil!', 'Barang berhasil dikembalikan')
        return newReturn
      } catch (err) {
        const errorMessage = err.message || 'Failed to create return'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error creating return:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [toast]
  )

  return {
    loading,
    error,
    createReturn,
  }
}

