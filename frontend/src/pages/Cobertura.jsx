import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Check, X, Search, Loader2, Zap, ArrowRight, ShieldCheck } from 'lucide-react'

export default function Cobertura() {
  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [zonaSeleccionada, setZonaSeleccionada] = useState(0)

  const distritos = [
    {
      zona: 'Lima Este (Zona Principal)',
      cobertura: 99,
      distritos: [
        { nombre: 'Huachipa', disponible: true },
        { nombre: 'Santa Clara', disponible: true },
        { nombre: 'Gloria Grande', disponible: true },
        { nombre: 'Carapongo', disponible: true },
        { nombre: 'La Era', disponible: true },
        { nombre: 'Santa Anita', disponible: true },
        { nombre: 'Ate', disponible: true },
        { nombre: 'Lurigancho-Chosica', disponible: true },
      ],
      color: 'from-cyan-500 to-blue-600',
    },
    {
      zona: 'Lima Metropolitana',
      cobertura: 85,
      distritos: [
        { nombre: 'San Juan de Lurigancho', disponible: true },
        { nombre: 'Cercado de Lima', disponible: true },
        { nombre: 'La Victoria', disponible: true },
        { nombre: 'El Agustino', disponible: true },
        { nombre: 'Rímac', disponible: false },
      ],
      color: 'from-purple-500 to-indigo-600',
    }
  ]

  const checkFactibilidad = async (e) => {
    e.preventDefault()
    if (!address.trim()) return

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://toq.life/api/redes/factibilidad-direccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direccion: address })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error checking coverage:", error)
      setResult({ disponible: false, mensaje: "Error de conexión. Por favor intenta más tarde." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <MapPin size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Infraestructura Global</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Red de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Fibra Óptica</span> Real
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Verifica la disponibilidad de Forward Vision en segundos. Estamos expandiendo nuestra red GIGA en todo Lima Este.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Factibilidad Search Box */}
      <section className="pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-effect rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] -z-10" />

            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-2">Consulta de Factibilidad Técnica</h2>
              <p className="text-gray-400 text-sm">Ingresa tu dirección exacta para una validación inmediata.</p>
            </div>

            <form onSubmit={checkFactibilidad} className="relative group">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={20} />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. Las Praderas 123, Santa Anita"
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all text-lg font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !address}
                  className="px-10 py-5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3"
                >
                  {isLoading ? (
                    <><Loader2 className="animate-spin" size={18} /> Validando...</>
                  ) : (
                    <>Verificar Cobertura <ArrowRight size={18} /></>
                  )}
                </button>
              </div>
            </form>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mt-10 p-6 rounded-2xl border ${
                    result.disponible 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  } flex flex-col md:flex-row items-center gap-6`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    result.disponible ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {result.disponible ? <ShieldCheck size={32} className="text-white" /> : <X size={32} className="text-white" />}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-1">
                      {result.disponible ? '¡Excelente! Tenemos Cobertura' : 'Lo sentimos'}
                    </h3>
                    <p className={`${result.disponible ? 'text-green-200' : 'text-red-200'} text-sm`}>
                      {result.mensaje}
                    </p>
                  </div>
                  {result.disponible && (
                    <motion.a
                      href={`https://wa.me/51900970806?text=Hola,%20tengo%20cobertura%20en%20${encodeURIComponent(address)}%20y%20quiero%20información%20de%20planes.`}
                      target="_blank"
                      className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-green-400 hover:text-white transition-all shadow-xl"
                      whileHover={{ scale: 1.05 }}
                    >
                      Contratar Ahora
                    </motion.a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Interactive Zones Grid */}
      <section className="py-24 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Sidebar List */}
            <div className="lg:col-span-4 space-y-4">
              <h2 className="text-3xl font-black mb-8 tracking-tighter">Nuestros <span className="text-cyan-400">Distritos</span></h2>
              {distritos.map((distrito, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setZonaSeleccionada(idx)}
                  className={`w-full text-left p-6 rounded-2xl transition-all border-2 ${
                    zonaSeleccionada === idx
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-white/5 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{distrito.zona}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className={`h-full bg-gradient-to-r ${distrito.color}`} 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${distrito.cobertura}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-cyan-400">{distrito.cobertura}%</span>
                      </div>
                    </div>
                    <Zap className={zonaSeleccionada === idx ? 'text-cyan-400' : 'text-gray-600'} size={20} />
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Display Cards */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={zonaSeleccionada}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  {distritos[zonaSeleccionada].distritos.map((district, idx) => (
                    <div 
                      key={idx} 
                      className="glass-effect rounded-2xl p-6 border border-white/5 flex items-center justify-between group hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          district.disponible ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-600'
                        }`}>
                          <Check size={20} />
                        </div>
                        <div>
                          <p className="font-bold">{district.nombre}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                            {district.disponible ? 'Fibra 100% Giga' : 'Expansión Q3'}
                          </p>
                        </div>
                      </div>
                      {!district.disponible && (
                        <span className="text-[8px] bg-white/5 px-2 py-1 rounded-full text-gray-400 border border-white/10">PROXIMAMENTE</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Expansion Note */}
              <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-cyan-900/20 to-magenta-900/10 border border-white/5 flex items-center gap-8">
                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-white/5 items-center justify-center text-cyan-400 border border-white/10 shrink-0">
                  <Zap size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Despliegue de Red en Proceso</h4>
                  <p className="text-gray-400 text-sm font-light">Estamos activando nuevos nodos de fibra óptica cada semana en la zona de Huachipa y Santa Clara. Si tu calle aún no figura, contáctanos para prioridad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Expansion Map Placeholder */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto border-t border-white/5 pt-24 text-center">
          <h2 className="text-3xl font-black mb-12">Expansión <span className="text-cyan-400">Provincias 2026</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { zona: 'Centro', ciudades: 'Huancayo, Tarma' },
              { zona: 'Sur', ciudades: 'Ica, Chincha' },
              { zona: 'Norte', ciudades: 'Trujillo, Chiclayo' },
              { zona: 'Oriente', ciudades: 'Pucallpa, Iquitos' }
            ].map((exp, i) => (
              <div key={i} className="glass-effect p-6 rounded-2xl border border-white/5 hover:border-magenta-500/30 transition-all group">
                <p className="text-magenta-400 font-black text-[10px] tracking-widest uppercase mb-2">Fase {i + 1}</p>
                <h4 className="text-lg font-bold mb-1">{exp.zona}</h4>
                <p className="text-gray-500 text-xs">{exp.ciudades}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
