'use client';

import { Bell, RefreshCw, Wifi, AlertCircle, ChevronDown } from 'lucide-react';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import { useRealTimeClock } from '@/hooks/useRealTimeClock';

interface TopBarProps {
  activeIncidents: number;
  criticalCount: number;
}

import { useState, useRef, useEffect } from 'react';
import { useCity } from '@/context/CityContext';
import { MapPin, Navigation, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportIncidentModal } from '@/components/modals/ReportIncidentModal';

function CitySwitcher() {
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
    <div className="flex items-center gap-2">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition-colors"
        >
          <span>📍 {currentCity.name}</span>
          <ChevronDown className={cn("w-3 h-3 text-white/50 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-48 rounded-lg border border-white/[0.1] bg-[#0F1524] shadow-2xl overflow-hidden z-50">
            <div className="max-h-[300px] overflow-y-auto p-1">
              {isLoadingCities ? (
                <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-white/50" /></div>
              ) : availableCities.length === 0 ? (
                <div className="p-3 text-xs text-white/50 text-center">No cities available</div>
              ) : availableCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    setCity(city.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors text-left",
                    currentCity.id === city.id 
                      ? "bg-white/10 text-white font-semibold" 
                      : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  )}
                >
                  <MapPin className="w-3 h-3 opacity-50" />
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={detectLocation}
        disabled={isDetecting}
        className="flex items-center gap-1.5 rounded bg-white/[0.05] border border-white/[0.1] px-2 py-1 text-[10px] font-medium text-blue-400 hover:bg-white/[0.1] hover:text-blue-300 transition-colors"
      >
        <Navigation className={cn("w-3 h-3", isDetecting && "animate-spin")} />
        {isDetecting ? 'Detecting...' : '📡 Use My Location'}
      </button>
    </div>
  );
}

export function TopBar({ activeIncidents, criticalCount }: TopBarProps) {
  const { utcTime, utcDate } = useRealTimeClock();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <>
      <ReportIncidentModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      <header className="relative z-50 flex h-12 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[#070B14]/80 px-4 backdrop-blur-xl">
      {/* Left: Breadcrumb + Incident count */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-white/30">EOC</span>
          <span className="text-white/20">/</span>
          <CitySwitcher />
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" />
          <span className="font-mono text-xs font-bold text-red-400">{activeIncidents}</span>
          <span className="text-xs text-white/30">active incidents</span>
          {criticalCount > 0 && (
            <>
              <span className="text-white/20">·</span>
              <span className="font-mono text-xs font-bold text-red-500">{criticalCount} critical</span>
            </>
          )}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right: System indicators + Clock */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setReportModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Report Incident
        </button>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Data feed status */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-[10px] font-mono text-white/30">FEEDS ONLINE</span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <StatusIndicator variant="live" label="AI ONLINE" size="sm" />
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-mono text-white/30">30s REFRESH</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* UTC Clock */}
        <div className="flex flex-col items-end leading-none" suppressHydrationWarning>
          <span suppressHydrationWarning className="font-mono text-xs font-bold text-white/80 tabular-nums">{utcTime}</span>
          <span suppressHydrationWarning className="font-mono text-[10px] text-white/25">{utcDate} UTC</span>
        </div>

        <div className="h-4 w-px bg-white/10" />

        {/* Notifications */}
        <button
          className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white/80 hover:border-white/15 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
            {criticalCount}
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 hover:border-white/15 transition-colors">
          <div className="h-4.5 w-4.5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white">
            EC
          </div>
          <ChevronDown className="w-3 h-3 text-white/30" />
        </button>
      </div>
    </header>
    </>
  );
}
