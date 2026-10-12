import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppWidget() {
  const phoneNumber = "51900970806"
  const defaultMessage = "Hola, necesito más información sobre los servicios de Forward Vision."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-contact-button fixed bottom-28 right-4 sm:right-6 z-40 flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-shadow pulse-heartbeat"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      aria-label="Contáctanos por WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2.5} aria-hidden="true" />
      <span className="text-sm font-bold leading-tight sm:text-base">Contáctanos por WhatsApp</span>
    </motion.a>
  )
}
