import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';
import { ArrowUpRight } from 'lucide-react';

export default function QuickActions({ actions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <div className="grid gap-3 sm:grid-cols-2">
        {actions.map(({ to, label, desc, icon: Icon, variant = 'default' }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'group relative flex items-start gap-3 overflow-hidden rounded-2xl border p-4 transition-all duration-300',
              variant === 'primary'
                ? 'border-primary/35 bg-gradient-to-br from-primary/15 to-violet-600/10 hover:shadow-glow-sm'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-primary/25 hover:bg-white/[0.06]'
            )}
          >
            <span
              className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-105',
                variant === 'primary'
                  ? 'bg-gradient-to-br from-primary/40 to-violet-500/30 text-primary'
                  : 'bg-white/8 text-muted-foreground group-hover:text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 font-semibold text-sm">
                {label}
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
              </p>
              {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
