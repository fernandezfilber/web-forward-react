import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MessageCircle, Sparkles } from 'lucide-react'

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
            className={`promo-float promo-card promo-card-${index + 1} promo-float-${index + 1} fixed z-50`}
          >
            <div className="promo-content">
              <button
                type="button"
                onClick={() => setClosedPromos((current) => [...current, promo.id])}
                aria-label={`Cerrar promoción ${promo.title}`}
                className="promo-close"
              >
                <X size={13} />
              </button>

              <div className="promo-heading">
                <span className="promo-eyebrow"><Sparkles size={14} /> {promo.eyebrow}</span>
                <h3 className="promo-title">{promo.title}</h3>
              </div>

              <p className="promo-detail">{promo.detail}</p>
              <div className="promo-footer">
                <span className="promo-value">{promo.value}</span>
                <a
                  href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(promo.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="promo-cta"
                >
                  <MessageCircle size={15} /> Consultar <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </motion.aside>
        )
      })}
    </AnimatePresence>
  )
}
