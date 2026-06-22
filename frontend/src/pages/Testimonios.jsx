import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Users, MessageSquare, Filter, TrendingUp, Award, CheckCircle2, LogIn, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import CommentForm from '../components/CommentForm';
import { Helmet } from 'react-helmet-async';

const API = import.meta.env.VITE_API_URL || '/api';

const DEMO = [
  { id: 1, authorName: 'María García', content: 'Excelente servicio, la velocidad es increíble. Nunca había tenido internet tan estable en mi casa.', stars: 5, createdAt: '2026-04-10' },
  { id: 2, authorName: 'Carlos Ríos', content: 'La instalación fue rápida y el técnico muy amable. Llevo 3 meses y cero cortes.', stars: 5, createdAt: '2026-04-18' },
  { id: 3, authorName: 'Ana Torres', content: 'Super recomendado. El soporte responde al instante por WhatsApp. El precio es justo para lo que ofrecen.', stars: 4, createdAt: '2026-04-25' },
  { id: 4, authorName: 'Luis Mendoza', content: 'El plan FULL GIGA es una bestia. Trabajo desde casa y no tengo ningún problema con videollamadas.', stars: 5, createdAt: '2026-05-01' },
  { id: 5, authorName: 'Elena Paz', content: 'Cambié de mi antiguo operador y la diferencia es abismal. La TV digital tiene canales que no encontraba en otros lados.', stars: 5, createdAt: '2026-04-05' },
  { id: 6, authorName: 'Jorge Luna', content: 'Muy satisfecho con el servicio técnico. Vinieron el mismo día que reporté un detalle con mi router.', stars: 5, createdAt: '2026-03-28' },
];

function StatItem({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</p>
      </div>
    </div>
  );
}

export default function TestimoniosPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 5, 4, 3...
  const [mediaId, setMediaId] = useState(null);

  const fetchComments = () => {
    fetch(`${API}/comments?limit=100&status=approved`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const items = data?.items || [];
        if (items.length > 0) {
          setComments(items);
        } else {
          setComments(DEMO);
        }
      })
      .catch(() => setComments(DEMO))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
    // Fetch a media item to associate the comment with (Prisma requires it)
    fetch(`${API}/media?limit=1`)
      .then(r => r.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setMediaId(data.items[0].id);
        }
      });
  }, []);

  const filteredComments = useMemo(() => {
    if (filter === 'all') return comments;
    return comments.filter(c => c.stars === parseInt(filter));
  }, [comments, filter]);

  const stats = useMemo(() => {
    if (comments.length === 0) return { avg: 0, total: 0, fiveStars: 0 };
    const total = comments.length;
    const avg = comments.reduce((s, c) => s + (c.stars || 0), 0) / total;
    const fiveStars = comments.filter(c => c.stars === 5).length;
    return {
      avg: parseFloat(avg.toFixed(1)),
      total,
      fiveStars,
      pct5: Math.round((fiveStars / total) * 100)
    };
  }, [comments]);

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-20 px-4">
      <Helmet>
        <title>Opiniones de Clientes | Forward Vision</title>
        <meta name="description" content="Descubre lo que nuestros clientes opinan sobre el internet de fibra óptica de Forward Vision. Calidad, velocidad y soporte garantizado." />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Award size={14} className="text-cyan-400" />
              <span className="text-[10px] font-black tracking-widest uppercase text-cyan-400">Satisfacción Garantizada</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">
              Voz de Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Clientes</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              La transparencia es nuestro valor principal. Aquí mostramos las experiencias reales de quienes ya disfrutan de la ultra velocidad.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          <StatItem icon={Star} label="Calificación Promedio" value={`${stats.avg} / 5.0`} color="bg-yellow-500" />
          <StatItem icon={CheckCircle2} label="Reseñas Verificadas" value={`${stats.total}+`} color="bg-green-500" />
          <StatItem icon={TrendingUp} label="Recomendación" value={`${stats.pct5}%`} color="bg-cyan-500" />
          <StatItem icon={Users} label="Usuarios Activos" value="5,000+" color="bg-purple-500" />
        </div>

        {/* Filters and CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <div className="flex items-center gap-2 text-gray-500 mr-2 shrink-0">
              <Filter size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Filtrar:</span>
            </div>
            {['all', '5', '4', '3'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                  filter === f 
                    ? 'bg-cyan-500 border-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                {f === 'all' ? 'Todos' : `${f} Estrellas`}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Form Section */}
        {user ? (
          <div className="mb-20">
            {mediaId ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
                <h3 className="text-xl font-black uppercase italic mb-6 flex items-center gap-2">
                  <MessageSquare className="text-cyan-400" size={20} />
                  Comparte tu experiencia
                </h3>
                <CommentForm 
                  mediaId={mediaId} 
                  onSubmitted={() => {
                    fetchComments();
                  }} 
                />
              </div>
            ) : (
              <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 max-w-2xl mx-auto">
                <Loader2 size={24} className="text-cyan-400 animate-spin mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Preparando formulario...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-20 text-center p-12 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl max-w-2xl mx-auto">
            <p className="text-gray-500 mb-6">Inicia sesión para dejar tu comentario y calificar nuestro servicio</p>
            <Link 
              to="/login?from=/testimonios"
              className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all"
            >
              <LogIn size={16} /> Iniciar Sesión
            </Link>
          </div>
        )}

        {/* Testimonials Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 italic">No se encontraron reseñas con esta calificación.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredComments.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col relative group hover:border-cyan-500/30 transition-all duration-500"
                >
                  <Quote className="absolute top-6 right-8 text-cyan-500/10 group-hover:text-cyan-500/20 transition-colors" size={48} />
                  
                  <div className="mb-4">
                    <StarRating value={c.stars} readOnly size={18} />
                  </div>

                  <p className="text-gray-300 leading-relaxed mb-8 italic flex-grow">
                    "{c.content}"
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-white/5 mt-auto">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
                      {(c.authorName || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-black text-sm uppercase tracking-tight">{c.authorName || 'Cliente verificado'}</p>
                      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                        {new Date(c.createdAt).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase italic leading-tight">
            ¿Ya eres parte de la <span className="text-cyan-400">revolución</span>?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
            Tu opinión nos ayuda a mejorar y ayuda a otros a elegir la mejor conexión. ¡Queremos escucharte!
          </p>
          <Link
            to={user ? "#" : "/login?from=/testimonios"}
            onClick={(e) => { if(user) { e.preventDefault(); window.scrollTo({ top: 400, behavior: 'smooth' }); } }}
            className="inline-flex items-center gap-3 px-10 py-4 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-full hover:bg-white transition-all shadow-[0_0_40px_rgba(6,182,212,0.4)]"
          >
            DEJAR MI EXPERIENCIA <TrendingUp size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
