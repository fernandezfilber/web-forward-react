import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import api from '../api/client'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [selectedItem, setSelectedItem] = useState(null)
  
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/media?limit=10')
        setItems(data.items?.length ? data.items : getLocalGalleryItems())
      } catch (err) {
        console.error('Error fetching gallery:', err)
        setItems(getLocalGalleryItems())
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  const getLocalGalleryItems = () => [
    { id: 'local-logo', type: 'image', url: '/logo.png', title: 'Forward Vision', category: 'Conectividad' },
    { id: 'local-icon', type: 'image', url: '/icono.png', title: 'Tecnología Forward', category: 'Tecnología' },
    { id: 'local-logo-detail', type: 'image', url: '/logo.png', title: 'Experiencia Giga', category: 'Experiencia' },
  ]

  const radius = window.innerWidth > 768 ? 600 : 300
  const angleStep = items.length > 0 ? 360 / items.length : 0

  const next = () => {
    if (items.length > 0) setRotation(prev => prev - angleStep)
  }
  const prev = () => {
    if (items.length > 0) setRotation(prev => prev + angleStep)
  }

  useEffect(() => {
    if (items.length === 0) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [items.length, angleStep])

  return (
    <section id="gallery" className="py-32 bg-[#030712] relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-cyan-500/5 blur-[180px] -z-0" />
      
      <div className="text-center mb-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <ImageIcon size={14} className="text-cyan-400" />
            <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Next-Gen 3D Display</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic text-white">
            Experiencia <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-primary-600">3D Cilindro</span>
          </h2>
        </motion.div>
      </div>

      {/* TRUE 3D CYLINDER CONTAINER */}
      <div className="relative w-full h-[400px] flex items-center justify-center" style={{ perspective: '2000px' }}>
        <motion.div 
          className="relative w-[300px] md:w-[500px] h-[200px] md:h-[300px]"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: rotation }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {items.map((item, i) => {
            const itemAngle = i * angleStep
            return (
              <motion.div
                key={item.id}
                className="absolute inset-0 cursor-pointer group"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`
                }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Glass Frame */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white/20 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_60px_rgba(6,182,212,0.5)]">
                   <img src={item.type === 'video' ? item.thumbnail : item.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                   
                   <div className="absolute bottom-6 left-6 text-left transform translate-z-10 group-hover:translate-y-[-5px] transition-transform">
                     <p className="text-cyan-400 text-[9px] font-black tracking-widest uppercase mb-1">{item.category}</p>
                     <h3 className="text-xl font-bold italic uppercase text-white tracking-tight">{item.title}</h3>
                   </div>

                   <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        {item.type === 'video' ? <Play fill="currentColor" size={24} /> : <Maximize2 size={24} />}
                      </div>
                   </div>
                </div>

                {/* Floor Reflection */}
                <div 
                   className="absolute top-full left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 to-transparent blur-xl opacity-30 pointer-events-none"
                   style={{ transform: 'rotateX(90deg) translateY(-20px)', transformOrigin: 'top' }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="absolute -bottom-16 flex gap-6 z-30">
          <button onClick={prev} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all flex items-center justify-center shadow-lg"><ChevronLeft size={24} /></button>
          <button onClick={next} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white hover:bg-magenta-500 hover:text-black hover:border-magenta-500 transition-all flex items-center justify-center shadow-lg"><ChevronRight size={24} /></button>
        </div>
      </div>

      <div className="mt-40">
         <a href="/galeria" className="group flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">
           Explorar Archivo Completo
           <div className="w-12 h-12 rounded-full border border-cyan-400 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
             <ChevronRight size={20} />
           </div>
         </a>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10">
            <button onClick={() => setSelectedItem(null)} className="absolute top-8 right-8 p-4 rounded-full bg-white/5 text-white hover:bg-white/10"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              {selectedItem.type === 'video' ? <video src={selectedItem.url} controls autoPlay className="w-full h-full object-contain" /> : <img src={selectedItem.url} className="w-full h-full object-contain" />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
