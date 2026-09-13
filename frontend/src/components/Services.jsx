import React from 'react'
import { motion } from 'framer-motion'
import { Wifi, Tv, Package, Clock, Headphones, MapPin, ArrowRight } from 'lucide-react'

const services = [
  { icon: Wifi,       title: 'Internet Fibra Optica',   desc: 'Navega a velocidades ultra rapidas con nuestra red 100% fibra optica simetrica.', link: '/planes' },
  { icon: Tv,         title: 'Television Digital 4K',   desc: 'Mas de 150 canales en 4K y HD con la mejor programacion para tu hogar.',          link: '/planes' },
  { icon: Package,    title: 'Planes GIGA Duo',          desc: 'Internet y Cable en un solo paquete potente con beneficios exclusivos.',            link: '/planes' },
  { icon: Clock,      title: 'Instalacion Express',      desc: 'Conexion garantizada en menos de 24 horas con equipos de ultima generacion.',      link: '/planes' },
  { icon: Headphones, title: 'Soporte 24/7',             desc: 'Asistencia tecnica disponible en todo momento para tu tranquilidad.',              link: '/soporte' },
  { icon: MapPin,     title: 'Cobertura Total',          desc: 'Expandimos nuestra red de fibra optica para llegar a cada rincon con calidad.',    link: '/cobertura' },
]

export default function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="section-label">Lo que ofrecemos</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Servicios de <span className="text-[#3C0061]">Proxima Generacion</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto font-light">
            Disenamos soluciones tecnologicas que transforman tu manera de conectar, trabajar y disfrutar.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {services.map((s, i) => (
            <motion.a
              href={s.link}
              key={i}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card p-7 flex flex-col gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3C0061] flex items-center justify-center shrink-0">
                <s.icon size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
              <span className="mt-auto flex items-center gap-1 text-[#3C0061] text-[13px] font-semibold">
                Ver mas <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
