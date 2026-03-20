// TTS route — two-step for Indian languages:
// 1. Ask Claude (via OpenRouter, already configured) to transliterate to Roman script
// 2. Feed romanized text to OpenAI tts-1 (or use browser speech as fallback)

const BCP47 = { en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN' };

async function transliterate(text, lang) {
  // No need to transliterate English
  if (lang === 'en') return text;

  const langNames = { hi: 'Hindi', ta: 'Tamil', te: 'Telugu' };
  const langName  = langNames[lang] || 'Hindi';
  const key       = process.env.OPENROUTER_KEY;
  if (!key) return text;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://agrismart.app',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Transliterate the following ${langName} text into Roman/Latin script so it sounds correct when read aloud phonetically in English text-to-speech. Keep numbers as-is. Return ONLY the transliterated text, no explanations.\n\n${text.slice(0, 1500)}`,
        }],
      }),
    });
    if (!res.ok) return text;
    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || text;
  } catch {
    return text;
  }
}

export async function POST(req) {
  try {
    const { text, lang = 'en' } = await req.json();
    if (!text?.trim()) return new Response('No text', { status: 400 });

    const openaiKey = process.env.OPENAI_API_KEY;

    // Step 1: transliterate Indian language text to Roman script
    const spokenText = await transliterate(text.slice(0, 1500), lang);

    // Step 2: send to OpenAI TTS if key exists
    if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: spokenText,
          voice: 'nova',
          response_format: 'mp3',
          speed: 0.9,
        }),
      });

      if (res.ok) {
        return new Response(res.body, {
          headers: { 'Content-Type': 'audio/mpeg' },
        });
      }
      console.error('[TTS] OpenAI error:', res.status, await res.text().catch(() => ''));
    }

    // Fallback: return transliterated text for browser speech
    return Response.json({
      fallback: true,
      text: spokenText,
      bcp47: BCP47[lang] || 'en-IN',
    });

  } catch (err) {
    console.error('[TTS] exception:', err.message);
    return Response.json({ fallback: true, text: '', bcp47: 'en-IN' });
  }
}
