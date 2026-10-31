## Transparencia y comunicación — etapa 1 (2026-10-26)

Declaración pública íntegra de independencia, aviso contextual de proveedores con fuente/fechas/filtros, transparencia IA, política editorial y rectificaciones sin canal receptor ficticio. Documentación metodológica, procedencia, diccionario, límites y seguridad; licencia MIT de código propio con exclusiones de datos y terceros. Sin cambios al motor, datos o snapshots. Los bloqueos del diagnóstico para publicación automática permanecen pendientes.

## Productos por proveedor

Tabla al final de Proveedores por empresa, clave y descripción: solicitadas, entregadas, pendientes, cobertura y situación completa/parcial/sin entrega. Búsqueda, filtro de situación, paginación y CSV; respeta filtros globales y conserva brecha por registro sin compensación de sobreentregas. Verificación: `node scripts/check_supplier_products.cjs`.

# Fase 6 — Laboratorio de Datos

Pares clave–institución con cobertura de proveedor, HHI y comparación contextual; redes bipartitas con grado/fuerza; reglas de calidad y z robusto configurable. Informes y registros reproducibles, contraste independiente Python y seis fichas nuevas en el catálogo. Ver docs/FASE_6.md.

# Fase 5 — Histórico e integridad

Archivo inmutable por hash, manifiestos y observaciones de recuperación; validación de esquema y archivos, preservación mensual, comparador de agregados entre cortes y reproducción por CLI. Una única línea base real; no se inventa historia previa. Ver docs/FASE_5.md.

# Fase 4 — Fichas y comparador

Exploradores de empresas, instituciones, claves y contratos; desgloses, comparación múltiple, dispersión y cajas de tiempos, registros originales, exportaciones y enlaces con hash. Motor original preservado. Ver docs/FASE_4.md.

# Fase 3 — Atlas territorial

Capas oficiales de entidades y municipios, establecimientos CLUES, auditoría de coordenadas, filtros globales y exportaciones. Catálogo histórico explícito, hashes y reconstrucción mensual del vínculo. Ver docs/FASE_3.md.

# Registro de cambios

## 3.0 · Fase 2 · 25 de octubre de 2026

- Motor descriptivo aditivo: P25/P75/P95, IQR, MAD, media, DE y CV, con convenciones y casos sin denominador explícitos.
- Concentración por proveedor y por clave–institución: HHI, Gini, entropía, número efectivo y participaciones, sin clasificación de competencia.
- Vista estadística bajo demanda con histograma, ECDF, caja, tablas paginadas y mínimos de n.
- Catálogo de 30 indicadores, reporte reproducible JSON, CSV de resultados/frecuencias/pares y gráficos SVG/PNG.
- Pruebas de equivalencia global y por proveedor, comprobación independiente Python y reproducción del JSON contra el mismo corte.
- Sin cambios en el archivo del motor original ni deduplicación automática; GIS e inferencia no implementados.

## 3.0 · Fases 0 y 1 · 25 de octubre de 2026

- Auditoría del esquema real, originales, pruebas, pipeline y límites metodológicos antes de cambiar la interfaz.
- Copia recuperable de cinco archivos base y manifiesto SHA-256 en `legacy/fase-0/`.
- Nueva identidad Observatorio de Insumos para la Salud en México · by Doctor DS.
- Shell por módulos, rutas hash, temas claro/oscuro, filtros plegables y navegación móvil.
- Fichas de indicadores, denominadores explícitos y rankings enlazados de entidad/proveedor/clave.
- Vista de calidad con CLUES observadas y verificación no evaluada; histórico sin cortes ficticios.
- Extensión descriptiva en Worker y prueba de equivalencia; motor original conservado.
- Publicación estática con archivos explícitos y calendario de descarga mensual. Sin despliegue remoto verificado.

Las versiones y paquetes anteriores conservan el nombre histórico únicamente como archivos de referencia.
