import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Mail, KeyRound, Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RecuperarPassword() {
  const { requestPasswordReset, resetPassword } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleRequestCode = async (e) => {
    e.preventDefault()
    if (!email) return setError('Ingresa tu email')
    setLoading(true)
    setError('')
    try {
      await requestPasswordReset(email)
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar el código')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!code || !newPassword) return setError('Completa todos los campos')
    setLoading(true)
    setError('')
    try {
      await resetPassword(email, code, newPassword)
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.error || 'Código inválido o error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Recuperar Contraseña | Forward Vision</title>
      </Helmet>

      {/* Decorative bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Forward Vision" className="h-16 mx-auto drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          </Link>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            
            {/* PASO 1: Ingresar Email */}
            {step === 1 && (
              <motion.form key="step1" onSubmit={handleRequestCode}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                    <KeyRound size={28} className="text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase italic">Recuperar Acceso</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    Ingresa el correo asociado a tu cuenta para enviarte un código de recuperación.
                  </p>
                </div>

                {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="tu@correo.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-cyan-500 text-black text-sm font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                  >
                    {loading ? 'Enviando...' : 'Enviar Código'} <ArrowRight size={16} />
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASO 2: Ingresar Código y Nueva Contraseña */}
            {step === 2 && (
              <motion.form key="step2" onSubmit={handleResetPassword}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                    <Mail size={28} className="text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase italic">Verifica el código</h2>
                  <p className="text-gray-400 text-sm mt-2">
                    Hemos enviado un código de 6 dígitos a <br/><strong className="text-white">{email}</strong>
                  </p>
                </div>

                {error && <p className="text-red-400 text-sm mb-4 text-center bg-red-400/10 py-2 rounded-lg">{error}</p>}

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2">Código de 6 dígitos</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={e => { setCode(e.target.value); setError('') }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-center text-white text-2xl font-black tracking-[0.5em] focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-gray-700"
                      placeholder="000000"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 block mb-2 mt-4">Nueva Contraseña</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => { setNewPassword(e.target.value); setError('') }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-purple-500 text-black text-sm font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                  >
                    {loading ? 'Verificando...' : 'Cambiar Contraseña'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={14} /> Volver
                  </button>
                </div>
              </motion.form>
            )}

            {/* PASO 3: Éxito */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase italic mb-4">¡Contraseña Actualizada!</h2>
                <p className="text-gray-400 mb-8">
                  Tu contraseña ha sido cambiada exitosamente. Ya puedes acceder a tu cuenta.
                </p>
                <Link
                  to="/login"
                  className="inline-flex w-full py-3.5 bg-cyan-500 text-black text-sm font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all items-center justify-center gap-2"
                >
                  Ir a Iniciar Sesión <ArrowRight size={16} />
                </Link>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {step === 1 && (
          <p className="text-center mt-6 text-gray-500 text-sm">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
              Iniciar Sesión
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  )
}
