import { cn } from '@/src/utils/cn';

type StatusVariant = 'live' | 'active' | 'warning' | 'offline' | 'idle';

const STATUS_CONFIG: Record<
  StatusVariant,
  { color: string; label: string; pulse: boolean }
> = {
  live: { color: '#22C55E', label: 'LIVE', pulse: true },
  active: { color: '#3B82F6', label: 'ACTIVE', pulse: true },
  warning: { color: '#EAB308', label: 'WARNING', pulse: true },
  offline: { color: '#6B7280', label: 'OFFLINE', pulse: false },
  idle: { color: '#6B7280', label: 'IDLE', pulse: false },
};

interface StatusIndicatorProps {
  variant?: StatusVariant;
  label?: string;
  showLabel?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function StatusIndicator({
  variant = 'live',
  label,
  showLabel = true,
  className,
  size = 'sm',
}: StatusIndicatorProps) {
  const config = STATUS_CONFIG[variant];
  const displayLabel = label ?? config.label;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="relative flex items-center justify-center">
        {config.pulse && (
          <span
            className={cn(
              'absolute inline-flex rounded-full animate-ping opacity-60',
              size === 'sm' && 'h-2 w-2',
              size === 'md' && 'h-3 w-3',
            )}
            style={{ backgroundColor: config.color }}
          />
        )}
        <span
          className={cn(
            'relative inline-flex rounded-full',
            size === 'sm' && 'h-1.5 w-1.5',
            size === 'md' && 'h-2 w-2',
          )}
          style={{ backgroundColor: config.color }}
        />
      </span>
      {showLabel && (
        <span
          className="font-mono text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: config.color }}
        >
          {displayLabel}
        </span>
      )}
    </div>
  );
}
