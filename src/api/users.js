import { apiGet, apiPost, apiPut, apiDelete } from './client'

export function listAdminUsers() {
  return apiGet('/api/admin/users', { includeCredentials: true })
}

export function createAdminUser(payload) {
  // payload: { email, password, password_confirmation, admin }
  return apiPost('/api/admin/users', { user: payload }, { includeCredentials: true })
}

export function updateAdminUser(id, payload) {
  return apiPut(`/api/admin/users/${id}`, { user: payload }, { includeCredentials: true })
}

export function deleteAdminUser(id) {
  return apiDelete(`/api/admin/users/${id}`, { includeCredentials: true })
}
