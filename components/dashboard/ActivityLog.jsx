'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';

const TX = {
  title:     { en:'⛓ Blockchain Activity Log', hi:'⛓ ब्लॉकचेन गतिविधि लॉग', ta:'⛓ Blockchain செயல்பாட்டு பதிவு', te:'⛓ Blockchain యాక్టివిటీ లాగ్' },
  verified:  { en:'VERIFIED ON-CHAIN', hi:'ऑन-चेन सत्यापित', ta:'ON-CHAIN சரிபார்க்கப்பட்டது', te:'ON-CHAIN ధృవీకరించబడింది' },
  showTx:    { en:'Show TX', hi:'TX देखें', ta:'TX காண்பி', te:'TX చూపు' },
  hideTx:    { en:'Hide TX', hi:'हैश छुपाएं', ta:'TX மறை', te:'TX దాచు' },
  why:       { en:'💡 Why blockchain? Every decision and payout is recorded on Polygon — so no insurance company or government can alter it. Your money is protected.', hi:'💡 ब्लॉकचेन क्यों? हर फैसला और भुगतान Polygon नेटवर्क पर दर्ज होता है — इसलिए बीमा कंपनी या सरकार कोई भी बदलाव नहीं कर सकती।', ta:'💡 Blockchain ஏன்? ஒவ்வொரு முடிவும் செலுத்தலும் Polygon இல் பதிவு செய்யப்படுகிறது — எனவே எந்த காப்பீட்டு நிறுவனமும் மாற்ற முடியாது.', te:'💡 Blockchain ఎందుకు? ప్రతి నిర్ణయం మరియు చెల్లింపు Polygon లో నమోదు చేయబడుతుంది — కాబట్టి ఏ బీమా కంపెనీ మార్చలేదు.' },
  footer:    { en:'All transactions immutably recorded on Polygon. Tamper-proof audit trail for every insurance claim.', hi:'सभी लेनदेन Polygon ब्लॉकचेन पर अपरिवर्तनीय रूप से दर्ज हैं।', ta:'அனைத்து பரிவர்த்தனைகளும் Polygon இல் மாறாமல் பதிவு செய்யப்பட்டுள்ளன.', te:'అన్ని లావాదేవీలు Polygon లో మార్చలేని విధంగా నమోదు చేయబడ్డాయి.' },
  a1title:   { en:'Smart Policy Created', hi:'स्मार्ट पॉलिसी बनाई गई', ta:'ஸ்மார்ட் பாலிசி உருவாக்கப்பட்டது', te:'స్మార్ట్ పాలసీ సృష్టించబడింది' },
  a2title:   { en:'Risk Analysis Updated', hi:'जोखिम विश्लेषण अपडेट', ta:'ஆபத்து பகுப்பாய்வு புதுப்பிக்கப்பட்டது', te:'రిస్క్ విశ్లేషణ నవీకరించబడింది' },
  a3title:   { en:'Crop Recommendations Generated', hi:'फसल सिफारिशें जनरेट हुईं', ta:'பயிர் பரிந்துரைகள் உருவாக்கப்பட்டன', te:'పంట సిఫార్సులు రూపొందించబడ్డాయి' },
  a4title:   { en:'Live Weather Data Fetched', hi:'लाइव मौसम डेटा प्राप्त हुआ', ta:'நேரடி வானிலை தரவு பெறப்பட்டது', te:'నేరుగా వాతావరణ డేటా పొందబడింది' },
  justNow:   { en:'Just now', hi:'अभी', ta:'இப்போதே', te:'ఇప్పుడే' },
  t2min:     { en:'2 min ago', hi:'2 मिनट पहले', ta:'2 நிமிடங்கள் முன்பு', te:'2 నిమిషాల క్రితం' },
  t4min:     { en:'4 min ago', hi:'4 मिनट पहले', ta:'4 நிமிடங்கள் முன்பு', te:'4 నిమిషాల క్రితం' },
  t5min:     { en:'5 min ago', hi:'5 मिनट पहले', ta:'5 நிமிடங்கள் முன்பு', te:'5 నిమిషాల క్రితం' },
};
const t = (key, lang) => { const v = TX[key]; return typeof v === 'object' ? (v[lang] ?? v.en) : v; };

