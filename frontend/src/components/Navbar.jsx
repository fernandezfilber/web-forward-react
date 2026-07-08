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
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'bg-white/80 py-4'}`}
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
                  location.pathname === item.path ? 'text-black' : 'text-gray-500 hover:text-black'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-black transition-all duration-300 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}

            <motion.button
              onClick={handleContactClick}
              className="px-6 py-2.5 bg-black text-white rounded-lg font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:border-gray-400 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-200 flex items-center justify-center text-black font-black text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-black text-xs font-bold max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl"
                    >
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-100 transition-all font-bold">
                          <Shield size={14} /> Panel Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-all font-bold">
                        <User size={14} /> Mi Perfil
                      </Link>
                      <div className="border-t border-gray-100">
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
                  className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg font-black text-xs uppercase tracking-widest text-gray-700 hover:border-black hover:text-black transition-all"
                >
                  <LogIn size={14} /> Ingresar
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-100 text-black hover:bg-gray-200 transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div className="md:hidden overflow-hidden" initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }} transition={{ duration: 0.3 }}>
          <div className="mt-4 px-2 py-6 space-y-4 bg-white rounded-2xl border border-gray-200 shadow-lg">
            {navItems.map(item => (
              <Link key={item.label} to={item.path} onClick={() => setIsOpen(false)}
                className={`block w-full text-center px-4 py-3 rounded-xl transition-all font-bold uppercase tracking-widest text-xs ${
                  location.pathname === item.path
                    ? 'text-black bg-gray-100'
                    : 'text-gray-500 hover:text-black hover:bg-gray-50'
                }`}>{item.label}</Link>
            ))}
            <button onClick={handleContactClick}
              className="w-full px-4 py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-gray-800">
              CONTACTAR AHORA
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl text-black bg-gray-100 font-bold text-xs uppercase tracking-widest">
                    Panel Admin
                  </Link>
                )}
                <Link to="/perfil" onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest hover:bg-gray-50">
                  Mi Perfil
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false) }}
                  className="w-full px-4 py-3 bg-red-500/10 text-red-400 rounded-xl font-bold text-xs uppercase tracking-widest">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-widest hover:bg-gray-50">
                Iniciar Sesión
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
