# PROMPT MAESTRO PARA CODEX
# OBSERVATORIO DE INSUMOS PARA LA SALUD EN MÉXICO
## by Doctor DS

**Versión del proyecto:** 3.0  
**Tipo:** Plataforma pública de inteligencia de datos, investigación y vigilancia del suministro institucional de insumos para la salud en México.  
**Fuente principal:** https://entregamedicamentos.salud.gob.mx/insumos/  
**Modalidad:** Open source, actualización mensual, despliegue web estático y análisis reproducible.

---

# 1. MISIÓN GENERAL

Actúa como un equipo multidisciplinario senior integrado por:

- Arquitecto de software especializado en aplicaciones de datos.
- Ingeniero de datos y especialista en pipelines ETL/ELT.
- Científico de datos con experiencia en análisis longitudinal, aprendizaje automático y estadística aplicada.
- Epidemiólogo especializado en sistemas de salud.
- Especialista en gestión y suministro farmacéutico.
- Experto en georreferenciación sanitaria, GIS y CLUES.
- Estadístico con experiencia en inferencia, análisis multinivel y series temporales.
- Desarrollador frontend senior.
- Diseñador UX/UI especializado en visualización científica.
- Especialista en datos abiertos, transparencia y periodismo de datos.
- Ingeniero de calidad, pruebas automatizadas y CI/CD.

Tu objetivo es transformar el repositorio existente en una plataforma científica, moderna, funcional, altamente interactiva, reproducible y escalable.

El producto se denominará oficialmente:

**Observatorio de Insumos para la Salud en México**

**by Doctor DS**

Su propósito es analizar el suministro institucional de medicamentos, material de curación y otros insumos para la salud mediante datos públicos oficiales.

Debe permitir responder:

1. ¿Qué insumos se solicitan?
2. ¿Cuántas piezas se solicitan?
3. ¿Cuántas se reportan entregadas?
4. ¿Cuántas permanecen pendientes?
5. ¿Cuántas presentan vencimientos?
6. ¿Dónde se concentran las brechas?
7. ¿Qué instituciones presentan mayores pendientes?
8. ¿Qué proveedores están relacionados con esas solicitudes?
9. ¿Qué claves concentran mayor volumen pendiente?
10. ¿Cómo evolucionan los registros y las entregas?
11. ¿Qué establecimientos pueden identificarse mediante CLUES?
12. ¿Qué diferencias existen entre entidades, instituciones y proveedores?
13. ¿Qué patrones estadísticos aparecen?
14. ¿Qué anomalías merecen revisión?
15. ¿Qué indicadores pueden anticipar riesgos logísticos?
16. ¿Qué tan confiables y completos son los datos publicados?

No quiero una página que simplemente presente gráficas.

Quiero un **observatorio científico de datos públicos**, con capacidad de exploración, análisis, comparación, investigación, vigilancia longitudinal y divulgación.

---

# 2. PRINCIPIOS INNEGOCIABLES

El proyecto deberá cumplir estos principios:

**Rigor científico.** Cada indicador debe contar con definición operacional, fórmula, denominador, unidad, limitaciones y trazabilidad.

**Transparencia.** Todos los resultados deben poder relacionarse con su fuente y corte correspondiente.

**Reproducibilidad.** Una persona debe poder reconstruir los indicadores mediante el código y los archivos publicados.

**Independencia.** El observatorio no debe presentarse como portal gubernamental ni insinuar afiliación oficial.

**Integridad de los datos.** Nunca modificar registros originales para producir resultados visualmente más atractivos.

**Escalabilidad.** Debe admitir millones de registros y múltiples cortes mensuales.

**Accesibilidad.** Orientar la interfaz a WCAG 2.2 AA, con pruebas verificables.

**Interpretabilidad.** Los resultados estadísticos y predictivos deben poder explicarse.

**Responsabilidad metodológica.** No confundir incumplimiento logístico con desabasto clínico.

**Evolución incremental.** No destruir ni sustituir el sistema funcional hasta validar su reemplazo.

---

