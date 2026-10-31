/* Estadística descriptiva exacta a partir de frecuencias; no expande intervalos repetidos. */
(function (root) {
  'use strict';
  const ratio = (a, b) => b > 0 ? a / b : null;
  function atRank(entries, rank) {
    let cumulative = 0;
    for (const [value, count] of entries) { cumulative += count; if (cumulative >= rank) return value; }
    return null;
  }
  function medianOf(entries, n) {
    return n ? (atRank(entries, Math.floor((n + 1) / 2)) + atRank(entries, Math.ceil((n + 1) / 2))) / 2 : null;
  }
  function describeFrequencies(frequencies) {
    const entries = [...frequencies].filter(([, count]) => count > 0).sort((a, b) => a[0] - b[0]);
    const n = entries.reduce((sum, [, count]) => sum + count, 0);
    if (!n) return { n: 0, min: null, max: null, median: null, p25: null, p75: null, p90: null, p95: null, iqr: null, mad: null, mean: null, sd: null, cv: null };
    const mean = entries.reduce((sum, [value, count]) => sum + value * count, 0) / n;
    const median = medianOf(entries, n);
    const p = probability => atRank(entries, Math.max(1, Math.ceil(probability * n)));
    const p25 = p(.25), p75 = p(.75);
    const varianceSum = entries.reduce((sum, [value, count]) => sum + count * (value - mean) ** 2, 0);
    const sd = n > 1 ? Math.sqrt(varianceSum / (n - 1)) : null;
    const deviations = new Map();
    for (const [value, count] of entries) { const d = Math.abs(value - median); deviations.set(d, (deviations.get(d) || 0) + count); }
    return { n, min: entries[0][0], max: entries.at(-1)[0], median, p25, p75, p90: p(.9), p95: p(.95),
      iqr: p75 - p25, mad: medianOf([...deviations].sort((a, b) => a[0] - b[0]), n), mean, sd, cv: mean > 0 && sd !== null ? sd / mean : null };
  }
  function concentration(volumes) {
    const positive = [...volumes].filter(value => Number.isFinite(value) && value > 0).sort((a, b) => a - b);
    const n = positive.length, total = positive.reduce((a, b) => a + b, 0);
    if (!n) return { providers: 0, volume: 0, hhi: null, hhi10000: null, effectiveProviders: null, gini: null, entropy: null, normalizedEntropy: null, top1: null, top5: null };
    const shares = positive.map(v => v / total);
    const hhi = shares.reduce((sum, s) => sum + s * s, 0);
    const entropy = Math.max(0, -shares.reduce((sum, s) => sum + s * Math.log(s), 0));
    const gini = positive.reduce((sum, v, i) => sum + (2 * (i + 1) - n - 1) * v, 0) / (n * total);
    return { providers: n, volume: total, hhi, hhi10000: hhi * 10000, effectiveProviders: 1 / hhi,
      gini: Math.max(0, Math.min(1, gini)), entropy, normalizedEntropy: n === 1 ? 0 : entropy / Math.log(n),
      top1: positive.at(-1) / total, top5: positive.slice(-5).reduce((a, b) => a + b, 0) / total };
  }
  function empiricalCdf(frequencies) {
    const entries = [...frequencies].sort((a, b) => a[0] - b[0]);
    const n = entries.reduce((sum, [, count]) => sum + count, 0); let cumulative = 0;
    return entries.map(([days, count]) => { cumulative += count; return { days, count, cumulative, fraction: ratio(cumulative, n) }; });
  }
  const api = { ratio, describeFrequencies, concentration, empiricalCdf };
  root.ScientificStats = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
