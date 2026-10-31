"""Verifica todo el inventario preservado antes de construir una publicación."""
import hashlib,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
def verify(root=ROOT):
 base=root/'data/snapshots';index=json.loads((base/'index.json').read_text(encoding='utf-8'));seen=set()
 for entry in index['snapshots']:
  identity=entry['id']
  if entry['sourceSha256']!=identity:raise ValueError('Identidad y hash de fuente distintos')
  if identity in seen or len(identity)!=64 or any(c not in '0123456789abcdef' for c in identity):raise ValueError('Identificador histórico inválido o repetido')
  seen.add(identity);folder=base/identity
  if json.loads((folder/'manifest.json').read_text(encoding='utf-8'))!=entry:raise ValueError('Manifiesto e inventario distintos')
  for name,key in [('observatorio.json.gz','payloadSha256')]+([('geography.json','geographySha256')] if entry.get('geographySha256') else []):
   if hashlib.sha256((folder/name).read_bytes()).hexdigest()!=entry[key]:raise ValueError('Hash histórico incorrecto: '+identity+'/'+name)
 if any(o['sourceSha256'] not in seen for o in index['observations']):raise ValueError('Recuperación sin archivo preservado')
 print('Inventario histórico verificado:',len(seen),'cortes')
if __name__=='__main__':verify()
