# Fase 3 — Atlas territorial

Se incorporó un atlas estático compatible con GitHub Pages. Permite comparar cobertura acreditable, piezas solicitadas, entregadas reportadas y brecha; seleccionar entidades, municipios y CLUES aplica filtros al mismo universo del motor, estadísticas y exportaciones. Las capas estatales usan entidad reportada; municipio y establecimientos requieren vínculo exacto con catálogo.

## Fuentes y versiones

- [Histórico oficial CLUES](https://gobi.salud.gob.mx/Bases_Clues.html): archivo ESTABLECIMIENTO_SALUD_202608.xlsx, agosto de 2026, 64,450 establecimientos revisados. No se afirma que sea el catálogo más reciente. Hash y URL exacta en `data/geography/metadata.json`.
- [Servicio oficial INEGI](https://www.inegi.org.mx/servicios/catalogoUnico.html): áreas estatales y municipales; los metadatos descargados indican Marco Geoestadístico diciembre de 2025. Se distribuyen 32 entidades y 118 municipios relacionados, no todos los municipios del país. No se usan atributos poblacionales.

El catálogo precede al corte de suministro. Una CLUES sin coincidencia no implica establecimiento inexistente. El estatus de operación corresponde al catálogo histórico, no certifica la situación de octubre. Nombres e instituciones de ambas fuentes se conservan para revisión, sin homologación automática.

## Reglas

Se coteja CLUES exacta y única y entidad consistente, normalizando acentos y tres alias estatales explícitos. No hay emparejamiento difuso ni coordenadas imputadas. Se verifican coordenadas numéricas y pertenencia a polígonos originales estatales y municipales, incluyendo huecos. Los puntos fuera de límites quedan en la auditoría y no se dibujan. El municipio del registro se asigna por código del catálogo, no por residencia de pacientes.

El mapa usa copias simplificadas con tolerancias de 0.006 grados (entidad) y 0.002 (municipio). Son exclusivamente visuales, sin garantía topológica para análisis de vecindad. Las comprobaciones espaciales usan geometrías originales. Las agrupaciones de puntos son visuales según zoom; su centro no representa un establecimiento nuevo.

## Resultado del corte activo

| Estado del vínculo | Filas |
|---|---:|
| Coordenadas admisibles | 792,258 |
| CLUES sin coincidencia | 195,431 |
| Coordenadas fuera del municipio declarado | 14,001 |
| Coordenadas fuera de la entidad declarada | 736 |
| Total activo | 1,002,426 |

806,995 filas tienen CLUES exacta y entidad consistente (80.5%); corresponden a 311 CLUES activas. El subconjunto distribuido contiene 332 coincidencias únicas contando activas y canceladas. Se publican sólo campos de identificación institucional y geografía, excluyendo contactos y RFC.

## Reproducibilidad y límites

`node scripts/check_geography.cjs` concilia totales, vínculos e instituciones; prueba filtro municipal y restauración del universo. `node scripts/reproduce_report.cjs docs/phase3-municipal-report.json.gz` reproduce el informe estadístico municipal comprobando hashes de suministro y catálogo.

`python scripts/download_geography.py` descarga fuentes oficiales, exige el SHA del CLUES fijado y valida estructura; `python scripts/prepare_geography.py --download-municipal` genera el paquete. La actualización mensual ejecuta ambos antes de hacer commit y publicar: un fallo detiene ese flujo. Cambiar la versión CLUES exige revisión explícita de URL, hoja y hash. El archivo de metadatos fecha la preparación, no la publicación original de las fuentes.

Un CSV importado con otro hash conserva el mapa por entidad; el vínculo CLUES queda no evaluado. No se calculan tasas poblacionales, Moran, LISA, causalidad ni cobertura sanitaria. Los datos describen solicitudes y entregas reportadas; no certifican recepción física, inventario ni desabasto clínico.
