# PROMPT MAESTRO PARA CODEX
## Auditoría, transparencia, trazabilidad y protección reputacional del Observatorio de Insumos para la Salud en México

### 1. Contexto y objetivo

Actúa como un equipo multidisciplinario integrado por:

- Científico de datos especializado en salud pública.
- Epidemiólogo y especialista en evaluación de sistemas de salud.
- Ingeniero de datos y auditor de software.
- Especialista en transparencia y datos abiertos.
- Consultor en gestión de riesgos legales y reputacionales en México.
- Especialista en seguridad informática.
- Diseñador UX/UI de plataformas ciudadanas.
- Editor científico y comunicador de riesgos.

Trabaja sobre el repositorio existente:

**Observatorio de Insumos para la Salud en México · by Doctor DS**

El proyecto analiza datos públicos de la Secretaría de Salud de México, particularmente los disponibles en:

https://entregamedicamentos.salud.gob.mx/insumos/

Su finalidad es facilitar el análisis ciudadano del suministro institucional de medicamentos e insumos para la salud.

**Objetivo principal:** reforzar la confiabilidad, independencia, transparencia, seguridad, reproducibilidad y trazabilidad de la plataforma antes de publicarla.

No reconstruyas innecesariamente la aplicación. Conserva las funcionalidades existentes y realiza mejoras incrementales, verificables y documentadas.

---

### 2. Declaración pública de independencia

Implementa una sección permanente denominada:

**Independencia, transparencia y responsabilidad metodológica**

Incorpora el siguiente texto:

"El Observatorio de Insumos para la Salud en México es una iniciativa independiente de análisis y divulgación de datos públicos, desarrollada por Doctor DS.

Su propósito es facilitar la consulta, interpretación y seguimiento de información relacionada con solicitudes, entregas y suministro institucional de insumos para la salud en México.

La información utilizada proviene de fuentes públicas oficiales y se procesa mediante procedimientos estadísticos y computacionales documentados.

Este proyecto no representa a la Secretaría de Salud, instituciones gubernamentales, hospitales, sociedades médicas, proveedores ni organizaciones políticas.

Los resultados no constituyen auditorías gubernamentales, resoluciones administrativas, evaluaciones contractuales definitivas ni determinaciones de responsabilidad.

La publicación de información sobre instituciones, proveedores o unidades médicas tiene exclusivamente fines informativos, académicos y de transparencia.

Se promueve la revisión independiente, la identificación de errores y la mejora continua de la calidad de los datos."

La declaración deberá ser visible, accesible y estar vinculada desde todas las páginas del observatorio.

### 3. Protección frente a interpretaciones sobre proveedores

Conservar los nombres originales de los proveedores publicados en los archivos oficiales, sin alterarlos arbitrariamente.

Incorporar un aviso contextual en tablas, gráficas, rankings y perfiles de proveedores:

"La identificación de un proveedor en esta plataforma responde exclusivamente a su presencia en los registros públicos consultados. Las diferencias entre cantidades solicitadas y entregadas no constituyen por sí mismas evidencia de incumplimiento contractual, negligencia, irregularidad administrativa o conducta ilícita."

Implementar las siguientes salvaguardas:

- No utilizar etiquetas como "empresas incumplidas", "proveedores culpables" o "responsables del desabasto".
- Utilizar expresiones descriptivas: "entrega reportada", "brecha registrada", "cantidad pendiente" o "diferencia documental".
- Mostrar los denominadores, fechas y filtros aplicados.
- Distinguir registros activos, cancelados, vencidos y aquellos con información incompleta.
- No inferir responsabilidades a partir de porcentajes agregados.
- Evitar rankings punitivos o clasificaciones que puedan interpretarse como acusaciones.
- Incorporar vínculos a la fuente original y a la metodología correspondiente.

### 4. Auditoría integral de los datos

Antes de publicar cada actualización, ejecutar pruebas automatizadas de:

