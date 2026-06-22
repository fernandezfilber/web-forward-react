import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Trash2, Clock, Star, MessageSquare, Filter } from 'lucide-react'
import api from '../../api/client'

const StatusBadge = ({ status }) => {
  const map = {
    pending:  { label: 'Pendiente', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    approved: { label: 'Aprobado',  cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
    rejected: { label: 'Rechazado', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
  }
  const { label, cls } = map[status] || map.pending
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}

export default function AdminComments() {
  const [items, setItems]     = useState([])
  const [filter, setFilter]   = useState('pending')
  const [loading, setLoading] = useState(true)
  const [toast, setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchComments = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/comments?status=${filter}&limit=50`)
      setItems(data.items)
    } catch {
      showToast('Error al cargar comentarios', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments() }, [filter])

  const approve = async (id) => {
    try {
      await api.put(`/comments/${id}/approve`)
      setItems(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c))
      showToast('Comentario aprobado y publicado')
    } catch { showToast('Error al aprobar', 'error') }
  }

  const reject = async (id) => {
    try {
      await api.put(`/comments/${id}/reject`)
      setItems(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c))
      showToast('Comentario rechazado')
    } catch { showToast('Error al rechazar', 'error') }
  }

  const remove = async (id) => {
    if (!confirm('¿Eliminar este comentario permanentemente?')) return
    try {
      await api.delete(`/comments/${id}`)
      setItems(prev => prev.filter(c => c.id !== id))
      showToast('Comentario eliminado')
    } catch { showToast('Error al eliminar', 'error') }
  }

  const tabs = [
    { id: 'pending',  label: 'Pendientes' },
    { id: 'approved', label: 'Aprobados' },
    { id: 'rejected', label: 'Rechazados' },
  ]

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold
              ${toast.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-green-500/20 border border-green-500/30 text-green-300'}`}
          >
            <CheckCircle size={16} />{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
          <MessageSquare size={24} className="text-cyan-400" /> Moderación de Comentarios
        </h1>
        <p className="text-gray-500 text-sm mt-1">Revisa y modera los comentarios de clientes</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              filter === tab.id ? 'bg-cyan-500 text-black' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">No hay comentarios en este estado</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map(comment => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex gap-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-black text-sm shrink-0">
                  {comment.authorName?.[0]?.toUpperCase() || '?'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span className="font-bold text-sm">{comment.authorName}</span>
                    <StatusBadge status={comment.status} />
                    {comment.stars && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < comment.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'} />
                        ))}
                      </div>
                    )}
                    <span className="text-gray-600 text-xs ml-auto">
                      {new Date(comment.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  {comment.mediaTitle && (
                    <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest">Foto: {comment.mediaTitle}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {comment.status !== 'approved' && (
                    <button onClick={() => approve(comment.id)}
                      className="p-2 rounded-xl bg-green-500/20 hover:bg-green-500/40 text-green-400 transition-all" title="Aprobar">
                      <CheckCircle size={16} />
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button onClick={() => reject(comment.id)}
                      className="p-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 transition-all" title="Rechazar">
                      <X size={16} />
                    </button>
                  )}
                  <button onClick={() => remove(comment.id)}
                    className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
