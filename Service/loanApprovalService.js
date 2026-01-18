/**
 * Loan Approval API Service
 * Service khusus untuk Loan Approval endpoints (untuk petugas)
 */

import { post } from './api'

/**
 * Approve loan by ID
 */
export async function approveLoan(id) {
  const { data } = await post(`/api/loans/${id}/approve`)
  return data
}

/**
 * Reject loan by ID
 */
export async function rejectLoan(id) {
  const { data } = await post(`/api/loans/${id}/reject`)
  return data
}

export default {
  approveLoan,
  rejectLoan,
}

