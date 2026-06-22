import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Package, Wifi, Tv, Star, Check, ArrowRight, Zap, ShieldCheck, Activity } from 'lucide-react'

export default function Planes() {
  const planes = [
    {
      id: 1,
      nombre: 'BÁSICO',
      velocidad: '250',
      unidad: 'Mbps',
      descripcion: 'Navegación fluida y redes sociales.',
      precio: 60,
      caracteristicas: [
        '100% Fibra Óptica Real',
        'Velocidad Simétrica',
        'Más de 100 Canales HD',
        'Soporte AI 24/7',
      ],
      color: 'from-cyan-400 to-blue-500',
      popular: false,
    },
    {
      id: 2,
      nombre: 'NORMAL',
      velocidad: '500',
      unidad: 'Mbps',
      descripcion: 'Streaming 4K y Home Office intensivo.',
      precio: 80,
      caracteristicas: [
        '100% Fibra Óptica Real',
        'Velocidad Simétrica',
        'Más de 150 Canales HD',
        'Prioridad de Banda Ancha',
      ],
      color: 'from-blue-500 to-indigo-600',
      popular: true,
    },
    {
      id: 3,
      nombre: 'PREMIUM',
      velocidad: '700',
      unidad: 'Mbps',
      descripcion: 'Gaming Pro y múltiples dispositivos.',
      precio: 100,
      caracteristicas: [
        'Tecnología WiFi 6 Dual Band',
        'Latencia Ultra Baja',
        'Más de 200 Canales 4K',
        'Instalación VIP Express',
      ],
      color: 'from-purple-500 to-magenta-600',
      popular: false,
    },
    {
      id: 4,
      nombre: 'FULL GIGA',
      velocidad: '1000',
      unidad: 'Mbps',
      descripcion: 'Máxima potencia sin límites.',
      precio: 150,
      caracteristicas: [
        'Todo el Ecosistema Forward',
        'Velocidad Extrema Giga',
        'IP Pública Dedicada Opt.',
        'Atención Técnica Inmediata',
      ],
      color: 'from-magenta-500 to-orange-500',
      popular: false,
    },
  ]

  const benefits = [
    { icon: Wifi, title: 'Fibra Real FTTH', desc: 'Conexión pura de vidrio hasta tu router.' },
    { icon: ShieldCheck, title: 'Cero Cortes', desc: 'Red redundante con 99.9% de estabilidad.' },
    { icon: Zap, title: 'Instalación Gratis', desc: 'Activación en menos de 24 horas laborables.' },
    { icon: Activity, title: 'Baja Latencia', desc: 'Optimizado para gaming y videollamadas.' },
  ]

  const whatsappNumber = "51900970806"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": planes.map((plan, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": `Plan Internet ${plan.nombre} ${plan.velocidad} Mbps`,
        "description": plan.descripcion,
        "brand": {
          "@type": "Brand",
          "name": "Forward Vision"
        },
        "offers": {
          "@type": "Offer",
          "price": plan.precio,
          "priceCurrency": "PEN",
          "availability": "https://schema.org/InStock"
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Helmet>
        <title>Planes de Internet Fibra Óptica | Forward Vision</title>
        <meta name="description" content="Descubre nuestros planes de internet de alta velocidad. Desde 250 Mbps hasta 1000 Mbps (Giga). Fibra óptica simétrica con TV Digital incluida. ¡Elige el tuyo!" />
        <link rel="canonical" href="https://forwardvision.cloud/planes" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-900/10 via-magenta-900/5 to-transparent blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Package size={14} className="text-magenta-400" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-magenta-400">Tarifas 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase">
              Elige tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">Velocidad</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Planes diseñados para la era digital. Fibra óptica simétrica, TV Digital y la estabilidad que tu hogar merece.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planes.map((plan, idx) => {
              const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hola! Quiero contratar el plan ${plan.nombre} de ${plan.velocidad} Mbps. ¿Me confirmas cobertura?`)}`
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`group relative glass-effect rounded-[2.5rem] p-8 border border-white/10 flex flex-col h-full transition-all hover:border-cyan-500/30 ${
                    plan.popular ? 'lg:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.1)] ring-2 ring-cyan-500/20' : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className="text-white fill-white" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Más Vendido</span>
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="mb-10">
                    <h3 className="text-xs font-black tracking-[0.3em] text-gray-500 uppercase mb-6 group-hover:text-cyan-400 transition-colors">
                      {plan.nombre}
                    </h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-6xl font-black tracking-tighter leading-none">{plan.velocidad}</span>
                      <span className="text-lg font-bold text-gray-500">{plan.unidad}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-light mt-4 leading-relaxed">
                      {plan.descripcion}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-10 p-6 rounded-3xl bg-white/5 border border-white/5 group-hover:bg-cyan-500/5 transition-colors">
                    <div className="flex items-start">
                      <span className="text-lg font-bold text-cyan-400 mt-1">S/</span>
                      <span className="text-5xl font-black tracking-tighter leading-none mx-1">{plan.precio}</span>
                      <span className="text-sm font-bold text-gray-500 mt-auto mb-1">/mes</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-12 flex-grow">
                    {plan.caracteristicas.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="shrink-0 w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center">
                          <Check size={12} className="text-cyan-400" />
                        </div>
                        <span className="text-[13px] text-gray-300 font-light">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.a
                    href={whatsappLink}
                    target="_blank"
                    className={`w-full py-5 rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${
                      plan.popular 
                        ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-400' 
                        : 'bg-white/5 hover:bg-white/10 text-white'
                    }`}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contratar <ArrowRight size={16} />
                  </motion.a>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Global Features Section */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-white/5 flex items-center justify-center mx-auto mb-8 transition-all group-hover:scale-110 group-hover:border-cyan-500/30">
                  <benefit.icon size={28} className="text-cyan-400" />
                </div>
                <h4 className="text-lg font-black tracking-tight mb-3 uppercase italic">{benefit.title}</h4>
                <p className="text-sm text-gray-400 font-light leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Note / TV Cable */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-effect rounded-[3rem] p-12 border border-white/10 overflow-hidden relative">
             {/* Glow Accent */}
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-magenta-500/10 blur-[80px] -z-10" />

             <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-magenta-500/10 border border-magenta-500/20 mb-6">
                   <Tv size={14} className="text-magenta-400" />
                   <span className="text-[10px] font-black tracking-widest uppercase text-magenta-400">Entretenimiento Pro</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">Experiencia <span className="text-magenta-400">TV Digital</span> 4K Incluida</h2>
                 <p className="text-gray-400 font-light leading-relaxed mb-8">
                   No es solo internet. Todos nuestros planes incluyen una parrilla de canales seleccionada para toda la familia. Cine, deportes, noticias y contenido infantil con la mejor nitidez digital.
                 </p>
                 <div className="space-y-4">
                   {['Canales en HD y 4K Real', 'Guía de Programación Interactiva', 'Sin decodificadores estorbosos'].map((t, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <Check size={16} className="text-magenta-500" />
                       <span className="text-sm font-medium">{t}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="relative aspect-video rounded-2xl bg-black border border-white/10 flex items-center justify-center overflow-hidden group shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1000&auto=format&fit=crop" alt="TV Cable" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10 w-20 h-20 rounded-full bg-magenta-500 flex items-center justify-center shadow-[0_0_40px_rgba(217,70,239,0.5)]">
                    <Zap size={32} className="text-white fill-white" />
                  </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center bg-gradient-to-r from-cyan-600 to-blue-800 rounded-[2rem] p-12 shadow-[0_20px_50px_rgba(6,182,212,0.3)]">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic">¿Listo para la velocidad Forward?</h2>
          <p className="text-cyan-100 text-lg mb-10 font-light">Únete a los miles de hogares que ya navegan sin límites.</p>
          <motion.a
            href={`https://wa.me/${whatsappNumber}`}
            className="inline-flex items-center gap-4 px-12 py-5 bg-white text-blue-900 rounded-2xl font-black text-sm tracking-widest uppercase hover:bg-cyan-50 transition-all shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contratar por WhatsApp <ArrowRight size={20} />
          </motion.a>
        </div>
      </section>
    </div>
  )
}
