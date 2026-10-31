# Diccionario de datos

Los 18 campos conservados del archivo procesado. Los valores textuales se almacenan internamente por diccionario; los índices comprimidos no son identificadores del mundo real ni se trasladan entre cortes. Los CSV y vistas decodifican las cadenas.

| Campo | Tipo lógico | Significado y límites |
|---|---|---|
| `clave` | Cadena | Clave publicada del insumo; conservar ceros y puntuación. No equivale por sí sola a clasificación terapéutica validada. |
| `descripcion` | Cadena | Descripción original del producto; puede contener presentación y envase en texto, sin campos estructurados homologados. |
| `institucion` | Cadena | Nombre institucional reportado, sin homologación jurídica automática. |
| `entidad` | Cadena | Entidad reportada. El vínculo geográfico usa alias explícitos documentados. |
| `estatus` | Cadena | Estatus publicado de la fila; no es una resolución de cumplimiento contractual. |
| `nombre_proveedor` | Cadena | Nombre del proveedor publicado. No certifica identidad jurídica ni responsabilidad. |
| `fecha_solicitud` | Fecha / texto | Fecha de solicitud; formatos reconocidos se normalizan a ISO. Se preserva texto no reconocido para control de calidad. |
| `fecha_entrega` | Fecha / texto | Fecha de entrega reportada; no demuestra primera recepción, entrega completa o recepción física. |
| `fecha_limite` | Fecha / texto | Fecha límite publicada, usada para evaluar pendiente vencida; no certifica términos contractuales. |
| `piezas_solicitadas` | Número o ausente | Cantidad solicitada. Se exige finitud y no negatividad junto con entregadas para métricas de volumen. |
| `piezas` | Número o ausente | Cantidad entregada reportada. Puede superar solicitadas; la sobreentrega no compensa otras filas. |
| `canceladas_activas` | Cadena | Remisión activa/cancelada según fuente. Se conserva y se filtra explícitamente. |
| `clues` | Cadena | Identificador publicado de establecimiento; preservar ceros, guiones y sufijos. No imputar ni asumir coincidencia en catálogo. |
| `unidad_medica` | Cadena | Nombre de unidad médica reportada; puede diferir del catálogo CLUES. |
| `suministro` | Cadena | Valor fuente; no se presupone identificador único ni llave para enlazar cortes. |
| `tipo_procedimiento_1` | Cadena | Tipo de procedimiento/compra publicado, sin inferir calificación jurídica. |
| `licitacion` | Cadena | Referencia de licitación publicada; no demuestra validez ni unicidad contractual. |
| `contrato` | Cadena | Referencia de contrato publicada; no se interpreta como identificador único de fila. |

No hay campos fuente verificados de inventario, dosis/tratamientos equivalentes, clasificación oncológica pediátrica, demanda, consumo, precio o pacientes afectados. Los derivados y sus denominadores se documentan en METHODOLOGY.md y en el catálogo operacional descargable.
