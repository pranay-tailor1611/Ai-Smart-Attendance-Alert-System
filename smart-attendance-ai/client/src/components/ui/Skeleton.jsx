import { cn } from '../../lib/utils';

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-muted/80', className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>
  );
}
