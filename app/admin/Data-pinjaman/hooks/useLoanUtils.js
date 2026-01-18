/**
 * useLoanUtils Hook (for Admin Data Pinjaman)
 * Utility functions untuk loans (status config, date formatting, etc)
 */

import { useMemo, useCallback } from 'react'
import { Clock, Package, CheckCircle, X } from 'lucide-react'

export function useLoanUtils() {
  /**
   * Get status configuration
   */
  const getStatusConfig = useCallback((status) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Menunggu Approval',
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
          bg: 'bg-amber-50',
        }
      case 'BORROWED':
        return {
          label: 'Sedang Dipinjam',
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: Package,
          iconColor: 'text-blue-600',
          bg: 'bg-blue-50',
        }
      case 'RETURNED':
        return {
          label: 'Sudah Dikembalikan',
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
          bg: 'bg-emerald-50',
        }
      case 'REJECTED':
        return {
          label: 'Ditolak',
          color: 'bg-red-100 text-red-700 border-red-200',
          icon: X,
          iconColor: 'text-red-600',
          bg: 'bg-red-50',
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Package,
          iconColor: 'text-gray-600',
          bg: 'bg-gray-50',
        }
    }
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
   * Calculate days until deadline
   */
  const getDaysUntilDeadline = useCallback((deadlineString) => {
    if (!deadlineString) return 0
    const deadline = new Date(deadlineString)
    const today = new Date()
    const diffTime = deadline - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }, [])

  return {
    getStatusConfig,
    formatDate,
    formatDateShort,
    getDaysUntilDeadline,
  }
}

