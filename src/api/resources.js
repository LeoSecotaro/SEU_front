import { apiDelete } from './client'

export async function deleteResource(basePath, id) {
  if (!basePath) return Promise.reject(new Error('missing basePath'))
  if (!id) return Promise.reject(new Error('missing id'))

  try {
    // try proxied API via apiDelete wrapper
    await apiDelete(`${basePath}/${id}`, { includeCredentials: true })
    return true
  } catch (err) {
    // fallback to absolute backend URL with /api prefix
    try {
      const fallbackBase = basePath.startsWith('/api') ? basePath : `/api${basePath}`
      const res = await fetch(`http://localhost:3000${fallbackBase}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok || res.status === 204) return true
      let payload = null
      try { payload = await res.json() } catch (e) { payload = null }
      throw new Error((payload && (payload.error || payload.message)) ? String(payload.error || payload.message) : `Error deleting (status ${res.status})`)
    } catch (e2) {
      throw err || e2
    }
  }
}
