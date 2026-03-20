import { fetchAgriNews, classifyDot, timeAgo } from '@/lib/news';
import { analyzeNewsWithLLM } from '@/lib/newsInsights';

export async function GET() {
  try {
    const articles  = await fetchAgriNews();
    const insights  = await analyzeNewsWithLLM(articles);

    const enriched = articles.map(a => ({
      ...a,
      dot: classifyDot(a.title),
      ago: timeAgo(a.publishedAt),
    }));

    return Response.json({
      articles:      enriched,
      sentiment:     insights.sentiment     || {},
      signals:       insights.signals       || [],
      marketSummary: insights.marketSummary || null,
    }, {
      headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate=600' },
    });
  } catch (err) {
    console.error('News API error:', err);
    return Response.json({ articles: [], sentiment: {}, signals: [], marketSummary: null }, { status: 200 });
  }
}
