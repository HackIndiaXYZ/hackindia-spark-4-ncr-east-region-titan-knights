import { getCropCandidates } from './geoFilter';

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function getWeights(riskAppetite) {
  return {
    low:    { profit: 0.20, weather: 0.35, risk: 0.30, market: 0.15 },
    medium: { profit: 0.30, weather: 0.28, risk: 0.27, market: 0.15 },
    high:   { profit: 0.45, weather: 0.20, risk: 0.15, market: 0.20 },
  }[riskAppetite] || { profit: 0.30, weather: 0.28, risk: 0.27, market: 0.15 };
}

export function scoreCrops({
  stateName, lat, altitudeM = 0,
  droughtRisk, floodRisk, forecastRain, currentTemp, maxTemp14d,
  water, budget, riskAppetite,
  newsSentiment = {},
}) {
  const candidates = getCropCandidates({ stateName, lat, altitudeM });
  const weights    = getWeights(riskAppetite);
  const maxProfit  = Math.max(...candidates.map(c => c.baseProfit));

  const scored = candidates.map(crop => {
    // ── 1. WEATHER SCORE ──────────────────────────────────────────────────
    const rainInRange = forecastRain >= crop.climate.minRain && forecastRain <= crop.climate.maxRain;
    const rainScore = rainInRange
      ? 1.0
      : forecastRain < crop.climate.minRain
        ? clamp(forecastRain / crop.climate.minRain, 0, 1) * crop.droughtTolerance
        : clamp(crop.climate.maxRain / forecastRain, 0, 1) * crop.floodTolerance;

    const tempMid = (crop.climate.minTemp + crop.climate.maxTemp) / 2;
    const tempInRange = currentTemp >= crop.climate.minTemp && currentTemp <= crop.climate.maxTemp;
    const tempScore = tempInRange
      ? 1.0
      : clamp(1 - Math.abs(currentTemp - tempMid) / 20, 0, 1);

    const weatherScore = (rainScore * 0.65) + (tempScore * 0.35);

    // ── 2. RISK SCORE ─────────────────────────────────────────────────────
    const droughtImpact = (droughtRisk / 100) * (1 - crop.droughtTolerance);
    const floodImpact   = (floodRisk   / 100) * (1 - crop.floodTolerance);
    const heatPenalty   = maxTemp14d > 40 && crop.climate.maxTemp < 38
      ? (maxTemp14d - 40) * 0.03
      : 0;
    const riskScore = clamp(1 - droughtImpact - floodImpact - heatPenalty, 0, 1);

    // ── 3. WATER MATCH ────────────────────────────────────────────────────
    const waterTable = {
      low:    { 'very-low': 1.0, low: 0.92, medium: 0.65, high: 0.30, 'very-high': 0.05 },
      medium: { 'very-low': 0.80, low: 0.90, medium: 1.0, high: 0.70, 'very-high': 0.35 },
      high:   { 'very-low': 0.65, low: 0.78, medium: 0.92, high: 1.0, 'very-high': 0.80 },
    };
    const waterScore = waterTable[water]?.[crop.waterNeed] ?? 0.6;

    // ── 4. PROFIT SCORE ───────────────────────────────────────────────────
    const profitScore   = crop.baseProfit / maxProfit;
    const budgetPenalty = budget === 'low' && ['high', 'very-high'].includes(crop.waterNeed)
      ? 0.22 : 0;
    const adjProfit = clamp(profitScore - budgetPenalty, 0, 1);

    // ── 5. MARKET SCORE ───────────────────────────────────────────────────
    const sentiment   = newsSentiment[crop.name] || 0;
    const marketScore = clamp(crop.marketStability + sentiment, 0, 1);

    // ── FINAL WEIGHTED SCORE ──────────────────────────────────────────────
    const finalScore = (
      weights.profit  * adjProfit +
      weights.weather * weatherScore * waterScore +
      weights.risk    * riskScore +
      weights.market  * marketScore
    );

    const confidence = Math.round(clamp(finalScore * 100, 40, 96));

    // Risk level thresholds — tuned so the top recommended crop
    // realistically lands as Low risk when conditions are good
    // Low:    confidence >= 72  (weather matches, drought tolerant, good market)
    // Medium: confidence 58–71  (some mismatch or moderate risk)
    // High:   confidence < 58   (significant climate or market risk)
    const riskLevel = confidence >= 72 ? 'Low' : confidence >= 58 ? 'Medium' : 'High';

    // ── PLAIN-LANGUAGE EXPLANATION ────────────────────────────────────────
    const parts = [];
    if (rainInRange)
      parts.push(`Forecast rainfall (${forecastRain}mm) matches ideal range`);
    else if (forecastRain < crop.climate.minRain && crop.droughtTolerance > 0.70)
      parts.push(`Low rainfall (${forecastRain}mm) ok — ${crop.name} is drought-tolerant`);
    else if (forecastRain < crop.climate.minRain)
      parts.push(`⚠ Forecast rain (${forecastRain}mm) below ideal (${crop.climate.minRain}mm+)`);
    else
      parts.push(`⚠ Excess rainfall forecast may stress ${crop.name}`);

    if (droughtRisk > 55 && crop.droughtTolerance > 0.65)
      parts.push(`High drought risk (${droughtRisk}%) favours this crop`);
    if (droughtRisk > 55 && crop.droughtTolerance < 0.35)
      parts.push(`⚠ High drought risk (${droughtRisk}%) is a concern`);
    if (maxTemp14d > 40 && crop.climate.maxTemp < 38)
      parts.push(`⚠ Forecast heat (${maxTemp14d}°C) may cause stress`);
    if (sentiment > 0.08)
      parts.push(`Positive market news sentiment detected`);
    if (sentiment < -0.08)
      parts.push(`⚠ Negative news signal for this crop`);
    if (crop.msp)
      parts.push(`MSP ₹${crop.msp.toLocaleString('en-IN')}/qtl provides a price floor`);
    if (waterScore < 0.45)
      parts.push(`⚠ Water availability may limit yield`);

    return {
      ...crop,
      scores: {
        weather: Math.round(weatherScore * 100),
        risk:    Math.round(riskScore    * 100),
        profit:  Math.round(adjProfit    * 100),
        market:  Math.round(marketScore  * 100),
        water:   Math.round(waterScore   * 100),
      },
      confidence,
      riskLevel:   confidence > 76 ? 'Low' : confidence > 62 ? 'Medium' : 'High',
      explanation: parts.join(' · '),
      topPick:     false,
    };
  });

  return scored
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 8)
    .map((c, i) => ({ ...c, topPick: i === 0 }));
}
