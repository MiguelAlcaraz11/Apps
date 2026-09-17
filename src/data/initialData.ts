import { CoupleProfile, QuizQuestion, WishlistItem, DatePlan, MemoryPhoto, ImportantDate, ChatMessage, Achievement, LeaderboardCouple } from '../types';

export const INITIAL_COUPLE: CoupleProfile = {
  id: 'couple-demo-1',
  partner1: {
    id: 'p1',
    name: 'Sofía',
    nickname: 'Mi Sol ☀️',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    mood: '🥰',
    moodText: 'Súper enamorada',
    loveLanguage: 'Palabras de afirmación'
  },
  partner2: {
    id: 'p2',
    name: 'Mateo',
    nickname: 'Mi Vida ❤️',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    mood: '💭',
    moodText: 'Pensando en nuestra próxima cita',
    loveLanguage: 'Tiempo de calidad'
  },
  anniversaryDate: '2023-04-14',
  bio: 'Coleccionando risas, viajes espontáneos y noches de sushi juntos 🍣 ✨',
  streakDays: 42,
  level: 6,
  xp: 2850,
  isPremium: false,
  premiumTier: 'free',
  pairCode: 'DUO-7842',
  pairedStatus: 'synced',
  coverPhoto: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
  themePalette: 'rose',
  themeMode: 'light'
};

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'daily',
    title: 'Pregunta del Día',
    question: '¿Cuál ha sido el momento en que más te reíste a carcajadas conmigo?',
    options: ['En nuestro viaje fallido con lluvia', 'Cocinando el pastel quemado', 'Nuestra primera sesión de karaoke', 'Viendo la película de terror'],
    partner1Answer: 'En nuestro viaje fallido con lluvia',
    partner2Answer: 'En nuestro viaje fallido con lluvia',
    answeredAt: 'Hoy',
    compatibilityScore: 100
  },
  {
    id: 'q2',
    category: 'who_likely',
    title: '¿Quién es más probable que...?',
    question: '¿Quién es más probable que se quede dormido a los 10 minutos de empezar una película?',
    options: ['Sofía', 'Mateo', 'Los dos por igual'],
    partner1Answer: 'Mateo',
    partner2Answer: 'Mateo',
    answeredAt: 'Ayer',
    compatibilityScore: 100
  },
  {
    id: 'q3',
    category: 'who_likely',
    title: '¿Quién es más probable que...?',
    question: '¿Quién propone las salidas y viajes más espontáneos?',
    options: ['Sofía', 'Mateo', 'Depende de la temporada'],
    partner1Answer: 'Sofía',
    partner2Answer: 'Sofía',
    answeredAt: 'Hace 2 días',
    compatibilityScore: 100
  },
  {
    id: 'q4',
    category: 'compatibility',
    title: 'Test de Compatibilidad Futura',
    question: 'Si tuviéramos un fin de semana entero sin teléfonos ni planes, ¿qué preferirías hacer?',
    options: ['Cabaña en la montaña con chimenea y chocolate', 'Playa viendo el atardecer con picnic', 'Quedarnos en pijama maratoneando series y cocinando', 'Explorar una ciudad nueva a pie'],
    partner1Answer: 'Cabaña en la montaña con chimenea y chocolate',
    partner2Answer: 'Cabaña en la montaña con chimenea y chocolate',
    answeredAt: 'Hace 3 días',
    compatibilityScore: 100
  },
  {
    id: 'q5',
    category: 'deep_talk',
    title: 'Conversación Íntima',
    question: '¿Qué es lo que más admiras de mi personalidad y crecimiento personal?',
    options: ['Tu perseverancia ante los retos', 'Tu bondad y calidez con todos', 'Tu sentido del humor que alegra cualquier día', 'Tu lealtad y empatía incondicional'],
    partner1Answer: 'Tu perseverancia ante los retos',
    partner2Answer: 'Tu bondad y calidez con todos',
    answeredAt: 'Hace 4 días',
    compatibilityScore: 85
  },
  {
    id: 'q6',
    category: 'spicy_fun',
    title: 'Reto & Pícaro',
    question: '¿Cuál es el cumplido que más te acelera el corazón cuando te lo susurro?',
    options: ['Lo increíblemente atractivo/a que estás hoy', 'Lo orgulloso/a que estoy de caminar a tu lado', 'Lo bien que hueles cuando te abrazo fuerte', 'Que eres mi persona favorita en todo el universo'],
    partner1Answer: undefined,
    partner2Answer: undefined
  },
  {
    id: 'q7',
    category: 'daily',
    title: 'Pregunta de Mañana',
    question: '¿Cuál es nuestro próximo viaje soñado que debemos reservar sí o sí este año?',
    options: ['Roma y la costa Amalfitana', 'Kioto en temporada de cerezos', 'Cabaña en Bariloche / Suiza', 'Isla tropical con agua turquesa'],
    partner1Answer: undefined,
    partner2Answer: undefined
  }
];

