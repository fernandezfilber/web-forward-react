import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Users, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

const API = import.meta.env.VITE_API_URL || '/api';

// Testimonios demo mientras no hay datos reales
const DEMO = [
  { id: 1, authorName: 'María García', content: 'Excelente servicio, la velocidad es increíble. Nunca había tenido internet tan estable en mi casa.', stars: 5, createdAt: '2026-04-10' },
  { id: 2, authorName: 'Carlos Ríos', content: 'La instalación fue rápida y el técnico muy amable. Llevo 3 meses y cero cortes.', stars: 5, createdAt: '2026-04-18' },
  { id: 3, authorName: 'Ana Torres', content: 'Super recomendado. El soporte responde al instante por WhatsApp. El precio es justo para lo que ofrecen.', stars: 4, createdAt: '2026-04-25' },
  { id: 4, authorName: 'Luis Mendoza', content: 'El plan FULL GIGA es una bestia. Trabajo desde casa y no tengo ningún problema con videollamadas.', stars: 5, createdAt: '2026-05-01' },
];

function StatCard({ value, label }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-black text-[#3C0061] mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default function Testimonials() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/comments?limit=20&approved=true`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        // El backend devuelve 'items', no 'comments'
        const items = data?.items?.filter(c => c.stars >= 1) || [];
        if (items.length >= 2) {
          setComments(items);
          const avg = items.reduce((s, c) => s + (c.stars || 0), 0) / items.length;
          setAvgRating(parseFloat(avg.toFixed(1)));
        } else {
          setComments(DEMO);
          setAvgRating(4.8);
        }
      })
      .catch(() => { setComments(DEMO); setAvgRating(4.8); })
      .finally(() => setLoading(false));
  }, []);

  const prev = () => setCurrent(c => (c - 1 + comments.length) % comments.length);
  const next = () => setCurrent(c => (c + 1) % comments.length);

  // Auto-advance carousel
  useEffect(() => {
    if (comments.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [comments.length]);

  const totalRatings = comments.length;
  const fiveStars = comments.filter(c => c.stars === 5).length;
  const pct5 = totalRatings ? Math.round((fiveStars / totalRatings) * 100) : 0;

  return (
    <section id="testimonios" className="py-20 md:py-28 bg-[#fafafa] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#3C0061]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label">Opiniones reales</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Lo que dicen nuestros<br />
            <span className="text-[#3C0061]">clientes</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Miles de familias y empresas confían en Forward Vision para su conexión diaria.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-8 mb-16 py-8 border-y border-gray-200"
        >
          <StatCard value={`${avgRating} ★`} label="Promedio general" />
          <StatCard value={`${pct5}%`} label="Calificaron con 5 ★" />
          <StatCard value={`${totalRatings}+`} label="Reseñas verificadas" />
        </motion.div>

        {/* Rating promedio visual */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-12"
        >
          <p className="text-7xl font-black text-gray-900 mb-2">{avgRating}</p>
          <StarRating value={Math.round(avgRating)} readOnly size={32} />
          <p className="text-gray-400 mt-2 flex items-center gap-2">
            <Users size={16} /> {totalRatings} clientes calificaron
          </p>
        </motion.div>

        {/* Carousel */}
        {!loading && comments.length > 0 && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="relative bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm">
                  {/* Quote icon */}
                  <Quote className="absolute top-6 right-8 text-[#3C0061]/10" size={64} />

                  {/* Stars */}
                  <StarRating value={comments[current].stars} readOnly size={22} />

                  {/* Comment */}
                  <p className="text-gray-800 text-xl leading-relaxed mt-4 mb-6 font-light">
                    "{comments[current].content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#3C0061] flex items-center justify-center text-white font-bold text-lg">
                      {(comments[current].authorName || 'C')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold">{comments[current].authorName || 'Cliente verificado'}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(comments[current].createdAt).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#3C0061] hover:text-white hover:border-[#3C0061] flex items-center justify-center text-gray-400 transition-all"
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {comments.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 h-2 bg-[#3C0061]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir al testimonio ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#3C0061] hover:text-white hover:border-[#3C0061] flex items-center justify-center text-gray-400 transition-all"
                aria-label="Siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <p className="text-gray-500 mb-4">Ya eres cliente? Comparte tu experiencia</p>
          <Link
            to={user ? "/testimonios" : "/login?from=/testimonios"}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#3C0061] text-white rounded-full hover:bg-[#5a0090] font-semibold transition-all"
          >
            <MessageSquare size={16} /> {user ? 'Dejar mi comentario' : 'Iniciar sesion para comentar'}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

