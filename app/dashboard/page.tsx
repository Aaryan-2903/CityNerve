import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskMap } from '@/components/map/RiskMap';
import { CommandFeed } from '@/components/timeline/CommandFeed';
import { IncidentCards } from '@/components/cards/IncidentCards';
import { AICommand } from '@/components/ai/AICommand';
import { WeatherWidget } from '@/components/panels/WeatherWidget';
import { SimulationControl } from '@/components/panels/SimulationControl';
import { SimulationProvider } from '@/context/SimulationContext';

export const metadata = {
  title: 'CityNerve — EOC Operations Dashboard',
  description: 'Live Emergency Operations Center — AI-powered disaster intelligence and decision support.',
};

export default function DashboardPage() {
  return (
    <SimulationProvider>
      <DashboardLayout>
        {/* ── Upper: Hero Risk Map ──────────────────────────────── */}
        <div className="relative overflow-hidden border-b border-white/[0.05]" style={{ height: 'calc(100% - 230px)' }}>
          <RiskMap />

          {/* Floating Weather Panel — top-left */}
          <div className="absolute top-[72px] left-5 w-[320px] pointer-events-none z-10">
            <div className="pointer-events-auto">
              <WeatherWidget />
            </div>
          </div>

          {/* ── Floating Simulation Button — bottom-centre ── */}
          <div className="absolute bottom-[88px] left-0 right-0 flex justify-center pointer-events-none z-20">
            <div className="pointer-events-auto">
              <SimulationControl />
            </div>
          </div>
        </div>

        {/* ── Lower: Three-column command section ──────────────── */}
        <div className="h-[230px] shrink-0 flex min-h-0 overflow-hidden">
          {/* Col 1: Command Feed — 26% */}
          <div className="w-[26%] min-w-0 overflow-hidden">
            <CommandFeed />
          </div>

          {/* Col 2: Incident Cards — flex-1 */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <IncidentCards />
          </div>

          {/* Col 3: AI Command — 32% */}
          <div className="w-[32%] min-w-0 overflow-hidden">
            <AICommand />
          </div>
        </div>
      </DashboardLayout>
    </SimulationProvider>
  );
}
