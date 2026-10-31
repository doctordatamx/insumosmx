"""Construye el directorio público con lista explícita; sin originales ni secretos."""
import hashlib, json, pathlib, shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
FILES=['index.html','styles.css','phase1.css','phase2.css','app.js','dashboard.js','phase2.js','analytics.js','dashboard-worker.js','statistics.js','statistics-worker.js','indicator-catalog.js','data/observatorio.json.gz','data/metadata.json','ARQUITECTURA_OBJETIVO.md','AUDITORIA_INICIAL.md']
FILES += [str(p.relative_to(ROOT)).replace('\\','/') for p in (ROOT/'vendor').glob('*') if p.is_file()]
FILES += ['geo.js','geo.css','geo-worker.js','profiles.js','profiles.css','profiles-worker.js','history.js','history-worker.js','lab.js','lab.css','lab-worker.js','lab-catalog.js','supplier-products.js','supplier-products.css','supplier-products-worker.js','public-policy.js','transparency.js','transparency.css','data/corrections.json']+[str(p.relative_to(ROOT)).replace('\\','/') for p in (ROOT/'data/geography').glob('*.json')]
FILES += ['METHODOLOGY.md','DATA_PROVENANCE.md','DATA_DICTIONARY.md','LIMITATIONS.md','EDITORIAL_POLICY.md','CORRECTIONS_POLICY.md','AI_TRANSPARENCY.md','SECURITY.md','LICENSE','LICENSE_SCOPE.md','CHANGELOG.md','docs/DIAGNOSTICO_TRANSPARENCIA.md','docs/ETAPA_1_TRANSPARENCIA.md']
snapshot_index=ROOT/'data/snapshots/index.json'
if snapshot_index.exists():
    from verify_snapshots import verify
    verify(ROOT)
    FILES.append('data/snapshots/index.json')
    for entry in json.loads(snapshot_index.read_text(encoding='utf-8'))['snapshots']:
        if len(entry['id'])!=64 or any(c not in '0123456789abcdef' for c in entry['id']): raise ValueError('Snapshot inválido')
        for asset in ['manifest.json','observatorio.json.gz']+(['geography.json'] if entry.get('geographySha256') else []): FILES.append('data/snapshots/'+entry['id']+'/'+asset)
for name in FILES:
    if not (ROOT/name).is_file(): raise FileNotFoundError(name)
target=ROOT/'_site'
manifest={}
for name in FILES:
    src=ROOT/name; dest=target/name; dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(src,dest)
    manifest[name]={'bytes':src.stat().st_size,'sha256':hashlib.sha256(src.read_bytes()).hexdigest()}
(target/'.nojekyll').touch()
(target/'build-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Publicación preparada:',len(FILES),'archivos; no desplegada.')
