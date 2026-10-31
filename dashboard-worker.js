/* Extensión aditiva de Fase 1. El motor de referencia permanece intacto. */
importScripts('analytics.js');
importScripts('statistics.js', 'statistics-worker.js');
importScripts('geo-worker.js');
importScripts('profiles-worker.js');
importScripts('lab-worker.js');
importScripts('supplier-products-worker.js');
const originalHandler = self.onmessage;
const sendDashboardMessage = self.postMessage.bind(self);
self.postMessage = (message, ...rest) => {
  if (message.type === 'ready') message.options.clues = db.dictionaries[12];
  if (message.type === 'export') message.name = message.name.replace(/^faarma-/, 'observatorio-insumos-');
  sendDashboardMessage(message, ...rest);
};

function buildOverview() {
  const started = performance.now();
  const dimensions = { suppliers: new Map(), states: new Map(), keys: new Map() };
  const indices = { suppliers: 5, states: 3, keys: 0 };
  const institutions = new Set(), clues = new Set(), allKeys = new Set(), allSuppliers = new Set();
  let eligible = 0, withClues = 0, missingClues = 0;
  for (const index of selected) {
    const row = db.rows[index];
    if (text(row, 2).trim()) institutions.add(row[2]);
    if (text(row, 0).trim()) allKeys.add(row[0]);
    if (text(row, 5).trim()) allSuppliers.add(row[5]);
    const clue = text(row, 12).trim();
    if (clue) { clues.add(clue); withClues++; } else missingClues++;
    const valid = Number.isFinite(row[9]) && Number.isFinite(row[10]) && row[9] >= 0 && row[10] >= 0;
    if (!valid) continue;
    if (row[9] > 0) eligible++;
    for (const [dimension, groups] of Object.entries(dimensions)) {
      const key = row[indices[dimension]];
      if (!groups.has(key)) groups.set(key, {
        key, name: text(row, indices[dimension]) || 'Sin dato',
        description: dimension === 'keys' ? text(row, 1) : '',
        requested: 0, delivered: 0, credited: 0, pending: 0, count: 0,
      });
      const group = groups.get(key);
      group.count++; group.requested += row[9]; group.delivered += row[10];
      group.credited += Math.min(row[9], row[10]);
      group.pending += Math.max(0, row[9] - row[10]);
    }
  }
  return {
    eligible, institutions: institutions.size, suppliers: allSuppliers.size, keys: allKeys.size,
    clues: clues.size, withClues, missingClues, count: selected.length,
    ranks: Object.fromEntries(Object.entries(dimensions).map(([key, groups]) => [key,
      [...groups.values()].sort((a, b) => b.pending - a.pending).slice(0, 5)])),
    computeMs: performance.now() - started,
  };
}

self.onmessage = async event => {
  if(event.data.type==='supplier-products'){self.postMessage({type:'supplier-products-result',requestId:event.data.requestId,rows:supplierProducts()});return;}
  if(['analyze','load','import'].includes(event.data.type))laboratoryLast=null;
  if(event.data.type==='laboratory'){try{laboratoryLast=calculateLaboratory(event.data.settings);self.postMessage({type:'laboratory-result',requestId:event.data.requestId,report:laboratoryLast});}catch(error){self.postMessage({type:'laboratory-error',requestId:event.data.requestId,message:error.message});}return;}
  if(event.data.type==='laboratory-flags-export'){try{exportLaboratoryRows();}catch(error){self.postMessage({type:'error',message:error.message});}return;}
  if(event.data.type === 'profile-rows-export'){try{exportProfileRows(event.data.profileType,event.data.key);}catch(error){self.postMessage({type:'error',message:error.message});}return;}
  if(event.data.type === 'profile-rows'){try{self.postMessage({type:'profile-rows-result',requestId:event.data.requestId,key:Number(event.data.key),fields:db.meta.fields,rows:profileRows(event.data.profileType,event.data.key).slice(0,50).map(i=>db.rows[i].map((_,j)=>text(db.rows[i],j)))});}catch(error){self.postMessage({type:'profiles-error',requestId:event.data.requestId,message:error.message});}return;}
  if(event.data.type === 'profiles'){
    try{self.postMessage({type:'profiles-result',requestId:event.data.requestId,report:calculateProfiles(event.data.profileType,event.data.keys)});}
    catch(error){self.postMessage({type:'profiles-error',requestId:event.data.requestId,message:error.message});}
    return;
  }
  if (['load', 'import'].includes(event.data.type)) geoFullRows = null;
  if (event.data.type === 'analyze' && event.data.config.geoMunicipality) {
    try { await loadGeography(); } catch (error) { self.postMessage({ type: 'error', message: error.message }); return; }
  }
  if (event.data.type === 'geo-subscribe') {
    geoSubscribed = Boolean(event.data.enabled);
    if (geoSubscribed) { try { await publishGeography(); } catch (error) { self.postMessage({ type: 'geo-error', message: error.message }); } }
    return;
  }
  if (event.data.type === 'geo-export') {
    try { exportGeography(event.data.kind); } catch (error) { self.postMessage({ type: 'geo-error', message: error.message }); }
    return;
  }
  if (['analyze', 'load', 'import'].includes(event.data.type)) geoCache = null;
  if (event.data.type === 'scientific-subscribe') {
    scientificSubscribed = Boolean(event.data.enabled);
    if (scientificSubscribed) { try { publishScientificReport(); } catch (error) { self.postMessage({ type: 'scientific-error', message: error.message }); } }
    if (geoSubscribed) { try { await publishGeography(); } catch (error) { self.postMessage({ type: 'geo-error', message: error.message }); } }
    return;
  }
  if (event.data.type === 'scientific-export') {
    try { exportScientific(event.data.kind, event.data.presentation); } catch (error) { self.postMessage({ type: 'scientific-error', message: error.message }); }
    return;
  }
  if (['analyze', 'load', 'import'].includes(event.data.type)) scientificCache = null;
  await originalHandler(event);
  if (event.data.type === 'analyze' && result) {
    try { self.postMessage({ type: 'overview', overview: buildOverview() }); }
    catch (error) { self.postMessage({ type: 'overview-error', message: error.message }); }
    if (geoSubscribed) { try { await publishGeography(); } catch (error) { self.postMessage({ type: 'geo-error', message: error.message }); } }
    if (scientificSubscribed) { try { publishScientificReport(); } catch (error) { self.postMessage({ type: 'scientific-error', message: error.message }); } }
  }
};
