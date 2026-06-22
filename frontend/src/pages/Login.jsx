import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, LogIn, UserPlus, Wifi, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom'

// Google Icon SVG (official brand colors)
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function Login() {
  const [mode, setMode]         = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ name: '', email: '', password: '', phone: '' })

  const { login, register }  = useAuth()
  const navigate             = useNavigate()
  const location             = useLocation()
  const [params]             = useSearchParams()
  const from                 = location.state?.from?.pathname || '/'

  // Show error from OAuth redirect
  const oauthError = params.get('error')

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let user
      if (mode === 'login') {
        user = await login(form.email, form.password)
      } else {
        user = await register(form.name, form.email, form.password, form.phone)
      }
      navigate(user.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    // Evitar que el Service Worker viejo intercepte la navegación
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let r of registrations) r.unregister()
        window.location.href = '/api/auth/google'
      })
    } else {
      window.location.href = '/api/auth/google'
    }
  }

  const inputClass = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12
    text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400/60
    focus:bg-white/8 transition-all`

  const displayError = error || (oauthError
    ? oauthError === 'google_failed' ? 'Error al iniciar sesión con Google. Intenta de nuevo.'
    : 'Ocurrió un error con Google. Intenta de nuevo.'
    : '')

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
            <Wifi size={28} />
            <span className="text-2xl font-black tracking-tighter uppercase">Forward Vision</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Accede a tu cuenta para comentar y calificar</p>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          {/* Tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            {[
              { id: 'login',    label: 'Iniciar Sesión', icon: LogIn },
              { id: 'register', label: 'Registrarse',    icon: UserPlus },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setMode(tab.id); setError('') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  mode === tab.id ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-gray-500 hover:text-gray-300'
                }`}>
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Google OAuth Button ── */}
          <motion.button
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-800 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all shadow-lg mb-5"
          >
            <GoogleIcon />
            Continuar con Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs uppercase tracking-widest">o continúa con email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {displayError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div key="reg-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input id="reg-name" type="text" placeholder="Nombre completo" value={form.name} onChange={update('name')} required className={inputClass} />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input id="reg-phone" type="tel" placeholder="Teléfono (opcional)" value={form.phone} onChange={update('phone')} className={inputClass} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="auth-email" type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={update('email')} required className={inputClass} />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="auth-password" type={showPass ? 'text' : 'password'}
                placeholder={mode === 'register' ? 'Mín. 8 caracteres, 1 mayúscula, 1 número' : 'Contraseña'}
                value={form.password} onChange={update('password')} required className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full mt-2 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)] disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  {mode === 'login' ? 'Iniciando...' : 'Creando cuenta...'}
                </span>
              ) : (
                mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl bg-white/3 border border-white/5 text-center">
            <p className="text-[10px] text-gray-600 font-mono">
              Demo admin: admin@forwardvision.com / Admin123!<br />
              Demo cliente: demo@cliente.com / Cliente123!
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          <Link to="/" className="hover:text-gray-400 transition-colors">← Volver al sitio</Link>
        </p>
      </motion.div>
    </div>
  )
}
