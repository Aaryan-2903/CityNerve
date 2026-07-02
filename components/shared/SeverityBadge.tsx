import { cn } from '@/lib/utils';
import { SEVERITY_CONFIG } from '@/constants/incidents';
import type { Severity } from '@/types/incident';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function SeverityBadge({
  severity,
  className,
  size = 'sm',
  pulse = false,
}: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-widest uppercase',
        size === 'sm' && 'px-2 py-0.5 text-[10px]',
        size === 'md' && 'px-3 py-1 text-xs',
        className,
      )}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
      }}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {(severity === 'critical' || severity === 'high') && (
            <span
              className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
              style={{ backgroundColor: config.color }}
            />
          )}
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
        </span>
      )}
      {config.label}
    </span>
  );
}
