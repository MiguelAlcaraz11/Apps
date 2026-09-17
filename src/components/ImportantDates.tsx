import React, { useState } from 'react';
import { Calendar, Plus, Heart, Gift, Cake, Compass, Clock, Trash2, Bell, Sparkles } from 'lucide-react';
import { ImportantDate, Partner } from '../types';
import { sounds } from '../utils/audio';

interface ImportantDatesProps {
  importantDates: ImportantDate[];
  onAddImportantDate: (item: Omit<ImportantDate, 'id'>) => void;
  onDeleteImportantDate: (id: string) => void;
  activePartner: Partner;
  onGainXp: (amount: number) => void;
}

export const ImportantDates: React.FC<ImportantDatesProps> = ({
  importantDates,
  onAddImportantDate,
  onDeleteImportantDate,
  activePartner,
  onGainXp,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [category, setCategory] = useState<ImportantDate['category']>('aniversario');
  const [description, setDescription] = useState('');
  const [remindDaysBefore, setRemindDaysBefore] = useState(7);

  const calculateDaysRemaining = (targetDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;

    onAddImportantDate({
      title: title.trim(),
      date: dateStr,
      category,
      description: description.trim(),
      remindDaysBefore: Number(remindDaysBefore) || 7,
      iconName: category === 'aniversario' ? 'Heart' : category === 'cumpleanos' ? 'Cake' : 'Calendar',
    });

    sounds.playSuccessChime();
    onGainXp(30);
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const sortedDates = [...importantDates].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Calendario de Amor
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Fechas Importantes & Cuenta Regresiva
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Nunca olviden un aniversario, cumpleaños o viaje esperado
          </p>
        </div>

        <button
          id="open-add-important-date-btn"
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Fecha</span>
        </button>
      </div>

      {/* Dates countdown cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedDates.map((item) => {
          const daysLeft = calculateDaysRemaining(item.date);
          const isPassed = daysLeft < 0;
          const isToday = daysLeft === 0;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isToday
                  ? 'bg-rose-500 text-white border-rose-600 shadow-lg scale-102'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isToday
                        ? 'bg-white/30 text-white'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    }`}
                  >
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playPop();
                        onDeleteImportantDate(item.id);
                      }}
                      className={`p-1 rounded-md transition ${
                        isToday ? 'text-rose-100 hover:text-white' : 'text-zinc-400 hover:text-rose-500'
                      }`}
                      title="Eliminar fecha"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3
                  className={`font-black text-base ${
                    isToday ? 'text-white' : 'text-zinc-900 dark:text-white'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-xs mt-1 ${
                    isToday ? 'text-rose-100' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              {/* Countdown bottom widget */}
              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between ${
                  isToday
                    ? 'border-white/20 text-white'
                    : 'border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300'
                }`}
              >
                <div className="text-xs font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>

                <div className="text-right">
                  {isToday ? (
                    <span className="text-xs font-black uppercase tracking-wider bg-white text-rose-600 px-2 py-0.5 rounded-md animate-bounce">
                      ¡ES HOY! 🎉
                    </span>
                  ) : isPassed ? (
                    <span className="text-xs text-zinc-400 font-medium">
                      Ocurrió hace {Math.abs(daysLeft)} días
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-rose-500">
                        {daysLeft}
                      </span>
                      <span className="text-xs font-bold text-zinc-500">
                        {daysLeft === 1 ? 'día restante' : 'días restantes'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Date Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Agregar Fecha Especial
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Crea un recordatorio para no olvidar ninguna fecha importante.
            </p>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Aniversario de nuestro primer beso"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  >
                    <option value="aniversario">Aniversario</option>
                    <option value="cumpleanos">Cumpleaños</option>
                    <option value="viaje">Viaje</option>
                    <option value="hito">Hito de Pareja</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Nota o Descripción
                </label>
                <input
                  type="text"
                  placeholder="Ej: Comprar regalo sorpresa con tiempo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition"
                >
                  Guardar Fecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
