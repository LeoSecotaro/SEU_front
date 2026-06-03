import { apiPost } from './client'

export function createInscription(payload) {
  // payload should follow backend keys
  return apiPost('/api/v1/inscripciones', payload)
}
