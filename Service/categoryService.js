/**
 * Category API Service
 * Service khusus untuk Category API endpoints
 */

import { get, post, put, del } from './api'

/**
 * Get all categories
 */
export async function getCategories() {
  const { data } = await get('/api/categories')
  return data
}

/**
 * Get category by ID
 */
export async function getCategoryById(id) {
  const { data } = await get(`/api/categories/${id}`)
  return data
}

/**
 * Create new category
 */
export async function createCategory(categoryData) {
  const { data } = await post('/api/categories', categoryData)
  return data
}

/**
 * Update category by ID
 */
export async function updateCategory(id, categoryData) {
  const { data } = await put(`/api/categories/${id}`, categoryData)
  return data
}

/**
 * Delete category by ID
 */
export async function deleteCategory(id) {
  await del(`/api/categories/${id}`)
  return true
}

export default {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}

