# Faarma · Observatorio del suministro institucional

Web estática en español, lista para GitHub Pages. Datos reales de la [plataforma de la Secretaría de Salud](https://entregamedicamentos.salud.gob.mx/insumos/). No requiere backend, claves ni cuenta para consultar.

## Corte incluido

Descargado el **25 de octubre de 2026, hora de México**: 1,102,722 registros en la exportación sin filtros; 1,002,426 activos. Solicitudes entre 2025-10-13 y 2026-10-13. Fecha de recuperación no significa fecha de actualización de la fuente. La diferencia entre el total de la tabla inicial y el ZIP corresponde al universo de remisiones; la web inicia con ACTIVA.

La exportación oficial se obtiene mediante una sesión pública, token CSRF y `POST /insumos/get.excel` con `search={}`. El ZIP contiene `remisiones_publica.csv`. El comprimido para la web conserva los 18 campos de análisis, incluidos suministro, CLUES, unidad, contrato, licitación y estado activa/cancelada. Los encabezados proveedor y piezas_entregadas se normalizan a nombre_proveedor y piezas.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube este directorio a su rama `main`, incluidos `data/observatorio.json.gz`, `data/metadata.json` y `vendor/`. No subas el ZIP original ni archivos temporales.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
3. Ejecuta **Actions → Publicar observatorio → Run workflow**, o haz un push a `main`.
4. La acción devuelve la URL `https://TU_USUARIO.github.io/TU_REPOSITORIO/`. Todas las rutas de recursos son relativas y funcionan en subdirectorios.

La acción de actualización corre los lunes a las 12:30 UTC (06:30 en Ciudad de México), descarga un corte nuevo, registra su SHA-256, hace commit de los dos archivos de datos y despliega el sitio. También puede ejecutarse manualmente. Deben estar habilitados Actions y permisos de escritura del workflow. La actualización usa Python 3.12 y openpyxl 3.1.5; no usa navegador ni servicios de pago. Si la fuente cambia o falla, el script falla antes de reemplazar el corte válido. No asumas que una ejecución exitosa prueba que la fuente publicó un corte más reciente.

## Consultar localmente

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Abre `http://127.0.0.1:8765/`. No abras `index.html` con `file://`: fetch y Workers necesitan HTTP. Usa un navegador moderno con Web Workers y DecompressionStream. La primera carga descarga unos 19 MB comprimidos y expande el millón de registros en memoria; equipos con poca RAM pueden tardar. El cálculo se realiza fuera del hilo de interfaz.

## Actualizar o importar

```powershell
pip install openpyxl==3.1.5
python scripts/update_data.py
# Alternativa: descargar Exportar a Excel en el portal y procesar su ZIP.
python scripts/update_data.py --input data/entregas.zip
```

El script acepta ZIP con CSV/XLSX, CSV o XLSX. Conserva faltantes numéricos como null. Las fechas no válidas quedan disponibles en el archivo y no se usan en métricas temporales. La interfaz permite abrir CSV con los encabezados del portal o los del observatorio. Los archivos se procesan localmente y no se envían a un servidor. El CSV debe usar comas; para otras variantes normalízalo mediante el script Python. La importación es temporal, no actualiza el sitio publicado.

## Funciones

- Filtros combinables por entidad, institución, proveedor, estatus, unidad médica, tipo de compra, remisión y fechas de solicitud. Búsqueda de clave, descripción y proveedor, ignorando acentos.
- Universo de todas las solicitudes, con entregas, con brecha o con brecha vencida. Corte de vencimiento configurable.
- Piezas solicitadas, entregadas reportadas, cobertura acreditable, brecha, brecha vencida, mediana/P90 de respuesta, puntualidad y concentración top 5 de empresas.
- Comparativos por proveedor, estado, institución y clave, con denominadores de tiempos y puntualidad. Tablas paginadas, barras de brecha, distribución de estatus, antigüedad de vencimientos y flujos mensuales.
- Descarga de resumen, comparativo y registros filtrados en CSV UTF-8 para Excel. Las celdas de texto potencialmente interpretables como fórmulas se neutralizan con apóstrofo.
- XLSX de hasta 50,000 registros filtrados, con hoja de metodología y filtros; el límite protege la memoria del navegador. El CSV puede contener todo el universo: si supera 1,048,576 filas, impórtalo con Power Query o divídelo; no cabe en una sola hoja de Excel.
- Enlaces que conservan filtros en la URL y metadatos con fecha de recuperación y hash del original.

## Metodología y límites

Los cálculos de volumen usan filas donde ambas cantidades son numéricas y no negativas. Cobertura = Σ min(entregadas, solicitadas) / Σ solicitadas. Brecha = Σ max(solicitadas − entregadas, 0). Sobreentregas no compensan faltantes de otra fila. Se muestran cantidades reportadas y cobertura limitada a 100% por registro.

Brecha vencida: pendiente con fecha límite válida anterior al corte. La antigüedad se cuenta desde la fecha límite. Mediana y P90: días naturales de solicitud a entrega registrada para filas con piezas entregadas, ambas fechas válidas y duración no negativa. Mediana no ponderada; percentil por rango más próximo. Puntualidad: fecha entrega ≤ fecha límite entre filas entregadas con ambas fechas válidas; no mide OTIF ni exige completar toda la cantidad.

La evolución mensual son dos flujos (solicitud y entrega), **no cohortes**. Un filtro de fechas delimita solicitudes, de modo que el flujo de entregas muestra únicamente las de esas solicitudes. Las cantidades de distintos productos no son dosis ni tratamientos comparables.

Se conservan filas originales, sin deduplicación automática. El campo suministro no se presupone como identificador único de fila. Una fila no se etiqueta como orden única. El corte incluido presenta 240 filas activas idénticas adicionales en los 18 campos y 911 entregas anteriores a la solicitud; las primeras se conservan y las segundas se excluyen de tiempos de respuesta. La auditoría de duplicados del corte completo queda en metadatos; las demás métricas de calidad se recalculan con los filtros. La fuente puede incluir entregas parciales, errores y validaciones; no se certifica recepción física. Las métricas son una lectura de los registros, no una auditoría de almacenes.

Este conjunto permite estudiar el cumplimiento de solicitudes institucionales; **no permite estimar desabasto clínico**, recetas no surtidas, disponibilidad en anaquel, demanda no solicitada, días de inventario, gasto o pacientes afectados. Para ello hacen falta existencias y consumo por unidad y clave, recetas/demanda, fechas de primera y última entrega, y conciliación con órdenes identificables.

## Verificación

```powershell
node --check app.js
node --check analytics.js
node scripts/check_analytics.cjs
node scripts/check_xlsx.cjs
```

La comprobación concilia los grupos y antigüedad contra el total, prueba faltantes, sobreentregas, fechas inválidas, filtros y lectura CSV, y valida el corte incluido. Los totales fijos del último bloque deben revisarse cuando se actualiza el corte. ExcelJS 4.4.0 se distribuye localmente con licencia MIT en `vendor/`. Las fuentes tipográficas de Google son opcionales; hay fuentes de sistema de respaldo.
