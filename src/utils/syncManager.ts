export interface SyncPayload {
  type: 'UPDATE_ALL' | 'PING_LOVE' | 'NEW_MESSAGE' | 'QUIZ_ANSWERED';
  data: any;
  senderId?: string;
  timestamp: number;
}

type SyncListener = (payload: SyncPayload) => void;

class SyncManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('duojoy_couple_sync_v1');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }
  }

  subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(payload: SyncPayload) {
    this.listeners.forEach(fn => {
      try {
        fn(payload);
      } catch (err) {
        console.error('Error notifying sync listener:', err);
      }
    });
  }

  broadcast(type: SyncPayload['type'], data: any, senderId?: string) {
    const payload: SyncPayload = {
      type,
      data,
      senderId,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Broadcast failed:', err);
      }
    }
  }
}

export const syncEngine = new SyncManager();
