import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText } from 'lucide-react'

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <Shield size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Seguridad Total</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase italic">Política de <span className="text-cyan-400">Privacidad</span></h1>
          <p className="text-gray-400 font-light">Última actualización: 26 de Abril, 2026</p>
        </motion.div>

        <div className="space-y-12 font-light leading-relaxed text-gray-300">
          <section className="glass-effect p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <Lock size={20} className="text-cyan-400" /> 1. Recopilación de Datos
            </h2>
            <p className="mb-4">
              En Forward Vision, valoramos tu privacidad. Recopilamos información personal (nombre, DNI, dirección, teléfono) únicamente con el fin de proporcionar y mejorar nuestros servicios de conectividad.
            </p>
            <p>
              Estos datos se obtienen a través de nuestro sitio web, chatbot (Filber) y formularios técnicos de factibilidad.
            </p>
          </section>

          <section className="glass-effect p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <Eye size={20} className="text-cyan-400" /> 2. Uso de la Información
            </h2>
            <p className="mb-4">Tu información es utilizada para:</p>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Validar la factibilidad técnica en tu ubicación.</li>
              <li>Coordinar instalaciones y mantenimientos.</li>
              <li>Facturación y soporte al cliente.</li>
              <li>Envío de actualizaciones críticas del servicio.</li>
            </ul>
          </section>

          <section className="glass-effect p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <Shield size={20} className="text-cyan-400" /> 3. Protección de Datos
            </h2>
            <p>
              Implementamos protocolos de seguridad de grado industrial para proteger tus datos contra accesos no autorizados, alteración o divulgación. No compartimos tu información personal con terceros para fines comerciales externos.
            </p>
          </section>

          <section className="p-8 text-center text-xs text-gray-500">
            <p>Para dudas sobre tus datos, contacta a: privacidad@forwardvision.com</p>
          </section>
        </div>
      </div>
    </div>
  )
}
