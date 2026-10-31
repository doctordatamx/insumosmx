# Diagnóstico previo a publicación — Auditoría, transparencia y trazabilidad

Fecha de revisión: **26 de octubre de 2026, México**. Etapa 0 solicitada en `PROMPT_AUDITORIA_TRANSPARENCIA.md`. Revisión técnica del checkout local, con pruebas automatizadas y consultas a fuentes primarias. **No es una auditoría externa, dictamen jurídico ni revisión humana especializada.**

## Dictamen de esta etapa

**BLOQUEANTE para habilitar publicación automática sin revisión.** El cálculo actual supera las pruebas ejecutadas y el archivo original concilia con el transformado; el control de publicación, la gobernanza y la documentación todavía no cumplen el nuevo encargo. Un resultado aprobado aquí se limita al criterio y universo evaluados.

No se modificaron indicadores, datos, snapshots ni comportamiento de la aplicación durante este diagnóstico. Se conserva la implementación existente para realizar cambios incrementales en las etapas siguientes.

## Hallazgos y evidencia

| ID | Aspecto | Estado | Gravedad / hallazgo | Evidencia y cierre necesario |
|---|---|---|---|---|
| D01 | Pruebas críticas antes de publicar | BLOQUEANTE | Crítica: ambos workflows construyen/publican sin ejecutar las pruebas estadísticas de la actualización candidata. Archivar valida estructura e integridad, no la exactitud de todos los indicadores. | `.github/workflows/pages.yml`, `refresh.yml`. Incorporar un gate reutilizable para cada candidato y para código; ningún despliegue debe omitirlo. |
| D02 | Actualización del último corte válido | BLOQUEANTE | Alta: `update_data.py` reemplaza la ruta activa y sus metadatos antes de un gate estadístico; el workflow remoto no hace commit si falla un paso posterior, pero la ejecución local puede dejar un candidato sin validar como activo. | `scripts/update_data.py`. Preparar en staging, validar y promover datos/metadatos/geografía juntos; probar fallos y recuperación. |
| D03 | Revisión de cambios y rama principal | REQUIERE REVISIÓN | Alta: la carpeta no es un repositorio Git (`git status` falla). No se verificaron remoto, branch protections, revisores, permisos o environments de GitHub. | Requiere URL y acceso al repositorio real. El refresco actual hace push a main; hay que armonizarlo con protección de rama mediante PR y comprobaciones obligatorias, evitando excepciones silenciosas. |
| D04 | Integridad del original frente al transformado | APROBADO | Alcance: corte local disponible. ZIP original de 60,977,608 bytes; SHA coincide con metadatos; 1,102,722 filas CSV no vacías = filas transformadas = metadatos; cero filas con ancho diferente de la cabecera. Están los 18 campos necesarios. | `diagnostico-auditoria-evidencia.json`. Esta comprobación no certifica que la fuente publique todo su universo. |
| D05 | Estadística y denominadores | APROBADO | Alcance: pruebas ejecutadas sobre el corte y fixtures. Brecha por registro, sobreentregas sin compensación, cantidades, vencimientos, mediana/P90, exclusión de tiempos negativos y conciliación por producto. | `check_analytics.cjs`, `check_supplier_products.cjs`; resultados más abajo. No es validación de recepción física ni cumplimiento contractual. |
| D06 | Señales robustas | APROBADO | Alcance: implementación contrastada con Python para MAD, medianas, n evaluable, señales y HHI. Señales no eliminan filas. | `check_lab_python.py`. Los umbrales siguen siendo exploratorios y no son límites contractuales ni pruebas de hipótesis. |
| D07 | Snapshots e integridad estática | APROBADO | Un corte real preservado; idempotencia y rechazo de archivos alterados pasan. El build actual tiene 40 archivos declarados, cero extras y cero diferencias de hash. | `verify_snapshots.py`, `check_snapshots.py`, `_site/build-manifest.json`. El constructor no limpia entradas antiguas: agregar verificación de archivos sobrantes como gate continuo. |
| D08 | Consistencia histórica e identidades | REQUIERE REVISIÓN | No hay evidencia de más de un corte real. Comparador distingue cambios netos, pero no puede identificar altas, bajas, modificaciones o cambios de estatus de una misma solicitud sin llave validada. | No inventar identificadores, persistencia clínica o entregas nuevas. Mantener estos resultados no evaluables hasta tener datos y correspondencia confiables. |
| D09 | Procedencia completa | REQUIERE REVISIÓN | Faltan en los metadatos de referencia nombre/tamaño fuente, versión de transformación, cabeceras originales, commit, resultado enlazado de integridad y fecha de publicación. La conversión nueva registra algunos de estos campos, pero no retroactivamente el corte preservado. | Evidencia JSON enumera los campos. Añadir un manifiesto de auditoría complementario; no reescribir el snapshot histórico. Fecha de publicación debe ser nula mientras no exista despliegue real. |
| D10 | Independencia y avisos de proveedores | REQUIERE REVISIÓN | Existe pie de independencia y advertencias parciales. Falta la sección permanente con el texto completo solicitado y aviso contextual uniforme en rankings, gráficas, tablas y perfiles. | No se encontraron las expresiones acusatorias prohibidas en las pantallas actuales inspeccionadas. `source-scripts.js` contiene terminología de la fuente, pero está excluido del build; no confundirlo con texto publicado. |
| D11 | Tecnología y supervisión humana | REQUIERE REVISIÓN | Falta la declaración pública de apoyo de IA y límites de supervisión. | Publicar el texto indicado y separar pruebas automatizadas / contraste de implementaciones de una revisión profesional externa que no consta. |
| D12 | Módulo de medicamentos prioritarios | REQUIERE REVISIÓN | No hay catálogo terapéutico validado unido a las claves. El texto fuente no constituye una clasificación oncológica o pediátrica. | Cotejar por clave, presentación y versión con compendio oficial; registrar fuente, hash y ambigüedades. Oncología pediátrica sólo con clasificación específica verificable. No inferir por nombre o prefijo de clave. |
| D13 | Rectificaciones y privacidad | BLOQUEANTE para afirmar recepción/seguimiento | Alta: no existe canal receptor, responsable operativo, moderación ni almacenamiento de solicitudes. | Definir servicio/canal y responsable. Un formulario local con UUID sería sólo borrador, no evidencia de recepción. Issues públicos no garantizan anonimato o confidencialidad. Prohibir datos de pacientes y acusaciones publicadas automáticamente. |
| D14 | Dependencias y seguridad | REQUIERE REVISIÓN | ExcelJS vendorizado con licencia MIT; falta inventario versionado verificable de dependencias transitivas y escaneo documentado. Actions usa etiquetas mutables. La revisión parcial observa uso de escape de HTML y neutralización CSV, pero no sustituye pruebas adversariales ni evaluación integral. | SHA actual de `vendor/exceljs.min.js`: `7e49da68588e250dbb8bba190d2caa8ab3787cc0284bda1d8b2f805c4df742c9`. No se afirma que el bundle esté libre de vulnerabilidades. Verificar upstream, fijar hashes, registrar escaneo y probar entradas maliciosas. |
| D15 | Política editorial, documentación y licencia | REQUIERE REVISIÓN | Faltan los documentos solicitados y licencia del código propio. La licencia de ExcelJS no licencia el observatorio ni los datos oficiales. | Crear políticas y documentos; seleccionar licencia de código separada de condiciones de cada fuente. Revisión profesional de privacidad, reutilización, nombres publicados y mecanismo de rectificación antes del lanzamiento. |

