import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Timer } from 'lucide-react'

const PROMOS = [
  {
    id: 1,
    badge: 'Sin costo adicional',
    title: 'Instalacion\nGRATIS',
    desc: 'Olvídate del costo de instalacion. Tecnicos certificados llegan a tu hogar sin cobro extra.',
    items: ['Instalacion de fibra optica', 'Configuracion de router', 'Prueba de velocidad incluida'],
    accent: '#3C0061',
  },
  {
    id: 2, featured: true,
    badge: 'Oferta de bienvenida',
    title: 'Primer mes a\nS/ 35',
    desc: 'Disfruta tu primer mes de fibra óptica por solo S/ 35, sin costos ocultos.',
    items: ['Aplica a todos los planes', 'Instalación gratis', 'Velocidad simetrica'],
    accent: '#5a0090',
  },
  {
    id: 3,
    badge: 'Planes +S/120',
    title: 'Repetidor WiFi\nGRATIS',
    desc: 'Para planes mayores a S/120 incluimos un repetidor WiFi de alta potencia para cubrir toda tu casa.',
    items: ['Cobertura total del hogar', 'WiFi 6 de alta potencia', 'Configuracion incluida'],
    accent: '#7a00c0',
  },
]

function getExpiry() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
}

function useCountdown() {
  const [t, setT] = useState({ days:0, hours:0, minutes:0, seconds:0 })
  useEffect(() => {
    const expiry = getExpiry()
    const tick = () => {
      const diff = expiry - new Date()
      if (diff <= 0) { setT({ days:0,hours:0,minutes:0,seconds:0 }); return }
      setT({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-[#3C0061] rounded-xl flex items-center justify-center shadow">
        <span className="text-2xl font-black text-white tabular-nums">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="text-gray-500 text-xs mt-1.5 uppercase tracking-widest font-medium">{label}</span>
    </div>
  )
}

export default function Promociones() {
  const { days, hours, minutes, seconds } = useCountdown()
  const expiry = getExpiry()

  return (
    <section id="promociones" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-label">Tiempo limitado</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
            Beneficios que no<br />
            <span className="text-[#3C0061]">encontraras en otro lugar</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-lg mx-auto font-light">
            Contrata hoy y aprovecha todas estas ventajas exclusivas para nuevos clientes.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center mb-12">
          <div className="inline-flex items-center gap-2 text-red-500 font-bold text-sm mb-4">
            <Timer size={16} className="animate-pulse" />
            Oferta termina en
            <Timer size={16} className="animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <CountdownBox value={days} label="dias" />
            <span className="text-gray-300 text-3xl font-black mb-5">:</span>
            <CountdownBox value={hours} label="horas" />
            <span className="text-gray-300 text-3xl font-black mb-5">:</span>
            <CountdownBox value={minutes} label="min" />
            <span className="text-gray-300 text-3xl font-black mb-5">:</span>
            <CountdownBox value={seconds} label="seg" />
          </div>
          <p className="text-gray-400 text-xs mt-3">
            Valido hasta el {expiry.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
          {PROMOS.map((p) => {
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`card relative overflow-hidden flex flex-col ${p.featured ? 'ring-2 ring-[#3C0061] shadow-lg' : ''}`}
              >
                {p.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-[#3C0061] text-white text-[10px] font-black rounded-full tracking-widest uppercase">
                      Mas popular
                    </span>
                  </div>
                )}
                <div className="h-1 w-full" style={{ background: p.accent }} />
                <div className="p-7 flex flex-col flex-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-4">{p.badge}</span>
                  <h3 className="text-xl font-black text-gray-900 leading-tight mb-3 whitespace-pre-line">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2 mb-7">
                    {p.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 size={15} className="text-[#3C0061] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a href="/planes" className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                    style={{ background: p.accent }}>
                    Ver planes <ArrowRight size={15} />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          Promociones validas para nuevos clientes. Consulta terminos y condiciones.
        </p>
      </div>
    </section>
  )
}
