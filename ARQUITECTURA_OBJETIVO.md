# Arquitectura objetivo · versión 3.0 · by Doctor DS

## Alcance incremental

La entrega inicial cubrió auditoría, arquitectura y Fase 1. La continuación incorpora Fase 2: motor descriptivo aditivo, distribución de tiempos, concentración, catálogo formal y exportaciones reproducibles. Las fases 3–8 conservan condiciones de entrada explícitas. No se confunde una ruta prevista con una función científica implementada.

## Contrato de datos estable

El hecho público conserva el esquema ordenado de `data/metadata.json`, cantidades numéricas o null y diccionarios para dimensiones. El motor usa solicitudes con ambas cantidades finitas y no negativas; solicitudes >0 definen elegibilidad de cumplimiento por registro. Toda métrica nueva debe declarar universo y exclusiones y superar regresión contra el motor original.

En Fase 1: `analytics.js` permanece intacto. `dashboard-worker.js` importa el motor y añade resúmenes de dimensiones, elegibilidad y rankings del universo seleccionado sin alterar sus resultados. `app.js` conserva la conexión y las funciones previas. `dashboard.js` gestiona rutas, preferencias, filtros visibles, detalle de indicadores y presentación nacional. `styles.css` conserva la base y `phase1.css` define los tokens de claro/oscuro, tipografía de sistema, rejillas y responsive. No hay backend ni llamadas a mapas externos.

Rutas hash compartibles y compatibles con GitHub Pages: `#/panorama`, `#/territorio`, `#/claves`, `#/instituciones`, `#/proveedores`, `#/contratos`, `#/evolucion`, `#/brechas`, `#/registros`, `#/calidad`, `#/metodologia`, `#/actualizaciones`. Las vistas especializadas iniciales usan el comparativo existente con la dimensión correspondiente; todavía no son las fichas científicas completas de Fase 4. Los parámetros de búsqueda conservan los filtros. Enlaces antiguos de ancla se traducen a la ruta equivalente.

## Evolución a frontend tipado

Crear una aplicación React/TypeScript/Vite con componentes de shell, filtros, tarjetas, tablas y gráficos; extraer tipos `SupplyRow`, `SnapshotManifest`, `FilterState`, `IndicatorDefinition`, `WorkerRequest/Response`. Migrar primero presentación bajo los mismos contratos. TanStack Table/Virtual para tablas de gran tamaño y ECharts para series accesibles con alternativas tabulares. MapLibre recibe únicamente GeoJSON/PMTiles y CLUES verificados del pipeline. Se decide cada dependencia por necesidad y se fija con lockfile y licencia; no se importa el stack completo por anticipado.

Gates de sustitución: equivalencia de cálculos en fixtures y corte original; CSV/XLSX válidos; URL y filtros reproducibles; pruebas de teclado y responsive; benchmark comparativo. Mantener la versión anterior recuperable hasta superarlos. Hash routing evita reglas de servidor y rutas rotas bajo un repositorio de Pages.

## Capas de datos previstas

| Capa | Contenido | Condición |
|---|---|---|
| raw | ZIP original inmutable, SHA-256, URL, fecha de recuperación y fecha declarada si existe | Nunca sobrescribir un original archivado |
| staging | Esquema, parseo, valores originales y reglas de validación; Parquet particionado por corte | Registro explícito de errores y normalizaciones |
| curated | Correspondencias CLUES/catálogos oficiales con procedencia, versión y cobertura | No inventar vínculos o coordenadas |
| analytics | Indicadores, distribuciones, agregados y reglas de anomalías reproducibles | NumPy/Polars/DuckDB según necesidad, pruebas contra base |
| public | Manifiesto, agregados pequeños y particiones para exploración | Publicación atómica del manifiesto sólo después de validar |

No acumular exportaciones acumulativas como meses independientes. Identificar snapshots por hash de contenido y registrar recuperaciones separadamente. El histórico sólo permite resolución por fila después de validar identidad; los agregados comparables deben declarar cambios de universo. La periodicidad objetivo es mensual, con ejecución manual y retención del último corte válido.

## Catálogo de indicadores y análisis

Objetivo: catálogo versionado con identificador, definición, fórmula, numerador, denominador, unidad, campos, universo, exclusiones, limitaciones, referencia al cálculo y corte. Separar observado, derivado, exploratorio y predictivo en UI y exportaciones. Fase 1 explica indicadores existentes por tarjeta y añade denominadores observables por registro y diversidad de dimensiones; no introduce ajustes estadísticos.

Las fases científicas incorporarán concentración (HHI/Gini/entropía), dispersión y redes después de verificar unidades y cartera. Análisis espacial exige límites, emparejamiento CLUES y matrices de vecindad documentados. Predicción/supervivencia requiere evento, fechas, censura, partición temporal, evaluación contra baseline y análisis de fuga; un solo corte no autoriza probabilidades o inferencia longitudinal. El IPLI debe permanecer exploratorio y sin componente clínico no verificado.

## Pruebas y operación

- Base: scripts Node actuales, copia original y regresión de sumas/fechas/CSV/XLSX.
- Fase 1: pruebas de extensión del Worker, denominadores con cantidad cero/negativa/ausente, persistencia de vistas, navegación por teclado, estados vacíos y preferencias.
- Destino: Vitest para frontend, pytest para pipeline, end-to-end con navegador, validación CLUES y comparación de manifiestos. CI debe diferenciar un fixture histórico de un corte nuevo.
- Reportar tiempos y tamaños medidos, sin extrapolarlos a móvil. La memoria del Worker debe medirse con herramientas apropiadas, no mediante memoria del hilo principal.
- Despliegue: empaquetado sólo de archivos públicos, sin originales, credenciales o artefactos de revisión. GitHub Pages se declara publicado sólo después de URL y ejecución comprobadas.

## Fases y criterios de cierre

| Fase | Estado en esta entrega | Cierre requerido |
|---|---|---|
| 0 Auditoría | Documento y referencia ejecutada | Inventario y checks reproducibles |
| 1 Identidad/dashboard | Implementación del presente cambio | Motor equivalente, UI verificable, documentación/capturas |
| 2 Motor ampliado | Implementado como extensión descriptiva | Catálogo formal, equivalencia e independencia Python documentados en docs/FASE_2.md |
| 3 GIS | Implementado y verificado | Atlas, CLUES exacta, auditoría y filtros municipales; ver docs/FASE_3.md |
| 4 Exploradores avanzados | Implementado | Fichas, comparación múltiple, gráficos, registros originales y denominadores; ver docs/FASE_4.md |
| 5 Histórico | Implementado, una línea base real | Conjunto transformado inmutable, manifiestos y actualización mensual; ver docs/FASE_5.md |
| 6 Laboratorio | Implementado, alcance descriptivo | Dependencia, comparación por par, redes y señales reproducibles; ver docs/FASE_6.md |
| 7 Predicción | Condicionada | Evidencia de identificabilidad y validación temporal |
| 8 Optimización/publicación | Pendiente | Benchmarks, accesibilidad y despliegue comprobado |
