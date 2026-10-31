/* Vista descriptiva y catálogo: se activan sin reemplazar el motor validado. */
const scientificSection = document.createElement('section');
scientificSection.id = 'estadistica'; scientificSection.dataset.view = '';
scientificSection.innerHTML = `<div class="page-title"><div><p class="eyebrow">MOTOR ANALÍTICO · DESCRIPTIVO</p><h1>Distribución y concentración</h1><p>Comprende los tiempos de respuesta y la distribución del volumen entre proveedores.</p></div></div>
<div class="notice"><span>ⓘ</span><p><strong>Análisis del universo filtrado.</strong> No compara proveedores como si tuvieran la misma cartera, no identifica efectos causales y no estima desabasto clínico.</p></div>
<div class="scientific-toolbar"><label>Agrupar resultados<select id="statsGroup" aria-label="Agrupar resultados estadísticos"></select></label><button id="statsJson">↓ Reporte reproducible JSON</button><a href="#/catalogo">Definiciones de los indicadores ↗</a></div>
<p id="scientificStatus" class="status" role="status" aria-live="polite">Abre esta vista para calcular los indicadores ampliados.</p><div id="scientificContext" class="caption"></div><div id="scientificKpis" class="secondary-kpis"></div>
<div class="two-cols scientific-panels"><article class="panel"><div class="panel-heading"><h2>Distribución de tiempos</h2><div><button id="histSvg">SVG</button><button id="histPng">PNG</button></div></div><div id="responseHistogram" class="stat-chart"></div><p class="caption">Días naturales por registro, sin ponderar por piezas. Intervalos negativos y fechas inválidas excluidos.</p><details class="data-alternative"><summary>Ver frecuencias y distribución acumulada</summary><button id="distributionCsv">↓ Frecuencias CSV</button><div id="distributionTable" class="table-wrap"></div></details></article>
<article class="panel"><div class="panel-heading"><h2>Distribución acumulada</h2><button id="cdfSvg">SVG</button></div><div id="responseCdf" class="stat-chart"></div><p class="caption">Proporción de intervalos válidos no mayores al número de días del eje. Descripción empírica, sin estimación de supervivencia.</p><div id="responseBoxplot" class="stat-chart"></div><p class="caption">Caja P25–P75; línea central mediana; extremos mínimo–máximo observado. No usa bigotes de Tukey ni clasifica atípicos.</p></article></div>
<article class="panel scientific-panels"><h2>Concentración de proveedores</h2><p>Volumen de piezas solicitadas a proveedores con nombre no vacío. No es gasto ni participación en un mercado definido.</p><div id="concentrationKpis" class="secondary-kpis"></div><div id="concentrationCoverage"></div><p class="caption">HHI se presenta en escala 0–10,000, sin umbrales de competencia. Gini y entropía consideran sólo proveedores con volumen positivo observado. Un proveedor único produce Gini=0 entre los observados y HHI=10,000; ambos describen aspectos distintos.</p></article>
<article class="panel table-panel"><div class="panel-heading"><h2>Resultados por grupo</h2><button id="statsGroupsCsv">↓ Indicadores CSV</button></div><div class="scientific-toolbar table-toolbar"><label>Ordenar por<select id="statsSort"><option value="pending">Mayor brecha</option><option value="p95">Mayor P95 de respuesta</option><option value="gapRate">Mayor brecha relativa</option><option value="sd">Mayor dispersión de respuesta</option></select></label><label>Mínimo de intervalos válidos<input id="statsMinN" type="number" min="0" step="1" value="0"></label></div><div class="table-wrap"><table><caption class="sr-only">Indicadores y tiempos por grupo seleccionado</caption><thead><tr><th>Grupo</th><th>Filas</th><th>n respuesta</th><th>Mediana</th><th>P75</th><th>P90</th><th>P95</th><th>IQR</th><th>MAD</th><th>Media</th><th>DE (n−1)</th><th>CV</th><th>Brecha relativa</th><th>Completas / elegibles</th><th>Sin entrega / elegibles</th></tr></thead><tbody id="statisticsGroups"></tbody></table></div><div class="pagination"><button id="statsPrev">← Anterior</button><span id="statsPage"></span><button id="statsNext">Siguiente →</button></div></article>
<article class="panel table-panel"><div class="panel-heading"><h2>Concentración por clave e institución</h2><button id="pairsCsv">↓ Pares CSV</button></div><p class="caption table-caption">Orden por volumen solicitado descendente. Cada fila usa un denominador propio. No se suman presentaciones como tratamientos ni se interpreta proveedor único como ausencia de competencia.</p><div class="table-wrap"><table><thead><tr><th>Clave</th><th>Institución</th><th>Filas elegibles</th><th>Solicitadas con proveedor</th><th>Proveedores positivos</th><th>HHI</th><th>Gini</th><th>Entropía</th><th>Proveedor principal</th></tr></thead><tbody id="concentrationPairs"></tbody></table></div><div class="pagination"><button id="pairsPrev">← Anterior</button><span id="pairsPage"></span><button id="pairsNext">Siguiente →</button></div></article>`;
const catalogSection = document.createElement('section');
catalogSection.id = 'catalogo'; catalogSection.dataset.view = '';
catalogSection.innerHTML = `<div class="page-title"><div><p class="eyebrow">METODOLOGÍA VERSIONADA</p><h1>Catálogo de indicadores</h1><p>Fórmulas, denominadores, exclusiones y trazabilidad del motor descriptivo.</p></div><button id="downloadCatalog">↓ Catálogo JSON</button></div><p class="caption" id="catalogVersion"></p><label class="search">Buscar en el catálogo<input type="search" id="catalogSearch" placeholder="Mediana, cobertura, HHI…"></label><div id="catalogList" class="catalog-list"></div>`;
const pageFooter = document.querySelector('main>footer'); pageFooter.before(scientificSection, catalogSection);
dashboardRoutes.estadistica = ['estadistica', 'Distribución y concentración'];
dashboardRoutes.catalogo = ['catalogo', 'Catálogo de indicadores'];
for (const [key, icon, label] of [['estadistica', '∑', 'Distribución y concentración'], ['catalogo', '▣', 'Catálogo de indicadores']]) {
  const link = document.createElement('a'); link.href = '#/' + key; link.dataset.route = key; link.title = label;
  link.innerHTML = `<span class="nav-icon" aria-hidden="true">${icon}</span><span class="nav-text">${label}</span>`;
  $('navigation').querySelector('nav').append(link);
}
$('statsGroup').innerHTML = $('group').innerHTML;
let scientificReport = null, scientificPage = 0, pairPage = 0, scientificWaiting = false;
const decimal = value => value == null || !Number.isFinite(value) ? 'Sin dato' : new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 }).format(value);
const pairDays = (a, b) => a == null && b == null ? 'Sin dato' : `${decimal(a)} / ${decimal(b)} días`;
function setScientificWaiting(value) {
  scientificWaiting = value; scientificSection.setAttribute('aria-busy', String(value));
  for (const id of ['statsJson', 'statsGroupsCsv', 'pairsCsv', 'distributionCsv', 'histSvg', 'histPng', 'cdfSvg']) $(id).disabled = value;
  if (value) for (const id of ['statsPrev', 'statsNext', 'pairsPrev', 'pairsNext']) $(id).disabled = true;
}
const scientificMini = (label, value, note) => `<div class="mini-stat">${esc(label)}<strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
function activateScientific() {
  const active = routeName() === 'estadistica';
  $('statsGroup').value = $('group').value;
  worker.postMessage({ type: 'scientific-subscribe', enabled: active });
  if (active && !scientificReport) { setScientificWaiting(true); $('scientificStatus').textContent = 'Calculando estadística descriptiva sobre la selección actual…'; }
}
window.addEventListener('hashchange', activateScientific);
$('statsGroup').onchange = () => { $('group').value = $('statsGroup').value; scientificWaiting = true; analyze(); };
function scientificRequestExport(kind) {
  if (busy || scientificWaiting || !scientificReport) { toast('Espera a que termine el análisis del universo seleccionado.'); return; }
  worker.postMessage({ type: 'scientific-export', kind, presentation: { minimumN: Math.max(0, Number($('statsMinN').value) || 0), sort: $('statsSort').value } });
}
for (const [id, kind] of [['statsJson', 'json'], ['statsGroupsCsv', 'groups'], ['pairsCsv', 'concentration'], ['distributionCsv', 'distribution']]) $(id).onclick = () => scientificRequestExport(kind);
function scientificColors() {
  const style = getComputedStyle(document.documentElement);
  return { background: style.getPropertyValue('--panel').trim(), ink: style.getPropertyValue('--ink').trim(), line: style.getPropertyValue('--line').trim(), blue: style.getPropertyValue('--blue').trim(), teal: style.getPropertyValue('--teal').trim() };
}
function svgFrame(title, description, content, height = 240) {
  const colors = scientificColors();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" width="720" height="${height}" role="img"><title>${esc(title)}</title><desc>${esc(description)}</desc><rect width="720" height="${height}" fill="${colors.background}"/><g font-family="system-ui,sans-serif" font-size="12" fill="${colors.ink}">${content}</g></svg>`;
}
function renderScientificCharts() {
  if (!scientificReport) return;
  const report = scientificReport, colors = scientificColors(), n = report.overall.times.n;
  if (!n) { for (const id of ['responseHistogram', 'responseCdf', 'responseBoxplot']) $(id).innerHTML = '<p class="empty">Sin intervalos válidos para estos filtros.</p>'; return; }
  const maximum = Math.max(1, ...report.bins.map(bin => bin.count));
  let histogram = '<text x="55" y="19">Frecuencia de registros</text>';
  for (let tick = 0; tick <= 4; tick++) {
    const y = 188 - tick * 38;
    histogram += `<line x1="65" y1="${y}" x2="700" y2="${y}" stroke="${colors.line}"/><text x="58" y="${y + 4}" text-anchor="end">${fmt(maximum * tick / 4)}</text>`;
  }
  report.bins.forEach((bin, index) => {
    const x = 83 + index * 103, height = bin.count / maximum * 152;
    histogram += `<g><title>${esc(bin.label)}: ${fmt(bin.count)} (${pct(bin.count / n)})</title><rect x="${x}" y="${188 - height}" width="65" height="${height}" fill="${colors.blue}" rx="3"/><text x="${x + 32}" y="${Math.max(31, 181 - height)}" text-anchor="middle" font-size="11">${fmt(bin.count)}</text><text x="${x + 32}" y="213" text-anchor="middle" font-size="11">${esc(bin.label.replace(' días', ''))}</text></g>`;
  });
  histogram += '<text x="704" y="235" text-anchor="end">Días de respuesta registrada</text>';
  $('responseHistogram').innerHTML = svgFrame('Histograma de respuesta', `n=${n}. ${report.bins.map(bin => bin.label + ': ' + bin.count).join('; ')}.`, histogram);
  const maxDay = Math.max(1, report.overall.times.max), xScale = days => 62 + days / maxDay * 628, yScale = value => 187 - value * 150;
  let cdf = '<text x="62" y="19">Proporción acumulada</text>';
  for (const tick of [0, .25, .5, .75, 1]) cdf += `<line x1="62" y1="${yScale(tick)}" x2="690" y2="${yScale(tick)}" stroke="${colors.line}"/><text x="55" y="${yScale(tick) + 4}" text-anchor="end">${tick * 100}%</text>`;
  let path = `M 62 ${yScale(0)}`;
  for (const point of report.distribution) path += ` H ${xScale(point.days)} V ${yScale(point.fraction)}`;
  cdf += `<path d="${path}" fill="none" stroke="${colors.teal}" stroke-width="3"/>`;
  for (let i = 0; i <= 4; i++) cdf += `<text x="${xScale(maxDay * i / 4)}" y="210" text-anchor="middle">${decimal(maxDay * i / 4)}</text>`;
  cdf += '<text x="690" y="235" text-anchor="end">Días de respuesta registrada</text>';
  $('responseCdf').innerHTML = svgFrame('Distribución acumulada empírica', `n=${n}; proporción de intervalos no mayores a cada número de días. Valores exactos en la tabla de frecuencias.`, cdf);
  const times = report.overall.times, x = value => 50 + value / maxDay * 620;
  const box = `<text x="50" y="20">Resumen de cinco números (días)</text><line x1="${x(times.min)}" y1="60" x2="${x(times.max)}" y2="60" stroke="${colors.ink}"/><rect x="${x(times.p25)}" y="43" width="${Math.max(1, x(times.p75) - x(times.p25))}" height="34" fill="${colors.teal}" opacity=".4" stroke="${colors.ink}"/><line x1="${x(times.median)}" y1="40" x2="${x(times.median)}" y2="80" stroke="${colors.ink}" stroke-width="2"/>` + [times.min, times.max].map(value => `<line x1="${x(value)}" y1="50" x2="${x(value)}" y2="70" stroke="${colors.ink}"/>`).join('') + `<text x="50" y="106">Mín ${decimal(times.min)} · P25 ${decimal(times.p25)} · Mediana ${decimal(times.median)} · P75 ${decimal(times.p75)} · Máx ${decimal(times.max)}</text>`;
  $('responseBoxplot').innerHTML = svgFrame('Caja de tiempos de respuesta', 'Extremos mínimo y máximo; caja de percentiles por rango más próximo; mediana por promedio central.', box, 124);
}
function renderScientificReport(report) {
  scientificReport = report; setScientificWaiting(false); scientificPage = 0; pairPage = 0;
  const times = report.overall.times, c = report.concentration;
  $('scientificStatus').textContent = `${fmt(report.overall.count)} filas · n respuesta=${fmt(times.n)} · estadísticas actualizadas para los filtros activos.`;
  $('scientificContext').textContent = `Evaluación de vencimientos: ${report.context.evaluationDate} · Recuperación: ${report.context.retrievedAt} · Agrupación: ${$('statsGroup').selectedOptions[0]?.text || report.context.grouping} · Motor descriptivo ${report.version}.`;
  $('scientificKpis').innerHTML = scientificMini('Mediana / P90', pairDays(times.median, times.p90), `n=${fmt(times.n)} intervalos válidos`)
    + scientificMini('P75 / P95', pairDays(times.p75, times.p95), 'Rango más próximo, sin interpolación')
    + scientificMini('IQR / MAD', pairDays(times.iqr, times.mad), 'MAD sin factor de reescalado')
    + scientificMini('Media / DE', pairDays(times.mean, times.sd), `DE con n−1 · CV=${decimal(times.cv)}`);
  $('concentrationKpis').innerHTML = scientificMini('HHI · escala 0–10,000', decimal(c.hhi10000), `${fmt(c.providers)} proveedores de volumen positivo`)
    + scientificMini('Gini de volumen', decimal(c.gini), 'Entre proveedores positivos observados')
    + scientificMini('Entropía de Shannon', decimal(c.entropy), `Normalizada: ${decimal(c.normalizedEntropy)}`)
    + scientificMini('Número efectivo', decimal(c.effectiveProviders), `Proveedor principal: ${pct(c.top1)}`);
  $('concentrationCoverage').innerHTML = stat('Solicitadas con proveedor no vacío', `${fmt(c.volume)} / ${fmt(report.overall.requested)} piezas (${pct(c.knownSupplierCoverage)})`)
    + stat('Volumen sin proveedor', fmt(c.unknownSupplierVolume)) + stat('Volumen excluido de pares por dimensiones faltantes', fmt(c.pairExcludedVolume))
    + stat('Fechas de respuesta no evaluables', `${fmt(report.overall.invalidResponseDates)} / ${fmt(report.overall.deliveredRows)} (${pct(report.overall.invalidResponseDateRate)})`)
    + stat('Intervalos negativos excluidos', fmt(report.overall.negativeIntervals));
  $('distributionTable').innerHTML = '<table><thead><tr><th>Días</th><th>Frecuencia</th><th>Acumulados</th><th>Proporción acumulada</th></tr></thead><tbody>' + report.distribution.map(point => `<tr><td>${point.days}</td><td>${fmt(point.count)}</td><td>${fmt(point.cumulative)}</td><td>${pct(point.fraction)}</td></tr>`).join('') + '</tbody></table>';
  renderScientificCharts(); renderScientificGroups(); renderConcentrationPairs();
  scientificSection.querySelectorAll('thead th').forEach(header => header.setAttribute('scope', 'col'));
}
function renderScientificGroups() {
  if (!scientificReport) return;
  const metric = $('statsSort').value, minimum = Math.max(0, Math.floor(Number($('statsMinN').value) || 0));
  const groups = scientificReport.groups.filter(group => group.times.n >= minimum).sort((a, b) => ((b.times[metric] ?? b[metric]) ?? -Infinity) - ((a.times[metric] ?? a[metric]) ?? -Infinity));
  scientificPage = Math.min(scientificPage, Math.max(0, Math.ceil(groups.length / 25) - 1));
  $('statisticsGroups').innerHTML = groups.slice(scientificPage * 25, scientificPage * 25 + 25).map(group => `<tr><td>${esc(group.name)}</td><td>${fmt(group.count)}</td><td>${fmt(group.times.n)}</td>` + ['median', 'p75', 'p90', 'p95', 'iqr', 'mad', 'mean', 'sd', 'cv'].map(key => `<td>${decimal(group.times[key])}</td>`).join('') + `<td>${pct(group.gapRate)}</td><td>${pct(group.completeRate)}<small>${fmt(group.complete)} / ${fmt(group.positiveRequest)}</small></td><td>${pct(group.zeroRate)}<small>${fmt(group.zero)} / ${fmt(group.positiveRequest)}</small></td></tr>`).join('') || '<tr><td colspan="15">Sin grupos elegibles con este mínimo.</td></tr>';
  $('statsPage').textContent = `${fmt(groups.length)} grupos · ${scientificPage + 1} / ${Math.max(1, Math.ceil(groups.length / 25))}`;
  $('statsPrev').disabled = scientificPage === 0; $('statsNext').disabled = (scientificPage + 1) * 25 >= groups.length;
}
function renderConcentrationPairs() {
  const pairs = scientificReport.concentration.byKeyInstitution;
  $('concentrationPairs').innerHTML = pairs.slice(pairPage * 25, pairPage * 25 + 25).map(pair => `<tr><td>${esc(pair.clave)}</td><td>${esc(pair.institution)}</td><td>${fmt(pair.records)}</td><td>${fmt(pair.volume)}</td><td>${fmt(pair.providers)}</td><td>${decimal(pair.hhi10000)}</td><td>${decimal(pair.gini)}</td><td>${decimal(pair.entropy)}</td><td>${pct(pair.top1)}</td></tr>`).join('') || '<tr><td colspan="9">Sin pares con volumen y dimensiones válidas.</td></tr>';
  $('pairsPage').textContent = `${fmt(pairs.length)} pares · ${pairPage + 1} / ${Math.max(1, Math.ceil(pairs.length / 25))}`;
  $('pairsPrev').disabled = pairPage === 0; $('pairsNext').disabled = (pairPage + 1) * 25 >= pairs.length;
}
$('statsSort').onchange = () => { scientificPage = 0; renderScientificGroups(); };
$('statsMinN').oninput = () => { scientificPage = 0; renderScientificGroups(); };
$('statsPrev').onclick = () => { scientificPage--; renderScientificGroups(); }; $('statsNext').onclick = () => { scientificPage++; renderScientificGroups(); };
$('pairsPrev').onclick = () => { pairPage--; renderConcentrationPairs(); }; $('pairsNext').onclick = () => { pairPage++; renderConcentrationPairs(); };
function exportScientificSvg(id, name) {
  if (scientificWaiting || busy) return;
  const svg = $(id).querySelector('svg'); if (!svg) { toast('No hay un gráfico con datos para exportar.'); return; }
  download(new Blob([svg.outerHTML], { type: 'image/svg+xml' }), `observatorio-${name}-${$('asof').value}.svg`);
}
$('histSvg').onclick = () => exportScientificSvg('responseHistogram', 'histograma'); $('cdfSvg').onclick = () => exportScientificSvg('responseCdf', 'distribucion-acumulada');
$('histPng').onclick = async () => {
  if (scientificWaiting || busy) return;
  const svg = $('responseHistogram').querySelector('svg'); if (!svg) { toast('No hay intervalos válidos para exportar.'); return; }
  const url = URL.createObjectURL(new Blob([svg.outerHTML], { type: 'image/svg+xml' }));
  const image = new Image();
  image.onload = () => { try { const canvas = document.createElement('canvas'); canvas.width = 1440; canvas.height = 480; canvas.getContext('2d').drawImage(image, 0, 0, 1440, 480); canvas.toBlob(blob => { if (blob) download(blob, `observatorio-histograma-${$('asof').value}.png`); else toast('No se pudo generar el PNG.'); }); } catch { toast('No se pudo generar el PNG.'); } finally { URL.revokeObjectURL(url); } };
  image.onerror = () => { URL.revokeObjectURL(url); toast('No se pudo convertir el gráfico a PNG.'); }; image.src = url;
};
function renderCatalog() {
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const search = normalize($('catalogSearch').value);
  const records = IndicatorCatalog.indicators.filter(record => normalize(record.name + ' ' + record.id + ' ' + record.formula).includes(search));
  $('catalogVersion').textContent = `Catálogo ${IndicatorCatalog.version} · ${records.length} de ${IndicatorCatalog.indicators.length} fichas · ${IndicatorCatalog.notation}`;
  $('catalogList').innerHTML = records.map(record => `<details class="panel catalog-record"><summary>${esc(record.name)} <span class="caption">${esc(record.id)}</span></summary><dl>` + [['Objetivo', record.objective], ['Definición y fórmula', record.formula], ['Numerador', record.numerator], ['Denominador', record.denominator], ['Unidad', record.unit], ['Campos', record.fields.join(', ')], ['Universo', record.universe], ['Exclusiones', record.exclusions], ['Interpretación', record.interpretation], ['Limitaciones', record.limitations], ['Fecha y corte', record.date], ['Referencia al cálculo', record.computeReference]].map(([label, value]) => `<dt>${esc(label)}</dt><dd>${esc(value)}</dd>`).join('') + '</dl></details>').join('') || '<p class="empty">Sin indicadores con ese término.</p>';
}
$('catalogSearch').oninput = renderCatalog;
$('downloadCatalog').onclick = () => download(new Blob([JSON.stringify(IndicatorCatalog, null, 2)], { type: 'application/json;charset=utf-8' }), `observatorio-catalogo-${IndicatorCatalog.version}.json`);
$('themeToggle').addEventListener('click', renderScientificCharts);
worker.addEventListener('message', ({ data: message }) => {
  if (message.type === 'ready') { scientificReport = null; activateScientific(); }
  if (message.type === 'result') {
    scientificReport = null;
    if (routeName() === 'estadistica') { setScientificWaiting(true); $('scientificStatus').textContent = 'Actualizando distribución y concentración para estos filtros…'; }
  }
  if (message.type === 'scientific-result') renderScientificReport(message.report);
  if (message.type === 'scientific-error') { setScientificWaiting(true); scientificSection.setAttribute('aria-busy', 'false'); $('scientificStatus').textContent = 'No fue posible calcular este análisis: ' + message.message; }
});
const scientificStatusObserver = new MutationObserver(() => {
  if (routeName() === 'estadistica' && $('status').textContent.startsWith('Calculando')) {
    setScientificWaiting(true); $('scientificStatus').textContent = 'Actualizando el universo y sus estadísticas…';
  }
});
scientificStatusObserver.observe($('status'), { childList: true, characterData: true, subtree: true });
renderCatalog(); applyRoute(); activateScientific();
