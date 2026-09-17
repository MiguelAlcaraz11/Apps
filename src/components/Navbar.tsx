import React, { useState } from 'react';
import { Heart, Flame, Sparkles, Moon, Sun, Bell, Crown, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { CoupleProfile, Partner, ColorPalette } from '../types';
import { sounds } from '../utils/audio';

interface NavbarProps {
  profile: CoupleProfile;
  activePartner: Partner;
  onSwitchPartner: (partner: Partner) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  onOpenPremium: () => void;
  onToggleThemeMode: () => void;
  onChangePalette: (palette: ColorPalette) => void;
  isItchFrameMode: boolean;
  onToggleItchFrameMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activePartner,
  onSwitchPartner,
  activeTab,
  onTabChange,
  unreadNotifications,
  onOpenNotifications,
  onOpenPremium,
  onToggleThemeMode,
  onChangePalette,
  isItchFrameMode,
  onToggleItchFrameMode,
}) => {
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const calculateDaysTogether = () => {
    const start = new Date(profile.anniversaryDate).getTime();
    const now = new Date().getTime();
    const diff = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const daysTogether = calculateDaysTogether();

  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'juegos', label: 'Juegos & Test', icon: '🎮' },
    { id: 'citas', label: 'Citas', icon: '🍷' },
    { id: 'deseos', label: 'Deseos', icon: '✨' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'recuerdos', label: 'Recuerdos', icon: '📸' },
    { id: 'fechas', label: 'Fechas', icon: '📅' },
    { id: 'analiticas', label: 'Métricas', icon: '📊' },
    { id: 'ranking', label: 'Ranking', icon: '🏆' },
  ];

  const palettes: { key: ColorPalette; name: string; color: string }[] = [
    { key: 'rose', name: 'Rosa Pasión', color: 'bg-rose-500' },
    { key: 'lavender', name: 'Lavanda Dulce', color: 'bg-purple-500' },
    { key: 'sunset', name: 'Atardecer Coral', color: 'bg-amber-500' },
    { key: 'emerald', name: 'Esmeralda Amor', color: 'bg-emerald-500' },
    { key: 'midnight', name: 'Noche Romántica', color: 'bg-indigo-600' },
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      {/* Top Banner / Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            id="brand-logo"
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 text-white shadow-md shadow-rose-500/20 cursor-pointer"
            onClick={() => {
              sounds.playLovePing();
              onTabChange('inicio');
            }}
          >
            <Heart className="w-5 h-5 fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-zinc-900 dark:text-white">
                DuoJoy
              </span>
              {profile.isPremium && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded-md bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-900 shadow-xs">
                  VIP
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {daysTogether} días juntos de pura felicidad
            </p>
          </div>
        </div>

        {/* Center: Partner switcher & Streak */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Active Partner Persona Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-full border border-zinc-200/80 dark:border-zinc-700/60 shadow-inner">
            <button
              id="switch-to-p1"
              type="button"
              onClick={() => {
                sounds.playPop();
                onSwitchPartner(profile.partner1);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                activePartner.id === profile.partner1.id
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <img
                src={profile.partner1.avatar}
                alt={profile.partner1.name}
                className="w-5 h-5 rounded-full object-cover border border-rose-300"
              />
              <span className="hidden md:inline">{profile.partner1.name}</span>
            </button>
            <button
              id="switch-to-p2"
              type="button"
              onClick={() => {
                sounds.playPop();
                onSwitchPartner(profile.partner2);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                activePartner.id === profile.partner2.id
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              <img
                src={profile.partner2.avatar}
                alt={profile.partner2.name}
                className="w-5 h-5 rounded-full object-cover border border-rose-300"
              />
              <span className="hidden md:inline">{profile.partner2.name}</span>
            </button>
          </div>

          {/* Streak badge */}
          <div
            id="streak-badge"
            className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-full text-amber-700 dark:text-amber-400 text-xs font-bold"
            title="Racha de días interactuando"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-bounce" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Sync indicator */}
          <div
            id="sync-status-indicator"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-medium"
            title={`Sincronizado vía código ${profile.pairCode}`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Sincronizado</span>
          </div>
        </div>

        {/* Right action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* VIP Pass Button */}
          <button
            id="open-premium-modal-btn"
            type="button"
            onClick={onOpenPremium}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              profile.isPremium
                ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700'
                : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:opacity-95 shadow-xs'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{profile.isPremium ? 'Plan VIP' : 'Pase VIP'}</span>
          </button>

          {/* Theme Palette dropdown toggle */}
          <div className="relative">
            <button
              id="theme-palette-btn"
              type="button"
              onClick={() => setShowPaletteMenu(!showPaletteMenu)}
              className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              title="Cambiar paleta de colores"
            >
              <Sparkles className="w-4 h-4 text-rose-500" />
            </button>
            {showPaletteMenu && (
              <div className="absolute right-0 mt-2 w-44 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl z-50">
                <p className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
                  Paleta de amor
                </p>
                <div className="space-y-1">
                  {palettes.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => {
                        onChangePalette(p.key);
                        setShowPaletteMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      <span className={`w-3 h-3 rounded-full ${p.color}`} />
                      <span>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark / Light toggle */}
          <button
            id="toggle-dark-mode-btn"
            type="button"
            onClick={onToggleThemeMode}
            className="p-1.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Alternar Modo Oscuro / Claro"
          >
            {profile.themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-600" />
            )}
          </button>

          {/* Itch.io Frame simulation toggle */}
          <button
            id="toggle-itch-frame-btn"
            type="button"
            onClick={onToggleItchFrameMode}
            className={`p-1.5 rounded-xl transition ${
              isItchFrameMode
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
            title={isItchFrameMode ? 'Vista Completa' : 'Vista Itch.io Marco Móvil'}
          >
            {isItchFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Notifications button */}
          <button
            id="open-notifications-btn"
            type="button"
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Notificaciones y recordatorios"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav className="max-w-7xl mx-auto px-2 sm:px-6 overflow-x-auto no-scrollbar border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                id={`nav-tab-${item.id}`}
                key={item.id}
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-rose-500 text-white shadow-xs shadow-rose-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
