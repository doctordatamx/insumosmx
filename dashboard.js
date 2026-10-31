/* Presentación de Fase 1. No redefine las fórmulas del motor de referencia. */
const dashboardRoutes = {
  panorama: ['panorama', 'Panorama nacional'], territorio: ['territorio', 'Atlas territorial'],
  claves: ['comparar', 'Insumos y claves', 'clave'], instituciones: ['comparar', 'Instituciones', 'institucion'],
  proveedores: ['comparar', 'Proveedores', 'nombre_proveedor'], contratos: ['comparar', 'Contratos y procedimientos', 'contrato'],
  evolucion: ['evolucion', 'Evolución temporal'], brechas: ['comparar', 'Brechas y vencimientos'],
  registros: ['registros', 'Explorador de registros'], calidad: ['calidad', 'Calidad de datos'],
  metodologia: ['metodologia', 'Metodología y fuentes'], actualizaciones: ['actualizaciones', 'Actualizaciones e histórico'],
};
const dimensionLabels = { entidad: 'Estado', institucion: 'Institución', nombre_proveedor: 'Proveedor', estatus: 'Estatus', canceladas_activas: 'Remisión', unidad_medica: 'Unidad', tipo_procedimiento_1: 'Compra', search: 'Búsqueda', from: 'Desde', to: 'Hasta', scope: 'Universo' };
for (const key of [...filterKeys, 'from', 'to', 'scope', 'asof']) {
  $(key).setAttribute('aria-label', dimensionLabels[key] || 'Corte para vencimientos');
}
const additionalGroups = [['contrato', 'Por contrato'], ['licitacion', 'Por licitación'], ['tipo_procedimiento_1', 'Por tipo de compra'], ['unidad_medica', 'Por unidad médica']];
for (const [value, label] of additionalGroups) $('group').add(new Option(label, value));
document.querySelector('.skip-link').onclick = event => { event.preventDefault(); $('contenido').focus(); };
let dashboardOverview, dashboardStarted = performance.now(), dashboardRequestStart = 0;
let dashboardDurations = [], previousFilterState, filterHistory = [], restoringFilters = false;

function readPreference(key) { try { return localStorage.getItem('observatorio.' + key); } catch { return null; } }
function savePreference(key, value) { try { localStorage.setItem('observatorio.' + key, value); } catch { /* Navegación privada sin almacenamiento. */ } }
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $('themeToggle').setAttribute('aria-pressed', String(theme === 'dark'));
  $('themeToggle').setAttribute('aria-label', theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro');
  $('themeToggle').querySelector('span').textContent = theme === 'dark' ? 'Modo claro' : 'Modo oscuro';
  savePreference('theme', theme);
}
setTheme(readPreference('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
$('themeToggle').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
const mobileQuery = matchMedia('(max-width: 720px)');
function syncNav() {
  const open = mobileQuery.matches ? document.body.classList.contains('mobile-nav-open') : !document.body.classList.contains('nav-collapsed');
  $('navigation').inert = mobileQuery.matches && !open;
  $('navToggle').setAttribute('aria-expanded', String(open));
  $('navToggle').setAttribute('aria-label', open ? 'Plegar navegación' : 'Abrir navegación');
}
if (readPreference('collapsed') === 'true') document.body.classList.add('nav-collapsed');
$('navToggle').onclick = () => {
  if (mobileQuery.matches) {
    document.body.classList.toggle('mobile-nav-open'); syncNav();
    if (document.body.classList.contains('mobile-nav-open')) $('navigation').querySelector('a').focus();
  } else { document.body.classList.toggle('nav-collapsed'); savePreference('collapsed', document.body.classList.contains('nav-collapsed')); syncNav(); }
};
mobileQuery.addEventListener('change', syncNav); syncNav();
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
    document.body.classList.remove('mobile-nav-open'); syncNav(); $('navToggle').focus();
  }
});
$('filtersToggle').onclick = () => {
  const open = $('filterBody').classList.toggle('is-open');
  $('filtersToggle').setAttribute('aria-expanded', String(open)); savePreference('filtersOpen', open);
};
if (readPreference('filtersOpen') === 'true') { $('filterBody').classList.add('is-open'); $('filtersToggle').setAttribute('aria-expanded', 'true'); }

