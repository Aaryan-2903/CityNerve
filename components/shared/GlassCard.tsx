import { cn } from '@/lib/utils';

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
        'shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]',
        hoverable &&
          'cursor-pointer transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.1]',
        onClick && 'cursor-pointer',
        className,
      )}
      style={{
        ...(glowColor
          ? { boxShadow: `0 0 0 1px ${glowColor}20, 0 4px 32px ${glowColor}10, 0 1px 0 0 rgba(255,255,255,0.04) inset` }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
