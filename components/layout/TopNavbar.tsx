'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Bell, Cloud, Wind, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useIncidentsContext } from '@/context/IncidentContext';

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5 px-3 sm:px-5 shrink-0">
      {/* Animated brand icon */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/25 shrink-0">
        {/* Outer ring pulse */}
        <span className="absolute inset-0 rounded-full border border-blue-400/30 animate-pulse" />
        {/* WiFi-like concentric arcs */}
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-white" fill="none">
          <path d="M10 14a1 1 0 110-2 1 1 0 010 2z" fill="currentColor"/>
          <path d="M6.5 11.5a5 5 0 017 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3.5 8.5a9 9 0 0113 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[15px] font-bold tracking-tight text-white">CityNerve</span>
        {/* Hide subtitle on small screens to save space */}
        <span className="hidden sm:block text-[9px] font-semibold tracking-[0.18em] text-white/30 uppercase mt-0.5">
          Urban Disaster Intelligence
        </span>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCity } from '@/context/CityContext';
import { MapPin, Navigation } from 'lucide-react';

function CommandZoneSelector() {
  const { currentCity, setCity, isDetecting, detectLocation, availableCities, isLoadingCities } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 224 });

  // Handle position calculation
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 224; // w-56 = 14rem = 224px
      
      // Calculate safe left position to avoid overflowing the viewport
      const safeLeft = Math.max(8, Math.min(rect.left, window.innerWidth - dropdownWidth - 8));
      
      setDropdownStyle({
        top: rect.bottom + 8, // mt-2 equivalent
        left: safeLeft,
        width: dropdownWidth
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownContent = (
    <div 
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
        zIndex: 'var(--z-dropdown)'
      }}
      className="rounded-xl border border-white/[0.1] bg-[#0F1524] shadow-2xl overflow-hidden"
    >
      <div className="p-1.5">
        <button
          onClick={() => {
            detectLocation();
            setIsOpen(false);
          }}
          disabled={isDetecting}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors text-left"
        >
          <Navigation className={cn("w-3.5 h-3.5", isDetecting && "animate-spin")} />
          <span className="font-medium">{isDetecting ? 'Detecting...' : 'Use My Location'}</span>
        </button>
      </div>
      <div className="h-px bg-white/[0.06] mx-2" />
      <div className="p-1.5 max-h-[300px] overflow-y-auto">
        {isLoadingCities ? (
          <p className="px-3 py-2 text-xs text-white/30 italic">Loading cities…</p>
        ) : (
          availableCities.map((city) => (
            <button
              key={city.id}
              onClick={() => {
                setCity(city.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left",
                currentCity.id === city.id
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <MapPin className="w-3 h-3 opacity-50" />
              {city.name}
            </button>
          ))
        )}
      </div>
    </div>
  );

  // Use createPortal if window is defined (client-side)
  const portalNode = typeof window !== 'undefined' ? document.body : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 sm:px-3.5 py-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </span>
        <span className="hidden sm:block text-sm font-semibold text-white/85 max-w-[120px] truncate">
          {currentCity.displayLabel}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-white/30 transition-transform hidden sm:block", isOpen && "rotate-180")} />
      </button>

      {isOpen && portalNode && createPortal(dropdownContent, portalNode)}
    </div>
  );
}

import { useDashboardData } from '@/hooks/useDashboardData';

function WeatherInfo() {
  const { liveWeather } = useDashboardData();

  return (
    <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
      <Cloud className="w-4 h-4 text-blue-300/70 shrink-0" />
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-white/80">
          {liveWeather ? `${liveWeather.temperature}°C` : '--°C'}
        </span>
        <span className="text-white/30">·</span>
        <span className="text-white/50">{liveWeather?.label || 'unknown'}</span>
        <span className="text-white/30">·</span>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-white/30" />
          <span className="text-white/40 text-xs">{liveWeather?.wind_speed || '--'} km/h</span>
        </div>
      </div>
    </div>
  );
}


function NotificationBell() {
  return (
    <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/80 hover:border-white/[0.15] hover:bg-white/[0.06] transition-all shrink-0">
      <Bell className="w-4 h-4" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#0B0F1C]">
        3
      </span>
    </button>
  );
}

function UserProfile() {
  return (
    <button className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] pl-2 pr-3.5 py-1.5 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all shrink-0">
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-[11px] font-bold text-white border-0">
          OR
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-white/75 hidden xl:block">Officer Rao</span>
      <ChevronDown className="w-3 h-3 text-white/30 hidden xl:block" />
    </button>
  );
}

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  const { isReconnecting } = useIncidentsContext();

  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'h-[60px] sm:h-[72px] shrink-0 flex items-center justify-between gap-2 sm:gap-4',
        'bg-[#0B0F1C] border-b border-white/[0.06]',
        'px-3 sm:px-4 z-floating relative',
      )}
    >
      {/* Left: Hamburger (mobile only) + Brand */}
      <div className="flex items-center gap-1 sm:gap-0 min-w-0">
        {/* Hamburger — visible only on mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-all shrink-0 mr-1"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <BrandMark />
      </div>

      {/* Center: Command Zone */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <CommandZoneSelector />
        <WeatherInfo />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {isReconnecting && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[10px] font-bold text-orange-400 tracking-wider uppercase">Reconnecting...</span>
          </div>
        )}
        <div className={cn("h-5 w-px bg-white/[0.08] hidden sm:block", !isReconnecting && "hidden sm:block")} />
        <NotificationBell />
        <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />
        <UserProfile />
      </div>
    </motion.header>
  );
}
