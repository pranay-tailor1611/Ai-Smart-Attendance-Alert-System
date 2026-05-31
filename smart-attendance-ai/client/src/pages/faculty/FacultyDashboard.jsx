import { useEffect, useState } from 'react';
import { ClipboardList, Users, AlertTriangle, FileText, List } from 'lucide-react';
import { dashboardApi } from '../../services/api';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from '../../components/ui/Skeleton';
import WelcomeBanner from '../../components/dashboard/WelcomeBanner';
import StatCard from '../../components/dashboard/StatCard';
import QuickActions from '../../components/dashboard/QuickActions';
import { SubjectBarChart } from '../../components/charts/AttendanceCharts';

export default function FacultyDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.faculty().then(({ data: d }) => setData(d)).finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  const presentToday = data?.subjectSummary?.reduce((a, s) => a + s.present, 0) || 0;

  return (
    <div className="space-y-8">
      <WelcomeBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Your students" value={data?.totalStudents ?? 0} sub="Assigned cohort" />
        <StatCard icon={ClipboardList} label="Marked today" value={data?.todayMarked ?? 0} accent="emerald" sub={`${presentToday} present entries`} />
        <StatCard icon={AlertTriangle} label="At-risk students" value={data?.defaulters?.length ?? 0} accent="red" sub="Attendance below 75%" />
        <StatCard
          icon={List}
          label="Subjects today"
          value={data?.subjectSummary?.length ?? 0}
          sub={data?.subjectSummary?.length ? 'Active sessions' : 'Mark attendance to begin'}
        />
      </div>

      <QuickActions
        actions={[
          { to: '/faculty/mark', label: 'Mark attendance', desc: "Today's class roll call", icon: ClipboardList, variant: 'primary' },
          { to: '/faculty/records', label: 'View records', desc: 'Historical attendance log', icon: List },
          { to: '/faculty/reports', label: 'Download reports', desc: 'PDF & Excel exports', icon: FileText },
          { to: '/faculty/alerts', label: 'Student alerts', desc: 'Warnings & notifications', icon: AlertTriangle },
        ]}
      />

      {!data?.todayMarked && (
        <Card className="border-primary/30 bg-primary/5">
          <p className="text-sm">
            <span className="font-semibold text-primary">Tip:</span> Start your day by marking attendance for each subject. Students will see updated percentages instantly.
          </p>
          <Link to="/faculty/mark" className="mt-3 inline-block">
            <Button size="sm">Mark attendance now</Button>
          </Link>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today — subject-wise</CardTitle>
          </CardHeader>
          {data?.subjectSummary?.length ? (
            <SubjectBarChart data={data.subjectSummary} />
          ) : (
            <div className="pb-8 text-center">
              <p className="text-sm text-muted-foreground">No attendance marked today</p>
              <Link to="/faculty/mark">
                <Button className="mt-4" size="sm">Go to mark attendance</Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students needing attention</CardTitle>
          </CardHeader>
          <div className="max-h-64 space-y-2 overflow-auto">
            {data?.defaulters?.length ? (
              data.defaulters.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.enrollmentNumber}</p>
                  </div>
                  <Badge level="red">{s.percent}%</Badge>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">No defaulters in your list</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
