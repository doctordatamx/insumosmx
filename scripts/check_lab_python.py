"""Contraste independiente Python de concentración y señales robustas del corte activo."""
import collections,datetime as dt,gzip,json,math,pathlib,statistics
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads(gzip.decompress((ROOT/'data/observatorio.json.gz').read_bytes()));report=json.loads(gzip.decompress((ROOT/'docs/phase6-report.json.gz').read_bytes()));assert report['source']['sourceSha256']==data['meta']['sourceSha256']
d=data['dictionaries'];dates={}
for column in (6,7):
 values=[]
 for value in d[column]:
  try:values.append(dt.date.fromisoformat(value).toordinal())
  except ValueError:values.append(None)
 dates[column]=values
times=collections.defaultdict(list);volumes=collections.defaultdict(lambda:collections.defaultdict(float));totals=collections.defaultdict(float)
for row in data['rows']:
 if d[11][row[11]]!='ACTIVA':continue
 q,e=row[9],row[10]
 if q is None or e is None or q<=0 or e<0 or not math.isfinite(q) or not math.isfinite(e) or not d[0][row[0]].strip() or not d[2][row[2]].strip():continue
 key=str(row[0])+':'+str(row[2]);totals[key]+=q;supplier=d[5][row[5]].strip()
 if supplier:volumes[key][supplier]+=q
 s,t=dates[6][row[6]],dates[7][row[7]]
 if e>0 and s is not None and t is not None and t>=s:times[key].append(t-s)
eligible=signals=0
for values in times.values():
 median=statistics.median(values);mad=statistics.median(abs(v-median) for v in values)
 if len(values)>=report['settings']['minN'] and mad>0:
  eligible+=len(values);signals+=sum(abs(report['settings']['robustConstant']*(v-median)/mad)>report['settings']['threshold'] for v in values)
assert eligible==report['anomalies']['robustEligible'];assert signals==report['anomalies']['counts']['robust_response']
assert len(totals)==len(report['groups'])
for group in report['groups']:
 key=group['key'];known=sum(volumes[key].values());assert totals[key]==group['metrics']['requested'];assert known==group['concentration']['volume']
 if known:
  hhi=sum((v/known)**2 for v in volumes[key].values());assert math.isclose(hhi*10000,group['concentration']['hhi10000'],rel_tol=1e-12,abs_tol=1e-12)
print('OK: Python independiente; MAD, mediana, n evaluable, señales robustas, volúmenes y HHI de todos los pares.',{'eligible':eligible,'signals':signals})
