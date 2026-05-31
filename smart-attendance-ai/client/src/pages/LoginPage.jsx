import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import AuthLayout from '../layouts/AuthLayout';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate({ admin: '/admin', faculty: '/faculty', student: '/student' }[user.role]);
      toast('Welcome back! ✨', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your beautiful attendance hub — analytics, AI insights, and gentle alerts await you."
    >
      <Card className="mx-auto w-full max-w-md border-primary/15 shadow-glow">
        <div className="mb-6 hidden lg:block">
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-widest">Sign in</span>
          </div>
          <h2 className="font-display text-2xl font-semibold">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">We missed you — enter your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="you@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground/90">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="rounded-full bg-card px-4 text-xs font-medium text-muted-foreground">New here?</span>
          </div>
        </div>

        <Link
          to="/register"
          className={cn(
            'inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/15',
            'bg-white/[0.04] text-sm font-semibold transition hover:border-primary/35 hover:bg-primary/10'
          )}
        >
          Create your account
        </Link>
      </Card>
    </AuthLayout>
  );
}
