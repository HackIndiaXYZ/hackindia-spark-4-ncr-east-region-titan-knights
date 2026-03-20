'use client';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

function RiskBar({ label, value, color, detail }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-semibold text-forest">{label}</span>
        <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
          value > 65 ? 'bg-red-100 text-red-700' : value > 40 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
        }`}>{value}%</span>
      </div>
      <div className="h-2.5 bg-parchment rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color }} />
      </div>
      {detail && <div className="text-[10px] text-forest-light mt-1">{detail}</div>}
    </div>
  );
}

const TX = {
  title:     { en:'⚠️ Risk Analysis',      hi:'⚠️ जोखिम विश्लेषण',    ta:'⚠️ ஆபத்து பகுப்பாய்வு',    te:'⚠️ రిస్క్ విశ్లేషణ' },
  loading:   { en:'Loading...',             hi:'लोड हो रहा है...',      ta:'ஏற்றுகிறது...',             te:'లోడ్ అవుతోంది...' },
  estimated: { en:'Estimated',             hi:'अनुमानित',               ta:'மதிப்பிடப்பட்டது',          te:'అంచనా' },
  live:      { en:'🔴 Live',               hi:'🔴 लाइव',               ta:'🔴 நேரடி',                  te:'🔴 నేరుగా' },
  forecast:  { en:'14-day forecast',       hi:'14-दिन पूर्वानुमान',    ta:'14-நாள் முன்னறிவிப்பு',    te:'14-రోజుల అంచనా' },
  histAvg:   { en:'Historical avg',        hi:'ऐतिहासिक औसत',          ta:'வரலாற்று சராசரி',           te:'చారిత్రక సగటు' },
  curTemp:   { en:'Current temp',          hi:'वर्तमान तापमान',        ta:'தற்போதைய வெப்பநிலை',       te:'ప్రస్తుత ఉష్ణోగ్రత' },
  src:       { en:'Source: Open-Meteo + NASA POWER · Updated hourly', hi:'स्रोत: Open-Meteo + NASA POWER · प्रति घंटे अपडेट', ta:'ஆதாரம்: Open-Meteo + NASA POWER · ஒவ்வொரு மணி நேரமும்', te:'మూలం: Open-Meteo + NASA POWER · గంటకు' },
  fetchingWx:{ en:'Fetching live weather data...', hi:'लाइव मौसम डेटा लोड हो रहा है...', ta:'நேரடி வானிலை தரவு பெறுகிறோம்...', te:'నేరుగా వాతావరణ డేటా పొందుతున్నాం...' },
  wxErr:     { en:'Could not load live weather. Showing estimated data.', hi:'लाइव मौसम लोड नहीं हो सका। अनुमानित डेटा दिखाया जा रहा है।', ta:'நேரடி வானிலை ஏற்ற முடியவில்லை. மதிப்பிடப்பட்ட தரவு காட்டப்படுகிறது.', te:'నేరుగా వాతావరణం లోడ్ చేయలేదు. అంచనా డేటా చూపబడుతోంది.' },
  drought:   { en:'🌵 Drought Risk',       hi:'🌵 सूखा जोखिम',         ta:'🌵 வறட்சி ஆபத்து',         te:'🌵 కరువు రిస్క్' },
  flood:     { en:'🌊 Flood Risk',         hi:'🌊 बाढ़ जोखिम',          ta:'🌊 வெள்ள ஆபத்து',          te:'🌊 వరద రిస్క్' },
  mktVol:    { en:'📈 Market Volatility',  hi:'📈 बाज़ार अस्थिरता',    ta:'📈 சந்தை ஏற்றத்தாழ்வு',   te:'📈 మార్కెట్ అస్థిరత' },
  pest:      { en:'🐛 Pest & Disease',     hi:'🐛 कीट और रोग',          ta:'🐛 பூச்சி & நோய்',          te:'🐛 పురుగులు & వ్యాధి' },
  forecastVs:{ en:'Forecast',             hi:'पूर्वानुमान',             ta:'முன்னறிவிப்பு',             te:'అంచనా' },
  histAvg2:  { en:'historical avg',       hi:'ऐतिहासिक औसत',           ta:'வரலாற்று சராசரி',           te:'చారిత్రక సగటు' },
  excessRain:{ en:'Based on excess rainfall in forecast', hi:'अतिरिक्त वर्षा पूर्वानुमान के आधार पर', ta:'முன்னறிவிப்பில் அதிகப்படியான மழை அடிப்படையில்', te:'అంచనాలో అధిక వర్షపాతం ఆధారంగా' },
  modPriceFluc:{ en:'Moderate price fluctuations expected', hi:'मध्यम कीमत उतार-चढ़ाव अपेक्षित', ta:'மிதமான விலை ஏற்றத்தாழ்வு எதிர்பார்க்கப்படுகிறது', te:'మితమైన ధర హెచ్చుతగ్గులు అంచనా' },
  humidity:  { en:'Based on humidity levels', hi:'स्थानीय आर्द्रता के आधार पर', ta:'ஈரப்பத அளவுகளின் அடிப்படையில்', te:'తేమ స్థాయిల ఆధారంగా' },
  droughtAlert:{ en:'⚠ Drought Alert',   hi:'⚠ सूखा चेतावनी',         ta:'⚠ வறட்சி எச்சரிக்கை',      te:'⚠ కరువు హెచ్చరిక' },
  floodAlert:{ en:'⚠ Flood Alert',       hi:'⚠ बाढ़ चेतावनी',          ta:'⚠ வெள்ள எச்சரிக்கை',       te:'⚠ వరద హెచ్చరిక' },
  droughtAdvice:{ en:'Drought risk is high. Prioritise drought-tolerant crops like Bajra, Mustard, or Chickpea. Consider drip irrigation.', hi:'सूखे का जोखिम अधिक है। बाजरा, सरसों या चने जैसी सूखा-सहिष्णु फसलें चुनें। ड्रिप सिंचाई पर विचार करें।', ta:'வறட்சி ஆபத்து அதிகம். பாஜ்ரா, கடுகு அல்லது கொண்டைக்கடலை போன்ற வறட்சி-தாங்கும் பயிர்களை முன்னுரிமை கொடுங்கள்.', te:'కరువు రిస్క్ ఎక్కువగా ఉంది. బజ్రా, ఆవాలు లేదా శనగపప్పు వంటి కరువు-నిరోధక పంటలకు ప్రాధాన్యత ఇవ్వండి.' },
  floodAdvice:{ en:'Flood risk is elevated. Avoid low-lying fields and high-water crops. Ensure drainage is clear.', hi:'बाढ़ का जोखिम बढ़ा हुआ है। नीचे के खेतों और पानी की ज़्यादा ज़रूरत वाली फसलों से बचें।', ta:'வெள்ள ஆபத்து உயர்ந்துள்ளது. குறைந்த நிலங்கள் மற்றும் அதிக நீர் தேவைப்படும் பயிர்களை தவிர்க்கவும்.', te:'వరద రిస్క్ పెరిగింది. నీచ భూముల్లో మరియు అధిక నీటి పంటలను నివారించండి.' },
  goodCond:  { en:'✅ Conditions Look Good', hi:'✅ अच्छी स्थिति', ta:'✅ நிலைமைகள் நன்றாக உள்ளன', te:'✅ పరిస్థితులు బాగున్నాయి' },
  goodDesc:  { en:'No major weather risks detected for your region. This is a favourable time to plan your crop.', hi:'आपके क्षेत्र में कोई बड़ा मौसम जोखिम नहीं है। यह खेती के लिए अनुकूल समय है।', ta:'உங்கள் பகுதியில் பெரிய வானிலை ஆபத்துகள் இல்லை. இது பயிரை திட்டமிட சாதகமான நேரம்.', te:'మీ ప్రాంతానికి పెద్ద వాతావరణ ప్రమాదాలు లేవు. ఇది పంటను ప్లాన్ చేయడానికి అనుకూలమైన సమయం.' },
};

function tx(key, lang) { const l = TX[key]; return typeof l === 'object' ? (l[lang] ?? l.en) : l; }

export function WeatherRiskPanel({ loading }) {
  const { lang, weather, weatherError } = useStore();

  const riskBars = weather ? [
    { label: tx('drought',lang), value: weather.droughtRisk, color: weather.droughtRisk > 65 ? '#c94040' : weather.droughtRisk > 40 ? '#c4892a' : '#3a8a5a', detail: `${tx('forecastVs',lang)}: ${weather.forecastRain}mm vs ${tx('histAvg2',lang)}: ${weather.historicalAvg}mm` },
    { label: tx('flood',lang), value: weather.floodRisk, color: '#4a7cb8', detail: tx('excessRain',lang) },
    { label: tx('mktVol',lang), value: weather.marketVolatility || 44, color: '#7a5ea8', detail: tx('modPriceFluc',lang) },
    { label: tx('pest',lang), value: weather.pestRisk || 30, color: '#8a6a3a', detail: tx('humidity',lang) },
  ] : [
    { label: tx('drought',lang), value: 55, color: '#c4892a', detail: tx('estimated',lang) },
    { label: tx('flood',lang), value: 15, color: '#4a7cb8', detail: tx('estimated',lang) },
    { label: tx('mktVol',lang), value: 44, color: '#7a5ea8', detail: '' },
    { label: tx('pest',lang), value: 30, color: '#8a6a3a', detail: '' },
  ];

  const topRisk = weather?.droughtRisk > 60 ? 'drought' : weather?.floodRisk > 50 ? 'flood' : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tx('title',lang)}</CardTitle>
        {loading ? <Badge color="amber">{tx('loading',lang)}</Badge>
          : weatherError ? <Badge color="amber">{tx('estimated',lang)}</Badge>
          : <Badge color="blue">{tx('live',lang)}</Badge>}
      </CardHeader>

      {!loading && weather && !weatherError && (
        <div className="grid grid-cols-3 gap-2 rounded-2xl p-4 mb-5" style={{ background: 'linear-gradient(135deg, #1a3328 0%, #2d6650 100%)' }}>
          {[
            { v: `${weather.forecastRain}mm`, l: tx('forecast',lang) },
            { v: `${weather.historicalAvg}mm`, l: tx('histAvg',lang) },
            { v: `${weather.currentTemp}°C`, l: tx('curTemp',lang) },
          ].map(({ v, l }) => (
            <div key={l} className="text-center">
              <div className="font-mono text-lg font-bold text-white leading-tight">{v}</div>
              <div className="text-[10px] text-white/48 mt-0.5">{l}</div>
            </div>
          ))}
          <div className="col-span-3 text-center text-[9px] text-white/28 mt-1">{tx('src',lang)}</div>
        </div>
      )}

      {loading && (
        <div className="space-y-4 mb-4">
          <div className="text-xs text-forest-light mb-2">{tx('fetchingWx',lang)}</div>
          {[1,2,3,4].map(i => <div key={i}><Skeleton height="12px" className="mb-1.5" /><Skeleton height="10px" /></div>)}
        </div>
      )}

      {weatherError && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 mb-4">
          ⚠ {tx('wxErr',lang)}
        </div>
      )}

      {!loading && riskBars.map(r => <RiskBar key={r.label} {...r} />)}

      {!loading && topRisk && (
        <div className="p-3 rounded-xl border" style={{ background: topRisk === 'drought' ? 'rgba(196,137,42,0.08)' : 'rgba(74,124,184,0.08)', borderColor: topRisk === 'drought' ? 'rgba(196,137,42,0.25)' : 'rgba(74,124,184,0.25)' }}>
          <div className="text-xs font-bold mb-1" style={{ color: topRisk === 'drought' ? '#c4892a' : '#4a7cb8' }}>
            {topRisk === 'drought' ? tx('droughtAlert',lang) : tx('floodAlert',lang)}
          </div>
          <div className="text-[11px] leading-relaxed" style={{ color: topRisk === 'drought' ? '#8a6020' : '#2a5a88' }}>
            {topRisk === 'drought' ? tx('droughtAdvice',lang) : tx('floodAdvice',lang)}
          </div>
        </div>
      )}

      {!loading && !topRisk && weather && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200">
          <div className="text-xs font-bold text-green-800 mb-1">{tx('goodCond',lang)}</div>
          <div className="text-[11px] text-green-700 leading-relaxed">{tx('goodDesc',lang)}</div>
        </div>
      )}
    </Card>
  );
}
