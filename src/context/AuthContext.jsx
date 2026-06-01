import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const tryFetchCurrent = async () => {
      // Only call the canonical backend route — do not try multiple fallback endpoints.
      const ep = '/api/v1/current_user'
      try {
        const res = await fetch(ep, { credentials: 'include', headers: { 'Accept': 'application/json' } })
        if (!res || !res.ok) {
          if (mounted) setLoading(false)
          return
        }
        const body = await res.json()
        let user = null
        if (body) {
          if (body.id) user = body
          else if (body.user) user = body.user
          else if (body.current_user) user = body.current_user
        }
        if (user && mounted) {
          setCurrentUser(user)
        }
      } catch (e) {
        // ignore error
      } finally {
        if (mounted) setLoading(false)
      }
    }
    tryFetchCurrent()
    return () => { mounted = false }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
