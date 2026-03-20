'use client';
import clsx from 'clsx';

const styles = {
  green:  'bg-green-100 text-green-800',
  amber:  'bg-amber-100 text-amber-800',
  red:    'bg-red-100 text-red-700',
  blue:   'bg-blue-100 text-blue-800',
  sage:   'bg-[rgba(74,138,114,0.1)] text-sage',
  forest: 'bg-forest text-gold',
};

export function Badge({ children, color = 'sage', className }) {
  return (
    <span className={clsx(
      'text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full',
      styles[color], className
    )}>
      {children}
    </span>
  );
}

export function RiskPill({ level }) {
  const map = {
    Low:    'bg-green-100 text-green-800',
    Medium: 'bg-amber-100 text-amber-800',
    High:   'bg-red-100 text-red-700',
  };
  return (
    <span className={clsx('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', map[level])}>
      {level}
    </span>
  );
}
