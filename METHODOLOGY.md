# Metodología

Este observatorio describe solicitudes y entregas reportadas en un archivo institucional público. Sus filas no se consideran órdenes únicas verificadas. El procesamiento preserva registros y duplicados potenciales; no elimina extremos automáticamente.

## Universo y cantidades

Los filtros se aplican al conjunto disponible. ACTIVA es el filtro inicial; canceladas y otras remisiones se conservan y pueden consultarse. Las fechas delimitan solicitudes; la evaluación clasifica vencimientos. Las cantidades requieren ambos valores finitos no negativos.

- Solicitadas: suma de cantidades solicitadas válidas.
- Entregadas reportadas: suma publicada, incluidas sobreentregas.
- Acreditables: suma por fila de min(entregadas, solicitadas).
- Brecha: suma por fila de max(solicitadas − entregadas, 0).
- Cobertura: acreditables / solicitadas. Denominador cero: no evaluable.
- Vencida: brecha de filas con fecha límite válida anterior a la evaluación; no es resolución contractual.

## Tiempos

Entrega positiva y fechas de solicitud/entrega válidas con duración no negativa. Días naturales por fila, sin ponderar por piezas. Mediana promedio de los dos valores centrales cuando procede. Percentiles por rango más próximo. La puntualidad usa fecha de entrega ≤ límite entre filas con entrega positiva y ambas fechas válidas; no mide OTIF ni primera entrega o entrega completa.

## Interpretación

Cada tabla debe leerse junto con filtros, fechas, denominadores y cobertura de datos. Las piezas de productos distintos no son dosis o tratamientos equivalentes. Un flujo mensual no es una cohorte ni un snapshot. Sólo hay un corte real preservado; no hay tendencia entre recuperaciones ni identidad validada de solicitudes entre cortes.

El catálogo operacional descargable declara fórmulas y exclusiones. Consultar también docs/FASE_2.md (estadística), FASE_3.md (geografía), FASE_4.md (fichas), FASE_5.md (histórico) y FASE_6.md (laboratorio). Los resultados no certifican recepción física, inventario, suficiencia, disponibilidad para pacientes ni responsabilidad.

## Validación y límites de revisión

Hay pruebas automatizadas y contrastes entre implementaciones documentados. Eso no equivale a auditoría externa o dictamen profesional. Los gates de publicación y promoción transaccional del candidato siguen pendientes del siguiente tramo de implementación. Los textos públicos de esta etapa no cierran esos bloqueos.
