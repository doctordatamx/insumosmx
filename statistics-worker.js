/* Capa descriptiva v2: consume la selección del motor base, sin modificarla. */
let scientificCache = null, scientificSubscribed = false;
const SCIENTIFIC_VERSION = '2.0.0';
function newScientificGroup() {
  return { count: 0, validQuantity: 0, positiveRequest: 0, complete: 0, zero: 0, requested: 0, delivered: 0, pending: 0,
    deliveredRows: 0, invalidResponseDates: 0, negativeIntervals: 0, frequencies: new Map() };
}
function addScientific(group, row) {
  group.count++;
  const q = row[9], e = row[10];
  if (!Number.isFinite(q) || !Number.isFinite(e) || q < 0 || e < 0) return;
  group.validQuantity++; group.requested += q; group.delivered += e; group.pending += Math.max(0, q - e);
  if (q > 0) { group.positiveRequest++; if (e >= q) group.complete++; if (e === 0) group.zero++; }
  if (e <= 0) return;
  group.deliveredRows++;
  const [s, d] = dates(row);
  if (s === null || d === null || !Number.isFinite(s) || !Number.isFinite(d)) { group.invalidResponseDates++; return; }
  if (d < s) { group.negativeIntervals++; return; }
  const days = d - s; group.frequencies.set(days, (group.frequencies.get(days) || 0) + 1);
}
function finishScientific(group) {
  const { frequencies, ...counts } = group;
  return { ...counts, completeRate: ScientificStats.ratio(group.complete, group.positiveRequest),
    zeroRate: ScientificStats.ratio(group.zero, group.positiveRequest),
    gapRate: ScientificStats.ratio(group.pending, group.requested),
    invalidResponseDateRate: ScientificStats.ratio(group.invalidResponseDates, group.deliveredRows),
    times: ScientificStats.describeFrequencies(frequencies) };
}
function calculateScientificReport() {
  const start = performance.now(), overall = newScientificGroup(), groups = new Map(), providers = new Map(), pairs = new Map();
  const groupIndex = IDX[config.group];
  let unknownSupplierVolume = 0, pairExcludedVolume = 0;
  for (const index of selected) {
    const row = db.rows[index], key = row[groupIndex];
    if (!groups.has(key)) groups.set(key, { ...newScientificGroup(), key, name: text(row, groupIndex) || 'Sin dato' });
    addScientific(overall, row); addScientific(groups.get(key), row);
    const q = row[9], e = row[10];
    if (!Number.isFinite(q) || !Number.isFinite(e) || q <= 0 || e < 0) continue;
    const supplier = text(row, 5).trim(), drug = text(row, 0).trim(), institution = text(row, 2).trim();
    if (!supplier) { unknownSupplierVolume += q; pairExcludedVolume += q; continue; }
    providers.set(row[5], (providers.get(row[5]) || 0) + q);
    if (!drug || !institution) { pairExcludedVolume += q; continue; }
    const pairKey = row[0] + ':' + row[2];
    if (!pairs.has(pairKey)) pairs.set(pairKey, { clave: drug, institution, providerVolumes: new Map(), records: 0 });
    const pair = pairs.get(pairKey); pair.records++;
    pair.providerVolumes.set(row[5], (pair.providerVolumes.get(row[5]) || 0) + q);
  }
  const distribution = ScientificStats.empiricalCdf(overall.frequencies);
  const bins = [{ label: '0–7 días', min: 0, max: 7, count: 0 }, { label: '8–14 días', min: 8, max: 14, count: 0 },
    { label: '15–30 días', min: 15, max: 30, count: 0 }, { label: '31–60 días', min: 31, max: 60, count: 0 },
    { label: '61–90 días', min: 61, max: 90, count: 0 }, { label: 'Más de 90 días', min: 91, max: null, count: 0 }];
  for (const point of distribution) bins.find(bin => point.days >= bin.min && (bin.max === null || point.days <= bin.max)).count += point.count;
  const known = ScientificStats.concentration(providers.values());
  const byKeyInstitution = [...pairs.values()].map(pair => ({ clave: pair.clave, institution: pair.institution, records: pair.records,
    ...ScientificStats.concentration(pair.providerVolumes.values()) })).sort((a, b) => b.volume - a.volume || a.clave.localeCompare(b.clave));
  return { version: SCIENTIFIC_VERSION, context: {
    source: db.meta.source, sourceSha256: db.meta.sourceSha256 || null, retrievedAt: db.meta.retrievedAt,
    evaluationDate: config.asof, grouping: config.group, filterCodes: { ...(config.filters || {}) }, indicatorCatalogVersion: '2.0.0',
    geoMunicipality: config.geoMunicipality || null, geoCatalogSha256: config.geoMunicipality ? geoBundle?.meta.catalog.sha256 : null,
    filters: Object.fromEntries(Object.entries(config.filters || {}).filter(([, value]) => value !== '').map(([field, value]) => [field, db.dictionaries[IDX[field]]?.[Number(value)] || 'Sin dato'])),
    search: config.search || '', from: config.from || null, to: config.to || null, scope: config.scope || 'all',
    kind: 'Descriptivo; no inferencia causal, predicción o desabasto clínico' },
    base: { ...result.total }, overall: finishScientific(overall), groups: [...groups.values()].map(finishScientific),
    distribution, bins, concentration: { ...known, unknownSupplierVolume,
      knownSupplierCoverage: ScientificStats.ratio(known.volume, overall.requested), pairExcludedVolume, byKeyInstitution },
    computeMs: performance.now() - start };
}
function publishScientificReport() {
  if (!result) { self.postMessage({ type: 'scientific-pending' }); return; }
  if (!scientificCache) scientificCache = calculateScientificReport();
  self.postMessage({ type: 'scientific-result', report: scientificCache });
}
function exportScientific(kind, presentation = {}) {
  if (!result) throw Error('Espera a que termine el cálculo del universo seleccionado.');
  if (!scientificCache) scientificCache = calculateScientificReport();
  const report = scientificCache;
  if (kind === 'json') {
    self.postMessage({ type: 'export', name: `observatorio-analisis-${config.asof}.json`,
      blob: new Blob([JSON.stringify({ ...report, presentation }, null, 2)], { type: 'application/json;charset=utf-8' }) }); return;
  }
  let headers, records;
  if (kind === 'concentration') {
    headers = ['clave', 'institution', 'records', 'providers', 'volume', 'hhi10000', 'effectiveProviders', 'gini', 'entropy', 'normalizedEntropy', 'top1', 'top5'];
    records = report.concentration.byKeyInstitution;
  } else if (kind === 'distribution') {
    headers = ['days', 'count', 'cumulative', 'fraction']; records = report.distribution;
  } else {
    headers = ['name', 'count', 'validQuantity', 'positiveRequest', 'requested', 'delivered', 'pending', 'completeRate', 'zeroRate', 'gapRate', 'n', 'median', 'p25', 'p75', 'p90', 'p95', 'iqr', 'mad', 'mean', 'sd', 'cv', 'invalidResponseDates', 'negativeIntervals'];
    const minimum = Math.max(0, Number(presentation.minimumN) || 0), metric = presentation.sort || 'pending';
    records = report.groups.filter(group => group.times.n >= minimum).map(group => ({ ...group, ...group.times }));
    records.sort((a, b) => (b[metric] ?? -Infinity) - (a[metric] ?? -Infinity));
  }
  const csv = [headers.map(csvCell).join(','), ...records.map(record => headers.map(key => csvCell(record[key])).join(','))].join('\r\n');
  self.postMessage({ type: 'export', name: `observatorio-${kind}-${config.asof}.csv`, blob: new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }) });
}
