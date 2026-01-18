/**
 * useReturnFilters Hook (for Admin Data Pengembalian)
 * Custom hook untuk filtering dan transform returns
 */

import { useMemo, useCallback } from 'react'

/**
 * Check if return is late
 */
const isLate = (returnItem) => {
  if (!returnItem.loan?.tanggal_deadline || !returnItem.tanggal_kembali) return false
  const deadline = new Date(returnItem.loan.tanggal_deadline)
  const returnDate = new Date(returnItem.tanggal_kembali)
  // Set time to end of day for deadline comparison
  deadline.setHours(23, 59, 59, 999)
  return returnDate > deadline
}

export function useReturnFilters(returns, searchQuery, statusFilter) {
  // Transform returns data to match UI needs
  const transformedReturns = useMemo(() => {
    return returns.map((returnItem) => ({
      id: returnItem.id,
      user: returnItem.loan?.user || null,
      equipment: returnItem.loan?.equipment || null,
      jumlah: returnItem.loan?.jumlah || 0,
      tanggal_pinjam: returnItem.loan?.tanggal_pinjam,
      tanggal_deadline: returnItem.loan?.tanggal_deadline,
      tanggal_kembali: returnItem.tanggal_kembali,
      kondisi_alat: returnItem.kondisi_alat,
      catatan: returnItem.catatan,
      status: returnItem.loan?.status || 'RETURNED',
      late: isLate(returnItem),
    }))
  }, [returns])

  // Filter returns based on status and search
  const filteredReturns = useMemo(() => {
    return transformedReturns.filter((returnItem) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ON_TIME' && !returnItem.late) ||
        (statusFilter === 'LATE' && returnItem.late)

      const matchesSearch =
        !searchQuery ||
        returnItem.user?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnItem.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnItem.equipment?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        returnItem.equipment?.kode_alat?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [transformedReturns, searchQuery, statusFilter])

  // Stats
  const stats = useMemo(() => {
    return {
      total: transformedReturns.length,
      onTime: transformedReturns.filter((r) => !r.late).length,
      late: transformedReturns.filter((r) => r.late).length,
    }
  }, [transformedReturns])

  return {
    transformedReturns,
    filteredReturns,
    stats,
  }
}

