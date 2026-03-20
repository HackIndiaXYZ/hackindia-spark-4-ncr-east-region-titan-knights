/**
 * Per-crop market intelligence, government schemes, and comparison data.
 * Used by the crop detail page to show deep insights beyond the basic recommendation.
 */

export const CROP_INSIGHTS = {
  wheat: {
    marketRates: {
      msp: 2275,
      currentMandi: 2380,
      lastMonthMandi: 2210,
      trend: 'rising',
      trendPct: 7.7,
      bestSellMonths: ['March', 'April'],
      bestSellMonthsHi: ['मार्च', 'अप्रैल'],
      topMandis: [
        { name: 'Khanna, Punjab', price: 2410 },
        { name: 'Indore, MP', price: 2395 },
        { name: 'Karnal, Haryana', price: 2385 },
      ],
      priceHistory: [
        { month: 'Sep', price: 2100 }, { month: 'Oct', price: 2150 },
        { month: 'Nov', price: 2180 }, { month: 'Dec', price: 2210 },
        { month: 'Jan', price: 2250 }, { month: 'Feb', price: 2310 },
        { month: 'Mar', price: 2380 },
      ],
    },
    subsidies: [
      { scheme: 'PM-KISAN', amount: '₹6,000/year', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष', eligibilityHi: 'सभी भूमिधारक किसान' },
      { scheme: 'Pradhan Mantri Fasal Bima Yojana', amount: '2% premium, full coverage', eligibility: 'Notified wheat-growing areas', schemeHi: 'प्रधानमंत्री फसल बीमा योजना', amountHi: '2% प्रीमियम, पूर्ण कवरेज', eligibilityHi: 'अधिसूचित गेहूँ उगाने वाले क्षेत्र' },
      { scheme: 'National Food Security Mission', amount: 'Seed subsidy up to ₹500/qtl', eligibility: 'Selected districts', schemeHi: 'राष्ट्रीय खाद्य सुरक्षा मिशन', amountHi: 'बीज सब्सिडी ₹500/क्विंटल तक', eligibilityHi: 'चयनित जिले' },
      { scheme: 'Urea Subsidy', amount: '₹242/bag (govt subsidised)', eligibility: 'All registered farmers', schemeHi: 'यूरिया सब्सिडी', amountHi: '₹242/बैग (सरकार अनुदानित)', eligibilityHi: 'सभी पंजीकृत किसान' },
    ],
    whyBetter: {
      en: ['MSP of ₹2,275/qtl guaranteed — price floor protects you even in bad years', 'Global wheat shortage (Russia-Ukraine impact) pushing export demand up 34%', 'FCI procures heavily — no risk of being stuck with unsold stock', 'Rabi crop — avoids monsoon uncertainty entirely'],
      hi: ['₹2,275/क्विंटल MSP गारंटीड — बुरे साल में भी कीमत सुरक्षित', 'वैश्विक गेहूँ की कमी (रूस-यूक्रेन प्रभाव) निर्यात मांग 34% बढ़ा रही है', 'FCI भारी खरीद करती है — बिना बिकी फसल का जोखिम नहीं', 'रबी फसल — मानसून की अनिश्चितता से पूरी तरह बचाव'],
    },
    risks: {
      en: ['Requires 4–6 irrigations — water cost ₹3,000–5,000/acre', 'Rust disease risk if humidity rises above 80% in Feb–Mar', 'Market glut possible if all farmers in region grow wheat simultaneously'],
      hi: ['4–6 सिंचाई की ज़रूरत — पानी लागत ₹3,000–5,000/एकड़', 'फरवरी-मार्च में नमी 80% से ऊपर होने पर रस्ट रोग का खतरा', 'यदि क्षेत्र के सभी किसान एक साथ गेहूँ उगाएं तो बाज़ार में अधिकता संभव'],
    },
    negotiationTips: {
      en: 'Wait until April — post-harvest demand from flour mills peaks. Target ₹2,400–2,500/qtl at Khanna or Indore mandis. Avoid selling in January (pre-harvest pressure keeps prices low). Register on eNAM platform to compare prices across mandis without physically visiting.',
      hi: 'अप्रैल तक इंतजार करें — फसल कटाई के बाद आटा मिलों की मांग चरम पर होती है। खन्ना या इंदौर मंडी में ₹2,400–2,500/क्विंटल का लक्ष्य रखें। जनवरी में न बेचें (प्री-हार्वेस्ट दबाव कीमतें कम रखता है)। eNAM प्लेटफॉर्म पर रजिस्टर करें।',
    },
    inputCosts: { seed: 2500, fertilizer: 4500, irrigation: 4000, pesticide: 1500, harvest: 3000, total: 15500 },
    yieldPerAcre: { min: 15, max: 22, avg: 18, unit: 'qtl' },
  },

  mustard: {
    marketRates: {
      msp: 5650,
      currentMandi: 5820,
      lastMonthMandi: 5510,
      trend: 'rising',
      trendPct: 5.6,
      bestSellMonths: ['April', 'May'],
      bestSellMonthsHi: ['अप्रैल', 'मई'],
      topMandis: [
        { name: 'Alwar, Rajasthan', price: 5890 },
        { name: 'Kota, Rajasthan', price: 5850 },
        { name: 'Mathura, UP', price: 5820 },
      ],
      priceHistory: [
        { month: 'Sep', price: 5100 }, { month: 'Oct', price: 5200 },
        { month: 'Nov', price: 5350 }, { month: 'Dec', price: 5450 },
        { month: 'Jan', price: 5510 }, { month: 'Feb', price: 5640 },
        { month: 'Mar', price: 5820 },
      ],
    },
    subsidies: [
      { scheme: 'National Mission on Oilseeds', amount: 'Seed mini-kit: Free HY seeds', eligibility: 'Selected oilseed growing districts', schemeHi: 'राष्ट्रीय तिलहन मिशन', amountHi: 'बीज मिनी-किट: मुफ्त HY बीज', eligibilityHi: 'चयनित तिलहन उगाने वाले जिले' },
      { scheme: 'PM-KISAN', amount: '₹6,000/year direct benefit', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष प्रत्यक्ष लाभ', eligibilityHi: 'सभी भूमिधारक किसान' },
      { scheme: 'PMFBY Crop Insurance', amount: '1.5% premium for Rabi crops', eligibility: 'Loanee and non-loanee farmers', schemeHi: 'PMFBY फसल बीमा', amountHi: 'रबी फसलों के लिए 1.5% प्रीमियम', eligibilityHi: 'ऋणी और गैर-ऋणी किसान' },
    ],
    whyBetter: {
      en: ['India imports 60% of edible oil — domestic mustard oil demand surging', 'Highly drought-tolerant — survives on just 2–3 irrigations', 'MSP raised to ₹5,650/qtl — among highest ever for mustard', 'Short 110-day crop — frees land early for a second crop'],
      hi: ['भारत 60% खाद्य तेल आयात करता है — घरेलू सरसों तेल की मांग बढ़ रही है', 'अत्यधिक सूखा-सहिष्णु — केवल 2–3 सिंचाई पर जीवित रहती है', 'MSP ₹5,650/क्विंटल — सरसों के लिए अब तक का सर्वाधिक', '110 दिन की छोटी फसल — दूसरी फसल के लिए जल्दी ज़मीन खाली'],
    },
    risks: {
      en: ['Aphid attack can destroy 40–50% yield if not managed in Jan–Feb', 'Price volatile — can drop 20% if imports surge', 'Needs well-drained soil — waterlogging causes immediate crop loss'],
      hi: ['जनवरी-फरवरी में माहू का हमला 40–50% उपज नष्ट कर सकता है', 'कीमत अस्थिर — आयात बढ़ने पर 20% गिर सकती है', 'अच्छी जल निकासी वाली मिट्टी चाहिए — जलभराव से तुरंत फसल नुकसान'],
    },
    negotiationTips: {
      en: 'Target Rajasthan mandis (Alwar, Kota) for best prices — largest mustard markets in India. Sell in April–May when oil mills are actively stocking. Store if current price is under ₹5,500/qtl — prices typically rise ₹200–300 in summer.',
      hi: 'सर्वोत्तम कीमतों के लिए राजस्थान मंडियां (अलवर, कोटा) लक्षित करें — भारत के सबसे बड़े सरसों बाज़ार। अप्रैल-मई में बेचें जब तेल मिलें सक्रिय रूप से स्टॉक कर रही हों। यदि वर्तमान कीमत ₹5,500/क्विंटल से कम है तो स्टोर करें।',
    },
    inputCosts: { seed: 1200, fertilizer: 3500, irrigation: 2000, pesticide: 1800, harvest: 2500, total: 11000 },
    yieldPerAcre: { min: 6, max: 12, avg: 9, unit: 'qtl' },
  },

  chickpea: {
    marketRates: {
      msp: 5440,
      currentMandi: 5680,
      lastMonthMandi: 5420,
      trend: 'rising',
      trendPct: 4.8,
      bestSellMonths: ['March', 'April'],
      bestSellMonthsHi: ['मार्च', 'अप्रैल'],
      topMandis: [
        { name: 'Indore, MP', price: 5750 },
        { name: 'Akola, Maharashtra', price: 5700 },
        { name: 'Bikaner, Rajasthan', price: 5680 },
      ],
      priceHistory: [
        { month: 'Sep', price: 4800 }, { month: 'Oct', price: 4950 },
        { month: 'Nov', price: 5100 }, { month: 'Dec', price: 5250 },
        { month: 'Jan', price: 5420 }, { month: 'Feb', price: 5550 },
        { month: 'Mar', price: 5680 },
      ],
    },
    subsidies: [
      { scheme: 'National Food Security Mission — Pulses', amount: 'Seed subsidy 50% for certified varieties', eligibility: 'Farmers in notified pulse districts', schemeHi: 'राष्ट्रीय खाद्य सुरक्षा मिशन — दलहन', amountHi: 'प्रमाणित किस्मों पर 50% बीज सब्सिडी', eligibilityHi: 'अधिसूचित दलहन जिलों के किसान' },
      { scheme: 'PM-AASHA Price Support', amount: 'Procurement at full MSP if market falls below', eligibility: 'Registered farmers in notified states', schemeHi: 'PM-AASHA मूल्य समर्थन', amountHi: 'बाज़ार MSP से नीचे जाने पर पूर्ण MSP पर खरीद', eligibilityHi: 'अधिसूचित राज्यों के पंजीकृत किसान' },
      { scheme: 'PM-KISAN', amount: '₹6,000/year', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष', eligibilityHi: 'सभी भूमिधारक किसान' },
    ],
    whyBetter: {
      en: ['India has structural pulse deficit — imports consistently high, pushing domestic prices up', 'Nitrogen-fixing root bacteria reduces next crop\'s fertilizer need by 20–30%', 'MSP raised ₹400/qtl this year — strong government support signal', 'Low water requirement — ideal for areas with irregular irrigation'],
      hi: ['भारत में दाल की पुरानी कमी — आयात लगातार अधिक, घरेलू कीमतें ऊंची', 'नाइट्रोजन-स्थिरीकरण जड़ बैक्टीरिया अगली फसल की खाद आवश्यकता 20–30% कम करते हैं', 'इस साल MSP ₹400/क्विंटल बढ़ा — मजबूत सरकारी समर्थन संकेत', 'कम पानी की ज़रूरत — अनियमित सिंचाई वाले क्षेत्रों के लिए आदर्श'],
    },
    risks: {
      en: ['Pod borer can cause 30–40% loss — requires timely pesticide management', 'Unseasonal rain during flowering stage reduces yield significantly', 'Market price volatile — can swing ±15% depending on import policy'],
      hi: ['फली बेधक 30–40% नुकसान कर सकता है — समय पर कीटनाशक प्रबंधन ज़रूरी', 'फूल आने के दौरान बेमौसम बारिश उपज काफी कम करती है', 'बाज़ार कीमत अस्थिर — आयात नीति के अनुसार ±15% उतार-चढ़ाव'],
    },
    negotiationTips: {
      en: 'Desi chana (desi variety) fetches 8–12% premium over Kabuli at most mandis. Target Indore and Akola — largest chana trading hubs. Register under PM-AASHA to ensure MSP safety net. Avoid distress selling in February — wait for March when dal mills are buying for summer stock.',
      hi: 'देसी चना अधिकांश मंडियों में काबुली से 8–12% अधिक कीमत लाता है। इंदौर और अकोला लक्षित करें — सबसे बड़े चना ट्रेडिंग हब। PM-AASHA के तहत पंजीकरण करें। फरवरी में संकट बिक्री से बचें — मार्च तक इंतजार करें।',
    },
    inputCosts: { seed: 2200, fertilizer: 2800, irrigation: 1500, pesticide: 2000, harvest: 2200, total: 10700 },
    yieldPerAcre: { min: 5, max: 10, avg: 7, unit: 'qtl' },
  },

  cotton: {
    marketRates: {
      msp: 7121,
      currentMandi: 7350,
      lastMonthMandi: 7080,
      trend: 'rising',
      trendPct: 3.8,
      bestSellMonths: ['November', 'December'],
      bestSellMonthsHi: ['नवंबर', 'दिसंबर'],
      topMandis: [
        { name: 'Akola, Maharashtra', price: 7420 },
        { name: 'Rajkot, Gujarat', price: 7400 },
        { name: 'Adilabad, Telangana', price: 7350 },
      ],
      priceHistory: [
        { month: 'Jul', price: 6800 }, { month: 'Aug', price: 6900 },
        { month: 'Sep', price: 7000 }, { month: 'Oct', price: 7080 },
        { month: 'Nov', price: 7200 }, { month: 'Dec', price: 7350 },
        { month: 'Jan', price: 7300 },
      ],
    },
    subsidies: [
      { scheme: 'Technology Mission on Cotton', amount: 'BT cotton seed subsidy in select states', eligibility: 'Small and marginal farmers', schemeHi: 'कपास पर प्रौद्योगिकी मिशन', amountHi: 'चुनिंदा राज्यों में BT कपास बीज सब्सिडी', eligibilityHi: 'लघु और सीमांत किसान' },
      { scheme: 'PMFBY', amount: '5% premium, comprehensive coverage', eligibility: 'Kharif cotton growers', schemeHi: 'PMFBY', amountHi: '5% प्रीमियम, व्यापक कवरेज', eligibilityHi: 'खरीफ कपास उत्पादक' },
      { scheme: 'PM-KISAN', amount: '₹6,000/year', eligibility: 'All registered farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष', eligibilityHi: 'सभी पंजीकृत किसान' },
    ],
    whyBetter: {
      en: ['Global cotton demand recovering strongly post-COVID textile revival', 'MSP of ₹7,121/qtl among highest in all crops', 'Black cotton soil in Vidarbha gives natural yield advantage', 'Textile export push — government actively promoting cotton production'],
      hi: ['COVID के बाद कपड़ा पुनरुद्धार से वैश्विक कपास मांग मजबूती से वापस', 'सभी फसलों में सबसे अधिक MSP ₹7,121/क्विंटल', 'विदर्भ में काली कपास मिट्टी प्राकृतिक उपज लाभ देती है', 'कपड़ा निर्यात प्रोत्साहन — सरकार कपास उत्पादन सक्रिय रूप से बढ़ावा दे रही है'],
    },
    risks: {
      en: ['Pink bollworm resistant to BT cotton — requires intensive pest management', 'Heavy water user — 8–10 irrigations needed for full yield', 'Market price can swing 20–30% based on international cotton prices', 'Long 180-day crop — ties up land through entire Kharif season'],
      hi: ['गुलाबी बॉलवर्म BT कपास के प्रति प्रतिरोधी — गहन कीट प्रबंधन ज़रूरी', 'अधिक पानी — पूर्ण उपज के लिए 8–10 सिंचाई आवश्यक', 'अंतरराष्ट्रीय कपास कीमतों के आधार पर 20–30% उतार-चढ़ाव', '180 दिन की लंबी फसल — पूरे खरीफ मौसम में ज़मीन बंधी'],
    },
    negotiationTips: {
      en: 'Sell in November–December when ginning factories are actively buying. Akola (Maharashtra) and Rajkot (Gujarat) mandis offer highest prices. Grade your cotton — clean, well-ginned cotton fetches ₹200–400/qtl premium. Avoid selling in July–August (lowest prices). Join a farmer producer organisation (FPO) to negotiate bulk rates.',
      hi: 'नवंबर-दिसंबर में बेचें जब जिनिंग फैक्ट्रियां सक्रिय रूप से खरीद रही हों। अकोला (महाराष्ट्र) और राजकोट (गुजरात) मंडियां सर्वोच्च कीमतें देती हैं। कपास को ग्रेड करें — ₹200–400/क्विंटल प्रीमियम मिलता है। FPO से जुड़ें।',
    },
    inputCosts: { seed: 3500, fertilizer: 5500, irrigation: 6000, pesticide: 5000, harvest: 4500, total: 24500 },
    yieldPerAcre: { min: 8, max: 15, avg: 11, unit: 'qtl' },
  },

  rice: {
    marketRates: {
      msp: 2300,
      currentMandi: 2180,
      lastMonthMandi: 2250,
      trend: 'falling',
      trendPct: -3.1,
      bestSellMonths: ['November', 'December'],
      bestSellMonthsHi: ['नवंबर', 'दिसंबर'],
      topMandis: [
        { name: 'Karnal, Haryana', price: 2350 },
        { name: 'Warangal, Telangana', price: 2290 },
        { name: 'Cuttack, Odisha', price: 2180 },
      ],
      priceHistory: [
        { month: 'Jul', price: 2300 }, { month: 'Aug', price: 2350 },
        { month: 'Sep', price: 2320 }, { month: 'Oct', price: 2290 },
        { month: 'Nov', price: 2250 }, { month: 'Dec', price: 2220 },
        { month: 'Jan', price: 2180 },
      ],
    },
    subsidies: [
      { scheme: 'PM-KISAN', amount: '₹6,000/year', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष', eligibilityHi: 'सभी भूमिधारक किसान' },
      { scheme: 'PMFBY', amount: '2% premium for Kharif', eligibility: 'Rice-growing notified areas', schemeHi: 'PMFBY', amountHi: 'खरीफ के लिए 2% प्रीमियम', eligibilityHi: 'धान उगाने वाले अधिसूचित क्षेत्र' },
      { scheme: 'Direct Seeded Rice (DSR) incentive', amount: '₹1,500/acre in Punjab/Haryana', eligibility: 'Farmers shifting from transplanted to DSR method', schemeHi: 'DSR प्रोत्साहन', amountHi: '₹1,500/एकड़ (पंजाब/हरियाणा)', eligibilityHi: 'DSR विधि अपनाने वाले किसान' },
    ],
    whyBetter: {
      en: ['MSP guaranteed at ₹2,300/qtl — FCI procures heavily in Punjab, Haryana, UP', 'High-yielding varieties (HYV) can produce 20–25 qtl/acre in irrigated areas', 'Stable demand — rice is a staple crop with guaranteed offtake'],
      hi: ['₹2,300/क्विंटल MSP गारंटीड — FCI पंजाब, हरियाणा, UP में भारी खरीद', 'उच्च उपज वाली किस्में सिंचित क्षेत्रों में 20–25 क्विंटल/एकड़ दे सकती हैं', 'स्थिर मांग — चावल एक प्रधान फसल है जिसकी खरीद गारंटीड'],
    },
    risks: {
      en: ['Current drought forecast means yield could drop 15–25% this Kharif', 'Very high water requirement — 1,200–1,500 litres per kg of rice', 'Groundwater depletion concerns — Punjab government discouraging rice cultivation', 'Price currently below MSP in many spot markets'],
      hi: ['वर्तमान सूखे का पूर्वानुमान इस खरीफ में उपज 15–25% गिरा सकता है', 'बहुत अधिक पानी — प्रति किलो चावल 1,200–1,500 लीटर', 'भूजल कमी की चिंता — पंजाब सरकार चावल की खेती को हतोत्साहित कर रही है', 'कई स्पॉट बाज़ारों में कीमत MSP से नीचे'],
    },
    negotiationTips: {
      en: 'Sell directly to FCI procurement centres at MSP (₹2,300/qtl) rather than open mandi if open market rates are lower. Basmati varieties fetch ₹4,000–8,000/qtl — consider switching if water is available. Sell in October–November immediately post-harvest for best prices before seasonal glut.',
      hi: 'यदि खुले बाज़ार की दरें कम हैं तो मंडी की बजाय MSP पर FCI खरीद केंद्रों को सीधे बेचें। बासमती किस्में ₹4,000–8,000/क्विंटल लाती हैं — पानी उपलब्ध होने पर स्विच करें। मौसमी अधिकता से पहले अक्टूबर-नवंबर में तुरंत बेचें।',
    },
    inputCosts: { seed: 1800, fertilizer: 5500, irrigation: 7000, pesticide: 2500, harvest: 3500, total: 20300 },
    yieldPerAcre: { min: 14, max: 22, avg: 18, unit: 'qtl' },
  },

  potato: {
    marketRates: {
      msp: null,
      currentMandi: 1250,
      lastMonthMandi: 1100,
      trend: 'rising',
      trendPct: 13.6,
      bestSellMonths: ['February', 'March'],
      bestSellMonthsHi: ['फरवरी', 'मार्च'],
      topMandis: [
        { name: 'Agra, UP', price: 1350 },
        { name: 'Aligarh, UP', price: 1300 },
        { name: 'Hooghly, WB', price: 1250 },
      ],
      priceHistory: [
        { month: 'Sep', price: 900 }, { month: 'Oct', price: 950 },
        { month: 'Nov', price: 1000 }, { month: 'Dec', price: 1050 },
        { month: 'Jan', price: 1100 }, { month: 'Feb', price: 1200 },
        { month: 'Mar', price: 1250 },
      ],
    },
    subsidies: [
      { scheme: 'PM-KISAN', amount: '₹6,000/year', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष', eligibilityHi: 'सभी भूमिधारक किसान' },
      { scheme: 'Cold Storage Subsidy (NABARD)', amount: '25–33% capital subsidy', eligibility: 'Farmers building or using registered cold storage', schemeHi: 'शीत भंडारण सब्सिडी (NABARD)', amountHi: '25–33% पूंजी सब्सिडी', eligibilityHi: 'पंजीकृत शीत भंडार बनाने/उपयोग करने वाले किसान' },
      { scheme: 'Horticulture Mission (NHM)', amount: 'Seed potato subsidy 50%', eligibility: 'Farmers in NHM-notified districts', schemeHi: 'बागवानी मिशन (NHM)', amountHi: 'बीज आलू पर 50% सब्सिडी', eligibilityHi: 'NHM-अधिसूचित जिलों के किसान' },
    ],
    whyBetter: {
      en: ['Highest profit potential of any Rabi crop at ₹2.1L/acre in good years', 'Quick 90-day turnaround — allows double or triple cropping', 'Rising demand from chips/crisp industry (Lay\'s, Balaji) at premium prices', 'Cold storage availability extends selling window to 6–8 months'],
      hi: ['रबी फसलों में सर्वाधिक लाभ क्षमता — अच्छे साल में ₹2.1L/एकड़', 'तेज 90 दिन — दोहरी या तिहरी फसल की अनुमति', 'चिप्स/क्रिस्प उद्योग (Lay\'s, Balaji) से प्रीमियम कीमतों पर बढ़ती मांग', 'शीत भंडारण बिक्री खिड़की 6–8 महीने तक बढ़ाती है'],
    },
    risks: {
      en: ['No MSP — full market exposure, prices can crash 50% in glut years', 'Late blight disease can destroy 100% crop in 2–3 days if not managed', 'High input cost — seed potato itself costs ₹8,000–12,000/acre', 'Requires access to cold storage — without it, forced to sell at harvest price'],
      hi: ['कोई MSP नहीं — पूरी बाज़ार जोखिम, अधिकता वाले साल कीमतें 50% गिर सकती हैं', 'लेट ब्लाइट रोग प्रबंधन न होने पर 2–3 दिन में 100% फसल नष्ट', 'उच्च इनपुट लागत — बीज आलू अकेले ₹8,000–12,000/एकड़', 'शीत भंडारण की ज़रूरत — बिना इसके कटाई कीमत पर बेचने को मजबूर'],
    },
    negotiationTips: {
      en: 'February–March prices are typically 30–40% higher than January. Store in cold storage (cost ~₹300/tonne/month) and sell May–June for maximum profit. Target chip-grade buyers (Pepsico, ITC) who pay ₹1,500–2,000/qtl vs mandi rate. Avoid flushing market at harvest — coordinate with neighbouring farmers.',
      hi: 'फरवरी-मार्च कीमतें आमतौर पर जनवरी से 30–40% अधिक होती हैं। शीत भंडारण में रखें और मई-जून में बेचें। चिप-ग्रेड खरीदार (Pepsico, ITC) मंडी दर से ₹1,500–2,000/क्विंटल अधिक देते हैं।',
    },
    inputCosts: { seed: 10000, fertilizer: 6000, irrigation: 4500, pesticide: 3500, harvest: 4000, total: 28000 },
    yieldPerAcre: { min: 60, max: 120, avg: 90, unit: 'qtl' },
  },
};

// Generic fallback for crops not in detailed DB
export function getGenericInsights(crop) {
  return {
    marketRates: {
      msp: crop.msp || null,
      currentMandi: crop.msp ? Math.round(crop.msp * 1.05) : Math.round(crop.baseProfit / 10),
      lastMonthMandi: crop.msp ? Math.round(crop.msp * 0.98) : Math.round(crop.baseProfit / 11),
      trend: 'stable',
      trendPct: 2.1,
      bestSellMonths: ['After harvest'],
      bestSellMonthsHi: ['फसल के बाद'],
      topMandis: [
        { name: 'Nearest district mandi', price: crop.msp || Math.round(crop.baseProfit / 10) },
      ],
      priceHistory: [
        { month: 'M-6', price: crop.msp ? crop.msp * 0.90 : 3000 },
        { month: 'M-5', price: crop.msp ? crop.msp * 0.92 : 3100 },
        { month: 'M-4', price: crop.msp ? crop.msp * 0.95 : 3200 },
        { month: 'M-3', price: crop.msp ? crop.msp * 0.97 : 3300 },
        { month: 'M-2', price: crop.msp ? crop.msp * 0.99 : 3400 },
        { month: 'M-1', price: crop.msp ? crop.msp * 1.01 : 3450 },
        { month: 'Now', price: crop.msp ? crop.msp * 1.03 : 3500 },
      ],
    },
    subsidies: [
      { scheme: 'PM-KISAN', amount: '₹6,000/year direct benefit', eligibility: 'All landholding farmers', schemeHi: 'PM-KISAN', amountHi: '₹6,000/वर्ष प्रत्यक्ष लाभ', eligibilityHi: 'सभी भूमिधारक किसान' },
      { scheme: 'PMFBY Crop Insurance', amount: '1.5–5% premium, full coverage', eligibility: 'Notified areas for this crop', schemeHi: 'PMFBY फसल बीमा', amountHi: '1.5–5% प्रीमियम, पूर्ण कवरेज', eligibilityHi: 'इस फसल के लिए अधिसूचित क्षेत्र' },
    ],
    whyBetter: { en: [crop.detail || 'Suitable for your region and current conditions'], hi: [crop.detailHi || 'आपके क्षेत्र और वर्तमान परिस्थितियों के लिए उपयुक्त'] },
    risks: { en: ['Market price fluctuations', 'Weather dependency'], hi: ['बाज़ार कीमत में उतार-चढ़ाव', 'मौसम पर निर्भरता'] },
    negotiationTips: {
      en: 'Register on eNAM (enam.gov.in) to compare prices across mandis. Sell in peak demand months and avoid distress selling immediately after harvest.',
      hi: 'कई मंडियों में कीमतें तुलना करने के लिए eNAM (enam.gov.in) पर रजिस्टर करें। अधिकतम मांग के महीनों में बेचें।',
    },
    inputCosts: { seed: 2000, fertilizer: 4000, irrigation: 3000, pesticide: 2000, harvest: 2500, total: 13500 },
    yieldPerAcre: { min: 8, max: 18, avg: 12, unit: 'qtl' },
  };
}

/**
 * Generate AI-powered deep insights for a crop using OpenRouter.
 * Called server-side from the API route.
 */
const LANG_NAMES = {
  en: 'English',
  hi: 'Hindi (हिंदी)',
  ta: 'Tamil (தமிழ்)',
  te: 'Telugu (తెలుగు)',
};

export async function generateAIInsights({ crop, weather, userData, allCrops, insights, lang = 'en' }) {
  const key = process.env.OPENROUTER_KEY;
  if (!key || key === 'YOUR_OPENROUTER_KEY_HERE') return null;

  const otherCrops = (allCrops || [])
    .filter(c => c.id !== crop.id)
    .slice(0, 4)
    .map(c => `${c.name} (confidence: ${c.confidence}%, profit: ₹${c.baseProfit?.toLocaleString('en-IN')})`)
    .join(', ');

  const langName = LANG_NAMES[lang] || 'English';
  const langInstruction = lang === 'en'
    ? 'Respond entirely in English.'
    : `IMPORTANT: Respond entirely in ${langName}. All text values in the JSON must be written in ${langName} script. Do not mix languages.`;

  const prompt = `You are an expert agricultural advisor for Indian farmers. Provide deeply practical, specific insights.

${langInstruction}

Farmer context:
- Location: ${userData?.location || 'India'}, State: ${weather?.stateName || 'Unknown'}
- Land size: ${userData?.landSize || 5} acres
- Water: ${userData?.water || 'medium'}, Budget: ${userData?.budget || 'medium'}, Risk: ${userData?.risk || 'medium'}

Live weather:
- 14-day forecast rainfall: ${weather?.forecastRain || 60}mm (historical avg: ${weather?.historicalAvg || 70}mm)
- Drought risk: ${weather?.droughtRisk || 40}%, Flood risk: ${weather?.floodRisk || 15}%
- Current temp: ${weather?.currentTemp || 28}°C, Max 14d: ${weather?.maxTemp14d || 35}°C

Selected crop: ${crop.name}
- AI confidence: ${crop.confidence}%
- Expected profit: ₹${crop.baseProfit?.toLocaleString('en-IN')}/season
- Weather match score: ${crop.scores?.weather || 0}%
- Risk score: ${crop.scores?.risk || 0}%
- Market score: ${crop.scores?.market || 0}%
- Current mandi price: ₹${insights?.marketRates?.currentMandi || crop.msp || 'N/A'}/qtl
- MSP: ${crop.msp ? `₹${crop.msp}/qtl` : 'No MSP (market-driven)'}

Other ranked crops: ${otherCrops}

Provide a JSON response with exactly these keys:
{
  "deepAnalysis": "3-4 paragraph detailed analysis in ${langName} of why this crop is specifically suited or risky for THIS farmer given their exact weather, water, and location. Mention specific numbers.",
  "marketOutlook": "2 paragraphs in ${langName} on market outlook for next 6 months — mention specific price ranges, best mandis, and whether to hold or sell immediately after harvest.",
  "weatherFitExplanation": "1-2 paragraphs in ${langName} explaining how current weather conditions affect this crop — what to watch out for, what protective actions to take.",
  "topAdvice": ["actionable advice in ${langName} 1", "advice 2", "advice 3", "advice 4"],
  "comparisonInsight": "1 paragraph in ${langName} on why this crop ranks above alternatives for this specific farmer.",
  "bestTimeToSell": "Specific month range and price target in ${langName} for this farmer's state"
}

Return ONLY valid JSON. Be specific with rupee amounts, percentages, and time frames. All text must be in ${langName}.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agrismart.app',
        'X-Title': 'AgriSmart',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1400,
      }),
    });

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content || '{}';
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('AI insight generation failed:', err.message);
    return null;
  }
}
