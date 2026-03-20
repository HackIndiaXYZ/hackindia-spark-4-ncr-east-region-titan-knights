'use client';
import clsx from 'clsx';

export function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl p-6 border border-[rgba(26,51,40,0.12)] shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }) {
  return (
    <h3 className={clsx('font-serif text-[17px] text-forest', className)}>
      {children}
    </h3>
  );
}
