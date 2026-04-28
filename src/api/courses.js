import { apiGet } from './client'

export function listCourses(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v == null) return
    if (Array.isArray(v)) {
      v.forEach((val) => qs.append(`${k}[]`, String(val)))
    } else if (typeof v === 'boolean') {
      qs.append(k, v ? 'true' : 'false')
    } else {
      qs.append(k, String(v))
    }
  })
  const query = qs.toString()
  return apiGet('/api/v1/courses' + (query ? `?${query}` : ''))
}
