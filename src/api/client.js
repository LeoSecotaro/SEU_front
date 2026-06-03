export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const cleanBaseUrl = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;

export async function apiRequest(path, options = {}) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${cleanBaseUrl}${normalizedPath}`;

  const csrf = (typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]'))
    ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    : null;

  const headers = {
    'Accept': 'application/json',
    ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
    ...options.headers
  };

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const fetchOptions = {
    method: options.method || 'GET',
    credentials: 'include',
    headers,
    ...options,
    ...(body ? { body } : {})
  };

  return fetch(url, fetchOptions);
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  if (res.status === 204) {
    return null;
  }
  const payload = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const error = new Error(res.statusText || 'API error');
    error.status = res.status;
    error.payload = payload;
    throw error;
  }
  return payload;
}

export function apiGet(path, options = {}) {
  return apiRequest(path, { method: 'GET', ...options }).then(handleResponse);
}

export function apiPost(path, body, options = {}) {
  return apiRequest(path, { method: 'POST', body, ...options }).then(handleResponse);
}

export function apiDelete(path, options = {}) {
  return apiRequest(path, { method: 'DELETE', ...options }).then(handleResponse);
}

export function apiPut(path, body, options = {}) {
  return apiRequest(path, { method: 'PUT', body, ...options }).then(handleResponse);
}
