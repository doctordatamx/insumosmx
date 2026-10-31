# Diccionario del corte público · 18 campos

Esquema comprobado contra el CSV original y el gzip. Los nombres de establecimientos, proveedores e instituciones son valores de la fuente; no se presuponen homologados. Las fechas esperadas son ISO `AAAA-MM-DD`; el motor valida fechas de calendario antes de calcular intervalos.

| Campo público | Tipo lógico | Campo original | Uso y limitaciones |
|---|---|---|---|
| clave | texto | clave | Identificador publicado; no implica clasificación terapéutica validada |
| descripcion | texto | descripcion | Descripción/presentación, conservada sin reclasificar |
| institucion | texto | institucion | Institución solicitante reportada |
| entidad | texto | entidad | Entidad federativa reportada; sin geocodificación |
| estatus | texto | estatus | Categoría de entrega de la fuente; independiente de inferencias clínicas |
| nombre_proveedor | texto | proveedor | Nombre publicado, sin resolver identidades jurídicas o cambios de razón social |
| fecha_solicitud | fecha/texto | fecha_solicitud | Delimita filtros temporales del universo |
| fecha_entrega | fecha/texto | fecha_entrega | Fecha registrada; no demuestra primera entrega ni entrega completa |
| fecha_limite | fecha/texto | fecha_limite | Define vencimiento frente al corte de evaluación |
| piezas_solicitadas | número/null | piezas_solicitadas | Volumen logístico; no dosis/tratamientos comparables entre claves |
| piezas | número/null | piezas_entregadas | Entrega reportada; no certifica recepción física |
| canceladas_activas | texto | canceladas_activas | Remisión activa/cancelada; inicial ACTIVA |
| clues | texto | clues | Identificador reportado, sin verificación contra catálogo en Fase 1 |
| unidad_medica | texto | unidad_medica | Establecimiento/destino reportado; no se presupone relación uno-a-uno con CLUES |
| suministro | texto | suministro | No es identificador único de fila validado |
| tipo_procedimiento_1 | texto | tipo_procedimiento_1 | Clasificación de compra de la fuente |
| licitacion | texto | licitacion | Procedimiento reportado, sin datos de monto |
| contrato | texto | contrato | Referencia publicada; no valida contrato único o condiciones contractuales |

En gzip los campos de texto/fecha están codificados por índices en `dictionaries` y cada fila tiene exactamente el orden de `metadata.fields`. Los dos campos numéricos permanecen como valores, no usan diccionarios. El archivo ZIP original se mantiene localmente ignorado por Git; no hay todavía un archivo raw inmutable por cada recuperación.
