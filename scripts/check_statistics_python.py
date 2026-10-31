"""Comprobación independiente con Python estándar y observaciones expandidas."""
import collections, datetime as dt, gzip, json, math, pathlib, statistics
ROOT=pathlib.Path(__file__).resolve().parents[1]
db=json.loads(gzip.decompress((ROOT/'data/observatorio.json.gz').read_bytes()))
reference=json.loads((ROOT/'docs/phase2-reference.json').read_text(encoding='utf-8'))
assert db['meta']['sourceSha256']==reference['sourceSha256']
def date(value):
    try: return dt.date.fromisoformat(value) if len(value)==10 else None
    except (ValueError,TypeError): return None
days={i:[date(value) for value in db['dictionaries'][i]] for i in (6,7)}
intervals=[]; volumes=collections.Counter()
active=db['dictionaries'][11].index('ACTIVA')
for row in db['rows']:
    if row[11]!=active: continue
    q,e=row[9:11]
    if q is None or e is None or not math.isfinite(q) or not math.isfinite(e) or q<0 or e<0: continue
    if q>0 and db['dictionaries'][5][row[5]].strip(): volumes[row[5]]+=q
    s,d=days[6][row[6]],days[7][row[7]]
    if e>0 and s is not None and d is not None and d>=s: intervals.append((d-s).days)
intervals.sort(); n=len(intervals); median=statistics.median(intervals)
values={'n':n,'median':median,'p25':intervals[math.ceil(.25*n)-1],'p75':intervals[math.ceil(.75*n)-1],
    'p90':intervals[math.ceil(.9*n)-1],'p95':intervals[math.ceil(.95*n)-1],
    'mad':statistics.median(abs(x-median) for x in intervals),'mean':statistics.mean(intervals),'sd':statistics.stdev(intervals)}
values['iqr']=values['p75']-values['p25']; values['cv']=values['sd']/values['mean']
for field,value in values.items(): assert math.isclose(value,reference['overall']['times'][field],rel_tol=1e-10,abs_tol=1e-9),(field,value)
volumes=sorted(volumes.values()); total=math.fsum(volumes); k=len(volumes)
shares=[value/total for value in volumes]
hhi=math.fsum(s*s for s in shares)
concentration={'hhi10000':hhi*10000,'effectiveProviders':1/hhi,'gini':2*math.fsum((i+1)*v for i,v in enumerate(volumes))/(k*total)-(k+1)/k,
    'entropy':-math.fsum(s*math.log(s) for s in shares)}
for field,value in concentration.items(): assert math.isclose(value,reference['concentration'][field],rel_tol=1e-10,abs_tol=1e-9),(field,value)
out={'sourceSha256':reference['sourceSha256'],'times':values,'concentration':concentration,'status':'Coinciden con JavaScript; Python statistics y suma de observaciones, sin reutilizar el código del motor.'}
(ROOT/'docs/phase2-independent-python.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
print('OK: comprobación independiente Python; tiempos, MAD, DE, CV, HHI, Gini y entropía.')
