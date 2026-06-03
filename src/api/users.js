import { apiGet, apiPost, apiPut, apiDelete, apiRequest } from './client'

export function listAdminUsers() {
  return apiGet('/admin/users')
}

export function getAdminUser(id) {
  if (!id) return Promise.reject(new Error('missing user id'))
  return apiGet(`/admin/users/${id}`)
}

export function createAdminUser(payload) {
  // payload: { email, password, password_confirmation, admin }
  return apiPost('/admin/users', { user: payload })
}

export function updateAdminUser(id, payload) {
  return apiPut(`/admin/users/${id}`, { user: payload })
}

export function deleteAdminUser(id) {
  return apiDelete(`/admin/users/${id}`)
}

// Update the currently authenticated user's password/profile via canonical endpoint
export async function updateCurrentUser(payload) {
  const res = await apiRequest('/api/v1/current_user', {
    method: 'PATCH',
    body: { user: payload }
  })

  const contentType = res.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await res.json() : await res.text()

  if (!res.ok) {
    const err = new Error(res.statusText || 'API error')
    err.status = res.status
    err.payload = body
    throw err
  }

  return body
}
