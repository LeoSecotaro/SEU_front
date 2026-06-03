import { apiRequest } from './client'

export async function signIn(email, password) {
  return apiRequest('/users/sign_in', {
    method: 'POST',
    body: { user: { email, password } }
  });
}

export async function signOut() {
  return apiRequest('/users/sign_out', {
    method: 'DELETE'
  });
}