import { useAuth } from '../../context/AuthContext';
import { Sparkles, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

const roleMeta = {
  admin: {
    label: 'Administrator',
    gradient: 'from-violet-600/35 via-fuchsia-600/20 to-transparent',
    accent: 'border-violet-400/25',
    blurb: 'Oversee your institution with clarity — students, faculty, AI insights & reports at your fingertips.',
  },
  faculty: {
    label: 'Faculty',
    gradient: 'from-rose-600/30 via-pink-600/15 to-transparent',
    accent: 'border-rose-400/25',
    blurb: 'Mark attendance with ease and keep every student on the path to success.',
  },
  student: {
    label: 'Student',
    gradient: 'from-fuchsia-600/30 via-violet-600/15 to-transparent',
    accent: 'border-fuchsia-400/25',
    blurb: 'Your personal space for attendance, gentle reminders, and AI guidance tailored just for you.',
  },
};

export default function WelcomeBanner() {
  const { user } = useAuth();
  const meta = roleMeta[user?.role] || roleMeta.student;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border p-6 md:p-8',
        'bg-gradient-to-br shadow-glow-sm',
        meta.gradient,
        meta.accent
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-6 left-1/4 h-32 w-32 rounded-full bg-accent/15 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Heart className="h-3 w-3 fill-primary text-primary" />
            {meta.label}
          </span>
          <h1 className="font-display mt-4 text-3xl font-semibold md:text-4xl">
            {greeting},{' '}
            <span className="text-gradient">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">{meta.blurb}</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/25 px-5 py-4 backdrop-blur-md">
          <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Signed in
          </p>
          <p className="mt-1 font-medium">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
