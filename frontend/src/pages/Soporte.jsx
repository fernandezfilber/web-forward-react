import React from 'react'
import { motion } from 'framer-motion'
import { Headphones, MessageCircle, FileText, Wrench, Zap, Mail, Phone, ExternalLink, HelpCircle, ShieldCheck } from 'lucide-react'

export default function Soporte() {
  const faqs = [
    {
      q: "¿Cómo puedo cambiar mi contraseña de WiFi?",
      a: "Puedes gestionarlo directamente desde nuestro portal de cliente o escribirnos por WhatsApp. Un asesor técnico te ayudará a configurarlo de forma remota en minutos."
    },
    {
      q: "¿Qué hago si mi servicio de internet no conecta?",
      a: "Primero, desconecta tu router por 30 segundos. Si el indicador 'PON' parpadea en rojo, comunícate inmediatamente con nuestro soporte AI para una validación de línea automática."
    },
    {
      q: "¿Cuáles son los métodos de pago aceptados?",
      a: "Aceptamos pagos vía Yape, Plin, Transferencia Bancaria (BCP, BBVA, Interbank) y pagos físicos en agentes autorizados."
    },
    {
      q: "¿La instalación tiene costo?",
      a: "Actualmente contamos con promociones de instalación costo S/ 0 (Gratuita) sujeta a evaluación técnica de tu ubicación. ¡Consulta con Filber!"
    }
  ]

  const contactMethods = [
    {
      icon: <MessageCircle size={24} />,
      title: "WhatsApp VIP",
      desc: "+51 900 970 806",
      link: "https://wa.me/51900970806",
      color: "text-green-400"
    },
    {
      icon: <Mail size={24} />,
      title: "Correo Técnico",
      desc: "soporte@forwardvision.com",
      link: "mailto:soporte@forwardvision.com",
      color: "text-cyan-400"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Center",
      desc: "Lunes a Sábado 8am - 8pm",
      link: "tel:+51900970806",
      color: "text-magenta-400"
    }
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header section with background glow */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Headphones size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-cyan-400">Atención 24/7</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">
              Centro de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Ayuda</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              ¿Tienes problemas con tu conexión o dudas sobre tu plan? Nuestro equipo experto está listo para conectarte de nuevo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Contact Cards */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, idx) => (
              <motion.a
                key={idx}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-[2rem] glass-effect border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col items-center text-center"
              >
                <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${method.color}`}>
                  {method.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 uppercase italic">{method.title}</h3>
                <p className="text-gray-400 text-sm mb-6 font-light">{method.desc}</p>
                <div className="mt-auto flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-cyan-400">
                   Contactar <ExternalLink size={12} />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black tracking-tight mb-4 uppercase">Preguntas <span className="text-cyan-400">Frecuentes</span></h2>
              <p className="text-gray-500 font-light">Resoluciones rápidas para las dudas más comunes.</p>
           </div>

           <div className="space-y-4">
             {faqs.map((faq, idx) => (
               <motion.div
                 key={idx}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="p-6 rounded-2xl glass-effect border border-white/5 hover:border-white/10 transition-all"
               >
                 <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <HelpCircle size={18} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-3 italic">{faq.q}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-light">
                        {faq.a}
                      </p>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Tech Support Callout */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-12 rounded-[3rem] bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border border-white/10 overflow-hidden">
             <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 blur-[60px] rounded-full" />
             
             <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
               <div>
                 <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight italic uppercase leading-none">¿Problema <br /> Complejo?</h2>
                 <p className="text-gray-400 font-light leading-relaxed mb-8">
                   Si necesitas una visita técnica presencial para reubicar tu router o revisar tu cableado, nuestro equipo de campo puede programar una visita en menos de 24 horas.
                 </p>
                 <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-cyan-50 transition-all">
                    Agendar Visita Técnica
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 {[
                   { icon: Zap, label: 'Respuesta Veloz' },
                   { icon: Wrench, label: 'Reparación Pro' },
                   { icon: ShieldCheck, label: 'Garantía Total' },
                   { icon: Headphones, label: 'Asesoría VIP' }
                 ].map((item, i) => {
                   const IconComponent = item.icon
                   return (
                     <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center">
                       <IconComponent size={24} className="text-cyan-400 mb-2" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                     </div>
                   )
                 })}
               </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
