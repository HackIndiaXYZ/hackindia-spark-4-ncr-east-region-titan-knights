'use client';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

const FALLBACK_NEWS = [
  { title: 'Wheat export demand surging — India exports up 34% YoY due to global supply shortage', source: 'AgriMarkets India', dot: 'green', ago: '2h ago', url: 'https://economictimes.indiatimes.com/agriculture', impact: 'Price likely to rise ↑' },
  { title: 'IMD forecast: Below-normal monsoon in Central India this Kharif season (June–Sept)', source: 'IMD Bulletin', dot: 'red', ago: '5h ago', url: 'https://mausam.imd.gov.in', impact: 'Drought risk rising ↑' },
  { title: 'Rice production alert: La Niña drought conditions affecting Punjab & Haryana by 18%', source: 'ICAR Report', dot: 'red', ago: '1d ago', url: 'https://icar.org.in', impact: 'Yield risk for rice ↑' },
  { title: 'Pulse MSP raised ₹400/quintal — chickpea and lentil farmers benefit from new floor prices', source: 'Ministry of Agriculture', dot: 'green', ago: '2d ago', url: 'https://agricoop.nic.in', impact: 'Better floor price ↑' },
  { title: 'Fertilizer prices stable after global supply chains normalize — input costs flat', source: 'FICCI AgriData', dot: 'amber', ago: '3d ago', url: 'https://ficci.in', impact: 'Input costs stable →' },
];
const dotColors   = { green:'bg-green-500', amber:'bg-amber-400', red:'bg-red-500' };
const impactColors= { green:'text-green-700 bg-green-50', amber:'text-amber-700 bg-amber-50', red:'text-red-600 bg-red-50' };

const TX = {
  title:   { en:'📰 Market & Weather News', hi:'📰 बाज़ार और मौसम समाचार', ta:'📰 சந்தை & வானிலை செய்திகள்', te:'📰 మార్కెట్ & వాతావరణ వార్తలు' },
  live:    { en:'Live', hi:'लाइव', ta:'நேரடி', te:'నేరుగా' },
  sample:  { en:'Sample', hi:'नमूना', ta:'மாதிரி', te:'నమూనా' },
  aiSum:   { en:'AI Market Summary:', hi:'AI बाज़ार सारांश:', ta:'AI சந்தை சுருக்கம்:', te:'AI మార్కెట్ సారాంశం:' },
  loading: { en:'Loading live agriculture news...', hi:'लाइव समाचार लोड हो रहे हैं...', ta:'நேரடி செய்திகளை ஏற்றுகிறோம்...', te:'నేరుగా వార్తలు లోడ్ అవుతున్నాయి...' },
  err:     { en:'Could not load live news. Showing sample headlines.', hi:'लाइव समाचार लोड नहीं हो सके। नमूना समाचार दिखाए जा रहे हैं।', ta:'நேரடி செய்திகளை ஏற்ற முடியவில்லை. மாதிரி தலைப்புகள் காட்டப்படுகின்றன.', te:'నేరుగా వార్తలు లోడ్ చేయలేదు. నమూనా శీర్షికలు చూపబడుతున్నాయి.' },
  footer:  { en:'Live from GNews API · AI-classified · Click any headline to read the full article', hi:'GNews API से लाइव · AI द्वारा वर्गीकृत · क्लिक करें पूरी खबर पढ़ें', ta:'GNews API இலிருந்து நேரடி · AI வகைப்படுத்தல் · முழு கட்டுரை படிக்க கிளிக் செய்யுங்கள்', te:'GNews API నుండి నేరుగా · AI వర్గీకరించబడింది · పూర్తి కథనం చదవడానికి క్లిక్ చేయండి' },
};
const t = (key, lang) => { const v = TX[key]; return typeof v === 'object' ? (v[lang] ?? v.en) : v; };

export function NewsPanel({ loading }) {
  const { lang, news, newsError, newsInsights } = useStore();
  const displayNews = (!newsError && news.length > 0) ? news : FALLBACK_NEWS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title',lang)}</CardTitle>
        <div className="flex items-center gap-2">
          {!newsError && !loading && news.length > 0 ? (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" style={{ animation:'pulse 1.5s infinite' }} />{t('live',lang)}
            </div>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">{t('sample',lang)}</span>
          )}
        </div>
      </CardHeader>
      {newsInsights?.marketSummary && (
        <div className="mb-4 p-3 bg-sage/8 border border-sage/20 rounded-xl text-xs text-forest-mid leading-relaxed">
          🤖 <strong>{t('aiSum',lang)}</strong> {newsInsights.marketSummary}
        </div>
      )}
      {loading && (
        <div className="space-y-3">
          <div className="text-xs text-forest-light mb-2">{t('loading',lang)}</div>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton height="8px" width="8px" className="rounded-full mt-1.5 flex-shrink-0" />
              <div className="flex-1 space-y-1.5"><Skeleton height="13px" /><Skeleton height="10px" width="60%" /></div>
            </div>
          ))}
        </div>
      )}
      {newsError && !loading && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 mb-3">⚠ {t('err',lang)}</div>
      )}
      {!loading && (
        <div className="space-y-2">
          {displayNews.map((item, i) => (
            <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer"
              className="flex gap-3 p-3 rounded-xl border border-transparent hover:border-[rgba(26,51,40,0.12)] hover:bg-white transition-all no-underline group cursor-pointer"
              style={{ background:'rgba(245,240,232,0.6)' }}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotColors[item.dot] || 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-forest leading-relaxed group-hover:text-forest-light transition-colors line-clamp-2">{item.title}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-forest-light">{item.source} · {item.ago}</span>
                  {item.impact && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${impactColors[item.dot] || 'text-amber-700 bg-amber-50'}`}>{item.impact}</span>}
                </div>
              </div>
              <div className="text-[10px] text-forest-light opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">↗</div>
            </a>
          ))}
        </div>
      )}
      {!loading && <div className="mt-3 pt-3 border-t border-[rgba(26,51,40,0.07)] text-[10px] text-forest-light text-center">{t('footer',lang)}</div>}
    </Card>
  );
}