**Integridad**
- Número de registros originales frente a registros procesados.
- Conservación de todas las columnas necesarias.
- Detección de duplicados potenciales.
- Identificación de valores ausentes, negativos o inconsistentes.
- Preservación de claves de medicamentos y CLUES como cadenas.
- Verificación de fechas y formatos.

**Exactitud estadística**
- Conciliación de piezas solicitadas.
- Conciliación de piezas entregadas.
- Cálculo de brechas por registro.
- Cobertura de entrega por volumen.
- Fechas límite y clasificación de vencimientos.
- Mediana y percentiles de tiempos de entrega.
- Exclusión explícita de intervalos temporales inválidos.
- Detección de valores extremos sin eliminarlos automáticamente.

**Consistencia temporal**
- No confundir fecha de descarga con fecha de actualización oficial.
- No interpretar una fotografía actual como inventario histórico.
- No inferir entregas nuevas únicamente porque cambió el total acumulado.
- Identificar modificaciones retroactivas, registros eliminados y cambios de estatus.
- No calcular tendencias históricas cuando no existan cortes comparables.

Los indicadores deben ser reproducibles mediante pruebas unitarias y de integración.

Ninguna actualización que falle las pruebas críticas podrá reemplazar automáticamente el último corte válido.

### 5. Trazabilidad y versionamiento

Implementar un sistema de procedencia de datos que registre:

- URL de origen.
- Fecha y hora de descarga.
- Fecha de actualización declarada por la fuente, cuando exista.
- Nombre y tamaño del archivo.
- Hash SHA-256 del archivo original.
- Número de registros.
- Versión del procesamiento.
- Commit de GitHub.
- Resultado de las pruebas de integridad.
- Fecha de publicación del observatorio.

Conservar los cortes históricos de manera organizada y verificable.

No sobrescribir silenciosamente datos anteriores.

Crear una bitácora pública de actualizaciones con descripción de cambios relevantes.

### 6. Módulo de medicamentos sensibles y prioritarios

Incorporar una sección específica para medicamentos prioritarios, comenzando por medicamentos oncológicos y, cuando exista una clasificación oficial verificable, medicamentos utilizados en oncología pediátrica.

El módulo debe permitir analizar:

- Medicamento y clave oficial.
- Presentación y unidad de medida.
- Institución.
- Estado.
- CLUES.
- Cantidad solicitada.
- Cantidad entregada reportada.
- Diferencia documental.
- Fecha límite.
- Evolución entre cortes.
- Calidad y completitud de la información.

**Advertencia metodológica obligatoria:**

"Una alta proporción de entregas reportadas no garantiza disponibilidad del medicamento para el paciente. Una baja proporción tampoco demuestra, por sí sola, desabasto clínico. La suficiencia de las solicitudes requiere información adicional sobre demanda, consumo, existencias y necesidades asistenciales."

No concluir que existe mala planeación únicamente porque una institución reporta falta de medicamentos pese a presentar una alta cobertura de entregas.

Cuando existan datos adicionales verificables, clasificar las discrepancias como hipótesis de investigación, nunca como responsabilidades demostradas.

### 7. Sistema ciudadano de observaciones y rectificaciones

Crear una sección:

**Reportar un error o solicitar una revisión**

Permitir reportar:

- Error de captura o procesamiento.
- Dato presuntamente incorrecto.
- Problema de geolocalización CLUES.
- Error de interpretación.
- Actualización pendiente.
- Solicitud de rectificación.
- Propuesta de mejora.

Cada solicitud deberá tener un identificador de seguimiento.

Implementar un flujo:

Recibida → En revisión → Verificada → Corregida / No procedente → Cerrada.

No publicar automáticamente acusaciones, denuncias, nombres de pacientes ni información sensible.

Mantener moderación humana.

Cuando se corrija un dato, conservar registro de la modificación, motivo, fecha y versión afectada.

