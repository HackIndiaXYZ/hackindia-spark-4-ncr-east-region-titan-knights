/**
 * Fetches live weather from Open-Meteo (free, no API key).
 * Also fetches altitude and reverse-geocodes state name via Nominatim.
 */

export async function fetchWeatherData(lat, lon) {
  const [forecastRes, histRes, altRes, geoRes] = await Promise.allSettled([
    // 14-day forecast
    fetch(
      `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${lat}&longitude=${lon}` +
      `&daily=precipitation_sum,temperature_2m_max,temperature_2m_min` +
      `&current_weather=true&timezone=Asia%2FKolkata&forecast_days=14`
    ),
    // 30-year climate normals (monthly)
    fetch(
      `https://climate-api.open-meteo.com/v1/climate?` +
      `latitude=${lat}&longitude=${lon}` +
      `&start_date=1991-01-01&end_date=2020-12-31` +
      `&monthly=precipitation_sum&models=EC_Earth3P_HR`
    ),
    // Elevation
    fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`),
    // Reverse geocode for state name
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { headers: { 'User-Agent': 'AgriSmart/1.0 contact@agrismart.app' } }
    ),
  ]);

  // Parse forecast
  let forecastRain = 60, currentTemp = 28, maxTemp14d = 35, minTemp14d = 18;
  if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
    const f = await forecastRes.value.json();
    forecastRain = f.daily?.precipitation_sum?.reduce((s, v) => s + (v || 0), 0) ?? 60;
    forecastRain = Math.round(forecastRain * 10) / 10;
    currentTemp  = f.current_weather?.temperature ?? 28;
    maxTemp14d   = Math.max(...(f.daily?.temperature_2m_max?.filter(Boolean) ?? [35]));
    minTemp14d   = Math.min(...(f.daily?.temperature_2m_min?.filter(Boolean) ?? [18]));
  }

  // Parse historical baseline
  let historicalAvg = 60;
  if (histRes.status === 'fulfilled' && histRes.value.ok) {
    const h = await histRes.value.json();
    const currentMonth = new Date().getMonth();
    if (h.monthly?.precipitation_sum && h.monthly?.time) {
      const monthVals = h.monthly.precipitation_sum.filter(
        (_, i) => new Date(h.monthly.time[i]).getMonth() === currentMonth && h.monthly.precipitation_sum[i] !== null
      );
      if (monthVals.length > 0) {
        historicalAvg = Math.round(monthVals.reduce((a, b) => a + b, 0) / monthVals.length);
      }
    }
  }

  // Parse altitude
  let altitudeM = 0;
  if (altRes.status === 'fulfilled' && altRes.value.ok) {
    const a = await altRes.value.json();
    altitudeM = a.elevation?.[0] ?? 0;
  }

  // Parse state name
  let stateName = '', districtName = '', cityName = '';
  if (geoRes.status === 'fulfilled' && geoRes.value.ok) {
    const g = await geoRes.value.json();
    stateName    = g.address?.state           || '';
    districtName = g.address?.county          || g.address?.state_district || '';
    cityName     = g.address?.city || g.address?.town || g.address?.village || '';
  }

  // Compute risk scores
  const droughtRisk = Math.round(Math.max(0, Math.min(100,
    ((historicalAvg - forecastRain) / Math.max(historicalAvg, 1)) * 100
  )));
  const floodRisk = Math.round(Math.max(0, Math.min(100,
    ((forecastRain - historicalAvg) / Math.max(historicalAvg, 1)) * 85
  )));
  const tempStress = maxTemp14d > 40
    ? Math.round(Math.min(100, (maxTemp14d - 40) * 12))
    : 0;
  // Pest risk correlates loosely with high humidity (estimated from rain + temp)
  const estimatedHumidity = Math.min(95, 30 + (forecastRain / historicalAvg) * 40);
  const pestRisk = Math.round(Math.min(80, 15 + estimatedHumidity * 0.5));

  return {
    forecastRain,
    historicalAvg,
    currentTemp:     Math.round(currentTemp),
    maxTemp14d:      Math.round(maxTemp14d),
    minTemp14d:      Math.round(minTemp14d),
    altitudeM:       Math.round(altitudeM),
    stateName,
    districtName,
    cityName,
    droughtRisk:     Math.max(0, droughtRisk),
    floodRisk:       Math.max(0, floodRisk),
    tempStress,
    marketVolatility: 44,
    pestRisk,
    dataSource: 'Open-Meteo (free) · No API key required',
  };
}
