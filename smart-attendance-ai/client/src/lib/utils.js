import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getLevelColor(level) {
  if (level === 'green') return 'text-emerald-400 bg-emerald-500/20';
  if (level === 'yellow') return 'text-amber-400 bg-amber-500/20';
  return 'text-red-400 bg-red-500/20';
}
