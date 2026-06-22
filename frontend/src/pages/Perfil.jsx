import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { User, Phone, Lock, Save, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Perfil() {
  const { user, updateProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  })
  
  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await updateProfile(formData)
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error al actualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (pwdData.newPassword !== pwdData.confirmPassword) {
      return setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
    }
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await updateProfile({ 
        currentPassword: pwdData.currentPassword, 
        newPassword: pwdData.newPassword 
      })
      setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error al actualizar contraseña' })
    } finally {
      setLoading(false)
    }
  }

  // Si no hay usuario cargado aún (por lag del contexto)
  if (!user) return <div className="min-h-screen bg-[#030712] pt-32" />

  const isGoogleAccount = user.provider === 'google'

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <Helmet>
        <title>Mi Perfil | Forward Vision</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-black shadow-xl overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            {isGoogleAccount && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border-2 border-[#030712]">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic">{user.name}</h1>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
              Rol: {user.role}
            </div>
          </div>
        </motion.div>

        {message.text && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl text-sm border ${
              message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Datos Personales */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-cyan-400" />
              Datos Personales
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-cyan-500 text-black text-sm font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </form>
          </motion.div>

          {/* Seguridad */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Lock size={20} className="text-purple-400" />
              Seguridad
            </h2>
            
            {isGoogleAccount ? (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-gray-400 text-sm mb-4">
                  Iniciaste sesión usando Google. Para cambiar tu contraseña, debes hacerlo desde los ajustes de tu cuenta de Google.
                </p>
                <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer"
                   className="inline-block px-6 py-2.5 bg-white/10 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors">
                  Ir a Google
                </a>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Contraseña Actual</label>
                  <input
                    type="password"
                    value={pwdData.currentPassword}
                    onChange={e => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={pwdData.newPassword}
                    onChange={e => setPwdData({ ...pwdData, newPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={pwdData.confirmPassword}
                    onChange={e => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                    minLength={8}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-purple-500 text-black text-sm font-black uppercase tracking-widest rounded-xl hover:bg-purple-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  <Lock size={16} /> Actualizar Contraseña
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
