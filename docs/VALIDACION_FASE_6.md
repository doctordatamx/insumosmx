# Validación Fase 6

Corte activo con evaluación de vencimientos 2026-10-25; SHA fuente `f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2`.

| Referencia | Resultado |
|---|---:|
| Filas activas | 1,002,426 |
| Pares clave–institución | 9,870 |
| Solicitud fuera de pares elegibles | 0 piezas |
| Entrega anterior a solicitud | 911 filas |
| Sobreentrega | 6 filas |
| Z robusto >3.5 en valor absoluto, n≥20 | 38,578 filas |
| Filas distintas con al menos una señal | 39,495 |
| Intervalos con z evaluable | 792,591 |
| Intervalos sin z evaluable | 36,368 |
| Red empresa–institución | 1,932 enlaces / 523 nodos |
| Red empresa–clave | 5,976 enlaces / 3,874 nodos |

No se detectan cantidades inválidas o negativas ni fechas no vacías inválidas en este universo. Esto describe únicamente las reglas evaluadas, no certifica la integridad de la fuente. Las señales estadísticas no son incidentes clínicos ni incumplimientos demostrados.

- `node scripts/check_lab.cjs`: fixtures con proveedor desconocido, concentración 50/50, MAD cero, tiempo extremo, seis reglas, umbral y n inválidos, filtros, conciliación de volúmenes y grado/fuerza. Luego verifica el corte real y conserva `phase6-report.json.gz` y `phase6-reference.json`.
- `python scripts/check_lab_python.py`: comprobación independiente con `statistics.median`; verifica MAD, intervalos evaluables y 38,578 señales; también volumen y HHI de todos los pares con tolerancia numérica 1e-12 para HHI.
- `node scripts/reproduce_lab.cjs docs/phase6-report.json.gz`: reproducción de pares, redes y señales, con hash. Las cantidades y señales son exactas; sólo entropías admiten tolerancia 1e-12.
- `node scripts/check_lab_csv.cjs`: CSV de señales con reglas, índice, 18 columnas originales, filas reales y neutralización de fórmulas.
- `node scripts/check_dashboard.cjs`: motor original intacto y regresión de indicadores y denominadores.
- Catálogo: 36 IDs únicos y campos operacionales completos, conservando las definiciones originales.

En navegador se verificaron carga del universo real sin errores, búsqueda «vancomicina» (cinco pares), comparación de empresas dentro de clave e institución, cambio de red a empresa–clave y peso por brecha, y visualización de los seis registros con sobreentrega. No se automatizaron descargas nativas del navegador, ni se certifica rendimiento móvil o accesibilidad integral.

Evidencia visual: `capturas/fase6-laboratorio.png`. El conjunto fuente y su snapshot permanecen sin cambios.

Vista adicional de la red por brecha: `capturas/fase6-red.png`. Tras recargar la entrega final, el navegador calculó los 9,870 pares y 39,495 filas señaladas sin errores.
