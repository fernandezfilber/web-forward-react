import { Home, Video, Users, Bell, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const items = [
  { icon: Home, label: 'Inicio', path: '/' },
  { icon: Video, label: 'Planes', path: '/planes' },
  { icon: Users, label: 'Nosotros', path: '/nosotros' },
  { icon: Bell, label: 'Soporte', path: '/soporte' },
  { icon: User, label: 'Perfil', path: '/perfil' },
]

export default function MobileBottomBar() {
  const { pathname } = useLocation()

  return (
    <nav className="mobile-bottom-bar" aria-label="Navegación principal">
      {items.map(({ icon: Icon, label, path }) => {
        const active = pathname === path

        return (
          <Link
            key={path}
            to={path}
            aria-current={active ? 'page' : undefined}
            className={`mobile-bottom-bar-link${active ? ' is-active' : ''}`}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
