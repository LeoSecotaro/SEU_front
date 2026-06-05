import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const tryFetchCurrent = async () => {
      try {
        const res = await apiRequest('/api/v1/current_user')
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
