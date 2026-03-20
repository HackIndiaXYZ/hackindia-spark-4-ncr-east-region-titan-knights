'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

const FACTS = {
  en: [
    'India has 28 distinct agroclimatic zones — we filter crops for yours specifically.',
    'MSP (Minimum Support Price) protects you from price crashes on govt-covered crops.',
    'Open-Meteo provides 30 years of weather history — we use it as your baseline.',
    'Parametric insurance triggers automatically — no assessor visit needed.',
    'Our AI weighs weather, market, risk, and water — not just one factor.',
  ],
  hi: [
    'भारत में 28 अलग कृषि-जलवायु क्षेत्र हैं — हम आपके लिए फसलें फ़िल्टर करते हैं।',
    'MSP (न्यूनतम समर्थन मूल्य) सरकारी फसलों पर कीमत गिरावट से बचाता है।',
    'Open-Meteo 30 साल का मौसम इतिहास देता है — हम इसे आपके बेसलाइन के रूप में उपयोग करते हैं।',
    'पैरामेट्रिक बीमा स्वचालित रूप से ट्रिगर होता है — कोई निरीक्षक यात्रा नहीं।',
    'हमारा AI मौसम, बाज़ार, जोखिम और पानी — सिर्फ एक नहीं, सभी को तोलता है।',
  ],
  ta: [
    'இந்தியாவில் 28 வேறுபட்ட விவசாய-காலநிலை மண்டலங்கள் உள்ளன — உங்களுக்காக பயிர்களை வடிகட்டுகிறோம்.',
    'MSP (குறைந்தபட்ச ஆதரவு விலை) அரசு மூடிய பயிர்களில் விலை வீழ்ச்சியிலிருந்து பாதுகாக்கிறது.',
    'Open-Meteo 30 ஆண்டு வானிலை வரலாறை வழங்குகிறது — இதை உங்கள் அடிப்படையாக பயன்படுத்துகிறோம்.',
    'பாராமெட்ரிக் காப்பீடு தானாக தூண்டுகிறது — மதிப்பீட்டாளர் வருகை தேவையில்லை.',
    'எங்கள் AI வானிலை, சந்தை, ஆபத்து மற்றும் நீர் — ஒன்று மட்டுமல்ல, அனைத்தையும் எடைபோடுகிறது.',
  ],
  te: [
    'భారతదేశంలో 28 విభిన్న వ్యవసాయ-వాతావరణ మండలాలు ఉన్నాయి — మీ కోసం పంటలను ఫిల్టర్ చేస్తాం.',
    'MSP (కనీస మద్దతు ధర) ప్రభుత్వ పంటలలో ధర పతనం నుండి రక్షిస్తుంది.',
    'Open-Meteo 30 సంవత్సరాల వాతావరణ చరిత్రను అందిస్తుంది — దీన్ని మీ ప్రాతిపదికగా ఉపయోగిస్తాం.',
    'పారామెట్రిక్ బీమా స్వయంచాలకంగా ట్రిగర్ అవుతుంది — మదింపుదారు సందర్శన అవసరం లేదు.',
    'మా AI వాతావరణం, మార్కెట్, రిస్క్ మరియు నీరు — ఒక్కటి మాత్రమే కాదు, అన్నింటినీ పరిగణిస్తుంది.',
  ],
};

const STEPS = {
  en: ['Fetching live weather for your location…','Computing 30-year rainfall baseline…','Filtering crops for your state and season…','Pulling live market news…','Running AI crop scoring model…','Building your personalized dashboard…'],
  hi: ['आपके स्थान का लाइव मौसम लोड हो रहा है…','30 साल का वर्षा बेसलाइन कम्प्यूट हो रहा है…','आपके राज्य और मौसम के लिए फसलें फ़िल्टर हो रही हैं…','लाइव बाज़ार समाचार लोड हो रहे हैं…','AI फसल स्कोरिंग मॉडल चल रहा है…','आपका व्यक्तिगत डैशबोर्ड बन रहा है…'],
  ta: ['உங்கள் இடத்திற்கான நேரடி வானிலை பெறுகிறோம்…','30 ஆண்டு மழை அடிப்படை கணக்கிடுகிறோம்…','உங்கள் மாநிலம் மற்றும் பருவத்திற்கான பயிர்களை வடிகட்டுகிறோம்…','நேரடி சந்தை செய்திகளை இழுக்கிறோம்…','AI பயிர் மதிப்பீட்டு மாதிரி இயங்குகிறது…','உங்கள் தனிப்பயனாக்கப்பட்ட டாஷ்போர்டை உருவாக்குகிறோம்…'],
  te: ['మీ స్థానానికి నేరుగా వాతావరణం పొందుతున్నాం…','30 సంవత్సరాల వర్షపాత ప్రాతిపదిక లెక్కిస్తున్నాం…','మీ రాష్ట్రం మరియు సీజన్‌కు పంటలను ఫిల్టర్ చేస్తున్నాం…','నేరుగా మార్కెట్ వార్తలు తీసుకుంటున్నాం…','AI పంట స్కోరింగ్ మాదిరి నడుస్తోంది…','మీ వ్యక్తిగతీకరించిన డాష్‌బోర్డ్ నిర్మిస్తున్నాం…'],
};

