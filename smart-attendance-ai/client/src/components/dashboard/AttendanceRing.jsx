import { cn } from '../../lib/utils';

export default function AttendanceRing({ percent = 0, level = 'green', size = 180 }) {
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const strokeColors = {
    green: '#6ee7b7',
    yellow: '#fcd34d',
    red: '#fb7185',
  };

  const glow = {
    green: 'shadow-[0_0_30px_-5px_rgba(110,231,183,0.5)]',
    yellow: 'shadow-[0_0_30px_-5px_rgba(252,211,77,0.5)]',
    red: 'shadow-[0_0_30px_-5px_rgba(251,113,133,0.5)]',
  };

  const badgeStyles = {
    green: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
    yellow: 'border-amber-400/30 bg-amber-500/15 text-amber-200',
    red: 'border-rose-400/35 bg-rose-500/20 text-rose-200',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center rounded-full', glow[level])} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-white/8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColors[level] || strokeColors.green}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-semibold text-gradient">{percent}%</span>
        <span className={cn('mt-2 rounded-full border px-3 py-0.5 text-xs font-semibold capitalize', badgeStyles[level])}>
          {level}
        </span>
      </div>
    </div>
  );
}
