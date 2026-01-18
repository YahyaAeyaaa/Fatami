/**
 * useEquipments Hook
 * Custom hook untuk mengelola logic CRUD equipments
 */

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/Toats'
import * as equipmentService from '@/Service/equipmentService'

export function useEquipments() {
  const toast = useToast()
  const [equipments, setEquipments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch all equipments
   */
  const fetchEquipments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await equipmentService.getEquipments()
      setEquipments(data)
      return data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch equipments'
      setError(errorMessage)
      console.error('Error fetching equipments:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Create new equipment
   */
  const createEquipment = useCallback(
    async (equipmentData) => {
      try {
        setError(null)
        const newEquipment = await equipmentService.createEquipment(equipmentData)

        // Update local state
        setEquipments((prev) => [newEquipment, ...prev])

        toast.success('Berhasil!', 'Alat berhasil ditambahkan')
        return newEquipment
      } catch (err) {
        const errorMessage = err.message || 'Failed to create equipment'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error creating equipment:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Update equipment
   */
  const updateEquipment = useCallback(
    async (id, equipmentData) => {
      try {
        setError(null)
        const updatedEquipment = await equipmentService.updateEquipment(id, equipmentData)

        // Update local state
        setEquipments((prev) =>
          prev.map((eq) => (eq.id === id ? updatedEquipment : eq))
        )

        toast.success('Berhasil!', 'Alat berhasil diupdate')
        return updatedEquipment
      } catch (err) {
        const errorMessage = err.message || 'Failed to update equipment'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error updating equipment:', err)
        throw err
      }
    },
    [toast]
  )

  /**
   * Delete equipment
   */
  const deleteEquipment = useCallback(
    async (id) => {
      try {
        setError(null)
        await equipmentService.deleteEquipment(id)

        // Update local state
        setEquipments((prev) => prev.filter((eq) => eq.id !== id))

        toast.success('Berhasil!', 'Alat berhasil dihapus')
        return true
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete equipment'
        setError(errorMessage)
        toast.error('Error', errorMessage)
        console.error('Error deleting equipment:', err)
        throw err
      }
    },
    [toast]
  )

  return {
    equipments,
    loading,
    error,
    fetchEquipments,
    createEquipment,
    updateEquipment,
    deleteEquipment,
  }
}

