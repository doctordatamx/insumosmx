function supplierProducts(){
 const groups=new Map();
 for(const index of selected){const row=db.rows[index],key=JSON.stringify([row[5],row[0],row[1]]);if(!groups.has(key))groups.set(key,{supplier:text(row,5)||'Sin proveedor',clave:text(row,0)||'Sin clave',description:text(row,1)||'Sin descripción',rows:0,invalid:0,requested:0,delivered:0,credited:0,pending:0});const g=groups.get(key);g.rows++;const q=row[9],e=row[10];if(!Number.isFinite(q)||!Number.isFinite(e)||q<0||e<0){g.invalid++;continue;}g.requested+=q;g.delivered+=e;g.credited+=Math.min(q,e);g.pending+=Math.max(0,q-e);}
 return [...groups.values()].map(g=>({...g,coverage:g.requested?g.credited/g.requested:null,status:g.invalid?'invalid':!g.requested?'no_request':!g.pending?'complete':!g.delivered?'none':'partial'})).sort((a,b)=>b.pending-a.pending||a.supplier.localeCompare(b.supplier)||a.clave.localeCompare(b.clave)||a.description.localeCompare(b.description));
}
