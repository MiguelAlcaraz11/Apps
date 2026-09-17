import React, { useState } from 'react';
import { X, Bell, Check, Flame, Calendar, Sparkles, Heart } from 'lucide-react';
import { PushNotificationItem } from '../types';
import { sounds } from '../utils/audio';

interface NotificationCenterProps {
  notifications: PushNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  onTriggerTestPush: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  onClose,
  onTriggerTestPush,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);

  const getIcon = (cat: PushNotificationItem['category']) => {
    switch (cat) {
      case 'streak':
        return <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'date':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'quiz':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />;
    }
  };

  const handleTogglePush = () => {
    sounds.playPop();
    setPushEnabled(!pushEnabled);
    if (!pushEnabled && 'Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <Bell className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">
                Notificaciones & Recordatorios
              </h3>
              <p className="text-xs text-zinc-400">Recordatorios diarios de progreso y metas</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Push Notification Toggle Setting */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              Recordatorios Automáticos Push
            </h4>
            <p className="text-[11px] text-zinc-500">Alertas diarias de preguntas y citas</p>
          </div>

          <button
            type="button"
            onClick={handleTogglePush}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              pushEnabled ? 'bg-rose-500 justify-end' : 'bg-zinc-300 dark:bg-zinc-700 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>

        {/* Notifications list */}
        <div className="max-h-72 overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-400">
              No tienes notificaciones pendientes
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 opacity-60'
                    : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-800 shadow-2xs shrink-0 mt-0.5">
                  {getIcon(n.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white">
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-zinc-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                    {n.body}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <button
            type="button"
            onClick={onTriggerTestPush}
            className="text-rose-600 dark:text-rose-400 font-bold hover:underline"
          >
            Probar Notificación Ahora
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            Limpiar todo
          </button>
        </div>
      </div>
    </div>
  );
};