function routeName() {
  const old = location.hash.replace(/^#\/?/, '').split('?')[0];
  return ({ comparar: 'proveedores', contenido: 'panorama' })[old] || (dashboardRoutes[old] ? old : 'panorama');
}
function applyRoute(scroll = false) {
  const name = routeName(), [section, title, group] = dashboardRoutes[name];
  document.querySelectorAll('section[data-view]').forEach(node => { node.hidden = node.id !== section; });
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === name) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
  });
  document.title = title + ' · Observatorio de Insumos para la Salud en México · by Doctor DS';
  if (section === 'comparar') {
    $('comparar').querySelector('h2').textContent = title;
    $('comparar').querySelector('.panel-heading h3').textContent = 'Comparación · ' + $('metric').selectedOptions[0].text;
    if (group && $('group').value !== group) { $('group').value = group; if (ready) analyze(); }
  }
  document.body.classList.remove('mobile-nav-open'); syncNav();
  if (scroll) { window.scrollTo({ top: 0, behavior: 'instant' }); $('contenido').focus({ preventScroll: true }); }
}
window.addEventListener('hashchange', () => applyRoute(true)); applyRoute();

function filterState() { return Object.fromEntries([...filterKeys, 'search', 'from', 'to', 'scope'].map(key => [key, $(key).value])); }
function recordFilterChange() {
  if (!ready || restoringFilters) return;
  const next = filterState();
  if (previousFilterState && JSON.stringify(next) !== JSON.stringify(previousFilterState)) {
    filterHistory.push(previousFilterState); filterHistory = filterHistory.slice(-20);
  }
  previousFilterState = next; $('undoFilters').disabled = !filterHistory.length; renderFilterChips();
}
for (const key of [...filterKeys, 'from', 'to', 'scope']) $(key).addEventListener('change', recordFilterChange);
let filterRecordTimeout;
$('search').addEventListener('input', () => { clearTimeout(filterRecordTimeout); filterRecordTimeout = setTimeout(recordFilterChange, 400); });
$('reset').addEventListener('click', recordFilterChange);
$('undoFilters').onclick = () => {
  const state = filterHistory.pop(); if (!state) return;
  restoringFilters = true; for (const [key, value] of Object.entries(state)) $(key).value = value;
  previousFilterState = state; restoringFilters = false; $('undoFilters').disabled = !filterHistory.length;
  analyze(); renderFilterChips();
};
function renderFilterChips() {
  const chips = [];
  for (const key of [...filterKeys, 'search', 'from', 'to', 'scope']) {
    const node = $(key), value = node.value;
    if (!value || key === 'scope' && value === 'all') continue;
    const label = node.tagName === 'SELECT' ? node.selectedOptions[0]?.text : value;
    chips.push(`<button class="filter-chip" data-clear="${key}" title="Quitar filtro: ${esc(label)}">${esc(dimensionLabels[key])}: ${esc(label)} ×</button>`);
  }
  $('filterCount').textContent = chips.length;
  $('activeFilters').innerHTML = '<span>Universo:</span>' + (chips.join('') || '<span>Todos los registros · sin filtros de dimensión</span>');
  $('activeFilters').querySelectorAll('[data-clear]').forEach(button => button.onclick = () => {
    $(button.dataset.clear).value = button.dataset.clear === 'scope' ? 'all' : '';
    recordFilterChange(); analyze();
  });
}

