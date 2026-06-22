import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, Eye, EyeOff, Image, Video, Plus, X, CheckCircle } from 'lucide-react'
import api from '../../api/client'

export default function AdminMedia() {
  const [items, setItems]       = useState([])
  const [total, setTotal]       = useState(0)
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast]       = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title: '', category: 'General', file: null })
  const fileRef = useRef()

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/media')
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      showToast('Error al cargar medios', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMedia() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.file || !form.title) return showToast('Completa todos los campos', 'error')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file',     form.file)
      fd.append('title',    form.title)
      fd.append('category', form.category)
      await api.post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      showToast('¡Media subida exitosamente!')
      setShowForm(false)
      setForm({ title: '', category: 'General', file: null })
      fetchMedia()
    } catch (err) {
      showToast(err.response?.data?.error || 'Error al subir', 'error')
    } finally {
      setUploading(false)
    }
  }

  const toggleVisibility = async (id, current) => {
    try {
      await api.put(`/media/${id}`, { isVisible: !current })
      setItems(prev => prev.map(m => m.id === id ? { ...m, isVisible: !current } : m))
      showToast(`Media ${!current ? 'publicada' : 'ocultada'}`)
    } catch {
      showToast('Error al actualizar', 'error')
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`/media/${id}`)
      setItems(prev => prev.filter(m => m.id !== id))
      showToast('Media eliminada')
    } catch {
      showToast('Error al eliminar', 'error')
    }
  }

  const categories = ['General', 'Instalaciones', 'Campo', 'Marketing', 'Eventos']

  return (
    <div className="min-h-screen bg-[#030712] text-white p-8">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-bold
              ${toast.type === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-300' : 'bg-green-500/20 border border-green-500/30 text-green-300'}`}
          >
            <CheckCircle size={16} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Galería de Medios</h1>
          <p className="text-gray-500 text-sm mt-1">{total} elementos en total</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all"
        >
          <Plus size={16} />
          Subir Media
        </motion.button>
      </div>

      {/* Upload Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-[#0a0f1a] border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black">Subir nuevo archivo</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpload} className="space-y-4">
                <input
                  type="text"
                  placeholder="Título del archivo"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                />
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400/50"
                >
                  {categories.map(c => <option key={c} value={c} className="bg-[#0a0f1a]">{c}</option>)}
                </select>

                {/* Drag-drop area */}
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); setForm(f => ({ ...f, file: e.dataTransfer.files[0] })) }}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-400/40 transition-all"
                >
                  {form.file ? (
                    <div className="text-cyan-400">
                      <CheckCircle size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-bold">{form.file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(form.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mx-auto mb-3 text-gray-600" />
                      <p className="text-sm text-gray-400">Arrastra tu archivo o haz clic</p>
                      <p className="text-xs text-gray-600 mt-1">Imágenes (JPG, PNG, WebP) o Videos (MP4, WebM) — Máx. 100MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
                    onChange={e => setForm(f => ({ ...f, file: e.target.files[0] }))} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-white/10 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-all">
                    Cancelar
                  </button>
                  <button type="submit" disabled={uploading}
                    className="flex-1 py-3 bg-cyan-500 text-black rounded-xl text-sm font-black uppercase tracking-widest hover:bg-cyan-400 transition-all disabled:opacity-50">
                    {uploading ? 'Subiendo...' : 'Subir'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-video rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/3"
            >
              <div className="aspect-video relative">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {item.type === 'video' && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 text-[10px] font-bold text-cyan-400">
                    <Video size={10} /> VIDEO
                  </div>
                )}
                {!item.isVisible && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <EyeOff size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold truncate">{item.title}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{item.category}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-[10px] text-yellow-400">★ {parseFloat(item.avgRating || 0).toFixed(1)}</span>
                  <span className="text-[10px] text-gray-600 ml-auto">{item.totalComments} comentarios</span>
                </div>
              </div>
              {/* Actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => toggleVisibility(item.id, item.isVisible)}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                  title={item.isVisible ? 'Ocultar' : 'Mostrar'}
                >
                  {item.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
