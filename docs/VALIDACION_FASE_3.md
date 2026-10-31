# Validación Fase 3

Referencia: `phase3-reference.json`. Corte activo de 1,002,426 filas; solicitadas 2,566,801,175 y brecha 499,165,452, sin cambio respecto al motor original.

La prueba geográfica verifica 32 códigos estatales únicos, campos públicos permitidos del catálogo, coordenadas admisibles, conciliación de categorías y desglose institucional. El filtro municipal de León (11020) obtiene 38,484 filas, 70,091,407 piezas solicitadas, 55,382,998 entregadas reportadas y brecha de 14,708,409. Quitar el filtro restaura el universo completo. Un archivo sin hash compatible no se vincula automáticamente.

La reproducción del informe municipal pasa con cantidades, conteos y orden estadístico exactos y tolerancia 1e-12 en los demás derivados. La regresión del dashboard confirma que `analytics.js` sigue idéntico al motor preservado.

Verificación visual en navegador local: atlas estatal renderizado, indicadores y auditoría visibles; selección estatal y capa municipal. No se certifica accesibilidad completa, rendimiento móvil ni ejecución del workflow en GitHub. Las exportaciones están implementadas; la descarga nativa del mapa no forma parte de esta prueba.
