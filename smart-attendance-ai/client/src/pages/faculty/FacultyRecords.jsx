import { useEffect, useState } from 'react';
import { attendanceApi } from '../../services/api';
import { Card } from '../../components/ui/Card';
import PageHeader from '../../components/dashboard/PageHeader';

export default function FacultyRecords() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    attendanceApi.records().then(({ data }) => setRecords(data.slice(0, 100)));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance records" description="Browse recent attendance entries across all students and subjects." />
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-white/10">
              <th className="pb-3 pr-4">Student</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Subject</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id} className="border-b border-white/5">
                <td className="py-2 pr-4">{r.studentId?.name || '—'}</td>
                <td className="py-2 pr-4">{new Date(r.date).toLocaleDateString()}</td>
                <td className="py-2 pr-4">{r.subject}</td>
                <td className={`py-2 ${r.status === 'Present' ? 'text-emerald-400' : 'text-red-400'}`}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
