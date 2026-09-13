import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MessageCircle } from 'lucide-react'

const phoneNumber = '51900970806'

export default function FloatingPromoBanner() {
  const [closedPromos, setClosedPromos] = useState([])

  const promos = useMemo(
    () => [
      {
        id: 'liga-max',
        eyebrow: 'Plan destacado',
        title: 'LIGA MAX',
        detail: 'Más potencia para todos tus dispositivos.',
        value: 'Hasta 700 Mbps',
        message: 'Hola, quiero información del plan LIGA MAX.',
      },
      {
        id: 'primer-mes',
        eyebrow: 'Promoción especial',
        title: 'Primer mes a S/ 35',
        detail: 'Disfruta fibra óptica desde el primer día.',
        value: 'Oferta activa',
        message: 'Hola, quiero la promoción del primer mes a S/ 35.',
      },
      {
        id: 'instalacion',
        eyebrow: 'Beneficio exclusivo',
        title: 'Instalación gratis',
        detail: 'Activa tu servicio sin costo adicional.',
        value: '100% fibra óptica',
        message: 'Hola, quiero contratar con instalación gratis.',
      },
    ],
    []
  )

  return (
    <AnimatePresence>
      {promos.map((promo, index) => {
        if (closedPromos.includes(promo.id)) return null
        return (
          <motion.aside
            key={promo.id}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.25, delay: index * 0.08 }}
            className={`promo-float promo-float-${index + 1} fixed z-50 shadow-[0_16px_45px_rgba(0,0,0,0.22)]`}
          >
            <div className="promo-content relative p-5">
              <button
                type="button"
                onClick={() => setClosedPromos((current) => [...current, promo.id])}
                aria-label={`Cerrar promoción ${promo.title}`}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center bg-black text-white transition hover:bg-gray-700"
              >
                <X size={13} />
              </button>

              <div className="pr-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{promo.eyebrow}</p>
                <h3 className="mt-1 text-xl font-black leading-tight text-black">{promo.title}</h3>
              </div>

              <p className="mt-4 text-sm leading-5 text-gray-600">{promo.detail}</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-200 pt-4">
                <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black">{promo.value}</span>
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(promo.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-black px-3 py-2.5 text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-gray-700"
                >
                  <MessageCircle size={12} /> Consultar <ArrowRight size={12} />
                </a>
              </div>
            </div>
          </motion.aside>
        )
      })}
    </AnimatePresence>
  )
}
