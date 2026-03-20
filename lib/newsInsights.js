const CROP_NAMES = [
  'Wheat', 'Rice', 'Maize', 'Bajra', 'Jowar', 'Mustard', 'Groundnut',
  'Soybean', 'Sunflower', 'Chickpea', 'Tur', 'Moong', 'Cotton',
  'Sugarcane', 'Turmeric', 'Chilli', 'Ginger', 'Potato', 'Onion',
  'Coconut', 'Banana', 'Tea', 'Apple',
];

export async function analyzeNewsWithLLM(articles) {
  const key = process.env.OPENROUTER_KEY;
  if (!key || key === 'YOUR_OPENROUTER_KEY_HERE' || articles.length === 0) {
    return { sentiment: {}, signals: [], marketSummary: null };
  }

  const text = articles
    .slice(0, 6)
    .map((a, i) => `Article ${i + 1}: "${a.title}. ${a.description || ''}"`)
    .join('\n');

  const prompt = `You are an agricultural commodity analyst for India.
Analyze these news articles and return structured crop impact data.

Crops to analyze: ${CROP_NAMES.join(', ')}

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "sentiment": {
    "CropName": <number -0.3 to +0.3>
  },
  "signals": [
    {
      "crop": "CropName",
      "impact": "positive" | "negative" | "neutral",
      "reason": "one sentence max",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "marketSummary": "2-3 sentence overall Indian agri market summary"
}

Sentiment guide: +0.3=strong positive, 0=neutral/no mention, -0.3=strong negative.
Only include crops actually mentioned or clearly affected.

Articles:
${text}`;

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
        temperature: 0.1,
        max_tokens: 900,
      }),
    });

    const data = await res.json();
    const raw  = data.choices?.[0]?.message?.content || '{}';
    const clean = raw.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error('LLM news analysis failed:', err.message);
    return { sentiment: {}, signals: [], marketSummary: null };
  }
}
