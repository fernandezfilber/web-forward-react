import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, Shield, User, ChevronDown } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Anime3DLogo from './Anime3DLogo'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen]       = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location    = useLocation()
  const navigate    = useNavigate()
  const { user, logout, isAdmin } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleContactClick = () => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const navItems = [
    { label: 'Inicio',    path: '/' },
    { label: 'Planes',    path: '/planes' },
    { label: 'Cobertura', path: '/cobertura' },
    { label: 'Nosotros',  path: '/nosotros' },
    { label: 'Galería',   path: '/galeria' },
    { label: 'Testimonios', path: '/testimonios' },
    { label: 'Soporte',   path: '/soporte' },
  ]

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'bg-transparent py-4'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <div className="flex items-center py-2">
              <Anime3DLogo src={logo} alt="Forward Vision" className="h-16 md:h-20 w-auto" />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link key={item.label} to={item.path}
                className={`text-sm font-bold uppercase tracking-widest transition-all relative group ${
                  location.pathname === item.path ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                }`} />
              </Link>
            ))}

            <motion.button
              onClick={handleContactClick}
              className="px-6 py-2.5 bg-white text-black rounded-lg font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONTACTAR
            </motion.button>

            {/* Auth area */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-white text-xs font-bold max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-[#0a0f1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-cyan-400 hover:bg-white/5 transition-all font-bold">
                          <Shield size={14} /> Panel Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all font-bold">
                        <User size={14} /> Mi Perfil
                      </Link>
                      <div className="border-t border-white/5">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all font-bold">
                          <LogOut size={14} /> Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 border border-white/20 rounded-lg font-black text-xs uppercase tracking-widest text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-all"
                >
                  <LogIn size={14} /> Ingresar
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl glass-effect text-white hover:bg-white/10 transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div className="md:hidden overflow-hidden" initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }} transition={{ duration: 0.3 }}>
          <div className="mt-4 px-2 py-6 space-y-4 glass-effect rounded-2xl border border-white/10">
            {navItems.map(item => (
              <Link key={item.label} to={item.path} onClick={() => setIsOpen(false)}
                className={`block w-full text-center px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs ${
                  location.pathname === item.path
                    ? 'text-cyan-400 bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>{item.label}</Link>
            ))}
            <button onClick={handleContactClick}
              className="w-full px-4 py-4 bg-cyan-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              CONTACTAR AHORA
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl text-cyan-400 bg-cyan-500/10 font-bold text-xs uppercase tracking-widest">
                    Panel Admin
                  </Link>
                )}
                <Link to="/perfil" onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl border border-white/10 text-gray-300 font-bold text-xs uppercase tracking-widest hover:bg-white/5">
                  Mi Perfil
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false) }}
                  className="w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-xs uppercase tracking-widest">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 rounded-xl border border-white/20 text-gray-300 font-bold text-xs uppercase tracking-widest">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
