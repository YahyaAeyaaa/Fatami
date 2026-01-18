/**
 * useReturnUtils Hook (for Admin Data Pengembalian)
 * Utility functions untuk returns (date formatting, late calculation, etc)
 */

import { useCallback } from 'react'

export function useReturnUtils() {
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

  /**
   * Format date to long format
   */
  const formatDate = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [])

  /**
   * Format date time
   */
  const formatDateTime = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  /**
   * Calculate days late
   */
  const getDaysLate = useCallback((returnItem) => {
    if (!returnItem.loan?.tanggal_deadline || !returnItem.tanggal_kembali) return 0
    const deadline = new Date(returnItem.loan.tanggal_deadline)
    const returnDate = new Date(returnItem.tanggal_kembali)
    deadline.setHours(23, 59, 59, 999)
    const diffTime = returnDate - deadline
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [])

  return {
    formatDateShort,
    formatDate,
    formatDateTime,
    getDaysLate,
  }
}

