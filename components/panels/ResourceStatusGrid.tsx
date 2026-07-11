'use client';

import { motion } from 'framer-motion';
import { Ambulance, Shield, Flame, Cross, LifeBuoy } from 'lucide-react';
import { useSimulationContext } from '@/context/SimulationContext';

type StatusType = 'Available' | 'En Route' | 'Busy';

interface ResourceCount {
  available: number;
  enRoute: number;
  busy: number;
}

const RESOURCE_TYPES = [
  { id: 'ems', label: 'Ambulances', icon: Ambulance, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'police', label: 'Police', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'fire', label: 'Fire', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'rescue', label: 'Rescue', icon: LifeBuoy, color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

export function ResourceStatusGrid() {
  const sim = useSimulationContext();
  const phase = sim?.phase ?? 0;

  // Simulate dynamic values based on phase
  const getSimulatedData = (baseTotal: number): ResourceCount => {
    // As phase increases, more units become busy or en route
    const busyFactor = Math.min(phase * 0.15, 0.8);
    const enRouteFactor = Math.min(phase * 0.05, 0.2);
    
    const busy = Math.floor(baseTotal * busyFactor);
    const enRoute = Math.floor(baseTotal * enRouteFactor);
    const available = baseTotal - busy - enRoute;
    
    return { available, enRoute, busy };
  };

  const statusData: Record<string, ResourceCount> = {
    ems: getSimulatedData(45),
    police: getSimulatedData(80),
    fire: getSimulatedData(30),
    rescue: getSimulatedData(20),
  };

  return (
    <div className="grid grid-cols-2 gap-2 p-3 pb-1 border-b border-white/[0.06]">
      {RESOURCE_TYPES.map((res, i) => {
        const data = statusData[res.id];
        return (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col p-2 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${res.bg}`}>
                <res.icon className={`w-3.5 h-3.5 ${res.color}`} />
              </div>
              <span className="text-[11px] font-bold text-white/80 tracking-wide uppercase">{res.label}</span>
            </div>
            
            <div className="space-y-1 mt-1">
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-white/50">Available</span>
                </div>
                <span className="font-mono text-white/80">{data.available}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span className="text-white/50">En Route</span>
                </div>
                <span className="font-mono text-white/80">{data.enRoute}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-white/50">Busy</span>
                </div>
                <span className="font-mono text-white/80">{data.busy}</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
