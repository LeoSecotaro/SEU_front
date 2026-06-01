export const API_BASE = import.meta.env.VITE_API_BASE || '';

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const error = new Error(res.statusText || 'API error');
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export function apiGet(path, { includeCredentials = false } = {}) {
  return fetch(API_BASE + path, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    credentials: includeCredentials ? 'include' : 'same-origin'
  }).then(handleResponse);
}

export function apiPost(path, body, { includeCredentials = false } = {}) {
  return fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: includeCredentials ? 'include' : 'same-origin',
    body: JSON.stringify(body)
  }).then(handleResponse);
}

export function apiDelete(path, { includeCredentials = false } = {}) {
  return fetch(API_BASE + path, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    credentials: includeCredentials ? 'include' : 'same-origin'
  }).then(handleResponse);
}

export function apiPut(path, body, { includeCredentials = false } = {}) {
  return fetch(API_BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: includeCredentials ? 'include' : 'same-origin',
    body: JSON.stringify(body)
  }).then(handleResponse);
}
