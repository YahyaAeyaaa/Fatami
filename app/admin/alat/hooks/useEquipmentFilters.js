/**
 * useEquipmentFilters Hook
 * Custom hook untuk mengelola filter dan search equipments
 */

import { useState, useEffect, useMemo } from 'react'

export function useEquipmentFilters(equipments, itemsPerPage = 6) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter equipments based on search query
  const filteredEquipments = useMemo(() => {
    if (!searchQuery.trim()) {
      return equipments
    }

    const query = searchQuery.toLowerCase()
    return equipments.filter(
      (eq) =>
        eq.nama.toLowerCase().includes(query) ||
        eq.kode_alat?.toLowerCase().includes(query) ||
        eq.kategori?.nama.toLowerCase().includes(query)
    )
  }, [equipments, searchQuery])

  // Pagination calculation
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredEquipments.slice(startIndex, endIndex)

    return {
      totalPages,
      currentPage,
      startIndex,
      endIndex,
      currentItems,
      totalItems: filteredEquipments.length,
    }
  }, [filteredEquipments, currentPage, itemsPerPage])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return {
    searchQuery,
    filteredEquipments,
    pagination,
    handleSearch,
    handlePageChange,
  }
}

