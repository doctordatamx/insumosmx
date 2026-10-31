# Validación de Fase 2

## Cálculo y regresión

- `check_statistics.cjs`: fixtures de percentiles, mediana par/impar, IQR, MAD, DE con n−1, CV con media cero, n=0/1, concentración vacía/igualitaria/asimétrica/proveedor único, fechas inválidas, intervalos negativos, cantidades inválidas, ceros y duplicados conservados.
- El corte completo mantiene solicitadas, entregadas, brecha, mediana y P90 del motor anterior. Mediana/P90/n coinciden además en cada uno de los grupos de proveedor.
- Frecuencias y bins suman n de respuesta; volumen de pares más exclusiones concilia con las solicitadas válidas.
- Catálogo de 30 fichas con campos metodológicos requeridos y sin identificadores repetidos.
- Exportaciones JSON/CSV generadas desde el Worker; conteos, unidades, denominadores y mínimo de n explícitos.
- `check_statistics_python.py`: comprobación independiente con Python estándar, duraciones expandidas y estadísticas de biblioteca; media, DE, MAD, percentiles, CV, HHI, Gini y entropía coinciden.
- `check_analytics.cjs`, `check_xlsx.cjs` y `check_dashboard.cjs`: regresiones previas correctas; `analytics.js` permanece idéntico a la copia de Fase 0.

## Reproducción real desde navegador

Se descargó `observatorio-analisis-2026-10-25.json` desde la vista con búsqueda VANCOMICINA, activas, sin otros filtros: **1,686 filas y 805 intervalos válidos**. La copia comprimida de evidencia está en `phase2-browser-report.json.gz` y el corte completo de referencia en `phase2-report.json.gz`.

El CLI reproduce las métricas contra el mismo gzip de datos. La comparación binaria inicial detectó diferencias de ~10⁻¹⁶ en logaritmos entre navegador y Node. La validación ahora exige igualdad exacta de conteos, cantidades y estadísticos de orden; usa tolerancias absoluta y relativa de 10⁻¹² sólo para los demás derivados. Esa tolerancia está documentada y no se usa para aceptar cambios de piezas.

`check_reproduction.cjs` acepta el reporte real y rechaza tres alteraciones: una pieza adicional, entropía modificada en 10⁻⁵ y hash de fuente incorrecto. No se comparan tiempos de ejecución como resultados científicos.

## Interfaz comprobada

- Carga de la vista estadística, tres SVG (histograma, ECDF, caja) y 9,870 pares clave–institución en el corte activo completo.
- Las tarjetas muestran P75=16, P95=42, IQR=8 y MAD=4 días con n=828,959, conservando mediana=12 y P90=27.
- Cambio de búsqueda global a VANCOMICINA recalcula el universo y sus estadísticas; JSON descargado y reproducido.
- Búsqueda sin coincidencias: 0 filas, n=0, métricas sin denominador como “Sin dato”, sin gráfico inventado y tablas vacías paginadas correctamente.
- Catálogo: 30 fichas; “entropia” sin acento encuentra las dos entradas de entropía.
- Exportación de imágenes implementada; no se afirma descarga PNG/SVG verificada en esta sesión. La evidencia de interfaz son capturas del gráfico renderizado.
- Construcción estática incluye scripts y estilos de Fase 2 y mantiene rutas relativas. Sin despliegue remoto comprobado.
- Paquete servido en `/_site/`: carga completa verificada, 513 grupos y 9,870 pares; captura en `capturas/fase2-estadistica.png`. La prueba específica de viewport móvil para los gráficos nuevos queda pendiente; no se extrapola la comprobación de Fase 1.

## Rendimiento y límites

En las ejecuciones locales observadas, la capa estadística tardó aproximadamente 2.3–8.6 s y el conjunto de decodificación/cálculo base/ampliación 5.8–18.3 s; `phase2-reference.json` conserva la última ejecución. Son corridas no controladas con variación de carga del equipo, no percentiles de rendimiento ni resultados de dispositivos móviles. RAM del Worker y rendimiento en baja memoria no medidos.

No se declara WCAG AA ni inferencia clínica/causal. Persisten tareas de lector de pantalla, contraste exhaustivo, zoom y distintos navegadores. No se ha implementado GIS, histórico inmutable, supervivencia, inferencia multinivel ni predicción.
