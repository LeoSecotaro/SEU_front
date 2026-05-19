// API helper for session-related endpoints (sign out)

export async function signOut() {
  const csrf = (typeof document !== 'undefined' && document.querySelector('meta[name="csrf-token"]'))
    ? document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    : null

  // Try proxied API first
  let res = await fetch('/api/users/sign_out', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      ...(csrf ? { 'X-CSRF-Token': csrf } : {})
    }
  })

  // If proxy not configured or backend does not accept /api prefix, try backend absolute URL without /api
  if (!res || res.status === 404) {
    try {
      // Rails Devise default route typically lives at /users/sign_out
      res = await fetch('http://localhost:3000/users/sign_out', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          ...(csrf ? { 'X-CSRF-Token': csrf } : {})
        }
      })
    } catch (e) {
      // log fallback failure but return original response if it exists
      console.error('Session signOut fallback failed', e)
    }
  }

  return res
}
