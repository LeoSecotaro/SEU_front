import { apiDelete } from './client'

export async function deleteResource(basePath, id) {
  if (!basePath) return Promise.reject(new Error('missing basePath'))
  if (!id) return Promise.reject(new Error('missing id'))

  await apiDelete(`${basePath}/${id}`)
  return true
}
