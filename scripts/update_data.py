"""Descarga oficial y empaquetado reproducible. Python 3.11+, openpyxl."""
import argparse, csv, datetime as dt, gzip, hashlib, http.cookiejar, io, json, pathlib, re, urllib.request, urllib.parse, zipfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
URL = 'https://entregamedicamentos.salud.gob.mx/insumos/'
FIELDS = ['clave','descripcion','institucion','entidad','estatus','nombre_proveedor','fecha_solicitud','fecha_entrega','fecha_limite','piezas_solicitadas','piezas','canceladas_activas','clues','unidad_medica','suministro','tipo_procedimiento_1','licitacion','contrato']
ALIASES = {'proveedor':'nombre_proveedor','piezas_entregadas':'piezas','fecha_actualizacion':'fecha_actualizacion','fecha_limite_de_entrega':'fecha_limite'}
def norm(x):
    import unicodedata
    return re.sub(r'[^a-z0-9]+','_', ''.join(c for c in unicodedata.normalize('NFD',str(x or '').lower().strip()) if unicodedata.category(c)!='Mn')).strip('_')
def convert(path):
    dictionaries = [[] for _ in FIELDS]; lookups = [{} for _ in FIELDS]; rows=[]; headers=None; rejected=0; source_headers=[]
    def add(values):
        nonlocal headers, rejected
        if headers is None:
            source_headers.append([str(x or '') for x in values])
            headers=[ALIASES.get(norm(x),norm(x)) for x in values]
            missing=set(FIELDS)-set(headers)
            if missing or len(set(headers))!=len(headers):raise ValueError('Cambio de esquema en fuente; columnas ausentes o duplicadas: '+str(sorted(missing)))
            if not {'piezas_solicitadas','piezas'}.issubset(headers):
                raise ValueError('Faltan columnas PIEZAS SOLICITADAS y PIEZAS ENTREGADAS: '+str(headers))
            return
        record=dict(zip(headers,values))
        if not any(values): return
        out=[]
        for i,key in enumerate(FIELDS):
            v=record.get(key)
            if i not in (9,10):
                if isinstance(v,(dt.date,dt.datetime)): v=v.isoformat()[:10]
                v=str(v).strip() if v is not None else ''
                if 6<=i<=8 and v:
                    for fmt in ('%d-%m-%Y','%d/%m/%Y','%Y-%m-%d','%Y-%m-%d %H:%M:%S'):
                        try: v=dt.datetime.strptime(v,fmt).date().isoformat(); break
                        except ValueError: pass
                if v not in lookups[i]: lookups[i][v]=len(dictionaries[i]); dictionaries[i].append(v)
                out.append(lookups[i][v])
            else:
                try: out.append(float(str(v).replace(',','')) if v is not None and str(v).strip() else None)
                except ValueError: out.append(None); rejected+=1
        rows.append(out)
    def consume(name,content):
        nonlocal headers
        headers=None
        if name.lower().endswith('.csv'):
            text=content.decode('utf-8-sig',errors='replace')
            try: dialect=csv.excel if text.splitlines()[0].startswith('clave,descripcion,') else csv.Sniffer().sniff(text[:16000],delimiters=',;\t|')
            except csv.Error: dialect=csv.excel
            for row in csv.reader(io.StringIO(text),dialect): add(row)
        elif name.lower().endswith('.xlsx'):
            import openpyxl
            wb=openpyxl.load_workbook(io.BytesIO(content),read_only=True,data_only=True)
            for sheet in wb:
                headers=None
                for row in sheet.iter_rows(values_only=True): add(row)
            wb.close()
    if path.suffix=='.zip':
        with zipfile.ZipFile(path) as z:
            for name in z.namelist():
                if name.lower().endswith(('.csv','.xlsx')): print('Procesando',name,flush=True); consume(name,z.read(name))
    else: consume(path.name,path.read_bytes())
    if not rows: raise ValueError('No se encontraron registros')
    seen=set(); duplicates={}; status_counts={}
    for r in rows:
        status=dictionaries[11][r[11]] or 'SIN DATO'
        status_counts[status]=status_counts.get(status,0)+1
        identity=tuple(r)
        if identity in seen: duplicates[status]=duplicates.get(status,0)+1
        seen.add(identity)
    del seen
    dates=[v for v in dictionaries[6] if re.fullmatch(r'\d{4}-\d{2}-\d{2}',v)]
    now=dt.datetime.now(dt.timezone.utc).isoformat()
    meta={'source':URL,'retrievedAt':now,'records':len(rows),'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'requestMin':min(dates) if dates else None,'requestMax':max(dates) if dates else None,'numericErrors':rejected,'fields':FIELDS,'scope':'Exportación oficial sin filtros solicitada con search={}. Integridad del universo no garantizada por la fuente.'}
    meta['sourceHeaders']=source_headers
    meta['transformVersion']='5.0.0'
    meta['sourceUpdatedAt']=None
    meta['quality']={'exactDuplicateExtraRowsByRemission':duplicates,'rowsByRemission':status_counts,'note':'Filas idénticas en los 18 campos conservados. Se mantienen en los indicadores; el número de suministro no se presupone único.'}
    payload={'meta':meta,'dictionaries':dictionaries,'rows':rows}
    target=ROOT/'data'/'observatorio.json.gz'
    temp=target.with_suffix('.tmp')
    with gzip.open(temp,'wt',encoding='utf-8',compresslevel=6) as f: json.dump(payload,f,ensure_ascii=False,separators=(',',':'))
    temp.replace(target)
    (ROOT/'data'/'metadata.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(meta,ensure_ascii=False),flush=True)
def download():
    opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    html=opener.open(URL,timeout=120).read().decode()
    token=re.search(r'const csrf_token\s*=\s*"([^"]+)"',html).group(1)
    req=urllib.request.Request(URL+'get.excel',data=urllib.parse.urlencode({'search':'{}'}).encode(),headers={'X-CSRFToken':token,'Referer':URL})
    dest=ROOT/'data'/'entregas.zip'
    with opener.open(req,timeout=900) as response, dest.open('wb') as f:
        import shutil
        shutil.copyfileobj(response,f)
    return dest
if __name__=='__main__':
    parser=argparse.ArgumentParser(); parser.add_argument('--input'); args=parser.parse_args()
    (ROOT/'data').mkdir(exist_ok=True)
    convert(pathlib.Path(args.input) if args.input else download())
