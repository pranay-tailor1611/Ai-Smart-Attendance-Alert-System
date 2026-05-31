import { cn } from '../../lib/utils';

export function Badge({ children, level, className }) {
  const levels = {
    green: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
    yellow: 'border-amber-400/30 bg-amber-500/15 text-amber-200',
    red: 'border-rose-400/35 bg-rose-500/20 text-rose-200',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold capitalize backdrop-blur-sm',
        level && levels[level],
        className
      )}
    >
      {children}
    </span>
  );
}
