import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { studentApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import PageHeader from '../../components/dashboard/PageHeader';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    name: '',
    enrollmentNumber: '',
    email: '',
    course: 'B.Tech CSE',
    semester: '4',
    section: 'A',
  });
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const load = () => studentApi.list().then(({ data }) => setStudents(data));
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await studentApi.create(form);
      toast('Student added', 'success');
      setShowForm(false);
      setForm({ name: '', enrollmentNumber: '', email: '', course: 'B.Tech CSE', semester: '4', section: 'A' });
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete student?')) return;
    await studentApi.remove(id);
    toast('Deleted', 'success');
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Add and manage student profiles — enrollment, course, semester, and section."
      >
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> Add student
        </Button>
      </PageHeader>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Enrollment" value={form.enrollmentNumber} onChange={(e) => setForm({ ...form, enrollmentNumber: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Course" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
            <Input label="Semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            <Input label="Section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            <Button type="submit" className="sm:col-span-2">Save</Button>
          </form>
        </Card>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-muted-foreground">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Enrollment</th>
              <th className="pb-3 pr-4">Course</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-b border-white/5">
                <td className="py-3 pr-4">{s.name}</td>
                <td className="py-3 pr-4">{s.enrollmentNumber}</td>
                <td className="py-3 pr-4">{s.course} · Sem {s.semester}</td>
                <td className="py-3">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(s._id)}>
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
