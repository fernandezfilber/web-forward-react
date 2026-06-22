import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, MessageSquare, Users, LogOut, Wifi } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const NavItem = ({ to, icon: Icon, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
          : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`
    }
  >
    <Icon size={18} />
    <span className="hidden lg:block">{label}</span>
  </NavLink>
)

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#030712] flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-16 lg:w-64 bg-black/40 border-r border-white/5 flex flex-col py-6 px-3 lg:px-4 shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-1">
          <Wifi size={22} className="text-cyan-400 shrink-0" />
          <div className="hidden lg:block">
            <p className="text-white font-black text-sm leading-none">Forward Vision</p>
            <p className="text-cyan-400 text-[10px] uppercase tracking-widest mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem to="/admin"          icon={LayoutDashboard} label="Dashboard"          end />
          <NavItem to="/admin/media"    icon={Image}           label="Galería de Medios"      />
          <NavItem to="/admin/comments" icon={MessageSquare}   label="Comentarios"            />
          <NavItem to="/admin/users"    icon={Users}           label="Usuarios"               />
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/5 pt-4 mt-4">
          <div className="hidden lg:flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.name}</p>
              <p className="text-gray-600 text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            <span className="hidden lg:block">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
