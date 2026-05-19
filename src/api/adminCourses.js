import { apiDelete } from './client'

export async function deleteAdminCourse(courseId) {
  if (!courseId) return Promise.reject(new Error('missing course id'))
  try {
    // try proxied API via client
    await apiDelete(`/api/admin/courses/${courseId}`, { includeCredentials: true })
    return true
  } catch (err) {
    // If proxy not configured or resource not found, attempt absolute backend URL with /api prefix
    try {
      const res = await fetch(`http://localhost:3000/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })
      if (res.ok || res.status === 204) return true
      let payload = null
      try { payload = await res.json() } catch (e) { payload = null }
      throw new Error((payload && (payload.error || payload.message)) ? String(payload.error || payload.message) : `Error deleting (status ${res.status})`)
    } catch (e) {
      // rethrow original or fallback error
      throw err || e
    }
  }
}
