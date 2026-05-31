import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

export default function StatCard({ icon: Icon, label, value, sub, trend, accent = 'primary' }) {
  const accents = {
    primary: 'bg-gradient-to-br from-primary/30 to-fuchsia-500/20 text-primary shadow-glow-sm',
    emerald: 'bg-gradient-to-br from-emerald-400/25 to-teal-500/15 text-emerald-300',
    amber: 'bg-gradient-to-br from-amber-400/25 to-orange-500/15 text-amber-300',
    red: 'bg-gradient-to-br from-rose-500/25 to-red-500/15 text-rose-300',
  };

  return (
    <Card hover className="group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-4xl font-semibold tracking-tight text-gradient">{value}</p>
          {sub && <p className="mt-2 text-xs text-muted-foreground">{sub}</p>}
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trend.positive ? 'text-emerald-400' : 'text-rose-400')}>
              {trend.text}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'rounded-2xl p-3.5 transition duration-300 group-hover:scale-110',
              accents[accent] || accents.primary
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
