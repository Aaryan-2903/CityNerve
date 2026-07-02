import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down' | 'stable';
  trendPositive?: boolean;
  accentColor?: string;
  icon?: React.ReactNode;
  sublabel?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  trend,
  trendPositive = true,
  accentColor,
  icon,
  sublabel,
  className,
}: StatCardProps) {
  const isPositiveTrend =
    trend === 'stable' ? null : trend === 'up' ? trendPositive : !trendPositive;

  const trendColor =
    isPositiveTrend === null
      ? '#6B7280'
      : isPositiveTrend
        ? '#22C55E'
        : '#EF4444';

  return (
    <GlassCard
      className={cn('p-4 flex flex-col gap-3', className)}
      glowColor={accentColor}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
          {label}
        </span>
        {icon && (
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={
              accentColor
                ? {
                    backgroundColor: `${accentColor}15`,
                    border: `1px solid ${accentColor}25`,
                    color: accentColor,
                  }
                : {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.4)',
                  }
            }
          >
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span
          className="text-3xl font-bold tracking-tight tabular-nums"
          style={{ color: accentColor ?? '#ffffff' }}
        >
          {value}
        </span>

        {delta && trend && (
          <div
            className="flex items-center gap-1 text-xs font-semibold mb-1"
            style={{ color: trendColor }}
          >
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
            <span>{delta}</span>
          </div>
        )}
      </div>

      {sublabel && (
        <p className="text-[11px] text-white/30 leading-tight">{sublabel}</p>
      )}

      {/* Accent bottom border */}
      {accentColor && (
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, ${accentColor}40, transparent)` }}
        />
      )}
    </GlassCard>
  );
}
