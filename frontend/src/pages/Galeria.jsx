import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, Maximize2, MessageSquare, LogIn, Loader2, ThumbsUp, ThumbsDown, Send, ChevronDown, Home, Video, Users, Bell, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/client"
import StarRating from "../components/StarRating"

/* -- Barra inferior para mobile -- */
function MobileBottomBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = [
    { icon: Home,         label: "Inicio",      path: "/" },
    { icon: Video,        label: "Planes",       path: "/planes" },
    { icon: Users,        label: "Nosotros",     path: "/nosotros" },
    { icon: Bell,         label: "Soporte",      path: "/soporte" },
    { icon: User,         label: "Perfil",       path: "/perfil" },
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex">
      {items.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button key={path} onClick={() => navigate(path)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${active ? "text-[#0047FF]" : "text-gray-400"}`}>
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[9px] font-semibold">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* -- Formulario de comentario / respuesta -- */
function CommentInput({ placeholder, onSubmit, loading }) {
  const [text, setText] = useState("")
  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText("")
  }
  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-gray-100 border border-gray-200 text-gray-800 text-sm rounded-md px-3 py-2 focus:outline-none focus:border-[#0047FF] placeholder-gray-400"
      />
      <button type="submit" disabled={loading || !text.trim()}
        className="p-2 rounded-md bg-[#0047FF] text-white hover:bg-[#0038cc] disabled:opacity-40 transition-colors">
        <Send size={16} />
      </button>
    </form>
  )
}

/* -- Un comentario con respuestas -- */
function CommentItem({ c, mediaId, currentUser, onRefresh }) {
  const [showReplies, setShowReplies] = useState(false)
  const [replyOpen,   setReplyOpen]   = useState(false)
  const [replies,     setReplies]     = useState([])
  const [loadingReplies, setLoadingReplies] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const initials = (name) => (name?.[0] || "?").toUpperCase()

  const loadReplies = async () => {
    if (replies.length > 0) { setShowReplies(true); return }
    setLoadingReplies(true)
    try {
      const { data } = await api.get(`/comments?media_id=${mediaId}&parent_id=${c.id}`)
      setReplies(data.items || [])
      setShowReplies(true)
    } catch {} finally { setLoadingReplies(false) }
  }

  const handleReply = async (text) => {
    setSubmitting(true)
    try {
      await api.post("/comments", { media_id: mediaId, content: text, parent_id: c.id })
      const { data } = await api.get(`/comments?media_id=${mediaId}&parent_id=${c.id}`)
      setReplies(data.items || [])
      setShowReplies(true)
      setReplyOpen(false)
      onRefresh?.()
    } catch {} finally { setSubmitting(false) }
  }

  const dateStr = new Date(c.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-[#0047FF] flex items-center justify-center text-white font-bold text-sm shrink-0">
        {initials(c.authorName)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="bg-gray-100 rounded-lg px-4 py-3">
          <p className="text-sm font-bold text-gray-900">{c.authorName}</p>
          <p className="text-sm text-gray-700 leading-relaxed">{c.content}</p>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-4 mt-1.5 px-1 text-xs text-gray-500">
          <span>{dateStr}</span>
          <button className="font-bold hover:text-[#0047FF] transition-colors flex items-center gap-1">
            <ThumbsUp size={12} /> Me gusta
          </button>
          {currentUser && (
            <button onClick={() => setReplyOpen(!replyOpen)}
              className="font-bold hover:text-[#0047FF] transition-colors">
              Responder
            </button>
          )}
          {c.replyCount > 0 && (
            <button onClick={loadReplies}
              className="font-bold text-[#0047FF] flex items-center gap-1">
              <ChevronDown size={12} className={showReplies ? "rotate-180 transition-transform" : "transition-transform"} />
              Ver {c.replyCount} {c.replyCount === 1 ? "respuesta" : "respuestas"}
            </button>
          )}
        </div>

        {/* Replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-gray-200">
            {replies.map((r) => (
              <div key={r.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0047FF]/70 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {initials(r.authorName)}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="text-xs font-bold text-gray-900">{r.authorName}</p>
                    <p className="text-xs text-gray-700">{r.content}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 px-1">
                    {new Date(r.createdAt).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {loadingReplies && <p className="text-xs text-gray-400 mt-2 pl-2">Cargando respuestas...</p>}

        {/* Reply input */}
        {replyOpen && currentUser && (
          <div className="mt-3 pl-2">
            <CommentInput
              placeholder={`Responder a ${c.authorName}...`}
              onSubmit={handleReply}
              loading={submitting}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* -- Panel lateral / modal de imagen con comentarios -- */
function MediaPanel({ item, onClose, currentUser, authLoading, location }) {
  const [comments,        setComments]        = useState([])
  const [loadingComments, setLoadingComments] = useState(false)
  const [submitting,      setSubmitting]      = useState(false)

  const fetchComments = async () => {
    setLoadingComments(true)
    try {
      const { data } = await api.get(`/comments?media_id=${item.id}&parent_id=null`)
      setComments(data.items || [])
    } catch {} finally { setLoadingComments(false) }
  }

  useEffect(() => { fetchComments() }, [item.id])

  const handleComment = async (text) => {
    setSubmitting(true)
    try {
      await api.post("/comments", { media_id: item.id, content: text })
      fetchComments()
    } catch {} finally { setSubmitting(false) }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 flex items-start justify-center overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-3xl bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-lg overflow-hidden shadow-2xl flex flex-col">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center rounded-full transition-colors">
          <X size={16} />
        </button>

        {/* Media */}
        <div className="bg-black flex items-center justify-center" style={{ minHeight: 220 }}>
          {item.type === "video"
            ? <video src={item.url} controls autoPlay className="w-full max-h-[50vh] object-contain" />
            : <img src={item.url} alt={item.title} className="w-full max-h-[50vh] object-contain" />}
        </div>

        {/* Meta */}
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-xs font-bold text-[#0047FF] uppercase tracking-widest mb-0.5">{item.category}</p>
          <h2 className="text-base font-bold text-gray-900">{item.title}</h2>
          {item.avgRating > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarRating value={Math.round(item.avgRating)} readOnly size={14} />
              <span className="text-xs text-gray-400">({item.ratingCount})</span>
            </div>
          )}
        </div>

        {/* Comments header */}
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <MessageSquare size={15} className="text-[#0047FF]" />
            Comentarios ({comments.length})
          </h3>
        </div>

        {/* Comment input */}
        <div className="px-4 pb-3">
          {authLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-xs py-2">
              <Loader2 size={14} className="animate-spin" /> Verificando sesion...
            </div>
          ) : currentUser ? (
            <div>
              <p className="text-xs text-gray-400 mb-2">Comentar como <span className="font-bold text-gray-600">{currentUser.name}</span></p>
              <CommentInput placeholder="Escribe un comentario..." onSubmit={handleComment} loading={submitting} />
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-500">Inicia sesion para comentar</p>
              <Link to="/login" state={{ from: location }} onClick={onClose}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0047FF] text-white text-xs font-bold rounded-md hover:bg-[#0038cc] transition-colors">
                <LogIn size={13} /> Ingresar
              </Link>
            </div>
          )}
        </div>

        {/* Comments list */}
        <div className="px-4 pb-24 md:pb-6 flex-1 overflow-y-auto">
          {loadingComments ? (
            <div className="space-y-3 py-4">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : comments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aun no hay comentarios. Se el primero.</p>
          ) : (
            <div className="space-y-5 py-2">
              {comments.map(c => (
                <CommentItem
                  key={c.id}
                  c={c}
                  mediaId={item.id}
                  currentUser={currentUser}
                  onRefresh={fetchComments}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* -- PAGINA PRINCIPAL -- */
export default function Galeria() {
  const { user, loading: authLoading } = useAuth()
  const location = useLocation()
  const [items,      setItems]      = useState([])
  const [categories, setCategories] = useState(["Todos"])
  const [filter,     setFilter]     = useState("Todos")
  const [selected,   setSelected]   = useState(null)
  const [loading,    setLoading]    = useState(true)

  const fetchMedia = async (cat) => {
    setLoading(true)
    try {
      const params = cat && cat !== "Todos" ? `category=${cat}&limit=100` : "limit=100"
      const { data } = await api.get(`/media?${params}`)
      setItems(data.items)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/media/categories")
      setCategories(data.categories)
    } catch {}
  }

  useEffect(() => { fetchMedia(filter); fetchCategories() }, [])

  const handleFilter = (cat) => { setFilter(cat); fetchMedia(cat) }

  /* Grid tipo Facebook: columnas de distintas alturas */
  const cols = [[], [], []]
  items.forEach((item, i) => cols[i % 3].push(item))

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 md:pb-0">

      {/* Header */}
      <div className="pt-24 sm:pt-28 pb-6 px-4 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Galeria Forward Vision</h1>
          <p className="text-sm text-gray-500">Instalaciones, equipo y momentos de nuestra red.</p>
        </div>
      </div>

      {/* Filtros — barra horizontal scrollable estilo Facebook */}
      <div className="sticky top-[60px] sm:top-[68px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
            {categories.map(cat => (
              <button key={cat} onClick={() => handleFilter(cat)}
                className={`shrink-0 px-5 py-2 text-[13px] font-semibold transition-colors ${
                  filter === cat
                    ? "bg-[#0047FF] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={{ borderRadius: 4 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-4xl mx-auto px-2 py-3">
        {loading ? (
          <div className="grid grid-cols-3 gap-1">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse" style={{ aspectRatio: i % 3 === 1 ? "1/1.4" : "1/1" }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-sm">No hay elementos en esta categoria.</p>
        ) : (
          /* Masonry de 3 columnas como Facebook Photos */
          <div className="flex gap-1">
            {cols.map((col, ci) => (
              <div key={ci} className="flex-1 flex flex-col gap-1">
                {col.map(item => (
                  <button key={item.id} onClick={() => setSelected(item)}
                    className="relative w-full overflow-hidden bg-gray-200 group focus:outline-none"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <img
                      src={item.thumbnailUrl || item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-black/50 flex items-center justify-center">
                          <Play size={18} fill="white" className="text-white ml-0.5" />
                        </div>
                      </div>
                    )}
                    {item.commentCount > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white px-1.5 py-0.5">
                        <MessageSquare size={10} />
                        <span className="text-[10px] font-bold">{item.commentCount}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panel con comentarios estilo Facebook */}
      <AnimatePresence>
        {selected && (
          <MediaPanel
            item={selected}
            onClose={() => setSelected(null)}
            currentUser={user}
            authLoading={authLoading}
            location={location}
          />
        )}
      </AnimatePresence>

      {/* Barra inferior mobile */}
      <MobileBottomBar />
    </div>
  )
}
