# Fase 1 · identidad y panorama nacional

## Implementación

Nombre público: **Observatorio de Insumos para la Salud en México · by Doctor DS**. Nuevo shell científico editorial, paleta azul/turquesa/ámbar, modo claro/oscuro persistente, sidebar plegable y menú móvil. Búsqueda global y filtros conservados en URL, desplegable de filtros, etiquetas de selección, eliminación individual y deshacer hasta 20 cambios de filtros de dimensión/búsqueda/fechas de solicitud/universo. El corte de vencimiento y la dimensión de agrupación no están incluidos en ese deshacer.

Se conservan los ocho indicadores base, ahora con ficha de fórmula, universo, unidad, corte y limitación. Se muestran brecha relativa y proporción del pendiente vencido. Un desplegable presenta filas analizadas, cumplimiento por cantidad, entrega nula con solicitud positiva, diversidad de proveedores/instituciones/claves y CLUES reportadas. Se añaden tres rankings enlazados y resúmenes de calidad y antigüedad.

Las rutas de proveedores, instituciones, claves y contratos utilizan el mismo comparativo con distintas dimensiones. La vista de contratos permite agrupar por contrato, licitación, tipo de compra y unidad. No son todavía perfiles completos, comparación múltiple ni redes. Atlas territorial muestra la matriz estatal existente; el mapa GIS requiere Fase 3 y no se simula. Las rutas de calidad e histórico distinguen datos comprobados y capacidades pendientes.

La serie mensual tiene alternativa tabular con los valores exactos; las barras admiten foco y etiqueta textual. El motor `analytics.js` está intacto respecto a `legacy/fase-0/analytics.js`; la ampliación descriptiva vive en `dashboard-worker.js`. Se mantienen importación CSV, exportación CSV/XLSX, límites de Excel y sanitización de texto. Los nombres de descargas usan observatorio-insumos; el metadato creator interno de Excel conserva la atribución histórica del motor base, documentada en auditoría.

Se retiró la llamada a fuentes de Google del CSS activo. No se incorporaron bibliotecas nuevas ni cuentas/servicios externos. El stack React/TypeScript/Vite es el destino de migración descrito en arquitectura, no una dependencia instalada en esta fase.

## Operación

`python -m http.server 8765 --bind 127.0.0.1` sirve la aplicación desde raíz. `python scripts/build_static.py` prepara `_site` mediante una lista explícita de archivos públicos y genera manifiesto de integridad. Los workflows publican ese directorio. El calendario de descarga cambió a día 1 de cada mes, 12:30 UTC, con ejecución manual. No debe confundirse ese calendario con el histórico inmutable/transaccional aún pendiente de Fase 5. No se ejecutó un workflow remoto ni se declaró un despliegue.

## Comprobaciones

```text
node --check app.js
node --check dashboard.js
node --check dashboard-worker.js
node scripts/check_analytics.cjs
node scripts/check_xlsx.cjs
node scripts/check_dashboard.cjs
python scripts/build_static.py
```

`check_dashboard` comprueba hash idéntico del motor, exclusión de cantidades negativas/ausentes y ceros del denominador positivo, cobertura observada de CLUES y resultados del corte completo. Guarda una ejecución local en `benchmark-fase1.json`. No representa carga de navegador, RAM del Worker, datos móviles ni una distribución de tiempos. Los tests del corte original son históricos: sus totales no deben aplicarse a ciegas a un nuevo archivo.

La verificación del navegador y sus límites se documentan en `VALIDACION_FASE_1.md`. La existencia de CSS responsive no certifica accesibilidad ni rendimiento móvil. El catálogo de indicadores ampliado, Parquet, catálogos CLUES, snapshots y modelos quedan explícitamente pendientes.
