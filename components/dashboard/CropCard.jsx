'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

// ── Helpers (defined ONCE) ────────────────────────────────────────────────────

function getRiskLevel(confidence) {
  if (confidence >= 72) return 'Low';
  if (confidence >= 58) return 'Medium';
  return 'High';
}

const riskConfig = {
  Low:    { pill: 'bg-green-100 text-green-800', bar: '#3a8a5a', label: 'Low Risk ✓',  labelHi: 'कम जोखिम ✓'    },
  Medium: { pill: 'bg-amber-100 text-amber-800', bar: '#c4892a', label: 'Medium Risk',  labelHi: 'मध्यम जोखिम'  },
  High:   { pill: 'bg-red-100 text-red-700',     bar: '#c94040', label: 'High Risk ⚠', labelHi: 'अधिक जोखिम ⚠' },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function CropCard({ crop, newsSignals = [] }) {
  const router = useRouter();
  const { lang } = useStore();
  const t = useTranslation(lang);
  const [expanded, setExpanded] = useState(false);

  const riskLevel = getRiskLevel(crop.confidence);
  const rc        = riskConfig[riskLevel];

  const name   = lang === 'hi' ? (crop.nameHi || crop.name) : crop.name;
  const season = lang === 'hi' ? (crop.seasonHi || crop.season) : crop.season;
  const signal = newsSignals.find(
    s => s.crop?.toLowerCase() === crop.name?.toLowerCase()
  );

  const profitFormatted = `₹${crop.baseProfit?.toLocaleString('en-IN')}`;
  const goToDetail = () => router.push(`/crop/${crop.id}`);

  return (
    <div
      className={`relative rounded-2xl border-[1.5px] transition-all duration-250 overflow-hidden cursor-pointer group ${
        crop.topPick
          ? 'border-sage bg-white shadow-lg hover:shadow-xl hover:-translate-y-1'
          : 'border-[rgba(26,51,40,0.12)] bg-cream hover:border-sage hover:bg-white hover:shadow-md hover:-translate-y-0.5'
      }`}
      onClick={goToDetail}
    >
      {/* Top pick banner */}
      {crop.topPick && (
        <div className="bg-forest text-gold text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 text-center">
          ⭐ {lang==='hi'?'सबसे अच्छी सिफारिश':lang==='ta'?'உங்கள் வயலுக்கான சிறந்த பரிந்துரை':lang==='te'?'మీ పొలానికి అగ్ర సిఫార్సు':'Top Recommendation for Your Farm'}
        </div>
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{crop.icon}</span>
            <div>
              <div className="font-serif text-[18px] text-forest leading-tight">{name}</div>
              <div className="text-[11px] text-forest-light">{season}</div>
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full flex-shrink-0 ${rc.pill}`}>
            {lang==='hi'?rc.labelHi:rc.label}
          </span>
        </div>

        {/* Profit box */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
          <div className="text-[11px] text-green-700 font-medium mb-0.5">
            {lang==='hi'?'अनुमानित लाभ इस सीज़न':lang==='ta'?'இந்த பருவத்தில் எதிர்பார்க்கப்படும் இலாபம்':lang==='te'?'ఈ సీజన్‌లో అంచనా లాభం':'Expected profit this season'}
          </div>
          <div className="font-mono font-bold text-green-800 text-xl">{profitFormatted}</div>
          {crop.msp && (
            <div className="text-[10px] text-green-600 mt-0.5">
              MSP: ₹{crop.msp.toLocaleString('en-IN')}/qtl {lang==='hi'?'(सरकारी न्यूनतम)':lang==='ta'?'(அரசு தரம்)':lang==='te'?'(ప్రభుత్వ తరలు)':'(govt. floor)'}
            </div>
          )}
        </div>

        {/* Confidence bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-forest-light font-medium">{lang==='hi'?'AI विश्वसनीयता':lang==='ta'?'AI நம்பகத்தன்மை':lang==='te'?'AI విశ్వసనీయత':'AI Confidence'}</span>
            <span className="font-bold text-forest">{crop.confidence}%</span>
          </div>
          <div className="h-2 bg-parchment rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-sage transition-all duration-1000"
              style={{ width: `${crop.confidence}%` }}
            />
          </div>
        </div>

        {/* Plain-language explanation */}
        {crop.explanation && (
          <div className="text-[11px] leading-relaxed text-forest-mid bg-[rgba(74,138,114,0.06)] border border-[rgba(74,138,114,0.15)] rounded-lg px-3 py-2 mb-3">
            💡 {crop.explanation}
          </div>
        )}

        {/* News / market signal */}
        {signal && (
          <div className={`text-[10px] leading-relaxed rounded-lg px-3 py-2 mb-3 ${
            signal.impact === 'positive' ? 'bg-green-50 text-green-800'
            : signal.impact === 'negative' ? 'bg-red-50 text-red-700'
            : 'bg-amber-50 text-amber-800'
          }`}>
            📰 {lang==='hi'?'बाज़ार संकेत':lang==='ta'?'சந்தை சமிக்ஞை':lang==='te'?'మార్కెట్ సంకేతం':'Market signal'}: {signal.reason}
          </div>
        )}

        {/* CTA row */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
            className="flex-1 text-[11px] text-sage font-medium bg-transparent border border-sage/20 rounded-lg py-1.5 hover:bg-sage/5 hover:border-sage/40 transition-all cursor-pointer flex items-center justify-center gap-1"
          >
            {expanded ? '▲' : '▼'} {lang==='hi'?'स्कोर':lang==='ta'?'மதிப்பெண்கள்':lang==='te'?'స్కోర్లు':'Scores'}
          </button>
          <button
            onClick={goToDetail}
            className="flex-1 text-[11px] text-white font-semibold rounded-lg py-1.5 flex items-center justify-center gap-1 transition-all hover:opacity-90 border-none cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #1a3328, #2d6650)' }}
          >
            {lang==='hi'?'पूरी जानकारी →':lang==='ta'?'முழு பகுப்பாய்வு →':lang==='te'?'పూర్తి విశ్లేషణ →':'Full Analysis →'}
          </button>
        </div>

        {/* Expanded score breakdown */}
        {expanded && (
          <div
            className="mt-3 space-y-2 border-t border-[rgba(26,51,40,0.08)] pt-3"
            onClick={e => e.stopPropagation()}
          >
            {[
              { label: lang==='hi'?'मौसम मिलान':lang==='ta'?'வானிலை பொருத்தம்':lang==='te'?'వాతావరణ సరిపోలిక':'Weather match', val: crop.scores?.weather ?? 0, color: '#4a8a72' },
              { label: lang==='hi'?'जोखिम स्कोर':lang==='ta'?'ஆபத்து மதிப்பெண்':lang==='te'?'రిస్క్ స్కోర్':'Risk score',    val: crop.scores?.risk    ?? 0, color: rc.bar   },
              { label: lang==='hi'?'बाज़ार स्कोर':lang==='ta'?'சந்தை மதிப்பெண்':lang==='te'?'మార్కెట్ స్కోర్':'Market score',  val: crop.scores?.market  ?? 0, color: '#4a7cb8' },
              { label: lang==='hi'?'पानी मिलान':lang==='ta'?'நீர் பொருத்தம்':lang==='te'?'నీటి సరిపోలిక':'Water match',   val: crop.scores?.water   ?? 0, color: '#5a9ab8' },
            ].map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-forest-light">{label}</span>
                  <span className="font-bold text-forest">{val}%</span>
                </div>
                <div className="h-1.5 bg-parchment rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val}%`, background: color, transition: 'width 0.8s ease' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-[10px] font-semibold text-forest-light bg-white/90 px-3 py-1 rounded-full shadow-sm">
          {lang==='hi'?'पूरी जानकारी के लिए क्लिक करें':lang==='ta'?'முழு பகுப்பாய்வுக்கு கிளிக் செய்யுங்கள்':lang==='te'?'పూర్తి విశ్లేషణ కోసం క్లిక్ చేయండి':'Click for full market analysis'}
        </div>
      </div>
    </div>
  );
}
