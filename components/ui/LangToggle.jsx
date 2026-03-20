'use client';
import { useEffect } from 'react';
import { useStore } from '@/lib/store';

const LANGS = [
  { code: 'en', label: 'EN',  font: null },
  { code: 'hi', label: 'हिं', font: "'Noto Sans Devanagari', sans-serif" },
  { code: 'ta', label: 'தமி', font: "'Noto Sans Tamil', sans-serif" },
  { code: 'te', label: 'తెలు', font: "'Noto Sans Telugu', sans-serif" },
];

export function LangToggle() {
  const { lang, setLang } = useStore();

  useEffect(() => {
    document.body.classList.toggle('lang-hi', lang === 'hi');
    document.body.classList.toggle('lang-ta', lang === 'ta');
    document.body.classList.toggle('lang-te', lang === 'te');
  }, [lang]);

  return (
    <div className="flex items-center bg-parchment rounded-full p-0.5 gap-0.5 border border-[rgba(26,51,40,0.12)]">
      {LANGS.map(({ code, label, font }) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          style={font ? { fontFamily: font } : {}}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 border-none cursor-pointer ${
            lang === code
              ? 'bg-forest text-white shadow-md'
              : 'bg-transparent text-forest-light hover:text-forest'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
