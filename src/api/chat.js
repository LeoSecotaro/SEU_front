import { apiPost, apiDelete } from './client'

export function generateCourseSummary(courseId) {
  if (!courseId) return Promise.reject(new Error('missing course id'))
  return apiPost(`/api/v1/courses/${courseId}/generate_summary?sync=true`, {})
}

export function sendCourseChat(courseId, query) {
  if (!courseId) return Promise.reject(new Error('missing course id'))
  // Send both legacy `message` param and the `course_chat[query]` payload so backend
  // that accepts either will work.
  return apiPost(
    `/api/v1/courses/${courseId}/chat`,
    { message: query, course_chat: { query } }
  )
}

export function deleteCurrentChatSession() {
  return apiDelete('/api/v1/chat_sessions/current')
}
