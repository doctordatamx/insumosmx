"""Fuentes oficiales locales → geometría simplificada y cruce auditable por CLUES exacta."""
import argparse, collections, datetime as dt, gzip, hashlib, json, math, pathlib, urllib.request
import openpyxl
ROOT=pathlib.Path(__file__).resolve().parents[1]; RAW=ROOT/'data/raw-geo'; OUT=ROOT/'data/geography'
CLUES_URL='https://gobi.salud.gob.mx/historico_clues/ESTABLECIMIENTO_SALUD_202608.xlsx?v=1.1'
STATES_URL='https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgee/'
def norm(value):
 import unicodedata
 return ''.join(c for c in unicodedata.normalize('NFD',str(value or '').upper().strip()) if unicodedata.category(c)!='Mn')
ALIASES={'COAHUILA':'COAHUILA DE ZARAGOZA','MICHOACAN':'MICHOACAN DE OCAMPO','VERACRUZ':'VERACRUZ DE IGNACIO DE LA LLAVE'}
def state_name(value): return ALIASES.get(norm(value),norm(value))
def point_ring(x,y,ring):
 inside=False
 for i in range(len(ring)-1):
  ax,ay=ring[i][:2]; bx,by=ring[i+1][:2]
  if (ay>y)!=(by>y) and x<(bx-ax)*(y-ay)/(by-ay)+ax: inside=not inside
 return inside
def point_geometry(x,y,geometry):
 polygons=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
 return any(point_ring(x,y,polygon[0]) and not any(point_ring(x,y,hole) for hole in polygon[1:]) for polygon in polygons)
def rdp(points,tolerance):
 # Iterativo; conserva extremos. Geometría original se usa para validación, no esta copia.
 if len(points)<5:return [[round(x,5),round(y,5)] for x,y,*_ in points]
 keep={0,len(points)-1}; stack=[(0,len(points)-1)]
 while stack:
  first,last=stack.pop(); ax,ay=points[first][:2]; bx,by=points[last][:2]; dx=bx-ax; dy=by-ay; denominator=dx*dx+dy*dy
  maximum=0; index=None
  for i in range(first+1,last):
   x,y=points[i][:2]; t=max(0,min(1,((x-ax)*dx+(y-ay)*dy)/denominator)) if denominator else 0
   distance=(x-ax-t*dx)**2+(y-ay-t*dy)**2
   if distance>maximum:maximum=distance;index=i
  if index is not None and maximum>tolerance*tolerance:keep.add(index);stack.extend([(first,index),(index,last)])
 simplified=[[round(points[i][0],5),round(points[i][1],5)] for i in sorted(keep)]
 return simplified if len(simplified)>=4 else [[round(p[0],5),round(p[1],5)] for p in points]
