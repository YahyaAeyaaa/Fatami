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
 * Mark loan as BORROWED (barang sudah diambil)
 */
export async function markAsBorrowed(id) {
  const { data } = await post(`/api/loans/${id}/borrow`)
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
  markAsBorrowed,
  rejectLoan,
}

