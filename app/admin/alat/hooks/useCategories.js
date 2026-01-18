/**
 * useCategories Hook (for dropdown)
 * Custom hook untuk fetch categories untuk dropdown
 */

import { useState, useEffect, useCallback } from 'react'
import * as categoryService from '@/Service/categoryService'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await categoryService.getCategories()
      setCategories(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch categories'
      setError(errorMessage)
      console.error('Error fetching categories:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
  }
}

