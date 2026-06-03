import { apiGet, apiPost, apiPut, apiDelete, apiRequest } from './client'

export async function listAdminCourses() {
  return apiGet('/api/admin/courses')
}

export async function getAdminCourse(courseId) {
  if (!courseId) return Promise.reject(new Error('missing course id'))
  return apiGet(`/api/admin/courses/${courseId}`)
}

export async function fetchAdminOptions() {
  // modes, days, labels
  const [modes, days, labels] = await Promise.all([
    apiGet('/api/admin/modes'),
    apiGet('/api/admin/days'),
    apiGet('/api/admin/labels')
  ])
  return { modes, days, labels }
}

async function postWithOptionalImage(path, payloadCourse, imageFile, method = 'POST') {
  // If imageFile present, send multipart/form-data with course fields and image
  if (imageFile) {
    const fd = new FormData()
    // helper aliases map for backend column names
    const aliases = {
      min_quota: ['quota_minimum', 'minQuota'],
      minQuota: ['quota_minimum', 'min_quota'],
      quota_minimum: ['min_quota', 'minQuota']
    }

    // Append scalar fields and build nested form fields for arrays/objects so Rails parses params properly
    Object.entries(payloadCourse || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return

      // Arrays
      if (Array.isArray(v)) {
        // array of objects (e.g. course_days_attributes, course_topics_attributes)
        if (v.length > 0 && typeof v[0] === 'object') {
          v.forEach((item, idx) => {
            if (!item) return
            Object.entries(item).forEach(([subk, subv]) => {
              if (subv === undefined || subv === null) return
              const fieldName = `course[${k}][${idx}][${subk}]`
              if (typeof subv === 'object') {
                fd.append(fieldName, JSON.stringify(subv))
              } else {
                fd.append(fieldName, String(subv))
              }
            })
          })
        } else {
          // array of scalars (e.g. label_ids)
          v.forEach(val => {
            if (val === undefined || val === null) return
            fd.append(`course[${k}][]`, String(val))
          })
        }
        return
      }

      // Plain objects (nested hashes)
      if (typeof v === 'object') {
        Object.entries(v).forEach(([subk, subv]) => {
          if (subv === undefined || subv === null) return
          const fieldName = `course[${k}][${subk}]`
          if (typeof subv === 'object') {
            fd.append(fieldName, JSON.stringify(subv))
          } else {
            fd.append(fieldName, String(subv))
          }
        })
        return
      }

      // Scalars
      fd.append(`course[${k}]`, String(v))
      // also append known aliases so Rails column names are covered
      if (aliases[k]) {
        aliases[k].forEach(aliasKey => fd.append(`course[${aliasKey}]`, String(v)))
      }
    })

    fd.append('image', imageFile)

    const res = await apiRequest(path, { method, body: fd })
    if (res.ok) return res.json()
    const err = await res.json().catch(() => ({}))
    throw err
  } else {
    // Ensure JSON payload contains backend alias keys for min_quota variants
    const payloadCopy = { ...(payloadCourse || {}) }
    if (payloadCopy.min_quota !== undefined) payloadCopy.quota_minimum = payloadCopy.min_quota
    if (payloadCopy.minQuota !== undefined && payloadCopy.quota_minimum === undefined) payloadCopy.quota_minimum = payloadCopy.minQuota

    return method === 'POST' ? apiPost(path, { course: payloadCopy }) : apiPut(path, { course: payloadCopy })
  }
}

export function createAdminCourse(payloadCourse, imageFile) {
  return postWithOptionalImage('/api/admin/courses', payloadCourse, imageFile, 'POST')
}

export function updateAdminCourse(courseId, payloadCourse, imageFile) {
  return postWithOptionalImage(`/api/admin/courses/${courseId}`, payloadCourse, imageFile, 'PATCH')
}

export function deleteAdminCourse(courseId) {
  return apiDelete(`/api/admin/courses/${courseId}`)
}
