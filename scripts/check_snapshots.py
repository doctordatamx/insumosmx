import copy,gzip,hashlib,json,pathlib,tempfile
from archive_snapshot import archive,FIELDS
from update_data import convert
import update_data
with tempfile.TemporaryDirectory(prefix='.history-test-',dir=pathlib.Path(__file__).resolve().parents[1]) as directory:
 root=pathlib.Path(directory);root.resolve().relative_to(pathlib.Path(__file__).resolve().parents[1]);(root/'data').mkdir()
 data={'meta':{'sourceSha256':'a'*64,'fields':FIELDS,'records':1,'source':'Fixture sintética','retrievedAt':'2026-01-01T00:00:00+00:00'},'dictionaries':[['X'] if i not in (9,10) else [] for i in range(18)],'rows':[[0]*9+[10,2]+[0]*7]}
 def write(): (root/'data/observatorio.json.gz').write_bytes(gzip.compress(json.dumps(data).encode()))
 write();first=archive(root);target=root/'data/snapshots'/('a'*64)/'observatorio.json.gz';original=target.read_bytes()
 data['meta']['retrievedAt']='2026-02-01T00:00:00+00:00';write();archive(root);index=json.loads((root/'data/snapshots/index.json').read_text());assert len(index['snapshots'])==1 and len(index['observations'])==2;assert target.read_bytes()==original
 data['rows'][0][10]=3;write()
 try:archive(root);raise AssertionError('Debió rechazar transformación distinta')
 except ValueError as error:assert 'transformación' in str(error)
 data['meta']['sourceSha256']='b'*64;write();archive(root);assert len(json.loads((root/'data/snapshots/index.json').read_text())['snapshots'])==2
 data['rows'][0][0]=5;write()
 try:archive(root);raise AssertionError('Debió rechazar diccionario inválido')
 except ValueError:pass
 update_data.ROOT=root
 missing=root/'missing.csv';missing.write_text('descripcion,piezas_solicitadas,piezas\nX,1,0',encoding='utf-8')
 try:convert(missing);raise AssertionError('Debió rechazar cambio de esquema')
 except ValueError as error:assert 'esquema' in str(error)
 valid=root/'valid.csv';values=['X']*18;values[9]='10';values[10]='2';valid.write_text(','.join(FIELDS)+'\n'+','.join(values),encoding='utf-8');convert(valid);converted=json.loads(gzip.decompress((root/'data/observatorio.json.gz').read_bytes()));assert converted['meta']['sourceHeaders']==[FIELDS] and converted['meta']['records']==1 and converted['meta']['sourceUpdatedAt'] is None
 data['rows'][0][0]=0;data['meta']['sourceSha256']='a'*64;data['rows'][0][10]=2;write();target.write_bytes(b'alterado')
 try:archive(root);raise AssertionError('Debió rechazar histórico alterado')
 except ValueError as error:assert 'modificado' in str(error)
print('OK: inmutabilidad, idempotencia, recuperaciones repetidas, dos cortes, esquema, diccionarios y detección de alteración.')
