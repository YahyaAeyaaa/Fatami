/**
 * useCategoryFilters Hook
 * Custom hook untuk mengelola filter dan search categories
 */

import { useState, useEffect, useMemo } from 'react'

export function useCategoryFilters(categories, itemsPerPage = 5) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories
    }

    const query = searchQuery.toLowerCase()
    return categories.filter(
      (cat) =>
        cat.nama.toLowerCase().includes(query) ||
        (cat.deskripsi && cat.deskripsi.toLowerCase().includes(query))
    )
  }, [categories, searchQuery])

  // Pagination calculation
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filteredCategories.slice(startIndex, endIndex)

    return {
      totalPages,
      currentPage,
      startIndex,
      endIndex,
      currentItems,
      totalItems: filteredCategories.length,
    }
  }, [filteredCategories, currentPage, itemsPerPage])

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
    filteredCategories,
    pagination,
    handleSearch,
    handlePageChange,
  }
}

