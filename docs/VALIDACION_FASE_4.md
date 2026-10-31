# Validación de Fase 4

Referencia local: `phase4-reference.json`, hash de suministro `f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2`, remisiones activas y evaluación 2026-10-25.

## Resultado de referencia IMSS

| Indicador | Valor |
|---|---:|
| Filas | 737,837 |
| Piezas solicitadas | 1,754,292,391 |
| Entregadas reportadas | 1,381,976,553 |
| Brecha | 372,315,838 |
| Brecha vencida | 300,276,941 |
| Mediana / P90 de respuesta | 10 / 17 días |
| Intervalos de respuesta válidos | 600,779 |

Los valores coinciden exactamente con el motor original. Los grupos por estado, empresa, clave, contrato, CLUES, procedimiento y licitación concilian conteos, cantidades, brecha y vencimientos con la ficha. Los flujos de esta referencia concilian con el total; esa igualdad no se presupone para fuentes con fechas ausentes.

`check_profiles.cjs` verifica comparación múltiple, límite de cuatro claves, identificadores repetidos, tipo inválido, selección global sin mutaciones, cantidad de registros originales, ficha vacía tras un filtro incompatible y casos sintéticos con sobreentrega, cantidad inválida y duración negativa. Las pruebas del dashboard y del atlas mantienen la regresión.

En el navegador local se verificaron ficha institucional IMSS, comparación con IMSS Bienestar, tabla de primeros 50 registros y actualización por filtro estatal. Las descargas nativas no se automatizaron; la generación de datos y el empaquetado se verifican por código. No se certifica comportamiento de GitHub Actions, accesibilidad completa ni rendimiento móvil.

`node scripts/reproduce_profiles.cjs docs/phase4-institution-report.json.gz` reproduce exactamente la ficha institucional y todos sus desgloses. `node scripts/check_profile_csv.cjs` verifica separadores reales, las 18 columnas y neutralización de fórmulas en registros exportados.

También se verificó en navegador copiar y recargar el enlace de comparación IMSS / IMSS Bienestar: restauró ambos elementos con el hash del corte. Captura: `capturas/fase4-comparador.png`. Los archivos de presentación modificados llevan versión en la URL para evitar reutilizar navegación de una entrega anterior en caché.
