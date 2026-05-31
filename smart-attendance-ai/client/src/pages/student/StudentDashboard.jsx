import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Brain, Target, BookOpen } from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import AttendanceRing from '../../components/dashboard/AttendanceRing';
import { TrendLineChart, SubjectBarChart } from '../../components/charts/AttendanceCharts';

const levelMessages = {
  green: 'Excellent! Keep maintaining your attendance above 85%.',
  yellow: 'You are in the warning zone. Attend upcoming classes regularly.',
  red: 'Critical: Your attendance is below 75%. Follow AI suggestions and meet your coordinator.',
};

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.student().then(({ data: d }) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const stats = data?.stats;
  const level = stats?.level || 'green';
  const unreadAlerts = data?.alerts?.filter((a) => !a.read)?.length ?? 0;

  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center py-8 lg:col-span-1">
          <p className="mb-4 text-sm font-medium text-muted-foreground">Your attendance</p>
          <AttendanceRing percent={stats?.percent ?? 0} level={level} size={180} />
          <p className="mt-6 max-w-xs text-center text-sm text-muted-foreground">{levelMessages[level]}</p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
          <StatCard icon={BookOpen} label="Classes attended" value={`${stats?.present ?? 0} / ${stats?.total ?? 0}`} sub="Present vs total marked" accent="emerald" />
          <StatCard icon={Target} label="Needed for 75%" value={stats?.classesNeededFor75 ?? 0} accent="amber" sub="More present classes required" />
          <StatCard icon={Bell} label="Unread alerts" value={unreadAlerts} accent={unreadAlerts ? 'red' : 'primary'} sub="Check notifications" />
          <StatCard icon={Brain} label="AI tips" value={data?.recommendation?.items?.length ?? 0} sub="Personalized suggestions" />
        </div>
      </div>

      <QuickActions
        actions={[
          { to: '/student/alerts', label: 'My alerts', desc: 'Attendance warnings & updates', icon: Bell, variant: unreadAlerts ? 'primary' : 'default' },
          { to: '/student/suggestions', label: 'AI suggestions', desc: 'Recovery plan from Gemini', icon: Brain, variant: 'primary' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly trend</CardTitle>
          </CardHeader>
          {(data?.monthlyTrend?.length ?? 0) > 0 ? (
            <TrendLineChart data={data.monthlyTrend} />
          ) : (
            <p className="pb-6 text-sm text-muted-foreground">Trend will appear after more classes are marked.</p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject-wise breakdown</CardTitle>
          </CardHeader>
          {(data?.subjectWise?.length ?? 0) > 0 ? (
            <SubjectBarChart data={data.subjectWise} />
          ) : (
            <p className="pb-6 text-sm text-muted-foreground">No subject data yet.</p>
          )}
        </Card>
      </div>

      {data?.recommendation?.items?.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest AI recommendations</CardTitle>
            <Link to="/student/suggestions">
              <Button size="sm" variant="outline">View all</Button>
            </Link>
          </CardHeader>
          <ul className="space-y-2">
            {data.recommendation.items.slice(0, 4).map((item, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{i + 1}</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {data?.alerts?.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent alerts</CardTitle>
            <Link to="/student/alerts">
              <Button size="sm" variant="ghost">See all</Button>
            </Link>
          </CardHeader>
          <div className="space-y-2">
            {data.alerts.slice(0, 3).map((a) => (
              <div key={a._id} className={`rounded-xl border px-4 py-3 text-sm ${!a.read ? 'border-primary/30 bg-primary/5' : 'border-white/5 bg-muted/20'}`}>
                <p className="font-medium">{a.title}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.message}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
