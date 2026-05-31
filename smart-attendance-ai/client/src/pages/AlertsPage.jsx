import { useEffect, useState } from 'react';
import { aiApi } from '../services/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import PageHeader from '../components/dashboard/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);

  const load = () => aiApi.alerts().then(({ data }) => setAlerts(data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await aiApi.markRead(id);
    load();
  };

  const desc =
    user?.role === 'student'
      ? 'Attendance warnings and updates sent by the AI alert agent.'
      : 'All attendance alerts — green, yellow, and red levels.';

  return (
    <div className="space-y-6">
      <PageHeader title="Alerts & notifications" description={desc} />
      <div className="space-y-3">
        {alerts.map((a) => (
          <Card key={a._id} className={!a.read ? 'border-primary/30' : ''}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Badge level={a.level}>{a.level}</Badge>
                  {!a.read && <span className="text-xs text-primary">New</span>}
                </div>
                <h3 className="mt-2 font-semibold">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.message}</p>
                {a.studentId?.name && (
                  <p className="text-xs mt-2 text-muted-foreground">Student: {a.studentId.name}</p>
                )}
                <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{a.attendancePercent}%</p>
                {!a.read && (
                  <Button size="sm" variant="outline" className="mt-2" onClick={() => markRead(a._id)}>
                    Mark read
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {!alerts.length && <p className="text-muted-foreground text-sm">No alerts yet.</p>}
      </div>
    </div>
  );
}
