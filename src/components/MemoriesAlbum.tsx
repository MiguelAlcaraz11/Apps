import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Camera, Heart, Plus, MapPin, Calendar, Tag, Download, Trash2, Sparkles, Upload } from 'lucide-react';
import { MemoryPhoto, Partner } from '../types';
import { sounds } from '../utils/audio';
import { exportMemoriesToCSV } from '../utils/csvExport';

interface MemoriesAlbumProps {
  memories: MemoryPhoto[];
  onAddMemory: (memory: Omit<MemoryPhoto, 'id' | 'heartsCount'>) => void;
  onToggleFavorite: (id: string) => void;
  onLikeMemory: (id: string) => void;
  onDeleteMemory: (id: string) => void;
  activePartner: Partner;
  onGainXp: (amount: number) => void;
}

export const MemoriesAlbum: React.FC<MemoriesAlbumProps> = ({
  memories,
  onAddMemory,
  onToggleFavorite,
  onLikeMemory,
  onDeleteMemory,
  activePartner,
  onGainXp,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState<MemoryPhoto['tag']>('cita');

  const presetPhotos = [
    { label: 'Playa Romántica', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Cena a la luz de velas', url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80' },
    { label: 'Paseo en Bosque / Cabaña', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Picnic al sol', url: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        sounds.playPop();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    onAddMemory({
      title: title.trim(),
      date: dateStr,
      location: location.trim() || 'Lugar especial',
      imageUrl,
      description: description.trim(),
      tag,
      isFavorite: false,
    });

    sounds.playSuccessChime();
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onGainXp(50);
    setTitle('');
    setLocation('');
    setDescription('');
    setImageUrl('');
    setShowAddModal(false);
  };

  const handleLike = (id: string) => {
    sounds.playLovePing();
    onLikeMemory(id);
    onGainXp(10);
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedTag === 'todos') return true;
    if (selectedTag === 'favoritos') return m.isFavorite;
    return m.tag === selectedTag;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            Diario Visual de Recuerdos
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Álbum Polaroid & Momentos Mágicos
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {memories.length} recuerdos guardados con amor
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="export-memories-csv-btn"
            type="button"
            onClick={() => exportMemoriesToCSV(memories)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>

          <button
            id="open-add-memory-modal-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Subir Recuerdo</span>
          </button>
        </div>
      </div>

      {/* Filter tags */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: 'todos', label: 'Todos' },
          { id: 'favoritos', label: '❤️ Favoritos' },
          { id: 'viaje', label: '✈️ Viajes' },
          { id: 'cita', label: '🍷 Citas' },
          { id: 'aniversario', label: '💍 Aniversarios' },
          { id: 'divertido', label: '🎉 Risas & Bloopers' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              sounds.playPop();
              setSelectedTag(t.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedTag === t.id
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Polaroid Memories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredMemories.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6">
            <p className="text-3xl mb-2">📸</p>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white">
              Aún no hay fotos en esta sección
            </h4>
            <p className="text-xs text-zinc-500 mt-1">
              Agrega una foto o recuerdo de su última salida juntos.
            </p>
          </div>
        ) : (
          filteredMemories.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Photo */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={m.imageUrl}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Favorite badge */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    onToggleFavorite(m.id);
                  }}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:scale-110 transition"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      m.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                    }`}
                  />
                </button>

                {/* Tag pill */}
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white capitalize">
                  {m.tag}
                </span>
              </div>

              {/* Caption & notes */}
              <div className="pt-3 pb-1 space-y-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">
                  {m.title}
                </h4>

                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {m.date}
                  </span>
                  <span className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3 h-3" />
                    {m.location}
                  </span>
                </div>

                {m.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 pt-1">
                    "{m.description}"
                  </p>
                )}
              </div>

              {/* Footer actions */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleLike(m.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500" />
                  <span>{m.heartsCount} mimos</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playPop();
                    onDeleteMemory(m.id);
                  }}
                  className="text-zinc-400 hover:text-rose-500 p-1 rounded-md transition"
                  title="Eliminar recuerdo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Guardar Nuevo Recuerdo
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Sube una foto o selecciona una foto romántica para inmortalizar el momento.
            </p>

            <form onSubmit={handleCreateMemory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Título del Recuerdo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Caminata bajo la llovizna en la montaña"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
                />
              </div>

              {/* Photo Input options */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Foto del Recuerdo
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-zinc-200">
                    <Upload className="w-3.5 h-3.5 text-pink-500" />
                    <span>Subir desde dispositivo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-zinc-400">o pega un enlace</span>
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
                />

                {/* Preset quick photos */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {presetPhotos.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-pink-100 text-zinc-600 dark:text-zinc-300"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {imageUrl && (
                  <div className="mt-2 h-28 w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Etiqueta
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
                  >
                    <option value="cita">Cita</option>
                    <option value="viaje">Viaje</option>
                    <option value="aniversario">Aniversario</option>
                    <option value="divertido">Divertido / Risas</option>
                    <option value="primer_dia">Primeros Días</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  placeholder="Ej: Playa del Carmen o Cafetería del centro"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  ¿Qué recuerdas de ese momento?
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Hacía frío, nos tomamos un chocolate caliente y no paramos de hablar..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-pink-500"
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
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs transition"
                >
                  Guardar en Álbum
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