const TX = {
  title:   { en:'Analyzing your farm…', hi:'आपके खेत का विश्लेषण हो रहा है…', ta:'உங்கள் வயலை பகுப்பாய்வு செய்கிறோம்…', te:'మీ పొలాన్ని విశ్లేషిస్తున్నాం…' },
  sub:     { en:'About 15–20 seconds', hi:'लगभग 15–20 सेकंड', ta:'சுமார் 15–20 வினாடிகள்', te:'సుమారు 15–20 సెకన్లు' },
  didYouKnow:{ en:'Did you know?', hi:'क्या आप जानते हैं?', ta:'உங்களுக்கு தெரியுமா?', te:'మీకు తెలుసా?' },
  ready:   { en:'Ready! Taking you to your dashboard…', hi:'तैयार! डैशबोर्ड पर जा रहे हैं…', ta:'தயார்! உங்கள் டாஷ்போர்டுக்கு அழைத்துச் செல்கிறோம்…', te:'రెడీ! మీ డాష్‌బోర్డ్‌కు తీసుకెళ్తున్నాం…' },
};
const t = (key, lang) => { const v = TX[key]; return typeof v === 'object' ? (v[lang] ?? v.en) : v; };

export default function LoadingPage() {
  const router = useRouter();
  const { lang, userData, setWeather, setCrops, setNews, setNewsInsights, setWeatherError, setNewsError } = useStore();

  const [stepIdx, setStepIdx] = useState(0);
  const [factIdx, setFactIdx] = useState(0);
  const [done,    setDone]    = useState(false);

  const steps = STEPS[lang] || STEPS.en;
  const facts  = FACTS[lang] || FACTS.en;

  useEffect(() => {
    if (!userData) { router.replace('/form'); return; }

    const factTimer = setInterval(() => setFactIdx(i => (i + 1) % facts.length), 3000);
    const stepTimer = setInterval(() => setStepIdx(s => Math.min(s + 1, steps.length - 1)), 950);

    async function fetchAll() {
      const { lat, lon, water, budget, risk } = userData;
      let weatherData = null;
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (res.ok) { weatherData = await res.json(); setWeather(weatherData); } else setWeatherError(true);
      } catch { setWeatherError(true); }
      try {
        const res = await fetch('/api/news');
        if (res.ok) { const d = await res.json(); setNews(d.articles || []); setNewsInsights({ sentiment: d.sentiment || {}, signals: d.signals || [], marketSummary: d.marketSummary || null }); } else setNewsError(true);
      } catch { setNewsError(true); }
      try {
        const res = await fetch('/api/recommend', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ stateName: weatherData?.stateName||'', lat: lat||20, altitudeM: weatherData?.altitudeM||0, droughtRisk: weatherData?.droughtRisk||55, floodRisk: weatherData?.floodRisk||15, forecastRain: weatherData?.forecastRain||60, currentTemp: weatherData?.currentTemp||28, maxTemp14d: weatherData?.maxTemp14d||35, water, budget, riskAppetite: risk, newsSentiment: {} }) });
        if (res.ok) setCrops(await res.json());
      } catch (err) { console.error('Recommend error:', err); }
      clearInterval(stepTimer); clearInterval(factTimer);
      setStepIdx(steps.length - 1); setDone(true);
      setTimeout(() => router.push('/dashboard'), 900);
    }
    fetchAll();
    return () => { clearInterval(stepTimer); clearInterval(factTimer); };
  }, []);

  if (!userData) return null;

  const progressPct   = Math.round(((stepIdx + 1) / steps.length) * 100);
  const circumference = 2 * Math.PI * 44;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20" style={{ background:'linear-gradient(180deg, #1a3328 0%, #0f2018 100%)' }}>
      <div className="relative mb-8">
        <svg className="-rotate-90 w-28 h-28" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <circle cx="48" cy="48" r="44" fill="none" stroke="#a8d5c2" strokeWidth="5" strokeLinecap="round" strokeDasharray={`${circumference * progressPct / 100} ${circumference}`} style={{ transition:'stroke-dasharray 0.9s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center"><span className="font-mono text-2xl font-bold text-white">{progressPct}%</span></div>
      </div>

      <h2 className="font-serif text-2xl text-white mb-1 text-center">{t('title',lang)}</h2>
      <p className="text-white/38 text-sm mb-10 text-center">{t('sub',lang)}</p>

      <div className="space-y-3 w-full max-w-xs mb-10">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i < stepIdx ? 'opacity-45' : i === stepIdx ? 'opacity-100' : 'opacity-18'}`}>
            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold transition-all ${i < stepIdx ? 'bg-sage text-white' : i === stepIdx ? 'bg-gold text-forest' : 'bg-white/8 text-white/40'}`}>
              {i < stepIdx ? '✓' : i === stepIdx ? <span style={{ display:'inline-block', animation:'spin 1s linear infinite' }}>⟳</span> : i + 1}
            </div>
            <span className={`text-sm leading-snug ${i === stepIdx ? 'text-mint font-medium' : 'text-white/50'}`}>{s}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm p-4 rounded-2xl text-center" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
        <div className="text-[10px] font-bold uppercase tracking-[2px] text-white/25 mb-2">{t('didYouKnow',lang)}</div>
        <p key={factIdx} className="text-xs text-white/50 leading-relaxed" style={{ animation:'fadeIn 0.6s ease' }}>{facts[factIdx]}</p>
      </div>

      {done && (
        <div className="mt-8 flex items-center gap-2 text-green-400 font-semibold" style={{ animation:'fadeUp 0.4s ease' }}>
          <span className="text-xl">✅</span><span className="text-sm">{t('ready',lang)}</span>
        </div>
      )}
    </div>
  );
}
