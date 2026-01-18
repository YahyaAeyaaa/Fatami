/**
 * useActivityUtils Hook (for Admin Log Aktifitas)
 * Utility functions untuk activities (date formatting, labels, colors, etc)
 */

import { useCallback, useMemo } from 'react'

export function useActivityUtils() {
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
   * Format date short
   */
  const formatDateShort = useCallback((dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [])

  /**
   * Get activity type label
   */
  const getActivityTypeLabel = useCallback((type) => {
    switch (type) {
      case 'EQUIPMENT_CREATE':
        return 'Membuat Alat'
      case 'EQUIPMENT_UPDATE':
        return 'Mengubah Alat'
      case 'CATEGORY_CREATE':
        return 'Membuat Kategori'
      case 'CATEGORY_UPDATE':
        return 'Mengubah Kategori'
      case 'USER_CREATE':
        return 'Membuat User'
      case 'USER_UPDATE':
        return 'Mengubah User'
      default:
        return type
    }
  }, [])

  /**
   * Get color classes
   */
  const getColorClasses = useCallback((color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-700 border-blue-200',
      },
      emerald: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: 'text-emerald-600',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        badge: 'bg-red-100 text-red-700 border-red-200',
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
      },
    }
    return colors[color] || colors.blue
  }, [])

  /**
   * Activity options for dropdown
   */
  const activityOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Semua Aktivitas' },
      { value: 'EQUIPMENT_CREATE', label: 'Membuat Alat' },
      { value: 'EQUIPMENT_UPDATE', label: 'Mengubah Alat' },
      { value: 'CATEGORY_CREATE', label: 'Membuat Kategori' },
      { value: 'CATEGORY_UPDATE', label: 'Mengubah Kategori' },
      { value: 'USER_CREATE', label: 'Membuat User' },
      { value: 'USER_UPDATE', label: 'Mengubah User' },
    ],
    []
  )

  return {
    formatDateTime,
    formatDateShort,
    getActivityTypeLabel,
    getColorClasses,
    activityOptions,
  }
}

