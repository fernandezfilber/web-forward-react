import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Briefcase, Zap } from 'lucide-react'

export default function Contrato() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <Briefcase size={14} className="text-blue-400" />
            <span className="text-[10px] font-black tracking-widest uppercase text-blue-400">Formalidad Digital</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase italic">Contrato de <span className="text-blue-400">Servicios</span></h1>
          <p className="text-gray-400 font-light">Documento Estándar de Adhesión</p>
        </motion.div>

        <div className="glass-effect rounded-[3rem] p-10 md:p-16 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] -z-10" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-white/10 pb-12">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Contrato Único Forward</h2>
              <p className="text-gray-500 text-sm">Válido para servicios residenciales y PyME.</p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-400 hover:text-white transition-all shadow-xl">
              <Download size={18} /> Descargar PDF
            </button>
          </div>

          <div className="space-y-8 font-light text-sm text-gray-400 leading-relaxed max-h-[500px] overflow-y-auto pr-6 custom-scrollbar">
            <h3 className="text-lg font-bold text-white mb-4">Cláusula Primera: Objeto</h3>
            <p>
              El presente contrato tiene por objeto la prestación de servicios de telecomunicaciones por parte de FORWARD VISION TECHNOLOGY S.A.C. a favor del CLIENTE, consistente en el acceso a la red de internet de banda ancha mediante fibra óptica y/o televisión por cable digital.
            </p>

            <h3 className="text-lg font-bold text-white mb-4">Cláusula Segunda: Tarifas y Pagos</h3>
            <p>
              El CLIENTE se obliga a pagar mensualmente la tarifa correspondiente al plan seleccionado. Los precios incluyen IGV. El pago deberá realizarse antes de la fecha de vencimiento indicada en el recibo digital.
            </p>

            <h3 className="text-lg font-bold text-white mb-4">Cláusula Tercera: Instalación y Mantenimiento</h3>
            <p>
              FORWARD VISION realizará la instalación de los equipos necesarios en el domicilio declarado. El CLIENTE autoriza el ingreso del personal técnico debidamente identificado. El mantenimiento preventivo está incluido sin costo adicional.
            </p>

            <h3 className="text-lg font-bold text-white mb-4">Cláusula Cuarta: Duración</h3>
            <p>
              El contrato tiene una duración indefinida, pudiendo el CLIENTE solicitar la baja del servicio con un preaviso de 15 días, sin penalidades, siempre que se encuentre al día en sus pagos y devuelva los equipos en buen estado.
            </p>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 mt-12">
               <div className="flex items-center gap-4 mb-4">
                  <Zap size={24} className="text-blue-400" />
                  <h4 className="font-bold text-white italic">Firma Digital Forward</h4>
               </div>
               <p className="text-xs italic">
                 Este documento es aceptado digitalmente al momento de la contratación y activación del servicio a través de nuestros canales oficiales.
               </p>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-gray-500 text-sm mb-6">¿Necesitas un contrato corporativo personalizado?</p>
          <a href="/soporte" className="text-blue-400 font-bold hover:underline">Hablar con un Asesor Corporativo →</a>
        </div>
      </div>
    </div>
  )
}
