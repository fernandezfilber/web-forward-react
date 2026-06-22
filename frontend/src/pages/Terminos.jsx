import React from 'react'
import { motion } from 'framer-motion'
import { FileText, AlertCircle, CheckCircle, Scale } from 'lucide-react'

export default function Terminos() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 mb-6">
            <Scale size={14} className="text-magenta-400" />
            <span className="text-[10px] font-black tracking-widest uppercase text-magenta-400">Marco Legal</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase italic">Términos y <span className="text-magenta-400">Condiciones</span></h1>
          <p className="text-gray-400 font-light">Acuerdo de Servicio Forward Vision</p>
        </motion.div>

        <div className="space-y-8 font-light text-gray-400 leading-relaxed">
          <section className="glass-effect p-8 rounded-3xl border border-white/5">
             <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
               <AlertCircle size={20} className="text-magenta-400" /> 1. Aceptación de Términos
             </h2>
             <p className="text-sm">
               Al contratar nuestros servicios de Internet y TV, el usuario acepta cumplir con las condiciones establecidas en este documento. Forward Vision se reserva el derecho de modificar estos términos previo aviso de 15 días.
             </p>
          </section>

          <section className="glass-effect p-8 rounded-3xl border border-white/5">
             <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
               <CheckCircle size={20} className="text-magenta-400" /> 2. Prestación del Servicio
             </h2>
             <p className="text-sm mb-4">
               El servicio de Internet se entrega mediante fibra óptica pura (FTTH) hasta el domicilio del cliente. La velocidad contratada es simétrica (misma velocidad de subida y bajada).
             </p>
             <p className="text-sm">
               Forward Vision garantiza una disponibilidad del servicio del 99.5% mensual, salvo casos de fuerza mayor o mantenimientos programados informados con antelación.
             </p>
          </section>

          <section className="glass-effect p-8 rounded-3xl border border-white/5">
             <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
               <FileText size={20} className="text-magenta-400" /> 3. Equipos y Propiedad
             </h2>
             <p className="text-sm">
               Los routers (ONT) y decodificadores se entregan en modalidad de comodato. El cliente es responsable del cuidado de los mismos y deberá devolverlos en caso de cancelación del servicio. El daño por mal uso tendrá un cargo de reposición.
             </p>
          </section>

          <section className="glass-effect p-8 rounded-3xl border border-white/5">
             <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
               <Scale size={20} className="text-magenta-400" /> 4. Pagos y Suspensión
             </h2>
             <p className="text-sm">
               La facturación es mensual por adelantado. El retraso en el pago por más de 5 días generará la suspensión automática del servicio. La reconexión se activará tras la validación del pago.
             </p>
          </section>
        </div>
      </div>
    </div>
  )
}
