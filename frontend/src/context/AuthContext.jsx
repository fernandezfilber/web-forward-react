import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fv_user')
    const token  = localStorage.getItem('fv_access_token')
    if (stored && token) {
      try { return JSON.parse(stored) } catch { localStorage.clear(); return null }
    }
    return null
  })
  const [loading, setLoading] = useState(true)

  // Restore session (used for external updates/storage events)
  const restoreSession = useCallback(() => {
    const stored = localStorage.getItem('fv_user')
    const token  = localStorage.getItem('fv_access_token')
    if (stored && token) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.clear(); setUser(null) }
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    restoreSession()
    setLoading(false)

    // Listen for storage changes from other tabs
    window.addEventListener('storage', restoreSession)
    return () => window.removeEventListener('storage', restoreSession)
  }, [restoreSession])

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('fv_access_token',  data.accessToken)
    localStorage.setItem('fv_refresh_token', data.refreshToken)
    localStorage.setItem('fv_user',          JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  /** Usado por AuthCallback después de OAuth — actualiza el contexto directamente */
  const loginWithTokens = useCallback((accessToken, refreshToken, userData) => {
    localStorage.setItem('fv_access_token',  accessToken)
    localStorage.setItem('fv_refresh_token', refreshToken)
    localStorage.setItem('fv_user',          JSON.stringify(userData))
    setUser(userData)
  }, [])

  const register = useCallback(async (name, email, password, phone) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone })
    localStorage.setItem('fv_access_token',  data.accessToken)
    localStorage.setItem('fv_refresh_token', data.refreshToken)
    localStorage.setItem('fv_user',          JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('fv_refresh_token')
    try { await api.post('/auth/logout', { refreshToken }) } catch (_) {}
    localStorage.removeItem('fv_access_token')
    localStorage.removeItem('fv_refresh_token')
    localStorage.removeItem('fv_user')
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const response = await api.put('/auth/profile', data)
    const updatedUser = response.data.user
    localStorage.setItem('fv_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    return response.data
  }, [])

  const requestPasswordReset = useCallback(async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  }, [])

  const resetPassword = useCallback(async (email, code, newPassword) => {
    const { data } = await api.post('/auth/reset-password', { email, code, newPassword })
    return data
  }, [])

  const isAdmin   = user?.role === 'admin'
  const isCliente = user?.role === 'cliente'

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, loginWithTokens, register, logout, 
      isAdmin, isCliente, updateProfile, requestPasswordReset, resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export default AuthContext
