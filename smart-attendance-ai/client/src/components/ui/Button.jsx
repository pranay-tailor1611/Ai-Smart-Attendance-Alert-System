import { cn } from '../../lib/utils';

export function Button({ className, variant = 'default', size = 'md', ...props }) {
  const variants = {
    default: 'btn-gradient',
    outline:
      'rounded-xl border border-white/15 bg-white/5 text-foreground backdrop-blur-sm hover:border-primary/40 hover:bg-primary/10 hover:shadow-glow-sm',
    ghost: 'rounded-xl hover:bg-white/8 text-muted-foreground hover:text-foreground',
    danger: 'rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg hover:opacity-90',
    soft: 'rounded-xl bg-primary/15 text-primary border border-primary/25 hover:bg-primary/25',
  };
  const sizes = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-300 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        variant !== 'default' && sizes[size],
        className
      )}
      {...props}
    />
  );
}
