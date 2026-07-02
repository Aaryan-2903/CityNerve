import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RiskMap } from '@/components/map/RiskMap';
import { CommandFeed } from '@/components/timeline/CommandFeed';
import { IncidentCards } from '@/components/cards/IncidentCards';
import { AICommand } from '@/components/ai/AICommand';
import { WeatherWidget } from '@/components/panels/WeatherWidget';

export const metadata = {
  title: 'CityNerve — EOC Operations Dashboard',
  description: 'Live Emergency Operations Center — AI-powered disaster intelligence and decision support.',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* ── Upper: Hero Risk Map ──────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-white/[0.05]" style={{ height: 'calc(100% - 270px)' }}>
        <RiskMap />

        {/* Floating Weather Panel */}
        <div className="absolute top-[72px] left-5 w-[320px] pointer-events-none z-10">
          <div className="pointer-events-auto">
            <WeatherWidget />
          </div>
        </div>
      </div>

      {/* ── Lower: Three-column command section ──────────────── */}
      <div className="h-[270px] shrink-0 flex min-h-0 overflow-hidden">
        {/* Col 1: Command Feed — 31% */}
        <div className="w-[31%] min-w-0 overflow-hidden">
          <CommandFeed />
        </div>

        {/* Col 2: Incident Cards — flex-1 */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <IncidentCards />
        </div>

        {/* Col 3: AI Command — 27% */}
        <div className="w-[27%] min-w-0 overflow-hidden">
          <AICommand />
        </div>
      </div>
    </DashboardLayout>
  );
}
