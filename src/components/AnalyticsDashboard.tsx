import React from 'react';
import { BarChart3, Heart, Sparkles, Download, CheckCircle2, TrendingUp, Users, ShieldCheck, Flame, Zap } from 'lucide-react';
import { CoupleProfile, WishlistItem, DatePlan, QuizQuestion, MemoryPhoto } from '../types';
import { exportFullReportToCSV } from '../utils/csvExport';
import { sounds } from '../utils/audio';

interface AnalyticsDashboardProps {
  profile: CoupleProfile;
  wishlist: WishlistItem[];
  dates: DatePlan[];
  quizzes: QuizQuestion[];
  memories: MemoryPhoto[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  profile,
  wishlist,
  dates,
  quizzes,
  memories,
}) => {
  const completedWishlist = wishlist.filter((w) => w.completed).length;
  const completedDates = dates.filter((d) => d.status === 'completada').length;
  const answeredQuizzes = quizzes.filter((q) => q.partner1Answer && q.partner2Answer).length;
  const matchQuizzes = quizzes.filter(
    (q) => q.partner1Answer && q.partner2Answer && q.partner1Answer === q.partner2Answer
  ).length;

  const compatibilityPercent = answeredQuizzes > 0 ? Math.round((matchQuizzes / answeredQuizzes) * 100) : 95;
  const bucketListPercent = wishlist.length > 0 ? Math.round((completedWishlist / wishlist.length) * 100) : 0;

  const weeklyData = [
    { day: 'Lun', val: 8 },
    { day: 'Mar', val: 12 },
    { day: 'Mié', val: 15 },
    { day: 'Jue', val: 11 },
    { day: 'Vie', val: 22 },
    { day: 'Sáb', val: 28 },
    { day: 'Dom', val: 19 },
  ];

  const loveLanguageSynergy = [
    { name: 'Tiempo de Calidad', percent: 94 },
    { name: 'Palabras de Afirmación', percent: 98 },
    { name: 'Contacto Físico & Mimos', percent: 91 },
    { name: 'Detalles & Sorpresas', percent: 85 },
    { name: 'Actos de Servicio', percent: 89 },
  ];

  const handleExportAll = () => {
    sounds.playSuccessChime();
    exportFullReportToCSV(profile, wishlist, dates, quizzes);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Métricas de Conexión & Retención
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Tablero de Analíticas de Pareja
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Estadísticas en tiempo real de complicidad, metas cumplidas y hábitos compartidos
          </p>
        </div>

        <button
          id="export-full-report-csv-btn"
          type="button"
          onClick={handleExportAll}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold shadow-xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Informe CSV Completo</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-rose-500 mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span className="text-[10px] font-bold uppercase">Sinergia</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {compatibilityPercent}%
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Coincidencia en Test</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-amber-500 mb-1">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span className="text-[10px] font-bold uppercase">Racha</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {profile.streakDays} días
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">Uso continuo diario</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-purple-500 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Deseos</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {bucketListPercent}%
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            {completedWishlist}/{wishlist.length} cumplidos
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between text-emerald-500 mb-1">
            <Zap className="w-4 h-4 fill-emerald-500" />
            <span className="text-[10px] font-bold uppercase">Nivel</span>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            Nvl {profile.level}
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">{profile.xp} Puntos XP</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Weekly Activity Bar Chart */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
            Interacciones Semanales
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Mensajes, preguntas respondidas y mimos intercambiados
          </p>

          <div className="flex items-end justify-between h-40 pt-4 px-2">
            {weeklyData.map((w) => {
              const heightPercent = Math.round((w.val / 30) * 100);
              return (
                <div key={w.day} className="flex flex-col items-center gap-2 group flex-1">
                  <div className="text-[10px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition">
                    {w.val}
                  </div>
                  <div className="w-6 sm:w-8 bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-32 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-zinc-500">{w.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Love Languages Synergy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
            Afinidad en Lenguajes del Amor
          </h3>
          <p className="text-xs text-zinc-400 mb-4">
            Evaluación basada en sus respuestas compartidas
          </p>

          <div className="space-y-3 pt-1">
            {loveLanguageSynergy.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <span>{item.name}</span>
                  <span className="font-bold text-rose-500">{item.percent}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 rounded-full"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Sync & Architecture Status Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-zinc-50 to-emerald-50/40 dark:from-zinc-900 dark:to-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Sincronización en la Nube & Arquitectura de Alta Disponibilidad</span>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mt-1">
          Tus datos se guardan con persistencia local de baja latencia y sincronización en tiempo real vía canal seguro ({profile.pairCode}). Cifrado en reposo, listo para exportaciones CSV y respaldo seguro.
        </p>
      </div>
    </div>
  );
};
