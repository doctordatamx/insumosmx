/* Reproduce un JSON exportado contra exactamente el mismo archivo fuente. */
const fs=require('node:fs'),vm=require('node:vm'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const {performance}=require('node:perf_hooks');
// Math.log puede diferir en los últimos bits entre motores de JS.
// Conteos, cantidades y estadísticos de orden se exigen exactos.
const exactKeys=new Set(['count','validQuantity','positiveRequest','complete','zero','requested','delivered','credited','pending','overdue','deliveredRows','invalidResponseDates','negativeIntervals','n','records','providers','volume','unknownSupplierVolume','pairExcludedVolume','cumulative','days','key','min','max','median','p25','p75','p90','p95','iqr','mad','responseN','onTime','timed']);
function equivalent(actual,expected,path=''){
  if(typeof expected==='number'&&typeof actual==='number'){
    if(exactKeys.has(path.split('.').at(-1)))assert.equal(actual,expected,path);
    else assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<=1e-12+1e-12*Math.abs(expected),'Diferencia numérica en '+path);
    return;
  }
  if(expected&&typeof expected==='object'){
    assert.ok(actual&&typeof actual==='object',path);
    assert.deepEqual(Object.keys(actual).sort(),Object.keys(expected).sort(),path);
    for(const key of Object.keys(expected))equivalent(actual[key],expected[key],path+'.'+key);
    return;
  }
  assert.equal(actual,expected,path);
}
const input=process.argv[2],data=process.argv[3]||'data/observatorio.json.gz';
if(!input){console.error('Uso: node scripts/reproduce_report.cjs reporte.json[.gz] [datos.json.gz]');process.exit(1);}
try {
  const bytes=fs.readFileSync(input),expected=JSON.parse((input.endsWith('.gz')?zlib.gunzipSync(bytes):bytes).toString('utf8'));
  if(expected.version!=='2.0.0'||!expected.context?.sourceSha256)throw Error('Reporte sin versión compatible o sin hash de la fuente. No se puede afirmar reproducción exacta.');
  const db=JSON.parse(zlib.gunzipSync(fs.readFileSync(data)).toString('utf8'));
  assert.equal(db.meta.sourceSha256,expected.context.sourceSha256,'El archivo de datos no corresponde al hash de la fuente del reporte');
  const fields=db.meta.fields,group=expected.context.grouping;
  if(!fields.includes(group)||['piezas','piezas_solicitadas'].includes(group))throw Error('Agrupación no válida');
  for(const [field,code] of Object.entries(expected.context.filterCodes||{})){
    if(code==='')continue;
    const i=fields.indexOf(field);if(i<0||!Number.isInteger(Number(code))||!db.dictionaries[i]?.[Number(code)]&&db.dictionaries[i]?.[Number(code)]!=='')throw Error('Código de filtro no válido: '+field);
  }
  const context=vm.createContext({Blob,performance,console,postMessage:()=>{}});context.self=context;
  context.importScripts=(...paths)=>paths.forEach(path=>vm.runInContext(fs.readFileSync(path,'utf8'),context));
  vm.runInContext(fs.readFileSync('dashboard-worker.js','utf8'),context);
  context.payload=JSON.stringify(db);
  if(expected.context.geoMunicipality){
    context.geoPayload=fs.readFileSync('data/geography/bundle.json','utf8');
    const geo=JSON.parse(context.geoPayload);assert.equal(geo.meta.catalog.sha256,expected.context.geoCatalogSha256,'Catálogo CLUES distinto');
    vm.runInContext('geoBundle=JSON.parse(geoPayload);',context);
  }
  context.replayConfig={filters:expected.context.filterCodes||{},group,metric:'pending',asof:expected.context.evaluationDate,
    search:expected.context.search||'',from:expected.context.from||'',to:expected.context.to||'',scope:expected.context.scope||'all',geoMunicipality:expected.context.geoMunicipality||''};
  vm.runInContext('db=JSON.parse(payload);setup();analyze(replayConfig);',context);context.payload=null;
  const actual=JSON.parse(vm.runInContext('JSON.stringify(calculateScientificReport())',context));
  for(const field of ['base','overall','groups','concentration','distribution','bins'])equivalent(actual[field],expected[field],field);
  console.log('OK: reporte reproducido; conteos, cantidades y orden exactos; demás derivados atol=1e-12, rtol=1e-12. Fuente:',expected.context.sourceSha256,'; filas:',actual.overall.count);
}catch(error){console.error('No se reprodujo el reporte:',error.message);process.exitCode=1;}
