import { Sparkles, LineChart, Bell, Shield, Heart } from 'lucide-react';
import AppFooter from '../components/layout/AppFooter';
import MeshBackground from '../components/layout/MeshBackground';

const highlights = [
  { icon: LineChart, text: 'Beautiful live analytics dashboards', color: 'from-rose-400/30 to-pink-500/20' },
  { icon: Sparkles, text: 'Gemini AI — smart & caring recommendations', color: 'from-violet-400/30 to-purple-500/20' },
  { icon: Bell, text: 'Gentle alerts before attendance slips', color: 'from-fuchsia-400/30 to-rose-500/20' },
  { icon: Shield, text: 'Secure access for every role', color: 'from-indigo-400/30 to-violet-500/20' },
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <MeshBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="hidden lg:block">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-semibold tracking-wide text-primary backdrop-blur-md">
              <Heart className="h-3.5 w-3.5 fill-primary/40" />
              Made with care · Agentic AI
            </div>

            <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight">
              <span className="text-gradient">Smart</span>
              <br />
              Attendance AI
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">Where attendance meets elegance ✨</p>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground/95">
              {subtitle ||
                'A refined portal to track attendance, predict risks, and guide students with warmth — powered by LangGraph & Gemini.'}
            </p>

            <ul className="mt-10 space-y-4">
              {highlights.map(({ icon: Icon, text, color }) => (
                <li
                  key={text}
                  className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-sm transition hover:border-primary/20"
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="h-5 w-5 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-foreground/90">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-8 text-center lg:hidden">
              <p className="font-display text-3xl font-semibold">
                <span className="text-gradient">{title}</span>
              </p>
              <p className="mt-2 px-4 text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <AppFooter />
      </div>
    </div>
  );
}
