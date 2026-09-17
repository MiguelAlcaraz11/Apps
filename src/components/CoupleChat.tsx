import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Smile, Mic, Image as ImageIcon, Sparkles, Volume2, UserCheck } from 'lucide-react';
import { ChatMessage, Partner, CoupleProfile } from '../types';
import { sounds } from '../utils/audio';

interface CoupleChatProps {
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id'>) => void;
  activePartner: Partner;
  profile: CoupleProfile;
  onSwitchPartner: (partner: Partner) => void;
  onGainXp: (amount: number) => void;
}

export const CoupleChat: React.FC<CoupleChatProps> = ({
  messages,
  onSendMessage,
  activePartner,
  profile,
  onSwitchPartner,
  onGainXp,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickers, setShowStickers] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stickers = [
    { emoji: '🧸', label: 'Abrazo de oso' },
    { emoji: '😘', label: 'Beso con amor' },
    { emoji: '🍣', label: '¿Comemos sushi?' },
    { emoji: '💐', label: 'Flores para ti' },
    { emoji: '💌', label: 'Carta de amor' },
    { emoji: '✨', label: 'Brillas siempre' },
    { emoji: '😴', label: 'Dormir juntitos' },
    { emoji: '🍿', label: 'Noche de cine' },
  ];

  const quickPings = [
    '¡Te extraño mucho! 🥺❤️',
    'Un beso volador de emergencia 😘',
    '¡Te amo más de lo que imaginas! 💕',
    '¿Ya pensaste qué cenamos hoy? 🍕',
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    sounds.playPop();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSendMessage({
      senderId: activePartner.id,
      text: inputText.trim(),
      timestamp: time,
      type: 'text',
    });

    setInputText('');
    onGainXp(10);
  };

  const handleSendSticker = (sticker: { emoji: string; label: string }) => {
    sounds.playLovePing();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSendMessage({
      senderId: activePartner.id,
      text: `${sticker.emoji} ${sticker.label}`,
      timestamp: time,
      type: 'sticker',
    });

    setShowStickers(false);
    onGainXp(10);
  };

  const handleSendLovePing = (pingText: string) => {
    sounds.playLovePing();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSendMessage({
      senderId: activePartner.id,
      text: pingText,
      timestamp: time,
      type: 'love_ping',
    });

    onGainXp(15);
  };

  const handleSendSimAudio = () => {
    sounds.playSuccessChime();
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onSendMessage({
      senderId: activePartner.id,
      text: '🎵 Nota de voz: "Solo quería decirte lo mucho que te amo..." (0:14)',
      timestamp: time,
      type: 'audio_sim',
    });

    onGainXp(15);
  };

  const otherPartner = activePartner.id === profile.partner1.id ? profile.partner2 : profile.partner1;

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      {/* Chat header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherPartner.avatar}
              alt={otherPartner.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-rose-400"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>{otherPartner.name}</span>
              <span className="text-xs text-rose-500 font-normal">({otherPartner.nickname})</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <span>{otherPartner.mood}</span>
              <span>{otherPartner.moodText}</span>
            </p>
          </div>
        </div>

        {/* Switch Persona toggle for testing chat */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            onSwitchPartner(otherPartner);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition"
          title="Cambiar perspectiva para responder como tu pareja"
        >
          <UserCheck className="w-3.5 h-3.5 text-rose-500" />
          <span>Responder como {otherPartner.name}</span>
        </button>
      </div>

      {/* Quick love phrases bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {quickPings.map((ping, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendLovePing(ping)}
            className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold whitespace-nowrap hover:bg-rose-100 transition shadow-2xs"
          >
            {ping}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 sm:p-5 h-[420px] overflow-y-auto space-y-3.5">
        <div className="text-center py-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            🔒 Chat Privado Cifrado de Pareja
          </span>
        </div>

        {messages.map((m) => {
          const isMe = m.senderId === activePartner.id;
          const sender = m.senderId === profile.partner1.id ? profile.partner1 : profile.partner2;

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={sender.avatar}
                  alt={sender.name}
                  className="w-7 h-7 rounded-full object-cover border border-rose-300 mb-1"
                />
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-2xs text-xs sm:text-sm ${
                  isMe
                    ? 'bg-rose-500 text-white rounded-br-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-bl-xs'
                }`}
              >
                {m.type === 'love_ping' ? (
                  <div className="flex items-center gap-2 font-bold py-1">
                    <Heart className="w-4 h-4 fill-current animate-pulse text-amber-300" />
                    <span>{m.text}</span>
                  </div>
                ) : m.type === 'audio_sim' ? (
                  <div className="flex items-center gap-2 font-medium">
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>{m.text}</span>
                  </div>
                ) : (
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                )}

                <div
                  className={`text-[10px] mt-1 text-right ${
                    isMe ? 'text-rose-100' : 'text-zinc-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Stickers Popover */}
      {showStickers && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-4 shadow-xl grid grid-cols-4 gap-2">
          {stickers.map((st, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendSticker(st)}
              className="p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-zinc-800 border border-transparent hover:border-rose-200 transition text-center"
            >
              <div className="text-3xl mb-1">{st.emoji}</div>
              <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 line-clamp-1">
                {st.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <form
        onSubmit={handleSend}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-2 sm:p-2.5 flex items-center gap-2 shadow-xs"
      >
        <button
          type="button"
          onClick={() => setShowStickers(!showStickers)}
          className="p-2 text-zinc-500 hover:text-rose-500 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Stickers de amor"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleSendSimAudio}
          className="p-2 text-zinc-500 hover:text-rose-500 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          title="Mandar nota de voz de amor"
        >
          <Mic className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder={`Escribe un mensajito para ${otherPartner.name}...`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent text-zinc-900 dark:text-white focus:outline-none"
        />

        <button
          id="send-chat-message-btn"
          type="submit"
          className="p-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white shadow-xs transition"
          title="Enviar mensaje"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
