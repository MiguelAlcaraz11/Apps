import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Clock, MapPin, DollarSign, Sparkles, Plus, Download, Star, CheckCircle, Heart, Wand2 } from 'lucide-react';
import { DatePlan, Partner } from '../types';
import { sounds } from '../utils/audio';
import { exportDatesToCSV } from '../utils/csvExport';

interface DatePlannerProps {
  dates: DatePlan[];
  onAddDate: (plan: Omit<DatePlan, 'id'>) => void;
  onCompleteDate: (id: string, rating: number, review: string) => void;
  activePartner: Partner;
  onGainXp: (amount: number) => void;
}

export const DatePlanner: React.FC<DatePlannerProps> = ({
  dates,
  onAddDate,
  onCompleteDate,
  activePartner,
  onGainXp,
}) => {
  const [activeTab, setActiveTab] = useState<'proximas' | 'historial'>('proximas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<DatePlan | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [vibe, setVibe] = useState<DatePlan['vibe']>('romantica');
  const [dateStr, setDateStr] = useState('');
  const [timeStr, setTimeStr] = useState('19:00');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState(40);
  const [notes, setNotes] = useState('');

  // Review modal state
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  // Generator surprise ideas
  const dateIdeaBank: Omit<DatePlan, 'id' | 'status'>[] = [
    {
      title: 'Picnic al atardecer en el mirador',
      vibe: 'romantica',
      date: '2026-09-28',
      time: '18:30',
      location: 'Mirador de la Colina Alta',
      budgetEstimated: 25,
      notes: 'Llevar manta suave, vino, fresas y luces led a pilas.',
    },
    {
      title: 'Duelo de cocina sorpresa a ciegas',
      vibe: 'aventura',
      date: '2026-10-02',
      time: '20:00',
      location: 'Nuestra Cocina',
      budgetEstimated: 20,
      notes: 'Cada uno cocina un platillo con 4 ingredientes misteriosos.',
    },
    {
      title: 'Noche de cine retro & fondue de chocolate',
      vibe: 'chill',
      date: '2026-10-09',
      time: '21:00',
      location: 'En Casa con Proyector',
      budgetEstimated: 15,
      notes: 'Película favorita de la infancia y pijamas a juego.',
    },
    {
      title: 'Cata de cócteles o helados artesanales en el centro',
      vibe: 'especial',
      date: '2026-10-15',
      time: '19:30',
      location: 'Barrio Antiguo & Heladería Gourmet',
      budgetEstimated: 35,
      notes: 'Probar los sabores más exóticos y puntuarlos del 1 al 10.',
    },
    {
      title: 'Noche bajo las estrellas con telescopio y fogata',
      vibe: 'sorpresa',
      date: '2026-10-24',
      time: '20:30',
      location: 'Camping o Parque Natural',
      budgetEstimated: 30,
      notes: 'Llevar malvaviscos, chocolate y playlist acústica.',
    },
  ];

  const handleGenerateMagicIdea = () => {
    sounds.playPop();
    const randomIdea = dateIdeaBank[Math.floor(Math.random() * dateIdeaBank.length)];
    setTitle(randomIdea.title);
    setVibe(randomIdea.vibe);
    setDateStr(randomIdea.date);
    setTimeStr(randomIdea.time || '19:00');
    setLocation(randomIdea.location);
    setBudget(randomIdea.budgetEstimated);
    setNotes(randomIdea.notes);
    setShowAddModal(true);
  };

  const handleCreateDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateStr) return;

    onAddDate({
      title: title.trim(),
      vibe,
      date: dateStr,
      time: timeStr,
      location: location.trim() || 'Lugar sorpresa',
      budgetEstimated: Number(budget) || 0,
      notes: notes.trim(),
      status: 'planeada',
    });

    sounds.playSuccessChime();
    onGainXp(40);
    setTitle('');
    setLocation('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewModal) return;

    onCompleteDate(showReviewModal.id, rating, review.trim());
    sounds.playSuccessChime();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onGainXp(80);
    setShowReviewModal(null);
    setReview('');
  };

  const upcomingDates = dates.filter((d) => d.status === 'planeada');
  const pastDates = dates.filter((d) => d.status === 'completada');

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header & generator */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Citas Inolvidables
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Planificador de Citas de Pareja
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {upcomingDates.length} citas programadas • {pastDates.length} citas disfrutadas
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            id="generate-magic-date-btn"
            type="button"
            onClick={handleGenerateMagicIdea}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition"
            title="Generar idea sorpresa aleatoria"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Generador Mágico</span>
          </button>

          <button
            id="export-dates-csv-btn"
            type="button"
            onClick={() => exportDatesToCSV(dates)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            id="open-add-date-modal-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Cita</span>
          </button>
        </div>
      </div>

      {/* Tabs Toggles */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setActiveTab('proximas');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'proximas'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Próximas Citas ({upcomingDates.length})
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playPop();
            setActiveTab('historial');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'historial'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          Historial & Recuerdos ({pastDates.length})
        </button>
      </div>

      {/* Dates Cards Grid */}
      <div className="space-y-4">
        {activeTab === 'proximas' ? (
          upcomingDates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <p className="text-3xl mb-2">🥂</p>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                No hay citas programadas
              </h4>
              <p className="text-xs text-zinc-500 mt-1">
                Usa el Generador Mágico para inspirarte o agenda una salida especial.
              </p>
            </div>
          ) : (
            upcomingDates.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                      {d.vibe}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium">
                      Presupuesto: ~${d.budgetEstimated}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                    {d.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {d.date}
                    </span>
                    {d.time && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {d.time}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {d.location}
                    </span>
                  </div>

                  {d.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic pt-1">
                      "{d.notes}"
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowReviewModal(d)}
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>¡Cita Realizada!</span>
                </button>
              </div>
            ))
          )
        ) : (
          pastDates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
              <p className="text-3xl mb-2">📸</p>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
                Aún no hay citas registradas en el historial
              </h4>
            </div>
          ) : (
            pastDates.map((d) => (
              <div
                key={d.id}
                className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/60 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        ✓ Cita Cumplida
                      </span>
                      <span className="text-xs text-zinc-400">• {d.date}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                      {d.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">📍 {d.location}</p>
                  </div>

                  {d.rating && (
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">
                        {d.rating}/5
                      </span>
                    </div>
                  )}
                </div>

                {d.review && (
                  <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-700 dark:text-zinc-300 italic border border-zinc-100 dark:border-zinc-700/60">
                    "{d.review}"
                  </div>
                )}
              </div>
            ))
          )
        )}
      </div>

      {/* Add Date Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Agendar Nueva Cita
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Crea un momento especial para compartir juntos.
            </p>

            <form onSubmit={handleCreateDate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Título de la Cita
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cena italiana bajo las estrellas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Ambiente / Vibe
                  </label>
                  <select
                    value={vibe}
                    onChange={(e) => setVibe(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  >
                    <option value="romantica">Romántica</option>
                    <option value="aventura">Aventura</option>
                    <option value="chill">En casa / Chill</option>
                    <option value="especial">Especial</option>
                    <option value="sorpresa">Sorpresa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Presupuesto estimado ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  />
                </div>
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Lugar o Punto de Encuentro
                </label>
                <input
                  type="text"
                  placeholder="Ej: Terraza Bellavista o Nuestra Sala"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Detalles o Qué Llevar
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Ropa elegante, reservar mesa junto al ventanal..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
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
                  Confirmar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              ¡Qué bonita cita! ¿Cómo la pasaron?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Califica "{showReviewModal.title}" y guarda un recuerdo especial.
            </p>

            <form onSubmit={handleSaveReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2 text-center">
                  Calificación de la Cita
                </label>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-zinc-300 dark:text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Breve Reseña / Momento Favorito
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ej: Nos reímos muchísimo, la comida estuvo deliciosa y el paseo nocturno fue mágico..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition"
                >
                  Guardar en Recuerdos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
