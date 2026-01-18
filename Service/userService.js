/**
 * User API Service
 * Service khusus untuk User API endpoints
 */

import { get, post, put, del } from './api'

/**
 * Get all users
 */
export async function getUsers() {
  const { data } = await get('/api/users')
  return data
}

/**
 * Get user by ID
 */
export async function getUserById(id) {
  const { data } = await get(`/api/users/${id}`)
  return data
}

/**
 * Create new user
 */
export async function createUser(userData) {
  const { data } = await post('/api/users', userData)
  return data
}

/**
 * Update user by ID
 */
export async function updateUser(id, userData) {
  const { data } = await put(`/api/users/${id}`, userData)
  return data
}

/**
 * Delete user by ID
 */
export async function deleteUser(id) {
  await del(`/api/users/${id}`)
  return true
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

