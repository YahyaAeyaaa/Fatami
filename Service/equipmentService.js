/**
 * Equipment API Service
 * Service khusus untuk Equipment API endpoints
 */

import { get, post, put, del } from './api'

/**
 * Get all equipments
 */
export async function getEquipments() {
  const { data } = await get('/api/equipments')
  return data
}

/**
 * Get equipment by ID
 */
export async function getEquipmentById(id) {
  const { data } = await get(`/api/equipments/${id}`)
  return data
}

/**
 * Create new equipment
 */
export async function createEquipment(equipmentData) {
  const { data } = await post('/api/equipments', equipmentData)
  return data
}

/**
 * Update equipment by ID
 */
export async function updateEquipment(id, equipmentData) {
  const { data } = await put(`/api/equipments/${id}`, equipmentData)
  return data
}

/**
 * Delete equipment by ID
 */
export async function deleteEquipment(id) {
  await del(`/api/equipments/${id}`)
  return true
}

export default {
  getEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
}

