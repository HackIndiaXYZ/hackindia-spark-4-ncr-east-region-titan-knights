'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const TX = {
  insLabel:    { en:'🔐 Recommended Insurance',      hi:'🔐 अनुशंसित बीमा',              ta:'🔐 பரிந்துரைக்கப்பட்ட காப்பீடு',   te:'🔐 సిఫార్సు చేయబడిన బీమా' },
  planSuffix:  { en:'Parametric Plan',               hi:'पैरामेट्रिक योजना',              ta:'பாராமெட்ரிக் திட்டம்',             te:'పారామెట్రిక్ ప్లాన్' },
  tailored:    { en:"Tailored to your farm's live weather data", hi:'आपके खेत के लाइव मौसम डेटा के आधार पर तैयार', ta:'உங்கள் வயலின் நேரடி வானிலை தரவுக்கு ஏற்றது', te:'మీ పొలం నేరుగా వాతావరణ డేటాకు అనుగుణంగా' },
  annPrem:     { en:'Annual Premium',                hi:'वार्षिक प्रीमियम',               ta:'வருடாந்திர பிரீமியம்',             te:'వార్షిక ప్రీమియం' },
  maxPayout:   { en:'Max Payout',                    hi:'अधिकतम भुगतान',                  ta:'அதிகபட்ச செலுத்தல்',               te:'గరిష్ట చెల్లింపు' },
  coverage:    { en:'Coverage',                      hi:'कवरेज',                          ta:'காப்பீடு',                         te:'కవరేజ్' },
  paySpeed:    { en:'Payout Speed',                  hi:'भुगतान समय',                     ta:'செலுத்தல் வேகம்',                  te:'చెల్లింపు వేగం' },
  trigLabel:   { en:'Trigger conditions (automatic payout)', hi:'ट्रिगर शर्तें (स्वचालित भुगतान)', ta:'தூண்டுதல் நிபந்தனைகள் (தானியங்கி செலுத்தல்)', te:'ట్రిగర్ పరిస్థితులు (స్వయంచాలక చెల్లింపు)' },
  activating:  { en:'Activating...',                 hi:'सक्रिय हो रहा है...',             ta:'செயல்படுத்துகிறது...',             te:'యాక్టివేట్ అవుతోంది...' },
  activate:    { en:'✅ Activate This Plan',          hi:'✅ यह योजना सक्रिय करें',         ta:'✅ இந்த திட்டத்தை செயல்படுத்துங்கள்', te:'✅ ఈ ప్లాన్‌ను యాక్టివేట్ చేయండి' },
  activeMsg:   { en:'Plan Active! Policy #AGS-2025-8841', hi:'योजना सक्रिय है! पॉलिसी नंबर: AGS-2025-8841', ta:'திட்டம் செயலில் உள்ளது! பாலிசி #AGS-2025-8841', te:'ప్లాన్ యాక్టివ్! పాలసీ #AGS-2025-8841' },
  blockchain:  { en:'Recorded on blockchain · Polygon Network', hi:'ब्लॉकचेन पर दर्ज · Polygon Network', ta:'Blockchain இல் பதிவு செய்யப்பட்டது · Polygon Network', te:'Blockchain లో నమోదు · Polygon Network' },
  // Simulation
  simTitle:    { en:'🎮 Interactive Simulation',    hi:'🎮 इंटरैक्टिव सिमुलेशन',         ta:'🎮 ஊடாடும் உருவகப்படுத்துதல்',   te:'🎮 ఇంటరాక్టివ్ సిమ్యులేషన్' },
  demoMode:    { en:'Demo Mode',                    hi:'डेमो मोड',                       ta:'டெமோ பயன்முறை',                   te:'డెమో మోడ్' },
  simDesc:     { en:'See how the insurance system responds to real events — watch automatic payouts triggered live.', hi:'देखें कि सूखा या बाढ़ आने पर बीमा प्रणाली कैसे काम करती है।', ta:'காப்பீட்டு அமைப்பு உண்மையான நிகழ்வுகளுக்கு எவ்வாறு பதிலளிக்கிறது என்று பாருங்கள்.', te:'బీమా వ్యవస్థ నిజ సంఘటనలకు ఎలా స్పందిస్తుందో చూడండి.' },
  simDrought:  { en:'☀️ Simulate Drought',           hi:'☀️ सूखा सिमुलेट करें',            ta:'☀️ வறட்சியை உருவகப்படுத்துங்கள்', te:'☀️ కరువు సిమ్యులేట్ చేయండి' },
  simFlood:    { en:'🌊 Simulate Flood',             hi:'🌊 बाढ़ सिमुलेट करें',             ta:'🌊 வெள்ளத்தை உருவகப்படுத்துங்கள்', te:'🌊 వరద సిమ్యులేట్ చేయండి' },
  simPayout:   { en:'💰 Trigger Payout',             hi:'💰 भुगतान ट्रिगर करें',           ta:'💰 செலுத்தலை தூண்டுங்கள்',        te:'💰 చెల్లింపు ట్రిగర్ చేయండి' },
  reset:       { en:'Reset',                         hi:'रीसेट',                          ta:'மீட்டமை',                         te:'రీసెట్' },
  verifying:   { en:'Verifying oracle data on-chain...', hi:'Oracle डेटा सत्यापित हो रहा है...', ta:'Oracle தரவை சரிபார்க்கிறது...', te:'Oracle డేటా ధృవీకరిస్తోంది...' },
  idle:        { en:'Click any button above to see how the system responds instantly.', hi:'ऊपर कोई भी बटन क्लिक करें और देखें कि सिस्टम तुरंत कैसे प्रतिक्रिया देता है।', ta:'அமைப்பு உடனடியாக எவ்வாறு பதிலளிக்கிறது என்று பார்க்க மேலே உள்ள பொத்தானை கிளிக் செய்யுங்கள்.', te:'వ్యవస్థ తక్షణమే ఎలా స్పందిస్తుందో చూడటానికి పైన ఏదైనా బటన్ క్లిక్ చేయండి.' },
  droughtDetected:{ en:'Drought Condition Detected!', hi:'सूखे की स्थिति पाई गई!', ta:'வறட்சி நிலை கண்டறியப்பட்டது!', te:'కరువు పరిస్థితి గుర్తించబడింది!' },
  droughtRain: { en:'Rainfall recorded: 2.1mm (threshold: 5mm)', hi:'दर्ज वर्षा: 2.1mm (सीमा: 5mm)', ta:'மழை பதிவு: 2.1mm (வரம்பு: 5mm)', te:'వర్షపాతం నమోదు: 2.1mm (పరిమితి: 5mm)' },
  droughtQ:    { en:'₹42,500 payout will reach your account in 48 hours', hi:'₹42,500 भुगतान 48 घंटे में आपके खाते में आएगा', ta:'₹42,500 செலுத்தல் 48 மணி நேரத்தில் உங்கள் கணக்கை சென்றடையும்', te:'₹42,500 చెల్లింపు 48 గంటల్లో మీ ఖాతాకు చేరుతుంది' },
  floodDetected:{ en:'Excess Rainfall Detected!', hi:'अत्यधिक वर्षा पाई गई!', ta:'அதிகப்படியான மழை கண்டறியப்பட்டது!', te:'అధిక వర్షపాతం గుర్తించబడింది!' },
  floodRain:   { en:'340mm rain in 72 hours (threshold: 250mm)', hi:'340mm वर्षा 72 घंटे में (सीमा: 250mm)', ta:'72 மணி நேரத்தில் 340mm மழை (வரம்பு: 250mm)', te:'72 గంటల్లో 340mm వర్షం (పరిమితి: 250mm)' },
  floodQ:      { en:'₹28,000 flood damage payout processing', hi:'₹28,000 बाढ़ क्षति भुगतान प्रोसेस हो रहा है', ta:'₹28,000 வெள்ள சேதம் செலுத்தல் செயலாக்கம்', te:'₹28,000 వరద నష్టం చెల్లింపు ప్రాసెసింగ్' },
  payoutReleased:{ en:'Payout Released Successfully!', hi:'भुगतान सफलतापूर्वक जारी!', ta:'செலுத்தல் வெற்றிகரமாக வழங்கப்பட்டது!', te:'చెల్లింపు విజయవంతంగా విడుదలైంది!' },
  farmerWallet:{ en:'Farmer Wallet', hi:'किसान वॉलेट', ta:'விவசாயி பணப்பை', te:'రైతు వాలెట్' },
  processed:   { en:'Processed in 1.2 seconds · Zero paperwork', hi:'1.2 सेकंड में प्रोसेस · शून्य कागजी कार्यवाही', ta:'1.2 வினாடிகளில் செயலாக்கப்பட்டது · காகித வேலை இல்லை', te:'1.2 సెకన్లలో ప్రాసెస్ · జీరో పేపర్‌వర్క్' },
};

