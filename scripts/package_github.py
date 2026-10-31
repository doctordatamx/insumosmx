"""Perfil de entrega para GitHub: datos y código; publicación explícitamente manual."""
import hashlib,json,pathlib,zipfile
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=ROOT/'observatorio-insumos-transparencia-etapa1.zip'
OUT=ROOT/'observatorio-listo-para-github.zip'
WORKFLOW='''name: Validar y publicar manualmente
on:
  workflow_dispatch:
    inputs:
      publish:
        description: 'Publicar después de revisar el diagnóstico y pasar las comprobaciones'
        required: true
        type: boolean
        default: false
permissions:
  contents: read
concurrency:
  group: pages-manual
  cancel-in-progress: false
jobs:
  validate-build:
    permissions:
      contents: read
      pages: read
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - name: Verificar corte preservado
        run: python scripts/verify_snapshots.py
      - name: Verificar referencia de cantidades y fechas
        run: node scripts/check_analytics.cjs
      - name: Verificar productos por proveedor
        run: node scripts/check_supplier_products.cjs
      - name: Construir sitio público
        run: python scripts/build_static.py
      - name: Verificar textos y documentos públicos
        run: node scripts/check_transparency.cjs
      - uses: actions/configure-pages@v5
        if: ${{ inputs.publish }}
      - uses: actions/upload-pages-artifact@v4
        if: ${{ inputs.publish }}
        with:
          path: _site
  deploy:
    if: ${{ inputs.publish }}
    needs: validate-build
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
'''
def main():
 if not BASE.exists():raise FileNotFoundError('Genera primero la entrega de transparencia')
 files={}
 with zipfile.ZipFile(BASE) as source:
  for name in source.namelist():
   if name.startswith('/') or '..' in pathlib.PurePosixPath(name).parts:raise ValueError('Ruta insegura')
   content=source.read(name)
   if name=='.github/workflows/pages.yml':content=WORKFLOW.encode()
   elif name=='.github/workflows/refresh.yml':name='.github/workflow-templates/refresh-original.yml'
   files[name]=content
 for name in ['SUBIR_A_GITHUB.md','scripts/package_github.py']:files[name]=(ROOT/name).read_bytes()
 files['.gitignore']+=b'\nobservatorio-listo-para-github.zip\nobservatorio-listo-para-github.zip.sha256\n'
 forbidden=['data/raw-geo/','_site/','.git/','.aws/','.codex/']
 for name,content in files.items():
  if any(name.startswith(prefix) for prefix in forbidden) or name.endswith(('.zip','.env','.pem','.key')):raise ValueError('Archivo excluido: '+name)
  if len(content)>=25*1024*1024:raise ValueError('Supera límite de carga por navegador: '+name)
 manifest={name:{'bytes':len(content),'sha256':hashlib.sha256(content).hexdigest()} for name,content in sorted(files.items())}
 files['GITHUB_PACKAGE_MANIFEST.json']=json.dumps({'profile':'github-manual-1','files':manifest},ensure_ascii=False,indent=2).encode()
 with zipfile.ZipFile(OUT,'w',zipfile.ZIP_DEFLATED) as target:
  for name,content in sorted(files.items()):target.writestr(name,content)
 with zipfile.ZipFile(OUT) as archive:
  if archive.testzip():raise ValueError('CRC incorrecto')
  assert 'index.html' in archive.namelist()
  assert '.github/workflows/refresh.yml' not in archive.namelist()
  for name,entry in manifest.items():assert hashlib.sha256(archive.read(name)).hexdigest()==entry['sha256']
 digest=hashlib.sha256(OUT.read_bytes()).hexdigest();OUT.with_suffix('.zip.sha256').write_text(digest+'  '+OUT.name+'\n',encoding='ascii')
 print(json.dumps({'file':OUT.name,'bytes':OUT.stat().st_size,'files':len(files),'largestFileBytes':max(len(c) for c in files.values()),'sha256':digest,'mode':'manual; no publicado'}))
if __name__=='__main__':main()
