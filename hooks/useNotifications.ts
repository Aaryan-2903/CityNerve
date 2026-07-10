import { useState, useEffect } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export interface NotificationEntry {
  id: string;
  cityId: string;
  phase: number;
  time: string;
  text: string;
  dotColor: string;
  category: string;
}

export function useNotifications(cityId: string, phase: number) {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;
    
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/scenario/notifications?cityId=${cityId}&phase=${phase}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    
    fetchNotifications();
    return () => { cancelled = true; };
  }, [cityId, phase]);

  return { notifications, isLoading };
}
