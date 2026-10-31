"""Conciliación independiente del corte transformado con la exportación oficial."""
import gzip,json,pathlib,math
root=pathlib.Path(__file__).resolve().parents[1]
report=json.loads((root/'docs/ULTIMA_VERIFICACION_FUENTE.json').read_text(encoding='utf-8'))
data=json.loads(gzip.decompress((root/'data/observatorio.json.gz').read_bytes()))
assert data['meta']['sourceSha256']==report['downloadSha256']
assert len(data['rows'])==report['semanticComparison']['afterTotals']['records']
for scope in ['all','active']:
 totals={'requested':0,'delivered':0,'pending':0};count=0
 for row in data['rows']:
  if scope=='active' and data['dictionaries'][11][row[11]]!='ACTIVA':continue
  q,e=row[9:11];assert q is not None and e is not None and math.isfinite(q) and math.isfinite(e) and q>=0 and e>=0
  count+=1;totals['requested']+=q;totals['delivered']+=e;totals['pending']+=max(0,q-e)
 expected=report['semanticComparison']['afterTotals'][scope]
 for key,value in totals.items():assert value==expected[key],(scope,key,value,expected[key])
 print(scope,count,totals)
assert json.loads((root/'data/geography/bundle.json').read_text(encoding='utf-8'))['meta']['supplySha256']==data['meta']['sourceSha256']
print('OK: corte actual conciliado con CSV oficial y geografía correspondiente')
