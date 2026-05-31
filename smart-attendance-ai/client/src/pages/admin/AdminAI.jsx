import { useEffect, useState } from 'react';
import { Play, Zap } from 'lucide-react';
import { studentApi, aiApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import PageHeader from '../../components/dashboard/PageHeader';

export default function AdminAI() {
  const [students, setStudents] = useState([]);
  const [running, setRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    studentApi.list().then(({ data }) => setStudents(data));
  }, []);

  const runForStudent = async (id) => {
    setRunning(id);
    try {
      await aiApi.runWorkflow(id);
      toast('AI workflow completed for student', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Workflow failed', 'error');
    } finally {
      setRunning(false);
    }
  };

  const runBulk = async () => {
    setRunning('bulk');
    try {
      const { data } = await aiApi.runBulk();
      toast(`Bulk run: ${data.results.filter((r) => r.success).length} students processed`, 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Bulk failed', 'error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI insights"
        description="LangGraph pipeline: Monitoring → Prediction → Alerts → Recommendations → Report"
      >
        <Button onClick={runBulk} disabled={!!running}>
          <Zap className="mr-2 h-4 w-4" />
          {running === 'bulk' ? 'Running...' : 'Bulk AI run'}
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Per-Student AI Workflow</CardTitle>
        </CardHeader>
        <div className="space-y-2">
          {students.map((s) => (
            <div key={s._id} className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.enrollmentNumber}</p>
              </div>
              <Button size="sm" variant="outline" disabled={running === s._id} onClick={() => runForStudent(s._id)}>
                <Play className="mr-1 h-3 w-3" />
                {running === s._id ? 'Running...' : 'Run Agents'}
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Pipeline</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap gap-2 text-xs">
          {['Monitoring', 'Prediction', 'Alerts', 'Recommendations', 'Reports'].map((a, i) => (
            <Badge key={a} className="bg-primary/20 text-primary">
              {i + 1}. {a}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
