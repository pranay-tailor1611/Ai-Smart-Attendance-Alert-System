import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { authApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import AuthLayout from '../layouts/AuthLayout';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast('Passwords do not match', 'error');
      return;
    }
    if (!token) {
      toast('Invalid reset link. Request a new one.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.resetPassword({ token, password });
      toast(data.message, 'success');
      navigate('/login');
    } catch (err) {
      toast(err.response?.data?.message || 'Reset failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is missing or invalid.">
        <Card className="mx-auto w-full max-w-md text-center">
          <p className="mb-4 text-sm text-muted-foreground">Request a new reset link from the login page.</p>
          <Link to="/forgot-password">
            <Button className="w-full">Forgot password</Button>
          </Link>
          <Link to="/login" className="mt-3 inline-block text-sm text-primary hover:underline">
            Back to sign in
          </Link>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set new password" subtitle="Choose a strong password with at least 6 characters.">
      <Card className="mx-auto w-full max-w-md border-white/15 shadow-2xl shadow-blue-950/50">
        <div className="mb-6 hidden lg:block">
          <h2 className="text-xl font-semibold">New password</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter and confirm your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New password"
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <KeyRound className="h-4 w-4" />
            {loading ? 'Updating...' : 'Update password'}
          </Button>
          <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
}
