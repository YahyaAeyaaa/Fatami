/**
 * useUserFilters Hook
 * Custom hook untuk mengelola filtering dan searching users
 */

import { useState, useMemo } from 'react'

export function useUserFilters(users) {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  /**
   * Filter users berdasarkan search query dan role
   */
  const filteredUsers = useMemo(() => {
    let filtered = users || []

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(query) ||
          user.nama?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
      )
    }

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    return filtered
  }, [users, searchQuery, roleFilter])

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    filteredUsers,
  }
}

