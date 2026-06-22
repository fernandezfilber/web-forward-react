import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import api from '../api/client'
import StarRating from './StarRating'

export default function CommentForm({ mediaId, onSubmitted }) {
  const [content, setContent] = useState('')
  const [stars,   setStars]   = useState(0)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return setError('Escribe un comentario')
    setError('')
    setLoading(true)
    try {
      await api.post('/comments', { media_id: mediaId, content, stars })
      setDone(true)
      setContent('')
      setStars(0)
      onSubmitted?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el comentario')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
      >
        <Star size={16} className="fill-green-400" />
        ¡Gracias! Tu comentario ha sido publicado.
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">
          Tu calificación
        </label>
        <StarRating value={stars} onChange={setStars} size={22} />
      </div>

      <textarea
        value={content}
        onChange={e => { setContent(e.target.value); setError('') }}
        placeholder="Escribe tu comentario aquí..."
        rows={3}
        maxLength={1000}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400/50 resize-none transition-all"
      />

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-gray-600 text-[10px]">{content.length}/1000</span>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 bg-cyan-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Publicar Comentario'}
        </motion.button>
      </div>
    </form>
  )
}
