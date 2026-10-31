"""Empaqueta capturas y una instantánea DOM previamente capturada con el navegador."""
import json, pathlib, re, shutil, zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'revision-chatgpt'
dom=json.loads((OUT/'dom.json').read_text(encoding='utf-8'))
html=dom['html']
html=re.sub(r'<script\b[^>]*>.*?</script>','',html,flags=re.S|re.I)
css=(ROOT/'styles.css').read_text(encoding='utf-8')
css=re.sub(r'@import\s+url\([^;]+;','',css)
html=re.sub(r'<link[^>]*href="styles.css"[^>]*>',lambda _: '<style>'+css+'</style>',html)
values={x['id']:x['value'] for x in dom['values']}
def select_value(match):
    block=match.group(0); ident=re.search(r'\bid="([^"]+)"',block)
    value=values.get(ident.group(1)) if ident else None
    block=re.sub(r'\sselected(?:="[^"]*")?','',block)
    def option(m):
        tag=m.group(0); v=re.search(r'\bvalue="([^"]*)"',tag)
        return tag[:-1]+' selected>' if v and v.group(1)==value else tag
    return re.sub(r'<option\b[^>]*>',option,block)
html=re.sub(r'<select\b[^>]*>.*?</select>',select_value,html,flags=re.S)
def input_value(m):
    tag=m.group(0); ident=re.search(r'\bid="([^"]+)"',tag)
    value=values.get(ident.group(1)) if ident else None
    if value:
        import html as h
        tag=re.sub(r'\svalue="[^"]*"','',tag)
        tag=tag[:-1]+' value="'+h.escape(value,quote=True)+'">'
    return tag
html=re.sub(r'<input\b[^>]*>',input_value,html)
html=re.sub(r'<(button|input|select)\b',r'<\1 disabled',html)
html=html.replace('<body>','<body><div style="position:relative;z-index:20;background:#fff2ce;padding:12px 20px;text-align:center;font:14px system-ui">INSTANTÁNEA VISUAL · Controles desactivados · Tablas parcialmente renderizadas · No es el sitio interactivo</div>')
html=html.replace('href="./"','href="#panorama"').replace('href="data/metadata.json"','href="codigo/metadata.json"')
(OUT/'pagina-renderizada.html').write_text('<!doctype html>\n'+html,encoding='utf-8')
files=['index.html','styles.css','app.js','analytics.js','README.md','data/metadata.json']
parts=['FAARMA · CÓDIGO Y CONTEXTO PARA REVISIÓN VISUAL\nVer capturas por separado. No incluye el conjunto de datos completo.\n']
for name in files:
    p=ROOT/name
    shutil.copy2(p,OUT/'codigo'/p.name)
    parts.append('\n\n'+'='*70+'\nARCHIVO: '+name+'\n'+'='*70+'\n'+p.read_text(encoding='utf-8'))
(OUT/'CODIGO-Y-CONTEXTO.txt').write_text(''.join(parts),encoding='utf-8')
with zipfile.ZipFile(ROOT/'faarma-revision-chatgpt.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in OUT.rglob('*'):
        if p.is_file() and p.name!='dom.json': z.write(p,p.relative_to(OUT).as_posix())
assert 'PIEZAS SOLICITADAS' in html and '2,566,801,175' in html
assert '<script' not in html and 'href="styles.css"' not in html
print('Paquete listo:',(ROOT/'faarma-revision-chatgpt.zip').stat().st_size,'bytes')
