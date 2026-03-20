'use client';
import clsx from 'clsx';

export function Skeleton({ className, height, width }) {
  return (
    <div
      className={clsx('rounded-lg animate-shimmer', className)}
      style={{
        height: height || '14px',
        width:  width  || '100%',
        background: 'linear-gradient(90deg, #e8e0d0 25%, #f0ead8 50%, #e8e0d0 75%)',
        backgroundSize: '400px 100%',
      }}
    />
  );
}
