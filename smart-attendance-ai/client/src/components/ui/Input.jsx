import { cn } from '../../lib/utils';

export function Input({ className, label, ...props }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-foreground/90">{label}</label>}
      <input
        className={cn(
          'flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm',
          'placeholder:text-muted-foreground/70 outline-none transition-all duration-200',
          'focus:border-primary/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      />
    </div>
  );
}
