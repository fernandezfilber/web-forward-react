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
      className="floating-contact-button fixed bottom-[calc(10.25rem+env(safe-area-inset-bottom))] right-4 z-40 flex min-h-12 items-center gap-2 rounded-full bg-[#25D366] px-3 py-2.5 text-white shadow-[0_8px_24px_rgba(19,45,53,0.2)] transition-shadow pulse-heartbeat sm:right-6 md:bottom-28 md:gap-3 md:px-4 md:py-3"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      aria-label="Contáctanos por WhatsApp"
    >
      <MessageCircle size={23} strokeWidth={2.5} aria-hidden="true" />
      <span className="text-xs font-bold leading-tight sm:text-sm md:text-base">Contáctanos por WhatsApp</span>
    </motion.a>
  )
}
