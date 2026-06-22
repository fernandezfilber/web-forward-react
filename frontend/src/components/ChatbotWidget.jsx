import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Minimize2, Loader2 } from 'lucide-react';
import icono from '../assets/icono.png';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '¡Hola! 👋 Soy **Forward AI**, tu asesor experto en Forward Vision. Cuéntame, ¿estás buscando mejorar tu internet actual para trabajar, jugar o para que toda la familia disfrute sin cortes?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  // ==================== CONFIGURACIÓN ====================
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.1-70b-versatile";

  const callGroqAPI = async (newMessages) => {
    if (!GROQ_API_KEY || GROQ_API_KEY.length < 10) {
      console.error("VITE_GROQ_API_KEY no está configurada correctamente");
      return {
        reply: "⚠️ **Error de Configuración**: No se encontró una clave de API válida para Groq. Contacta al administrador.",
        intent: "ERROR",
        action: "NONE"
      };
    }

    try {
      const systemPrompt = `Eres Forward AI, el asesor experto de "Forward Vision" (Perú). 
Tu prioridad es ser amable, profesional y persuasivo, usando la información oficial de nuestros planes.

--- NUESTROS PLANES (100% FIBRA ÓPTICA) ---
Todos los planes incluyen Entretenimiento y Velocidad en un solo paquete:
1. PLAN BÁSICO: 250MBPS a solo S/ 60.00 mensual.
2. PLAN NORMAL: 500MBPS a solo S/ 80.00 mensual.
3. PLAN PREMIUM: 700MBPS a solo S/ 100.00 mensual.
4. PLAN FULL: 1000MBPS a solo S/ 150.00 mensual.

--- BENEFICIOS CLAVE (Mencionalos para convencer) ---
- ✅ ACTIVACIÓN SIN COSTO ADICIONAL.
- ✅ 100% Fibra Óptica Pura.
- ✅ Velocidad Simétrica Ilimitada (misma velocidad de subida y bajada).
- ✅ Conexión Estable y de Alta Velocidad.
- ✅ Incluye Servicio de TV (+100 canales).
- ✅ Asistencia técnica disponible siempre que la necesites.

--- PROTOCOLO DE CONVERSACIÓN ---
1. CHARLA INICIAL: Saluda amablemente. Si preguntan por planes, detalla las opciones y resalta que la ACTIVACIÓN ES GRATIS y que es FIBRA ÓPTICA PURA.
2. PERSUASIÓN: Si el cliente duda, menciónale que son planes pensados para ahorrar a largo plazo y que no hay límites de conexión.
3. CIERRE Y DATOS: SOLO cuando el cliente esté convencido y diga "Quiero contratar" o similar, solicita:
   - DNI (8 dígitos).
   - Nombre y Apellidos Completos.
   - Dirección Exacta (con referencias) o Ubicación GPS en tiempo real.
   - Número de Teléfono de contacto.
   - Plan elegido.
4. CONFIRMACIÓN: Haz un resumen de los datos y pide confirmación antes de usar "FINALIZAR_VENTA".

--- SOPORTE ---
- Intenta ayudar primero con: Reinicio de router (30 seg), verificar cables amarillos, búsqueda automática de canales en TV.
- Si no funciona, pide DNI, Nombre, Dirección y descripción de la falla para derivar al técnico.

--- FORMATO JSON ---
Responde siempre en este formato:
{
  "reply": "Tu mensaje aquí",
  "intent": "SALES" | "SUPPORT" | "GREETING",
  "action": "NONE" | "FINALIZAR_VENTA" | "DERIVAR_SOPORTE",
  "collected_data": { "dni": "...", "nombre": "...", "direccion": "...", "telefono": "...", "plan": "...", "averia": "..." }
}`;

      const history = newMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            ...history
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Error en la API de Groq");
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Error parsing JSON from AI:", content);
        return { reply: content, intent: "UNKNOWN", action: "NONE" };
      }

    } catch (error) {
      console.error("Chatbot error:", error);
      return {
        reply: `❌ **Error de Conexión**: ${error.message}. Por favor, intenta de nuevo.`,
        intent: "ERROR",
        action: "NONE"
      };
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userText = inputValue.trim();
    const userMessage = {
      id: Date.now(),
      text: userText,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    const botResponse = await callGroqAPI(updatedMessages);

    setMessages(prev => [...prev, {
      id: Date.now() + 2,
      text: botResponse.reply,
      sender: 'bot',
      timestamp: new Date(),
    }]);

    // Detectar cierre de venta y generar link de WhatsApp
    if (botResponse.action === 'FINALIZAR_VENTA') {
      const data = botResponse.collected_data || {};
      const whatsappMsg = `¡Hola! Acabo de contratar un plan con forward AI.\n\n📄 *Datos del Pedido:*\n- Plan: ${data.plan || 'No especificado'}\n- DNI: ${data.dni || 'No especificado'}\n- Nombre: ${data.nombre || 'No especificado'}\n- Dirección: ${data.direccion || 'No especificada'}\n- Teléfono: ${data.telefono || 'No especificado'}\n\nQuedo atento a la instalación. 🚀`;
      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappUrl = `https://wa.me/51936652047?text=${encodedMsg}`;

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 3,
          text: `✨ **¡Excelente elección!** Todo está listo. Para finalizar el proceso y agendar tu instalación, haz clic en el siguiente botón para enviarme tus datos por WhatsApp:
          
          <a href="${whatsappUrl}" target="_blank" class="inline-block mt-3 px-6 py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-all flex items-center gap-2">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.149-1.265-.466-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.098-.203.048-.377-.027-.525-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345zM20.52 3.449A11.964 11.964 0 0012 0C5.373 0 0 5.373 0 12c0 2.126.549 4.2 1.593 6.03L.028 23.974l6.096-1.597A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12 0-3.204-1.248-6.21-3.48-8.551z"/></svg>
            Finalizar en WhatsApp
          </a>`,
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }, 800);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-[0_0_60px_rgba(6,182,212,0.6)] z-50 flex items-center justify-center p-6 border-4 border-cyan-500/50 overflow-hidden pulse-heartbeat"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={64} className="text-cyan-500" /> : <img src={icono} alt="forward AI" className="w-full h-full object-contain" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 z-50 flex flex-col"
            style={{ height: '560px' }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white p-1">
                  <img src={icono} alt="forward AI" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Asistente Forward AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <p className="text-[10px] opacity-70">En línea | Consultoría IA</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="opacity-70 hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: message.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-[10px] text-slate-400 font-medium">Forward AI está pensando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 focus-within:border-blue-400 transition-colors">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu mensaje aquí..."
                  className="flex-1 px-4 py-2 bg-transparent text-slate-700 text-sm outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/20"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-3 font-medium">
                Powered by Forward Vision AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}