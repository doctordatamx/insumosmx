# Fase 6 — Laboratorio de Datos

Ruta: `#/laboratorio`. Análisis descriptivos bajo demanda sobre la selección del motor original, sin modificar filas, filtros ni sus fórmulas. Los filtros globales, incluido municipio, se aplican antes del laboratorio. Los filtros internos de la tabla sólo cambian la presentación y se conservan en el JSON exportado.

## Dependencia observada y priorización

Se construyen pares de **clave e institución** con ambas dimensiones presentes, solicitud positiva y cantidades finitas no negativas. Por par se muestran solicitadas, entregadas reportadas, acreditables, brecha, vencida, proveedor principal, HHI, número efectivo y número de proveedores conocidos. Se excluyen de concentración nombres vacíos y se muestra explícitamente `volumen con proveedor / volumen solicitado del par`. Una participación del 100% sobre una fracción pequeña de datos conocidos no demuestra proveedor exclusivo.

Se puede buscar por clave, descripción e institución, exigir volumen mínimo, cobertura de proveedor y participación principal, y ordenar por brecha, vencimientos, participación o HHI. No se crea un índice opaco de riesgo ni una clasificación de mejores empresas. La tabla pagina 25 pares; el CSV completo conserva los pares del universo calculado, sin aplicar los filtros de presentación.

Al abrir un par se comparan empresas dentro de la misma clave e institución: volumen, entregadas reportadas, pendientes, cobertura, tiempos, denominador de respuesta y puntualidad con su denominador. Las barras muestran hasta diez empresas; la tabla incluye todas. La comparación no controla estado, contrato, tamaño, fechas, plazos u otros factores y no estima efectos causales.

## Redes bipartitas

Dos redes: proveedor–institución y proveedor–clave. Una arista agrega volumen solicitado, acreditable, pendiente y filas entre ambos nodos en pares elegibles, con empresa conocida. Se conservan nombres fuente sin homología jurídica. No representa propiedad, contratación exclusiva ni movimiento físico verificado.

La vista dibuja los 20 enlaces positivos de mayor peso por solicitadas o brecha. La tabla acompaña el gráfico y el CSV incluye todos los enlaces. Grado = contrapartes distintas con solicitud positiva; fuerza = volumen solicitado incidente. Ambos se calculan sobre la **red completa filtrada**, no sólo sus 20 enlaces dibujados. No se presenta comunidad o centralidad de intermediación sin cálculo y validación.

## Señales determinísticas

Cada fila puede activar varias reglas y no se suman sus conteos como si fueran filas distintas:

- Cantidad ausente o no numérica: alguna cantidad no es finita.
- Cantidad negativa: alguna cantidad finita es menor que cero.
- Fecha inválida: algún campo de solicitud, entrega o límite no está vacío y no es una fecha ISO válida. Vacío no se etiqueta como fecha imposible.
- Entrega anterior a solicitud: cantidades válidas no negativas, entrega positiva y ambas fechas válidas con duración negativa.
- Sobreentrega: cantidades válidas no negativas y entregadas mayores que solicitadas.

Una entrega posterior a una fecha de evaluación pasada no se etiqueta automáticamente como error. La fecha de evaluación sólo clasifica vencimientos; no reconstruye existencias o entregas históricas.

## Z modificado de respuesta

Dentro de cada par elegible se reúnen intervalos por fila entregada con fechas válidas y duración no negativa. Se calcula mediana y `MAD = mediana(|x−mediana(x)|)` sin escalar. El score implementado es `0.6744897501960817 × (x−mediana) / MAD`. Se señala `|z| > umbral`, inicialmente 3.5, con mínimo inicial de 20 intervalos válidos. Ambos parámetros son editables y quedan registrados.

La referencia del z modificado y el umbral exploratorio es el [manual NIST](https://www.itl.nist.gov/div898/handbook/eda/section3/eda35h.htm), que expresa la constante redondeada a 0.6745. El mínimo de 20 es una decisión de este explorador, no una recomendación atribuida a NIST. Si MAD=0 o n es insuficiente, el registro queda **no evaluable** para ese score. No se sustituye el denominador por un epsilon ni se cambia a otra regla silenciosamente.

No hay p-valores, control de comparaciones múltiples ni supuesto demostrado de normalidad. Los tiempos pueden ser asimétricos, discretos y mezclar plazos o proveedores distintos. La señal identifica extremos relativos a ese par observado, no incumplimiento contractual, fraude, daño clínico o desempeño causal.

## Registros y trazabilidad

Se guarda el conjunto completo de índices señalados y sus reglas en el JSON. La pantalla usa una muestra dirigida a 50 ejemplos por regla, con posibles solapamientos. La exportación de registros incluye **todas las filas señaladas**, las 18 columnas originales, reglas, score cuando es evaluable e índice en la vista. Ese índice es una posición base cero dentro de la vista evaluada, incluida la máscara municipal si existe; no es identificador estable de una orden y no sirve para enlazar cortes.

El CSV neutraliza fórmulas potenciales. CSV de pares y red incluyen hash, contexto y criterios. El informe JSON preserva fuente, hash, filtros, settings, pares, redes, señales y presentación. El catálogo incorpora seis definiciones nuevas: cobertura del par, participación principal, z, grado, fuerza y filas señaladas; 36 fichas operacionales en total.

Reproducir un JSON exportado con:

```powershell
node scripts/reproduce_lab.cjs informe.json
```

Se requiere el mismo archivo fuente transformado y, si corresponde, catálogo geográfico compatible. Cantidades, conteos, pares, redes, flags y scores se comparan exactamente. Sólo las entropías admiten tolerancia absoluta y relativa 1e-12 por diferencias de `Math.log` entre motores JS. Un CSV local sin hash oficial requiere conservar sus datos y no se presenta como reproducción del corte publicado.

## Límites pendientes

No se entrenó Isolation Forest ni se añadieron clustering, PCA, comunidades, regresiones o redes de propiedad sin una hipótesis y validación específicas. La persistencia o cambios abruptos entre cortes dependen de un histórico suficiente; sigue existiendo una sola línea base real. El módulo no hace predicciones, recomendaciones clínicas ni inferencias de desabasto clínico. Optimización móvil, auditoría integral de accesibilidad y publicación remota siguen pendientes.
