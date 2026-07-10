import { cn } from '@/utils/cn';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glowColor?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className,
  onClick,
  hoverable = false,
  glowColor,
  id,
  style,
}: GlassCardProps) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl border border-white/[0.06] bg-white/[0.03]',
        'backdrop-blur-xl overflow-hidden',
        'shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_-1px_0_0_rgba(0,0,0,0.2)_inset]',
        hoverable && 'cursor-pointer transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.1]',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        ...(style || {}),
        ...(glowColor ? { boxShadow: `0 0 0 1px ${glowColor}30, 0 4px 32px ${glowColor}15` } : {}),
      }}
    >
      {children}
    </div>
  );
}
