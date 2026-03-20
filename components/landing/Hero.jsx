'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/translations';

export function Hero() {
  const router = useRouter();
  const { lang } = useStore();
  const t = useTranslation(lang);
  const [counter, setCounter] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const target = 12400;
    const step = Math.ceil(target / 55);
    const timer = setInterval(() => {
      setCounter(c => { if (c >= target) { clearInterval(timer); return target; } return Math.min(c + step, target); });
    }, 25);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setActiveTestimonial(i => (i + 1) % 3), 3500);
    return () => clearInterval(iv);
  }, []);

  const testimonials = [
    { name: 'Ramesh Patil',  loc: 'Nashik, Maharashtra',  crop: 'Mustard',  profit: '₹2.1L', avatar: '👨‍🌾' },
    { name: 'Sunita Devi',   loc: 'Ludhiana, Punjab',     crop: 'Cotton',   profit: '₹3.4L', avatar: '👩‍🌾' },
    { name: 'Mohan Reddy',   loc: 'Warangal, Telangana',  crop: 'Turmeric', profit: '₹4.2L', avatar: '🧑‍🌾' },
  ];

  const cropStrip = [
    { img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&q=70&auto=format&fit=crop', key: 'wheat' },
    { img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&q=70&auto=format&fit=crop', key: 'rice'  },
    { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70&auto=format&fit=crop', key: 'mustard' },
    { img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=200&q=70&auto=format&fit=crop', key: 'maize' },
    { img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=70&auto=format&fit=crop', key: 'cotton' },
  ];
  const cropLabels = {
    en: { wheat:'Wheat', rice:'Rice', mustard:'Mustard', maize:'Maize', cotton:'Cotton' },
    hi: { wheat:'गेहूँ', rice:'धान', mustard:'सरसों', maize:'मक्का', cotton:'कपास' },
    ta: { wheat:'கோதுமை', rice:'அரிசி', mustard:'கடுகு', maize:'மக்காச்சோளம்', cotton:'பருத்தி' },
    te: { wheat:'గోధుమ', rice:'వరి', mustard:'ఆవాలు', maize:'మొక్కజొన్న', cotton:'పత్తి' },
  };
  const labels = cropLabels[lang] || cropLabels.en;

  const heroHeadlines = {
    en: <><em className="text-gold not-italic">2× more profit</em><br />by growing the right crop at the right time</>,
    hi: <><em className="text-gold not-italic">2× ज़्यादा मुनाफा</em><br />सही फसल, सही समय पर</>,
    ta: <><em className="text-gold not-italic">2× அதிக இலாபம்</em><br />சரியான நேரத்தில் சரியான பயிர் பயிரிடுங்கள்</>,
    te: <><em className="text-gold not-italic">2× ఎక్కువ లాభం</em><br />సరైన సమయంలో సరైన పంట పండించండి</>,
  };
  const heroCta = {
    en: 'Get My Crop Recommendation — Free',
    hi: 'मेरी फसल की सिफारिश पाएं — मुफ्त',
    ta: 'என் பயிர் பரிந்துரை பெறுங்கள் — இலவசம்',
    te: 'నా పంట సిఫార్సు పొందండి — ఉచితం',
  };
  const heroSub = {
    en: 'Enter your farm location. AgriSmart reads your live weather, mandi prices, and soil — then tells you exactly which crop gives the most profit this season.',
    hi: 'अपने खेत का पता बताएं। AgriSmart आपके लाइव मौसम, मंडी भाव और मिट्टी को देखकर बताता है कि इस मौसम में कौन सी फसल सबसे फायदेमंद होगी।',
    ta: 'உங்கள் வயல் இடத்தை உள்ளிடுங்கள். AgriSmart உங்கள் நேரடி வானிலை, மண்டி விலைகள் மற்றும் மண்ணை படிக்கிறது — பின்னர் இந்த பருவத்தில் எந்த பயிர் அதிக இலாபம் தரும் என்று சரியாக சொல்கிறது.',
    te: 'మీ పొలం స్థానాన్ని నమోదు చేయండి. AgriSmart మీ నేరుగా వాతావరణం, మండి ధరలు మరియు మట్టిని చదువుతుంది — ఈ సీజన్‌లో ఏ పంట అత్యధిక లాభం ఇస్తుందో సరిగ్గా చెప్తుంది.',
  };
  const seeHow = {
    en: '▶ See how it works in 2 min',
    hi: '▶ 2 मिनट में देखें कैसे काम करता है',
    ta: '▶ 2 நிமிடத்தில் எவ்வாறு செயல்படுகிறது என்று பாருங்கள்',
    te: '▶ 2 నిమిషాల్లో ఎలా పని చేస్తుందో చూడండి',
  };
  const thisSeasonText = {
    en: 'this season', hi: 'इस सीज़न', ta: 'இந்த பருவம்', te: 'ఈ సీజన్',
  };
  const farmersText = {
    en: 'farmers growing smarter today',
    hi: 'किसान अभी उपयोग कर रहे हैं',
    ta: 'விவசாயிகள் இன்று புத்திசாலியாக வளர்கிறார்கள்',
    te: 'రైతులు నేడు తెలివిగా పెరుగుతున్నారు',
  };
  const stats = [
    { n: '₹2.4Cr+', l: { en:'paid to farmers', hi:'किसानों को मिला', ta:'விவசாயிகளுக்கு', te:'రైతులకు' } },
    { n: '94%',      l: { en:'accuracy',        hi:'सटीकता',          ta:'துல்லியம்',      te:'ఖచ్చితత్వం' } },
    { n: '48 hrs',   l: { en:'insurance payout',hi:'बीमा भुगतान',     ta:'காப்பீடு',       te:'బీమా' } },
    { n: '25+',      l: { en:'crops covered',   hi:'फसलें',            ta:'பயிர்கள்',       te:'పంటలు' } },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500076656116-558758c991c1?w=1800&q=80&auto=format&fit=crop"
          alt="Indian farmland at golden hour"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(18,38,30,0.88) 0%, rgba(26,51,40,0.72) 45%, rgba(18,38,30,0.55) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, transparent, #f5f0e8)' }} />
      </div>

      <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none" style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'200px' }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 md:px-10 pt-28 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/[0.09] border border-white/[0.18] text-mint px-4 py-2 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm" style={{ animation: 'fadeUp 0.5s ease 0.1s both' }}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {counter.toLocaleString('en-IN')}+ {farmersText[lang] || farmersText.en}
        </div>

        <h1 className="text-white font-serif leading-[1.05] max-w-4xl mb-5" style={{ fontSize: 'clamp(36px, 5.5vw, 72px)', animation: 'fadeUp 0.6s ease 0.2s both' }}>
          {heroHeadlines[lang] || heroHeadlines.en}
        </h1>

        <p className="text-white/65 max-w-[540px] leading-relaxed mb-6 text-[17px]" style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
          {heroSub[lang] || heroSub.en}
        </p>

        <div className="flex items-center gap-3 mb-8 bg-white/[0.08] border border-white/[0.15] px-4 py-3 rounded-2xl backdrop-blur-md" style={{ minWidth:300, maxWidth:420, animation:'fadeUp 0.6s ease 0.4s both' }}>
          <div className="text-2xl flex-shrink-0">{testimonials[activeTestimonial].avatar}</div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{testimonials[activeTestimonial].name}</div>
            <div className="text-white/50 text-xs truncate">
              {testimonials[activeTestimonial].loc} · {testimonials[activeTestimonial].crop} · <span className="text-green-400 font-bold">{testimonials[activeTestimonial].profit} {thisSeasonText[lang]||thisSeasonText.en}</span>
            </div>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-1.5 h-1.5 rounded-full border-none cursor-pointer transition-all ${i === activeTestimonial ? 'bg-mint' : 'bg-white/25'}`} />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12" style={{ animation: 'fadeUp 0.6s ease 0.5s both' }}>
          <button
            onClick={() => router.push('/form')}
            className="group relative px-9 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 border-none cursor-pointer overflow-hidden"
            style={{ background:'linear-gradient(135deg, #d4852a 0%, #e8a84e 100%)', boxShadow:'0 4px 28px rgba(212,133,42,0.5)' }}
          >
            <span className="relative z-10 flex items-center gap-2">🌾 {heroCta[lang]||heroCta.en}</span>
            <div className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
          </button>
          <button
            onClick={() => document.getElementById('how')?.scrollIntoView({ behavior:'smooth' })}
            className="px-6 py-4 rounded-2xl text-white/80 border border-white/25 bg-white/[0.07] text-base font-medium hover:bg-white/[0.14] hover:border-white/40 transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            {seeHow[lang]||seeHow.en}
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-10 gap-y-5" style={{ animation:'fadeUp 0.6s ease 0.6s both' }}>
          {stats.map(({ n, l }) => (
            <div key={n} className="text-center">
              <div className="font-serif text-[30px] text-white leading-none">{n}</div>
              <div className="text-[11px] text-white/45 mt-1">{l[lang]||l.en}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex gap-3 overflow-x-auto pb-6 px-5 md:px-10 no-scrollbar justify-center flex-wrap">
        {cropStrip.map(({ img, key }) => (
          <div key={key} className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group" style={{ width:110, height:80 }}>
            <img src={img} alt={labels[key]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-2 left-0 right-0 text-center text-white text-[11px] font-semibold">{labels[key]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
