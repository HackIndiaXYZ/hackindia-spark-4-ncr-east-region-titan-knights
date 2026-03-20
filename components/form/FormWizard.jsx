'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

function OptionBtn({ children, selected, onClick, stacked }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm transition-all duration-200 cursor-pointer rounded-xl border-[1.5px] text-left ${
        stacked ? 'w-full px-4 py-3' : 'px-5 py-2.5'
      } ${selected
        ? 'border-forest bg-forest text-white shadow-md'
        : 'border-[rgba(26,51,40,0.15)] bg-white text-forest-light hover:border-sage hover:text-forest hover:bg-sage/5'
      }`}
    >
      {children}
    </button>
  );
}

const STEP_HINTS = [
  { en: 'We use your location to pull live weather data — not district estimates.',    hi: 'हम आपके लाइव मौसम के लिए सटीक स्थान का उपयोग करते हैं।',                               ta: 'நேரடி வானிலை தரவுக்காக உங்கள் சரியான இடத்தை பயன்படுத்துகிறோம்.',            te: 'నేరుగా వాతావరణ డేటా కోసం మీ ఖచ్చితమైన స్థానాన్ని ఉపయోగిస్తాం.' },
  { en: 'Larger farms unlock higher profit potential crops in our rankings.',           hi: 'बड़े खेतों के लिए अधिक लाभदायक फसलें रैंकिंग में ऊपर आती हैं।',                         ta: 'பெரிய வயல்கள் அதிக இலாப பயிர்களை ஆட்கொண்டுவரும்.',                         te: 'పెద్ద పొలాలు అధిక లాభ సామర్థ్యం పంటలను అన్‌లాక్ చేస్తాయి.' },
  { en: 'Budget affects which water-intensive (higher cost) crops we recommend.',      hi: 'बजट से हम पानी-गहन (अधिक लागत) फसलों की सिफारिश करते हैं।',                            ta: 'பட்ஜெட் நீர்-தீவிர (அதிக செலவு) பயிர்களை பாதிக்கிறது.',                    te: 'బడ్జెట్ నీటి-ఇంటెన్సివ్ (అధిక వ్యయం) పంటలను ప్రభావితం చేస్తుంది.' },
  { en: 'Soil type narrows our crop list to what actually grows in your field.',       hi: 'मिट्टी का प्रकार हमारी फसल सूची को आपके खेत के अनुसार सीमित करता है।',                 ta: 'மண் வகை உங்கள் வயலில் வளரும் பயிர் பட்டியலை குறைக்கிறது.',              te: 'మట్టి రకం మీ పొలంలో నిజంగా పెరిగే పంటల జాబితాను తగ్గిస్తుంది.' },
  { en: 'Water availability is the single biggest factor in crop suitability.',        hi: 'पानी की उपलब्धता फसल उपयुक्तता का सबसे महत्वपूर्ण कारक है।',                            ta: 'நீர் கிடைக்கும் தன்மை பயிர் பொருத்தத்தில் மிக முக்கியமான காரணி.',       te: 'నీటి లభ్యత పంట అనుకూలతలో అతి ముఖ్యమైన అంశం.' },
  { en: 'Risk appetite shifts the AI weights — low risk prioritises stable MSP crops.',hi: 'जोखिम सहनशीलता AI वेट बदलती है — कम जोखिम में स्थिर MSP फसलें प्राथमिक होती हैं।', ta: 'ஆபத்து விருப்பம் AI எடைகளை மாற்றுகிறது — குறைந்த ஆபத்து MSP பயிர்களுக்கு முன்னுரிமை.', te: 'రిస్క్ అభిరుచి AI వెయిట్‌లను మారుస్తుంది — తక్కువ రిస్క్ స్థిరమైన MSP పంటలకు ప్రాధాన్యత.' },
];

export function FormWizard() {
  const router = useRouter();
  const { lang, setUserData } = useStore();
  const tl = (en, hi, ta, te) => lang==='hi'?hi:lang==='ta'?ta:lang==='te'?te:en;

  const [step, setStep] = useState(0);
  const [data, setData] = useState({ location: '', lat: null, lon: null, landSize: '', budget: '', soil: '', water: '', risk: '' });
  const [error, setError] = useState('');

  const inputRef        = useRef(null);
  const autocompleteRef = useRef(null);

  // Google Maps Places Autocomplete
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
    if (!key || key === 'YOUR_GOOGLE_MAPS_KEY_HERE') return;

    const init = () => {
      if (!inputRef.current || !window.google?.maps?.places || autocompleteRef.current) return;
      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'],
        componentRestrictions: { country: 'in' },
        fields: ['geometry', 'formatted_address'],
      });
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.geometry) return;
        setData(d => ({ ...d, location: place.formatted_address, lat: place.geometry.location.lat(), lon: place.geometry.location.lng() }));
        setError('');
      });
      autocompleteRef.current = ac;
    };

    if (window.google?.maps?.places) { init(); return; }
    if (document.getElementById('gm-script')) return;
    const s = document.createElement('script');
    s.id = 'gm-script';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  }, []);

  useEffect(() => {
    if (step === 0 && window.google?.maps?.places && inputRef.current && !autocompleteRef.current) {
      setTimeout(() => {
        const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'], componentRestrictions: { country: 'in' }, fields: ['geometry', 'formatted_address'],
        });
        ac.addListener('place_changed', () => {
          const place = ac.getPlace();
          if (!place.geometry) return;
          setData(d => ({ ...d, location: place.formatted_address, lat: place.geometry.location.lat(), lon: place.geometry.location.lng() }));
          setError('');
        });
        autocompleteRef.current = ac;
      }, 150);
    }
    if (step !== 0) autocompleteRef.current = null;
  }, [step]);

  const noGMaps = !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY === 'YOUR_GOOGLE_MAPS_KEY_HERE';

  // Demo locations for when no API key
  const demoLocations = [
    { name: 'Nashik, Maharashtra', lat: 19.9975, lon: 73.7898 },
    { name: 'Ludhiana, Punjab', lat: 30.9010, lon: 75.8573 },
    { name: 'Warangal, Telangana', lat: 17.9784, lon: 79.5941 },
    { name: 'Jaipur, Rajasthan', lat: 26.9124, lon: 75.7873 },
    { name: 'Mysuru, Karnataka', lat: 12.2958, lon: 76.6394 },
  ];

  const steps = [
    {
      icon: '📍',
      titleEn: 'Where is your farm?', titleHi: 'आपका खेत कहाँ है?', titleTa: 'உங்கள் வயல் எங்கே உள்ளது?', titleTe: 'మీ పొలం ఎక్కడ ఉంది?',
      valid: () => data.lat !== null,
      content: (
        <div>
          <label className="block text-sm font-semibold text-forest mb-2">
            {tl('City / District / Village','शहर / जिला / गाँव','நகரம் / மாவட்டம் / கிராமம்','నగరం / జిల్లా / గ్రామం')}
          </label>
          <input
            ref={inputRef}
            className="w-full px-4 py-3.5 border-[1.5px] border-[rgba(26,51,40,0.15)] rounded-xl text-sm bg-cream text-forest focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all font-sans"
            placeholder={tl('Search your village or district...','अपना गाँव या जिला खोजें...','உங்கள் கிராமம் அல்லது மாவட்டத்தை தேடுங்கள்...','మీ గ్రామం లేదా జిల్లాను వెతకండి...')}
            defaultValue={data.location}
            onChange={e => { if (!e.target.value) setData(d => ({ ...d, location: '', lat: null, lon: null })); }}
          />

          {data.lat && (
            <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-green-600 text-sm">✓</span>
              <span className="text-xs font-mono text-green-700">
                {tl('Location found','स्थान मिला','இடம் கண்டறியப்பட்டது','స్థానం కనుగొనబడింది')}: {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
              </span>
            </div>
          )}

          {/* Demo locations when no Google Maps key */}
          {noGMaps && (
            <div className="mt-3">
              <p className="text-xs text-forest-light mb-2">
                {tl('Or select a demo location:','या इनमें से एक चुनें:','அல்லது ஒரு டெமோ இடத்தை தேர்ந்தெடுங்கள்:','లేదా ఒక డెమో స్థానాన్ని ఎంచుకోండి:')}
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {demoLocations.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => { setData(d => ({ ...d, location: loc.name, lat: loc.lat, lon: loc.lon })); setError(''); }}
                    className={`text-left px-3 py-2 rounded-lg text-xs transition-all border cursor-pointer ${
                      data.location === loc.name
                        ? 'border-forest bg-forest text-white'
                        : 'border-[rgba(26,51,40,0.12)] bg-white text-forest-light hover:border-sage hover:text-forest'
                    }`}
                  >
                    📍 {loc.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      icon: '📐',
      titleEn: 'How large is your farm?', titleHi: 'आपका खेत कितना बड़ा है?', titleTa: 'உங்கள் வயல் எவ்வளவு பெரியது?', titleTe: 'మీ పొలం ఎంత పెద్దది?',
      valid: () => parseFloat(data.landSize) > 0,
      content: (
        <div>
          <label className="block text-sm font-semibold text-forest mb-2">
            {tl('Farm size in acres','खेत का आकार (एकड़ में)','வயல் அளவு (ஏக்கரில்)','పొలం పరిమాణం (ఎకరాల్లో)')}
          </label>
          <div className="relative">
            <input
              type="number" min={0.5} step={0.5}
              className="w-full px-4 py-3.5 pr-16 border-[1.5px] border-[rgba(26,51,40,0.15)] rounded-xl text-sm bg-cream text-forest focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all font-sans"
              placeholder={tl('e.g. 5','जैसे 5','எ.கா. 5','ఉదా. 5')}
              value={data.landSize}
              onChange={e => setData(d => ({ ...d, landSize: e.target.value }))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-forest-light font-medium">
              {tl('acres','एकड़','ஏக்கர்','ఎకరాలు')}
            </span>
          </div>
          {/* Quick picks */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {['1', '2', '5', '10', '25'].map(v => (
              <button key={v} onClick={() => setData(d => ({ ...d, landSize: v }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-all ${
                  data.landSize === v ? 'border-forest bg-forest text-white' : 'border-[rgba(26,51,40,0.12)] bg-white text-forest-light hover:border-sage'
                }`}>
                {v} {tl('ac','एकड़','ஏ','ఎ')}
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: '💰',
      titleEn: 'What is your budget per season?', titleHi: 'आपका प्रति मौसम बजट क्या है?', titleTa: 'ஒரு பருவத்திற்கு உங்கள் பட்ஜெட் என்ன?', titleTe: 'సీజన్‌కు మీ బడ్జెట్ ఏమిటి?',
      valid: () => !!data.budget,
      content: (
        <div className="space-y-2">
          {[
            { v: 'low',    en: 'Low — under ₹50,000',     hi: 'कम — ₹50,000 से कम',      ta: 'குறைவு — ₹50,000 க்கு கீழ்',    te: 'తక్కువ — ₹50,000 కింద',      icon: '🌱', descEn: 'Rainfed or minimal irrigation', descHi: 'वर्षाश्रित या न्यूनतम सिंचाई', descTa: 'மழையை நம்பி அல்லது குறைந்த நீர்ப்பாசனம்', descTe: 'వర్షాధారం లేదా కనీస నీటిపారుదల' },
            { v: 'medium', en: 'Medium — ₹50k to ₹2 lakh', hi: 'मध्यम — ₹50k से ₹2 लाख',   ta: 'நடுத்தர — ₹50k முதல் ₹2 லட்சம்', te: 'మధ్యస్థం — ₹50k నుండి ₹2 లక్ష', icon: '🌿', descEn: 'Some irrigation and inputs',    descHi: 'कुछ सिंचाई और इनपुट',     descTa: 'சில நீர்ப்பாசனம் மற்றும் இடுபொருள்', descTe: 'కొంత నీటిపారుదల మరియు ఇన్‌పుట్లు' },
            { v: 'high',   en: 'High — over ₹2 lakh',      hi: 'अधिक — ₹2 लाख से ज़्यादा', ta: 'அதிகம் — ₹2 லட்சத்திற்கு மேல்', te: 'ఎక్కువ — ₹2 లక్ష కంటే ఎక్కువ', icon: '🌳', descEn: 'Full irrigation and machinery', descHi: 'पूर्ण सिंचाई और मशीनरी',    descTa: 'முழு நீர்ப்பாசனம் மற்றும் இயந்திரங்கள்', descTe: 'పూర్తి నీటిపారుదల మరియు యంత్రాలు' },
          ].map(o => (
            <OptionBtn key={o.v} selected={data.budget === o.v} stacked onClick={() => setData(d => ({ ...d, budget: o.v }))}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{o.icon}</span>
                <div>
                  <div className="font-semibold">{o[lang] || o.en}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{o[`desc${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || o.descEn}</div>
                </div>
              </div>
            </OptionBtn>
          ))}
        </div>
      ),
    },
    {
      icon: '🌍',
      titleEn: 'What is your soil type?', titleHi: 'आपकी मिट्टी का प्रकार क्या है?', titleTa: 'உங்கள் மண் வகை என்ன?', titleTe: 'మీ మట్టి రకం ఏమిటి?',
      valid: () => !!data.soil,
      content: (
        <div className="space-y-2">
          {[
            { v: 'sandy-loam', en: 'Sandy / Loamy',   hi: 'रेतीली / दोमट',   ta: 'மணல் / களிமண்',       te: 'ఇసుక / లోమీ',      icon: '🟡', descEn: 'Drains well, good for most crops',   descHi: 'अच्छा जल निकासी, अधिकांश फसलों के लिए अच्छा', descTa: 'நல்ல வடிகால், பெரும்பாலான பயிர்களுக்கு நல்லது', descTe: 'బాగా నీరు తీస్తుంది, చాలా పంటలకు మంచిది' },
            { v: 'black',      en: 'Black Cotton',     hi: 'काली मिट्टी',     ta: 'கருப்பு பருத்தி மண்', te: 'నల్ల పత్తి మట్టి',  icon: '⚫', descEn: 'Rich in nutrients, holds moisture',   descHi: 'पोषक तत्वों से भरपूर, नमी बनाए रखती है',     descTa: 'ஊட்டச்சத்து நிறைந்தது, ஈரப்பதம் தக்கவைக்கிறது', descTe: 'పోషకాలు సమృద్ధి, తేమను నిలుపుతుంది' },
            { v: 'clay',       en: 'Clay / Silty',     hi: 'चिकनी / गाद',    ta: 'களிமண் / வண்டல்',    te: 'క్లే / సిల్టీ',     icon: '🔵', descEn: 'Heavy soil, good water retention',   descHi: 'भारी मिट्टी, अच्छा जल धारण',                descTa: 'கனமான மண், நல்ல நீர் தேக்கம்',              descTe: 'భారీ మట్టి, మంచి నీటి నిలుపుదల' },
            { v: 'red',        en: 'Red / Laterite',   hi: 'लाल / लेटेराइट', ta: 'சிவப்பு / லேட்டரைட்', te: 'ఎర్ర / లేటరైట్',   icon: '🔴', descEn: 'Common in peninsular India',         descHi: 'प्रायद्वीपीय भारत में सामान्य',               descTa: 'தென்னிந்தியாவில் பொதுவானது',                descTe: 'ద్వీపకల్పం భారతదేశంలో సాధారణం' },
          ].map(o => (
            <OptionBtn key={o.v} selected={data.soil === o.v} stacked onClick={() => setData(d => ({ ...d, soil: o.v }))}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{o.icon}</span>
                <div>
                  <div className="font-semibold">{o[lang] || o.en}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{o[`desc${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || o.descEn}</div>
                </div>
              </div>
            </OptionBtn>
          ))}
        </div>
      ),
    },
    {
      icon: '💧',
      titleEn: 'How much water do you have access to?', titleHi: 'आपके पास पानी कितना उपलब्ध है?', titleTa: 'உங்களுக்கு எவ்வளவு நீர் கிடைக்கிறது?', titleTe: 'మీకు ఎంత నీరు అందుబాటులో ఉంది?',
      valid: () => !!data.water,
      content: (
        <div className="space-y-2">
          {[
            { v: 'low',    en: 'Rainfed only',       hi: 'केवल बारिश पर निर्भर', ta: 'மழையை மட்டுமே நம்பி',      te: 'వర్షాధారం మాత్రమే',       icon: '🌧️', descEn: 'No bore well or canal access',  descHi: 'कोई बोरवेल या नहर नहीं',    descTa: 'போர்வெல் அல்லது கால்வாய் இல்லை',    descTe: 'బోర్వెల్ లేదా కాలువ అందుబాటు లేదు' },
            { v: 'medium', en: 'Partial irrigation',  hi: 'आंशिक सिंचाई',         ta: 'பகுதி நீர்ப்பாசனம்',      te: 'పాక్షిక నీటిపారుదల',     icon: '💦', descEn: 'Seasonal bore well or canal',   descHi: 'मौसमी बोरवेल या नहर',       descTa: 'பருவகால போர்வெல் அல்லது கால்வாய்', descTe: 'సీజనల్ బోర్వెల్ లేదా కాలువ' },
            { v: 'high',   en: 'Full irrigation',     hi: 'पूर्ण सिंचाई',          ta: 'முழு நீர்ப்பாசனம்',        te: 'పూర్తి నీటిపారుదల',      icon: '🚿', descEn: 'Reliable 24/7 water source',   descHi: 'विश्वसनीय 24/7 जल स्रोत',   descTa: 'நம்பகமான 24/7 நீர் ஆதாரம்',        descTe: 'నమ్మదగిన 24/7 నీటి వనరు' },
          ].map(o => (
            <OptionBtn key={o.v} selected={data.water === o.v} stacked onClick={() => setData(d => ({ ...d, water: o.v }))}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{o.icon}</span>
                <div>
                  <div className="font-semibold">{o[lang] || o.en}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{o[`desc${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || o.descEn}</div>
                </div>
              </div>
            </OptionBtn>
          ))}
        </div>
      ),
    },
    {
      icon: '📊',
      titleEn: 'What is your risk appetite?', titleHi: 'आप कितना जोखिम उठा सकते हैं?', titleTa: 'உங்கள் ஆபத்து எடுக்கும் திறன் என்ன?', titleTe: 'మీ రిస్క్ తట్టుకోగలిగే సామర్థ్యం ఏమిటి?',
      valid: () => !!data.risk,
      content: (
        <div className="space-y-2">
          {[
            { v: 'low',    en: 'Play it safe',      hi: 'सुरक्षित रहें',      ta: 'பாதுகாப்பாக விளையாடுங்கள்', te: 'సురక్షితంగా ఉండండి',      icon: '🟢', descEn: 'Stable MSP crops, lower but reliable income',  descHi: 'स्थिर MSP फसलें, कम लेकिन विश्वसनीय आय',   descTa: 'நிலையான MSP பயிர்கள், குறைவான ஆனால் நம்பகமான வருமானம்', descTe: 'స్థిరమైన MSP పంటలు, తక్కువ కానీ నమ్మదగిన ఆదాయం' },
            { v: 'medium', en: 'Balanced approach', hi: 'संतुलित दृष्टिकोण', ta: 'சமநிலையான அணுகுமுறை',     te: 'సమతుల్య విధానం',          icon: '🟡', descEn: 'Mix of stable and higher-return crops',        descHi: 'स्थिर और उच्च-रिटर्न फसलों का मिश्रण',      descTa: 'நிலையான மற்றும் அதிக-வருமான பயிர்களின் கலவை', descTe: 'స్థిర మరియు అధిక-రిటర్న్ పంటల మిశ్రమం' },
            { v: 'high',   en: 'Maximise profit',   hi: 'अधिकतम मुनाफा',     ta: 'அதிகபட்ச இலாபம்',         te: 'గరిష్ట లాభం',              icon: '🔴', descEn: 'Higher returns, more market exposure',         descHi: 'अधिक रिटर्न, अधिक बाज़ार जोखिम',             descTa: 'அதிக வருமானம், அதிக சந்தை வெளிப்பாடு',      descTe: 'అధిక రాబడులు, ఎక్కువ మార్కెट్ ఎక్స్పోజర్' },
          ].map(o => (
            <OptionBtn key={o.v} selected={data.risk === o.v} stacked onClick={() => setData(d => ({ ...d, risk: o.v }))}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{o.icon}</span>
                <div>
                  <div className="font-semibold">{o[lang] || o.en}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{o[`desc${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || o.descEn}</div>
                </div>
              </div>
            </OptionBtn>
          ))}
        </div>
      ),
    },
  ];

  const cur = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (!cur.valid()) {
      setError(tl('Please complete this step before continuing.','कृपया आगे बढ़ने से पहले इस चरण को पूरा करें।','தொடர்வதற்கு முன் இந்த படியை பூர்த்தி செய்யுங்கள்.','కొనసాగే ముందు ఈ దశను పూర్తి చేయండి.'));
      return;
    }
    setError('');
    if (step === steps.length - 1) {
      setUserData(data);
      router.push('/loading');
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f5f0e8 0%, #ede5d0 100%)' }}>

      {/* Left panel — motivational sidebar (desktop only) */}
      <div className="hidden lg:flex flex-col justify-center px-12 py-20 w-[400px] flex-shrink-0" style={{ background: 'linear-gradient(180deg, #1a3328 0%, #254d3c 100%)' }}>
        <div className="text-4xl mb-6">{cur.icon}</div>
        <h2 className="font-serif text-white text-3xl mb-4 leading-tight">
          {tl('2 minutes to smarter crop decisions','स्मार्ट फसल चुनाव के लिए बस 2 मिनट','2 நிமிடங்களில் புத்திசாலி பயிர் முடிவுகள்','2 నిమిషాల్లో తెలివైన పంట నిర్ణయాలు')}
        </h2>
        <p className="text-white/55 text-sm leading-relaxed mb-8">
          {STEP_HINTS[step][lang] || STEP_HINTS[step].en}
        </p>

        {/* Progress steps */}
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all ${i === step ? 'opacity-100' : i < step ? 'opacity-60' : 'opacity-25'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                i < step ? 'bg-sage text-white' : i === step ? 'bg-gold text-forest' : 'bg-white/10 text-white'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm text-white font-medium">
                {s[`title${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || s.titleEn}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mt-10 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-white text-sm font-medium mb-1">👨‍🌾 Ramesh Patil, Nashik</div>
          <div className="text-white/55 text-xs leading-relaxed">
{lang==='hi'?'"AgriSmart ने बताया कि गेहूँ की जगह सरसों लगाऊं। इस बार ₹40,000 ज़्यादा कमाया।"':lang==='ta'?'"AgriSmart என்னிடம் கோதுமையிலிருந்து கடுகுக்கு மாற சொன்னது. ₹40,000 அதிகம் சம்பாதித்தேன்."':lang==='te'?'"AgriSmart నాకు గోధుమ నుండి ఆవాలుకు మారమని చెప్పింది. ₹40,000 ఎక్కువ సంపాదించాను."':'"AgriSmart told me to switch from wheat to mustard. Earned ₹40,000 more this season."'}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-5 py-28 overflow-y-auto">
        <div className="w-full max-w-[480px]">

          {/* Mobile header */}
          <div className="lg:hidden mb-6">
            <h2 className="font-serif text-2xl text-forest mb-1">
              {tl('Tell us about your farm','अपने खेत की जानकारी दें','உங்கள் வயல் பற்றி சொல்லுங்கள்','మీ పొలం గురించి చెప్పండి')}
            </h2>
            <p className="text-sm text-forest-light">
              {tl('Get smart recommendations in 2 minutes','2 मिनट में स्मार्ट सिफारिश पाएं','2 நிமிடங்களில் புத்திசாலி பரிந்துரைகள் பெறுங்கள்','2 నిమిషాల్లో తెలివైన సిఫార్సులు పొందండి')}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-forest-light mb-2">
              <span>{lang==='hi'?`चरण ${step+1} / ${steps.length}`:lang==='ta'?`படி ${step+1} / ${steps.length}`:lang==='te'?`దశ ${step+1} / ${steps.length}`:`Step ${step+1} of ${steps.length}`}</span>
              <span>{Math.round(progress)}% {tl('complete','पूर्ण','முழுமை','పూర్తి')}</span>
            </div>
            <div className="h-2 bg-parchment rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4a8a72, #2d6650)' }}
              />
            </div>
          </div>

          {/* Step card */}
          <div key={step} className="bg-white rounded-3xl p-8 shadow-xl border border-[rgba(26,51,40,0.08)]" style={{ animation: 'fadeUp 0.4s ease forwards' }}>
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-sage mb-2">
              {lang==='hi'?`चरण ${step+1}`:lang==='ta'?`படி ${step+1}`:lang==='te'?`దశ ${step+1}`:`Step ${step+1}`}
            </div>
            <h3 className="font-serif text-[22px] text-forest mb-6">
              {cur[`title${lang.charAt(0).toUpperCase()+lang.slice(1)}`] || cur.titleEn}
            </h3>

            {cur.content}

            {/* Error message */}
            {error && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                ⚠ {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-[rgba(26,51,40,0.07)]">
              <button
                onClick={() => { setError(''); setStep(s => s - 1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium text-forest-light hover:text-forest hover:bg-forest/5 transition-all bg-transparent border-none cursor-pointer ${step === 0 ? 'invisible' : ''}`}
              >
                ← {tl('Back','वापस','திரும்பு','వెనక్కి')}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all hover:-translate-y-px hover:shadow-lg active:translate-y-0"
                style={{ background: cur.valid() ? 'linear-gradient(135deg, #1a3328, #2d6650)' : '#94a3b8', boxShadow: cur.valid() ? '0 4px 16px rgba(26,51,40,0.3)' : 'none' }}
              >
                {step === steps.length - 1
                  ? (tl('✨ Analyze My Farm','✨ खेत का विश्लेषण करें','✨ என் வயலை பகுப்பாய்வு செய்யுங்கள்','✨ నా పొలాన్ని విశ్లేషించండి'))
                  : (tl('Continue →','आगे बढ़ें →','தொடரவும் →','కొనసాగించండి →'))
                }
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-forest-light mt-5">
            🔒 {tl('Your data is private and only used to generate recommendations','आपका डेटा निजी है और केवल सिफारिशों के लिए उपयोग होता है','உங்கள் தரவு தனிப்பட்டது மற்றும் பரிந்துரைகளுக்கு மட்டுமே பயன்படுத்தப்படுகிறது','మీ డేటా ప్రైవేట్ మరియు సిఫార్సుల కోసం మాత్రమే ఉపయోగించబడుతుంది')}
          </p>
        </div>
      </div>
    </div>
  );
}
