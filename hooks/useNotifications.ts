import { useState, useEffect } from 'react';
import { API_BASE_URL as API_BASE } from '@/lib/api-config';

export interface NotificationEntry {
  id: string;
  cityId: string;
  phase: number;
  time: string;
  text: string;
  dotColor: string;
  category: 'dispatch' | 'shelter' | 'advisory' | 'report';
}

// ---------------------------------------------------------------------------
// Per-phase mock notifications — used when backend is unavailable
// ---------------------------------------------------------------------------
import { formatHHMM } from '@/utils/format';

const now = () => ''; // Placeholder for SSR

const PHASE_NOTIFICATIONS: Record<number, Omit<NotificationEntry, 'id' | 'cityId' | 'phase'>[]> = {
  0: [
    { time: now(), text: 'City monitoring active — all systems nominal.', dotColor: '#3B82F6', category: 'advisory' },
    { time: now(), text: 'EOC standby protocols in place.', dotColor: '#6B7280', category: 'advisory' },
  ],
  1: [
    { time: now(), text: 'Weather Advisory: Heavy rainfall detected in coastal sectors.', dotColor: '#F59E0B', category: 'advisory' },
    { time: now(), text: 'Monitoring low-lying areas for water accumulation.', dotColor: '#3B82F6', category: 'advisory' },
  ],
  2: [
    { time: now(), text: 'Citizen reports of localized flooding received.', dotColor: '#F97316', category: 'report' },
    { time: now(), text: 'Storm watch issued — advisory upgraded.', dotColor: '#F59E0B', category: 'advisory' },
    { time: now(), text: 'Utility teams dispatched to secure infrastructure.', dotColor: '#10B981', category: 'dispatch' },
  ],
  3: [
    { time: now(), text: 'FLASH FLOOD WARNING — water levels rising rapidly.', dotColor: '#EF4444', category: 'advisory' },
    { time: now(), text: 'Evacuation readiness orders issued to coastal sectors.', dotColor: '#EF4444', category: 'advisory' },
    { time: now(), text: '12 ambulance units dispatched to flood zones.', dotColor: '#10B981', category: 'dispatch' },
  ],
  4: [
    { time: now(), text: 'Road Closures: NH-48 and Inner Ring Road flooded.', dotColor: '#EF4444', category: 'advisory' },
    { time: now(), text: 'Emergency vehicle routes updated to avoid arterial roads.', dotColor: '#F97316', category: 'dispatch' },
    { time: now(), text: 'Shelter capacity at 40% — additional sites on standby.', dotColor: '#F59E0B', category: 'shelter' },
  ],
  5: [
    { time: now(), text: 'CRITICAL: Emergency shelters at 85% capacity.', dotColor: '#EF4444', category: 'shelter' },
    { time: now(), text: 'Secondary shelter sites activated at community centers.', dotColor: '#F59E0B', category: 'shelter' },
    { time: now(), text: 'Rescue teams deployed to all high-risk zones.', dotColor: '#10B981', category: 'dispatch' },
  ],
  6: [
    { time: now(), text: 'EMERGENCY STATE: Active rescue operations underway.', dotColor: '#EF4444', category: 'dispatch' },
    { time: now(), text: 'Air rescue units coordinating with ground teams.', dotColor: '#10B981', category: 'dispatch' },
    { time: now(), text: 'Reserve personnel mobilized — 200 units active.', dotColor: '#A855F7', category: 'dispatch' },
  ],
  7: [
    { time: now(), text: 'Water levels receding — recovery phase initiated.', dotColor: '#10B981', category: 'advisory' },
    { time: now(), text: 'Engineering teams dispatched for infrastructure assessment.', dotColor: '#3B82F6', category: 'dispatch' },
    { time: now(), text: 'Shelter occupants being safely transported home.', dotColor: '#10B981', category: 'shelter' },
  ],
  8: [
    { time: now(), text: 'All Clear — simulation complete. Systems returning to normal.', dotColor: '#10B981', category: 'advisory' },
    { time: now(), text: 'Emergency protocols stood down. Standard operations resumed.', dotColor: '#3B82F6', category: 'advisory' },
  ],
};

function getMockNotifications(cityId: string, phase: number): NotificationEntry[] {
  const entries = PHASE_NOTIFICATIONS[phase] ?? PHASE_NOTIFICATIONS[0];
  const currentTime = formatHHMM(new Date());
  return entries.map((n, i) => ({
    ...n,
    time: currentTime,
    id: `mock-notif-${cityId}-${phase}-${i}`,
    cityId,
    phase,
  }));
}

// ---------------------------------------------------------------------------

export function useNotifications(cityId: string, phase: number) {
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!cityId) return;
    let cancelled = false;

    // Reset immediately to mock for this phase on every change
    setNotifications(getMockNotifications(cityId, phase));

    // Skip network request if no backend is configured
    if (!API_BASE) {
      setIsLoading(false);
      return;
    }

    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/v1/scenario/notifications?cityId=${cityId}&phase=${phase}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NotificationEntry[] = await res.json();
        if (!cancelled && data.length > 0) {
          setNotifications(data);
        }
        // If backend returns empty array, keep the mock data we already set
      } catch (err) {
        // Silent — mock data already loaded above
        if (!cancelled) console.warn('[CityNerve] Notifications API unavailable, using demo data.', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void fetchNotifications();
    return () => { cancelled = true; };
  }, [cityId, phase]);

  return { notifications, isLoading };
}
