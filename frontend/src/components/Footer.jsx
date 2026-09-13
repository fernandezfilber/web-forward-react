import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook } from 'lucide-react'

const footerLinks = [
  { title: 'Planes', links: [
    { label: 'Giga Fibra',  href: '/planes' },
    { label: 'TV Digital',  href: '/planes' },
    { label: 'Duos Pro',    href: '/planes' },
  ]},
  { title: 'Ayuda', links: [
    { label: 'Soporte',     href: '/soporte' },
    { label: 'Galeria',     href: '/galeria' },
    { label: 'Testimonios', href: '/testimonios' },
    { label: 'Cobertura',   href: '/cobertura' },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacidad',  href: '/privacidad' },
    { label: 'Terminos',    href: '/terminos' },
    { label: 'Contrato',    href: '/contrato' },
  ]},
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand */}
          <div className="lg:col-span-2">
            <img src="/logo.png" alt="Forward Vision" className="h-14 w-auto object-contain mb-5" />
            <p className="text-sm text-white/55 leading-relaxed max-w-xs mb-6">
              Conectamos hogares con el futuro a traves de fibra optica real y entretenimiento sin limites.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/forwardvision" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#3C0061] flex items-center justify-center transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://tiktok.com/@forwardvision" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#3C0061] flex items-center justify-center transition-colors">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 5.35.14 10.74-1.62 15.91-1.75 5.12-7.39 8.23-12.73 7.48-5.3-.7-9.27-5.51-8.89-10.86.34-5.34 5.22-9.69 10.56-9.1 1.28.1 2.52.48 3.62 1.16.14-3.12-.13-6.24.13-9.36.01-1.25.05-2.49.06-3.73z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-black tracking-[0.18em] uppercase text-white/40 mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-white/65 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 py-6 border-t border-white/10 border-b border-white/10 mb-8 text-sm text-white/55">
          <a href="mailto:contacto@forwardvision.com" className="flex items-center gap-2 hover:text-white transition-colors">
            <Mail size={14} /> contacto@forwardvision.com
          </a>
          <a href="tel:+51900970806" className="flex items-center gap-2 hover:text-white transition-colors">
            <Phone size={14} /> +51 900 970 806
          </a>
          <span className="flex items-center gap-2">
            <MapPin size={14} /> Lima, Peru
          </span>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-white/35 tracking-widest uppercase">
          <p>&copy; {year} Forward Vision Technology. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/privacidad" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terminos" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