## Pruebas ejecutadas en esta etapa

| Comprobación | Resultado |
|---|---|
| Conciliación directa ZIP/CSV/JSON/metadatos | APROBADO: 1,102,722 registros y SHA del original coincidente |
| `node scripts/check_analytics.cjs` | APROBADO |
| `node scripts/check_supplier_products.cjs` | APROBADO |
| `python scripts/verify_snapshots.py` | APROBADO: un corte real |
| `python scripts/check_snapshots.py` | APROBADO: inmutabilidad, repetición, estructura y alteración; fixtures aisladas |
| `python scripts/check_lab_python.py` | APROBADO: 792,591 intervalos con z evaluable y 38,578 señales; HHI de todos los pares |
| Archivos en `_site` frente a manifiesto | APROBADO en esta revisión: 40 declarados, cero extras y cero hashes distintos |
| Branch protection, escaneo de vulnerabilidades y revisión externa | NO EJECUTADOS / NO VERIFICABLES con la evidencia disponible |

Referencia del universo activo al evaluar vencimientos el **2026-10-25**: solicitadas 2,566,801,175; entregadas reportadas 2,067,851,443; acreditables 2,067,635,723; brecha 499,165,452; vencida 409,486,132. Respuesta: mediana 12 días, P90 27, n=828,959; 911 intervalos negativos excluidos de tiempos y 6 filas con sobreentrega. Las filas duplicadas potenciales se conservan; no se presuponen errores o solicitudes únicas.

