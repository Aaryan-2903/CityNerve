'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Bell, Cloud, Wind, Menu } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
import { useCity } from '@/context/CityContext';
import { MapPin, Navigation } from 'lucide-react';

function CommandZoneSelector() {
  const { currentCity, setCity, isDetecting, detectLocation, availableCities, isLoadingCities } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-2.5 sm:px-3.5 py-2 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all group"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
        </span>
        {/* On very small screens show only the city dot; show label at sm+ */}
        <span className="hidden sm:block text-sm font-semibold text-white/85 max-w-[120px] truncate">
          {currentCity.displayLabel}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-white/30 transition-transform hidden sm:block", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-56 rounded-xl border border-white/[0.1] bg-[#0F1524] shadow-2xl overflow-hidden z-50">
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
      )}
    </div>
  );
}

function WeatherInfo() {
  return (
    <div className="hidden lg:flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2">
      <Cloud className="w-4 h-4 text-blue-300/70 shrink-0" />
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-semibold text-white/80">29°C</span>
        <span className="text-white/30">·</span>
        <span className="text-white/50">heavy rain</span>
        <span className="text-white/30">·</span>
        <div className="flex items-center gap-1">
          <Wind className="w-3 h-3 text-white/30" />
          <span className="text-white/40 text-xs">SW 18 km/h</span>
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
  return (
    <motion.header
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'h-[60px] sm:h-[72px] shrink-0 flex items-center justify-between gap-2 sm:gap-4',
        'bg-[#0B0F1C] border-b border-white/[0.06]',
        'px-3 sm:px-4 z-50 relative',
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
        <NotificationBell />
        <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />
        <UserProfile />
      </div>
    </motion.header>
  );
}
