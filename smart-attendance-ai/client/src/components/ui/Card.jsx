import { cn } from '../../lib/utils';

export function Card({ className, children, hover, ...props }) {
  return (
    <div className={cn(hover ? 'glass-card-hover' : 'glass-card', 'p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-5', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return (
    <h3 className={cn('font-display text-xl font-semibold tracking-tight text-foreground', className)}>
      {children}
    </h3>
  );
}
