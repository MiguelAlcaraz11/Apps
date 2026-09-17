import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, Circle, Plus, Download, Tag, Trash2, Calendar, DollarSign, Filter } from 'lucide-react';
import { WishlistItem, Partner } from '../types';
import { sounds } from '../utils/audio';
import { exportWishlistToCSV } from '../utils/csvExport';

interface WishlistProps {
  wishlist: WishlistItem[];
  onAddWish: (item: Omit<WishlistItem, 'id'>) => void;
  onToggleWish: (id: string) => void;
  onDeleteWish: (id: string) => void;
  activePartner: Partner;
  onGainXp: (amount: number) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({
  wishlist,
  onAddWish,
  onToggleWish,
  onDeleteWish,
  activePartner,
  onGainXp,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<'todos' | 'pendientes' | 'cumplidos'>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WishlistItem['category']>('citas');
  const [estimatedCost, setEstimatedCost] = useState<WishlistItem['estimatedCost']>('media');
  const [priority, setPriority] = useState<WishlistItem['priority']>('media');
  const [notes, setNotes] = useState('');

  const handleToggle = (item: WishlistItem) => {
    sounds.playPop();
    if (!item.completed) {
      sounds.playSuccessChime();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
      });
      onGainXp(60);
    }
    onToggleWish(item.id);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddWish({
      title: title.trim(),
      category,
      estimatedCost,
      priority,
      completed: false,
      addedBy: activePartner.name,
      notes: notes.trim(),
    });

    sounds.playSuccessChime();
    onGainXp(30);
    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const filteredItems = wishlist.filter((item) => {
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;
    if (selectedStatus === 'pendientes' && item.completed) return false;
    if (selectedStatus === 'cumplidos' && !item.completed) return false;
    return true;
  });

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'citas', label: 'Citas' },
    { id: 'viajes', label: 'Viajes' },
    { id: 'aventura', label: 'Aventura' },
    { id: 'hogar', label: 'Hogar' },
    { id: 'compras', label: 'Regalos & Compras' },
  ];

  const completedCount = wishlist.filter((w) => w.completed).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header & stats */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Nuestra Bucket List Compartida
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Lista de Deseos & Metas Juntos
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {completedCount} de {wishlist.length} sueños cumplidos ({Math.round((completedCount / (wishlist.length || 1)) * 100)}%)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="export-wishlist-csv-btn"
            type="button"
            onClick={() => exportWishlistToCSV(wishlist)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition"
            title="Exportar deseos a formato CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            id="open-add-wish-modal-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Deseo</span>
          </button>
        </div>
      </div>

      {/* Filter and Status Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Categories pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                sounds.playPop();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto border border-zinc-200/60 dark:border-zinc-700/60">
          {(['todos', 'pendientes', 'cumplidos'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                sounds.playPop();
                setSelectedStatus(st);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                selectedStatus === st
                  ? 'bg-white dark:bg-zinc-700 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-zinc-500'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <p className="text-3xl mb-2">🎈</p>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              No hay deseos en esta categoría
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Agrega una nueva aventura o meta para cumplir juntos pronto.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                item.completed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 opacity-90'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-purple-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="mt-0.5 text-zinc-400 hover:text-purple-600 transition"
                  title={item.completed ? 'Marcar como pendiente' : '¡Marcar como cumplido!'}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                  )}
                </button>

                <div>
                  <h4
                    className={`font-bold text-sm ${
                      item.completed
                        ? 'line-through text-zinc-500 dark:text-zinc-400'
                        : 'text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    {item.title}
                  </h4>

                  {item.notes && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium capitalize">
                      {item.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium ${
                        item.priority === 'alta'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      Prioridad {item.priority}
                    </span>
                    <span className="text-zinc-400">
                      Por {item.addedBy}
                    </span>
                    {item.completedDate && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Cumplido el {item.completedDate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playPop();
                  onDeleteWish(item.id);
                }}
                className="text-zinc-400 hover:text-rose-500 p-1 rounded-lg transition"
                title="Eliminar deseo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Wish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Nuevo Deseo Compartido
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Añade una meta, viaje o aventura que quieras vivir con tu pareja.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  ¿Qué quieren hacer?
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Viaje a París a comer croissants junto a la Torre Eiffel"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-purple-500"
                  >
                    <option value="citas">Citas</option>
                    <option value="viajes">Viajes</option>
                    <option value="aventura">Aventura</option>
                    <option value="hogar">Hogar</option>
                    <option value="compras">Regalos & Compras</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-purple-500"
                  >
                    <option value="alta">Alta (¡Pronto!)</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja (Algún día)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Notas o Detalles
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Buscar boletos en temporada baja y llevar la cámara..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-purple-500"
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Guardar Deseo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