const t = (key, lang) => { const v = TX[key]; return typeof v === 'object' ? (v[lang] ?? v.en) : v; };

export function InsurancePanel() {
  const { lang, crops, userData } = useStore();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated]   = useState(false);

  const topCrop  = crops[0];
  const cropName = topCrop ? (lang === 'hi' ? (topCrop.nameHi || topCrop.name) : topCrop.name) : 'Wheat';
  const acres    = userData?.landSize || 5;
  const premium  = Math.round(acres * 840);
  const payout   = Math.round(acres * 17000);

  const handleActivate = () => {
    if (activated) return;
    setActivating(true);
    setTimeout(() => { setActivating(false); setActivated(true); }, 1800);
  };

  return (
    <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a3328 0%, #2d6650 100%)' }}>
      <div className="absolute w-60 h-60 rounded-full border-[36px] border-white/[0.04] -top-20 -right-20 pointer-events-none" />
      <div className="text-[11px] text-white/45 tracking-[2px] uppercase mb-2">{t('insLabel',lang)}</div>
      <h3 className="font-serif text-xl text-white mb-1">{cropName} {t('planSuffix',lang)}</h3>
      <p className="text-white/50 text-xs mb-5">{t('tailored',lang)}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { l: t('annPrem',lang), v: `₹${premium.toLocaleString('en-IN')}` },
          { l: t('maxPayout',lang), v: `₹${payout.toLocaleString('en-IN')}` },
          { l: t('coverage',lang), v: `${acres} Acres` },
          { l: t('paySpeed',lang), v: '48 hrs' },
        ].map(({ l, v }) => (
          <div key={l} className="bg-white/10 rounded-xl p-3">
            <div className="text-[10px] text-white/45 mb-1">{l}</div>
            <div className="font-serif text-[17px] text-white">{v}</div>
          </div>
        ))}
      </div>
      <div className="mb-5">
        <div className="text-[11px] text-white/45 mb-2">{t('trigLabel',lang)}</div>
        <div className="space-y-1.5">
          {[
            `🌧 ${lang==='hi'?`30 दिन में बारिश < 5mm → ₹${Math.round(payout*0.5).toLocaleString('en-IN')} भुगतान`
              :lang==='ta'?`30 நாட்களில் மழை < 5mm → ₹${Math.round(payout*0.5).toLocaleString('en-IN')} செலுத்தல்`
              :lang==='te'?`30 రోజుల్లో వర్షం < 5mm → ₹${Math.round(payout*0.5).toLocaleString('en-IN')} చెల్లింపు`
              :`Rainfall < 5mm in 30 days → ₹${Math.round(payout*0.5).toLocaleString('en-IN')} payout`}`,
            `🌡 ${lang==='hi'?`तापमान 5+ दिन > 42°C → ₹${Math.round(payout*0.33).toLocaleString('en-IN')} भुगतान`
              :lang==='ta'?`வெப்பம் 5+ நாட்கள் > 42°C → ₹${Math.round(payout*0.33).toLocaleString('en-IN')} செலுத்தல்`
              :lang==='te'?`ఉష్ణోగ్రత 5+ రోజులు > 42°C → ₹${Math.round(payout*0.33).toLocaleString('en-IN')} చెల్లింపు`
              :`Temp > 42°C for 5+ days → ₹${Math.round(payout*0.33).toLocaleString('en-IN')} payout`}`,
          ].map((trig, i) => (
            <div key={i} className="flex items-center gap-2 bg-gold/[0.12] border border-gold/25 text-gold px-3 py-2 rounded-lg text-[11px] font-mono">{trig}</div>
          ))}
        </div>
      </div>
      {!activated ? (
        <button onClick={handleActivate} disabled={activating}
          className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 border-none cursor-pointer flex items-center justify-center gap-2"
          style={{ background: activating ? 'rgba(255,255,255,0.15)' : 'linear-gradient(135deg, #d4852a, #e8a84e)', boxShadow: activating ? 'none' : '0 4px 18px rgba(212,133,42,0.4)' }}>
          {activating ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t('activating',lang)}</>) : t('activate',lang)}
        </button>
      ) : (
        <div className="w-full py-3.5 rounded-xl bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-bold text-center flex items-center justify-center gap-2">
          ✅ {t('activeMsg',lang)}
        </div>
      )}
      {activated && <p className="text-center text-[10px] text-white/40 mt-2">{t('blockchain',lang)}</p>}
    </div>
  );
}

