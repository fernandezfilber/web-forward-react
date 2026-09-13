import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, LogOut, Shield, User, ChevronDown } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen]         = useState(false)
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

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
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
    { label: 'Inicio',      path: '/' },
    { label: 'Planes',      path: '/planes' },
    { label: 'Cobertura',   path: '/cobertura' },
    { label: 'Nosotros',    path: '/nosotros' },
    { label: 'Galeria',     path: '/galeria' },
    { label: 'Testimonios', path: '/testimonios' },
    { label: 'Soporte',     path: '/soporte' },
  ]

  return (
    <nav className={`site-navbar fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-1' : 'py-2 sm:py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center py-1 shrink-0">
            <img src="/logo.png" alt="Forward Vision" className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map(item => (
              <Link key={item.label} to={item.path}
                className={`text-[13px] font-semibold transition-colors relative group ${
                  location.pathname === item.path
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {item.label}
                  <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-black transition-all duration-300 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}

            <button
              onClick={handleContactClick}
              className="btn-brand ml-2 py-2.5 px-5 text-[13px]"
            >
              Contactar
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(p => !p)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 border border-gray-200 hover:border-[#3C0061]/30 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-black text-xs">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-gray-800 text-xs font-bold max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
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
                          className="flex items-center gap-2 px-4 py-3 text-sm text-black hover:bg-gray-100 font-bold">
                          <Shield size={14} /> Panel Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-semibold">
                        <User size={14} /> Mi Perfil
                      </Link>
                      <div className="border-t border-gray-100">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-semibold">
                          <LogOut size={14} /> Cerrar Sesion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-semibold text-gray-600 hover:border-black hover:text-black transition-all">
                  <LogIn size={14} /> Ingresar
                </button>
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            className="md:hidden p-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
            >
              <div className="navbar-menu-panel mt-3 py-4 px-2 space-y-1 border shadow-lg max-h-[80vh] overflow-y-auto">
                {navItems.map(item => (
                  <Link key={item.label} to={item.path} onClick={() => setIsOpen(false)}
                    className={`block w-full text-center px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                      location.pathname === item.path
                        ? 'text-black bg-gray-100'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100 space-y-2">
                  <button onClick={handleContactClick}
                    className="w-full py-3 btn-brand justify-center text-[13px]">
                    Contactar
                  </button>
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}
                          className="block text-center px-4 py-3 rounded-xl text-black bg-gray-100 font-semibold text-[13px]">
                          Panel Admin
                        </Link>
                      )}
                      <Link to="/perfil" onClick={() => setIsOpen(false)}
                        className="block text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-50">
                        Mi Perfil
                      </Link>
                      <button onClick={() => { handleLogout(); setIsOpen(false) }}
                        className="w-full px-4 py-3 bg-red-50 text-red-500 rounded-xl font-semibold text-[13px]">
                        Cerrar Sesion
                      </button>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}
                      className="block text-center px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-[13px] hover:bg-gray-50">
                      Iniciar Sesion
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
