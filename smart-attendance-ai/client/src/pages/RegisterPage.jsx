import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import AuthLayout from '../layouts/AuthLayout';
import { cn } from '../lib/utils';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    enrollmentNumber: '',
    course: 'B.Tech CSE',
    semester: '4',
    section: 'A',
  });
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name, email: form.email, password: form.password, role: form.role };
      if (form.role === 'student') {
        payload.studentProfile = {
          name: form.name,
          enrollmentNumber: form.enrollmentNumber,
          email: form.email,
          course: form.course,
          semester: form.semester,
          section: form.section,
        };
      }
      const user = await register(payload);
      navigate({ admin: '/admin', faculty: '/faculty', student: '/student' }[user.role]);
      toast('Account created!', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const linkClass = cn(
    'inline-flex h-10 w-full items-center justify-center rounded-lg border border-white/15',
    'text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground'
  );

  return (
    <AuthLayout
      title="Join Smart Attendance AI"
      subtitle="Register as Admin, Faculty, or Student and start tracking attendance with intelligent alerts and AI recommendations."
    >
      <Card className="mx-auto w-full max-w-lg border-primary/15 shadow-glow">
        <div className="mb-6 hidden lg:block">
          <h2 className="font-display text-2xl font-semibold">Create account</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={form.name} onChange={set('name')} required className="sm:col-span-2" placeholder="Your name" />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} required className="sm:col-span-2" placeholder="you@college.edu" />
          <Input label="Password" type="password" value={form.password} onChange={set('password')} required className="sm:col-span-2" placeholder="Min. 6 characters" />
          <div className="sm:col-span-2">
            <label className="text-sm text-muted-foreground">Role</label>
            <select
              className="mt-1.5 flex h-10 w-full rounded-lg border border-white/10 bg-muted/50 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              value={form.role}
              onChange={set('role')}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === 'student' && (
            <>
              <Input label="Enrollment no." value={form.enrollmentNumber} onChange={set('enrollmentNumber')} required />
              <Input label="Course" value={form.course} onChange={set('course')} />
              <Input label="Semester" value={form.semester} onChange={set('semester')} />
              <Input label="Section" value={form.section} onChange={set('section')} />
            </>
          )}
          <Button type="submit" className="sm:col-span-2 w-full gap-2">
            <UserPlus className="h-4 w-4" />
            Register
          </Button>
        </form>

        <Link to="/login" className={cn(linkClass, 'mt-4')}>
          Already have an account? Sign in
        </Link>
      </Card>
    </AuthLayout>
  );
}
