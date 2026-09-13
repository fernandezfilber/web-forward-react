import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Wifi, Tv, Check, ArrowRight, ShieldCheck, Zap, Activity, Star } from 'lucide-react'

const WA = '51900970806'

const planes = [
  { id:1, nombre:'BASICO',    vel:'250',  unidad:'Mbps', desc:'Navegacion fluida y redes sociales.',          precio:60,  popular:false,
    features:['100% Fibra Optica Real','Velocidad Simetrica','Mas de 100 Canales HD','Soporte 24/7'] },
  { id:2, nombre:'NORMAL',   vel:'500',  unidad:'Mbps', desc:'Streaming 4K y Home Office intensivo.',        precio:80,  popular:true,
    features:['100% Fibra Optica Real','Velocidad Simetrica','Mas de 150 Canales HD','Prioridad de Banda'] },
  { id:3, nombre:'PREMIUM',  vel:'700',  unidad:'Mbps', desc:'Gaming Pro y multiples dispositivos.',         precio:100, popular:false,
    features:['WiFi 6 Dual Band','Latencia Ultra Baja','Mas de 200 Canales 4K','Instalacion VIP'] },
  { id:4, nombre:'FULL GIGA',vel:'1000', unidad:'Mbps', desc:'Maxima potencia sin limites.',                 precio:150, popular:false,
    features:['Todo el Ecosistema Forward','Velocidad Extrema Giga','IP Publica Dedicada Opt.','Atencion Tecnica Inmediata'] },
]

const benefits = [
  { icon: Wifi,       title: 'Fibra Real FTTH',   desc: 'Conexion pura de vidrio hasta tu router.' },
  { icon: ShieldCheck,title: 'Cero Cortes',        desc: 'Red redundante con 99.9% de estabilidad.' },
  { icon: Zap,        title: 'Instalacion Gratis', desc: 'Activacion en menos de 24 horas laborables.' },
  { icon: Activity,   title: 'Baja Latencia',      desc: 'Optimizado para gaming y videollamadas.' },
]

export default function Planes() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": planes.map((p, i) => ({
      "@type": "ListItem", "position": i + 1,
      "item": {
        "@type": "Product",
        "name": `Plan Internet ${p.nombre} ${p.vel} Mbps`,
        "description": p.desc,
        "brand": { "@type": "Brand", "name": "Forward Vision" },
        "offers": { "@type": "Offer", "price": p.precio, "priceCurrency": "PEN", "availability": "https://schema.org/InStock" },
      }
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Planes Internet + Cable | Forward Vision</title>
        <meta name="description" content="Planes de internet fibra optica desde 250 Mbps hasta 1 Gbps con TV Digital incluida. Elige tu plan Forward Vision." />
        <link rel="canonical" href="https://forwardvision.cloud/planes" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero de seccion */}
      <section className="pt-28 sm:pt-32 pb-16 px-4 bg-[#3C0061] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
            <span className="inline-block text-[11px] font-black tracking-[0.18em] uppercase bg-white/15 border border-white/25 px-4 py-1.5 rounded-full mb-6">
              Tarifas 2026
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-5 tracking-tight">
              Elige tu <span className="text-white/70">Velocidad</span>
            </h1>
            <p className="text-base sm:text-lg text-white/65 max-w-xl mx-auto font-light leading-relaxed">
              Fibra optica simetrica, TV Digital y la estabilidad que tu hogar merece.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Planes */}
      <section className="py-16 md:py-20 px-4 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {planes.map((plan, idx) => {
              const waLink = `https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero contratar el plan ${plan.nombre} de ${plan.vel} Mbps. Confirmas cobertura?`)}`
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity:0, y:28 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className={`card relative flex flex-col ${plan.popular ? 'ring-2 ring-[#3C0061]' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#3C0061] rounded-full shadow">
                      <div className="flex items-center gap-1.5">
                        <Star size={11} className="text-white fill-white" />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white">Mas Vendido</span>
                      </div>
                    </div>
                  )}
                  <div className="h-1 w-full rounded-t-[1.25rem]" style={{ background: plan.popular ? '#3C0061' : '#e5e7eb' }} />
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#3C0061] mb-5">{plan.nombre}</p>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tighter leading-none">{plan.vel}</span>
                      <span className="text-sm font-bold text-gray-400">{plan.unidad}</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">{plan.desc}</p>

                    <div className="p-5 rounded-xl bg-[#f3e8ff] mb-6">
                      <div className="flex items-start">
                        <span className="text-base font-bold text-[#3C0061] mt-0.5">S/</span>
                        <span className="text-4xl sm:text-5xl font-black text-[#3C0061] tracking-tighter leading-none mx-1">{plan.precio}</span>
                        <span className="text-xs font-bold text-[#3C0061]/60 mt-auto mb-1">/mes</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[#3C0061]/10 flex items-center justify-center shrink-0">
                            <Check size={11} className="text-[#3C0061]" />
                          </div>
                          <span className="text-[13px] text-gray-600">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <a href={waLink} target="_blank" rel="noopener noreferrer"
                      className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        plan.popular
                          ? 'bg-[#3C0061] text-white hover:bg-[#5a0090]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Contratar <ArrowRight size={15} />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.1 }}>
                <div className="w-14 h-14 rounded-2xl bg-[#3C0061] flex items-center justify-center mx-auto mb-5">
                  <b.icon size={24} className="text-white" />
                </div>
                <h4 className="text-base font-black text-gray-900 mb-2">{b.title}</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TV Cable banner */}
      <section className="py-16 md:py-20 px-4 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <span className="section-label">Entretenimiento</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                  Television Digital <span className="text-[#3C0061]">4K Incluida</span>
                </h2>
                <p className="text-gray-500 font-light leading-relaxed mb-6 text-sm sm:text-base">
                  No es solo internet. Todos nuestros planes incluyen una parrilla de canales para toda la familia. Cine, deportes, noticias y contenido infantil.
                </p>
                <ul className="space-y-3">
                  {['Canales en HD y 4K Real', 'Guia de Programacion Interactiva', 'Sin decodificadores estorbosos'].map((t, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Check size={15} className="text-[#3C0061] shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=900&auto=format&fit=crop"
                  alt="Television 4K"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#3C0061]/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#3C0061] flex items-center justify-center shadow-xl">
                    <Tv size={26} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 md:py-20 px-4 bg-[#3C0061]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Listo para la velocidad Forward?</h2>
          <p className="text-white/65 mb-8 font-light">Unete a los miles de hogares que ya navegan sin limites.</p>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-[#3C0061] rounded-xl font-black text-sm tracking-widest uppercase hover:bg-white/90 transition-all shadow-xl">
            Contratar por WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </div>
  )
}
