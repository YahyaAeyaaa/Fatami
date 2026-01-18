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

export default {
  getReturns,
  createReturn,
}