# 3. AUDITORÍA INICIAL DEL REPOSITORIO

Antes de escribir código nuevo, inspecciona todo el proyecto existente.

Revisa:

- `index.html`
- `styles.css`
- `app.js`
- `analytics.js`
- `README.md`
- Scripts de actualización.
- Scripts de verificación.
- Workflows de GitHub Actions.
- Archivos de metadatos.
- Archivos comprimidos de datos.
- Dependencias.
- Capturas y representaciones HTML, cuando estén disponibles.
- Documentación metodológica.

Identifica los componentes reutilizables.

Analiza especialmente el motor estadístico existente.

El proyecto actual conserva 18 campos:

1. `clave`
2. `descripcion`
3. `institucion`
4. `entidad`
5. `estatus`
6. `nombre_proveedor`
7. `fecha_solicitud`
8. `fecha_entrega`
9. `fecha_limite`
10. `piezas_solicitadas`
11. `piezas`
12. `canceladas_activas`
13. `clues`
14. `unidad_medica`
15. `suministro`
16. `tipo_procedimiento_1`
17. `licitacion`
18. `contrato`

Comprueba su presencia y significado en el archivo real antes de utilizarlos.

No presupongas que `suministro`, `contrato` o cualquier combinación de columnas constituye un identificador único.

El corte de referencia contiene:

- 1,102,722 registros totales.
- 1,002,426 registros activos.
- 2,566,801,175 piezas solicitadas.
- 2,067,851,443 piezas entregadas reportadas.
- Cobertura acreditable: 80.553%.
- Brecha pendiente: 499,165,452 piezas.
- Brecha vencida al 25/10/2026: 409,486,132 piezas.
- Mediana de respuesta: 12 días.
- Percentil 90: 27 días.

Estos valores son referencias de regresión del corte original, no constantes que deban incorporarse al código.

La base contiene registros idénticos adicionales y fechas inconsistentes que deben conservarse y auditarse.

Genera `AUDITORIA_INICIAL.md` antes de comenzar la migración.

---

# 4. IDENTIDAD VISUAL Y EXPERIENCIA DE USUARIO

## 4.1 Nombre oficial

Utiliza:

**Observatorio de Insumos para la Salud en México**

Subtítulo:

**Inteligencia de datos para comprender el suministro institucional de insumos para la salud.**

Firma:

**by Doctor DS**

No utilizar FAARMA como nombre visible del nuevo producto.

Conserva referencias históricas únicamente cuando sean necesarias para documentar la migración.

## 4.2 Diseño

Construye una aplicación moderna de estilo científico-editorial.

Debe transmitir:

- Confianza.
- Precisión.
- Claridad.
- Profesionalismo.
- Innovación.
- Transparencia.
- Facilidad de exploración.

Evita el diseño gubernamental tradicional, la saturación visual y los gráficos meramente decorativos.

### Paleta sugerida

- Azul profundo: `#142D4E`
- Azul principal: `#2563EB`
- Turquesa: `#0F766E`
- Ámbar: `#D97706`
- Rojo semántico: `#C2413B`
- Gris claro: `#F7F9FC`
- Texto principal: `#172033`
- Blanco: `#FFFFFF`

El sistema debe soportar modo claro y oscuro.

## 4.3 Estructura visual

Implementa:

- Sidebar plegable.
- Encabezado con identidad Doctor DS.
- Buscador global.
- Filtros persistentes.
- Tarjetas de indicadores.
- Mapas interactivos.
- Gráficos enlazados.
- Tablas virtualizadas.
- Tooltips metodológicos.
- Paneles laterales de detalle.
- Comparadores.
- Exportaciones.
- Diseño responsive.

En dispositivos móviles, utiliza navegación compacta y filtros desplegables.

---

# 5. ARQUITECTURA DE LA PLATAFORMA

Organiza la aplicación en estos módulos:

1. Panorama nacional.
2. Atlas geográfico del suministro.
3. Medicamentos y claves.
4. Instituciones.
5. Proveedores.
6. Contratos y procedimientos.
7. Evolución temporal.
8. Brechas y vencimientos.
9. Laboratorio de ciencia de datos.
10. Inteligencia predictiva.
11. Explorador de registros.
12. Calidad de datos.
13. Metodología y fuentes.
14. Actualizaciones e histórico.

