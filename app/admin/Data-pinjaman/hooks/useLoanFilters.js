/**
 * useLoanFilters Hook (for Admin Data Pinjaman)
 * Custom hook untuk filtering loans
 */

import { useMemo } from 'react'

export function useLoanFilters(loans, searchQuery, statusFilter) {
  // Filter loans based on status and search
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesStatus = statusFilter === 'ALL' || statusFilter === loan.status

      const matchesSearch =
        !searchQuery ||
        loan.user?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.equipment?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.equipment?.kode_alat?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [loans, searchQuery, statusFilter])

  // Get stats
  const stats = useMemo(() => {
    const pendingLoans = loans.filter((loan) => loan.status === 'PENDING')
    const borrowedLoans = loans.filter((loan) => loan.status === 'BORROWED')
    const activeLoans = loans

    return {
      pending: pendingLoans.length,
      borrowed: borrowedLoans.length,
      total: activeLoans.length,
    }
  }, [loans])

  return {
    filteredLoans,
    stats,
  }
}

