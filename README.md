# 🌾 AgriSmart — Smart Farming Decision Platform

AI-powered crop recommendations, real-time weather risk analysis, and parametric insurance for Indian farmers.

---

## ⚡ Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up your API keys (see section below)
cp .env.local .env.local.backup   # already exists, just edit it

# 3. Run the app
npm run dev
# Open http://localhost:3000
```

---

## 🔑 API Keys Setup

Open `.env.local` and fill in your keys. The file already exists with instructions for each key.

### Key 1 — Google Maps (location autocomplete)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Maps JavaScript API** and **Places API**
3. Create an API key → paste into `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

> **Without this key:** The location search still works — just type your location and click "Use entered location (demo mode)" which sets a default coordinate.

### Key 2 — GNews (live agriculture news)
1. Go to [gnews.io/register](https://gnews.io/register)
2. Free account — 100 requests/day
3. Paste key into `GNEWS_KEY`

> **Without this key:** The app shows 5 sample agriculture headlines instead of live news.

### Key 3 — OpenRouter (LLM news sentiment analysis)
1. Go to [openrouter.ai](https://openrouter.ai) → sign up
2. You get free credits on signup (enough for months of prototyping)
3. Create an API key → paste into `OPENROUTER_KEY`
4. This uses `gpt-4o-mini` — costs ~$0.001 per news batch

> **Without this key:** News is displayed without LLM sentiment scoring. Crop recommendations still work using keyword-based classification.

### Key 4 — Supabase (auth and database — optional for local dev)
1. Go to [supabase.com](https://supabase.com) → create a free project
2. Settings → API → copy URL and anon key
3. Paste into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Run the SQL schema: Supabase Dashboard → SQL Editor → paste contents of `supabase/schema.sql`

> **Without Supabase:** The app runs fully without auth. Users can use the full product without logging in. Recommendations are not saved between sessions.

### Weather Data — No Key Needed
The app uses **Open-Meteo** which is completely free with no registration or API key.

---

## 🏗 Full Project Structure

```
agrismart/
├── app/
│   ├── page.js              ← Landing page
│   ├── form/page.js         ← Multi-step farm input form
│   ├── loading/page.js      ← Data fetching + loading screen
│   ├── dashboard/page.js    ← Main results dashboard
│   ├── api/
│   │   ├── weather/route.js ← Open-Meteo + Nominatim
│   │   ├── news/route.js    ← GNews + OpenRouter LLM
│   │   └── recommend/route.js ← Crop scoring engine
│   ├── globals.css
│   └── layout.js
│
├── components/
│   ├── ui/
│   │   ├── Nav.jsx          ← Navigation with lang toggle
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── RiskBar.jsx
│   │   ├── Skeleton.jsx
│   │   └── LangToggle.jsx   ← EN/हिं switcher
│   ├── landing/
│   │   ├── Hero.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Benefits.jsx
│   ├── form/
│   │   └── FormWizard.jsx   ← 6-step wizard with Google Maps
│   └── dashboard/
│       ├── CropCard.jsx     ← Explainable crop recommendation
│       ├── WeatherRiskPanel.jsx ← Live risk bars
│       ├── NewsPanel.jsx    ← Live news + LLM insights
│       ├── InsurancePanel.jsx
│       └── ActivityLog.jsx
│
├── lib/
│   ├── cropDatabase.js      ← 25+ crops with full geo constraints
│   ├── geoFilter.js         ← Hard geographic + season filtering
│   ├── scoring.js           ← Weighted multi-factor scoring engine
│   ├── weather.js           ← Open-Meteo API integration
│   ├── news.js              ← GNews API integration
│   ├── newsInsights.js      ← OpenRouter LLM analysis
│   ├── supabase.js          ← Supabase client
│   ├── store.js             ← Zustand global state
│   └── translations.js      ← Full EN/HI translations
│
├── ml-service/              ← Python FastAPI ML microservice
│   ├── main.py              ← Crop scoring + geo filter in Python
│   └── requirements.txt
│
├── supabase/
│   └── schema.sql           ← Full database schema with RLS
│
├── .env.local               ← Your API keys go here
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🐍 Running the ML Service (Optional)

The Next.js app has its own JavaScript scoring engine that works without the ML service. The Python FastAPI service gives you a production-grade alternative you can deploy separately.

```bash
cd ml-service

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# OR: venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn main:app --reload --port 8000

# Test it
curl http://localhost:8000/health
# → {"status":"ok","service":"AgriSmart ML Service"}

# Get recommendations
curl -X POST http://localhost:8000/recommend \
  -H "Content-Type: application/json" \
  -d '{"state_name":"Maharashtra","lat":19.99,"drought_risk":62,"forecast_rain":45,"water":"medium","budget":"medium","risk_appetite":"medium"}'
```

---

## 🌐 How Live Data Works

### Weather Flow
```
Farmer enters location
       ↓
Google Maps Places → lat/lon coordinates
       ↓
/api/weather calls Open-Meteo (free, no key)
├── 14-day daily forecast (precipitation, temperature)
└── 30-year monthly climate normals (historical baseline)
       ↓
Also calls Nominatim (free) for reverse geocoding → state name
       ↓
Drought risk = (historical_avg - forecast) / historical_avg × 100
Flood risk   = (forecast - historical_avg) / historical_avg × 85
       ↓
State name → Geographic filter → Crops valid for this region
       ↓
Weighted scoring → Ranked recommendations with explanations
```

### News + AI Flow
```
/api/news calls GNews with 4 agriculture queries
       ↓
Deduplicates, sorts by date, takes latest 8 articles
       ↓
Sends article titles + descriptions to OpenRouter (GPT-4o-mini)
       ↓
LLM returns structured JSON:
├── sentiment scores per crop (-0.3 to +0.3)
├── signal per crop (positive/negative/neutral + reason)
└── overall market summary
       ↓
Sentiment scores fed into crop scoring engine
Signal displayed on each CropCard with explanation
```

### Geographic Filtering
```
State from reverse geocoding → filters to crops grown in that state
Current month → filters to crops in planting window (±3 months)
Altitude → filters out crops incompatible with elevation
       ↓
Punjab in November → Wheat, Mustard, Potato, Chickpea, Moong
Kerala in August   → Rice, Coconut, Banana, Ginger, Turmeric, Tea
Rajasthan in June  → Bajra, Groundnut, Moong, Jowar, Sunflower
Himachal at 1800m  → Apple, Ginger, Maize, Wheat
```

---

## 🚀 Deployment

### Frontend (Vercel — free)
```bash
npm install -g vercel
vercel
# Follow prompts, add environment variables in Vercel dashboard
```

### ML Service (Railway — ~$5/month)
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
cd ml-service
railway init
railway up
# Copy the deployment URL to ML_SERVICE_URL in your env vars
```

---

## 📋 What's Mock vs Real

| Feature | Status | Notes |
|---|---|---|
| Location autocomplete | ✅ Real | Google Maps Places API |
| Weather data | ✅ Real | Open-Meteo, free, no key |
| Historical rainfall baseline | ✅ Real | Open-Meteo climate normals, 30yr |
| Risk scores | ✅ Real | Computed from live weather |
| Crop geo filtering | ✅ Real | 25+ crops, all Indian states |
| Crop scoring | ✅ Real | Weighted multi-factor model |
| Crop explanations | ✅ Real | Generated from actual scores |
| Agriculture news | ✅ Real | GNews API |
| News sentiment | ✅ Real | GPT-4o-mini via OpenRouter |
| Market prices (Agmarknet) | 🔶 Mock | Add in Phase 2 |
| Insurance premium | 🔶 Mock | Replace with Razorpay |
| Blockchain payouts | 🔶 Mock | Replace with Polygon/Chainlink |
| Profit estimates | 🔶 Estimated | Based on ICRISAT averages |

---

## 🛠 Troubleshooting

**"Location search not working"**
→ Check NEXT_PUBLIC_GOOGLE_MAPS_KEY in .env.local
→ Ensure Maps JavaScript API and Places API are enabled in Google Cloud
→ Use the "demo mode" fallback button on the form

**"Weather data not loading"**
→ Open-Meteo needs no key but rate-limits heavy use. Wait 1 minute and retry.
→ Check browser console for the error message

**"No crop recommendations showing"**
→ Check browser console on /dashboard for errors from /api/recommend
→ Ensure the location step returned valid lat/lon coordinates (shown in green on the form)

**"News not loading"**
→ Check GNEWS_KEY in .env.local
→ GNews free tier: 100 requests/day. If exceeded, the app shows sample news.

**TypeErrors or import errors on first run**
→ Make sure you ran `npm install` first
→ Delete `.next` folder and restart: `rm -rf .next && npm run dev`
