import { scoreCrops } from '@/lib/scoring';

export async function POST(request) {
  try {
    const body = await request.json();
    const crops = scoreCrops(body);
    return Response.json(crops);
  } catch (err) {
    console.error('Recommend API error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
