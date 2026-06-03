import { apiDelete } from './client'

export async function deleteAdminCourse(courseId) {
  if (!courseId) return Promise.reject(new Error('missing course id'))
  await apiDelete(`/api/admin/courses/${courseId}`)
  return true
}
