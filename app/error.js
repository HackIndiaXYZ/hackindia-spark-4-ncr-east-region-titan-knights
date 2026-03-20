'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('AgriSmart Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: '#f5f0e8' }}>
      <div className="text-6xl mb-5">⚠️</div>
      <h2 className="font-serif text-3xl text-forest mb-3">Something went wrong</h2>
      <p className="text-forest-light text-sm mb-2 max-w-sm">
        {error?.message || 'An unexpected error occurred. Your farm data is safe.'}
      </p>
      <p className="text-xs text-forest-light mb-8 font-mono bg-parchment px-3 py-1 rounded-lg">
        {error?.digest || 'Unknown error'}
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl text-forest font-bold text-sm border border-forest/20 bg-white hover:bg-forest/5 transition-all cursor-pointer"
        >
          ← Go Home
        </button>
      </div>
    </div>
  );
}
