import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import AuthLayout from '../layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevResetUrl('');
    try {
      const { data } = await authApi.forgotPassword(email);
      setSent(true);
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
      toast(data.message, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your registered email. We'll send a secure link to reset your password."
    >
      <Card className="mx-auto w-full max-w-md border-white/15 shadow-2xl shadow-blue-950/50">
        <div className="mb-6 hidden lg:block">
          <h2 className="text-xl font-semibold">Reset password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Link expires in 1 hour</p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
              <Mail className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Check your inbox for the reset link. If you don't see it, check spam folder.
            </p>
            {devResetUrl && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-left text-sm">
                <p className="font-medium text-amber-300">Development mode (SMTP not set)</p>
                <p className="mt-2 break-all text-xs text-muted-foreground">{devResetUrl}</p>
                <Link
                  to={`/reset-password?token=${new URL(devResetUrl).searchParams.get('token')}`}
                  className="mt-3 inline-block text-primary text-xs hover:underline"
                >
                  Open reset page →
                </Link>
              </div>
            )}
            <Link to="/login">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to sign in
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <Mail className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
            <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to sign in
            </Link>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
}