export const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 'w1',
    title: 'Paseo en globo aerostático al amanecer',
    category: 'aventura',
    estimatedCost: 'alta',
    completed: false,
    priority: 'alta',
    addedBy: 'Sofía',
    notes: 'Queremos ver la salida del sol tomando café caliente'
  },
  {
    id: 'w2',
    title: 'Cena a la luz de las velas en terraza con vista',
    category: 'citas',
    estimatedCost: 'media',
    completed: true,
    completedDate: '2026-08-20',
    priority: 'alta',
    addedBy: 'Mateo',
    notes: 'Fue inolvidable en nuestro restaurante favorito'
  },
  {
    id: 'w3',
    title: 'Viaje a ver auroras boreales en Noruega',
    category: 'viajes',
    estimatedCost: 'alta',
    completed: false,
    priority: 'alta',
    addedBy: 'Sofía',
    notes: 'Dormir en un iglú de cristal juntos'
  },
  {
    id: 'w4',
    title: 'Noche de cine casero con proyector y mantas',
    category: 'hogar',
    estimatedCost: 'baja',
    completed: true,
    completedDate: '2026-09-02',
    priority: 'media',
    addedBy: 'Mateo',
    notes: 'Hicimos palomitas con caramelo caseras'
  },
  {
    id: 'w5',
    title: 'Clase de cocina italiana para hacer pasta fresca',
    category: 'citas',
    estimatedCost: 'media',
    completed: false,
    priority: 'media',
    addedBy: 'Sofía',
    notes: 'Aprender a preparar ravioles artesanales desde cero'
  },
  {
    id: 'w6',
    title: 'Adoptar nuestra primera plantita juntos',
    category: 'hogar',
    estimatedCost: 'baja',
    completed: true,
    completedDate: '2026-05-10',
    priority: 'baja',
    addedBy: 'Mateo',
    notes: 'Nuestra monstera sigue creciendo sana'
  }
];

export const INITIAL_DATES: DatePlan[] = [
  {
    id: 'd1',
    title: 'Picnic al atardecer en el jardín botánico',
    vibe: 'romantica',
    date: '2026-09-22',
    time: '18:00',
    location: 'Jardín Botánico Central',
    budgetEstimated: 35,
    notes: 'Llevar tabla de quesos, uvas, vino blanco y la cámara instantánea',
    status: 'planeada'
  },
  {
    id: 'd2',
    title: 'Noche de jazz en vivo & cócteles de autor',
    vibe: 'especial',
    date: '2026-10-04',
    time: '21:00',
    location: 'The Blue Note Lounge',
    budgetEstimated: 70,
    notes: 'Vestimenta elegante y reserva lista en mesa junto al escenario',
    status: 'planeada'
  },
  {
    id: 'd3',
    title: 'Tarde de alfarería y cerámica para dos',
    vibe: 'aventura',
    date: '2026-08-15',
    time: '17:00',
    location: 'Taller Barro & Arte',
    budgetEstimated: 50,
    notes: 'Hicimos tazas gemelas personalizadas con nuestras iniciales',
    status: 'completada',
    rating: 5,
    review: '¡Increíble experiencia! Reímos muchísimo manchándonos las manos.',
    photoUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'm1',
    title: 'Nuestro primer viaje juntos a la costa',
    date: '2024-02-14',
    location: 'Playa del Sol',
    imageUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    description: 'El viento despeinándonos y una puesta de sol que nunca olvidaremos.',
    tag: 'viaje',
    isFavorite: true,
    heartsCount: 14
  },
  {
    id: 'm2',
    title: 'Noche de velas en nuestro aniversario',
    date: '2025-04-14',
    location: 'Terraza Bellavista',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    description: 'Brindamos por otro año lleno de aventuras, complicidad y amor sincero.',
    tag: 'aniversario',
    isFavorite: true,
    heartsCount: 22
  },
  {
    id: 'm3',
    title: 'Paseando bajo las luces de otoño',
    date: '2025-11-08',
    location: 'Parque de los Cerezos',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    description: 'Café caliente en mano y pláticas profundas de esas que duran horas.',
    tag: 'cita',
    isFavorite: false,
    heartsCount: 9
  }
];

