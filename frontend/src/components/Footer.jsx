import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Twitter } from 'lucide-react'
import logo from '../assets/logo.png'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/forwardvision' },
    { icon: () => (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 5.35.14 10.74-1.62 15.91-1.75 5.12-7.39 8.23-12.73 7.48-5.3-.7-9.27-5.51-8.89-10.86.34-5.34 5.22-9.69 10.56-9.1 1.28.1 2.52.48 3.62 1.16.14-3.12-.13-6.24.13-9.36.01-1.25.05-2.49.06-3.73z"/>
      </svg>
    ), label: 'TikTok', href: 'https://tiktok.com/@forwardvision' },
  ]

  const footerLinks = [
    {
      title: 'Planes',
      links: [
        { label: 'Giga Fibra', href: '/planes' },
        { label: 'TV 4K Ultra', href: '/planes' },
        { label: 'Dúos Pro', href: '/planes' },
      ],
    },
    {
      title: 'Ayuda',
      links: [
        { label: 'Soporte AI', href: '/soporte' },
        { label: 'Galería', href: '/galeria' },
        { label: 'Testimonios', href: '/testimonios' },
        { label: 'Cobertura', href: '/cobertura' },
        { label: 'FAQ', href: '/soporte' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacidad', href: '/privacidad' },
        { label: 'Términos', href: '/terminos' },
        { label: 'Contrato', href: '/contrato' },
      ],
    },
  ]

  return (
    <footer className="bg-white text-black pt-24 pb-8 border-t border-gray-200 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-100 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid md:grid-cols-6 gap-12 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <div className="flex items-center mb-6">
              <img src={logo} alt="Forward Vision" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed mb-8 max-w-xs">
              Conectamos hogares con el futuro a través de fibra óptica real y entretenimiento sin límites.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 hover:text-black rounded-xl flex items-center justify-center transition-all border border-gray-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {typeof social.icon === 'function' ? <social.icon /> : <social.icon size={18} />}
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Links */}
          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <h4 className="font-black text-xs tracking-[0.2em] uppercase text-black mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-black transition-colors text-sm font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <h4 className="font-black text-xs tracking-[0.2em] uppercase text-black mb-6">Contacto</h4>
            <div className="space-y-4">
              <a
                href="mailto:contacto@forwardvision.com"
                className="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors text-sm font-light"
              >
                <Mail size={16} className="text-black" />
                <span>contacto@forwardvision.com</span>
              </a>
              <a
                href="tel:+51900970806"
                className="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors text-sm font-light"
              >
                <Phone size={16} className="text-black" />
                <span>+51 900970806</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-500 text-sm font-light">
                <MapPin size={16} className="text-black" />
                <span>Lima, Perú</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between text-gray-400 text-[10px] font-bold tracking-widest uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p>
              &copy; {currentYear} Forward Vision Technology. All rights reserved.
            </p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <a href="/privacidad" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="/terminos" className="hover:text-black transition-colors">Terms of Service</a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