Cada módulo debe tener una ruta propia y compartir filtros globales.

Las vistas deben ser enlazables mediante URL.

---

# 6. STACK TECNOLÓGICO

Utiliza preferentemente:

**Frontend**
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui.
- TanStack Table.
- TanStack Virtual.

**Visualización**
- Apache ECharts.
- D3.js para visualizaciones especializadas.
- MapLibre GL JS.
- GeoJSON y PMTiles cuando sean adecuados.

**Datos**
- Python.
- Polars.
- DuckDB.
- Apache Parquet.
- PyArrow.

**Ciencia de datos**
- NumPy.
- SciPy.
- statsmodels.
- scikit-learn.
- lifelines.
- GeoPandas.
- PySAL.
- NetworkX.
- LightGBM, únicamente cuando exista justificación predictiva.

**Automatización**
- GitHub Actions.
- Scripts Python reproducibles.
- Control de versiones.
- Manifiestos de cortes.

**Pruebas**
- Vitest.
- Playwright.
- pytest.

El sitio público debe funcionar sin backend obligatorio, cuentas, servicios de pago ni claves privadas.

Las tareas costosas deben ejecutarse previamente en el pipeline y publicar agregados optimizados.

---

# 7. PANORAMA NACIONAL

Diseña una portada ejecutiva que permita comprender el estado general del suministro.

## Indicadores principales

- Registros analizados.
- Piezas solicitadas.
- Piezas entregadas reportadas.
- Cobertura acreditable.
- Brecha pendiente.
- Brecha relativa.
- Brecha vencida.
- Proporción de registros con entrega completa.
- Proporción de registros sin entrega reportada.
- Mediana de respuesta.
- Percentil 90.
- Proveedores representados.
- Instituciones representadas.
- Claves distintas.
- CLUES identificadas y verificadas.

Añade:

- Evolución temporal.
- Ranking de entidades.
- Ranking de proveedores.
- Ranking de claves.
- Mapa nacional.
- Distribución de vencimientos.
- Resumen de calidad.

Permite seleccionar cualquier indicador y abrir un análisis detallado.

Cada tarjeta debe mostrar definición, denominador y corte.

---

# 8. INDICADORES DE CIENCIA DE DATOS

Implementa un catálogo formal de indicadores.

## 8.1 Cumplimiento

### Cobertura acreditable

`Σ min(piezas_entregadas, piezas_solicitadas) / Σ piezas_solicitadas válidas`

### Brecha pendiente

`Σ max(piezas_solicitadas - piezas_entregadas, 0)`

### Brecha relativa

`Brecha pendiente / piezas solicitadas válidas`

### Brecha vencida

Piezas pendientes con fecha límite válida anterior al corte de evaluación.

### Cumplimiento por registro

Porcentaje de registros con cantidad entregada igual o superior a la solicitada, entre registros elegibles con cantidad solicitada positiva.

### Entrega nula reportada

Porcentaje de registros elegibles con cantidad entregada igual a cero.

### Puntualidad registrada

Proporción de registros con fecha de entrega no posterior a la fecha límite, dentro del universo con fechas válidas.

No denominar OTIF a este indicador.

## 8.2 Tiempos

Calcular:

- Mediana.
- P75.
- P90.
- P95.
- Rango intercuartílico.
- Distribución de tiempos.
- Proporción de fechas inválidas.
- Antigüedad de pendientes vencidos.

No asumir que una fecha de entrega representa entrega completa o primera entrega.

## 8.3 Concentración

Implementar:

- HHI por clave e institución.
- Participación de principales proveedores.
- Índice de Gini.
- Entropía de Shannon.
- Concentración de claves.
- Dependencia de proveedor único.
- Diversidad de proveedores.

Explicar que concentración no equivale automáticamente a falta de competencia.

## 8.4 Variabilidad

Calcular:

