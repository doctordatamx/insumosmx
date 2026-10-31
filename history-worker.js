/* Comparación de agregados. No empareja solicitudes ni inventa identidades de fila. */
importScripts('analytics.js','geo-worker.js');
function historyAnalyze(payload,settings,geography=null){
 if(JSON.stringify(payload.meta.fields)!==JSON.stringify(Object.keys(IDX)))throw Error('Esquema incompatible entre cortes');
 db=payload;geoBundle=geography;setup();
 const filters={},missing=[];
 for(const [dimension,label] of Object.entries(settings.labels||{})){if(!(dimension in IDX))throw Error('Dimensión desconocida');const code=db.dictionaries[IDX[dimension]].indexOf(label);if(code<0)missing.push(dimension+': '+label);filters[dimension]=String(code);}
 analyze({...settings,filters});
 const summary={source:{...db.meta},count:selected.length,total:result.total,groups:result.groups,missingLabels:missing};db=null;geoFullRows=null;geoBundle=null;selected=[];result=null;return summary;
}
const HISTORY_QUANTITIES=['count','requested','delivered','credited','pending','overdue','responseN'];
function historyCompare(a,b,settings){
 const old=new Map(a.groups.map(g=>[g.name,g])),fresh=new Map(b.groups.map(g=>[g.name,g]));
 const delta=(before,after)=>Object.fromEntries(HISTORY_QUANTITIES.map(key=>[key,(after?.[key]||0)-(before?.[key]||0)]));
 const groups=[...new Set([...old.keys(),...fresh.keys()])].map(name=>{const before=old.get(name)||null,after=fresh.get(name)||null;return {name,before,after,delta:delta(before,after),coverageChangePoints:before?.coverage!=null&&after?.coverage!=null?(after.coverage-before.coverage)*100:null,pendingInBoth:!!(before?.pending>0&&after?.pending>0),presence:before&&after?'both':before?'only_before':'only_after'};}).sort((x,y)=>Math.abs(y.delta.pending)-Math.abs(x.delta.pending)||x.name.localeCompare(y.name));
 return {version:'5.0.0',settings,before:a,after:b,delta:delta(a.total,b.total),groups,notes:['Cambios netos entre agregados de dos recuperaciones, no entregas nuevas ni solicitudes resueltas identificadas.','La presencia de brecha en ambos cortes no identifica las mismas solicitudes ni demuestra continuidad entre fechas.','Se usa el mismo corte de vencimientos y los mismos filtros de texto en ambos conjuntos.','Cambios de cobertura, cancelaciones, correcciones y composición pueden explicar diferencias. No se certifica recepción física ni desabasto clínico.']};
}
async function historyLoad(entry,settings){
 if(!/^[a-f0-9]{64}$/.test(entry.id))throw Error('Identificador histórico inválido');
 const base='data/snapshots/'+entry.id+'/';
 const response=await fetch(base+'observatorio.json.gz');if(!response.ok)throw Error('No se pudo cargar el corte histórico');
 const buffer=await response.arrayBuffer(),hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',buffer)),n=>n.toString(16).padStart(2,'0')).join('');
 if(hash!==entry.payloadSha256)throw Error('El hash del archivo histórico no coincide');
 const payload=JSON.parse(await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 if(payload.meta.sourceSha256!==entry.sourceSha256||payload.meta.records!==entry.records)throw Error('Metadatos históricos inconsistentes');
 let geography=null;if(settings.geoMunicipality){if(!entry.geographySha256)throw Error('Este corte no tiene cruce municipal archivado');const response=await fetch(base+'geography.json');if(!response.ok)throw Error('Geografía histórica ausente');const bytes=await response.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),n=>n.toString(16).padStart(2,'0')).join('');if(hash!==entry.geographySha256)throw Error('Geografía histórica modificada');geography=JSON.parse(new TextDecoder().decode(bytes));}
 return historyAnalyze(payload,settings,geography);
}
self.onmessage=async({data:m})=>{if(m.type!=='history-compare')return;try{if(m.before.id===m.after.id)throw Error('Selecciona dos cortes distintos');if(!Number.isFinite(Date.parse(m.before.retrievedAt))||!Number.isFinite(Date.parse(m.after.retrievedAt))||Date.parse(m.before.retrievedAt)>=Date.parse(m.after.retrievedAt))throw Error('El corte posterior debe tener fecha de recuperación posterior');const a=await historyLoad(m.before,m.settings),b=await historyLoad(m.after,m.settings);postMessage({type:'history-result',requestId:m.requestId,report:{...historyCompare(a,b,m.settings),archives:{before:m.before,after:m.after}}});}catch(error){postMessage({type:'history-error',requestId:m.requestId,message:error.message});}};
