import { useEffect, useState } from 'react';
import { studentApi, attendanceApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import PageHeader from '../../components/dashboard/PageHeader';

export default function MarkAttendance() {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [subject, setSubject] = useState('Mathematics');
  const [statusMap, setStatusMap] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    studentApi.list().then(({ data }) => {
      setStudents(data);
      const map = {};
      data.forEach((s) => { map[s._id] = 'Present'; });
      setStatusMap(map);
    });
  }, []);

  const submit = async () => {
    const records = students.map((s) => ({
      studentId: s._id,
      date,
      subject,
      status: statusMap[s._id] || 'Present',
    }));
    try {
      await attendanceApi.bulk(records);
      toast('Attendance saved', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mark attendance"
        description="Select date and subject, then set Present or Absent for each student. Save once when done."
      />
      <Card className="grid gap-4 sm:grid-cols-3">
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <div className="flex items-end">
          <Button onClick={submit} className="w-full">Save All</Button>
        </div>
      </Card>
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-white/10">
              <th className="pb-3">Student</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b border-white/5">
                <td className="py-3">{s.name} ({s.enrollmentNumber})</td>
                <td className="py-3">
                  <select
                    className="rounded-lg border border-white/10 bg-muted/50 px-3 py-1.5"
                    value={statusMap[s._id]}
                    onChange={(e) => setStatusMap({ ...statusMap, [s._id]: e.target.value })}
                  >
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
