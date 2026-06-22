import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Wifi,
  Tv,
  Package,
  Clock,
  Headphones,
  MapPin,
  ArrowRight,
  Zap
} from 'lucide-react'

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const services = [
    {
      icon: Wifi,
      title: 'Internet Fibra Óptica',
      description:
        'Navega a velocidades ultra rápidas con nuestra red 100% fibra óptica simétrica.',
      color: 'from-cyan-500 to-blue-600',
      link: '/planes'
    },
    {
      icon: Tv,
      title: 'Televisión Digital 4K',
      description:
        'Más de 150 canales en 4K y HD con la mejor programación exclusiva para tu hogar.',
      color: 'from-magenta-500 to-purple-600',
      link: '/planes'
    },
    {
      icon: Package,
      title: 'Planes GIGA Dúo',
      description:
        'Internet + Cable en un solo paquete ultra-potente con beneficios exclusivos.',
      color: 'from-blue-500 to-indigo-600',
      link: '/planes'
    },
    {
      icon: Clock,
      title: 'Instalación Express',
      description:
        'Conexión garantizada en menos de 24 horas con equipos de última generación.',
      color: 'from-orange-500 to-red-600',
      link: '/planes'
    },
    {
      icon: Headphones,
      title: 'Soporte AI 24/7',
      description:
        'Asistencia técnica inteligente disponible en todo momento para tu tranquilidad.',
      color: 'from-emerald-500 to-teal-600',
      link: '/soporte'
    },
    {
      icon: MapPin,
      title: 'Cobertura Total',
      description:
        'Expandimos nuestra red de fibra óptica para llegar a cada rincón con calidad total.',
      color: 'from-yellow-500 to-amber-600',
      link: '/cobertura'
    },
  ]

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section
      id="services"
      className="py-24 md:py-40 px-4 sm:px-6 lg:px-8 bg-[#030712] relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-900/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-magenta-900/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20 md:mb-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-8">
            <Zap size={14} className="text-cyan-400 fill-cyan-400" />
            <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
              Ecosistema Digital
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Servicios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Próxima Generación</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Diseñamos soluciones tecnológicas que transforman tu manera de conectar, trabajar y disfrutar.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                className="group relative cursor-pointer"
                variants={itemVariants}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              >
                <motion.div
                  className="relative h-full glass-effect rounded-3xl p-10 border border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex flex-col overflow-hidden"
                  animate={{
                    y: hoveredIndex === index ? -12 : 0,
                  }}
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Icon Container */}
                  <motion.div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon size={24} className="text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 font-light leading-relaxed flex-grow mb-8">
                    {service.description}
                  </p>

                  {/* CTA */}
                  <button
                    className="flex items-center text-sm font-black tracking-widest text-cyan-400 uppercase group/link"
                  >
                    <span>Consultar con Forward AI</span>
                    <ArrowRight size={16} className="ml-2 group-hover/link:translate-x-2 transition-transform" />
                  </button>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-block p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 to-magenta-500">
            <motion.a
              href="/planes"
              className="block px-12 py-4 bg-[#030712] rounded-2xl text-white font-black text-xs tracking-[0.2em] uppercase hover:bg-transparent transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver Catálogo Completo
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
