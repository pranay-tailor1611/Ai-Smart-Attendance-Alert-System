import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Bell,
  Brain,
  LogOut,
  Menu,
  GraduationCap,
  List,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { Button } from '../components/ui/Button';
import AppFooter from '../components/layout/AppFooter';
import MeshBackground from '../components/layout/MeshBackground';

const navByRole = {
  admin: [
    { to: '/admin', label: 'Dashboard', desc: 'Overview & beauty', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', desc: 'Manage records', icon: Users },
    { to: '/admin/faculty', label: 'Faculty', desc: 'Team accounts', icon: GraduationCap },
    { to: '/admin/ai', label: 'AI Insights', desc: 'Smart agents', icon: Brain },
    { to: '/admin/alerts', label: 'Alerts', desc: 'Notifications', icon: Bell },
    { to: '/admin/reports', label: 'Reports', desc: 'Export files', icon: FileText },
  ],
  faculty: [
    { to: '/faculty', label: 'Dashboard', desc: 'Today’s snapshot', icon: LayoutDashboard },
    { to: '/faculty/mark', label: 'Mark attendance', desc: 'Daily roll call', icon: ClipboardList },
    { to: '/faculty/records', label: 'Records', desc: 'Full history', icon: List },
    { to: '/faculty/alerts', label: 'Alerts', desc: 'Student warnings', icon: Bell },
    { to: '/faculty/reports', label: 'Reports', desc: 'Downloads', icon: FileText },
  ],
  student: [
    { to: '/student', label: 'Dashboard', desc: 'My progress', icon: LayoutDashboard },
    { to: '/student/alerts', label: 'Alerts', desc: 'Your updates', icon: Bell },
    { to: '/student/suggestions', label: 'AI suggestions', desc: 'Personal tips', icon: Brain },
  ],
};

const roleBadge = {
  admin: 'bg-violet-500/25 text-violet-200 border-violet-400/30',
  faculty: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
  student: 'bg-fuchsia-500/20 text-fuchsia-200 border-fuchsia-400/30',
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = navByRole[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="relative flex min-h-screen">
      <MeshBackground />

      <aside
        className={cn(
          'sidebar-gradient fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/[0.08] backdrop-blur-xl transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="border-b border-white/[0.08] p-5">
          <Link to={links[0]?.to || '/'} className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/40 to-violet-600/30 shadow-glow-sm ring-1 ring-white/15 transition group-hover:scale-105">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span className="font-display text-xl font-semibold leading-none">Smart Attendance</span>
              <p className="mt-0.5 text-[11px] font-medium tracking-wider text-primary/80 uppercase">AI Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {links.map(({ to, label, desc, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to.split('/').filter(Boolean).length <= 1}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-start gap-3 rounded-2xl px-3.5 py-3 text-sm transition-all duration-200',
                  isActive ? 'nav-active text-primary' : 'text-muted-foreground hover:bg-white/[0.06] hover:text-foreground'
                )
              }
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                <span className="block font-semibold">{label}</span>
                <span className="block text-[11px] opacity-75">{desc}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className="mb-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/10 to-violet-600/5 p-4">
            <p className="truncate font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            <span className={cn('mt-2.5 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize', roleBadge[user?.role])}>
              {user?.role}
            </span>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {open && (
        <button type="button" className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu" />
      )}

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-[4.25rem] items-center justify-between border-b border-white/[0.06] bg-background/60 px-4 backdrop-blur-xl lg:px-8">
          <button type="button" className="rounded-xl p-2.5 hover:bg-white/8 lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <p className="font-display text-lg font-medium capitalize md:text-xl">
            <span className="text-muted-foreground">Hello · </span>
            <span className="text-gradient">{user?.role}</span>
          </p>
          {(user?.role === 'student' || user?.role === 'admin') && (
            <Link to={user.role === 'student' ? '/student/alerts' : '/admin/alerts'}>
              <Button variant="soft" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Alerts</span>
              </Button>
            </Link>
          )}
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-8">
          <Outlet />
        </main>
        <AppFooter compact />
      </div>
    </div>
  );
}
