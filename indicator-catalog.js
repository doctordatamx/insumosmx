/* Catálogo operacional versionado. Las fichas se pueden exportar sin conexión. */
(function (root) {
  const quantityUniverse = 'Filas seleccionadas con ambas cantidades numéricas, finitas y no negativas.';
  const timeUniverse = quantityUniverse + ' Piezas entregadas >0; ambas fechas válidas y entrega no anterior a solicitud.';
  const concentrationUniverse = quantityUniverse + ' Solicitud >0 y nombre de proveedor no vacío; por clave-institución, ambas dimensiones también no vacías.';
  function definition(id, name, formula, numerator, denominator, unit, fields, universe, exclusions, limits, computeReference, extra = {}) {
    return { id, name, objective: 'Describir el suministro institucional reportado en el universo filtrado.', classification: 'Indicador derivado descriptivo',
      operationalDefinition: formula, formula, numerator, denominator, unit, fields, universe, exclusions,
      date: 'Fecha de recuperación del archivo y corte de evaluación disponibles en el contexto del reporte.',
      interpretation: name + ' dentro del universo y denominador especificados.', limitations: limits, computeReference, ...extra };
  }
  const quantities = ['piezas_solicitadas', 'piezas'];
  const timeFields = [...quantities, 'fecha_solicitud', 'fecha_entrega'];
  const limits = 'Piezas logísticas no equivalen a dosis/tratamientos. Pendiente institucional no equivale a desabasto clínico. Las filas no son órdenes únicas verificadas.';
  const timeLimits = 'Intervalos por registro, no ponderados por piezas. La fecha registrada no identifica primera entrega ni entrega completa. No es supervivencia ni efecto causal.';
  const concentrationLimits = 'Nombres publicados sin homologación jurídica. Sólo proveedores con volumen positivo observado; no incluye proveedores potenciales o con volumen cero. Concentración no demuestra falta de competencia. Comparar cartera, volumen y cobertura de datos.';
  const indicators = [
    definition('requested','Piezas solicitadas','Σ q','Σ piezas_solicitadas','No aplica: suma de volumen','piezas',quantities,quantityUniverse,'Ambas cantidades inválidas, ausentes o negativas excluyen la fila.',limits,'analytics.js: add'),
    definition('delivered','Entregadas reportadas','Σ e','Σ piezas','No aplica: suma de volumen','piezas',quantities,quantityUniverse,'Mismas exclusiones de cantidades.','Entrega reportada no certifica recepción física. '+limits,'analytics.js: add'),
    definition('credited','Entregadas acreditables','Σ min(q,e)','Σ mínimo por fila','No aplica: suma de volumen','piezas',quantities,quantityUniverse,'Mismas exclusiones de cantidades.','Sobreentregas no compensan otras filas. '+limits,'analytics.js: add'),
    definition('coverage','Cobertura acreditable','Σ min(q,e) / Σ q','Entregadas acreditables','Solicitadas válidas; null si suma=0','fracción [0,1]',quantities,quantityUniverse,'Mismas exclusiones de cantidades.','No es promedio de porcentajes por proveedor. '+limits,'analytics.js: finish'),
    definition('pending','Brecha pendiente','Σ max(q−e,0)','Pendiente por fila','No aplica: suma de volumen','piezas',quantities,quantityUniverse,'Mismas exclusiones de cantidades.',limits,'analytics.js: add'),
    definition('gapRate','Brecha relativa','Σ max(q−e,0) / Σ q','Brecha pendiente','Solicitadas válidas; null si suma=0','fracción [0,1]',quantities,quantityUniverse,'Mismas exclusiones de cantidades.',limits,'statistics-worker.js: finishScientific'),
    definition('overdue','Brecha vencida','Σ pendiente si fecha_limite < corte','Brecha con plazo vencido','No aplica: suma de volumen','piezas',[...quantities,'fecha_limite'],quantityUniverse,'Plazo ausente/inválido no se clasifica vencido.','El corte de evaluación no reconstruye el estado histórico de las entregas. '+limits,'analytics.js: add',{ usesEvaluationDate: true }),
    definition('completeRate','Cumplimiento por cantidad','n(e≥q y q>0) / n(q>0)','Filas completas por cantidad','Filas con ambas cantidades válidas y solicitud positiva','fracción [0,1]',quantities,quantityUniverse,'Solicitudes cero y cantidades inválidas fuera del denominador.','No certifica puntualidad ni recepción física. '+limits,'statistics-worker.js: finishScientific'),
    definition('zeroRate','Entrega nula reportada','n(e=0 y q>0) / n(q>0)','Filas sin piezas entregadas','Filas con ambas cantidades válidas y solicitud positiva','fracción [0,1]',quantities,quantityUniverse,'Solicitudes cero y cantidades inválidas fuera del denominador.',limits,'statistics-worker.js: finishScientific'),
    definition('timely','Puntualidad registrada','n(fecha_entrega≤fecha_limite) / n(fechas evaluables)','Entregadas con fecha no posterior al plazo','Filas con piezas>0, cantidades válidas y entrega/plazo válidos','fracción [0,1]',[...quantities,'fecha_entrega','fecha_limite'],quantityUniverse,'Excluye e≤0, fecha de entrega/plazo inválida.','No es OTIF. La regla base no excluye entrega anterior a solicitud de esta métrica; se conserva y se audita por separado.','analytics.js: add y finish'),
    definition('top5','Participación top 5 del motor base','Σ q de cinco mayores categorías de proveedor / Σ q','Solicitadas de cinco mayores categorías','Solicitadas válidas totales','fracción [0,1]',[...quantities,'nombre_proveedor'],quantityUniverse,'Mismas exclusiones de cantidades; sin proveedor se mantiene como categoría si existe.','Se conserva por equivalencia con la versión base. Para concentración de proveedores con nombre, consultar top5Known y knownSupplierCoverage. '+limits,'analytics.js: analyze'),
  ];
  const timeDefinitions = [
    ['median','Mediana de respuesta','(x central inferior + x central superior) / 2','días'],
    ['p25','P25 de respuesta','x[ceil(0.25 n)]','días'],['p75','P75 de respuesta','x[ceil(0.75 n)]','días'],
    ['p90','P90 de respuesta','x[ceil(0.90 n)]','días'],['p95','P95 de respuesta','x[ceil(0.95 n)]','días'],
    ['iqr','Rango intercuartílico','P75 − P25','días'],['mad','Desviación absoluta mediana','mediana(|x − mediana(x)|), sin reescalado','días'],
    ['mean','Media de respuesta','Σ x / n','días'],['sd','Desviación estándar de respuesta','sqrt(Σ(x−media)² / (n−1))','días'],
    ['cv','Coeficiente de variación','DE con divisor n−1 / media; sólo si media>0','razón'],
  ];
  for (const [id,name,formula,unit] of timeDefinitions) indicators.push(definition(id,name,formula,'Vector de diferencias de días elegibles','n intervalos válidos; no es razón para estadísticos de orden',unit,timeFields,timeUniverse,
    'Cantidades inválidas, e≤0, fechas inválidas o intervalos negativos. null si n=0; DE/CV null si n<2; CV null si media=0.',timeLimits + ' Percentiles por rango más próximo (inverted CDF); mediana por promedio central. DE usa n−1 como convención, sin inferencia de muestreo aleatorio.',
    'statistics.js: describeFrequencies',{ sources: ['https://numpy.org/doc/2.0/reference/generated/numpy.quantile.html','https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm'] }));
  indicators.push(definition('invalidResponseDateRate','Fechas no evaluables para respuesta','n(solicitud o entrega inválida) / n(e>0)','Filas con al menos una fecha no válida','Filas entregadas con cantidades válidas; null si no hay','fracción [0,1]',timeFields,quantityUniverse,'Se requiere e>0; intervalos negativos se reportan por separado.','No contabiliza dos veces una fila con ambas fechas inválidas.','statistics-worker.js: finishScientific'));
  const concentrationDefinitions = [
    ['hhi10000','HHI de proveedores','10000 Σ sᵢ²','puntos [0,10000]'],
    ['effectiveProviders','Número efectivo de proveedores','1 / Σ sᵢ²','proveedores equivalentes'],
    ['gini','Gini de volumen entre proveedores','Σ(2i−k−1)vᵢ / (k Σvᵢ), v ordenados crecientes','índice [0,1]'],
    ['entropy','Entropía de Shannon','−Σ sᵢ ln(sᵢ)','nats'],
    ['normalizedEntropy','Entropía normalizada','Shannon / ln(k); 0 si k=1','índice [0,1]'],
    ['top1','Participación del mayor proveedor','max(vᵢ) / Σvᵢ','fracción [0,1]'],
    ['top5Known','Participación de cinco proveedores identificados','Σ cinco mayores vᵢ / Σvᵢ','fracción [0,1]'],
  ];
  for (const [id,name,formula,unit] of concentrationDefinitions) indicators.push(definition(id,name,formula,'Volúmenes positivos solicitados por proveedor; sᵢ=vᵢ/Σvᵢ','Volumen de proveedores con nombre; k proveedores positivos',unit,
    [...quantities,'nombre_proveedor','clave','institucion'],concentrationUniverse,'Sin proveedor excluye volumen de esa distribución; sin clave/institución excluye el análisis de pares. null si no hay volumen.',concentrationLimits,'statistics.js: concentration'));
  indicators.push(definition('knownSupplierCoverage','Cobertura del volumen para concentración','Σ q con proveedor no vacío / Σ q válida','Volumen solicitado con proveedor identificado por nombre','Volumen solicitado válido total','fracción [0,1]',[...quantities,'nombre_proveedor'],quantityUniverse,'Sin proveedor no se inventa una categoría de empresa.',concentrationLimits,'statistics-worker.js: calculateScientificReport'));
  root.IndicatorCatalog = { version: '2.0.0', publishedDate: '2026-10-25', notation: 'q=solicitadas, e=entregadas, x=días de respuesta; sᵢ=participación por volumen; k=proveedores positivos.',
    status: 'Descriptivo, sin predicciones ni inferencia causal', indicators };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.IndicatorCatalog;
})(globalThis);
