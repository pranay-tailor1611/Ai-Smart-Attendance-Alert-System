import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, AlertTriangle, Activity, Brain, FileText, Bell, GraduationCap } from 'lucide-react';
import { dashboardApi, attendanceApi } from '../../services/api';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import { LevelPieChart, SubjectBarChart } from '../../components/charts/AttendanceCharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.admin(), attendanceApi.stats()])
      .then(([dash, st]) => {
        setData(dash.data);
        setStats(st.data?.slice(0, 8) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const pieData = data?.levelDistribution
    ? [
        { name: 'Green (85%+)', value: data.levelDistribution.green },
        { name: 'Yellow (75-85%)', value: data.levelDistribution.yellow },
        { name: 'Red (<75%)', value: data.levelDistribution.red },
      ].filter((x) => x.value > 0)
    : [];

  const barData = stats.map((s) => ({ subject: s.name?.split(' ')[0] || s.enrollmentNumber, percent: s.percent }));

  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total students" value={data?.totalStudents ?? 0} sub="Enrolled in system" />
        <StatCard icon={TrendingUp} label="Average attendance" value={`${data?.avgAttendance ?? 0}%`} accent="emerald" sub="Institution-wide" />
        <StatCard icon={AlertTriangle} label="Defaulters" value={data?.defaulters?.length ?? 0} accent="red" sub="Below 75% threshold" />
        <StatCard icon={Activity} label="Faculty members" value={data?.totalFaculty ?? 0} sub="Active accounts" />
      </div>

      <QuickActions
        actions={[
          { to: '/admin/students', label: 'Manage students', desc: 'Add, edit, remove records', icon: Users, variant: 'primary' },
          { to: '/admin/faculty', label: 'Manage faculty', desc: 'Create faculty accounts', icon: GraduationCap },
          { to: '/admin/ai', label: 'Run AI agents', desc: 'Prediction & alerts workflow', icon: Brain, variant: 'primary' },
          { to: '/admin/reports', label: 'Export reports', desc: 'PDF & Excel downloads', icon: FileText },
          { to: '/admin/alerts', label: 'View alerts', desc: 'All student notifications', icon: Bell },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance distribution</CardTitle>
          </CardHeader>
          {pieData.length ? <LevelPieChart data={pieData} /> : <p className="pb-6 text-sm text-muted-foreground">No attendance data yet. Run seed or mark attendance.</p>}
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Student attendance overview</CardTitle>
          </CardHeader>
          {barData.length ? <SubjectBarChart data={barData} /> : <p className="pb-6 text-sm text-muted-foreground">No students to display</p>}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Defaulters (&lt;75%)</CardTitle>
            <Link to="/admin/students">
              <Button size="sm" variant="outline">View all</Button>
            </Link>
          </CardHeader>
          <div className="max-h-72 space-y-2 overflow-auto">
            {data?.defaulters?.length ? (
              data.defaulters.map((s) => (
                <div key={s._id} className="flex items-center justify-between rounded-xl border border-white/5 bg-muted/20 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.enrollmentNumber} · {s.course}</p>
                  </div>
                  <Badge level="red">{s.percent}%</Badge>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">All students above 75% — great job!</p>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent alerts</CardTitle>
            <Link to="/admin/alerts">
              <Button size="sm" variant="outline">See all</Button>
            </Link>
          </CardHeader>
          <div className="max-h-72 space-y-2 overflow-auto">
            {data?.recentAlerts?.length ? (
              data.recentAlerts.map((a) => (
                <div key={a._id} className="rounded-xl border border-white/5 bg-muted/20 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Badge level={a.level}>{a.level}</Badge>
                    <span className="text-xs text-muted-foreground">{a.attendancePercent}%</span>
                  </div>
                  <p className="mt-2 font-medium line-clamp-1">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.studentId?.name || 'Student'}</p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No alerts yet. Run AI workflow from AI Insights.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
