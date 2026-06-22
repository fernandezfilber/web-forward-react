import React from 'react'
import { motion } from 'framer-motion'
import { Users, Target, Shield, Award, Zap, Cpu, Globe, Rocket } from 'lucide-react'

export default function Nosotros() {
  const values = [
    {
      icon: <Users size={24} />,
      title: "Comunidad",
      description: "Nacimos en Lima Este para conectar a nuestra gente con la mejor tecnología del mundo."
    },
    {
      icon: <Cpu size={24} />,
      title: "Innovación",
      description: "Invertimos constantemente en infraestructura de fibra óptica pura de última generación."
    },
    {
      icon: <Shield size={24} />,
      title: "Integridad",
      description: "Transparencia total en nuestros planes. Sin letras pequeñas ni cobros ocultos."
    },
    {
      icon: <Rocket size={24} />,
      title: "Velocidad",
      description: "No solo en megas, sino en respuesta técnica y atención a nuestros clientes."
    }
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Hero Header */}
      <section className="relative pt-32 pb-24 px-4">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-magenta-500/5 blur-[100px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <Globe size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-cyan-400">Nuestra Identidad</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">
              Impulsando el <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-500">Futuro Digital</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              En Forward Vision, no solo vendemos internet; construimos los puentes digitales que permiten a familias y empresas alcanzar su máximo potencial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History / Vision Section */}
      <section className="py-24 px-4 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">Misión <span className="text-cyan-400">&</span> Visión</h2>
              <div className="space-y-6">
                <div className="p-8 rounded-3xl glass-effect border border-white/10 hover:border-cyan-500/30 transition-all">
                   <h3 className="text-xl font-bold mb-4 text-cyan-400 italic">Propósito</h3>
                   <p className="text-gray-400 font-light leading-relaxed">
                     Democratizar el acceso a internet de ultra-alta velocidad, asegurando que cada hogar en nuestra zona de influencia cuente con fibra óptica real, estable y asequible.
                   </p>
                </div>
                <div className="p-8 rounded-3xl glass-effect border border-white/10 hover:border-magenta-500/30 transition-all">
                   <h3 className="text-xl font-bold mb-4 text-magenta-400 italic">Ambición</h3>
                   <p className="text-gray-400 font-light leading-relaxed">
                     Liderar la transformación tecnológica en Lima Este, siendo reconocidos como el proveedor más confiable y humano del sector de telecomunicaciones.
                   </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" 
                alt="Tecnología" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center">
                     <Zap size={24} className="text-white fill-white" />
                   </div>
                   <span className="text-3xl font-black italic">EST. 2024</span>
                </div>
                <p className="text-sm font-bold tracking-widest text-gray-400 uppercase">Tecnología de Próxima Generación</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 uppercase">Nuestros <span className="text-cyan-400">Valores</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-light">El código genético que define nuestra forma de trabajar.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2rem] glass-effect border border-white/5 hover:border-cyan-500/20 text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all group-hover:scale-110">
                   {val.icon}
                </div>
                <h4 className="text-lg font-bold mb-4 uppercase italic tracking-tighter">{val.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-light">{val.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-[3rem] mx-4 mb-24 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[80px] rounded-full -z-0" />
         
         <div className="max-w-5xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tighter italic uppercase">Mas que un proveedor, <br /> tu socio tecnológico.</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { n: '100%', t: 'Fibra Óptica' },
                 { n: '24/7', t: 'Soporte AI' },
                 { n: '99.9%', t: 'Estabilidad' },
                 { n: '0', t: 'Latencia' }
               ].map((stat, i) => (
                 <div key={i}>
                   <p className="text-4xl md:text-5xl font-black mb-2">{stat.n}</p>
                   <p className="text-[10px] font-black tracking-widest uppercase opacity-70">{stat.t}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  )
}
