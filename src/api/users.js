import { apiGet, apiPost, apiPut, apiDelete, API_BASE } from './client'

export function listAdminUsers() {
  return apiGet('/api/admin/users', { includeCredentials: true })
}

export function getAdminUser(id) {
  if (!id) return Promise.reject(new Error('missing user id'))
  return apiGet(`/api/admin/users/${id}`, { includeCredentials: true })
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

// Update the currently authenticated user's password/profile via canonical endpoint
export async function updateCurrentUser(payload) {
  const csrf = (typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]'))
    ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    : null

  const buildUrl = (base) => {
    if (!base) return '/api/v1/current_user'
    const b = String(base).replace(/\/$/, '')
    return `${b}/v1/current_user`
  }

  const candidates = []
  if (typeof API_BASE !== 'undefined' && API_BASE) candidates.push(buildUrl(API_BASE))
  candidates.push('/api/v1/current_user')
  candidates.push('http://localhost:3000/api/v1/current_user')

  let lastErr = null
  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {})
        },
        body: JSON.stringify({ user: payload })
      })

      const contentType = res.headers.get('content-type') || ''
      const body = contentType.includes('application/json') ? await res.json() : await res.text()

      if (res.status === 404) {
        lastErr = { status: 404, payload: body }
        continue
      }

      if (!res.ok) {
        const err = new Error(res.statusText || 'API error')
        err.status = res.status
        err.payload = body
        throw err
      }

      return body
    } catch (err) {
      lastErr = err
    }
  }

  const err = new Error((lastErr && lastErr.message) || 'API error')
  err.status = lastErr && lastErr.status
  err.payload = lastErr && lastErr.payload
  throw err
}
