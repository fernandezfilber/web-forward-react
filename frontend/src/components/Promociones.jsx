import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, Gift, ArrowRight, Clock, CheckCircle2, Timer } from 'lucide-react';

const PROMOS = [
  {
    id: 1,
    icon: Gift,
    badge: 'Sin costo adicional',
    title: 'Instalación\nGRATIS',
    description: 'Olvídate del costo de instalación. Técnicos certificados llegan a tu hogar sin cobro extra.',
    color: 'from-emerald-500 to-teal-500',
    items: ['Instalación de fibra óptica', 'Configuración de router', 'Prueba de velocidad incluida'],
    tag: '¡Válido ahora!',
  },
  {
    id: 2,
    icon: Zap,
    badge: 'Oferta de bienvenida',
    title: 'Doble velocidad\nPOR 2 MESES',
    description: 'Los primeros dos meses disfruta el doble de la velocidad de tu plan, al mismo precio.',
    color: 'from-cyan-500 to-blue-500',
    items: ['Aplica a todos los planes', 'Sin cambio de precio', 'Velocidad simétrica'],
    tag: '🔥 Más popular',
    featured: true,
  },
  {
    id: 3,
    icon: Wifi,
    badge: 'Planes +S/120',
    title: 'Repetidor WiFi\nGRATIS',
    description: 'Para planes mayores a S/120 incluimos un repetidor WiFi de alta potencia para cubrir toda tu casa.',
    color: 'from-violet-500 to-purple-600',
    items: ['Cobertura total del hogar', 'WiFi 6 de alta potencia', 'Configuración incluida'],
    tag: 'Solo por tiempo limitado',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Calcular fecha de expiración — siempre fin del mes actual
function getExpiry() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const expiry = getExpiry();

    const tick = () => {
      const diff = expiry - new Date();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000)  / 60000),
        seconds: Math.floor((diff % 60000)    / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Flip card effect */}
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-14 h-14 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center shadow-inner"
        >
          <span className="text-2xl font-black text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </motion.div>
      </div>
      <span className="text-white/40 text-xs mt-1.5 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown();
  const [pulse, setPulse] = useState(false);

  // Pulso visual cada segundo
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-14"
    >
      <div className="relative inline-flex flex-col items-center bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-3xl px-10 py-6 max-w-xl mx-auto w-full">
        {/* Glow pulse */}
        <div className={`absolute inset-0 rounded-3xl bg-red-500/5 transition-opacity duration-200 ${pulse ? 'opacity-100' : 'opacity-0'}`} />

        <div className="flex items-center gap-2 mb-4">
          <Timer size={16} className="text-red-400 animate-pulse" />
          <span className="text-red-400 text-sm font-bold uppercase tracking-wider">
            ¡Oferta termina en!
          </span>
          <Timer size={16} className="text-red-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-3">
          <CountdownBox value={days} label="días" />
          <span className="text-white/30 text-3xl font-black mb-5">:</span>
          <CountdownBox value={hours} label="horas" />
          <span className="text-white/30 text-3xl font-black mb-5">:</span>
          <CountdownBox value={minutes} label="min" />
          <span className={`text-3xl font-black mb-5 transition-colors duration-150 ${pulse ? 'text-red-400' : 'text-white/30'}`}>:</span>
          <CountdownBox value={seconds} label="seg" />
        </div>

        <p className="text-white/30 text-xs mt-4">
          * Válido hasta el{' '}
          {getExpiry().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
}

export default function Promociones() {
  return (
    <section id="promociones" className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-violet-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-white/10 rounded-full mb-6">
            <Clock size={14} className="text-cyan-400" />
            <span className="text-white/70 text-sm font-medium">Promociones especiales — Tiempo limitado</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Beneficios que no<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              encontrarás en otro lugar
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Contrata hoy y aprovecha todas estas ventajas exclusivas para nuevos clientes.
          </p>
        </motion.div>

        {/* ── COUNTDOWN ── */}
        <div className="flex justify-center">
          <Countdown />
        </div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {PROMOS.map((promo) => {
            const Icon = promo.icon;
            return (
              <motion.div
                key={promo.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
                  promo.featured
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                    : 'border-white/8 hover:border-white/20'
                }`}
              >
                {promo.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-black rounded-full shadow-lg">
                      {promo.tag}
                    </span>
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${promo.color} opacity-[0.07]`} />
                <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${promo.color}`} />

                <div className="relative p-8">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    {promo.badge}
                  </span>

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${promo.color} flex items-center justify-center mt-4 mb-5 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white leading-tight mb-3 whitespace-pre-line">
                    {promo.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {promo.description}
                  </p>

                  <ul className="space-y-2 mb-8">
                    {promo.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="/planes"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-gradient-to-r ${promo.color} text-white hover:opacity-90 hover:shadow-lg group`}
                  >
                    Ver planes
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-gray-600 text-sm mt-10"
        >
          * Promociones válidas para nuevos clientes. Consulta términos y condiciones.
        </motion.p>
      </div>
    </section>
  );
}
