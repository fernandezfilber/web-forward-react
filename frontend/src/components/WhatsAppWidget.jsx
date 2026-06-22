import React from 'react'
import { motion } from 'framer-motion'

export default function WhatsAppWidget() {
  const phoneNumber = "51900970806"
  const defaultMessage = "Hola, necesito más información sobre los servicios de Forward Vision."
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-14 right-44 md:right-52 w-16 h-16 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full shadow-[0_0_30px_rgba(37,211,102,0.4)] flex items-center justify-center z-40 transition-shadow pulse-heartbeat"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      aria-label="Contactar por WhatsApp"
    >
      <svg
        viewBox="0 0 24 24"
        width="40"
        height="40"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="fill-current text-white"
      >
        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.149-1.265-.466-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.098-.203.048-.377-.027-.525-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"></path>
        <path d="M20.52 3.449A11.964 11.964 0 0012 0C5.373 0 0 5.373 0 12c0 2.126.549 4.2 1.593 6.03L.028 23.974l6.096-1.597A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12 0-3.204-1.248-6.21-3.48-8.551zM12 21.977c-1.802 0-3.565-.48-5.112-1.393l-.366-.217-3.799.996.996-3.704-.238-.379a9.92 9.92 0 01-1.528-5.303C1.953 6.471 6.442 2 12 2c2.68 0 5.198 1.043 7.094 2.938A9.972 9.972 0 0122 12c0 5.529-4.489 10.018-10.018 10.018l.018-.041z"></path>
      </svg>
    </motion.a>
  )
}
