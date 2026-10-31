# Fase 2 · motor descriptivo y catálogo de indicadores

## Alcance entregado

Extensión aditiva del Worker, sin cambios en `analytics.js` ni en las exclusiones del motor de referencia. Dos vistas nuevas: `#/estadistica` (distribución y concentración) y `#/catalogo` (30 fichas operacionales, buscador y descarga JSON). El laboratorio inferencial, modelos multinivel, GIS e histórico longitudinal no forman parte de esta fase.

Las estadísticas ampliadas se calculan al abrir su vista y se actualizan con los filtros globales. Al salir, se deja de solicitar su cálculo en cada cambio. El panorama conserva el camino de cálculo anterior. El reporte se mantiene en memoria hasta cambiar filtros, agrupación o archivo. No se modifican ni deduplican los registros publicados.

## Tiempo de respuesta

- Universo: filas con ambas cantidades finitas y no negativas, piezas entregadas >0, fechas de solicitud/entrega válidas y diferencia no negativa.
- Mediana: promedio de los dos valores centrales; mismo algoritmo operacional que la base.
- P25/P75/P90/P95: observación en rango `ceil(p*n)`, índice contando desde 1; sin interpolación. Los resultados difieren de métodos interpolados de Excel/otras bibliotecas, por diseño documentado.
- IQR: P75−P25. MAD: mediana de desviaciones absolutas respecto a la mediana, sin factor de reescalado.
- Media y DE: media aritmética y raíz de suma de desviaciones cuadráticas dividida por n−1. La convención de DE no implica muestreo aleatorio ni inferencia de población. CV=DE/media si media>0.
- Sin intervalos: null. DE/CV con n<2: null. Media cero: CV null. Nunca se sustituyen esos casos por cero.
- Se usa una tabla exacta de frecuencias por duración, global y por dimensión actual. No se expanden en el Worker cientos de miles de valores repetidos.

