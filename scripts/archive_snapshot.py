"""Archivo local inmutable, identificado por SHA-256 del original oficial."""
import argparse, datetime as dt, gzip, hashlib, json, pathlib, shutil, tempfile
from update_data import FIELDS
ROOT=pathlib.Path(__file__).resolve().parents[1]
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def save(path,value):
 temporary=path.with_suffix(path.suffix+'.tmp')
 temporary.write_text(json.dumps(value,ensure_ascii=False,indent=2,allow_nan=False),encoding='utf-8');temporary.replace(path)
def validate(data):
 if data['meta']['fields']!=FIELDS:raise ValueError('Cambio de esquema: revisar antes de archivar')
 if any(not isinstance(d,list) or (i not in (9,10) and any(not isinstance(v,str) for v in d)) for i,d in enumerate(data['dictionaries'])):raise ValueError('Diccionarios incompatibles')
 if len(data['dictionaries'])!=18 or len(data['rows'])!=data['meta']['records']:raise ValueError('Estructura o conteo inconsistente')
 if not data['rows']:raise ValueError('Corte vacío')
 for row in data['rows']:
  if len(row)!=18:raise ValueError('Fila incompatible')
  for i,value in enumerate(row):
   if i in (9,10):
    if value is not None and (not isinstance(value,(int,float)) or not __import__('math').isfinite(value)):raise ValueError('Cantidad no finita')
   elif not isinstance(value,int) or value<0 or value>=len(data['dictionaries'][i]):raise ValueError('Índice de diccionario inválido')
def archive(root=ROOT):
 source=root/'data/observatorio.json.gz';data=json.loads(gzip.decompress(source.read_bytes()));validate(data)
 identity=data['meta'].get('sourceSha256','')
 if len(identity)!=64 or any(c not in '0123456789abcdef' for c in identity):raise ValueError('Se requiere hash oficial válido')
 content=hashlib.sha256()
 for chunk in json.JSONEncoder(ensure_ascii=False,separators=(',',':'),allow_nan=False).iterencode({'fields':data['meta']['fields'],'dictionaries':data['dictionaries'],'rows':data['rows']}):content.update(chunk.encode())
 content_hash=content.hexdigest();base=root/'data/snapshots';base.mkdir(exist_ok=True)
 index_path=base/'index.json';index=json.loads(index_path.read_text(encoding='utf-8')) if index_path.exists() else {'version':'5.0.0','snapshots':[],'observations':[]}
 target=base/identity;existing=next((e for e in index['snapshots'] if e['id']==identity),None)
 if target.exists():
  entry=json.loads((target/'manifest.json').read_text(encoding='utf-8'))
  if entry['contentSha256']!=content_hash:raise ValueError('Mismo original con distinta transformación: revisión requerida; no se sobrescribe')
  if sha(target/'observatorio.json.gz')!=entry['payloadSha256']:raise ValueError('Archivo histórico modificado')
  if entry.get('geographySha256') and sha(target/'geography.json')!=entry['geographySha256']:raise ValueError('Geografía histórica modificada')
 else:
  entry={'id':identity,'sourceSha256':identity,'contentSha256':content_hash,'payloadSha256':sha(source),'bytes':source.stat().st_size,'retrievedAt':data['meta']['retrievedAt'],'sourceUpdatedAt':data['meta'].get('sourceUpdatedAt'), 'source':data['meta']['source'],'records':len(data['rows']),'fields':data['meta']['fields'],'schemaStatus':'compatible-18-fields','sourceHeaders':data['meta'].get('sourceHeaders'),'schemaNote':'Original de referencia sin cabeceras auditadas' if not data['meta'].get('sourceHeaders') else 'Cabeceras originales registradas','keys':len({r[0] for r in data['rows'] if data['dictionaries'][0][r[0]]}),'providers':len({r[5] for r in data['rows'] if data['dictionaries'][5][r[5]]}),'remissions':data['meta'].get('quality',{}).get('rowsByRemission',{}),'geographySha256':None}
  temporary=pathlib.Path(tempfile.mkdtemp(prefix='snapshot-',dir=base))
  try:
   shutil.copy2(source,temporary/'observatorio.json.gz')
   geography=root/'data/geography/bundle.json'
   if geography.exists():
    geo=json.loads(geography.read_text(encoding='utf-8'))
    if geo['meta']['supplySha256']==identity:shutil.copy2(geography,temporary/'geography.json');entry['geographySha256']=sha(geography)
   save(temporary/'manifest.json',entry);temporary.rename(target)
  finally:
   if temporary.exists():
    temporary.resolve().relative_to(base.resolve());shutil.rmtree(temporary)
 if existing and existing!=entry:raise ValueError('El índice histórico no coincide con su manifiesto')
 if not existing:index['snapshots'].append(entry)
 observation={'sourceSha256':identity,'retrievedAt':data['meta']['retrievedAt']}
 if observation not in index['observations']:index['observations'].append(observation)
 index['snapshots'].sort(key=lambda e:(e['retrievedAt'],e['id']));save(index_path,index)
 print('Corte preservado:',identity,'· cortes distintos:',len(index['snapshots']),'· recuperaciones:',len(index['observations']))
 return entry
if __name__=='__main__':archive()
