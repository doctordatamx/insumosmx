const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),zlib=require('node:zlib');
const source=fs.readFileSync('analytics.js','utf8');
const messages=[];const context=vm.createContext({postMessage:m=>messages.push(m),console,Blob});
vm.runInContext(source,context);
// Casos de dominio: faltante no se compensa con sobreentrega; fecha ausente no es vencimiento.
vm.runInContext(`importCSV('clave,descripcion,institucion,entidad,estatus,proveedor,fecha_solicitud,fecha_entrega,fecha_limite,piezas_solicitadas,piezas_entregadas,canceladas_activas\\nA,Med A,I,E,PARCIAL,P,2026-01-01,2026-01-05,2026-01-04,100,40,ACTIVA\\nB,Med B,I,E,COMPLETA,P,2026-01-01,2026-01-03,2026-01-04,20,30,ACTIVA\\nC,Med C,I,E,PENDIENTE,P,2026-01-01,,,10,0,ACTIVA\\nD,Med D,I,E,PENDIENTE,P,2026-01-01,,,5,,ACTIVA'); analyze({asof:'2026-01-10',group:'nombre_proveedor',metric:'pending',filters:{},scope:'all'});`,context);
let r=messages.find(m=>m.type==='result').result;
assert.equal(r.total.requested,130);assert.equal(r.total.delivered,70);assert.equal(r.total.credited,60);assert.equal(r.total.pending,70);assert.equal(r.total.overdue,60);assert.equal(r.total.noDeadline,1);assert.equal(r.total.invalid,1);assert.equal(r.total.median,3);assert.equal(r.total.p90,4);assert.equal(r.total.timely,.5);
vm.runInContext(`analyze({asof:'2026-01-10',group:'clave',metric:'pending',filters:{},scope:'received',search:'Med B'});`,context);
assert.equal(messages.filter(m=>m.type==='result').at(-1).result.count,1);
assert.equal(vm.runInContext("day('2026-02-30')",context),null);
assert.equal(vm.runInContext("parseCSV('a,b\\n\"línea, uno\",\"texto\\ncon salto\"')[1][1]",context),'texto\ncon salto');
// Ejecutar el mismo Worker sobre todo el corte real sin navegador.
let payload=zlib.gunzipSync(fs.readFileSync('data/snapshots/f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2/observatorio.json.gz')).toString();
context.payload=payload;vm.runInContext('db=JSON.parse(payload); setup();',context);context.payload=null;
vm.runInContext(`analyze({asof:'2026-10-25',group:'nombre_proveedor',metric:'pending',filters:{canceladas_activas:String(db.dictionaries[11].indexOf('ACTIVA'))},scope:'all'});`,context);
r=messages.filter(m=>m.type==='result').at(-1).result;
assert.equal(r.count,1002426);assert.equal(r.total.requested,2566801175);assert.equal(r.total.delivered,2067851443);assert.equal(r.total.pending,499165452);
assert.ok(Math.abs(r.groups.reduce((s,g)=>s+g.requested,0)-r.total.requested)<.01);
assert.ok(Math.abs(r.groups.reduce((s,g)=>s+g.pending,0)-r.total.pending)<.01);
assert.ok(Math.abs(r.aging.reduce((a,b)=>a+b,0)-r.total.overdue)<.01);
console.log('OK: casos límite, filtros y conciliación del corte completo.',JSON.stringify(r.total));
