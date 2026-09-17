import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, Heart, Flame, Sparkles } from 'lucide-react';
import { CoupleProfile } from '../types';
import { sounds } from '../utils/audio';

interface SocialShareModalProps {
  profile: CoupleProfile;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ profile, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'gradient-rose' | 'dark-luxury' | 'sunset-gold'>('gradient-rose');

  const calculateDays = () => {
    const start = new Date(profile.anniversaryDate).getTime();
    const now = new Date().getTime();
    return Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  };

  const days = calculateDays();

  const handleCopyLink = () => {
    sounds.playPop();
    const shareText = `¡Llevamos ${days} días juntos en DuoJoy! ❤️ Racha de ${profile.streakDays} días activa. Pruébalo en itch.io con nuestro código ${profile.pairCode}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    sounds.playLovePing();
    const shareData = {
      title: `${profile.partner1.name} & ${profile.partner2.name} en DuoJoy`,
      text: `¡Llevamos ${days} días de amor y una racha de ${profile.streakDays} días! Descubre qué tan compatibles son en DuoJoy ❤️`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Share cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
              Compartir en Redes Sociales
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Preview Card */}
        <div
          id="social-story-card-preview"
          className={`p-6 rounded-3xl text-white shadow-xl flex flex-col items-center justify-between text-center min-h-[340px] transition-all relative overflow-hidden ${
            selectedTheme === 'gradient-rose'
              ? 'bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400'
              : selectedTheme === 'dark-luxury'
              ? 'bg-gradient-to-tr from-zinc-950 via-zinc-900 to-purple-950 border border-zinc-700'
              : 'bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-800'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-black/25 px-3 py-1 rounded-full backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>DuoJoy • Amor & Conexión</span>
          </div>

          <div className="my-auto space-y-3">
            {/* Avatars */}
            <div className="flex items-center justify-center -space-x-3">
              <img
                src={profile.partner1.avatar}
                alt="P1"
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
              <img
                src={profile.partner2.avatar}
                alt="P2"
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
            </div>

            <div>
              <h2 className="text-xl font-black drop-shadow-md">
                {profile.partner1.name} & {profile.partner2.name}
              </h2>
              <div className="text-4xl font-extrabold tracking-tight mt-1 drop-shadow-md">
                {days.toLocaleString()} días
              </div>
              <p className="text-xs font-semibold text-rose-100 drop-shadow-xs">
                de risas, viajes y amor incondicional
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                Racha {profile.streakDays}d
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Nivel {profile.level}
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-white/80 bg-black/30 px-3 py-0.5 rounded-full">
            itch.io/duojoy • Código: {profile.pairCode}
          </div>
        </div>

        {/* Theme select buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedTheme('gradient-rose')}
            className={`w-7 h-7 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 border-2 ${
              selectedTheme === 'gradient-rose' ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setSelectedTheme('dark-luxury')}
            className={`w-7 h-7 rounded-full bg-zinc-900 border-2 ${
              selectedTheme === 'dark-luxury' ? 'border-rose-500 scale-110' : 'border-transparent'
            }`}
          />
          <button
            type="button"
            onClick={() => setSelectedTheme('sunset-gold')}
            className={`w-7 h-7 rounded-full bg-gradient-to-r from-amber-600 to-indigo-800 border-2 ${
              selectedTheme === 'sunset-gold' ? 'border-zinc-900 dark:border-white scale-110' : 'border-transparent'
            }`}
          />
        </div>

        {/* Share buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            type="button"
            onClick={handleNativeShare}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-500/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir Historia</span>
          </button>
        </div>
      </div>
    </div>
  );
};
