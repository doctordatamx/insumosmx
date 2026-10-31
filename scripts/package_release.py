"""Entrega reproducible de transparencia, etapa 1: código, datos públicos, pruebas y documentación."""
import argparse, pathlib, zipfile, json
parser=argparse.ArgumentParser(); parser.add_argument('--stage',choices=['fase1','fase2','fase3','fase4','fase5','fase6','transparencia-etapa1'],default='transparencia-etapa1'); args=parser.parse_args()
ROOT=pathlib.Path(__file__).resolve().parents[1]
NAMES=['index.html','styles.css','phase1.css','phase2.css','app.js','dashboard.js','phase2.js','analytics.js','dashboard-worker.js','statistics.js','statistics-worker.js','indicator-catalog.js','README.md','AUDITORIA_INICIAL.md','ARQUITECTURA_OBJETIVO.md','CHANGELOG.md','.gitignore','data/observatorio.json.gz','data/metadata.json']
NAMES += ['METHODOLOGY.md','DATA_PROVENANCE.md','DATA_DICTIONARY.md','LIMITATIONS.md','EDITORIAL_POLICY.md','CORRECTIONS_POLICY.md','AI_TRANSPARENCY.md','SECURITY.md','LICENSE','LICENSE_SCOPE.md']
files=[ROOT/name for name in NAMES]
files += [ROOT/name for name in ['geo.js','geo.css','geo-worker.js','profiles.js','profiles.css','profiles-worker.js','history.js','history-worker.js','lab.js','lab.css','lab-worker.js','lab-catalog.js','supplier-products.js','supplier-products.css','supplier-products-worker.js','public-policy.js','transparency.js','transparency.css','data/corrections.json']]+list((ROOT/'data/geography').glob('*.json'))
snapshot_index=ROOT/'data/snapshots/index.json'
if snapshot_index.exists():
    from verify_snapshots import verify
    verify(ROOT)
    files.append(snapshot_index)
    for entry in json.loads(snapshot_index.read_text(encoding='utf-8'))['snapshots']:
        if len(entry['id'])!=64 or any(c not in '0123456789abcdef' for c in entry['id']): raise ValueError('Snapshot inválido')
        files.extend(ROOT/'data/snapshots'/entry['id']/asset for asset in ['manifest.json','observatorio.json.gz']+(['geography.json'] if entry.get('geographySha256') else []))
for directory in ['scripts','.github/workflows','.github/workflow-templates','vendor','docs','legacy/fase-0']:
    files.extend(p for p in (ROOT/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
output=ROOT/f'observatorio-insumos-{args.stage}.zip'
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED) as archive:
    for path in files: archive.write(path,path.relative_to(ROOT).as_posix())
with zipfile.ZipFile(output) as archive:
    if archive.testzip() is not None: raise RuntimeError('CRC inválido en entrega')
print('Entrega',args.stage,':',len(files),'archivos,',output.stat().st_size,'bytes. No publicada.')
