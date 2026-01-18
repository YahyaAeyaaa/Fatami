/**
 * useUsers Hook
 * Custom hook untuk mengelola logic CRUD users
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as userService from '@/Service/userService'

export function useUsers() {
  const toast = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all users
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getUsers()
      setUsers(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch users'
      setError(errorMessage)
      console.error('Error fetching users:', err)
      toast.error('Error', errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Create new user
   */
  const createUser = useCallback(
    async (userData) => {
      try {
        setError(null)
        const newUser = await userService.createUser(userData)

        // Update local state
        setUsers((prev) => [newUser, ...prev])

        toast.success('Berhasil!', 'User berhasil ditambahkan')
        return newUser
      } catch (err) {
        const errorMessage = err.message || 'Failed to create user'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error creating user:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Update user
   */
  const updateUser = useCallback(
    async (id, userData) => {
      try {
        setError(null)
        const updatedUser = await userService.updateUser(id, userData)

        // Update local state
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? updatedUser : user))
        )

        toast.success('Berhasil!', 'User berhasil diupdate')
        return updatedUser
      } catch (err) {
        const errorMessage = err.message || 'Failed to update user'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error updating user:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Delete user
   */
  const deleteUser = useCallback(
    async (id) => {
      try {
        setError(null)
        await userService.deleteUser(id)

        // Update local state
        setUsers((prev) => prev.filter((user) => user.id !== id))

        toast.success('Berhasil!', 'User berhasil dihapus')
        return true
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete user'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error deleting user:', err)
        throw err
      }
    },
    [toast]
  )

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}

