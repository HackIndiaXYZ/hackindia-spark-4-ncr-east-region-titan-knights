import { fetchWeatherData } from '@/lib/weather';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lon = parseFloat(searchParams.get('lon'));

  if (isNaN(lat) || isNaN(lon)) {
    return Response.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  try {
    const data = await fetchWeatherData(lat, lon);
    return Response.json(data, {
      headers: { 'Cache-Control': 's-maxage=10800, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('Weather API error:', err);
    return Response.json({ error: 'Weather fetch failed', detail: err.message }, { status: 500 });
  }
}