function daysDisplay(value) { return value == null ? 'Sin dato' : new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 }).format(value) + ' días'; }
const indicatorDefinitions = {
  requested: ['Piezas solicitadas', 'Σ piezas_solicitadas en registros elegibles', 'Piezas', 'Ambas cantidades numéricas, finitas y no negativas. No se suman como tratamientos equivalentes.'],
  delivered: ['Piezas entregadas reportadas', 'Σ piezas en registros elegibles', 'Piezas', 'Cantidades publicadas por la fuente; no certifican recepción física o disponibilidad en farmacia.'],
  coverage: ['Cobertura acreditable', 'Σ min(piezas, piezas_solicitadas) / Σ piezas_solicitadas', 'Proporción de piezas', 'Las sobreentregas no compensan el faltante de otro registro. No es un promedio de porcentajes.'],
  pending: ['Brecha pendiente', 'Σ max(piezas_solicitadas − piezas, 0)', 'Piezas', 'Pendiente reportado del universo filtrado; no mide desabasto clínico.'],
  overdue: ['Brecha vencida', 'Σ brecha en filas con fecha_limite válida < corte de evaluación', 'Piezas', 'Sin fecha límite válida no se clasifica vencimiento. El corte no reconstruye entregas históricas.'],
  response: ['Tiempo de respuesta', 'Mediana y P90 de fecha_entrega − fecha_solicitud', 'Días naturales por registro', 'Piezas entregadas >0, fechas válidas y diferencia no negativa. No identifica primera entrega ni entrega completa. Mediana no ponderada; P90 por rango más próximo.'],
  timely: ['Puntualidad registrada', 'Registros entregados con fecha_entrega ≤ fecha_limite / registros entregados con ambas fechas válidas', 'Proporción de registros', 'No es OTIF; no exige completar la cantidad. Conserva la regla de la versión base.'],
  top5: ['Concentración de cinco proveedores', 'Σ solicitadas de los cinco mayores proveedores / Σ solicitadas válidas', 'Proporción de piezas solicitadas', 'Concentración de volumen observado; no demuestra falta de competencia.'],
};
function dashboardKpi(key, value, note, style = '') {
  const [label] = indicatorDefinitions[key];
  return `<article class="kpi ${style}"><small>${esc(label.toUpperCase())}</small><button class="method-trigger" data-indicator="${key}" aria-label="Ver definición de ${esc(label)}">ⓘ</button><div class="value">${esc(value)}</div><p>${esc(note)}</p><div class="kpi-cut">EVALUACIÓN DE VENCIMIENTOS · ${esc($('asof').value)}</div></article>`;
}
function renderDashboardIndicators() {
  if (!last) return;
  const total = last.total;
  $('kpis').innerHTML = dashboardKpi('requested', fmt(total.requested), 'Volumen logístico · registros elegibles')
    + dashboardKpi('delivered', fmt(total.delivered), 'Cantidad reportada por la fuente')
    + dashboardKpi('coverage', pct(total.coverage), 'Acreditables / solicitadas válidas', 'primary')
    + dashboardKpi('pending', fmt(total.pending), `Brecha relativa: ${pct(total.requested ? total.pending / total.requested : null)}`, 'warn')
    + dashboardKpi('overdue', fmt(total.overdue), `Del pendiente: ${pct(total.pending ? total.overdue / total.pending : null)}`, 'warn')
    + dashboardKpi('response', daysDisplay(total.median), `P90: ${daysDisplay(total.p90)} · n=${fmt(total.responseN)}`)
    + dashboardKpi('timely', pct(total.timely), `${fmt(total.onTime)} de ${fmt(total.timed)} registros evaluables`)
    + dashboardKpi('top5', pct(total.top5), 'Participación en piezas solicitadas');
  $('kpis').setAttribute('aria-busy', 'false');
  $('overviewAging').innerHTML = ['1–7 días', '8–30 días', '31–90 días', 'Más de 90 días'].map((label, i) => stat(label, fmt(last.aging[i]) + ' piezas')).join('');
  $('overviewQuality').innerHTML = stat('Entrega anterior a solicitud', fmt(total.badDates)) + stat('Sobreentregas', fmt(total.excess)) + stat('Cantidades inválidas o ausentes', fmt(total.invalid));
  $('qualityView').innerHTML = $('quality').innerHTML;
  $('timelineTable').innerHTML = '<table><caption class="sr-only">Flujos mensuales de piezas para las solicitudes filtradas</caption><thead><tr><th scope="col">Mes</th><th scope="col">Solicitadas por fecha de solicitud</th><th scope="col">Entregadas por fecha de entrega</th></tr></thead><tbody>' + last.timeline.map(([month, v]) => `<tr><th scope="row">${esc(month)}</th><td>${fmt(v.requested)}</td><td>${fmt(v.delivered)}</td></tr>`).join('') + '</tbody></table>';
  $('timeline').querySelectorAll('.month').forEach(node => { node.tabIndex = 0; node.setAttribute('aria-label', node.title); });
  $('comparar').querySelector('.panel-heading h3').textContent = 'Comparación · ' + $('metric').selectedOptions[0].text;
}
document.addEventListener('click', event => {
  const button = event.target.closest('[data-indicator]'); if (!button || !last || busy) return;
  const key = button.dataset.indicator, [name, formula, unit, limitation] = indicatorDefinitions[key], total = last.total;
  const denominator = ({ coverage: fmt(total.requested) + ' piezas solicitadas', timely: fmt(total.timed) + ' registros entregados con fechas válidas', response: fmt(total.responseN) + ' intervalos válidos', top5: fmt(total.requested) + ' piezas solicitadas' })[key] || fmt(last.count - total.invalid) + ' registros con ambas cantidades válidas';
  $('indicatorTitle').textContent = name;
  $('indicatorDetails').innerHTML = `<dl><dt>Fórmula operacional</dt><dd>${esc(formula)}</dd><dt>Unidad</dt><dd>${esc(unit)}</dd><dt>Denominador o universo elegible</dt><dd>${esc(denominator)}</dd><dt>Corte de evaluación de vencimientos</dt><dd>${esc($('asof').value)}</dd><dt>Universo observado</dt><dd>${fmt(last.count)} registros; filtros activos visibles en la página.</dd><dt>Interpretación y límites</dt><dd>${esc(limitation)}</dd><dt>Trazabilidad del cálculo</dt><dd>Motor analytics.js · funciones add y finish; derivación en dashboard.js. SHA-256 del original: ${esc(meta.sourceSha256 || 'importación local sin hash del original')}</dd></dl>`;
  $('indicatorDialog').showModal();
});
$('closeIndicator').onclick = () => $('indicatorDialog').close();
$('indicatorMethodLink').onclick = () => $('indicatorDialog').close();