export function SimulationPanel() {
  const { lang } = useStore();
  const [sim, setSim]         = useState(null);
  const [loading, setLoading] = useState(false);

  const runSim = (type) => { setLoading(true); setSim(null); setTimeout(() => { setLoading(false); setSim(type); }, 1200); };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('simTitle',lang)}</CardTitle>
        <Badge color="amber">{t('demoMode',lang)}</Badge>
      </CardHeader>
      <p className="text-xs text-forest-light leading-relaxed mb-4">{t('simDesc',lang)}</p>
      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={() => runSim('drought')} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #c94040, #e05050)' }}>{t('simDrought',lang)}</button>
        <button onClick={() => runSim('flood')}   className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #3a6ca8, #4a7cb8)' }}>{t('simFlood',lang)}</button>
        <button onClick={() => runSim('payout')}  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-semibold border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #3a8a5a, #4a9a6a)' }}>{t('simPayout',lang)}</button>
        {sim && <button onClick={() => setSim(null)} className="px-3 py-2 rounded-xl text-forest-light text-sm border border-[rgba(26,51,40,0.15)] bg-transparent cursor-pointer hover:bg-cream transition-all">{t('reset',lang)}</button>}
      </div>
      {loading && (
        <div className="p-4 bg-cream rounded-xl flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-sage/30 border-t-sage rounded-full animate-spin flex-shrink-0" />
          <div className="text-sm text-forest-light">{t('verifying',lang)}</div>
        </div>
      )}
      {!sim && !loading && (
        <div className="p-5 bg-cream rounded-xl text-center border-2 border-dashed border-[rgba(26,51,40,0.12)]">
          <div className="text-3xl mb-2">🎯</div>
          <p className="text-xs text-forest-light">{t('idle',lang)}</p>
        </div>
      )}
      {sim === 'drought' && !loading && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3"><span className="text-2xl flex-shrink-0">🌵</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-800 mb-1">{t('droughtDetected',lang)}</h4>
              <p className="text-xs text-red-600 mb-1">{t('droughtRain',lang)}</p>
              <p className="text-xs text-red-600 mb-2">Oracle verified · Block <span className="font-mono">0x4f91…b7e2</span></p>
              <div className="bg-amber-100 border border-amber-300 rounded-lg px-3 py-2 text-xs font-semibold text-amber-800">⏳ {t('droughtQ',lang)}</div>
            </div>
          </div>
        </div>
      )}
      {sim === 'flood' && !loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3"><span className="text-2xl flex-shrink-0">🌊</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-blue-800 mb-1">{t('floodDetected',lang)}</h4>
              <p className="text-xs text-blue-600 mb-1">{t('floodRain',lang)}</p>
              <p className="text-xs text-blue-600 mb-2">Oracle verified · Block <span className="font-mono">0x9a23…cc41</span></p>
              <div className="bg-blue-100 border border-blue-300 rounded-lg px-3 py-2 text-xs font-semibold text-blue-800">⏳ {t('floodQ',lang)}</div>
            </div>
          </div>
        </div>
      )}
      {sim === 'payout' && !loading && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-start gap-3"><span className="text-2xl flex-shrink-0">✅</span>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-green-800 mb-1">{t('payoutReleased',lang)}</h4>
              <div className="font-mono font-bold text-green-700 text-lg my-1">₹42,500 → {t('farmerWallet',lang)}</div>
              <p className="text-xs text-green-600 mb-1">{t('processed',lang)}</p>
              <p className="text-[10px] font-mono text-sage">TX: 0x8c3d…f201 · Polygon Network</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
