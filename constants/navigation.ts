export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Operations Center', href: '/', icon: 'LayoutDashboard' },
  { id: 'incidents', label: 'Incident Registry', href: '/incidents', icon: 'AlertTriangle' },
  { id: 'resources', label: 'Resource Management', href: '/resources', icon: 'Truck' },
  { id: 'analytics', label: 'Analytics', href: '/analytics', icon: 'BarChart3' },
  { id: 'ai-center', label: 'AI Command', href: '/ai-center', icon: 'Brain' },
  { id: 'comms', label: 'Communications', href: '/comms', icon: 'Radio' },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'alerts', label: 'Alert Preferences', href: '/alerts', icon: 'Bell' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'Settings' },
];
