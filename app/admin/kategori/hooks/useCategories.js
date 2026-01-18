/**
 * useCategories Hook
 * Custom hook untuk mengelola logic CRUD categories
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as categoryService from '@/Service/categoryService'

export function useCategories() {
  const toast = useToast()
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

  /**
   * Create new category
   */
  const createCategory = useCallback(
    async (categoryData) => {
      try {
        setError(null)
        const newCategory = await categoryService.createCategory(categoryData)
        
        // Update local state
        setCategories((prev) => [newCategory, ...prev])
        
        toast.success('Berhasil!', 'Kategori berhasil ditambahkan')
        return newCategory
      } catch (err) {
        const errorMessage = err.message || 'Failed to create category'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error creating category:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Update category
   */
  const updateCategory = useCallback(
    async (id, categoryData) => {
      try {
        setError(null)
        const updatedCategory = await categoryService.updateCategory(id, categoryData)
        
        // Update local state
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updatedCategory : cat))
        )
        
        toast.success('Berhasil!', 'Kategori berhasil diupdate')
        return updatedCategory
      } catch (err) {
        const errorMessage = err.message || 'Failed to update category'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error updating category:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Delete category
   */
  const deleteCategory = useCallback(
    async (id) => {
      try {
        setError(null)
        await categoryService.deleteCategory(id)
        
        // Update local state
        setCategories((prev) => prev.filter((cat) => cat.id !== id))
        
        toast.success('Berhasil!', 'Kategori berhasil dihapus')
        return true
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete category'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error deleting category:', err)
        throw err
      }
    },
    [toast]
  )

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
}

