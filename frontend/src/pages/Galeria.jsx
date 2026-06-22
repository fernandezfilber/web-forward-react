import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Maximize2, Camera, Star, MessageSquare, LogIn, Loader2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'
import StarRating from '../components/StarRating'
import CommentForm from '../components/CommentForm'

export default function Galeria() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [items, setItems]           = useState([])
  const [categories, setCategories] = useState(['Todos'])
  const [filter, setFilter]         = useState('Todos')
  const [selected, setSelected]     = useState(null)
  const [comments, setComments]     = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [loading, setLoading]       = useState(true)

  const fetchMedia = async (cat) => {
    setLoading(true)
    try {
      const params = cat && cat !== 'Todos' ? `category=${cat}&limit=100` : 'limit=100'
      const { data } = await api.get(`/media?${params}`)
      setItems(data.items)
    } catch (err) {
      console.error('Error al cargar galería:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/media/categories')
      setCategories(data.categories)
    } catch {}
  }

  const fetchComments = async (mediaId) => {
    setLoadingComments(true)
    try {
      const { data } = await api.get(`/comments?media_id=${mediaId}`)
      setComments(data.items)
    } catch {} finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => { fetchMedia(filter); fetchCategories() }, [])

  const handleFilter = (cat) => {
    setFilter(cat)
    fetchMedia(cat)
  }

  const openItem = (item) => {
    setSelected(item)
    setComments([])
    fetchComments(item.id)
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Camera size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Archivo Visual</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">
              Galería <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Oficial</span>
            </h1>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => handleFilter(cat)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === cat
                    ? 'bg-cyan-500 border-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="break-inside-avoid rounded-3xl bg-white/5 h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode='popLayout'>
              {items.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer group border border-white/5 shadow-2xl"
                  onClick={() => openItem(item)}
                >
                  <img src={item.thumbnailUrl || item.url} alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />

                  {/* Rating badge */}
                  {item.avgRating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-yellow-400">{item.avgRating}</span>
                    </div>
                  )}

                  {/* Comment count */}
                  {item.commentCount > 0 && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm">
                      <MessageSquare size={10} className="text-cyan-400" />
                      <span className="text-[10px] font-black text-cyan-400">{item.commentCount}</span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                    <p className="text-cyan-400 text-[10px] font-black tracking-widest uppercase mb-1">{item.category}</p>
                    <h3 className="text-xl font-bold italic uppercase leading-tight">{item.title}</h3>
                    <div className="mt-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                      {item.type === 'video' ? <Play size={18} fill="currentColor" /> : <Maximize2 size={18} />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox + Comments */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-start justify-center p-4 overflow-y-auto"
          >
            <div className="w-full max-w-6xl pt-4 pb-20">
              <button onClick={() => setSelected(null)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-10">
                <X size={20} />
              </button>

              {/* Media */}
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black mb-6">
                {selected.type === 'video'
                  ? <video src={selected.url} controls autoPlay className="w-full aspect-video object-contain" />
                  : <img src={selected.url} alt={selected.title} className="w-full object-contain max-h-[60vh]" />}
              </motion.div>

              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-cyan-400 text-[10px] font-black tracking-widest uppercase mb-1">{selected.category}</p>
                  <h2 className="text-2xl font-black uppercase italic">{selected.title}</h2>
                  {selected.avgRating > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating value={Math.round(selected.avgRating)} readOnly size={16} />
                      <span className="text-gray-500 text-xs">({selected.ratingCount} calificaciones)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments section */}
              <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                  <MessageSquare size={16} className="text-cyan-400" />
                  Comentarios ({comments.length})
                </h3>

                {/* Comment form for logged-in clients */}
                {authLoading ? (
                  <div className="mb-8 p-8 rounded-2xl bg-white/3 border border-white/5 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={24} className="text-cyan-400 animate-spin" />
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Verificando sesión...</p>
                  </div>
                ) : user ? (
                  <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                      Comentar como {user.name}
                    </p>
                    <CommentForm mediaId={selected.id} onSubmitted={() => fetchComments(selected.id)} />
                  </div>
                ) : (
                  <div className="mb-8 p-5 rounded-2xl bg-white/3 border border-white/5 text-center">
                    <p className="text-gray-500 text-sm mb-3">Inicia sesión para dejar un comentario y calificar</p>
                    <Link to="/login" state={{ from: location }} onClick={() => setSelected(null)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all">
                      <LogIn size={14} /> Iniciar Sesión
                    </Link>
                  </div>
                )}

                {/* Comments list */}
                {loadingComments ? (
                  <div className="space-y-3">
                    {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />)}
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-center text-gray-600 text-sm py-8">
                    Aún no hay comentarios en esta foto. ¡Sé el primero!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {comments.map(c => (
                      <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-xs shrink-0">
                          {c.authorName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold">{c.authorName}</span>
                            {c.stars && <StarRating value={c.stars} readOnly size={12} />}
                            <span className="text-gray-600 text-xs">
                              {new Date(c.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
