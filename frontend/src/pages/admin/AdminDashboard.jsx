import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Image, MessageSquare, Clock, Star, TrendingUp, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-white/20 transition-all"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-4xl font-black text-white">{value ?? '—'}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  </motion.div>
)

const QuickLink = ({ to, icon: Icon, label, color }) => (
  <Link to={to}>
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${color}`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm uppercase tracking-widest">{label}</span>
    </motion.div>
  </Link>
)

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
            <Shield size={20} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Panel de Administración</h1>
            <p className="text-gray-500 text-sm">Bienvenido, {user?.name}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard icon={Users}          label="Clientes registrados"  value={stats?.totalClients}           color="bg-cyan-500/20 text-cyan-400"    />
        <StatCard icon={Image}          label="Medios publicados"     value={stats?.totalMedia}             color="bg-purple-500/20 text-purple-400" />
        <StatCard icon={MessageSquare}  label="Comentarios aprobados" value={stats?.totalApprovedComments}  color="bg-green-500/20 text-green-400"   />
        <StatCard icon={Clock}          label="Pendientes de revisar" value={stats?.pendingComments}        color="bg-yellow-500/20 text-yellow-400" sub={stats?.pendingComments > 0 ? '⚠ Requiere atención' : '✓ Al día'} />
        <StatCard icon={Star}           label="Rating promedio"       value={stats?.avgRating ? `${stats.avgRating}★` : '—'} color="bg-orange-500/20 text-orange-400" />
      </div>

      {/* Quick Actions */}
      <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Acceso Rápido</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickLink to="/admin/media"    icon={Image}          label="Gestionar Galería"    color="border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10" />
        <QuickLink to="/admin/comments" icon={MessageSquare}  label="Moderar Comentarios"  color="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10" />
        <QuickLink to="/admin/users"    icon={Users}          label="Gestionar Usuarios"   color="border-purple-500/20 text-purple-400 hover:bg-purple-500/10" />
        <QuickLink to="/"              icon={TrendingUp}      label="Ver Sitio Web"        color="border-white/10 text-gray-400 hover:bg-white/5" />
      </div>
    </div>
  )
}
