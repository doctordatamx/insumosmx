const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),zlib=require('node:zlib');
const {spawnSync}=require('node:child_process');
const sample='docs/phase2-browser-report.json.gz';
if(!fs.existsSync(sample)){console.error('Falta el reporte capturado en navegador para la prueba de reproducción.');process.exit(1);}
const baseline=JSON.parse(zlib.gunzipSync(fs.readFileSync(sample)));
const directory=fs.mkdtempSync(path.join(os.tmpdir(),'observatorio-replay-'));
const file=path.join(directory,'report.json');
function run(report){fs.writeFileSync(file,JSON.stringify(report));const r=spawnSync(process.execPath,['scripts/reproduce_report.cjs',file],{encoding:'utf8',timeout:30000});if(r.error)throw r.error;return r;}
try{
 assert.equal(run(baseline).status,0,'Reporte real del navegador debe reproducirse dentro de tolerancia explícita');
 let tampered=structuredClone(baseline);tampered.overall.requested+=1;assert.notEqual(run(tampered).status,0,'Debe detectar una pieza de diferencia');
 tampered=structuredClone(baseline);tampered.concentration.entropy+=1e-5;assert.notEqual(run(tampered).status,0,'Debe detectar una alteración en derivados');
 tampered=structuredClone(baseline);tampered.context.sourceSha256='incorrecto';assert.notEqual(run(tampered).status,0,'Debe rechazar otra fuente');
 console.log('OK: reporte real aceptado; alteraciones de cantidad, derivado y hash rechazadas.');
}finally{if(fs.existsSync(file))fs.unlinkSync(file);fs.rmdirSync(directory);}
