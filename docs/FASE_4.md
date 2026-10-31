# Fase 4 — Fichas y comparador

Se incorporan exploradores de empresas, instituciones, claves de insumos y contratos. La nueva ruta es `#/fichas`. Las pantallas comparativas anteriores conservan sus funciones y disponen de un acceso al explorador.

## Funciones disponibles

- Ficha individual con solicitadas, entregadas reportadas, entregadas acreditables, brecha, brecha vencida, cobertura, mediana y P90.
- Comparación de hasta cuatro claves o cinco empresas, instituciones o contratos. Se seleccionan dentro del mismo universo y no se mezclan tipos en una comparación.
- Desgloses por estado, institución, proveedor, clave, contrato, CLUES reportada, procedimiento y licitación, excluyendo la dimensión principal. La pantalla muestra las 20 mayores brechas; CSV y JSON conservan los grupos completos.
- Barras apiladas de volumen acreditable y brecha, dispersión volumen–cobertura y cajas de tiempos con rango mínimo–máximo, P25, P75 y mediana. El rango no es un intervalo de confianza ni un bigote de Tukey.
- Flujos mensuales de solicitudes y entregas, sin interpretación de cohortes o snapshots. Se excluyen fechas inválidas de su flujo correspondiente.
- Primeros 50 registros originales de cada ficha y CSV con todas sus filas y las 18 columnas. No se deduplica ni se afirma que una fila sea una orden única.
- Exportación JSON con contexto, fuente, hash y desgloses. Comparación y desglose CSV con hash, fecha de evaluación y filtros. Los textos que podrían ejecutarse como fórmulas se neutralizan.
- Enlace de fichas con tipo, identificadores del diccionario y hash del corte. Si el hash del enlace difiere, no se reutilizan los identificadores como si designaran los mismos elementos. El JSON es la referencia portable del análisis.

La búsqueda del selector de claves incluye su descripción original. La ficha muestra las descripciones relacionadas. No existe clasificación terapéutica homologada, inferencia validada de nombre genérico ni presentación estructurada: esa información se consulta en el texto fuente. Las piezas de presentaciones distintas no son tratamientos equivalentes.

## Coherencia del universo

`profiles-worker.js` usa los índices `selected` del motor base y sus funciones `add` y `finish`; no cambia filtros, filas ni resultados globales. Los filtros por municipio y CLUES se aplican antes del cálculo. Una ficha elegida que quede fuera del universo conserva su identidad con cero filas y porcentajes y tiempos no evaluables. Al cambiar de archivo se reinicia la selección de fichas.

Las fichas no excluyen automáticamente el filtro global de su propia dimensión: si está seleccionada una empresa, las demás fichas pueden quedar vacías. Esto se explica en pantalla. El selector ofrece los elementos presentes; al no elegir ninguno se abre el de mayor brecha como punto de entrada, sin llamarlo peor proveedor.

No se ajustan las comparaciones por cartera de medicamentos, institución, tamaños de solicitud o plazos. Puntualidad no equivale a OTIF. Los denominadores y exclusiones de tiempos, cantidades y puntualidad acompañan la ficha. No se certifica recepción física, inventario ni desabasto clínico.

## Reproducción

Ejecutar `node scripts/check_profiles.cjs`. Exportar fichas JSON y reproducir con:

```powershell
node scripts/reproduce_profiles.cjs fichas.json
```

El script exige el mismo hash de suministro, reaplica el contexto y compara exactamente las fichas y sus desgloses. Si hay filtro municipal también comprueba los hashes del catálogo CLUES y geometría estatal. Un CSV local sin hash publicado requiere conservar el original y no se presenta como corte oficial reproducible con este script.

## Alcance pendiente

La persistencia y los cambios entre cortes requieren la Fase 5. Redes, Sankey, violin y análisis de concentración específicos de fichas no se incluyen en esta entrega; el módulo descriptivo existente conserva sus indicadores. La accesibilidad completa y el rendimiento móvil requieren la Fase 8. La publicación en GitHub Pages no se ha ejecutado.
