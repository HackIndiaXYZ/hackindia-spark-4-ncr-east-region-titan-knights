'use client';
import clsx from 'clsx';

export function Button({ children, variant = 'primary', size = 'md', className, disabled, ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer border-none outline-none font-sans';

  const variants = {
    primary: 'bg-forest text-white rounded-xl hover:-translate-y-px hover:shadow-lg hover:shadow-forest/30 active:translate-y-0',
    amber:   'bg-amber text-white rounded-xl hover:bg-amber-600 hover:-translate-y-px hover:shadow-lg hover:shadow-amber/35',
    outline: 'bg-transparent text-forest border-2 border-forest rounded-xl hover:bg-forest hover:text-white',
    danger:  'bg-red-600 text-white rounded-lg hover:bg-red-700',
    success: 'bg-green-700 text-white rounded-lg hover:bg-green-800',
    ghost:   'bg-transparent text-forest-light hover:text-forest',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], disabled && 'opacity-40 cursor-not-allowed pointer-events-none', className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
