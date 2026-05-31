import { useEffect, useState } from 'react';
import { userApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import PageHeader from '../../components/dashboard/PageHeader';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: 'faculty123' });
  const { toast } = useToast();

  const load = () => userApi.faculty().then(({ data }) => setFaculty(data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userApi.createFaculty(form);
      toast('Faculty created', 'success');
      setForm({ name: '', email: '', password: 'faculty123' });
      load();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty" description="Create faculty accounts so they can mark attendance and view reports." />
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" className="sm:col-span-3 w-fit">Add Faculty</Button>
        </form>
      </Card>
      <Card>
        <ul className="divide-y divide-white/10">
          {faculty.map((f) => (
            <li key={f._id} className="flex justify-between py-3 text-sm">
              <span className="font-medium">{f.name}</span>
              <span className="text-muted-foreground">{f.email}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
