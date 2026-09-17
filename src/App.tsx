/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { QuizGames } from './components/QuizGames';
import { Wishlist } from './components/Wishlist';
import { DatePlanner } from './components/DatePlanner';
import { CoupleChat } from './components/CoupleChat';
import { MemoriesAlbum } from './components/MemoriesAlbum';
import { ImportantDates } from './components/ImportantDates';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Leaderboard } from './components/Leaderboard';
import { SocialShareModal } from './components/SocialShareModal';
import { PremiumModal } from './components/PremiumModal';
import { SupportChatModal } from './components/SupportChatModal';
import { NotificationCenter } from './components/NotificationCenter';

import {
  INITIAL_COUPLE,
  INITIAL_QUIZZES,
  INITIAL_WISHLIST,
  INITIAL_DATES,
  INITIAL_MEMORIES,
  INITIAL_IMPORTANT_DATES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_LEADERBOARD,
} from './data/initialData';

import {
  CoupleProfile,
  Partner,
  QuizQuestion,
  WishlistItem,
  DatePlan,
  MemoryPhoto,
  ImportantDate,
  ChatMessage,
  PushNotificationItem,
  ColorPalette,
} from './types';

import { syncEngine } from './utils/syncManager';
import { sounds } from './utils/audio';
import { MessageSquare, Heart, ShieldAlert, Sparkles, Trophy } from 'lucide-react';

const STORAGE_KEY = 'duojoy_couple_state_v2';

