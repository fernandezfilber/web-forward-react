import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// Auth
import { AuthProvider }  from './context/AuthContext'
import PrivateRoute      from './components/PrivateRoute'
import ErrorBoundary     from './components/ErrorBoundary'

// Layout components (always loaded — small)
import Navbar         from './components/Navbar'
import ChatbotWidget  from './components/ChatbotWidget'
import WhatsAppWidget from './components/WhatsAppWidget'
import Footer         from './components/Footer'

// Public Pages (eager — main bundle)
import Inicio     from './pages/Inicio'
import Planes     from './pages/Planes'
import Cobertura  from './pages/Cobertura'
import Nosotros   from './pages/Nosotros'
import Soporte    from './pages/Soporte'
import Privacidad from './pages/Privacidad'
import Terminos   from './pages/Terminos'
import Contrato   from './pages/Contrato'
import Galeria    from './pages/Galeria'
import Login      from './pages/Login'
import AuthCallback from './pages/AuthCallback'
import Perfil     from './pages/Perfil'
import Testimonios from './pages/Testimonios'
import RecuperarPassword from './pages/RecuperarPassword'

// Admin Pages (lazy loaded — not needed on first visit)
const AdminLayout    = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminMedia     = lazy(() => import('./pages/admin/AdminMedia'))
const AdminComments  = lazy(() => import('./pages/admin/AdminComments'))
const AdminUsers     = lazy(() => import('./pages/admin/AdminUsers'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Loading fallback for lazy admin pages
function AdminLoader() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  )
}

// Shared wrapper for public pages (Navbar + Footer + background)
function WithNav({ children }) {
  return (
    <div className="min-h-screen bg-[#030712] relative">
      <Navbar />
      {children}
      <WhatsAppWidget />
      <ChatbotWidget />
      <Footer />
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-2000" />
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Standalone (no Navbar) */}
          <Route path="/login"         element={<Login />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Admin Panel — lazy loaded, protected */}
          <Route path="/admin" element={
            <PrivateRoute adminOnly>
              <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
              </Suspense>
            </PrivateRoute>
          }>
            <Route index           element={<Suspense fallback={<AdminLoader />}><AdminDashboard /></Suspense>} />
            <Route path="media"    element={<Suspense fallback={<AdminLoader />}><AdminMedia /></Suspense>} />
            <Route path="comments" element={<Suspense fallback={<AdminLoader />}><AdminComments /></Suspense>} />
            <Route path="users"    element={<Suspense fallback={<AdminLoader />}><AdminUsers /></Suspense>} />
          </Route>

          {/* Public pages */}
          <Route path="/"           element={<WithNav><Inicio /></WithNav>} />
          <Route path="/planes"     element={<WithNav><Planes /></WithNav>} />
          <Route path="/cobertura"  element={<WithNav><Cobertura /></WithNav>} />
          <Route path="/nosotros"   element={<WithNav><Nosotros /></WithNav>} />
          <Route path="/soporte"    element={<WithNav><Soporte /></WithNav>} />
          <Route path="/privacidad" element={<WithNav><Privacidad /></WithNav>} />
          <Route path="/terminos"   element={<WithNav><Terminos /></WithNav>} />
          <Route path="/contrato"   element={<WithNav><Contrato /></WithNav>} />
          <Route path="/galeria"    element={<WithNav><Galeria /></WithNav>} />
          <Route path="/testimonios" element={<WithNav><Testimonios /></WithNav>} />
          <Route path="/perfil"     element={<PrivateRoute><WithNav><Perfil /></WithNav></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
