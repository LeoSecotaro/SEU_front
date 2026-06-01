import { apiPost } from './client'

export function createInscription(payload) {
  // payload should follow backend keys
  return apiPost('/api/inscripciones', payload, { includeCredentials: true })
}