- Desviación estándar cuando sea apropiada.
- Coeficiente de variación.
- Mediana y desviación absoluta mediana.
- Percentiles.
- Dispersión entre proveedores.
- Variabilidad entre instituciones.
- Variabilidad territorial.

Evitar interpretar la variabilidad sin considerar volumen y composición.

## 8.5 Persistencia

Cuando exista histórico confiable:

- Meses consecutivos con brecha observada.
- Persistencia por clave.
- Persistencia por institución.
- Persistencia por proveedor.
- Persistencia territorial.
- Cambios en la magnitud de pendientes.
- Tasa de resolución entre cortes comparables.

No asumir que filas semejantes representan la misma solicitud.

---

# 9. ATLAS GEOGRÁFICO

Implementa un módulo GIS completo.

## Niveles

México → estado → municipio → CLUES.

## Catálogo CLUES

Buscar e integrar catálogos oficiales verificables.

Validar:

- Identificador CLUES.
- Nombre de establecimiento.
- Institución.
- Entidad.
- Municipio.
- Localidad.
- Latitud.
- Longitud.
- Estatus de establecimiento, si existe.
- Fecha o versión del catálogo.

Nunca inventar coordenadas.

No georreferenciar una solicitud a nivel de establecimiento cuando sólo exista información estatal.

## Visualizaciones

- Coroplético estatal.
- Coroplético municipal.
- Mapa de establecimientos.
- Clustering de marcadores.
- Hexbin.
- Mapas de densidad, con interpretación apropiada.
- Comparación territorial.
- Mapas bivariados.
- Animaciones temporales.
- Small multiples.
- Mapas LISA, cuando sean metodológicamente válidos.

## Estadística espacial

Incorporar:

- Moran's I global.
- Moran's I local.
- LISA.
- Análisis de agrupamientos espaciales.
- Sensibilidad a matrices de vecindad.
- Pruebas de permutación.
- Corrección de pruebas múltiples cuando corresponda.

Documentar el problema de unidad espacial modificable (MAUP).

Mostrar porcentaje de registros georreferenciados y no georreferenciados.

---

# 10. OBSERVATORIO DE MEDICAMENTOS Y CLAVES

Implementa un buscador especializado.

Permitir búsqueda por:

- Clave.
- Descripción.
- Nombre genérico, si existe correspondencia validada.
- Presentación.
- Grupo terapéutico, si existe catálogo verificable.
- Institución.
- Proveedor.
- Estado.
- CLUES.

Cada clave debe tener una ficha individual.

## Ficha de clave

Mostrar:

- Descripción.
- Presentación.
- Clasificación.
- Cantidad solicitada.
- Cantidad entregada.
- Cobertura.
- Brecha.
- Brecha vencida.
- Instituciones.
- Proveedores.
- Distribución territorial.
- Evolución temporal.
- Persistencia entre cortes.
- Registros originales.

Incluir comparador de hasta cuatro claves.

No sumar presentaciones distintas como si fueran tratamientos equivalentes.

Clasificar medicamentos, material de curación y otros insumos sólo mediante categorías verificadas.

---

# 11. OBSERVATORIO DE PROVEEDORES

Crear perfiles individuales de proveedores.

## Indicadores

- Piezas solicitadas.
- Piezas entregadas.
- Cobertura.
- Brecha.
- Brecha vencida.
- Tiempos de respuesta.
- Puntualidad registrada.
- Instituciones atendidas.
- Claves suministradas.
- Entidades relacionadas.
- Contratos y procedimientos presentes.
- Evolución histórica.

## Visualizaciones

- Scatter plot de volumen frente a cobertura.
- Bubble chart multidimensional.
- Boxplot de tiempos.
- Violin plot.
- Heatmap proveedor-clave.
- Sankey proveedor-institución.
- Red bipartita.
- Ranking por brecha absoluta.
- Ranking por brecha relativa.
- Evolución entre cortes.

Incorporar comparación múltiple.

No crear clasificaciones de mejores o peores proveedores sin explicar volumen, cartera de productos, plazos y cobertura de datos.

