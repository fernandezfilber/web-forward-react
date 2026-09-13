import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, PhoneCall } from 'lucide-react'

const WHATSAPP = 'https://wa.me/51900970806?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20planes%20de%20Forward%20Vision.'

const stats = [
  { value: '100%', label: 'Fibra Real' },
  { value: '1 Gbps', label: 'Velocidad Max.' },
  { value: '+100', label: 'Canales HD' },
  { value: '24/7', label: 'Soporte' },
]

const fadeUp = (i) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: 'easeOut' },
  },
})

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-[#f5f5f5]">

      {/* Video de fondo — horizontal en desktop, vertical en movil */}
      <div className="absolute inset-0 z-0">
        <video
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline poster="/hero-bg.png"
        >
          <source src="/horizontal.mp4" type="video/mp4" />
        </video>
        <video
          className="block md:hidden absolute inset-0 w-full h-full object-cover"
          autoPlay loop muted playsInline poster="/hero-bg.png"
        >
          <source src="/vertical.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hero-overlay" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-32 lg:py-36">

        <motion.span
          variants={fadeUp(0)} initial="hidden" animate="visible"
          className="inline-block text-[11px] font-black tracking-[0.18em] uppercase bg-black/10 border border-black/20 text-black px-4 py-1.5 rounded-full mb-6"
        >
          Nuevos Planes GIGA 2026
        </motion.span>

        <motion.h1
          variants={fadeUp(1)} initial="hidden" animate="visible"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.06] tracking-tight max-w-3xl mb-6"
        >
          Internet Fibra Optica
          <br />
          <span className="text-black/70">y Cable TV</span>
          <br />
          para tu Hogar
        </motion.h1>

        <motion.p
          variants={fadeUp(2)} initial="hidden" animate="visible"
          className="text-base sm:text-lg text-black/70 leading-relaxed max-w-lg mb-10 font-light"
        >
          Velocidad simetrica real desde 250 Mbps hasta 1 Gbps. Television digital con mas de 100 canales HD. Sin cortes, sin excusas.
        </motion.p>

        <motion.div
          variants={fadeUp(3)} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-14"
        >
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="btn-brand justify-center">
            <PhoneCall size={17} />
            Contratar Ahora
          </a>
          <a href="/planes" className="btn-outline justify-center">
            Ver Planes
            <ArrowRight size={17} />
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp(4)} initial="hidden" animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 border-t border-black/20 pt-10"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-2xl sm:text-3xl font-black text-black mb-1">{s.value}</p>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-black/50">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
