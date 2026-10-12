import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: '�Cu�nto tiempo tarda la instalaci�n del servicio?',
    answer: 'La instalaci�n se realiza en un plazo m�ximo de 24 horas h�biles despu�s de confirmada tu solicitud y validada la cobertura en tu zona.',
  },
  {
    question: '�Necesito comprar un router especial para la fibra �ptica?',
    answer: 'No, nosotros te proporcionamos en calidad de pr�stamo (comodato) un router ONT de �ltima generaci�n (WiFi Dual Band / WiFi 6 dependiendo del plan) sin costo adicional.',
  },
  {
    question: '�Puedo cambiar mi plan de internet m�s adelante?',
    answer: '�Por supuesto! Puedes solicitar una mejora de plan (upgrade) en cualquier momento comunic�ndote con nuestro soporte. El cambio se aplica en tu pr�ximo ciclo de facturaci�n.',
  },
  {
    question: '�Qu� diferencia hay entre la TV Digital y la TV por cable tradicional?',
    answer: 'Nuestra TV Digital transmite la se�al a trav�s de la misma fibra �ptica, ofreciendo calidad de imagen 4K/HD sin interferencias por clima, adem�s de funciones interactivas y mayor estabilidad.',
  },
  {
    question: '�Qu� hago si tengo problemas con mi conexi�n?',
    answer: 'Contamos con soporte t�cnico 24/7. Puedes contactarnos por WhatsApp al +51 900 970 806 y nuestro equipo te ayudar� a resolver cualquier inconveniente r�pidamente.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label">Centro de Ayuda</span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Preguntas <span className="text-[#0047FF]">Frecuentes</span>
          </h2>
          <p className="text-gray-500 text-sm md:text-base">
            Encuentra respuestas r�pidas a las dudas m�s comunes sobre nuestro servicio.
          </p>
        </div>

        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className={`font-bold text-[15px] ${openIndex === index ? 'text-[#0047FF]' : 'text-gray-800'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-[#0047FF]/10 text-[#0047FF]' : 'bg-gray-100 text-gray-400'}`}>
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50 mt-2">
                      <p className="pt-3">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA a IA */}
        <div className="bg-[#0047FF]/5 border border-[#0047FF]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="text-lg font-black text-gray-900 mb-2">�Tienes m�s dudas?</h3>
            <p className="text-gray-600 text-sm">
              Prueba <span className="font-bold text-[#0047FF]">Forward AI</span>. Nuestro asistente inteligente est� listo para responder cualquier pregunta sobre planes, cobertura o soporte t�cnico al instante.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-[#0047FF] text-white rounded-xl font-bold text-sm hover:bg-[#0038cc] transition-colors shadow-lg shadow-[#0047FF]/20"
          >
            <MessageCircle size={18} />
            Consultar a Forward AI
          </button>
        </div>
      </div>
    </section>
  );
}
