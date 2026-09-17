import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Sparkles, MessageCircle, Gift, Camera, Flame, Share2, Copy, Check, ArrowRight, Music, ShieldCheck } from 'lucide-react';
import { CoupleProfile, Partner, QuizQuestion, DatePlan, WishlistItem } from '../types';
import { sounds } from '../utils/audio';

interface HomeOverviewProps {
  profile: CoupleProfile;
  activePartner: Partner;
  onUpdatePartnerMood: (mood: string, moodText: string) => void;
  onSendLovePing: () => void;
  dailyQuestion?: QuizQuestion;
  nextDate?: DatePlan;
  wishlist: WishlistItem[];
  onNavigate: (tab: string) => void;
  onOpenShareModal: () => void;
  onOpenPremium: () => void;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  profile,
  activePartner,
  onUpdatePartnerMood,
  onSendLovePing,
  dailyQuestion,
  nextDate,
  wishlist,
  onNavigate,
  onOpenShareModal,
  onOpenPremium,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);
  const [now, setNow] = useState(new Date());

  // Update live clock every minute for precise relationship duration
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getRelationshipDuration = () => {
    const start = new Date(profile.anniversaryDate).getTime();
    const current = now.getTime();
    const diffMs = Math.max(0, current - start);

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = remainingDays % 30;

    return { totalDays, years, months, days };
  };

  const duration = getRelationshipDuration();

  const handleLovePing = () => {
    sounds.playLovePing();
    onSendLovePing();

    // Spawn 5 cute floating hearts
    const newHearts = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      left: 30 + Math.random() * 40,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.pairCode);
    setCopiedCode(true);
    sounds.playPop();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const moods = [
    { emoji: '🥰', text: 'Súper enamorad@' },
    { emoji: '💭', text: 'Pensando en ti' },
    { emoji: '🧸', text: 'Necesito mimos' },
    { emoji: '✨', text: 'Emocionad@ por vernos' },
    { emoji: '🍕', text: 'Con hambre juntos' },
    { emoji: '😴', text: 'Modo perezoso' },
  ];

  const completedWishesCount = wishlist.filter((w) => w.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 relative overflow-hidden">
      {/* Floating hearts container */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="absolute z-50 pointer-events-none text-rose-500 text-3xl animate-float-heart"
          style={{ left: `${h.left}%`, bottom: '20%' }}
        >
          ❤️
        </div>
      ))}

      {/* Main Hero Couple Card */}
      <div
        id="couple-hero-card"
        className="relative rounded-3xl overflow-hidden shadow-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all"
      >
        {/* Cover image / gradient header */}
        <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
          <img
            src={profile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover opacity-85 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Quick action buttons on cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              id="share-couple-card-btn"
              type="button"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/25 hover:bg-white/40 text-white backdrop-blur-md text-xs font-semibold shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>
            <div
              id="couple-pair-code"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md text-xs font-mono font-bold cursor-pointer transition"
              title="Haz clic para copiar código de emparejamiento"
            >
              <span>{profile.pairCode}</span>
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-zinc-300" />}
            </div>
          </div>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">
              {profile.partner1.name} & {profile.partner2.name}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-100 font-medium line-clamp-1 drop-shadow-sm">
              "{profile.bio}"
            </p>
          </div>
        </div>

        {/* Counter and Partners Row */}
        <div className="p-4 sm:p-6">
          {/* Days Together Counter */}
          <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                Nuestra Historia de Amor
              </span>
              <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                  {duration.totalDays.toLocaleString()}
                </span>
                <span className="text-base font-semibold text-zinc-600 dark:text-zinc-400">
                  días juntos
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                ({duration.years} años, {duration.months} meses y {duration.days} días) • Desde {profile.anniversaryDate}
              </p>
            </div>

            {/* Send Instant Love Ping Button */}
            <button
              id="send-instant-love-ping-btn"
              type="button"
              onClick={handleLovePing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-bold text-sm shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 fill-white animate-pulse" />
              <span>Enviar Amor Inmediato</span>
            </button>
          </div>

          {/* Dual Profile Status & Mood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Partner 1 Box */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                activePartner.id === profile.partner1.id
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={profile.partner1.avatar}
                  alt={profile.partner1.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-400 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {profile.partner1.name}
                    </h3>
                    <span className="text-xs text-zinc-500">({profile.partner1.nickname})</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm">{profile.partner1.mood}</span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {profile.partner1.moodText}
                    </span>
                  </div>
                </div>
              </div>

              {activePartner.id === profile.partner1.id && (
                <div className="mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-700/50">
                  <p className="text-[11px] font-semibold text-zinc-500 mb-1.5">
                    ¿Cómo te sientes hoy, {profile.partner1.name}?
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {moods.map((m) => (
                      <button
                        key={m.text}
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          onUpdatePartnerMood(m.emoji, m.text);
                        }}
                        className={`text-base p-1.5 rounded-xl border transition ${
                          profile.partner1.mood === m.emoji
                            ? 'bg-rose-200/60 border-rose-400 scale-110'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:scale-105'
                        }`}
                        title={m.text}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Partner 2 Box */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                activePartner.id === profile.partner2.id
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 shadow-xs'
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={profile.partner2.avatar}
                  alt={profile.partner2.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-rose-400 shadow-xs"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {profile.partner2.name}
                    </h3>
                    <span className="text-xs text-zinc-500">({profile.partner2.nickname})</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-sm">{profile.partner2.mood}</span>
                    <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      {profile.partner2.moodText}
                    </span>
                  </div>
                </div>
              </div>

              {activePartner.id === profile.partner2.id && (
                <div className="mt-3 pt-3 border-t border-zinc-200/70 dark:border-zinc-700/50">
                  <p className="text-[11px] font-semibold text-zinc-500 mb-1.5">
                    ¿Cómo te sientes hoy, {profile.partner2.name}?
                  </p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {moods.map((m) => (
                      <button
                        key={m.text}
                        type="button"
                        onClick={() => {
                          sounds.playPop();
                          onUpdatePartnerMood(m.emoji, m.text);
                        }}
                        className={`text-base p-1.5 rounded-xl border transition ${
                          profile.partner2.mood === m.emoji
                            ? 'bg-rose-200/60 border-rose-400 scale-110'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:scale-105'
                        }`}
                        title={m.text}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Question Spotlight */}
        <div
          id="daily-question-card"
          className="p-5 rounded-3xl bg-gradient-to-br from-white to-rose-50/40 dark:from-zinc-900 dark:to-zinc-800/60 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Pregunta del Día
              </span>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-500" /> +50 XP
              </span>
            </div>

            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mt-1">
              {dailyQuestion?.question || '¿Qué detalle pequeño de hoy te recordó a nosotros?'}
            </h3>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Ambos responden en secreto para descubrir si piensan lo mismo.
            </p>
          </div>

          <button
            id="go-to-quiz-btn"
            type="button"
            onClick={() => {
              sounds.playPop();
              onNavigate('juegos');
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold hover:opacity-90 transition"
          >
            <span>Responder & Revelar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upcoming Date Card */}
        <div
          id="upcoming-date-card"
          className="p-5 rounded-3xl bg-gradient-to-br from-white to-amber-50/40 dark:from-zinc-900 dark:to-zinc-800/60 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Próxima Cita
              </span>
              <span className="text-xs font-semibold text-zinc-500">
                {nextDate?.date || 'Sin programar'}
              </span>
            </div>

            {nextDate ? (
              <>
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mt-1">
                  {nextDate.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1 line-clamp-2">
                  📍 {nextDate.location} • {nextDate.time || '19:00'}
                </p>
              </>
            ) : (
              <p className="text-xs text-zinc-500 mt-2">
                ¡Aún no tienen ninguna cita agendada! Sorprende a tu pareja con un plan especial.
              </p>
            )}
          </div>

          <button
            id="go-to-dates-btn"
            type="button"
            onClick={() => {
              sounds.playPop();
              onNavigate('citas');
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
          >
            <span>Ver Planificador de Citas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Launchpad to all features */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">
          Nuestras Actividades Interactivas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            id="quick-card-juegos"
            type="button"
            onClick={() => onNavigate('juegos')}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left hover:border-rose-300 dark:hover:border-rose-700 transition shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
              🎮
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
              Juegos & Test
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Ruleta, quién es más probable, compatibilidad
            </p>
          </button>

          <button
            id="quick-card-deseos"
            type="button"
            onClick={() => onNavigate('deseos')}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left hover:border-purple-300 dark:hover:border-purple-700 transition shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
              ✨
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
              Lista de Deseos
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {completedWishesCount} de {wishlist.length} cumplidos
            </p>
          </button>

          <button
            id="quick-card-chat"
            type="button"
            onClick={() => onNavigate('chat')}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left hover:border-emerald-300 dark:hover:border-emerald-700 transition shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
              💬
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
              Chat Privado
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Stickers de amor y notas íntimas
            </p>
          </button>

          <button
            id="quick-card-recuerdos"
            type="button"
            onClick={() => onNavigate('recuerdos')}
            className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left hover:border-pink-300 dark:hover:border-pink-700 transition shadow-xs group"
          >
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 flex items-center justify-center mb-2.5 group-hover:scale-110 transition">
              📸
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
              Álbum Polaroid
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Fotos y momentos especiales
            </p>
          </button>
        </div>
      </div>

      {/* Itch.io Community & Monetization Banner */}
      <div className="rounded-3xl p-5 bg-gradient-to-r from-zinc-900 via-zinc-800 to-rose-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-black">
            🎮
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base">
                Listo para publicar en Itch.io & Navegadores
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600">
                V1.0
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">
              Tu comunidad puede jugar en pareja, sincronizarse en tiempo real y desbloquear el Pase VIP.
            </p>
          </div>
        </div>

        <button
          id="hero-premium-btn"
          type="button"
          onClick={onOpenPremium}
          className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 text-xs font-extrabold shadow-sm transition"
        >
          {profile.isPremium ? 'Ver Beneficios VIP Activos' : 'Probar Pase VIP Premium'}
        </button>
      </div>
    </div>
  );
};
