import React, { useState } from 'react';
import { X, MessageSquare, Send, Bot, User, HelpCircle, CheckCircle, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SupportChatModalProps {
  onClose: () => void;
  pairCode: string;
}

interface SupportMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({ onClose, pairCode }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 's1',
      sender: 'bot',
      text: `¡Hola! Soy CupidoBot, tu asistente de soporte técnico y consejero de DuoJoy 💖. ¿En qué puedo ayudarte hoy?`,
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');

  const faqs = [
    {
      q: '¿Cómo conecto a mi pareja en otro dispositivo?',
      a: `Para conectar a tu pareja, compártele tu código único: "${pairCode}". En la aplicación, ambos utilizarán el mismo canal seguro y podrán responder tests, enviar mensajes y ver recuerdos sincronizados en tiempo real.`,
    },
    {
      q: '¿Cómo publicar el juego en Itch.io?',
      a: `¡Es muy fácil! Puedes subir el archivo comprimido ZIP generado por la plataforma directamente a tu página de proyecto en itch.io. Configúralo como "HTML5 / Play in browser" con viewport responsivo para que las parejas puedan jugar desde su navegador móvil o de escritorio.`,
    },
    {
      q: '¿Cómo exportar nuestros datos a CSV?',
      a: `En las secciones de "Deseos", "Citas", "Recuerdos" y en el "Tablero de Métricas", encontrarás el botón "Exportar CSV". Esto descargará un archivo compatible con Excel y Google Sheets con todos sus recuerdos y fechas.`,
    },
    {
      q: '¿Cómo recuperar mi racha si olvidé responder?',
      a: `Con el Pase VIP tienes una protección de racha de 24 horas. También puedes responder la pregunta pendiente en cualquier momento desde la pestaña "Juegos & Test" para continuar tu racha de amor.`,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    sounds.playPop();
    const userMsg: SupportMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      time: 'Ahora',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Generate smart response
    setTimeout(() => {
      sounds.playLovePing();
      let reply = `Gracias por tu consulta. Hemos tomado nota de tu solicitud y tu sesión se encuentra protegida bajo el código ${pairCode}. Si requieres más detalles sobre las funciones de pareja, estamos a tu disposición.`;

      const lower = query.toLowerCase();
      if (lower.includes('itch') || lower.includes('publicar')) {
        reply = `Para publicar en itch.io: Exporta el proyecto en formato ZIP, súbelo a tu panel de itch.io, marca la opción "This file will be played in the browser", y define una resolución recomendada de 1080x720 o responsive. ¡La comunidad de itch.io adora los juegos colaborativos de pareja!`;
      } else if (lower.includes('csv') || lower.includes('exportar') || lower.includes('descargar')) {
        reply = `Puedes exportar tus datos en cualquier momento desde la pestaña "Métricas" pulsando "Exportar Informe CSV Completo". Incluye todas las citas, deseos y respuestas de compatibilidad.`;
      } else if (lower.includes('sincronizar') || lower.includes('pareja') || lower.includes('codigo')) {
        reply = `El código actual de tu pareja es ${pairCode}. La aplicación utiliza sincronización en tiempo real de baja latencia. Puedes alternar la vista entre Sofía y Mateo desde la barra superior para probar ambas perspectivas.`;
      }

      const botMsg: SupportMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Ahora',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
                <span>CupidoBot Soporte Técnico</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </h3>
              <p className="text-xs text-zinc-500">Asistencia integrada en tiempo real</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick FAQs */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase text-zinc-400">
            Preguntas frecuentes rápidas:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {faqs.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(f.q)}
                className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 whitespace-nowrap transition"
              >
                {f.q}
              </button>
            ))}
          </div>
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shrink-0 mt-1">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            placeholder="Pregunta algo sobre DuoJoy o tu pareja..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