function renderOverview(overview) {
  dashboardOverview = overview;
  const total = last.total;
  const mini = (label, value, note) => `<div class="mini-stat">${esc(label)}<strong>${esc(value)}</strong><small>${esc(note)}</small></div>`;
  $('secondaryKpis').innerHTML = mini('Registros analizados', fmt(overview.count), 'Filas, no órdenes únicas')
    + mini('Cumplimiento por cantidad', pct(overview.eligible ? total.complete / overview.eligible : null), `${fmt(total.complete)} / ${fmt(overview.eligible)} con solicitud >0`)
    + mini('Sin entrega reportada', pct(overview.eligible ? total.zero / overview.eligible : null), `${fmt(total.zero)} / ${fmt(overview.eligible)} con solicitud >0`)
    + mini('Brecha relativa', pct(total.requested ? total.pending / total.requested : null), 'Brecha / piezas solicitadas válidas')
    + mini('Proveedores representados', fmt(overview.suppliers), 'Nombres no vacíos, sin homologación')
    + mini('Instituciones representadas', fmt(overview.institutions), 'Valores no vacíos del universo')
    + mini('Claves distintas', fmt(overview.keys), 'Sin equivalencia entre presentaciones')
    + mini('CLUES reportadas', fmt(overview.clues), 'Distintas y no vacías · verificación no evaluada');
  for (const [dimension, target, field] of [['states', 'nationalStates', 'entidad'], ['suppliers', 'nationalSuppliers', 'nombre_proveedor'], ['keys', 'nationalKeys', 'clave']]) {
    const groups = overview.ranks[dimension], maximum = Math.max(1, ...groups.map(g => g.pending));
    $(target).innerHTML = groups.map(group => `<button class="rank-item" data-key="${group.key}" title="${esc(group.description || group.name)} · Solicitadas ${fmt(group.requested)} · Entregadas ${fmt(group.delivered)} · n=${fmt(group.count)}"><span><span class="rank-name">${esc(group.name)}</span><strong class="rank-number">${fmt(group.pending)}</strong></span><span class="rank-track"><i style="width:${group.pending / maximum * 100}%"></i></span></button>`).join('') || '<p class="empty">Sin registros para estos filtros.</p>';
    $(target).querySelectorAll('[data-key]').forEach(button => button.onclick = () => {
      if (field === 'clave') $('search').value = groups.find(g => g.key === Number(button.dataset.key)).name;
      else $(field).value = button.dataset.key;
      recordFilterChange(); analyze();
    });
  }
  $('cluesQuality').innerHTML = stat('Registros con CLUES no vacía', `${fmt(overview.withClues)} / ${fmt(overview.count)}`)
    + stat('CLUES distintas reportadas', fmt(overview.clues)) + stat('Registros sin CLUES', fmt(overview.missingClues)) + stat('Verificadas contra catálogo', 'No evaluado');
}

