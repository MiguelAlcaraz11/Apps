export type ThemeMode = 'light' | 'dark';
export type ColorPalette = 'rose' | 'midnight' | 'sunset' | 'emerald' | 'lavender';

export interface Partner {
  id: string;
  name: string;
  avatar: string;
  nickname: string;
  mood: string;
  moodText: string;
  loveLanguage: string;
}

export interface CoupleProfile {
  id: string;
  partner1: Partner;
  partner2: Partner;
  anniversaryDate: string; // YYYY-MM-DD
  bio: string;
  streakDays: number;
  level: number;
  xp: number;
  isPremium: boolean;
  premiumTier?: 'free' | 'vip' | 'lifetime';
  pairCode: string;
  pairedStatus: 'synced' | 'syncing' | 'offline';
  coverPhoto?: string;
  themePalette: ColorPalette;
  themeMode: ThemeMode;
}

export type QuizCategory = 'daily' | 'who_likely' | 'compatibility' | 'spicy_fun' | 'deep_talk';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  title: string;
  question: string;
  options?: string[];
  partner1Answer?: string | number;
  partner2Answer?: string | number;
  answeredAt?: string;
  compatibilityScore?: number; // 0-100
}

export interface WishlistItem {
  id: string;
  title: string;
  category: 'viajes' | 'citas' | 'aventura' | 'hogar' | 'compras';
  estimatedCost: 'baja' | 'media' | 'alta';
  completed: boolean;
  completedDate?: string;
  addedBy: string;
  notes?: string;
  targetDate?: string;
  priority: 'alta' | 'media' | 'baja';
}

export interface DatePlan {
  id: string;
  title: string;
  vibe: 'romantica' | 'aventura' | 'chill' | 'especial' | 'sorpresa';
  date: string; // YYYY-MM-DD
  time?: string;
  location: string;
  budgetEstimated: number;
  notes: string;
  status: 'planeada' | 'completada' | 'cancelada';
  rating?: number; // 1-5
  review?: string;
  photoUrl?: string;
}

export interface MemoryPhoto {
  id: string;
  title: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
  tag: 'primer_dia' | 'viaje' | 'cita' | 'aniversario' | 'divertido';
  isFavorite: boolean;
  heartsCount: number;
}

export interface ImportantDate {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'aniversario' | 'cumpleanos' | 'viaje' | 'hito' | 'otro';
  description: string;
  remindDaysBefore: number;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // partner1.id or partner2.id
  text: string;
  timestamp: string;
  type: 'text' | 'sticker' | 'audio_sim' | 'love_ping' | 'photo';
  stickerUrl?: string;
  reaction?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  category: 'quiz' | 'citas' | 'amor' | 'recuerdos';
  points: number;
}

export interface LeaderboardCouple {
  id: string;
  rank: number;
  coupleNames: string;
  avatarPair: [string, string];
  streakDays: number;
  completedDates: number;
  loveScore: number;
  country: string;
  badge: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  category: 'reminder' | 'streak' | 'date' | 'quiz';
  read: boolean;
}

export interface AnalyticsSummary {
  totalQuizzesAnswered: number;
  compatibilityRate: number;
  completedBucketList: number;
  totalDatesCelebrated: number;
  lovePingsSent: number;
  daysTogether: number;
  weeklyInteractions: { day: string; count: number }[];
  categorySynergy: { category: string; value: number }[];
}
