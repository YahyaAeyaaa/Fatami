/**
 * Global API Service
 * Service untuk melakukan API calls ke backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * Generic fetch function dengan error handling
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    // Parse response
    const data = await response.json()
    
    // Handle non-ok responses
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }
    
    return { data, status: response.status }
  } catch (error) {
    // Handle network errors or parsing errors
    throw new Error(error.message || 'Network error occurred')
  }
}

/**
 * GET request
 */
export async function get(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    method: 'GET',
    ...options,
  })
}

/**
 * POST request
 */
export async function post(endpoint, body, options = {}) {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * PUT request
 */
export async function put(endpoint, body, options = {}) {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * PATCH request
 */
export async function patch(endpoint, body, options = {}) {
  return fetchAPI(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  })
}

/**
 * DELETE request
 */
export async function del(endpoint, options = {}) {
  return fetchAPI(endpoint, {
    method: 'DELETE',
    ...options,
  })
}

/**
 * API Service object untuk easier access
 */
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
}

export default api