let toastTimeout;
function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimeout); toastTimeout = setTimeout(() => { $('toast').hidden = true; }, 4500); }
$('shareView').onclick = async () => { try { await navigator.clipboard.writeText(location.href); toast('Enlace de la vista copiado. En localhost sólo funciona en esta computadora.'); } catch { toast('Puedes copiar la dirección del navegador para conservar esta vista.'); } };
worker.addEventListener('message', ({ data: message }) => {
  if (message.type === 'ready') {
    previousFilterState = filterState(); filterHistory = []; $('undoFilters').disabled = true;
    applyRoute(); renderFilterChips();
    $('duplicateAudit').textContent = meta.quality ? 'Filas idénticas adicionales conservadas, por remisión: ' + JSON.stringify(meta.quality.exactDuplicateExtraRowsByRemission) + '. No se presume que sean errores.' : 'El archivo importado no incluye auditoría de duplicados del corte.';
    $('snapshotDetails').innerHTML = stat('Registros publicados en el corte', fmt(meta.records)) + stat('Fecha de recuperación / procesamiento', esc(new Date(meta.retrievedAt).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }))) + stat('Solicitudes observadas', esc((meta.requestMin || 'Sin dato') + ' a ' + (meta.requestMax || 'Sin dato'))) + `<p class="caption">Fuente: ${esc(meta.source)}<br>SHA-256 original: ${esc(meta.sourceSha256 || 'No disponible para archivo local')}</p>`;
  }
  if (message.type === 'result') {
    renderDashboardIndicators(); renderFilterChips(); document.body.classList.remove('is-calculating');
    if (dashboardRequestStart) dashboardDurations.push(performance.now() - dashboardRequestStart);
  }
  if (message.type === 'overview') {
    renderOverview(message.overview); $('contenido').dataset.overviewReady = 'true';
    for (const id of ['nationalStates', 'nationalSuppliers', 'nationalKeys']) { $(id).inert = false; $(id).setAttribute('aria-busy', 'false'); }
  }
  if (message.type === 'error') { $('status').classList.add('error'); document.body.classList.remove('is-calculating'); }
  if (message.type === 'overview-error') toast('Los indicadores base están disponibles; no fue posible completar los rankings.');
});
// El estado de cálculo se anuncia sin simular datos ni ocultar el último resultado.
const statusObserver = new MutationObserver(() => {
  if ($('status').textContent.startsWith('Calculando')) {
    dashboardRequestStart = performance.now(); document.body.classList.add('is-calculating'); $('kpis').setAttribute('aria-busy', 'true'); $('status').classList.remove('error');
    for (const id of ['nationalStates', 'nationalSuppliers', 'nationalKeys']) { $(id).inert = true; $(id).setAttribute('aria-busy', 'true'); }
  }
});
statusObserver.observe($('status'), { childList: true, characterData: true, subtree: true });
worker.addEventListener('error', () => {
  $('status').textContent = 'No se pudo iniciar el motor de datos. Comprueba los archivos de la publicación y recarga la página.';
  $('status').classList.add('error'); document.body.classList.remove('is-calculating');
});
