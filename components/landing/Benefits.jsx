'use client';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export function Benefits() {
  const router = useRouter();
  const { lang } = useStore();
  const l = lang || 'en';

  const benefits = [
    { icon:'📈', img:'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&q=70&auto=format&fit=crop',
      title:{ en:'Know exactly which crop earns most', hi:'जानें कौन सी फसल सबसे ज़्यादा कमाएगी', ta:'எந்த பயிர் அதிகம் சம்பாதிக்கும் என்று தெரிந்துகொள்ளுங்கள்', te:'ఏ పంట అత్యధికంగా సంపాదిస్తుందో ఖచ్చితంగా తెలుసుకోండి' },
      desc:{ en:'Stop guessing. Our AI compares 25+ crops using your actual local weather, water, soil, and current mandi prices.', hi:'अनुमान बंद करें। हमारा AI आपके मौसम, पानी, मिट्टी और मंडी भाव से 25+ फसलें कंपेयर करता है।', ta:'யூகிப்பதை நிறுத்துங்கள். எங்கள் AI உங்கள் உண்மையான உள்ளூர் வானிலை, நீர், மண் மற்றும் தற்போதைய மண்டி விலைகளைப் பயன்படுத்தி 25+ பயிர்களை ஒப்பிடுகிறது.', te:'ఊహించడం ఆపండి. మా AI మీ అసలు స్థానిక వాతావరణం, నీరు, మట్టి మరియు ప్రస్తుత మండి ధరలను ఉపయోగించి 25+ పంటలను పోలుస్తుంది.' } },
    { icon:'🛡️', img:'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&q=70&auto=format&fit=crop',
      title:{ en:'Insurance that pays in 48 hours', hi:'48 घंटे में बीमा भुगतान', ta:'48 மணி நேரத்தில் செலுத்தும் காப்பீடு', te:'48 గంటల్లో చెల్లించే బీమా' },
      desc:{ en:'If drought or floods hit, money goes directly to your account. No loss assessor. No waiting months.', hi:'सूखा या बाढ़ आने पर पैसा सीधे खाते में। कोई इंतज़ार नहीं, कोई दफ्तर नहीं।', ta:'வறட்சி அல்லது வெள்ளம் வந்தால், பணம் நேரடியாக உங்கள் கணக்கில் செல்கிறது. இழப்பு மதிப்பீட்டாளர் இல்லை.', te:'కరువు లేదా వరదలు వస్తే, డబ్బు నేరుగా మీ ఖాతాకు వెళ్ళుతుంది. నష్ట మదింపుదారు అవసరం లేదు.' } },
    { icon:'☁️', img:'https://images.unsplash.com/photo-1504608524841-42584120d693?w=400&q=70&auto=format&fit=crop',
      title:{ en:'Live weather for your exact farm', hi:'आपके खेत का लाइव मौसम', ta:'உங்கள் சரியான வயலுக்கான நேரடி வானிலை', te:'మీ సరైన పొలానికి నేరుగా వాతావరణం' },
      desc:{ en:'Not district-level estimates. We use satellite data accurate to within 1km of your farm.', hi:'जिला स्तर का अनुमान नहीं। हम आपके खेत के 1km के सैटेलाइट डेटा का उपयोग करते हैं।', ta:'மாவட்ட அளவிலான மதிப்பீடுகள் அல்ல. உங்கள் வயலுக்கு 1km துல்லியமான செயற்கைக்கோள் தரவை பயன்படுத்துகிறோம்.', te:'జిల్లా-స్థాయి అంచనాలు కావు. మేము మీ పొలానికి 1km లోపల ఖచ్చితమైన ఉపగ్రహ డేటాను ఉపయోగిస్తాం.' } },
    { icon:'📰', img:'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=70&auto=format&fit=crop',
      title:{ en:'Market news that affects your crops', hi:'आपकी फसल पर असर करने वाली खबरें', ta:'உங்கள் பயிர்களை பாதிக்கும் சந்தை செய்திகள்', te:'మీ పంటలను ప్రభావితం చేసే మార్కెట్ వార్తలు' },
      desc:{ en:"AI reads today's agriculture news and tells you if it raises or lowers your crop's expected price.", hi:'AI आज की कृषि खबरें पढ़कर बताता है — आपकी फसल का भाव बढ़ेगा या घटेगा।', ta:"AI இன்றைய விவசாய செய்திகளை படித்து உங்கள் பயிரின் எதிர்பார்க்கப்படும் விலையை உயர்த்துகிறதா அல்லது குறைக்கிறதா என்று சொல்கிறது.", te:"AI నేటి వ్యవసాయ వార్తలు చదివి మీ పంట అంచనా ధర పెరుగుతుందా లేదా తగ్గుతుందా అని చెప్తుంది." } },
    { icon:'🌾', img:'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=70&auto=format&fit=crop',
      title:{ en:'25+ crops across all Indian states', hi:'सभी भारतीय राज्यों में 25+ फसलें', ta:'அனைத்து இந்திய மாநிலங்களிலும் 25+ பயிர்கள்', te:'అన్ని భారతీయ రాష్ట్రాల్లో 25+ పంటలు' },
      desc:{ en:'From apple in Himachal to coconut in Kerala. Crops filtered by your exact state, altitude, and season.', hi:'हिमाचल में सेब से केरल में नारियल तक। आपके राज्य, ऊंचाई और मौसम के अनुसार फसलें।', ta:'இமாச்சலில் ஆப்பிள் முதல் கேரளாவில் தேங்காய் வரை. உங்கள் சரியான மாநிலம், உயரம் மற்றும் பருவத்தால் வடிகட்டப்பட்ட பயிர்கள்.', te:'హిమాచల్‌లో ఆపిల్ నుండి కేరళలో కొబ్బరి వరకు. మీ సరైన రాష్ట్రం, ఎత్తు మరియు సీజన్ ద్వారా ఫిల్టర్ చేయబడిన పంటలు.' } },
    { icon:'⛓️', img:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=70&auto=format&fit=crop',
      title:{ en:'Transparent — every decision explained', hi:'पारदर्शी — हर फैसले की वजह', ta:'வெளிப்படையான — ஒவ்வொரு முடிவும் விளக்கப்பட்டது', te:'పారదర్శక — ప్రతి నిర్ణయం వివరించబడింది' },
      desc:{ en:"We show you exactly WHY each crop is recommended. Not a black box — you understand the reasoning.", hi:'हम बताते हैं कि हर फसल क्यों सुझाई गई। कोई रहस्य नहीं — आप समझते हैं।', ta:'ஒவ்வொரு பயிரும் ஏன் பரிந்துரைக்கப்படுகிறது என்று சரியாக காட்டுகிறோம். கருப்பு பெட்டி இல்லை — நீங்கள் காரணத்தை புரிந்துகொள்கிறீர்கள்.', te:'ప్రతి పంట ఎందుకు సిఫార్సు చేయబడిందో మీకు ఖచ్చితంగా చూపిస్తాం. బ్లాక్ బాక్స్ కాదు — మీరు తర్కాన్ని అర్థం చేసుకుంటారు.' } },
  ];

  const tx = {
    trustBadge:    { en:'Farmers across India trust AgriSmart', hi:'इन राज्यों के किसान AgriSmart पर भरोसा करते हैं', ta:'இந்தியா முழுவதும் உள்ள விவசாயிகள் AgriSmart ஐ நம்புகிறார்கள்', te:'భారతదేశం అంతటా రైతులు AgriSmart ని నమ్ముతారు' },
    fieldQuote:    { en:'"AgriSmart told me to switch from wheat to mustard. I earned ₹40,000 more this season."', hi:'"AgriSmart ने बताया कि गेहूँ की जगह सरसों लगाऊं। इस बार ₹40,000 ज़्यादा कमाया।"', ta:'"AgriSmart என்னிடம் கோதுமையிலிருந்து கடுகுக்கு மாற சொன்னது. இந்த பருவத்தில் ₹40,000 அதிகம் சம்பாதித்தேன்."', te:'"AgriSmart నాకు గోధుమ నుండి ఆవాలుకు మారమని చెప్పింది. ఈ సీజన్‌లో ₹40,000 ఎక్కువ సంపాదించాను."' },
    farmerName:    { en:'Ramesh Patil', hi:'रमेश पाटिल', ta:'ரமேஷ் பாட்டீல்', te:'రమేష్ పాటిల్' },
    farmerLoc:     { en:'Nashik, Maharashtra', hi:'नासिक, महाराष्ट्र', ta:'நாசிக், மகாராஷ்டிரா', te:'నాసిక్, మహారాష్ట్ర' },
    fromField:     { en:'From the field', hi:'किसानों की आवाज़', ta:'வயலிலிருந்து', te:'పొలం నుండి' },
    benBadge:      { en:"Why farmers trust AgriSmart", hi:'फायदे', ta:'AgriSmart ஐ ஏன் நம்புகிறார்கள்', te:'AgriSmart ని ఎందుకు నమ్ముతారు' },
    benTitle:      { en:'Built for real farmers, not just big agribusiness', hi:'हर किसान के लिए, हर खेत के लिए', ta:'உண்மையான விவசாயிகளுக்காக கட்டமைக்கப்பட்டது', te:'నిజమైన రైతుల కోసం నిర్మించబడింది' },
    compTitle:     { en:'AgriSmart vs. the traditional way', hi:'AgriSmart बनाम पारंपरिक तरीका', ta:'AgriSmart vs பாரம்பரிய முறை', te:'AgriSmart vs సాంప్రదాయ మార్గం' },
    featLabel:     { en:'Feature', hi:'विषय', ta:'அம்சம்', te:'ఫీచర్' },
    oldLabel:      { en:'Old way', hi:'पुराना तरीका', ta:'பழைய முறை', te:'పాత మార్గం' },
    footerTag:     { en:'Smart farming decisions powered by live data, protected by blockchain.', hi:'डेटा से संचालित, ब्लॉकचेन से सुरक्षित स्मार्ट खेती के निर्णय।', ta:'நேரடி தரவால் இயக்கப்படும், Blockchain பாதுகாக்கப்படும் விவசாய முடிவுகள்.', te:'నేరుగా డేటా ద్వారా నడిపించబడే, Blockchain ద్వారా రక్షించబడిన వ్యవసాయ నిర్ణయాలు.' },
    finalTitle:    { en:'Make the right crop decision this season', hi:'इस मौसम में सही फसल चुनें', ta:'இந்த பருவத்தில் சரியான பயிர் முடிவை எடுங்கள்', te:'ఈ సీజన్‌లో సరైన పంట నిర్ణయం తీసుకోండి' },
    finalSub:      { en:"12,400+ farmers are already making smarter decisions. Join them today — it's free.", hi:'12,400+ किसान पहले से बेहतर फैसले ले रहे हैं। आज ही शुरू करें — मुफ्त में।', ta:'12,400+ விவசாயிகள் ஏற்கனவே புத்திசாலி முடிவுகளை எடுக்கிறார்கள். இன்றே சேருங்கள் — இலவசம்.', te:'12,400+ రైతులు ఇప్పటికే తెలివైన నిర్ణయాలు తీసుకుంటున్నారు. నేడే చేరండి — ఉచితం.' },
    finalCta:      { en:'🌾 Get My Free Crop Recommendation', hi:'🌾 अभी अपनी फसल चुनें', ta:'🌾 என் இலவச பயிர் பரிந்துரை பெறுங்கள்', te:'🌾 నా ఉచిత పంట సిఫార్సు పొందండి' },
    noCard:        { en:'No credit card', hi:'कोई क्रेडिट कार्ड नहीं', ta:'கிரெடிட் கார்டு இல்லை', te:'క్రెడిట్ కార్డు అవసరం లేదు' },
    twoMin:        { en:'Results in 2 min', hi:'2 मिनट में नतीजा', ta:'2 நிமிடங்களில் முடிவுகள்', te:'2 నిమిషాల్లో ఫలితాలు' },
    allStates:     { en:'All 28 states covered', hi:'सभी 28 राज्यों में', ta:'28 மாநிலங்கள் உள்ளடக்கப்பட்டுள்ளன', te:'28 రాష్ट్రాలు కవర్ చేయబడ్డాయి' },
    protoDemo:     { en:'Prototype Demo', hi:'प्रोटोटाइप डेमो', ta:'முன்மாதிரி டெமோ', te:'ప్రోటోటైప్ డెమో' },
  };

  const compRows = [
    { feat:{en:'Crop decision',hi:'फसल का फैसला',ta:'பயிர் முடிவு',te:'పంట నిర్ణయం'}, old:{en:'Guesswork & neighbour advice',hi:'पड़ोसी/अनुभव',ta:'யூகிப்பு & அண்டை நாட்டின் ஆலோசனை',te:'ఊహలు & పొరుగువారి సలహా'}, nw:{en:'AI + live weather + mandi prices',hi:'AI + लाइव मौसम + मंडी',ta:'AI + நேரடி வானிலை + மண்டி விலைகள்',te:'AI + నేరుగా వాతావరణం + మండి ధరలు'} },
    { feat:{en:'Insurance payout',hi:'बीमा भुगतान',ta:'காப்பீடு செலுத்தல்',te:'బీమా చెల్లింపు'}, old:{en:'3–6 months of paperwork',hi:'3–6 महीने',ta:'3–6 மாதங்கள் கాகித வேலை',te:'3–6 నెలల పేపర్‌వర్క్'}, nw:{en:'48 hours, directly to bank',hi:'48 घंटे, सीधे खाते में',ta:'48 மணி நேரம், நேரடியாக வங்கியில்',te:'48 గంటలు, నేరుగా బ్యాంకుకు'} },
    { feat:{en:'Weather info',hi:'मौसम जानकारी',ta:'வானிலை தகவல்',te:'వాతావరణ సమాచారం'}, old:{en:'District-level estimate',hi:'जिला स्तर, पुराना डेटा',ta:'மாவட்ட அளவிலான மதிப்பீடு',te:'జిల్లా-స్థాయి అంచనా'}, nw:{en:'1km accurate, 30-year baseline',hi:'1km सटीक, 30 साल डेटा',ta:'1km துல்லியம், 30 ஆண்டு அடிப்படை',te:'1km ఖచ్చితం, 30 సంవత్సరాల ప్రాతిపదిక'} },
    { feat:{en:'Cost',hi:'कीमत',ta:'செலவு',te:'ఖర్చు'}, old:{en:'Agent commission + delays',hi:'एजेंट कमीशन + देरी',ta:'ஏஜென்ட் கமிஷன் + தாமதங்கள்',te:'ఏజెంట్ కమిషన్ + ఆలస్యాలు'}, nw:{en:'Free to start',hi:'बिल्कुल मुफ्त',ta:'தொடங்க இலவசம்',te:'ప్రారంభించడానికి ఉచితం'} },
  ];

  const footerLinks = [
    { en:'Crop Recommendation', hi:'फसल सिफारिश', ta:'பயிர் பரிந்துரை', te:'పంట సిఫార్సు' },
    { en:'Risk Analysis', hi:'जोखिम विश्लेषण', ta:'ஆபத்து பகுப்பாய்வு', te:'రిస్క్ విశ్లేషణ' },
    { en:'Insurance', hi:'बीमा', ta:'காப்பீடு', te:'బీమా' },
    { en:'Weather', hi:'मौसम', ta:'வானிலை', te:'వాతావరణం' },
  ];

  return (
    <>
      {/* Social proof strip */}
      <section className="py-10 px-5 md:px-10 overflow-hidden" style={{ background:'#f5f0e8' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-bold tracking-[2px] uppercase text-forest-light/50 mb-6">{tx.trustBadge[l]}</p>
          <div className="flex gap-6 flex-wrap justify-center text-sm font-medium text-forest-light/60">
            <span>Punjab · Haryana · UP · Rajasthan · Maharashtra · Karnataka · Andhra Pradesh · Telangana · Tamil Nadu · Gujarat · MP · Bihar · West Bengal · Odisha · Kerala</span>
          </div>
        </div>
      </section>

      {/* Field photo banner */}
      <section className="relative h-[300px] md:h-[380px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1589923188651-268a9765e432?w=1600&q=80&auto=format&fit=crop" alt="Lush green Indian fields" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(to right, rgba(18,38,30,0.75) 0%, rgba(18,38,30,0.2) 60%, transparent 100%)' }} />
        <div className="absolute inset-0 flex items-center px-8 md:px-16">
          <div className="max-w-lg">
            <p className="text-mint text-xs font-bold tracking-[2px] uppercase mb-3">{tx.fromField[l]}</p>
            <blockquote className="font-serif text-white text-xl md:text-2xl leading-snug mb-4">{tx.fieldQuote[l]}</blockquote>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber/80 flex items-center justify-center text-lg">👨‍🌾</div>
              <div>
                <p className="text-white font-semibold text-sm">{tx.farmerName[l]}</p>
                <p className="text-white/50 text-xs">{tx.farmerLoc[l]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section id="benefits" className="py-24 px-5 md:px-10" style={{ background:'#f5f0e8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold tracking-[2px] uppercase text-sage bg-sage/10 px-3 py-1 rounded-full mb-4">{tx.benBadge[l]}</div>
            <h2 className="font-serif text-forest" style={{ fontSize:'clamp(24px, 3.5vw, 42px)' }}>{tx.benTitle[l]}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {benefits.map((b, i) => (
              <div key={i} className="group rounded-3xl overflow-hidden border border-[rgba(26,51,40,0.10)] bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default">
                <div className="relative h-36 overflow-hidden">
                  <img src={b.img} alt={b.title[l]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/70 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-2xl">{b.icon}</span>
                </div>
                <div className="p-5">
                  <h4 className="font-serif text-[17px] text-forest mb-2">{b.title[l]}</h4>
                  <p className="text-sm text-forest-light leading-relaxed">{b.desc[l]}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-3xl border border-[rgba(26,51,40,0.12)] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-[rgba(26,51,40,0.08)] flex items-center gap-3">
              <div className="w-8 h-8 bg-forest rounded-xl flex items-center justify-center text-sm">⚡</div>
              <h3 className="font-serif text-lg text-forest">{tx.compTitle[l]}</h3>
            </div>
            <div className="grid grid-cols-3 px-6 py-3 bg-parchment/50 text-[11px] font-bold uppercase tracking-wider text-forest-light">
              <span>{tx.featLabel[l]}</span>
              <span className="text-red-400">{tx.oldLabel[l]}</span>
              <span className="text-sage">AgriSmart</span>
            </div>
            <div className="divide-y divide-[rgba(26,51,40,0.06)]">
              {compRows.map((row, i) => (
                <div key={i} className="grid grid-cols-3 px-6 py-4 text-sm items-center">
                  <div className="font-semibold text-forest">{row.feat[l]}</div>
                  <div className="text-red-400 flex items-start gap-1.5 text-xs"><span>✗</span>{row.old[l]}</div>
                  <div className="text-sage font-medium flex items-start gap-1.5 text-xs"><span>✓</span>{row.nw[l]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Crop mosaic */}
      <section className="py-0 overflow-hidden">
        <div className="flex h-52 md:h-72">
          {['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=70&auto=format&fit=crop','https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=70&auto=format&fit=crop','https://images.unsplash.com/photo-1589923188651-268a9765e432?w=400&q=70&auto=format&fit=crop','https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=70&auto=format&fit=crop','https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70&auto=format&fit=crop'].map((src,i) => (
            <div key={i} className="flex-1 overflow-hidden relative"><img src={src} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" /></div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-5 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80&auto=format&fit=crop" alt="farm at dusk" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, rgba(18,38,30,0.92), rgba(37,77,60,0.88))' }} />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="text-5xl mb-5">🌾</div>
          <h2 className="font-serif text-white mb-4" style={{ fontSize:'clamp(24px, 3.5vw, 44px)' }}>{tx.finalTitle[l]}</h2>
          <p className="text-white/60 text-base mb-8 leading-relaxed max-w-md mx-auto">{tx.finalSub[l]}</p>
          <button
            onClick={() => router.push('/form')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl border-none cursor-pointer"
            style={{ background:'linear-gradient(135deg, #d4852a, #e8a84e)', boxShadow:'0 4px 28px rgba(212,133,42,0.45)' }}
          >
            {tx.finalCta[l]}
          </button>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5 text-xs text-white/40">
            <span>✓ {tx.noCard[l]}</span>
            <span>✓ {tx.twoMin[l]}</span>
            <span>✓ {tx.allStates[l]}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background:'#111e18' }} className="px-8 pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-forest rounded-lg flex items-center justify-center text-sm">🌱</div>
                <span className="font-serif text-xl text-white">AgriSmart</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">{tx.footerTag[l]}</p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm text-white/35">
              {footerLinks.map(lnk => (
                <button key={lnk.en} onClick={() => router.push('/form')} className="hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer text-white/35 text-sm">{lnk[l]||lnk.en}</button>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.07] pt-6 text-xs text-white/20 text-center">
            © 2025 AgriSmart Technologies · {tx.protoDemo[l]} · Built for innovation
          </div>
        </div>
      </footer>
    </>
  );
}