Referencias de convención: [métodos de cuantiles, NumPy](https://numpy.org/doc/2.0/reference/generated/numpy.quantile.html) y [medidas de escala, NIST](https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm). La implementación es JavaScript propio, verificada independientemente con Python estándar; no depende de estas bibliotecas en el navegador.

Los gráficos incluyen histograma, ECDF y caja P25–P75 con extremos mínimo–máximo. Esa caja no usa bigotes de Tukey ni etiqueta valores como anomalías. La ECDF describe intervalos observados; no estima supervivencia, censura ni probabilidad futura de entrega. Hay tabla de frecuencias exactas y descarga CSV. Los SVG incluyen título, descripción, ejes y unidades; el histograma también exporta PNG.

## Concentración

Se agrega volumen solicitado positivo por nombre de proveedor no vacío, en filas con ambas cantidades válidas. No se trata a un nombre vacío como empresa y se informa el volumen excluido. Los nombres no se homologan jurídicamente. Los ceros de volumen y proveedores potenciales no forman parte de la distribución.

- HHI=`Σs²`, mostrado como `10000*Σs²`, sin clasificaciones regulatorias o de competencia.
- Número efectivo=`1/Σs²`.
- Gini=`Σ(2i−k−1)v_i/(kΣv_i)`, volúmenes positivos ordenados crecientes. No corrige por tamaño del conjunto ni incluye empresas sin volumen observado.
- Shannon=`−Σs ln(s)`, en nats; normalizada por `ln(k)`, con resultado 0 si k=1.
- Participación del principal proveedor y de los cinco mayores; cobertura del volumen con proveedor no vacío.
- Misma familia de métricas para cada par clave–institución, con proveedores y volumen propios de cada fila.

Sin volumen positivo no se asigna concentración: null. Para un solo proveedor, HHI=10,000 y Gini=0 entre los observados; no son resultados contradictorios. La concentración de piezas no es gasto ni participación de mercado. No permite concluir ausencia de competencia, incumplimiento causal ni equivalencia de carteras.

El top 5 original del panorama conserva su denominador y tratamiento de categorías para equivalencia. El catálogo distingue esa métrica de `top5Known`, que sólo considera nombres no vacíos. En el corte activo de referencia no hay volumen sin proveedor y ambas coinciden.

## Denominadores y calidad

Cumplimiento por cantidad y entrega nula usan filas con q>0 y ambas cantidades válidas. Se mantienen cantidades cero en los agregados de volumen, pero no se incorporan al denominador positivo. La proporción de fechas no evaluables tiene como denominador filas entregadas con cantidades válidas; fechas negativas se cuentan aparte. Una fila con ambas fechas inválidas cuenta una sola vez como no evaluable.

Persisten los límites clínicos y de identificación: la fecha registrada no define primera/completa entrega; piezas de presentaciones distintas no son tratamientos; filas idénticas se conservan; no hay datos nuevos de inventario o demanda.

## Resultados de referencia (activas, sin otros filtros)

| Medida | Resultado |
|---|---:|
| n respuesta | 828,959 |
| Mediana / P90 | 12 / 27 días |
| P25 / P75 / P95 | 8 / 16 / 42 días |
| IQR / MAD | 8 / 4 días |
| Media / DE | 16.290493 / 22.020795 días |
| CV | 1.351757 |
| Proveedores positivos | 513 |
| HHI (0–10,000) | 384.320241 |
| Gini entre proveedores positivos | 0.899997 |
| Entropía de Shannon | 4.084810 nats |
| Pares clave–institución con volumen elegible | 9,870 |

Son resultados del archivo con SHA-256 `f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2`, no constantes del motor ni conclusiones causales.

## Exportaciones y reproducción

- JSON de reporte: versión de motor, versión de catálogo, hash del original declarado en metadatos, recuperación, fechas, filtros legibles y códigos de dimensión, agrupación, métricas base, métricas ampliadas, frecuencias y concentración por pares. Incluye ajustes de presentación de la tabla.
- CSV de indicadores por grupo: respeta mínimo de n y orden seleccionados. Fracciones se exportan en escala 0–1; tiempos en días; CV es razón.
- CSV de pares y frecuencias: datos subyacentes completos del universo filtrado, no sólo la página visible.
- SVG/PNG: representación del gráfico; el contexto completo y la trazabilidad se conservan en el JSON, no se presume que una imagen aislada contenga todos los filtros.
- Catálogo: `indicator-catalog.js` es la fuente de verdad de las fichas; `docs/indicator-catalog.json` es una copia generada en la comprobación.

```text
node scripts/check_statistics.cjs
python scripts/check_statistics_python.py
node scripts/reproduce_report.cjs docs/phase2-report.json.gz
# Para un reporte descargado por el usuario:
node scripts/reproduce_report.cjs reporte.json data/observatorio.json.gz
```

La reproducción verifica el hash declarado de fuente y compara métricas base, grupos, distribución y concentración con la ejecución local. Conteos, cantidades y estadísticos de orden deben coincidir exactamente; otros derivados numéricos usan tolerancias absoluta y relativa de 1e-12, porque Math.log puede variar en los últimos bits entre navegador y Node. No prueba autenticidad frente a una fuente externa por sí sola; el SHA-256 del ZIP original se verificó en la auditoría inicial. Para importaciones locales sin hash o sin el mismo archivo, el script no afirma reproducción. Los tiempos de ejecución no se comparan como resultados científicos.

## Límites pendientes

No se añadió inferencia estadística, intervalos de confianza, predicción, pruebas espaciales, supervivencia ni un índice clínico. Los análisis entre cortes exigen histórico e identidad confiable aún pendientes. El cálculo sigue dependiendo de la RAM del navegador; la nueva capa reduce memoria usando frecuencias y se activa bajo demanda, pero no certifica funcionamiento en dispositivos de baja RAM. El catálogo no cubre todavía todos los posibles indicadores de las fases futuras.
