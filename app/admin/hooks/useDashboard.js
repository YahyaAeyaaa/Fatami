/**
 * useDashboard Hook (for Admin)
 * Custom hook untuk mengelola logic dashboard admin
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import { get } from '@/Service/api'

export function useDashboard() {
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch admin stats
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data } = await get('/api/admin/stats')
      setStats(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch stats'
      setError(errorMessage)
      console.error('Error fetching stats:', err)
      toast.error('Error', 'Gagal memuat data dashboard')
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}

