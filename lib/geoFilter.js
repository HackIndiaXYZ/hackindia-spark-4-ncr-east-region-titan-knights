import CROPS from './cropDatabase';

/**
 * Filter crops to only those viable for a given location and current season.
 * This is a hard gate — runs BEFORE any scoring.
 */
export function getCropCandidates({ stateName, lat, altitudeM = 0 }) {
  const currentMonth = new Date().getMonth(); // 0-indexed (Jan=0)

  const candidates = CROPS.filter(crop => {
    // ── HARD FILTER 1: State match ──────────────────────────────────────────
    if (!stateName) return true; // if we couldn't get state, include all
    const stateMatch = crop.geo.states.some(s =>
      stateName.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(stateName.toLowerCase())
    );
    if (!stateMatch) return false;

    // ── HARD FILTER 2: Latitude range ───────────────────────────────────────
    if (lat !== undefined && lat !== null) {
      if (lat < crop.geo.latRange[0] || lat > crop.geo.latRange[1]) return false;
    }

    // ── HARD FILTER 3: Altitude range ───────────────────────────────────────
    if (altitudeM < crop.geo.altRange[0] || altitudeM > crop.geo.altRange[1]) return false;

    // ── SOFT FILTER: Season relevance ────────────────────────────────────────
    // Include annual crops always, others only if within planting window ±2 months
    if (crop.season === 'Annual') return true;
    const relevantMonths = [-2, -1, 0, 1, 2, 3].map(o => ((currentMonth + o + 12) % 12));
    return crop.months.some(m => relevantMonths.includes(m));
  });

  // If geographic filtering leaves fewer than 4 crops, relax season filter
  if (candidates.length < 4) {
    return CROPS.filter(crop => {
      const stateMatch = !stateName || crop.geo.states.some(s =>
        stateName.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(stateName.toLowerCase())
      );
      return stateMatch && altitudeM >= crop.geo.altRange[0] && altitudeM <= crop.geo.altRange[1];
    });
  }

  return candidates;
}
