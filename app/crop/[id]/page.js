'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Nav } from '@/components/ui/Nav';
import { Skeleton } from '@/components/ui/Skeleton';
import { useTranslation } from '@/lib/translations';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

// ── helpers ───────────────────────────────────────────────────────────────────

function getRiskLevel(confidence) {
  if (confidence >= 72) return 'Low';
  if (confidence >= 58) return 'Medium';
  return 'High';
}

const riskStyles = {
  Low:    { bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800',  dot: 'bg-green-500' },
  Medium: { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-800',  dot: 'bg-amber-500' },
  High:   { bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',    dot: 'bg-red-500' },
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[rgba(26,51,40,0.10)] shadow-sm">
      <div className="text-xs font-medium text-forest-light mb-1">{label}</div>
      <div className="font-serif text-2xl font-bold" style={{ color: accent || '#1a3328' }}>{value}</div>
      {sub && <div className="text-xs text-forest-light mt-1">{sub}</div>}
    </div>
  );
}

function Section({ title, icon, children, id }) {
  return (
    <div id={id} className="bg-white rounded-2xl border border-[rgba(26,51,40,0.10)] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(26,51,40,0.07)]"
        style={{ background: 'linear-gradient(135deg, rgba(26,51,40,0.03), transparent)' }}>
        <span className="text-xl">{icon}</span>
        <h2 className="font-serif text-lg text-forest">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ── TTS Button ─────────────────────────────────────────────────────────────── 
// Route returns either: audio/mpeg blob  OR  JSON { fallback, text, bcp47 }
function TTSButton({ text, lang, t }) {
  const [state, setState] = useState('idle');
  const audioRef   = useRef(null);
  const blobUrlRef = useRef(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current)   { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null; }
    if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
    setState('idle');
  }, []);

  const speak = useCallback(async () => {
    if (!text?.trim()) return;
    stop();
    setState('loading');

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 3000), lang }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type') || '';

      if (contentType.includes('audio')) {
        // ── Got real audio from OpenAI TTS ──────────────────────────────────
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onplay  = () => setState('playing');
        audio.onended = () => stop();
        audio.onerror = () => { stop(); setState('error'); };
        await audio.play();

      } else {
        // ── Fallback: use browser Web Speech API ─────────────────────────────
        const { fallback, text: spokenText, bcp47 } = await res.json();
        if (!spokenText) { setState('error'); return; }

        const utter = new SpeechSynthesisUtterance(spokenText);
        utter.lang  = bcp47 || 'en-IN';
        utter.rate  = 0.88;
        utter.pitch = 1;

        // Try to find a matching voice
        const voices = window.speechSynthesis.getVoices();
        const langCode = bcp47?.split('-')[0];
        const match = voices.find(v => v.lang === bcp47)
                   || voices.find(v => v.lang.startsWith(langCode))
                   || null;
        if (match) utter.voice = match;

        utter.onstart = () => setState('playing');
        utter.onend   = () => setState('idle');
        utter.onerror = () => setState('idle');
        window.speechSynthesis.speak(utter);
      }

    } catch (err) {
      console.error('[TTS]', err.message);
      stop();
      setState('error');
    }
  }, [text, lang, stop]);

  useEffect(() => () => stop(), [stop]);

  const busy = state === 'loading' || state === 'playing';

  return (
    <button
      onClick={busy ? stop : speak}
      disabled={state === 'loading'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none ${
        state === 'playing' ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' :
        state === 'loading' ? 'bg-sage/5 border-sage/20 text-sage/50 cursor-wait' :
        state === 'error'   ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' :
        'bg-sage/10 border-sage/25 text-sage hover:bg-sage/20'
      }`}
    >
      {state === 'loading' ? (
        <><span className="w-3 h-3 border-2 border-sage/30 border-t-sage rounded-full animate-spin"/><span>{t('cd_speak')}</span></>
      ) : state === 'playing' ? (
        <>
          <span className="flex gap-[2px] items-end" style={{height:12}}>
            {[8,12,6,10].map((h,i) => (
              <span key={i} style={{display:'inline-block',width:2,height:h,background:'#ef4444',
                borderRadius:2,animation:'sarvamBar 0.5s ease-in-out infinite alternate',
                animationDelay:`${i*0.12}s`,transformOrigin:'bottom'}}/>
            ))}
          </span>
          <span>{t('cd_stop')}</span>
        </>
      ) : state === 'error' ? (
        <><span>⚠</span><span>{t('cd_speak')}</span></>
      ) : (
        <><span>🔊</span><span>{t('cd_speak')}</span></>
      )}
    </button>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────────────

export default function CropDetailPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { lang, userData, weather, crops, newsInsights } = useStore();
  const t = useTranslation(lang);

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [aiTab,   setAiTab]   = useState('analysis');

  // Re-fetch when lang changes so AI text is in the right language
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch('/api/crop-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cropId:   id,
        weather,
        userData,
        allCrops: crops,
        lang,
      }),
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, [id, lang]);

  if (loading) return <LoadingSkeleton t={t} />;
  if (error || !data) return <ErrorState error={error} router={router} t={t} />;

  const { crop, marketRates, subsidies, whyBetter, risks, negotiationTips, inputCosts, yieldPerAcre, aiInsights } = data;

  // Localised crop name — use nameHi for hi, otherwise name
  const cropName   = lang === 'hi' ? (crop.nameHi   || crop.name)   : crop.name;
  const cropSeason = lang === 'hi' ? (crop.seasonHi || crop.season)  : crop.season;
  const riskLevel  = getRiskLevel(crop.confidence || 70);
  const rs         = riskStyles[riskLevel];

  const rank       = crops.findIndex(c => c.id === id) + 1;
  const totalCrops = crops.length;

  const radarData = [
    { subject: t('c_weather').split(' ')[0], A: crop.scores?.weather ?? 70 },
    { subject: t('cd_risk'),                  A: crop.scores?.risk    ?? 65 },
    { subject: 'Market',                      A: crop.scores?.market  ?? 68 },
    { subject: 'Water',                       A: crop.scores?.water   ?? 72 },
    { subject: t('cd_profit'),                A: crop.scores?.profit  ?? 75 },
  ];

  const trendColor  = marketRates.trend === 'rising' ? '#3a8a5a' : marketRates.trend === 'falling' ? '#c94040' : '#c4892a';
  const trendIcon   = marketRates.trend === 'rising' ? '↑' : marketRates.trend === 'falling' ? '↓' : '→';
  const trendLabel  = marketRates.trend === 'rising' ? t('cd_rising') : marketRates.trend === 'falling' ? t('cd_falling') : t('cd_stable');

  const costRows = [
    { l: t('cd_seed'),    v: inputCosts.seed },
    { l: t('cd_fert'),    v: inputCosts.fertilizer },
    { l: t('cd_irr'),     v: inputCosts.irrigation },
    { l: t('cd_pest'),    v: inputCosts.pesticide },
    { l: t('cd_harvest'), v: inputCosts.harvest },
  ];

  const acresCnt = parseFloat(userData?.landSize || 5);

  // Build TTS texts — works with or without AI insights
  const whyBetterText = (lang === 'hi' ? whyBetter.hi : whyBetter.en).join('. ');
  const risksText     = (lang === 'hi' ? risks.hi : risks.en).join('. ');
  const cropSummaryText = [
    crop.explanation,
    whyBetterText,
    risksText,
  ].filter(Boolean).join('. ');

  const ttsTexts = {
    analysis:   aiInsights
      ? [aiInsights.deepAnalysis, ...(aiInsights.topAdvice || [])].join(' ')
      : cropSummaryText,
    market:     aiInsights
      ? [aiInsights.marketOutlook, aiInsights.bestTimeToSell].filter(Boolean).join(' ')
      : `${lang === 'hi' ? negotiationTips.hi : negotiationTips.en}`,
    weather:    aiInsights?.weatherFitExplanation || '',
    comparison: aiInsights?.comparisonInsight || whyBetterText,
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16">

        {/* ── HERO HEADER ──────────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-6 md:px-10 py-10 pb-14"
          style={{ background: 'linear-gradient(135deg, #1a3328 0%, #2d6650 100%)' }}>
          <div className="absolute w-96 h-96 rounded-full border-[50px] border-white/[0.03] -top-32 -right-16 pointer-events-none" />

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 text-sm mb-6 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            ← {t('cd_back')}
          </button>

          <div className="max-w-6xl mx-auto flex flex-wrap gap-6 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${rs.bg} ${rs.text} ${rs.border} border`}>
                  {riskLevel} {t('cd_risk')}
                </span>
                {rank > 0 && (
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                    #{rank} {t('cd_of')} {totalCrops} {t('cd_crops')}
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-white/10 text-white/70 border border-white/15">
                  {cropSeason}
                </span>
              </div>

              <h1 className="font-serif text-4xl md:text-5xl text-white mb-2">
                {crop.icon} {cropName}
              </h1>
              <p className="text-white/55 text-base mb-5">
                {lang === 'hi' ? (crop.detailHi || crop.detail) : crop.detail}
              </p>

              {crop.explanation && (
                <div className="inline-flex items-start gap-2 bg-white/[0.07] border border-white/[0.12] px-4 py-3 rounded-xl text-sm text-white/80 max-w-xl">
                  💡 {crop.explanation}
                </div>
              )}

              {/* TTS — always visible in hero */}
              <div className="mt-4">
                <TTSButton text={cropSummaryText} lang={lang} t={t} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 min-w-[280px]">
              {[
                { l: t('cd_profit_acre'),  v: `₹${crop.baseProfit?.toLocaleString('en-IN')}`,                   accent: '#f0c060' },
                { l: t('cd_confidence'),   v: `${crop.confidence || 70}%`,                                       accent: '#a8d5c2' },
                { l: t('cd_mandi'),        v: `₹${marketRates.currentMandi?.toLocaleString('en-IN')}/qtl`,       accent: '#ffffff' },
                { l: t('cd_trend'),        v: `${trendIcon} ${Math.abs(marketRates.trendPct)}%`,                 accent: trendColor },
              ].map(({ l, v, accent }) => (
                <div key={l} className="bg-white/[0.08] border border-white/[0.10] rounded-xl p-4">
                  <div className="text-[10px] text-white/45 mb-1">{l}</div>
                  <div className="font-serif text-xl font-bold" style={{ color: accent }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Jump nav */}
          <div className="max-w-6xl mx-auto mt-8 flex gap-2 flex-wrap">
            {[
              ['market-section',  `📊 ${t('cd_market_title').split(' ')[0]}`],
              ['compare-section', `⚖️ ${t('cd_compare_title').split(' ')[0]}`],
              ['subsidy-section', `🏛️ ${t('cd_subsidy_title').split(' ')[0]}`],
              ['cost-section',    `💰 ${t('cd_cost_title').split(' ')[0]}`],
              ['ai-section',      `🤖 AI`],
            ].map(([sec, label]) => (
              <button key={sec}
                onClick={() => document.getElementById(sec)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[11px] font-semibold text-white/70 bg-white/[0.08] border border-white/[0.12] px-3 py-1.5 rounded-full hover:bg-white/[0.14] hover:text-white transition-all cursor-pointer">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-6 space-y-5">

          {/* MARKET RATES */}
          <Section id="market-section" icon="📊" title={t('cd_market_title')}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {marketRates.msp && (
                <StatCard
                  label={t('cd_msp_label')}
                  value={`₹${marketRates.msp.toLocaleString('en-IN')}`}
                  sub={t('cd_msp_sub')}
                  accent="#3a8a5a"
                />
              )}
              <StatCard label={t('cd_mandi')} value={`₹${marketRates.currentMandi?.toLocaleString('en-IN')}`} sub={t('cd_mandi_sub')} accent="#1a3328" />
              <StatCard label={t('cd_last_month')} value={`₹${marketRates.lastMonthMandi?.toLocaleString('en-IN')}`} sub={t('cd_mandi_sub')} accent="#6b8c7a" />
              <div className="bg-white rounded-2xl p-5 border border-[rgba(26,51,40,0.10)] shadow-sm">
                <div className="text-xs font-medium text-forest-light mb-1">{t('cd_price_trend')}</div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold" style={{ color: trendColor }}>
                    {trendIcon} {Math.abs(marketRates.trendPct)}%
                  </span>
                </div>
                <div className="text-xs mt-1" style={{ color: trendColor }}>{trendLabel}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-forest mb-3">{t('cd_price_history')}</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketRates.priceHistory}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4a8a72" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4a8a72" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b8c7a' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b8c7a' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v.toLocaleString('en-IN')}`} domain={['auto', 'auto']} />
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}/qtl`, 'Price']} contentStyle={{ borderRadius: 10, border: '1px solid rgba(26,51,40,0.12)', fontSize: 12 }} />
                    <Area type="monotone" dataKey="price" stroke="#4a8a72" strokeWidth={2.5} fill="url(#priceGrad)" dot={{ fill: '#4a8a72', strokeWidth: 0, r: 3 }} activeDot={{ r: 5, fill: '#1a3328' }} />
                    {marketRates.msp && (
                      <Area type="monotone" dataKey={() => marketRates.msp} stroke="#c4892a" strokeWidth={1.5} strokeDasharray="5 4" fill="none" dot={false} name="MSP" />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {marketRates.msp && (
                <p className="text-[11px] text-forest-light mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-8 h-0.5" style={{ border: '1px dashed #c4892a' }} />
                  {t('cd_msp_line')}
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-forest mb-3">{t('cd_top_mandis')}</h3>
              <div className="space-y-2">
                {marketRates.topMandis.map((m, i) => (
                  <div key={m.name} className="flex items-center justify-between p-3 rounded-xl bg-cream border border-[rgba(26,51,40,0.08)]">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-sm font-medium text-forest">{m.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-green-700 text-sm">₹{m.price.toLocaleString('en-IN')}/qtl</div>
                      {marketRates.msp && (
                        <div className="text-[10px] text-forest-light">
                          {m.price > marketRates.msp
                            ? `+₹${(m.price - marketRates.msp).toLocaleString('en-IN')} ${t('cd_above_msp')}`
                            : `₹${(marketRates.msp - m.price).toLocaleString('en-IN')} ${t('cd_below_msp')}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{ background: 'rgba(74,138,114,0.06)', borderColor: 'rgba(74,138,114,0.2)' }}>
              <div className="text-xs font-bold text-sage mb-2">🗓 {t('cd_best_time')}</div>
              <div className="flex gap-2 flex-wrap mb-2">
                {marketRates.bestSellMonths.map(m => (
                  <span key={m} className="text-xs font-bold px-3 py-1 bg-sage text-white rounded-full">{m}</span>
                ))}
              </div>
              <p className="text-xs text-forest-mid leading-relaxed">{lang === 'hi' ? negotiationTips.hi : negotiationTips.en}</p>
            </div>
          </Section>

          {/* COMPARISON */}
          <Section id="compare-section" icon="⚖️" title={t('cd_compare_title')}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-64 h-56 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(26,51,40,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b8c7a' }} />
                    <Radar dataKey="A" stroke="#4a8a72" fill="#4a8a72" fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 w-full">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[rgba(26,51,40,0.08)]">
                        <th className="text-left py-2 pr-4 font-semibold text-forest-light">{t('cd_crop')}</th>
                        <th className="text-right py-2 px-3 font-semibold text-forest-light">{t('cd_profit')}</th>
                        <th className="text-right py-2 px-3 font-semibold text-forest-light">{t('cd_conf_col')}</th>
                        <th className="text-right py-2 pl-3 font-semibold text-forest-light">{t('cd_risk_col')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {crops.map((c, i) => {
                        const isThis = c.id === id;
                        const rl = getRiskLevel(c.confidence);
                        return (
                          <tr key={c.id}
                            onClick={() => !isThis && router.push(`/crop/${c.id}`)}
                            className={`border-b border-[rgba(26,51,40,0.05)] transition-colors ${isThis ? 'bg-sage/8' : 'hover:bg-cream cursor-pointer'}`}>
                            <td className="py-2.5 pr-4">
                              <div className="flex items-center gap-2">
                                <span>{c.icon}</span>
                                <span className={`font-medium ${isThis ? 'text-forest font-bold' : 'text-forest-light'}`}>
                                  {lang === 'hi' ? (c.nameHi || c.name) : c.name}
                                  {isThis && <span className="ml-1.5 text-[9px] bg-sage text-white px-1.5 py-0.5 rounded-full">✓</span>}
                                </span>
                              </div>
                            </td>
                            <td className="text-right py-2.5 px-3 font-mono text-forest">₹{c.baseProfit?.toLocaleString('en-IN')}</td>
                            <td className="text-right py-2.5 px-3"><span className={`font-bold ${isThis ? 'text-sage' : 'text-forest-light'}`}>{c.confidence}%</span></td>
                            <td className="text-right py-2.5 pl-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rl === 'Low' ? 'bg-green-100 text-green-800' : rl === 'Medium' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'}`}>{rl}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-forest-light mt-3">{t('cd_click_crop')}</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <h3 className="text-sm font-semibold text-forest mb-3">✅ {t('cd_why_better')}</h3>
              {(lang === 'hi' ? whyBetter.hi : whyBetter.en).map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-sm text-green-800 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-forest mb-3">⚠️ {t('cd_risks')}</h3>
              {(lang === 'hi' ? risks.hi : risks.en).map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <span className="text-amber-600 font-bold flex-shrink-0 mt-0.5">⚠</span>
                  <span className="text-sm text-amber-800 leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* SUBSIDIES */}
          <Section id="subsidy-section" icon="🏛️" title={t('cd_subsidy_title')}>
            <p className="text-sm text-forest-light mb-5 leading-relaxed">{t('cd_subsidy_sub')}</p>
            <div className="space-y-4">
              {subsidies.map((s, i) => (
                <div key={i} className="p-5 rounded-2xl border border-[rgba(26,51,40,0.10)] bg-[rgba(26,51,40,0.02)]">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <h4 className="font-semibold text-forest text-sm mb-1">{lang === 'hi' ? s.schemeHi : s.scheme}</h4>
                      <div className="text-xs text-forest-light mb-2">{lang === 'hi' ? `पात्रता: ${s.eligibilityHi}` : `Eligibility: ${s.eligibility}`}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-green-700 text-sm">{lang === 'hi' ? s.amountHi : s.amount}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-sage hover:text-forest transition-colors no-underline">{t('cd_apply')}</a>
                    <span className="text-forest-light text-[11px]">·</span>
                    <a href="https://agricoop.nic.in" target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold text-sage hover:text-forest transition-colors no-underline">{t('cd_learn')}</a>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl bg-forest text-white flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="font-semibold text-sm mb-0.5">{t('cd_enam')}</div>
                <div className="text-white/60 text-xs">{t('cd_enam_sub')}</div>
              </div>
              <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl text-forest font-bold text-xs no-underline flex-shrink-0 transition-all hover:-translate-y-0.5"
                style={{ background: '#f0c060' }}>
                enam.gov.in ↗
              </a>
            </div>
          </Section>

          {/* COST BREAKDOWN */}
          <Section id="cost-section" icon="💰" title={t('cd_cost_title')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-forest mb-3">{t('cd_input_costs')}</h3>
                <div className="space-y-2">
                  {costRows.map(({ l, v }) => (
                    <div key={l} className="flex items-center gap-3">
                      <span className="text-xs text-forest-light w-28 flex-shrink-0">{l}</span>
                      <div className="flex-1 h-2 bg-parchment rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-forest/30" style={{ width: `${(v / inputCosts.total) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-forest w-20 text-right flex-shrink-0">₹{v.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 pt-2 border-t border-[rgba(26,51,40,0.1)] mt-2">
                    <span className="text-xs font-bold text-forest w-28">{t('cd_total_cost')}</span>
                    <div className="flex-1" />
                    <span className="text-sm font-mono font-bold text-red-600 w-20 text-right">₹{inputCosts.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-forest mb-3">{t('cd_profit_est')} ({acresCnt} acres)</h3>
                <div className="space-y-3">
                  {[
                    { l: t('cd_yield'),  v: `${yieldPerAcre.avg} ${yieldPerAcre.unit}/acre`, accent: '#1a3328' },
                    { l: t('cd_mandi'), v: `₹${marketRates.currentMandi?.toLocaleString('en-IN')}/qtl`, accent: '#1a3328' },
                    { l: t('cd_gross'), v: `₹${(yieldPerAcre.avg * marketRates.currentMandi * acresCnt).toLocaleString('en-IN')}`, accent: '#1a3328' },
                    { l: t('cd_total_cost'), v: `– ₹${(inputCosts.total * acresCnt).toLocaleString('en-IN')}`, accent: '#c94040' },
                  ].map(({ l, v, accent }) => (
                    <div key={l} className="flex justify-between items-center py-2 border-b border-[rgba(26,51,40,0.06)]">
                      <span className="text-xs text-forest-light">{l}</span>
                      <span className="text-sm font-mono font-bold" style={{ color: accent }}>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-forest">{t('cd_net')}</span>
                    <span className="text-xl font-mono font-bold text-green-700">
                      ₹{Math.round((yieldPerAcre.avg * marketRates.currentMandi - inputCosts.total) * acresCnt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[10px] text-forest-light mt-1">
                    * {t('cd_yield_range')} {yieldPerAcre.min}–{yieldPerAcre.max} {yieldPerAcre.unit}/acre
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* AI ANALYSIS */}
          <Section id="ai-section" icon="🤖" title={t('cd_ai_title')}>
            {!aiInsights ? (
              <div className="text-center py-8">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="font-serif text-lg text-forest mb-2">{t('cd_no_ai')}</h3>
                <p className="text-sm text-forest-light mb-4 max-w-sm mx-auto">{t('cd_no_ai_sub')}</p>
                <code className="text-xs bg-parchment px-3 py-1 rounded-lg font-mono text-forest">OPENROUTER_KEY=your_key_here</code>
                {/* TTS still works using static crop data */}
                <div className="mt-5 pt-5 border-t border-[rgba(26,51,40,0.08)]">
                  <p className="text-xs text-forest-light mb-3">
                    {lang === 'hi' ? 'फसल की जानकारी सुनें:' :
                     lang === 'ta' ? 'பயிர் தகவலை கேளுங்கள்:' :
                     lang === 'te' ? 'పంట సమాచారం వినండి:' :
                     'Listen to crop summary:'}
                  </p>
                  <TTSButton text={cropSummaryText} lang={lang} t={t} />
                </div>
              </div>
            ) : (
              <>
                {/* Tab switcher */}
                <div className="flex gap-1 mb-4 p-1 bg-parchment rounded-xl">
                  {[
                    ['analysis',   t('cd_ai_tab1')],
                    ['market',     t('cd_ai_tab2')],
                    ['weather',    t('cd_ai_tab3')],
                    ['comparison', t('cd_ai_tab4')],
                  ].map(([key, label]) => (
                    <button key={key} onClick={() => setAiTab(key)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                        aiTab === key ? 'bg-forest text-white shadow-sm' : 'bg-transparent text-forest-light hover:text-forest'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>

                {/* TTS button row */}
                <div className="flex justify-end mb-4">
                  <TTSButton text={ttsTexts[aiTab]} lang={lang} t={t} />
                </div>

                {/* Tab content */}
                <div className="prose prose-sm max-w-none">
                  {aiTab === 'analysis' && (
                    <div className="space-y-3">
                      <p className="text-sm text-forest leading-relaxed">{aiInsights.deepAnalysis}</p>
                      {aiInsights.topAdvice && (
                        <div className="mt-4">
                          <h4 className="font-bold text-forest text-sm mb-3">{t('cd_top_advice')}</h4>
                          <div className="space-y-2">
                            {aiInsights.topAdvice.map((a, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-sage/6 border border-sage/15 rounded-xl">
                                <span className="w-5 h-5 rounded-full bg-sage text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                                <span className="text-sm text-forest leading-relaxed">{a}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {aiTab === 'market' && (
                    <div>
                      <p className="text-sm text-forest leading-relaxed mb-3">{aiInsights.marketOutlook}</p>
                      {aiInsights.bestTimeToSell && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <div className="text-xs font-bold text-green-800 mb-1">🗓 {t('cd_best_sell')}</div>
                          <p className="text-sm text-green-700">{aiInsights.bestTimeToSell}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {aiTab === 'weather' && (
                    <p className="text-sm text-forest leading-relaxed">{aiInsights.weatherFitExplanation}</p>
                  )}
                  {aiTab === 'comparison' && (
                    <p className="text-sm text-forest leading-relaxed">{aiInsights.comparisonInsight}</p>
                  )}
                </div>
              </>
            )}
          </Section>

          {/* Bottom CTA */}
          <div className="flex flex-wrap gap-3 justify-center pb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-forest font-semibold text-sm border border-forest/20 bg-white hover:bg-forest/5 transition-all cursor-pointer"
            >
              ← {t('cd_view_all')}
            </button>
            <button
              onClick={() => { router.push('/dashboard'); setTimeout(() => document.getElementById('insurance-section')?.scrollIntoView({ behavior: 'smooth' }), 300); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm border-none cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #d4852a, #e8a84e)' }}
            >
              🛡️ {t('cd_activate_ins')}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ── LOADING SKELETON ──────────────────────────────────────────────────────────
function LoadingSkeleton({ t }) {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16">
        <div className="h-72 w-full" style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}>
          <div className="max-w-6xl mx-auto px-10 py-10">
            <div className="h-4 w-32 rounded-full bg-white/10 mb-6" />
            <div className="h-12 w-80 rounded-2xl bg-white/10 mb-4" />
            <div className="h-4 w-64 rounded-full bg-white/10 mb-3" />
            <div className="h-4 w-48 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-10 py-6 space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-[rgba(26,51,40,0.1)]">
              <div className="h-5 w-48 bg-parchment rounded mb-4" style={{ animation: 'shimmer 1.4s infinite' }} />
              <div className="space-y-2">
                {[1,2,3].map(j => <div key={j} className="h-3 bg-parchment rounded" style={{ width: `${100 - j*15}%`, animation: 'shimmer 1.4s infinite' }} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── ERROR STATE ───────────────────────────────────────────────────────────────
function ErrorState({ error, router, t }) {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#f0ece2] pt-16 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🌾</div>
          <h2 className="font-serif text-2xl text-forest mb-3">{t('cd_no_ai')}</h2>
          <p className="text-sm text-forest-light mb-6">{error || 'Unknown error'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
          >
            ← {t('cd_back')}
          </button>
        </div>
      </div>
    </>
  );
}