---

# 12. CONTRATOS Y PROCEDIMIENTOS

Aprovecha los campos:

- `contrato`
- `licitacion`
- `tipo_procedimiento_1`
- `suministro`

Desarrolla:

- Explorador de contratos.
- Comparación por tipo de procedimiento.
- Desempeño por contrato.
- Concentración de proveedores.
- Relaciones entre institución, proveedor, clave y contrato.
- Distribución de brechas.
- Variabilidad en cumplimiento.
- Evolución temporal.

Si no existen montos, precios o condiciones contractuales suficientes, no inventarlos.

La vinculación con otras fuentes públicas debe documentar claves de emparejamiento, confianza y cobertura.

---

# 13. VISUALIZACIONES AVANZADAS

Desarrolla un catálogo de visualizaciones científicas.

## Obligatorias

1. Barras horizontales ordenables.
2. Series temporales.
3. Áreas apiladas cuando exista una composición válida.
4. Heatmaps.
5. Scatter plots.
6. Bubble charts.
7. Histogramas.
8. Boxplots.
9. Violin plots.
10. Curvas de distribución acumulada.
11. Sankey.
12. Redes de proveedores.
13. Treemaps.
14. Mapas coropléticos.
15. Mapas de establecimientos.
16. Matrices de comparación.
17. Gráficos de antigüedad.
18. Small multiples.

## Condicionadas a validación

19. Curvas Kaplan–Meier.
20. Mapas LISA.
21. Diagramas de control estadístico.
22. Pronósticos con intervalos.
23. Gráficos SHAP.
24. Comparaciones ajustadas por modelos multinivel.

Cada visualización debe incluir:

- Pregunta que responde.
- Universo analizado.
- Unidad.
- Denominador.
- Escala.
- Filtros activos.
- Fecha del corte.
- Tooltip.
- Leyenda.
- Alternativa accesible.
- Exportación PNG/SVG cuando sea posible.
- Exportación CSV de datos subyacentes.

No crear gráficos redundantes sólo por cumplir una lista.

---

# 14. LABORATORIO DE CIENCIA DE DATOS

Crear una sección denominada:

**Laboratorio de Datos**

Debe permitir seleccionar:

- Variables.
- Institución.
- Entidad.
- Proveedor.
- Clave.
- Periodo.
- Tipo de análisis.

## Herramientas estadísticas

### Descriptivas

- Distribuciones.
- Percentiles.
- Medidas robustas.
- Tablas de contingencia.
- Análisis de concentración.

### Asociaciones

- Correlaciones Pearson y Spearman cuando correspondan.
- Modelos de regresión.
- Regresión logística.
- Modelos multinivel.
- Comparaciones ajustadas.

### Temporales

- Tendencias.
- Descomposición temporal cuando sea identificable.
- Detección de cambios estructurales.
- Comparación de cortes.
- Análisis de persistencia.

### Redes

- Grafos proveedor-institución.
- Grafos proveedor-clave.
- Centralidad.
- Comunidades.
- Dependencia estructural.

### Anomalías

- Reglas determinísticas.
- Z-scores robustos.
- Isolation Forest.
- Detección de cambios abruptos.

Cada análisis debe generar un reporte reproducible.

No mostrar significancia estadística sin especificar supuestos y procedimiento.

---

# 15. INTELIGENCIA PREDICTIVA

Implementar una arquitectura preparada para modelos predictivos, pero no entrenar modelos sin datos adecuados.

## Modelos candidatos

### Riesgo de vencimiento

Modelos posibles:

- Regresión logística.
- LightGBM.
- Random Forest.

### Tiempo hasta entrega

- Kaplan–Meier.
- Cox.
- Modelos de supervivencia.

Utilizar solamente si se verifica el evento, su fecha y la censura.

### Persistencia de brechas

- Modelos longitudinales.
- Clasificación temporal.
- Modelos jerárquicos.

### Pronóstico agregado

- Modelos de series temporales.
- Regresión con variables temporales.
- Métodos de pronóstico comparados contra modelos base.

