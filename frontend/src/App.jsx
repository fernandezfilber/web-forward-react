import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Auth
import { AuthProvider }  from './context/AuthContext'
import PrivateRoute      from './components/PrivateRoute'
import ErrorBoundary     from './components/ErrorBoundary'

// Layout components (always loaded — small)
import Navbar         from './components/Navbar'
import ChatbotWidget  from './components/ChatbotWidget'
import WhatsAppWidget from './components/WhatsAppWidget'
import FloatingPromoBanner from './components/FloatingPromoBanner'
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

const seoByPath = {
  '/': { title: 'Forward Vision | Internet Fibra Óptica + Cable', description: 'Contrata internet de fibra óptica simétrica, TV digital y planes Internet + Cable para tu hogar con Forward Vision.' },
  '/planes': { title: 'Planes de Internet Fibra Óptica | Forward Vision', description: 'Compara planes de internet fibra óptica desde 250 Mbps hasta 1 Giga, con TV digital y soporte para tu hogar.' },
  '/cobertura': { title: 'Cobertura de Internet Fibra Óptica | Forward Vision', description: 'Consulta la cobertura de internet fibra óptica Forward Vision y verifica la disponibilidad en tu dirección.' },
  '/nosotros': { title: 'Nosotros | Forward Vision', description: 'Conoce a Forward Vision, proveedor de internet fibra óptica y entretenimiento digital en Lima Este.' },
  '/soporte': { title: 'Soporte de Internet y Cable | Forward Vision', description: 'Encuentra ayuda y soporte técnico para tus servicios de internet fibra óptica y TV digital Forward Vision.' },
  '/galeria': { title: 'Galería | Forward Vision', description: 'Explora la galería de Forward Vision y conoce nuestra tecnología de conectividad y entretenimiento.' },
  '/testimonios': { title: 'Testimonios de Clientes | Forward Vision', description: 'Conoce las experiencias de clientes que disfrutan internet fibra óptica y TV digital con Forward Vision.' },
  '/privacidad': { title: 'Política de Privacidad | Forward Vision', description: 'Consulta la política de privacidad y protección de datos personales de Forward Vision.' },
  '/terminos': { title: 'Términos y Condiciones | Forward Vision', description: 'Consulta los términos y condiciones de contratación de los servicios Forward Vision.' },
  '/contrato': { title: 'Contrato de Servicios | Forward Vision', description: 'Consulta el contrato estándar de los servicios de internet fibra óptica y TV digital Forward Vision.' },
}

function RouteSeo() {
  const { pathname } = useLocation()
  const seo = seoByPath[pathname]

  if (!seo) return null

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={`https://forwardvision.cloud${pathname}`} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}

// Loading fallback for lazy admin pages
function AdminLoader() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-200 border-t-[#3C0061] rounded-full animate-spin" />
    </div>
  )
}

// Shared wrapper for public pages (Navbar + Footer + background)
function WithNav({ children }) {
  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />
      {children}
      <FloatingPromoBanner />
      <WhatsAppWidget />
      <ChatbotWidget />
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ScrollToTop />
        <RouteSeo />
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
