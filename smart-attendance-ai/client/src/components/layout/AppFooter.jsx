import { Brain, Sparkles, Heart } from 'lucide-react';

export default function AppFooter({ compact = false }) {
  const year = new Date().getFullYear();

  if (compact) {
    return (
      <footer className="border-t border-white/[0.06] bg-card/30 px-4 py-4 text-center backdrop-blur-md">
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Heart className="h-3 w-3 fill-primary/50 text-primary" />
          Smart Attendance AI · © {year}
        </p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/[0.06] bg-gradient-to-t from-card/80 to-transparent">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold">Smart Attendance AI</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A lovingly crafted agentic attendance platform — predictions, gentle alerts, and AI recommendations
              that actually care about students.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 text-sm">
            <div>
              <h4 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Features
              </h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>Live analytics</li>
                <li>AI predictions</li>
                <li>Smart alerts</li>
                <li>PDF & Excel reports</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Built with</h4>
              <ul className="space-y-1.5 text-muted-foreground">
                <li>React · Tailwind</li>
                <li>Node · MongoDB</li>
                <li>LangGraph · Gemini</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">© {year} · Designed with care ✨</p>
      </div>
    </footer>
  );
}