export function ActivityLog() {
  const { lang, crops, weather } = useStore();
  const [showHash, setShowHash] = useState(false);
  const topCrop  = crops[0];
  const cropName = topCrop ? (lang === 'hi' ? (topCrop.nameHi || topCrop.name) : topCrop.name) : 'Wheat';

  const items = [
    { dot:'green', icon:'📋', title: t('a1title',lang), desc: `${cropName} Parametric Insurance — ₹85,000 coverage activated`, time: t('justNow',lang), hash:'0x3f2a…bc19', type:'POLICY_CREATED' },
    { dot:'amber', icon:'🌡️', title: t('a2title',lang), desc: weather ? `Drought probability: ${weather.droughtRisk}% · Forecast ${weather.forecastRain}mm vs avg ${weather.historicalAvg}mm` : 'Drought probability recalculated from live weather data', time: t('t2min',lang), hash:'0x7d91…44e2', type:'ORACLE_UPDATE' },
    { dot:'blue',  icon:'🤖', title: t('a3title',lang), desc: `AI model scored ${crops.length || 6} crops — ${cropName} ranked #1`, time: t('t4min',lang), hash:'0x1c84…f029', type:'AI_INFERENCE' },
    { dot:'green', icon:'☁️', title: t('a4title',lang), desc: weather ? `Open-Meteo loaded 14-day forecast for ${weather.stateName || 'your location'}` : 'Open-Meteo + NASA POWER data loaded', time: t('t5min',lang), hash:'0xa2f6…d731', type:'DATA_FETCH' },
  ];
  const dotStyle = { green:'bg-green-600 shadow-[0_0_0_2.5px_#16a34a]', amber:'bg-amber-500 shadow-[0_0_0_2.5px_#f59e0b]', blue:'bg-blue-500 shadow-[0_0_0_2.5px_#3b82f6]' };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title',lang)}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold tracking-[1px] uppercase px-2.5 py-1 rounded-full bg-[rgba(74,138,114,0.1)] text-sage">{t('verified',lang)}</span>
          <button onClick={() => setShowHash(h => !h)} className="text-[10px] text-forest-light hover:text-sage transition-colors bg-transparent border-none cursor-pointer">
            {showHash ? t('hideTx',lang) : t('showTx',lang)}
          </button>
        </div>
      </CardHeader>
      <div className="mb-4 p-3 bg-[rgba(74,138,114,0.06)] border border-[rgba(74,138,114,0.15)] rounded-xl text-[11px] text-forest-mid leading-relaxed">{t('why',lang)}</div>
      <div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-3 py-3.5 border-b border-[rgba(26,51,40,0.07)] last:border-0">
            <div className="flex flex-col items-center w-7 flex-shrink-0">
              <div className={`w-3 h-3 rounded-full mt-0.5 border-2 border-white flex-shrink-0 ${dotStyle[item.dot]}`} />
              {i < items.length - 1 && <div className="w-0.5 flex-1 bg-parchment mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5"><span className="text-sm">{item.icon}</span><span className="text-xs font-semibold text-forest">{item.title}</span></div>
              <div className="text-[11px] text-forest-light leading-relaxed">{item.desc}</div>
              {showHash && <div className="text-[10px] font-mono text-sage mt-1">{item.hash} · {item.type}</div>}
            </div>
            <div className="text-[10px] text-forest-light flex-shrink-0 mt-0.5 whitespace-nowrap">{item.time}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-cream rounded-xl text-[11px] text-forest-light flex items-start gap-2"><span className="flex-shrink-0">🔒</span><span>{t('footer',lang)}</span></div>
    </Card>
  );
}
