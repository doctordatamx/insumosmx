/* Cruce geográfico aditivo: nunca modifica ni imputa el hecho de suministro. */
let geoBundle=null,geoLoading=null,geoSubscribed=false,geoCache=null;
let geoFullRows=null;
const geoReferenceAnalyze=analyze;
const geoReferenceSetup=setup;
setup=function(){geoFullRows=null;geoReferenceSetup();};
analyze=function(filters){
 if(!geoFullRows)geoFullRows=db.rows;
 db.rows=geoFullRows;
 if(filters.geoMunicipality){
  if(!geoBundle||db.meta.sourceSha256!==geoBundle.meta.supplySha256)throw Error('Filtro municipal no disponible para este archivo de datos.');
  if(!geoBundle.municipalities.features.some(f=>f.properties.cvegeo===filters.geoMunicipality))throw Error('Municipio sin límite oficial distribuido.');
  const aliases=geoBundle.stateAliases,canon=v=>aliases[geoNormalize(v)]||geoNormalize(v);
  const stateCodes=new Map(geoBundle.states.features.map(f=>[canon(f.properties.nomgeo),f.properties.cve_ent]));
  db.rows=geoFullRows.filter(row=>{const record=geoBundle.catalog[text(row,12)];return record&&record.state+record.municipality===filters.geoMunicipality&&stateCodes.get(canon(text(row,3)))===record.state;});
 }
 geoReferenceAnalyze(filters);
};
function geoNormalize(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();}
function geoEmpty(){return {rows:0,invalid:0,requested:0,delivered:0,credited:0,pending:0};}
function geoAdd(a,row){a.rows++;const q=row[9],e=row[10];if(!Number.isFinite(q)||!Number.isFinite(e)||q<0||e<0){a.invalid++;return;}a.requested+=q;a.delivered+=e;a.credited+=Math.min(q,e);a.pending+=Math.max(0,q-e);}
async function loadGeography(){
 if(!geoBundle){if(!geoLoading)geoLoading=fetch('data/geography/bundle.json').then(response=>{if(!response.ok)throw Error('No se encontró el catálogo geográfico publicado.');return response.json();}).then(data=>{if(data.states?.features?.length!==32)throw Error('Límites estatales incompletos.');geoBundle=data;return data;}).catch(error=>{geoLoading=null;throw error;});await geoLoading;}
 return geoBundle;
}
function calculateGeography(){
 const catalogCompatible=Boolean(db.meta.sourceSha256&&db.meta.sourceSha256===geoBundle.meta.supplySha256);
 const aliases=geoBundle.stateAliases,canon=value=>aliases[geoNormalize(value)]||geoNormalize(value);
 const codeByName=new Map(geoBundle.states.features.map(feature=>[canon(feature.properties.nomgeo),feature.properties.cve_ent]));
 const states=new Map(),municipalities=new Map(),units=new Map(),statuses={},byInstitution={};let unknownState=0;
 const ambiguity=new Set(geoBundle.ambiguous);
 for(const index of selected){
  const row=db.rows[index],state=codeByName.get(canon(text(row,3))),clue=text(row,12);let status;
  if(state){if(!states.has(state))states.set(state,{...geoEmpty(),code:state});geoAdd(states.get(state),row);}else unknownState++;
  const record=catalogCompatible?geoBundle.catalog[clue]:null;
  if(!catalogCompatible)status='catalog_not_compatible';else if(!clue)status='missing_clues';else if(ambiguity.has(clue))status='ambiguous_catalog';else if(!record)status='not_in_distributed_catalog';else if(state!==record.state)status='state_conflict';else status=record.coordinateStatus;
  statuses[status]=(statuses[status]||0)+1;
  const sourceInstitution=text(row,2)||'Sin dato';if(!byInstitution[sourceInstitution])byInstitution[sourceInstitution]={};byInstitution[sourceInstitution][status]=(byInstitution[sourceInstitution][status]||0)+1;
  if(!record||!state||state!==record.state||ambiguity.has(clue))continue;
  if(!units.has(clue))units.set(clue,{...geoEmpty(),...record,reportedInstitutions:new Set(),reportedNames:new Set()});const unit=units.get(clue);geoAdd(unit,row);unit.reportedInstitutions.add(sourceInstitution);unit.reportedNames.add(text(row,13));
  const municipality=record.state+record.municipality;
  if(!municipalities.has(municipality))municipalities.set(municipality,{...geoEmpty(),code:municipality,name:record.municipalityName,state:record.state});geoAdd(municipalities.get(municipality),row);
 }
 const totals=[...states.values()].reduce((a,s)=>{for(const key of ['rows','invalid','requested','delivered','credited','pending'])a[key]+=s[key];return a;},geoEmpty());
 return {meta:geoBundle.meta,catalogCompatible,count:selected.length,statuses,byInstitution,unknownState,totals,states:[...states.values()],municipalities:[...municipalities.values()],units:[...units.values()].map(unit=>({...unit,reportedInstitutions:[...unit.reportedInstitutions],reportedNames:[...unit.reportedNames]})).sort((a,b)=>b.pending-a.pending),
  shapes:{states:geoBundle.states,municipalities:geoBundle.municipalities}};
}
async function publishGeography(){await loadGeography();if(!result)return;if(!geoCache)geoCache=calculateGeography();self.postMessage({type:'geo-result',report:geoCache});}
function exportGeography(kind){
 if(!geoCache)throw Error('Espera al cálculo del atlas.');
 if(kind==='json'){self.postMessage({type:'export',name:`observatorio-atlas-${config.asof}.json`,blob:new Blob([JSON.stringify({context:{...config,sourceSha256:db.meta.sourceSha256},...geoCache})],{type:'application/json;charset=utf-8'})});return;}
 const headers=['clues','name','institution','adminInstitution','state','municipality','municipalityName','status','coordinateStatus','latitude','longitude','rows','requested','delivered','pending'];
 const lines=[headers.map(csvCell).join(','),...geoCache.units.map(record=>headers.map(key=>csvCell(record[key])).join(','))];
 self.postMessage({type:'export',name:`observatorio-clues-${config.asof}.csv`,blob:new Blob(['\ufeff',lines.join('\r\n')],{type:'text/csv;charset=utf-8'})});
}
