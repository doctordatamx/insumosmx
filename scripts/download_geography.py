"""Descarga fuentes geográficas oficiales; CLUES conserva una versión explícita."""
import hashlib, json, pathlib, urllib.request, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data/raw-geo'
SOURCES=[('clues-202608.xlsx','https://gobi.salud.gob.mx/historico_clues/ESTABLECIMIENTO_SALUD_202608.xlsx?v=1.1','5a1cfbe7062b41d9e51249aa4b5fc8a1e623e935882e97fb5f0aac797165c95b'),('states.geojson','https://gaia.inegi.org.mx/wscatgeo/v2/geo/mgee/',None)]
def main():
 RAW.mkdir(parents=True,exist_ok=True)
 for name,url,expected in SOURCES:
  target=RAW/name
  request=urllib.request.Request(url,headers={'User-Agent':'Observatorio-Insumos/3.0'})
  with urllib.request.urlopen(request,timeout=180) as response: content=response.read()
  if expected and hashlib.sha256(content).hexdigest()!=expected:raise ValueError('Cambió el catálogo fijado: revisar versión antes de actualizar')
  temporary=target.with_suffix(target.suffix+'.tmp');temporary.write_bytes(content)
  if name.endswith('.xlsx'):
   with zipfile.ZipFile(temporary) as archive:
    if archive.testzip():raise ValueError('XLSX dañado')
  elif len(json.loads(content)['features'])!=32:raise ValueError('Se esperaban 32 entidades')
  temporary.replace(target)
  print('Fuente validada:',name)
if __name__=='__main__':main()
