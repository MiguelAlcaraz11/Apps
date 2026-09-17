import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, HelpCircle, CheckCircle, Flame, RotateCw, Plus, HeartHandshake, Eye, EyeOff, Lock, Unlock, Award } from 'lucide-react';
import { QuizQuestion, Partner, CoupleProfile } from '../types';
import { sounds } from '../utils/audio';

interface QuizGamesProps {
  questions: QuizQuestion[];
  onAnswerQuestion: (questionId: string, partnerId: string, answer: string) => void;
  onAddCustomQuestion: (question: Partial<QuizQuestion>) => void;
  activePartner: Partner;
  profile: CoupleProfile;
  onGainXp: (amount: number) => void;
}

export const QuizGames: React.FC<QuizGamesProps> = ({
  questions,
  onAnswerQuestion,
  onAddCustomQuestion,
  activePartner,
  profile,
  onGainXp,
}) => {
  const [selectedTab, setSelectedTab] = useState<'daily' | 'who_likely' | 'compatibility' | 'ruleta'>('daily');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'daily' | 'who_likely' | 'compatibility' | 'spicy_fun'>('daily');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);

  // Ruleta / Dare wheel state
  const [ruletaCurrentCard, setRuletaCurrentCard] = useState<{
    type: 'verdad' | 'reto' | 'amor';
    text: string;
  } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const ruletaChallenges = [
    { type: 'verdad' as const, text: '¿Qué fue lo primero que pensaste exactamente la primera vez que me viste?' },
    { type: 'reto' as const, text: 'Dale a tu pareja un masaje de hombros relajante durante 2 minutos seguidos.' },
    { type: 'amor' as const, text: 'Menciona 3 pequeñas cosas cotidianas que hace tu pareja y que te enamoran en secreto.' },
    { type: 'verdad' as const, text: '¿Cuál es el momento en el que te sentiste más apoyado/a y protegido/a por mí?' },
    { type: 'reto' as const, text: 'Elige una canción romántica y bailen juntos un minuto abrazados sin hablar.' },
    { type: 'reto' as const, text: 'Dile a tu pareja un cumplido muy cursi mirándola directo a los ojos sin reírte.' },
    { type: 'verdad' as const, text: 'Si tuviéramos que revivir un solo día de nuestra relación por siempre, ¿cuál elegirías?' },
  ];

  const handleSpinRuleta = () => {
    setIsSpinning(true);
    sounds.playPop();
    let counter = 0;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * ruletaChallenges.length);
      setRuletaCurrentCard(ruletaChallenges[randomIdx]);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
        sounds.playSuccessChime();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        onGainXp(25);
      }
    }, 100);
  };

  const handleSelectAnswer = (q: QuizQuestion, option: string) => {
    sounds.playPop();
    onAnswerQuestion(q.id, activePartner.id, option);

    // Check if both have answered now
    const otherPartnerAnswer = activePartner.id === profile.partner1.id ? q.partner2Answer : q.partner1Answer;
    if (otherPartnerAnswer) {
      // Both answered!
      if (otherPartnerAnswer === option) {
        sounds.playSuccessChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        onGainXp(50);
      } else {
        onGainXp(25);
      }
    } else {
      onGainXp(15);
    }
  };

  const toggleReveal = (id: string) => {
    sounds.playPop();
    setRevealedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const validOptions = newOptions.filter((o) => o.trim().length > 0);
    onAddCustomQuestion({
      title: 'Pregunta Creada',
      question: newTitle.trim(),
      category: newCategory,
      options: validOptions.length >= 2 ? validOptions : ['Sí', 'No'],
    });

    setNewTitle('');
    setNewOptions(['', '', '', '']);
    setShowAddModal(false);
    sounds.playSuccessChime();
  };

  const filteredQuestions = questions.filter((q) => {
    if (selectedTab === 'daily') return q.category === 'daily' || q.category === 'deep_talk';
    if (selectedTab === 'who_likely') return q.category === 'who_likely';
    if (selectedTab === 'compatibility') return q.category === 'compatibility' || q.category === 'spicy_fun';
    return false;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Conexión Diaria & Juegos
          </span>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mt-1">
            Juegos de Preguntas & Retos de Pareja
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Responde desde tu perfil ({activePartner.name}) y descubre la telepatía que tienen juntos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-custom-question-btn"
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Pregunta</span>
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          id="quiz-tab-daily"
          type="button"
          onClick={() => {
            sounds.playPop();
            setSelectedTab('daily');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            selectedTab === 'daily'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <span>💬</span>
          <span>Pregunta del Día</span>
        </button>
        <button
          id="quiz-tab-who-likely"
          type="button"
          onClick={() => {
            sounds.playPop();
            setSelectedTab('who_likely');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            selectedTab === 'who_likely'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <span>👀</span>
          <span>¿Quién es más probable?</span>
        </button>
        <button
          id="quiz-tab-compatibility"
          type="button"
          onClick={() => {
            sounds.playPop();
            setSelectedTab('compatibility');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            selectedTab === 'compatibility'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <span>🔮</span>
          <span>Test de Compatibilidad</span>
        </button>
        <button
          id="quiz-tab-ruleta"
          type="button"
          onClick={() => {
            sounds.playPop();
            setSelectedTab('ruleta');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
            selectedTab === 'ruleta'
              ? 'bg-rose-500 text-white shadow-xs'
              : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
          }`}
        >
          <span>🎡</span>
          <span>Ruleta: Verdad o Reto</span>
        </button>
      </div>

      {/* Ruleta Interactive View */}
      {selectedTab === 'ruleta' ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 text-center space-y-5">
          <div className="max-w-md mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              🎡 Ruleta del Amor & Retos
            </span>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white mt-2">
              ¿Se atreven a responder con total sinceridad?
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Giren la ruleta para sacar una carta al azar: Verdades íntimas, retos románticos o momentos de complicidad.
            </p>
          </div>

          <div className="py-6 flex justify-center">
            <div
              className={`w-72 h-72 rounded-3xl border-2 flex flex-col items-center justify-center p-6 shadow-xl transition-all duration-300 ${
                ruletaCurrentCard?.type === 'verdad'
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                  : ruletaCurrentCard?.type === 'reto'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100'
                  : 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-100'
              } ${isSpinning ? 'scale-95 blur-xs' : 'scale-100'}`}
            >
              <div className="text-4xl mb-3">
                {ruletaCurrentCard?.type === 'verdad' ? '🕵️‍♂️' : ruletaCurrentCard?.type === 'reto' ? '🔥' : '💖'}
              </div>
              <span className="text-xs font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/70 dark:bg-black/40 mb-2">
                {ruletaCurrentCard?.type || 'Listo para girar'}
              </span>
              <p className="text-sm font-bold text-center leading-relaxed">
                {ruletaCurrentCard?.text || 'Pulsa "Girar Carta" para comenzar un nuevo reto juntos.'}
              </p>
            </div>
          </div>

          <button
            id="spin-ruleta-btn"
            type="button"
            disabled={isSpinning}
            onClick={handleSpinRuleta}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-sm shadow-md shadow-rose-500/30 active:scale-95 transition disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              {isSpinning ? 'Mezclando cartas...' : 'Girar Carta de Reto'}
            </span>
          </button>
        </div>
      ) : (
        /* Questions Cards List */
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const isPartner1 = activePartner.id === profile.partner1.id;
            const myAnswer = isPartner1 ? q.partner1Answer : q.partner2Answer;
            const partnerAnswer = isPartner1 ? q.partner2Answer : q.partner1Answer;
            const partnerName = isPartner1 ? profile.partner2.name : profile.partner1.name;
            const bothAnswered = Boolean(q.partner1Answer && q.partner2Answer);
            const isMatch = bothAnswered && q.partner1Answer === q.partner2Answer;
            const isRevealed = revealedAnswers[q.id] || bothAnswered;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isMatch
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {/* Header of question card */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-rose-500 dark:text-rose-400">
                      {q.title}
                    </span>
                    {bothAnswered && isMatch && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> ¡100% Coincidencia!
                      </span>
                    )}
                  </div>
                  {q.answeredAt && (
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {q.answeredAt}
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white mb-4">
                  {q.question}
                </h3>

                {/* Options / Answers grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(q.options || [profile.partner1.name, profile.partner2.name, 'Ambos']).map((opt) => {
                    const isMyChoice = myAnswer === opt;
                    const isPartnerChoice = partnerAnswer === opt;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelectAnswer(q, opt)}
                        className={`p-3 rounded-2xl text-left text-xs font-semibold border transition-all relative ${
                          isMyChoice
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-100 shadow-xs'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{opt}</span>
                          <div className="flex items-center gap-1">
                            {isMyChoice && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                                Tú
                              </span>
                            )}
                            {isPartnerChoice && isRevealed && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold">
                                {partnerName}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Partner status footer */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {partnerAnswer ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {partnerName} ya respondió
                      </span>
                    ) : (
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        Esperando respuesta de {partnerName}...
                      </span>
                    )}
                  </div>

                  {partnerAnswer && !bothAnswered && (
                    <button
                      type="button"
                      onClick={() => toggleReveal(q.id)}
                      className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                    >
                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{isRevealed ? 'Ocultar' : 'Espiar respuesta'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-1">
              Crear Pregunta Personalizada
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Inventa una pregunta divertida, pícara o profunda para que tu pareja la responda hoy.
            </p>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Tu Pregunta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Qué es lo que más te sorprendió de mí cuando nos conocimos?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Categoría
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                >
                  <option value="daily">Pregunta del Día</option>
                  <option value="who_likely">¿Quién es más probable que...?</option>
                  <option value="compatibility">Test de Compatibilidad</option>
                  <option value="spicy_fun">Reto & Pícaro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Opciones de Respuesta (opcionales)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {newOptions.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Opción ${idx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updated = [...newOptions];
                        updated[idx] = e.target.value;
                        setNewOptions(updated);
                      }}
                      className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-rose-500"
                    />
                  ))}
                </div>
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
                  Publicar Pregunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
