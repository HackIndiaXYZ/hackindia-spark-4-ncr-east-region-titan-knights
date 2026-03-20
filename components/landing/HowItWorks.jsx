'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export function HowItWorks() {
  const router = useRouter();
  const { lang } = useStore();

  const header = {
    badge: { en:'How it works', hi:'यह कैसे काम करता है', ta:'எவ்வாறு செயல்படுகிறது', te:'ఎలా పని చేస్తుంది' },
    title: { en:'3 simple steps — farm decision in 30 minutes', hi:'3 आसान कदम — 30 मिनट में फैसला', ta:'3 எளிய படிகள் — 30 நிமிடங்களில் விவசாய முடிவு', te:'3 సులభ దశలు — 30 నిమిషాల్లో వ్యవసాయ నిర్ణయం' },
    sub:   { en:'No technical knowledge needed. Just tell us about your farm.', hi:'कोई तकनीकी ज्ञान ज़रूरी नहीं। बस अपने खेत की जानकारी दें।', ta:'தொழில்நுட்ப அறிவு தேவையில்லை. உங்கள் வயல் பற்றி சொல்லுங்கள்.', te:'సాంకేతిక జ్ఞానం అవసరం లేదు. మీ పొలం గురించి చెప్పండి.' },
  };

  const steps = [
    {
      n:'01', icon:'📍',
      img:'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=75&auto=format&fit=crop',
      title:{ en:'Tell us about your farm', hi:'अपना खेत बताएं', ta:'உங்கள் வயல் பற்றி சொல்லுங்கள்', te:'మీ పొలం గురించి చెప్పండి' },
      desc:{ en:'Just type your village or district. We pull 30 years of weather history and soil data for your exact location.', hi:'बस अपने गाँव या जिले का नाम लिखें। हम 30 साल का मौसम डेटा और आपकी मिट्टी का विश्लेषण करते हैं।', ta:'உங்கள் கிராமம் அல்லது மாவட்டத்தை தட்டச்சு செய்யுங்கள். உங்கள் சரியான இடத்திற்கு 30 ஆண்டு வானிலை வரலாறு மற்றும் மண் தரவை பெறுகிறோம்.', te:'మీ గ్రామం లేదా జిల్లాను టైప్ చేయండి. మేము మీ సరైన స్థానానికి 30 సంవత్సరాల వాతావరణ చరిత్ర మరియు మట్టి డేటాను తీసుకొస్తాం.' },
      time:{ en:'⏱ 2 minutes', hi:'⏱ 2 मिनट', ta:'⏱ 2 நிமிடங்கள்', te:'⏱ 2 నిమిషాలు' },
    },
    {
      n:'02', icon:'🤖',
      img:'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=75&auto=format&fit=crop',
      title:{ en:'AI ranks your best crops', hi:'AI आपकी फसल रैंक करता है', ta:'AI உங்கள் சிறந்த பயிர்களை தரவரிசைப்படுத்துகிறது', te:'AI మీ అత్యుత్తమ పంటలను ర్యాంక్ చేస్తుంది' },
      desc:{ en:'Our system scores 25+ crops against your live weather, mandi prices, water access, and budget — then ranks them.', hi:'हमारा सिस्टम 25+ फसलों को मौसम, मंडी भाव, पानी की ज़रूरत और आपके बजट के हिसाब से स्कोर करता है।', ta:'எங்கள் கணினி 25+ பயிர்களை உங்கள் நேரடி வானிலை, மண்டி விலைகள், நீர் அணுகல் மற்றும் பட்ஜெட்டுக்கு எதிராக மதிப்பிட்டு தரவரிசைப்படுத்துகிறது.', te:'మా వ్యవస్థ 25+ పంటలను మీ నేరుగా వాతావరణం, మండి ధరలు, నీటి అందుబాటు మరియు బడ్జెట్‌కు వ్యతిరేకంగా స్కోర్ చేసి ర్యాంక్ చేస్తుంది.' },
      time:{ en:'⏱ 30 seconds', hi:'⏱ 30 सेकंड', ta:'⏱ 30 வினாடிகள்', te:'⏱ 30 సెకన్లు' },
    },
    {
      n:'03', icon:'🛡️',
      img:'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=75&auto=format&fit=crop',
      title:{ en:'Stay protected with insurance', hi:'बीमा से सुरक्षित रहें', ta:'காப்பீட்டுடன் பாதுகாப்பாக இருங்கள்', te:'బీమాతో రక్షించబడండి' },
      desc:{ en:'If drought hits or prices crash — automatic payout to your account in 48 hours. No forms, no office visits.', hi:'अगर सूखा पड़े या भाव गिरे — 48 घंटे में सीधे आपके खाते में भुगतान।', ta:'வறட்சி ஏற்பட்டால் அல்லது விலைகள் சரிந்தால் — 48 மணி நேரத்தில் உங்கள் கணக்கில் தானாக செலுத்தல்.', te:'కరువు వస్తే లేదా ధరలు పడిపోతే — 48 గంటల్లో మీ ఖాతాకు స్వయంచాలక చెల్లింపు. ఫారాలు లేవు, కార్యాలయ సందర్శనలు లేవు.' },
      time:{ en:'⏱ Instant activation', hi:'⏱ तुरंत सक्रिय', ta:'⏱ உடனடி செயல்படுத்தல்', te:'⏱ తక్షణ యాక్టివేషన్' },
    },
  ];
  const stepLabel = { en:'Step', hi:'चरण', ta:'படி', te:'దశ' };
  const ctaText   = { en:'Start now — completely free', hi:'अभी शुरू करें — बिल्कुल मुफ्त', ta:'இப்போதே தொடங்குங்கள் — முற்றிலும் இலவசம்', te:'ఇప్పుడే ప్రారంభించండి — పూర్తిగా ఉచితం' };
  const ctaSub    = { en:'No credit card · Results in 2 minutes', hi:'कोई क्रेडिट कार्ड नहीं · 2 मिनट में नतीजा', ta:'கிரெடிட் கார்டு இல்லை · 2 நிமிடங்களில் முடிவுகள்', te:'క్రెడిట్ కార్డు అవసరం లేదు · 2 నిమిషాల్లో ఫలితాలు' };

  const l = lang in stepLabel ? lang : 'en';

  return (
    <section id="how" className="py-24 px-5 md:px-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block text-xs font-bold tracking-[2px] uppercase text-sage bg-sage/10 px-3 py-1 rounded-full mb-4">
            {header.badge[l]}
          </div>
          <h2 className="font-serif text-forest mb-3" style={{ fontSize:'clamp(26px, 3.5vw, 44px)' }}>{header.title[l]}</h2>
          <p className="text-forest-light text-base max-w-md mx-auto">{header.sub[l]}</p>
        </div>

        <div className="space-y-16 mb-14">
          {steps.map((s, i) => (
            <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
              <div className="w-full md:w-1/2 rounded-3xl overflow-hidden shadow-xl relative group" style={{ aspectRatio:'16/9' }}>
                <img src={s.img} alt={s.title[l]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 font-mono text-5xl font-bold text-white/20 leading-none select-none">{s.n}</div>
                <div className="absolute bottom-4 right-4 bg-forest/80 backdrop-blur-sm text-mint text-xs font-bold px-3 py-1.5 rounded-full">{s.time[l]}</div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <div className="w-12 h-12 bg-forest rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md">{s.icon}</div>
                <div className="text-[11px] font-bold tracking-[2px] uppercase text-sage mb-2">{stepLabel[l]} {i + 1}</div>
                <h3 className="font-serif text-[26px] text-forest mb-3 leading-tight">{s.title[l]}</h3>
                <p className="text-forest-light leading-relaxed text-base">{s.desc[l]}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/form')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl border-none cursor-pointer"
            style={{ background:'linear-gradient(135deg, #1a3328, #2d6650)', boxShadow:'0 4px 18px rgba(26,51,40,0.28)' }}
          >
            🌾 {ctaText[l]}<span className="text-mint">→</span>
          </button>
          <p className="text-xs text-forest-light mt-3">{ctaSub[l]}</p>
        </div>
      </div>
    </section>
  );
}
