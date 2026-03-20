'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LangToggle } from './LangToggle';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export function Nav() {
  const router   = useRouter();
  const pathname = usePathname();
  const { lang, user } = useStore();
  const t = useTranslation(lang);
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const isLanding   = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isForm      = pathname === '/form';

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`} style={{ background: 'rgba(245,240,232,0.95)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(26,51,40,0.10)' }}>
        <div className="flex items-center justify-between px-5 md:px-10 py-3.5">

          {/* Logo — always links home */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 font-serif text-xl text-forest border-none bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center text-sm flex-shrink-0">🌱</div>
            <span className="hidden sm:block">AgriSmart</span>
          </button>

          {/* Desktop middle links */}
          <div className="hidden md:flex items-center gap-1">
            {isLanding && (
              <>
                <button onClick={() => scrollTo('how')}
                  className="px-4 py-2 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  {t('nav_how')}
                </button>
                <button onClick={() => scrollTo('benefits')}
                  className="px-4 py-2 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  {t('nav_benefits')}
                </button>
              </>
            )}
            {isDashboard && (
              <>
                <button onClick={() => scrollTo('crop-section')}
                  className="px-3 py-1.5 text-xs font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🌾 {'Crops'}
                </button>
                <button onClick={() => scrollTo('risk-section')}
                  className="px-3 py-1.5 text-xs font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  ⚠️ {'Risk'}
                </button>
                <button onClick={() => scrollTo('insurance-section')}
                  className="px-3 py-1.5 text-xs font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🛡️ {'Insurance'}
                </button>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <LangToggle />

            {/* Profile avatar when logged in */}
            {user && (
              <button
                onClick={() => router.push('/profile')}
                className="w-8 h-8 rounded-full bg-forest flex items-center justify-center text-white text-xs font-bold border-none cursor-pointer hover:bg-sage transition-colors flex-shrink-0"
                title="My Profile"
              >
                {user.phone?.slice(-2) || '👤'}
              </button>
            )}

            {/* Back to home — non-landing pages */}
            {!isLanding && (
              <button
                onClick={() => router.push('/')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-forest border border-forest/20 hover:bg-forest/5 transition-all bg-transparent cursor-pointer"
              >
                ← {t('nav_home')}
              </button>
            )}

            {/* Primary CTA */}
            {isLanding && (
              <button
                onClick={() => router.push('/form')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold border-none cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
              >
                {t('nav_start')}
              </button>
            )}

            {isDashboard && (
              <button
                onClick={() => router.push('/form')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold border-none cursor-pointer transition-all hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}
              >
                🔄 {t('db_top')}
              </button>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden flex flex-col justify-center gap-1 w-8 h-8 bg-transparent border-none cursor-pointer p-1"
              aria-label="Menu"
            >
              <span className={`block h-0.5 bg-forest rounded transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 bg-forest rounded transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-forest rounded transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[rgba(26,51,40,0.08)] px-5 py-3 space-y-1" style={{ background: 'rgba(245,240,232,0.98)' }}>
            {isLanding && (
              <>
                <button onClick={() => scrollTo('how')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  {t('nav_how')}
                </button>
                <button onClick={() => scrollTo('benefits')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  {t('nav_benefits')}
                </button>
                <button onClick={() => router.push('/form')} className="w-full text-left px-3 py-2.5 text-sm font-bold text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🌾 {t('hero_cta')}
                </button>
              </>
            )}
            {isDashboard && (
              <>
                <button onClick={() => scrollTo('crop-section')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🌾 {t('crop_sec')}
                </button>
                <button onClick={() => scrollTo('risk-section')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  ⚠️ {t('risk_sec')}
                </button>
                <button onClick={() => scrollTo('insurance-section')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🛡️ {'Insurance'}
                </button>
                <button onClick={() => router.push('/form')} className="w-full text-left px-3 py-2.5 text-sm font-bold text-amber hover:bg-amber/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                  🔄 {t('db_top')}
                </button>
              </>
            )}
            {!isLanding && (
              <button onClick={() => router.push('/')} className="w-full text-left px-3 py-2.5 text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 rounded-lg transition-all bg-transparent border-none cursor-pointer">
                ← {t('nav_home')}
              </button>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
