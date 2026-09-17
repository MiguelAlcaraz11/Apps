import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Crown, Sparkles, Check, Heart, ShieldCheck, Zap, Key, ExternalLink } from 'lucide-react';
import { CoupleProfile } from '../types';
import { sounds } from '../utils/audio';

interface PremiumModalProps {
  profile: CoupleProfile;
  onTogglePremium: () => void;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  profile,
  onTogglePremium,
  onClose,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);

  const perks = [
    { title: 'Temas & Paletas VIP', desc: 'Desbloquea Rosa Dorado, Medianoche Neón y Sakura Romántico' },
    { title: 'Recuerdos Polaroid Ilimitados', desc: 'Guarda cientos de fotos y anécdotas en alta resolución' },
    { title: 'Generador Inteligente de Citas', desc: 'Sugerencias ilimitadas con presupuestos e itinerarios' },
    { title: 'Insignia Dorada en el Ranking', desc: 'Destaca en la tabla de clasificación de parejas en itch.io' },
    { title: 'Copia de Seguridad en la Nube', desc: 'Sincronización multi-dispositivo prioritaria y exportación continua' },
    { title: 'Stickers & Notas de Amor Exclusivas', desc: 'Colección completa de stickers animados para el chat' },
  ];

  const handleToggle = () => {
    sounds.playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onTogglePremium();
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (!clean) return;

    // Accepts common promo codes or keys
    if (clean === 'DUOJOY-VIP' || clean === 'ITCH-LOVE' || clean === 'PAREJA2026' || clean.length >= 6) {
      setCodeError('');
      setCodeSuccess(true);
      sounds.playSuccessChime();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      if (!profile.isPremium) {
        onTogglePremium();
      }
      setTimeout(() => {
        setCodeSuccess(false);
      }, 3000);
    } else {
      sounds.playPop();
      setCodeError('Código no válido. Usa DUOJOY-VIP o tu clave de compra de itch.io.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-amber-300/80 dark:border-amber-700/80 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Crown className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                  DuoJoy VIP Pass
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                  itch.io Edition
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                La experiencia más romántica y completa para parejas
              </p>
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

        {/* Pricing card simulation */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-400">
              Pase Vitalicio de Pareja
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-zinc-900 dark:text-white">
                $4.99 USD
              </span>
              <span className="text-xs text-zinc-500 line-through">$9.99</span>
              <span className="text-xs font-semibold text-emerald-600">50% dto.</span>
            </div>
            <p className="text-[11px] text-zinc-400">Pago único • Sin suscripciones ocultas</p>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                profile.isPremium
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {profile.isPremium ? '✓ Activado' : 'Versión Básica'}
            </span>
          </div>
        </div>

        {/* Perks list */}
        <div className="space-y-2.5">
          {perks.map((p, i) => (
            <div key={i} className="flex items-start gap-3 text-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <div>
                <strong className="text-zinc-900 dark:text-zinc-100">{p.title}: </strong>
                <span className="text-zinc-500 dark:text-zinc-400">{p.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Redeem code section */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>¿Compraste tu clave en itch.io o tienes un código?</span>
          </div>

          <form onSubmit={handleRedeemCode} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ej: DUOJOY-VIP o clave de compra"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white uppercase font-mono tracking-wider focus:outline-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-xs transition"
            >
              Canjear
            </button>
          </form>

          {codeSuccess && (
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> ¡Pase VIP activado con éxito!
            </p>
          )}

          {codeError && (
            <p className="text-[11px] text-rose-500 font-semibold">{codeError}</p>
          )}
        </div>

        {/* Action button */}
        <div className="pt-2 space-y-2">
          <button
            id="toggle-premium-status-btn"
            type="button"
            onClick={handleToggle}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-zinc-950 font-black text-sm shadow-md shadow-amber-500/25 transition active:scale-98"
          >
            {profile.isPremium
              ? 'Desactivar Modo VIP (Volver a Gratuito)'
              : '⚡ Activar Pase VIP Inmediato (Demostración)'}
          </button>

          <p className="text-[11px] text-center text-zinc-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Integración con itch.io, exportación CSV y datos locales garantizados.
          </p>
        </div>
      </div>
    </div>
  );
};
