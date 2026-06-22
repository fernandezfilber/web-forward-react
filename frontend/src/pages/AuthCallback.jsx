import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Página que recibe el redirect de Google OAuth.
 * URL: /auth/callback?token=xxx&refresh=xxx&user=xxx
 */
export default function AuthCallback() {
  const [params]   = useSearchParams()
  const navigate   = useNavigate()
  const { loginWithTokens } = useAuth()

  useEffect(() => {
    const token   = params.get('token')
    const refresh = params.get('refresh')
    const userRaw = params.get('user')
    const error   = params.get('error')

    if (error) {
      navigate('/login?error=' + error, { replace: true })
      return
    }

    if (!token || !userRaw) {
      navigate('/login?error=missing_params', { replace: true })
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(userRaw))

      // Actualiza el contexto directamente — no necesita el evento storage
      loginWithTokens(token, refresh, user)

      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch {
      navigate('/login?error=parse_error', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Iniciando sesión con Google...</p>
      </div>
    </div>
  )
}
