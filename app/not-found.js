'use client';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(180deg, #1a3328 0%, #0f2018 100%)' }}>
      <div className="text-7xl mb-6">🌾</div>
      <h1 className="font-serif text-4xl text-white mb-3">Page not found</h1>
      <p className="text-white/50 text-base mb-8 max-w-sm">
        This page doesn't exist. Let's get you back to your farm analysis.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm border border-white/20 bg-white/8 hover:bg-white/15 transition-all cursor-pointer"
        >
          ← Go Home
        </button>
        <button
          onClick={() => router.push('/form')}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}
        >
          🌾 Get Crop Recommendation
        </button>
      </div>
    </div>
  );
}
