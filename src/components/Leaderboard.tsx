import React, { useState } from 'react';
import { Trophy, Medal, Flame, Heart, Share2, Users, Globe, Sparkles } from 'lucide-react';
import { LeaderboardCouple, CoupleProfile } from '../types';
import { sounds } from '../utils/audio';

interface LeaderboardProps {
  leaderboard: LeaderboardCouple[];
  profile: CoupleProfile;
  onOpenShareModal: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  profile,
  onOpenShareModal,
}) => {
  const [filterMode, setFilterMode] = useState<'global' | 'amigos'>('global');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Comunidad Global Itch.io & Parejas
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Tabla de Clasificación de Amor
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Competencia sana y amistosa basada en rachas, preguntas respondidas y citas vividas
          </p>
        </div>

        <button
          id="share-rank-btn"
          type="button"
          onClick={() => {
            sounds.playPop();
            onOpenShareModal();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir Nuestro Puesto</span>
        </button>
      </div>

      {/* Filter toggles */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setFilterMode('global');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filterMode === 'global'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Ranking Global (Itch.io)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setFilterMode('amigos');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            filterMode === 'amigos'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Parejas Amigas</span>
        </button>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {leaderboard.map((item) => {
            const isMyCouple = item.rank === 3; // current demo user pair

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex items-center justify-between gap-3 transition ${
                  isMyCouple
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-l-4 border-l-rose-500 font-medium'
                    : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40'
                }`}
              >
                {/* Left: Rank + Avatars + Names */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-7 text-center">
                    {item.rank === 1 ? (
                      <span className="text-xl">🥇</span>
                    ) : item.rank === 2 ? (
                      <span className="text-xl">🥈</span>
                    ) : item.rank === 3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-sm font-extrabold text-zinc-400">
                        #{item.rank}
                      </span>
                    )}
                  </div>

                  {/* Overlapping avatars */}
                  <div className="flex items-center -space-x-2.5">
                    <img
                      src={item.avatarPair[0]}
                      alt="P1"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-zinc-900 shadow-xs"
                    />
                    <img
                      src={item.avatarPair[1]}
                      alt="P2"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-zinc-900 shadow-xs"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        {item.coupleNames}
                      </h4>
                      {isMyCouple && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-black">
                          TÚ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span>{item.country}</span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics */}
                <div className="flex items-center gap-4 text-right">
                  <div className="hidden sm:block">
                    <div className="text-xs font-extrabold text-zinc-900 dark:text-white flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{item.streakDays} días</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">Racha de amor</p>
                  </div>

                  <div>
                    <div className="text-sm font-black text-rose-500 flex items-center justify-end gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{item.loveScore.toLocaleString()} pts</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{item.completedDates} citas hechas</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
