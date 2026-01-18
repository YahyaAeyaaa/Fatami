/**
 * useActivities Hook (for Admin Log Aktifitas)
 * Custom hook untuk mengelola logic activities untuk admin
 */

import { useState, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import { getEquipments } from '@/Service/equipmentService'
import { getCategories } from '@/Service/categoryService'
import { getUsers } from '@/Service/userService'
import { Plus, Edit2 } from 'lucide-react'

export function useActivities() {
  const toast = useToast()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch and build activities from Equipment, Category, and User data
   */
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all admin data in parallel
      const [equipmentsData, categoriesData, usersData] = await Promise.all([
        getEquipments().catch(() => []),
        getCategories().catch(() => []),
        getUsers().catch(() => []),
      ])

      const allActivities = []

      // Build activities from Equipment
      equipmentsData.forEach((equipment) => {
        // Equipment creation
        allActivities.push({
          id: `equipment-create-${equipment.id}`,
          type: 'EQUIPMENT_CREATE',
          title: 'Membuat Alat',
          description: `Membuat alat baru: ${equipment.nama}`,
          target: equipment,
          targetType: 'EQUIPMENT',
          timestamp: equipment.created_at,
          data: { equipment },
          icon: Plus,
          color: 'emerald',
        })

        // Equipment update (if updated_at is different from created_at)
        if (
          new Date(equipment.updated_at).getTime() !== new Date(equipment.created_at).getTime()
        ) {
          allActivities.push({
            id: `equipment-update-${equipment.id}`,
            type: 'EQUIPMENT_UPDATE',
            title: 'Mengubah Alat',
            description: `Mengubah data alat: ${equipment.nama}`,
            target: equipment,
            targetType: 'EQUIPMENT',
            timestamp: equipment.updated_at,
            data: { equipment },
            icon: Edit2,
            color: 'blue',
          })
        }
      })

      // Build activities from Category
      categoriesData.forEach((category) => {
        // Category creation
        allActivities.push({
          id: `category-create-${category.id}`,
          type: 'CATEGORY_CREATE',
          title: 'Membuat Kategori',
          description: `Membuat kategori baru: ${category.nama}`,
          target: category,
          targetType: 'CATEGORY',
          timestamp: category.created_at,
          data: { category },
          icon: Plus,
          color: 'emerald',
        })

        // Category update (if updated_at is different from created_at)
        if (
          new Date(category.updated_at).getTime() !== new Date(category.created_at).getTime()
        ) {
          allActivities.push({
            id: `category-update-${category.id}`,
            type: 'CATEGORY_UPDATE',
            title: 'Mengubah Kategori',
            description: `Mengubah data kategori: ${category.nama}`,
            target: category,
            targetType: 'CATEGORY',
            timestamp: category.updated_at,
            data: { category },
            icon: Edit2,
            color: 'blue',
          })
        }
      })

      // Build activities from User
      usersData.forEach((user) => {
        // User creation
        allActivities.push({
          id: `user-create-${user.id}`,
          type: 'USER_CREATE',
          title: 'Membuat User',
          description: `Membuat user baru: ${user.nama} (${user.role})`,
          target: user,
          targetType: 'USER',
          timestamp: user.created_at,
          data: { user },
          icon: Plus,
          color: 'emerald',
        })

        // User update (if updated_at is different from created_at)
        // Note: We can't track individual updates precisely without knowing who made the change
        // But we can show it if updated_at differs from created_at
        if (new Date(user.created_at).getTime() < new Date(user.updated_at).getTime() - 1000) {
          // Allow 1 second tolerance for timestamp precision
          allActivities.push({
            id: `user-update-${user.id}`,
            type: 'USER_UPDATE',
            title: 'Mengubah User',
            description: `Mengubah data user: ${user.nama}`,
            target: user,
            targetType: 'USER',
            timestamp: user.updated_at || user.created_at,
            data: { user },
            icon: Edit2,
            color: 'blue',
          })
        }
      })

      // Sort all activities by timestamp (newest first)
      allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

      setActivities(allActivities)
      return allActivities
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch activities'
      setError(errorMessage)
      console.error('Error fetching activities:', err)
      toast.error('Error', 'Gagal memuat log aktivitas')
      throw err
    } finally {
      setLoading(false)
    }
  }, [toast])

  return {
    activities,
    loading,
    error,
    fetchActivities,
  }
}

