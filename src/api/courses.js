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
  // call the Rails backend API v1 endpoints under /api/v1
  return apiGet('/api/v1/courses' + (query ? `?${query}` : ''))
}

export function getCourse(id) {
  if (!id) return Promise.reject(new Error('missing course id'))
  return apiGet(`/api/v1/courses/${id}`)
}

export async function listLabels() {
  try {
    const res = await apiGet('/api/v1/labels')
    return res
  } catch (e) {
    // fallback to non-v1 path
    try {
      const res2 = await apiGet('/api/labels')
      return res2
    } catch (e2) {
      throw e
    }
  }
}
