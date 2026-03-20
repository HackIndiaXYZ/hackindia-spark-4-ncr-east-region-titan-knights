export async function fetchAgriNews() {
  const key = process.env.GNEWS_KEY;
  if (!key || key === 'YOUR_GNEWS_KEY_HERE') return [];

  const queries = [
    'wheat india price 2025',
    'monsoon india forecast kharif',
    'MSP india crops agriculture',
    'farming india market news',
  ];

  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&country=in&max=3&token=${key}`
      ).then(r => r.json())
    )
  );

  const seen = new Set();
  const articles = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.articles) {
      for (const a of r.value.articles) {
        if (!seen.has(a.url) && a.title && a.title !== '[Removed]') {
          seen.add(a.url);
          articles.push({
            title:       a.title,
            description: a.description || '',
            source:      a.source?.name || 'News',
            url:         a.url,
            publishedAt: a.publishedAt,
            image:       a.image || null,
          });
        }
      }
    }
  }

  return articles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 8);
}

export function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 3600)  return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export function classifyDot(title) {
  const t = (title || '').toLowerCase();
  if (t.match(/drought|flood|fall|drop|shortage|crisis|damage|loss|warn|deficit|fail/))
    return 'red';
  if (t.match(/rise|surge|increase|record|boost|grow|strong|profit|gain|export|high/))
    return 'green';
  return 'amber';
}