La prueba de PISA con todas las remisiones concilia 185 combinaciones de clave/descripción, 103,211 filas, 378,444,073 solicitadas y 79,317,099 pendientes. Ese universo es diferente del filtro inicial ACTIVA: no intercambiar cifras entre ambos.

## Datos y límites que requieren mayor evidencia

- Disponibilidad para pacientes, existencias, recetas no surtidas, consumo, demanda y suficiencia de solicitudes: no medidos.
- Recepción física, cumplimiento definitivo, responsabilidad o negligencia: no establecidos por estos registros.
- Clasificación oncológica pediátrica, presentación/unidad estructurada y equivalencias de tratamientos: pendientes de correspondencia oficial validada.
- Persistencia mensual, tendencias entre snapshots e identificación de cambios de una misma solicitud: no verificables con una única línea base y sin llave confiable.
- La fecha de actualización oficial del corte no está documentada: no sustituirla por descarga, evaluación o última fecha de solicitud.
- Cobertura CLUES parcial y versión histórica del catálogo: mantener la advertencia y las exclusiones de coordenadas ya implementadas.

## Etapas de implementación propuestas

1. **Comunicación y gobernanza públicas:** sección permanente de independencia con texto íntegro, aviso contextual de proveedores, transparencia IA, política editorial, límites y enlaces desde todas las vistas. Conservar nombres fuente y métricas.
2. **Gate y trazabilidad:** staging validado, promoción sólo tras pruebas críticas, manifiestos de auditoría complementarios, bitácora pública, verificación del build completo y pruebas de regresión/fallos. No modificar silenciosamente el histórico.
3. **Seguridad y operación de GitHub:** identificar el repositorio, configurar revisión de PR, checks requeridos y permisos mínimos; adaptar la actualización para no eludir protección de main; inventario, hashes y escaneo de dependencias y acciones.
4. **Medicamentos prioritarios:** verificar el catálogo oficial y correspondencias, publicar cobertura/ambigüedades y advertencia obligatoria. Mantener pediatría no evaluable donde falte evidencia específica.
5. **Observaciones y rectificaciones:** canal definido con responsable, privacidad y moderación. Estados de seguimiento sólo cuando realmente se sostengan operativamente; bitácora de correcciones sin acusaciones ni datos sensibles.
6. **Aceptación de lanzamiento:** repetir pruebas del candidato, revisión profesional pendiente y matriz APROBADO / REQUIERE REVISIÓN / BLOQUEANTE con evidencia y responsable de cierre. No afirmar blindaje legal ni auditoría completa.

## Fuentes primarias para las siguientes etapas

- [GitHub: ramas protegidas y comprobaciones](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): capacidades disponibles que deben configurarse y comprobarse en el repositorio real; un YAML no demuestra esa configuración.
- [GitHub: entornos y protección de despliegues](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments): separar configuración de entorno de un despliegue efectivamente revisado.
- [Consejo de Salubridad General: Compendio Nacional](https://www.gob.mx/csg/acciones-y-programas/compendio-nacional-de-insumos-para-la-salud): punto de partida oficial; aún no se ha verificado ni incorporado una correspondencia oncológica en esta etapa.
- [Cámara de Diputados: LFPDPPP](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf): fuente normativa para la revisión profesional del futuro tratamiento de datos personales. Este diagnóstico no determina por sí solo obligaciones aplicables, licencias o validez jurídica de un canal.

Las consultas bibliográficas no equivalen a verificación completa de catálogos, cumplimiento normativo ni auditoría de GitHub.
