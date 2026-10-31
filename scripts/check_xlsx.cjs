const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
(async()=>{
 const messages=[];
 const context=vm.createContext({postMessage:m=>messages.push(m),Blob,setTimeout,clearTimeout,TextEncoder,TextDecoder});
 vm.runInContext(fs.readFileSync('vendor/exceljs.min.js','utf8'),context);
 vm.runInContext(fs.readFileSync('analytics.js','utf8'),context);
 vm.runInContext(`importCSV('clave,descripcion,piezas_solicitadas,piezas_entregadas\\nA,Prueba,100,40');analyze({asof:'2026-10-25',group:'clave',metric:'pending',filters:{},scope:'all'});`,context);
 await vm.runInContext('exportXLSX()',context);
 const m=messages.find(m=>m.type==='export');assert.ok(m.name.endsWith('.xlsx'));
 const bytes=Buffer.from(await m.blob.arrayBuffer());
 const ExcelJS=require('../vendor/exceljs.min.js');
 const wb=new ExcelJS.Workbook();await wb.xlsx.load(bytes);
 assert.equal(wb.getWorksheet('Registros').getCell('J2').value,100);
 assert.equal(wb.getWorksheet('Registros').getCell('K2').value,40);
 assert.equal(wb.getWorksheet('Metodología').getCell('B3').value,'2026-10-25');
 console.log('OK: XLSX válido, cantidades numéricas y hoja metodológica.');
})().catch(e=>{console.error(e);process.exitCode=1});
