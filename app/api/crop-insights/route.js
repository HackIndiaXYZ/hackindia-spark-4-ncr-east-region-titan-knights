import { CROP_INSIGHTS, getGenericInsights, generateAIInsights } from '@/lib/cropInsights';
import CROPS from '@/lib/cropDatabase';

export async function POST(request) {
  try {
    const { cropId, weather, userData, allCrops, lang = 'en' } = await request.json();

    const cropDef = CROPS.find(c => c.id === cropId);
    if (!cropDef) {
      return Response.json({ error: 'Crop not found' }, { status: 404 });
    }

    const staticInsights = CROP_INSIGHTS[cropId] || getGenericInsights(cropDef);
    const scoredCrop = (allCrops || []).find(c => c.id === cropId) || cropDef;

    const aiInsights = await generateAIInsights({
      crop: scoredCrop,
      weather,
      userData,
      allCrops,
      insights: staticInsights,
      lang,
    });

    return Response.json({
      crop:            { ...cropDef, ...scoredCrop },
      marketRates:     staticInsights.marketRates,
      subsidies:       staticInsights.subsidies,
      whyBetter:       staticInsights.whyBetter,
      risks:           staticInsights.risks,
      negotiationTips: staticInsights.negotiationTips,
      inputCosts:      staticInsights.inputCosts,
      yieldPerAcre:    staticInsights.yieldPerAcre,
      aiInsights,
    }, {
      headers: { 'Cache-Control': 's-maxage=1800' },
    });
  } catch (err) {
    console.error('Crop insights error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