export const INITIAL_IMPORTANT_DATES: ImportantDate[] = [
  {
    id: 'id1',
    title: 'Nuestro Gran Aniversario',
    date: '2027-04-14',
    category: 'aniversario',
    description: '¡Celebrando nuestro amor oficial!',
    remindDaysBefore: 7,
    iconName: 'Heart'
  },
  {
    id: 'id2',
    title: 'Cumpleaños de Sofía',
    date: '2026-11-28',
    category: 'cumpleanos',
    description: 'Día de consentir a mi persona favorita',
    remindDaysBefore: 5,
    iconName: 'Gift'
  },
  {
    id: 'id3',
    title: 'Cumpleaños de Mateo',
    date: '2027-01-19',
    category: 'cumpleanos',
    description: 'Festejo con sorpresa especial',
    remindDaysBefore: 5,
    iconName: 'Cake'
  },
  {
    id: 'id4',
    title: 'Próxima escapada de fin de semana',
    date: '2026-10-17',
    category: 'viaje',
    description: 'Cabaña en el bosque',
    remindDaysBefore: 3,
    iconName: 'Compass'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c1',
    senderId: 'p2',
    text: '¡Hola mi amor! Acabo de ver el cuestionario de hoy, ¡coincidimos en todo! 🥰',
    timestamp: '14:20',
    type: 'text'
  },
  {
    id: 'c2',
    senderId: 'p1',
    text: '¡Siii! Me dio mucha risa acordarme de la lluvia en el viaje jajaja 🌧️💖',
    timestamp: '14:22',
    type: 'text'
  },
  {
    id: 'c3',
    senderId: 'p2',
    text: 'Te mandé un beso volador con mucho amor',
    timestamp: '14:23',
    type: 'love_ping'
  },
  {
    id: 'c4',
    senderId: 'p1',
    text: '¡Recibido! Muero por nuestro picnic del fin de semana ✨',
    timestamp: '14:25',
    type: 'text',
    reaction: '❤️'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    title: 'Chispa Inicial',
    description: 'Completar el primer test de pareja juntos.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedAt: '2026-08-01',
    progress: 1,
    maxProgress: 1,
    category: 'quiz',
    points: 50
  },
  {
    id: 'ach2',
    title: 'Racha de Oro (7 Días)',
    description: 'Mantener 7 días seguidos de conexión activa.',
    icon: 'Flame',
    unlocked: true,
    unlockedAt: '2026-08-10',
    progress: 42,
    maxProgress: 7,
    category: 'amor',
    points: 100
  },
  {
    id: 'ach3',
    title: 'Racha Épica (30 Días)',
    description: '30 días consecutivos de preguntas y mimos diarios.',
    icon: 'Trophy',
    unlocked: true,
    unlockedAt: '2026-09-02',
    progress: 42,
    maxProgress: 30,
    category: 'amor',
    points: 250
  },
  {
    id: 'ach4',
    title: 'Exploradores Románticos',
    description: 'Cumplir al menos 5 deseos de la lista compartida.',
    icon: 'Compass',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: 'citas',
    points: 150
  },
  {
    id: 'ach5',
    title: 'Álbum del Corazón',
    description: 'Guardar 5 recuerdos con foto en el diario de amor.',
    icon: 'Camera',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: 'recuerdos',
    points: 120
  },
  {
    id: 'ach6',
    title: 'Sincronía Telepática',
    description: 'Acertar 10 preguntas con 100% de coincidencia mutua.',
    icon: 'Zap',
    unlocked: true,
    unlockedAt: '2026-09-12',
    progress: 10,
    maxProgress: 10,
    category: 'quiz',
    points: 300
  }
];

export const INITIAL_LEADERBOARD: LeaderboardCouple[] = [
  {
    id: 'lb1',
    rank: 1,
    coupleNames: 'Valentina & Lucas',
    avatarPair: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    ],
    streakDays: 180,
    completedDates: 24,
    loveScore: 9850,
    country: '🇪🇸 España',
    badge: '🏆 Pareja Leyenda'
  },
  {
    id: 'lb2',
    rank: 2,
    coupleNames: 'Camila & Sebastián',
    avatarPair: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80'
    ],
    streakDays: 142,
    completedDates: 19,
    loveScore: 8420,
    country: '🇲🇽 México',
    badge: '💎 Almas Gemelas'
  },
  {
    id: 'lb3',
    rank: 3,
    coupleNames: 'Sofía & Mateo (Tú)',
    avatarPair: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    ],
    streakDays: 42,
    completedDates: 8,
    loveScore: 5680,
    country: '🇦🇷 Argentina',
    badge: '🌟 Pareja Estrella'
  },
  {
    id: 'lb4',
    rank: 4,
    coupleNames: 'Elena & Daniel',
    avatarPair: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80'
    ],
    streakDays: 36,
    completedDates: 7,
    loveScore: 4920,
    country: '🇨🇱 Chile',
    badge: '🔥 En Fuego'
  },
  {
    id: 'lb5',
    rank: 5,
    coupleNames: 'Lucía & Tomás',
    avatarPair: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80'
    ],
    streakDays: 28,
    completedDates: 6,
    loveScore: 4110,
    country: '🇨🇴 Colombia',
    badge: '💖 Amor Dulce'
  }
];