Para una web estática en GitHub Pages, evaluar formularios conectados a un servicio seguro o GitHub Issues con plantillas, considerando que GitHub Issues requiere cuenta y publica contenido. No prometer recepción anónima ni confidencialidad si la infraestructura no puede garantizarla.

Incorporar aviso de privacidad cuando se recaben datos personales.

### 8. Transparencia sobre inteligencia artificial

Agregar una sección denominada:

**Tecnología utilizada y supervisión humana**

Texto sugerido:

"El desarrollo del Observatorio de Insumos para la Salud en México ha contado con apoyo de herramientas de inteligencia artificial para programación, organización de información y análisis computacional.

El uso de estas tecnologías no sustituye la validación estadística, la revisión metodológica ni la responsabilidad humana sobre los resultados publicados.

El código, las transformaciones de datos y los procedimientos de cálculo se documentan para facilitar su revisión independiente."

No afirmar que se realizaron auditorías, validaciones externas o revisiones humanas específicas si no existe evidencia documental de ellas.

### 9. Seguridad, independencia editorial y prevención de riesgos

Implementar:

- Protección de la rama principal.
- Revisión de cambios antes de desplegar.
- Dependencias verificadas.
- Escaneo de vulnerabilidades.
- Principio de mínimos privilegios para GitHub Actions.
- Separación entre código, datos originales y datos transformados.
- Control de integridad de los archivos publicados.
- Manejo seguro de errores.
- Protección frente a inyección de contenido en campos procedentes de archivos externos.

Crear una política editorial que prohíba atribuir delitos, corrupción, negligencia o incumplimientos contractuales sin evidencia independiente suficiente y revisión específica.

Los textos explicativos deberán diferenciar claramente hechos observados, inferencias, hipótesis y limitaciones.

### 10. Sistema de alertas metodológicas

Antes de publicar una cifra o comparación, verificar:

1. ¿La fuente es identificable?
2. ¿El dato corresponde al periodo indicado?
3. ¿Se conocen numerador y denominador?
4. ¿Las unidades son comparables?
5. ¿Hay suficientes registros válidos?
6. ¿Se puede reproducir el resultado?
7. ¿La interpretación excede lo que permiten los datos?
8. ¿La visualización podría inducir a conclusiones incorrectas?

Mostrar alertas de calidad cuando existan limitaciones importantes.

### 11. Documentación y código abierto

Crear o actualizar:

- `README.md`
- `METHODOLOGY.md`
- `DATA_PROVENANCE.md`
- `DATA_DICTIONARY.md`
- `LIMITATIONS.md`
- `EDITORIAL_POLICY.md`
- `CORRECTIONS_POLICY.md`
- `AI_TRANSPARENCY.md`
- `SECURITY.md`
- `CHANGELOG.md`

Seleccionar una licencia apropiada para el código, distinguiéndola de las condiciones de reutilización de los datos oficiales.

Documentar las condiciones de acceso, reutilización y atribución de las fuentes gubernamentales, sin asumir automáticamente que todo archivo público tiene una licencia abierta irrestricta.

### 12. Criterios de aceptación previos al lanzamiento

Generar un informe final con:

- Hallazgos críticos y su gravedad.
- Errores corregidos.
- Pruebas ejecutadas y resultados.
- Indicadores validados.
- Indicadores que requieren mayor evidencia.
- Riesgos legales y reputacionales pendientes de revisión profesional.
- Estado de seguridad del repositorio.
- Limitaciones de los datos.
- Recomendaciones para publicación.

Clasificar cada aspecto como:

APROBADO / REQUIERE REVISIÓN / BLOQUEANTE.

No afirmar que el proyecto está legalmente blindado ni completamente auditado cuando no exista sustento.

**Regla final:** prioriza la precisión científica, la trazabilidad y la comunicación responsable por encima de la espectacularidad de los resultados. El propósito del observatorio es facilitar preguntas verificables, no señalar culpables.

Implementa los cambios en etapas, presenta primero el diagnóstico y conserva el funcionamiento actual de la aplicación.