## Validación

Exigir:

- Separación temporal entrenamiento-prueba.
- Prevención de fuga de información.
- Validación retrospectiva.
- Calibración.
- Brier score.
- Precision-recall.
- MAE y RMSE cuando correspondan.
- Intervalos predictivos.
- Análisis por institución.
- Documentación de limitaciones.

Nunca publicar una probabilidad como resultado validado sin evaluación empírica.

---

# 16. ÍNDICE DE PRIORIDAD LOGÍSTICA

Diseña un índice exploratorio denominado:

**Índice de Prioridad Logística de Insumos — IPLI**

Dimensiones candidatas:

- Brecha relativa.
- Brecha vencida.
- Antigüedad.
- Persistencia.
- Concentración de proveedores.

El índice debe:

- Tener escala interpretable.
- Permitir modificar pesos.
- Mostrar fórmula.
- Explicar normalización.
- Manejar datos faltantes.
- Realizar análisis de sensibilidad.
- Mostrar contribución de cada dimensión.

No presentarlo como escala clínica validada.

La importancia clínica de un medicamento sólo podrá incorporarse mediante una clasificación externa documentada.

---

# 17. MOTOR DE ANOMALÍAS

Implementa un sistema de vigilancia de calidad y comportamiento estadístico.

Detectar:

- Cantidades negativas.
- Fechas imposibles.
- Entregas anteriores a solicitudes.
- Sobreentregas.
- Registros idénticos.
- CLUES inexistentes.
- Claves sin correspondencia.
- Cambios bruscos entre cortes.
- Variaciones extraordinarias.
- Concentraciones inusuales.
- Inconsistencias entre instituciones y establecimientos.

Cada anomalía debe tener:

- Identificador.
- Tipo.
- Regla o modelo.
- Gravedad técnica.
- Fecha.
- Registros relacionados.
- Explicación.
- Estado de revisión.

No denominar fraude, robo o corrupción a una anomalía estadística.

---

# 18. ACTUALIZACIÓN MENSUAL

El observatorio debe poder actualizarse mediante los archivos oficiales.

## Pipeline

1. Descargar archivo oficial o recibir carga manual.
2. Conservar original.
3. Registrar URL y fecha.
4. Calcular SHA-256.
5. Validar esquema.
6. Validar cantidades.
7. Validar fechas.
8. Normalizar columnas.
9. Conservar valores originales.
10. Integrar catálogos CLUES.
11. Integrar catálogos de claves.
12. Generar Parquet.
13. Generar agregados.
14. Calcular indicadores.
15. Comparar cortes.
16. Detectar anomalías.
17. Ejecutar pruebas.
18. Generar manifiesto.
19. Publicar datos optimizados.
20. Desplegar aplicación.

## Histórico

Cada corte debe ser inmutable.

Registrar:

- Fecha de recuperación.
- Fecha declarada por fuente, si existe.
- Hash.
- Número de registros.
- Cambios de esquema.
- Número de claves.
- Número de proveedores.
- Número de instituciones.
- Cobertura de CLUES.
- Anomalías.
- Versión del pipeline.

La comparación entre cortes debe distinguir altas, bajas, modificaciones y registros sin cambios únicamente cuando exista identificación suficientemente confiable.

No sumar archivos acumulativos como si fueran observaciones mensuales independientes.

## Automatización

Crear workflow mensual de GitHub Actions y ejecución manual.

Si falla una validación, conservar el último corte publicado.

Evitar publicar archivos incompletos.

Mantener logs y reportes de ejecución.

---

# 19. ARQUITECTURA DE DATOS

Organizar los datos en capas:

**Raw:** archivos originales inmutables.

**Staging:** datos normalizados y validados.

**Curated:** datos enriquecidos con catálogos.

**Analytics:** agregaciones e indicadores.

**Public:** archivos optimizados para la web.

Separar:

- Dimensión tiempo.
- Dimensión institución.
- Dimensión proveedor.
- Dimensión clave.
- Dimensión geográfica.
- Dimensión CLUES.
- Dimensión contrato.
- Hechos de suministro.
- Metadatos de cortes.

