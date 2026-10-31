const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');

(async () => {
  assert.equal(crypto.createHash('sha256').update(fs.readFileSync('analytics.js')).digest('hex'),
    crypto.createHash('sha256').update(fs.readFileSync('legacy/fase-0/analytics.js')).digest('hex'), 'Motor base debe conservarse intacto en Fase 1');
  const messages = [];
  const context = vm.createContext({ Blob, performance, console, postMessage: value => messages.push(value) });
  context.self = context;
  context.importScripts = (...paths) => paths.forEach(path => vm.runInContext(fs.readFileSync(path, 'utf8'), context));
  vm.runInContext(fs.readFileSync('dashboard-worker.js', 'utf8'), context);
  context.fixture = 'clave,descripcion,institucion,entidad,proveedor,clues,piezas_solicitadas,piezas_entregadas\nA,Producto A,I,E,P,C1,100,40\nB,Producto B,I,E,P,,0,0\nC,Producto C,I,E,P,C1,5,\nD,Producto D,I,E,P,C2,-1,0';
  vm.runInContext("importCSV(fixture);analyze({asof:'2026-10-25',group:'clave',metric:'pending',filters:{},scope:'all'});", context);
  const fixture = vm.runInContext('buildOverview()', context);
  assert.equal(fixture.eligible, 1); assert.equal(fixture.count, 4);
  assert.equal(fixture.withClues, 3); assert.equal(fixture.clues, 2); assert.equal(fixture.missingClues, 1);
  assert.equal(fixture.ranks.states[0].requested, 100); assert.equal(fixture.ranks.suppliers[0].pending, 60);
  vm.runInContext("exportCSV('summary')", context);
  assert.ok(messages.filter(m => m.type === 'export').at(-1).name.startsWith('observatorio-insumos-'));
  assert.ok(vm.runInContext("csvCell('=1+1')", context).includes("'=1+1"));
  const start = performance.now();
  context.payload = zlib.gunzipSync(fs.readFileSync('data/snapshots/f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2/observatorio.json.gz')).toString('utf8');
  vm.runInContext('db=JSON.parse(payload);setup();', context); context.payload = null;
  await vm.runInContext("self.onmessage({data:{type:'analyze',config:{asof:'2026-10-25',group:'nombre_proveedor',metric:'pending',filters:{canceladas_activas:String(db.dictionaries[11].indexOf('ACTIVA'))},scope:'all'}}})", context);
  const result = messages.filter(m => m.type === 'result').at(-1).result;
  const overview = messages.filter(m => m.type === 'overview').at(-1).overview;
  assert.equal(result.total.requested, 2566801175); assert.equal(result.total.delivered, 2067851443);
  assert.equal(result.total.pending, 499165452); assert.equal(result.total.overdue, 409486132);
  assert.equal(overview.count, 1002426); assert.ok(overview.eligible > 0);
  assert.equal(overview.withClues + overview.missingClues, result.count);
  assert.ok(result.total.complete <= overview.eligible); assert.ok(result.total.zero <= overview.eligible);
  assert.ok(overview.ranks.states.length <= 5 && overview.ranks.suppliers.length <= 5);
  const report = { runtime: process.version, datasetBytes: fs.statSync('data/observatorio.json.gz').size,
    fullDecodeAnalysisAndOverviewMs: Math.round(performance.now() - start), overviewMs: Math.round(overview.computeMs),
    count: overview.count, institutions: overview.institutions, suppliers: overview.suppliers, keys: overview.keys,
    clues: overview.clues, withClues: overview.withClues, eligible: overview.eligible,
    note: 'Una ejecución local Node; no es un benchmark móvil ni una medición de carga de navegador o memoria del Worker.' };
  fs.mkdirSync('docs', { recursive: true }); fs.writeFileSync('docs/benchmark-fase1.json', JSON.stringify(report, null, 2));
  console.log('OK: motor intacto, regresión completa, denominadores, CLUES observadas y rankings.', JSON.stringify(report));
})().catch(error => { console.error(error); process.exitCode = 1; });
