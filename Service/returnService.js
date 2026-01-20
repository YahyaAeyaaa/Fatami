/**
 * Return API Service
 * Service khusus untuk Return API endpoints
 */

import { get, post } from './api'

/**
 * Get all returns (filtered by user role)
 */
export async function getReturns() {
  const { data } = await get('/api/returns')
  return data
}

/**
 * Create new return
 */
export async function createReturn(returnData) {
  const { data } = await post('/api/returns', returnData)
  return data
}

/**
 * Approve return request (petugas)
 */
export async function approveReturn(returnId) {
  const { data } = await post(`/api/returns/${returnId}/approve`)
  return data
}

/**
 * Pay denda for a return
 */
export async function payDenda(returnId) {
  const { data } = await post(`/api/returns/${returnId}/pay-denda`)
  return data
}

export default {
  getReturns,
  createReturn,
  approveReturn,
  payDenda,
}