def simplify_geometry(geometry,tolerance):
 polygons=geometry['coordinates'] if geometry['type']=='MultiPolygon' else [geometry['coordinates']]
 simplified=[[rdp(ring,tolerance) for ring in polygon] for polygon in polygons]
 return {'type':'MultiPolygon','coordinates':simplified}
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main(download_municipal=False):
 OUT.mkdir(parents=True,exist_ok=True)
 supply=json.loads(gzip.decompress((ROOT/'data/observatorio.json.gz').read_bytes()))
 wanted=set(supply['dictionaries'][12]); states=json.loads((RAW/'states.geojson').read_text(encoding='utf-8'))
 assert len(states['features'])==32
 features={f['properties']['cve_ent']:f for f in states['features']}
 names={state_name(f['properties']['nomgeo']):code for code,f in features.items()}
 workbook=openpyxl.load_workbook(RAW/'clues-202608.xlsx',read_only=True,data_only=True)
 sheet=workbook['CLUES_202608']; rows=sheet.iter_rows(values_only=True); headers=next(rows); index={name:i for i,name in enumerate(headers)}
 catalog=collections.defaultdict(list); national=0
 fields={'name':'NOMBRE DE LA UNIDAD','institution':'NOMBRE DE LA INSTITUCION','adminInstitution':'NOMBRE DE LA INS ADM','state':'CLAVE DE LA ENTIDAD','municipality':'CLAVE DEL MUNICIPIO','municipalityName':'MUNICIPIO','locality':'LOCALIDAD','status':'ESTATUS DE OPERACION','latitude':'LATITUD','longitude':'LONGITUD'}
 for row in rows:
  code=str(row[index['CLUES']] or '').strip(); national+=1
  if code not in wanted:continue
  record={key:row[index[field]] for key,field in fields.items()}
  record['state']=str(record['state'] or '').zfill(2);record['municipality']=str(record['municipality'] or '').zfill(3)
  record['clues']=code
  try:record['latitude']=float(record['latitude']);record['longitude']=float(record['longitude'])
  except (TypeError,ValueError):record['latitude']=None;record['longitude']=None
  record['coordinateStatus']='missing_or_invalid'
  lat,lon=record['latitude'],record['longitude']
  if lat is not None and lon is not None and math.isfinite(lat) and math.isfinite(lon) and 14<=lat<=33 and -119<=lon<=-86:
   record['coordinateStatus']='inside_declared_state' if record['state'] in features and point_geometry(lon,lat,features[record['state']]['geometry']) else 'outside_declared_state'
  catalog[code].append(record)
 workbook.close()
 matches={code:records[0] for code,records in catalog.items() if len(records)==1}
 municipality_codes={r['state']+r['municipality'] for r in matches.values() if r['state'] in features}
 if download_municipal:
  from concurrent.futures import ThreadPoolExecutor
  def fetch(code):
   target=RAW/f'municipal-{code}.geojson'
   if not target.exists():
    url=f'https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgem/{code}'
    with urllib.request.urlopen(url,timeout=180) as response:target.write_bytes(response.read())
   print('Municipios:',code,flush=True)
  with ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(fetch,sorted({code[:2] for code in municipality_codes})))
 municipalities=[]; municipal_sources=[]; raw_municipalities={}
 for path in sorted(RAW.glob('municipal-*.geojson')):
  data=json.loads(path.read_text(encoding='utf-8'));municipal_sources.append({'url':f'https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgem/{path.stem.split("-")[-1]}','sha256':digest(path)})
  for feature in data.get('features',[]):
   props=feature['properties']
   if props['cvegeo'] in municipality_codes:
    raw_municipalities[props['cvegeo']]=feature
    municipalities.append({'type':'Feature','properties':{key:props[key] for key in ['cvegeo','cve_ent','cve_mun','nomgeo']},'geometry':simplify_geometry(feature['geometry'],.002)})
 for record in matches.values():
  boundary=raw_municipalities.get(record['state']+record['municipality'])
  record['municipalityCoordinateStatus']='not_tested'
  if boundary and record['coordinateStatus']=='inside_declared_state':
   valid=point_geometry(record['longitude'],record['latitude'],boundary['geometry'])
   record['municipalityCoordinateStatus']='inside_declared_municipality' if valid else 'outside_declared_municipality'
   if not valid:record['coordinateStatus']='outside_declared_municipality'
 records_by_status=collections.Counter(); active_by_status=collections.Counter(); audit=collections.defaultdict(lambda:collections.Counter())
 for row in supply['rows']:
  clue=supply['dictionaries'][12][row[12]]; entity=supply['dictionaries'][3][row[3]]; inst=supply['dictionaries'][2][row[2]]
  if not clue:status='missing_clues'
  elif len(catalog.get(clue,[]))>1:status='ambiguous_catalog'
  elif clue not in matches:status='not_in_distributed_catalog'
  elif names.get(state_name(entity))!=matches[clue]['state']:status='state_conflict'
  else:status=matches[clue]['coordinateStatus']
  records_by_status[status]+=1;audit[clue][status]+=1
  if supply['dictionaries'][11][row[11]]=='ACTIVA':active_by_status[status]+=1
 metadata={'version':'3.0.0','retrievedAt':dt.datetime.now(dt.timezone.utc).isoformat(),'supplySha256':supply['meta']['sourceSha256'],
  'catalog':{'url':CLUES_URL,'indexUrl':'https://gobi.salud.gob.mx/Bases_Clues.html','period':'2026-08','sha256':digest(RAW/'clues-202608.xlsx'),'nationalRows':national,'distributedSubset':True,'matchedUniqueClues':len(matches),'ambiguousClues':sum(len(r)>1 for r in catalog.values())},
  'states':{'url':STATES_URL,'sha256':digest(RAW/'states.geojson'),'metadata':states.get('metadatos'),'simplificationDegrees':.006},'municipalSources':municipal_sources,
  'municipalitiesDistributed':len(municipalities),'allRecordStatuses':dict(records_by_status),'activeRecordStatuses':dict(active_by_status),
  'rules':'CLUES exacta y única, entidad consistente. Coordenadas numéricas contrastadas con polígonos estatal y municipal originales cuando están disponibles. Institución/nombre se muestran, no se homologan automáticamente. Catálogo agosto no prueba situación en octubre.'}
 metadata['preparedAt']=metadata['retrievedAt']
 output={'meta':metadata,'stateAliases':ALIASES,'catalog':matches,'ambiguous':sorted(code for code,rs in catalog.items() if len(rs)>1),
  'states':{'type':'FeatureCollection','features':[{'type':'Feature','properties':{k:f['properties'][k] for k in ['cvegeo','cve_ent','nomgeo']},'geometry':simplify_geometry(f['geometry'],.006)} for f in features.values()]},
  'municipalities':{'type':'FeatureCollection','features':municipalities}}
 for name,data in [('bundle.json',output),('metadata.json',metadata),('clues-audit.json',{code:dict(counts) for code,counts in audit.items()})]:
  temp=OUT/(name+'.tmp');temp.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf-8');temp.replace(OUT/name)
 print(json.dumps(metadata,ensure_ascii=False),flush=True)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--download-municipal',action='store_true');args=parser.parse_args();main(args.download_municipal)
