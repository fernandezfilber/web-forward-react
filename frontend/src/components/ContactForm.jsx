import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Loader, Zap, MessageCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Por favor completa los campos obligatorios.')
      return
    }

    setStatus('sending')
    const phoneNumber = "51900970806"
    const text = `🚀 *Nuevo Contacto Forward Vision*\n\n*Nombre:* ${formData.name}\n*Email:* ${formData.email}\n*Tel:* ${formData.phone || 'N/A'}\n\n*Mensaje:* ${formData.message}`
    
    setTimeout(() => {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank')
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setTimeout(() => setStatus(null), 5000)
    }, 1000)
  }

  const contactInfo = [
    { icon: Mail, label: 'Email Corporativo', value: 'contacto@forwardvision.com', color: 'text-cyan-400' },
    { icon: Phone, label: 'Atención al Cliente', value: '+51 900 970 806', color: 'text-magenta-400' },
    { icon: MapPin, label: 'Central Técnica', value: 'Ate / Santa Anita, Lima', color: 'text-blue-400' },
  ]

  return (
    <section id="contact" className="py-32 px-4 bg-[#030712] text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-magenta-500/5 blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Canales Abiertos</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic">
              ¿Hablamos de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">Conexión?</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">
              Nuestro equipo de ingeniería y ventas está listo para darte la mejor experiencia en fibra óptica.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-6 rounded-3xl glass-effect border border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${info.color} group-hover:scale-110 transition-transform`}>
                     <info.icon size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black tracking-widest uppercase text-gray-500 mb-1">{info.label}</p>
                     <p className="text-sm font-bold">{info.value}</p>
                   </div>
                </div>
              </motion.div>
            ))}

            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
               <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                 <MessageCircle size={20} className="text-cyan-400" />
                 Soporte Rápido
               </h4>
               <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                 ¿Buscas una solución inmediata? Escríbenos por WhatsApp y nuestro asistente IA Filber te atenderá en segundos.
               </p>
               <a href="https://wa.me/51900970806" className="text-xs font-black tracking-widest uppercase text-cyan-400 hover:text-white transition-colors">
                 Abrir Chat Directo →
               </a>
            </div>
          </div>

          {/* Form */}
          <motion.div
            className="lg:col-span-8 glass-effect rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Email de Contacto</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Teléfono (WhatsApp)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+51 900 000 000"
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest uppercase text-gray-500 ml-4">Mensaje / Consulta</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  rows={5}
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/50 transition-all resize-none"
                />
              </div>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-xl text-center">
                    ✓ Redirigiendo a WhatsApp... ¡Hablamos pronto!
                  </motion.div>
                )}
                {errorMessage && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl text-center">
                    ⚠ {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-black text-xs tracking-[0.3em] uppercase italic flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
              >
                {status === 'sending' ? <Loader className="animate-spin" /> : <><Send size={18} /> Enviar Mensaje Técnico</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