Evitar duplicación innecesaria.

Utilizar particiones y compresión apropiadas.

No descargar el universo completo en cada cambio de filtro cuando puedan utilizarse agregados.

---

# 20. RENDIMIENTO

El proyecto debe manejar millones de registros.

Requisitos:

- Carga diferida.
- Web Workers.
- Agregaciones precalculadas.
- Virtualización.
- Caché controlada.
- Compresión.
- Procesamiento por lotes.
- Consultas optimizadas.
- Reducción de memoria.
- Renderizado progresivo.

Medir:

- Tiempo inicial de carga.
- Tiempo de interacción.
- Consumo de memoria.
- Tamaño transferido.
- Tiempo de filtrado.
- Tiempo de actualización.
- Rendimiento móvil.

No afirmar cumplimiento sin benchmarks.

---

# 21. INTERACTIVIDAD GLOBAL

Todas las visualizaciones deben compartir un estado de filtros.

Ejemplo:

Al seleccionar Nuevo León en el mapa:

- Actualizar KPIs.
- Actualizar proveedores.
- Actualizar claves.
- Actualizar instituciones.
- Actualizar tendencias.
- Actualizar tablas.
- Actualizar indicadores de calidad.

Al seleccionar una clave:

- Mostrar distribución geográfica.
- Mostrar proveedores.
- Mostrar instituciones.
- Mostrar evolución.
- Mostrar registros.

Permitir:

- Comparaciones múltiples.
- Restablecer filtros.
- Deshacer selecciones.
- Compartir URL.
- Descargar resultados.
- Guardar vistas mediante URL.
- Mostrar denominadores.
- Consultar metodología.

---

# 22. CALIDAD DE DATOS

Crear un módulo completo de calidad.

Indicadores:

- Completitud.
- Validez.
- Consistencia.
- Unicidad evaluable.
- Integridad referencial.
- Actualidad del corte.
- Cobertura geográfica.
- Cobertura de catálogos.
- Trazabilidad.

Mostrar indicadores de calidad globales y por institución.

No eliminar automáticamente duplicados aparentes.

Conservar las reglas originales de exclusión.

Implementar pruebas de sensibilidad que permitan comparar resultados con distintos criterios de tratamiento, manteniendo intacta la versión principal.

---

# 23. METODOLOGÍA CIENTÍFICA

Cada indicador debe incluir:

- Nombre.
- Objetivo.
- Definición operacional.
- Fórmula.
- Numerador.
- Denominador.
- Unidad.
- Campos utilizados.
- Universo.
- Exclusiones.
- Fecha.
- Interpretación.
- Limitaciones.
- Código de cálculo.

Separar:

**Datos observados:** valores de la fuente.

**Indicadores derivados:** cálculos reproducibles.

**Análisis exploratorios:** asociaciones y patrones.

**Predicciones:** estimaciones basadas en modelos validados.

No afirmar que las piezas pendientes equivalen a medicamentos faltantes en farmacias.

No inferir pacientes afectados, recetas no surtidas, inventarios o gasto sin fuentes adicionales.

---

# 24. EXPORTACIONES Y DIVULGACIÓN

Permitir descargar:

- CSV.
- XLSX.
- PNG.
- SVG.
- Reportes PDF.
- Tablas de indicadores.
- Metadatos.
- Diccionario de datos.
- Metodología.
- Resultados de modelos.

Incluir generador de reportes con:

- Título.
- Fecha del corte.
- Filtros.
- Indicadores.
- Visualizaciones.
- Interpretación.
- Advertencias.
- Fuente.
- Firma by Doctor DS.

Diseñar también visualizaciones exportables para artículos científicos, publicaciones de divulgación y presentaciones.

---

# 25. SEGURIDAD Y TRANSPARENCIA

Aplicar:

- Validación de archivos.
- Sanitización de entradas.
- Prevención de inyección en exportaciones CSV.
- Control de dependencias.
- Manejo de errores.
- Integridad por hash.
- Sin secretos en frontend.
- Sin datos simulados presentados como reales.
- Sin llamadas ocultas a servicios externos.

