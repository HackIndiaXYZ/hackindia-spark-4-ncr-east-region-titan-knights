'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';
import { Nav } from '@/components/ui/Nav';
import { CropCard } from '@/components/dashboard/CropCard';
import { WeatherRiskPanel } from '@/components/dashboard/WeatherRiskPanel';
import { NewsPanel } from '@/components/dashboard/NewsPanel';
import { InsurancePanel, SimulationPanel } from '@/components/dashboard/InsurancePanel';
import { ActivityLog } from '@/components/dashboard/ActivityLog';
import { Badge } from '@/components/ui/Badge';

// Derive risk level directly from confidence score — single source of truth
function getRiskLevel(confidence) {
  if (confidence >= 72) return 'Low';
  if (confidence >= 58) return 'Medium';
  return 'High';
}

function getRiskStyle(level) {
  if (level === 'Low')    return 'bg-green-100 text-green-800';
  if (level === 'Medium') return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-700';
}

export default function DashboardPage() {
  const router = useRouter();
  const { lang, userData, weather, crops, newsInsights, weatherError } = useStore();
  const t  = useTranslation(lang);

  // Track real loading states
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [newsLoading,    setNewsLoading]    = useState(true);

  useEffect(() => {
    if (!userData) { router.replace('/form'); return; }
    // Weather is considered loaded once it appears in store or errors
    if (weather || weatherError) setWeatherLoading(false);
  }, [userData, weather, weatherError]);

  useEffect(() => {
    // News considered loaded once crops arrive (they load together in loading page)
    if (crops.length > 0) setNewsLoading(false);
  }, [crops]);

  if (!userData) return null;

  const topCrop  = crops[0] || null;
  const topName  = topCrop ? (lang === 'hi' ? (topCrop.nameHi || topCrop.name) : topCrop.name) : '—';
  const location = userData.location || '—';
  const acres    = userData.landSize  || '—';

  // Always compute riskLevel fresh from confidence — never trust a stale field
  const topRiskLevel = topCrop ? getRiskLevel(topCrop.confidence) : null;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16">

        {/* Dashboard Header */}
        <div className="relative overflow-hidden px-6 md:px-10 py-8 pb-10"
          style={{ background: 'linear-gradient(135deg, #1a3328 0%, #2d6650 100%)' }}>
          <div className="absolute w-[480px] h-[480px] rounded-full border-[55px] border-white/[0.03] -top-44 -right-20 pointer-events-none" />
          <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4 relative z-10">
            <div>
              <div className="text-[11px] text-white/42 tracking-[2px] uppercase mb-1.5">
                {t('db_lbl')}
              </div>
              <h2 className="font-serif text-2xl text-white mb-1">
                {t('db_title')}
              </h2>
              <p className="text-sm text-white/52 mb-3">
                {t('db_sub')}
              </p>
              <div className="flex gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 bg-white/[0.09] px-3 py-1 rounded-full text-[11px] text-white/78">
                  📍 {location}
                </span>
                <span className="flex items-center gap-1.5 bg-white/[0.09] px-3 py-1 rounded-full text-[11px] text-white/78">
                  📐 {acres} {lang==='hi'?'एकड़':lang==='ta'?'ஏக்கர்':lang==='te'?'ఎకరాలు':'acres'}
                </span>
                {weather && !weatherLoading && (
                  <span className="flex items-center gap-1.5 bg-white/[0.09] px-3 py-1 rounded-full text-[11px] text-white/78">
                    🌡 {weather.currentTemp}°C · {weather.stateName || ''}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/[0.09] px-3 py-1 rounded-full text-[11px] text-gold">
                  ⭐ {lang==='hi'?'लाइव डेटा':lang==='ta'?'நேரடி தரவு':lang==='te'?'నేరుగా డేటా':'Live Data'}
                </span>
              </div>
              {/* Action buttons in header */}
              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => router.push('/form')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold border border-white/20 bg-white/[0.08] hover:bg-white/[0.15] transition-all cursor-pointer"
                >
                  🔄 {lang==='hi'?'नई फसल खोजें':lang==='ta'?'புதிய பயிர் தேடுங்கள்':lang==='te'?'కొత్త పంట వెతకండి':'Search New Crop'}
                </button>
                <button
                  onClick={() => document.getElementById('insurance-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold border-none cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}
                >
                  🛡️ {lang==='hi'?'बीमा सक्रिय करें':lang==='ta'?'காப்பீட்டை செயல்படுத்துங்கள்':lang==='te'?'బీమా యాక్టివేట్ చేయండి':'Activate Insurance'}
                </button>
              </div>
            </div>

            {/* Top recommendation card — updates reactively when crops load */}
            <div className="bg-white/[0.08] border border-white/[0.11] rounded-2xl px-5 py-4 min-w-[190px]">
              <div className="text-[11px] text-white/42 mb-2">
                {t('db_top')}
              </div>

              {topCrop ? (
                <>
                  <div className="font-serif text-2xl text-white mb-1">
                    {topCrop.icon} {topName}
                  </div>
                  <div className="font-mono text-sm text-gold mb-2">
                    ₹{topCrop.baseProfit.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${getRiskStyle(topRiskLevel)}`}>
                      {topRiskLevel} Risk
                    </span>
                    <span className="text-[10px] text-white/50">
                      {topCrop.confidence}% {lang==='hi'?'विश्वसनीय':lang==='ta'?'நம்பகம்':lang==='te'?'నమ్మకం':'conf.'}
                    </span>
                  </div>
                  {/* Mini score bars */}
                  <div className="space-y-1.5">
                    {[
                      [lang==='hi'?'मौसम':lang==='ta'?'வானிலை':lang==='te'?'వాతావరణం':'Weather', topCrop.scores?.weather, '#4a8a72'],
                      [lang==='hi'?'जोखिम':lang==='ta'?'ஆபத்து':lang==='te'?'రిస్క్':'Risk', topCrop.scores?.risk, '#c4892a'],
                      [lang==='hi'?'बाज़ार':lang==='ta'?'சந்தை':lang==='te'?'మార్కెట్':'Market', topCrop.scores?.market, '#4a7cb8'],
                    ].map(([label, val, color]) => val !== undefined && (
                      <div key={label}>
                        <div className="flex justify-between text-[9px] text-white/38 mb-0.5">
                          <span>{label}</span><span>{val}%</span>
                        </div>
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${val}%`, background: color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-white/40 text-sm py-2">{lang==='hi'?'लोड हो रहा है...':lang==='ta'?'ஏற்றுகிறது...':lang==='te'?'లోడ్ అవుతోంది...':'Loading...'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-6 space-y-5">

          {/* Crop Recommendations */}
          <div id="crop-section" className="bg-white rounded-2xl p-6 border border-[rgba(26,51,40,0.12)] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg text-forest">{t('crop_sec')}</h3>
              <div className="flex items-center gap-2">
                <Badge color="green">{t('crop_ai')}</Badge>
                {weather && !weatherError && (
                  <span className="text-[10px] text-sage">↻ live weather</span>
                )}
              </div>
            </div>

            {crops.length === 0 ? (
              <div className="text-sm text-forest-light py-8 text-center">
                Loading recommendations…
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {crops.map(crop => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    newsSignals={newsInsights?.signals || []}
                  />
                ))}
              </div>
            )}

            {weather && !weatherLoading && (
              <div className="mt-4 px-3 py-2 bg-[rgba(74,138,114,0.08)] rounded-lg text-[11px] text-sage">
                ↻ Recommendations updated using live weather · {weather.dataSource}
              </div>
            )}
          </div>

          {/* News + Risk */}
          <div id="risk-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <NewsPanel loading={newsLoading} />
            <WeatherRiskPanel loading={weatherLoading} />
          </div>

          {/* Insurance + Simulation */}
          <div id="insurance-section" className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <InsurancePanel />
            <SimulationPanel />
          </div>

          <ActivityLog />
        </div>
      </div>
    </>
  );
}
