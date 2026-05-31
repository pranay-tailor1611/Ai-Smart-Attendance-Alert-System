import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#f9a8d4', '#c4b5fd', '#fda4af', '#a5b4fc'];

export function TrendLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
        <Legend />
        <Line type="monotone" dataKey="percent" name="Attendance %" stroke="#f9a8d4" strokeWidth={2.5} dot={{ r: 4, fill: '#fbcfe8' }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SubjectBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9a8d4" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
        <YAxis stroke="#94a3b8" domain={[0, 100]} />
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
        <Bar dataKey="percent" name="%" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LevelPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