El sitio debe mostrar claramente:

**Observatorio independiente elaborado a partir de datos públicos. No constituye una plataforma oficial del Gobierno de México.**

---

# 26. PRUEBAS AUTOMATIZADAS

Implementar pruebas unitarias, de integración y end-to-end.

Validar:

- Equivalencia de indicadores anteriores.
- Cobertura y brecha.
- Vencimientos.
- Fechas inválidas.
- Cantidades negativas.
- Duplicados.
- Filtros cruzados.
- CLUES.
- Catálogos.
- Exportaciones.
- Actualización.
- Histórico.
- Modelos estadísticos.
- Accesibilidad.
- Diseño responsive.
- Rendimiento.
- Despliegue.

No reemplazar el motor anterior hasta superar las pruebas de equivalencia.

---

# 27. FASES DE IMPLEMENTACIÓN

## Fase 0 — Auditoría

Inspección completa, inventario de datos, pruebas y arquitectura.

## Fase 1 — Nueva identidad y dashboard

Implementar el nuevo nombre, diseño, navegación y panorama nacional.

## Fase 2 — Motor analítico

Migrar y ampliar indicadores preservando resultados.

## Fase 3 — Georreferenciación

Integrar CLUES, mapas y análisis territorial.

## Fase 4 — Exploradores especializados

Medicamentos, instituciones, proveedores y contratos.

## Fase 5 — Histórico mensual

Implementar snapshots, comparación de cortes y pipeline.

## Fase 6 — Ciencia de datos

Concentración, desigualdad, redes, anomalías y laboratorio estadístico.

## Fase 7 — Modelos predictivos

Sólo cuando exista evidencia de factibilidad y validación.

## Fase 8 — Optimización y publicación

Pruebas, accesibilidad, documentación y despliegue.

Cada fase debe terminar con:

- Código funcional.
- Pruebas ejecutadas.
- Resultados verificables.
- Documentación.
- Capturas cuando sea posible.
- Registro de cambios.
- Limitaciones pendientes.

---

# 28. ENTREGABLES

Genera:

1. Aplicación web funcional.
2. Código fuente completo.
3. Pipeline de actualización.
4. Catálogos geográficos.
5. Motor estadístico.
6. Módulos de visualización.
7. Laboratorio de ciencia de datos.
8. Histórico mensual.
9. Pruebas automatizadas.
10. Documentación de arquitectura.
11. Diccionario de datos.
12. Metodología.
13. Guía de instalación.
14. Guía de actualización mensual.
15. Workflow de publicación.
16. Registro de cambios.
17. Reporte de rendimiento.
18. Reporte de accesibilidad.
19. Documentación de modelos.
20. Manual de mantenimiento.

---

# 29. INSTRUCCIÓN FINAL PARA CODEX

No generes una demostración superficial.

No construyas una interfaz con datos ficticios.

No sustituyas el motor analítico existente sin validar equivalencia.

No inventes columnas, coordenadas, contratos, precios, indicadores ni resultados.

No entrenes modelos predictivos si la estructura de datos no permite validarlos.

No elimines funcionalidades existentes.

No declares publicado un sitio sin comprobar el despliegue.

Trabaja directamente sobre el repositorio actual.

Primero inspecciona y documenta.

Después diseña la arquitectura y el sistema visual.

Posteriormente implementa por fases, manteniendo siempre una aplicación funcional.

Prioriza:

1. Exactitud estadística.
2. Calidad y trazabilidad.
3. Interactividad.
4. Visualización científica.
5. Rendimiento.
6. Accesibilidad.
7. Escalabilidad.
8. Diseño visual.

**Comienza ahora con la auditoría del repositorio, la arquitectura objetivo y la implementación de la Fase 1.**

El resultado final debe ser un observatorio nacional de referencia para explorar científicamente los datos públicos de suministro institucional de insumos para la salud en México.

**OBSERVATORIO DE INSUMOS PARA LA SALUD EN MÉXICO**

**by Doctor DS**