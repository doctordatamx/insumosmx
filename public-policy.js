/* Textos públicos versionados, independientes del motor de indicadores. */
(function(root){
 const policy={version:'1.0.0',updated:'2026-10-26',
 independence:[
 'El Observatorio de Insumos para la Salud en México es una iniciativa independiente de análisis y divulgación de datos públicos, desarrollada por Doctor DS.',
 'Su propósito es facilitar la consulta, interpretación y seguimiento de información relacionada con solicitudes, entregas y suministro institucional de insumos para la salud en México.',
 'La información utilizada proviene de fuentes públicas oficiales y se procesa mediante procedimientos estadísticos y computacionales documentados.',
 'Este proyecto no representa a la Secretaría de Salud, instituciones gubernamentales, hospitales, sociedades médicas, proveedores ni organizaciones políticas.',
 'Los resultados no constituyen auditorías gubernamentales, resoluciones administrativas, evaluaciones contractuales definitivas ni determinaciones de responsabilidad.',
 'La publicación de información sobre instituciones, proveedores o unidades médicas tiene exclusivamente fines informativos, académicos y de transparencia.',
 'Se promueve la revisión independiente, la identificación de errores y la mejora continua de la calidad de los datos.'
 ],
 providerNotice:'La identificación de un proveedor en esta plataforma responde exclusivamente a su presencia en los registros públicos consultados. Las diferencias entre cantidades solicitadas y entregadas no constituyen por sí mismas evidencia de incumplimiento contractual, negligencia, irregularidad administrativa o conducta ilícita.',
 ai:[
 'El desarrollo del Observatorio de Insumos para la Salud en México ha contado con apoyo de herramientas de inteligencia artificial para programación, organización de información y análisis computacional.',
 'El uso de estas tecnologías no sustituye la validación estadística, la revisión metodológica ni la responsabilidad humana sobre los resultados publicados.',
 'El código, las transformaciones de datos y los procedimientos de cálculo se documentan para facilitar su revisión independiente.'
 ],
 priorityWarning:'Una alta proporción de entregas reportadas no garantiza disponibilidad del medicamento para el paciente. Una baja proporción tampoco demuestra, por sí sola, desabasto clínico. La suficiencia de las solicitudes requiere información adicional sobre demanda, consumo, existencias y necesidades asistenciales.'
 };
 root.PublicPolicy=policy;if(typeof module!=='undefined'&&module.exports)module.exports=policy;
})(globalThis);
