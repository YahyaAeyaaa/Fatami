/**
 * Loan API Service
 * Service khusus untuk Loan API endpoints
 */

import { get, post } from './api'

/**
 * Get all loans (filtered by user role)
 */
export async function getLoans() {
  const { data } = await get('/api/loans')
  return data
}

/**
 * Get loan by ID
 */
export async function getLoanById(id) {
  const { data } = await get(`/api/loans/${id}`)
  return data
}

/**
 * Create new loan request
 */
export async function createLoan(loanData) {
  const { data } = await post('/api/loans', loanData)
  return data
}

export default {
  getLoans,
  getLoanById,
  createLoan,
}

