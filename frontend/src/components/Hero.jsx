import React from 'react'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Facebook } from 'lucide-react'
import ThreeDLogo from './ThreeDLogo'
import logo from '../assets/logo.png'

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* Background Image with Futuristic Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tag */}
          <motion.div
            className="inline-block mb-6"
            variants={itemVariants}
          >
            <span className="bg-[#ff6b00] text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(255,107,0,0.4)]">
              ¡NUEVOS PLANES GIGA!
            </span>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="flex gap-4 mb-8 text-gray-400"
            variants={itemVariants}
          >
            {[
              { icon: Facebook, href: 'https://facebook.com/forwardvision' },
              { icon: () => (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-.13 5.35.14 10.74-1.62 15.91-1.75 5.12-7.39 8.23-12.73 7.48-5.3-.7-9.27-5.51-8.89-10.86.34-5.34 5.22-9.69 10.56-9.1 1.28.1 2.52.48 3.62 1.16.14-3.12-.13-6.24.13-9.36.01-1.25.05-2.49.06-3.73z"/>
                </svg>
              ), href: 'https://tiktok.com/@forwardvision' },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                className="w-10 h-10 glass-effect rounded-xl flex items-center justify-center hover:text-cyan-400 transition-all border border-white/5"
                whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                {typeof social.icon === 'function' ? <social.icon /> : <social.icon size={20} />}
              </motion.a>
            ))}
          </motion.div>

          {/* Main Heading */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none text-white tracking-tight">
              Velocidad Giga y <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500 neon-text-cyan">
                Entretenimiento Total
              </span><br />
              Para Tu Hogar
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
              La evolución de la fibra óptica ha llegado. Disfruta de internet simétrico de ultra-velocidad y TV 4K sin interrupciones.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-6 pt-10"
            variants={itemVariants}
          >
            <motion.a
              href="https://wa.me/51900970806?text=Hola,%20necesito%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20Forward%20Vision."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-[#00a3ff] text-white rounded-xl font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(0,163,255,0.4)] hover:shadow-[0_0_40px_rgba(0,163,255,0.6)] group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>CONTRATAR AHORA</span>
              <div className="bg-white/20 p-1 rounded-full group-hover:bg-white group-hover:text-[#00a3ff] transition-all">
                <Play size={16} fill="currentColor" />
              </div>
            </motion.a>

            <motion.a
              href="/planes"
              className="px-10 py-4 border-2 border-white/10 text-white rounded-xl font-bold glass-effect hover:bg-white/5 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              EXPLORAR PLANES
              <ArrowRight size={20} className="text-cyan-400" />
            </motion.a>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-white/10 mt-16"
            variants={itemVariants}
          >
            {[
              { label: 'FIBRA REAL', value: '100%' },
              { label: 'LATENCIA', value: '< 2ms' },
              { label: 'CANALES HD', value: '+100' },
              { label: 'SOPORTE AI', value: '24/7' },
            ].map((stat, idx) => (
              <div key={idx}>
                <p className="text-cyan-400 text-3xl font-black mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Logo Column */}
        <motion.div 
          className="flex justify-center items-center mt-12 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        >

          <ThreeDLogo textureUrl={logo} />
        </motion.div>
      </div>

      {/* Futuristic Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 right-10 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="h-24 w-[2px] bg-gradient-to-b from-transparent via-cyan-500 to-magenta-500 relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
            animate={{ y: ['0%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase vertical-text text-gray-500">SCROLL</span>
      </motion.div>
    </section>
  )
}
