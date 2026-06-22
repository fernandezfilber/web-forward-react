import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Shield, UserCheck, UserX, Trash2, CheckCircle, Search } from 'lucide-react'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const RoleBadge = ({ role }) => (
  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
    role === 'admin'
      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }`}>
    {role}
  </span>
)

export default function AdminUsers() {
  const { user: me } = useAuth()
  const [users, setUsers]     = useState([])
  const [total, setTotal]     = useState(0)
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/users?search=${search}&limit=50`)
      setUsers(data.users)
      setTotal(data.total)
    } catch { showToast('Error al cargar usuarios', 'error') }
    finally   { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchUsers()
  }

  const toggleActive = async (id, current) => {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !current })
      setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !current } : u))
      showToast(`Usuario ${!current ? 'activado' : 'desactivado'}`)
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al actualizar', 'error')
    }
  }

  const changeRole = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}`, { role: newRole })
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u))
      showToast(`Rol actualizado a ${newRole}`)
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al cambiar rol', 'error')
    }
  }

  const deleteUser = async (id, name) => {
    if (!confirm(`¿Eliminar usuario "${name}"? Sus comentarios y ratings también serán eliminados.`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast('Usuario eliminado')
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al eliminar', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold
              ${toast.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-green-500/20 border border-green-500/30 text-green-300'}`}
          >
            <CheckCircle size={16} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <Users size={24} className="text-cyan-400" /> Gestión de Usuarios
        </h1>
        <p className="text-gray-500 text-sm mt-1">{total} usuarios registrados</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400/50"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-white/10 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/15 transition-all">
          Buscar
        </button>
      </form>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-gray-500">Usuario</th>
                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-gray-500">Rol</th>
                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-gray-500">Estado</th>
                <th className="text-left p-4 text-xs font-black uppercase tracking-widest text-gray-500">Último acceso</th>
                <th className="text-right p-4 text-xs font-black uppercase tracking-widest text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{u.name} {u.id === me?.id && <span className="text-cyan-400 text-[10px]">(tú)</span>}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><RoleBadge role={u.role} /></td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold uppercase ${u.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {u.isActive ? '● Activo' : '● Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('es-PE') : 'Nunca'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== me?.id && (
                        <>
                          {/* Toggle role */}
                          <button
                            onClick={() => changeRole(u.id, u.role === 'admin' ? 'cliente' : 'admin')}
                            title={u.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all"
                          >
                            <Shield size={14} />
                          </button>
                          {/* Toggle active */}
                          <button
                            onClick={() => toggleActive(u.id, u.isActive)}
                            title={u.isActive ? 'Desactivar' : 'Activar'}
                            className={`p-2 rounded-xl transition-all ${
                              u.isActive
                                ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                                : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                            }`}
                          >
                            {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => deleteUser(u.id, u.name)}
                            title="Eliminar usuario"
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