export default function App() {
  // Load state from localStorage or use initial seed
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : INITIAL_COUPLE;
  });

  const [activePartner, setActivePartner] = useState<Partner>(profile.partner1);
  const [activeTab, setActiveTab] = useState<string>('inicio');

  const [quizzes, setQuizzes] = useState<QuizQuestion[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quizzes`);
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_wishlist`);
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [dates, setDates] = useState<DatePlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_dates`);
    return saved ? JSON.parse(saved) : INITIAL_DATES;
  });

  const [memories, setMemories] = useState<MemoryPhoto[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_memories`);
    return saved ? JSON.parse(saved) : INITIAL_MEMORIES;
  });

  const [importantDates, setImportantDates] = useState<ImportantDate[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_importantDates`);
    return saved ? JSON.parse(saved) : INITIAL_IMPORTANT_DATES;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_chatMessages`);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [notifications, setNotifications] = useState<PushNotificationItem[]>([
    {
      id: 'n1',
      title: '¡Pregunta del Día Disponible! 💬',
      body: 'Ambos tienen una nueva pregunta para descubrir su telepatía.',
      time: 'Hace 10m',
      category: 'quiz',
      read: false,
    },
    {
      id: 'n2',
      title: '¡Racha en Peligro! 🔥',
      body: 'Respondan hoy para mantener su racha de 42 días.',
      time: 'Hace 1h',
      category: 'streak',
      read: false,
    },
  ]);

  // Modal toggles
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [isItchFrameMode, setIsItchFrameMode] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quizzes`, JSON.stringify(quizzes));
  }, [quizzes]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wishlist`, JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_dates`, JSON.stringify(dates));
  }, [dates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_memories`, JSON.stringify(memories));
  }, [memories]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_importantDates`, JSON.stringify(importantDates));
  }, [importantDates]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_chatMessages`, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Sync with dark mode class on document
  useEffect(() => {
    if (profile.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.themeMode]);

  // Real-time broadcast sync listener (across browser tabs)
  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((payload) => {
      if (payload.type === 'PING_LOVE') {
        sounds.playLovePing();
        // Add notification
        setNotifications((prev) => [
          {
            id: `p-${Date.now()}`,
            title: '¡Amor Inmediato Recibido! ❤️',
            body: `${payload.data.senderName || 'Tu pareja'} te envió un beso volador.`,
            time: 'Ahora',
            category: 'reminder',
            read: false,
          },
          ...prev,
        ]);
      } else if (payload.type === 'NEW_MESSAGE') {
        setChatMessages((prev) => [...prev, payload.data]);
        sounds.playPop();
      }
    });

    return () => unsubscribe();
  }, []);

  // Gain XP & level up logic
  const handleGainXp = (amount: number) => {
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 500;
      let newLevel = prev.level;

      if (newXp >= nextLevelThreshold) {
        newLevel = prev.level + 1;
        sounds.playSuccessChime();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        setNotifications((n) => [
          {
            id: `lvl-${Date.now()}`,
            title: `¡Subieron al Nivel ${newLevel}! 🏆`,
            body: 'Su conexión de pareja es cada vez más fuerte y sólida.',
            time: 'Ahora',
            category: 'streak',
            read: false,
          },
          ...n,
        ]);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  // Partner mood update
  const handleUpdatePartnerMood = (mood: string, moodText: string) => {
    setProfile((prev) => {
      const isP1 = activePartner.id === prev.partner1.id;
      const updatedP1 = isP1 ? { ...prev.partner1, mood, moodText } : prev.partner1;
      const updatedP2 = !isP1 ? { ...prev.partner2, mood, moodText } : prev.partner2;
      return {
        ...prev,
        partner1: updatedP1,
        partner2: updatedP2,
      };
    });
    handleGainXp(15);
  };

  // Love Ping handler
  const handleSendLovePing = () => {
    syncEngine.broadcast(
      'PING_LOVE',
      { senderName: activePartner.name },
      activePartner.id
    );

    handleGainXp(20);
    setNotifications((prev) => [
      {
        id: `ping-${Date.now()}`,
        title: '¡Amor Inmediato Enviado! 💕',
        body: `Has enviado un mimito directo a ${
          activePartner.id === profile.partner1.id ? profile.partner2.name : profile.partner1.name
        }.`,
        time: 'Ahora',
        category: 'reminder',
        read: false,
      },
      ...prev,
    ]);
  };

  // Quiz answered handler
  const handleAnswerQuestion = (questionId: string, partnerId: string, answer: string) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const isP1 = partnerId === profile.partner1.id;
          const updated = {
            ...q,
            partner1Answer: isP1 ? answer : q.partner1Answer,
            partner2Answer: !isP1 ? answer : q.partner2Answer,
            answeredAt: 'Hoy',
          };
          return updated;
        }
        return q;
      })
    );
  };

  // Add custom question
  const handleAddCustomQuestion = (newQ: Partial<QuizQuestion>) => {
    const questionItem: QuizQuestion = {
      id: `custom-q-${Date.now()}`,
      category: newQ.category || 'daily',
      title: newQ.title || 'Pregunta de Pareja',
      question: newQ.question || '',
      options: newQ.options || ['Opción A', 'Opción B'],
    };
    setQuizzes((prev) => [questionItem, ...prev]);
    handleGainXp(30);
  };

  // Wishlist handlers
  const handleAddWish = (item: Omit<WishlistItem, 'id'>) => {
    const newItem: WishlistItem = {
      ...item,
      id: `w-${Date.now()}`,
    };
    setWishlist((prev) => [newItem, ...prev]);
  };

  const handleToggleWish = (id: string) => {
    setWishlist((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const completed = !w.completed;
          return {
            ...w,
            completed,
            completedDate: completed ? new Date().toISOString().slice(0, 10) : undefined,
          };
        }
        return w;
      })
    );
  };

  const handleDeleteWish = (id: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  // Date planner handlers
  const handleAddDate = (plan: Omit<DatePlan, 'id'>) => {
    const newDate: DatePlan = {
      ...plan,
      id: `d-${Date.now()}`,
    };
    setDates((prev) => [newDate, ...prev]);
  };

  const handleCompleteDate = (id: string, rating: number, review: string) => {
    setDates((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            status: 'completada',
            rating,
            review,
          };
        }
        return d;
      })
    );
  };

  // Chat message send handler
  const handleSendMessage = (msg: Omit<ChatMessage, 'id'>) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: `chat-${Date.now()}`,
    };
    setChatMessages((prev) => [...prev, newMsg]);
    syncEngine.broadcast('NEW_MESSAGE', newMsg, activePartner.id);
  };

  // Memories handlers
  const handleAddMemory = (mem: Omit<MemoryPhoto, 'id' | 'heartsCount'>) => {
    const newMemory: MemoryPhoto = {
      ...mem,
      id: `mem-${Date.now()}`,
      heartsCount: 1,
    };
    setMemories((prev) => [newMemory, ...prev]);
  };

  const handleToggleFavoriteMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  const handleLikeMemory = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, heartsCount: m.heartsCount + 1 } : m))
    );
  };

  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Important dates handlers
  const handleAddImportantDate = (item: Omit<ImportantDate, 'id'>) => {
    const newImportant: ImportantDate = {
      ...item,
      id: `id-${Date.now()}`,
    };
    setImportantDates((prev) => [...prev, newImportant]);
  };

  const handleDeleteImportantDate = (id: string) => {
    setImportantDates((prev) => prev.filter((i) => i.id !== id));
  };

  // Toggle Theme mode & palette
  const handleToggleThemeMode = () => {
    sounds.playPop();
    setProfile((prev) => ({
      ...prev,
      themeMode: prev.themeMode === 'dark' ? 'light' : 'dark',
    }));
  };

  const handleChangePalette = (palette: ColorPalette) => {
    sounds.playSuccessChime();
    setProfile((prev) => ({
      ...prev,
      themePalette: palette,
    }));
  };

  const handleTogglePremium = () => {
    setProfile((prev) => ({
      ...prev,
      isPremium: !prev.isPremium,
      premiumTier: !prev.isPremium ? 'vip' : 'free',
    }));
  };

  // Test push notification trigger
  const handleTriggerTestPush = () => {
    sounds.playLovePing();
    const newNotif: PushNotificationItem = {
      id: `test-${Date.now()}`,
      title: '¡Recordatorio de Amor! 💖',
      body: 'Recuerda decirle a tu pareja algo que admiras de ella hoy.',
      time: 'Ahora',
      category: 'reminder',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('DuoJoy: Recordatorio de Pareja', {
        body: 'Recuerda decirle a tu pareja algo que admiras de ella hoy. ❤️',
      });
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const nextDate = dates.find((d) => d.status === 'planeada');
  const dailyQuestion = quizzes.find((q) => q.category === 'daily');

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 ${
      isItchFrameMode ? 'p-2 sm:p-6 flex items-center justify-center bg-zinc-900' : ''
    }`}>
      {/* Optional Itch.io Embed Phone/Canvas Wrapper */}
      <div
        className={`w-full transition-all duration-300 ${
          isItchFrameMode
            ? 'max-w-md h-[92vh] bg-white dark:bg-zinc-950 rounded-[40px] shadow-2xl border-4 border-zinc-700 overflow-y-auto relative no-scrollbar'
            : 'max-w-7xl mx-auto'
        }`}
      >
        {/* Navigation Bar */}
        <Navbar
          profile={profile}
          activePartner={activePartner}
          onSwitchPartner={(p) => setActivePartner(p)}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          unreadNotifications={unreadCount}
          onOpenNotifications={() => setShowNotificationsModal(true)}
          onOpenPremium={() => setShowPremiumModal(true)}
          onToggleThemeMode={handleToggleThemeMode}
          onChangePalette={handleChangePalette}
          isItchFrameMode={isItchFrameMode}
          onToggleItchFrameMode={() => setIsItchFrameMode(!isItchFrameMode)}
        />

        {/* Main Content Body */}
        <main className="px-3 sm:px-6 py-6">
          {activeTab === 'inicio' && (
            <HomeOverview
              profile={profile}
              activePartner={activePartner}
              onUpdatePartnerMood={handleUpdatePartnerMood}
              onSendLovePing={handleSendLovePing}
              dailyQuestion={dailyQuestion}
              nextDate={nextDate}
              wishlist={wishlist}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenShareModal={() => setShowShareModal(true)}
              onOpenPremium={() => setShowPremiumModal(true)}
            />
          )}

          {activeTab === 'juegos' && (
            <QuizGames
              questions={quizzes}
              onAnswerQuestion={handleAnswerQuestion}
              onAddCustomQuestion={handleAddCustomQuestion}
              activePartner={activePartner}
              profile={profile}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'deseos' && (
            <Wishlist
              wishlist={wishlist}
              onAddWish={handleAddWish}
              onToggleWish={handleToggleWish}
              onDeleteWish={handleDeleteWish}
              activePartner={activePartner}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'citas' && (
            <DatePlanner
              dates={dates}
              onAddDate={handleAddDate}
              onCompleteDate={handleCompleteDate}
              activePartner={activePartner}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'chat' && (
            <CoupleChat
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              activePartner={activePartner}
              profile={profile}
              onSwitchPartner={(p) => setActivePartner(p)}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'recuerdos' && (
            <MemoriesAlbum
              memories={memories}
              onAddMemory={handleAddMemory}
              onToggleFavorite={handleToggleFavoriteMemory}
              onLikeMemory={handleLikeMemory}
              onDeleteMemory={handleDeleteMemory}
              activePartner={activePartner}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'fechas' && (
            <ImportantDates
              importantDates={importantDates}
              onAddImportantDate={handleAddImportantDate}
              onDeleteImportantDate={handleDeleteImportantDate}
              activePartner={activePartner}
              onGainXp={handleGainXp}
            />
          )}

          {activeTab === 'analiticas' && (
            <AnalyticsDashboard
              profile={profile}
              wishlist={wishlist}
              dates={dates}
              quizzes={quizzes}
              memories={memories}
            />
          )}

          {activeTab === 'ranking' && (
            <Leaderboard
              leaderboard={INITIAL_LEADERBOARD}
              profile={profile}
              onOpenShareModal={() => setShowShareModal(true)}
            />
          )}
        </main>
      </div>

      {/* Floating Support Desk Button */}
      <button
        id="floating-support-btn"
        type="button"
        onClick={() => {
          sounds.playPop();
          setShowSupportModal(true);
        }}
        className="fixed bottom-5 right-5 z-40 p-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-rose-500 dark:hover:bg-rose-600 text-white shadow-xl flex items-center gap-2 text-xs font-bold transition hover:scale-105 active:scale-95"
        title="Asistencia y Soporte de DuoJoy"
      >
        <MessageSquare className="w-4 h-4" />
        <span className="hidden sm:inline">Soporte & Ayuda</span>
      </button>

      {/* Modals */}
      {showShareModal && (
        <SocialShareModal
          profile={profile}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showPremiumModal && (
        <PremiumModal
          profile={profile}
          onTogglePremium={handleTogglePremium}
          onClose={() => setShowPremiumModal(false)}
        />
      )}

      {showSupportModal && (
        <SupportChatModal
          pairCode={profile.pairCode}
          onClose={() => setShowSupportModal(false)}
        />
      )}

      {showNotificationsModal && (
        <NotificationCenter
          notifications={notifications}
          onMarkAsRead={(id) => {
            sounds.playPop();
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
          }}
          onClearAll={() => {
            sounds.playPop();
            setNotifications([]);
          }}
          onTriggerTestPush={handleTriggerTestPush}
          onClose={() => setShowNotificationsModal(false)}
        />
      )}
    </div>
  );
}
