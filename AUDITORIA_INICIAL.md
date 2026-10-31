# Auditoría inicial · 25 de octubre de 2026

Documento previo a la migración solicitada en el prompt maestro 3.0. Alcance de esta entrega: Fase 0, arquitectura objetivo y Fase 1. No certifica las fases científicas futuras ni una publicación remota.

## Inventario inspeccionado

Se revisaron completos `index.html`, `styles.css`, `app.js`, `analytics.js`, `README.md`, `.gitignore`, `scripts/update_data.py`, los dos scripts de comprobación, el empaquetador de revisión, ambos workflows, los metadatos, las dimensiones y filas del gzip, el encabezado del CSV original y las capturas/instantánea existentes. No hay `package.json`, framework, catálogo geográfico ni servidor de aplicación. La carpeta no es un repositorio Git inicializado y no tiene remoto comprobable. Los ZIP anteriores son artefactos históricos, no un despliegue.

## Datos comprobados en archivos reales

| Evidencia | Resultado |
|---|---|
| ZIP original | 60,977,608 bytes; contiene `remisiones_publica.csv` (465,571,577 bytes) |
| SHA-256 original | `f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2` |
| Gzip público | 19,107,881 bytes; 1,102,722 filas de exactamente 18 campos |
| SHA-256 gzip | `e0e97350c418073005107943970b647f440f89a40c8838fedd95b6bb4ce78008` |
| Remisiones | 1,002,426 activas; 100,296 canceladas |
| Dimensiones del corte completo | 32 entidades, 10 instituciones, 517 nombres de proveedor, 3,375 claves, 792 licitaciones, 11,101 contratos |
| CLUES | 512 valores distintos incluyendo posibles vacíos; no validados contra catálogo |
| Suministro | 1,070,180 valores distintos frente a 1,102,722 filas: no es clave única |
| Duplicados | 240 filas activas adicionales idénticas en los 18 campos, conservadas |

Campos comprobados en el CSV: clave, descripcion, institucion, entidad, clues, unidad_medica, suministro, tipo_procedimiento_1, licitacion, contrato, estatus, fecha_solicitud, piezas_solicitadas, proveedor, fecha_entrega, piezas_entregadas, fecha_limite, canceladas_activas. En la capa pública, proveedor→nombre_proveedor y piezas_entregadas→piezas; también cambia el orden, documentado en `metadata.json`. Cantidades se almacenan como números; el resto se codifica mediante diccionarios.

## Regresión ejecutada antes de modificar la interfaz

`node scripts/check_analytics.cjs` y `node scripts/check_xlsx.cjs`: correctos. El segundo reconstruye el XLSX y comprueba cantidades numéricas y hoja metodológica. El primero prueba casos límite, filtros y conciliación del corte completo:

| Indicador, activas | Resultado |
|---|---:|
| Solicitadas | 2,566,801,175 |
| Entregadas reportadas | 2,067,851,443 |
| Entregadas acreditables | 2,067,635,723 |
| Cobertura | 0.8055301451231415 |
| Brecha | 499,165,452 |
| Vencida, corte 2026-10-25 | 409,486,132 |
| Mediana / P90 | 12 / 27 días |
| n de tiempos válidos | 828,959 |
| Entregas anteriores a solicitud | 911 |
| Puntualidad | 726,930 / 829,870 |

Son referencias de regresión, no constantes de producción. Fuente del cálculo: código ejecutado contra el gzip existente. Fechas de recuperación del metadato corresponden al procesamiento del archivo, no necesariamente al instante de descarga; la fecha declarada por la fuente no está preservada.

## Reutilización

- Mantener `analytics.js` como motor base y oráculo de regresión durante Fase 1: no sustituir sus fórmulas, exclusiones, filtros ni exportaciones.
- Reutilizar compresión/diccionarios, Web Worker, tablas paginadas, CSV protegido contra fórmulas, ExcelJS local y límites XLSX.
- Reutilizar filtros URL, esquema de 18 campos, metadatos y script de descarga pública.
- Reutilizar Github Pages como destino estático; añadir archivos nuevos al empaquetado explícitamente.

## Hallazgos y riesgos priorizados

1. **Científico:** piezas reportadas no certifican recepción física. La fecha de entrega no define primera/completa. No existe universo clínico, inventario, precios ni recetas. El corte de vencimiento no reconstruye estados históricos. No hay identificación longitudinal validada.
2. **CLUES/GIS:** identificadores presentes no significan establecimientos verificados ni georreferenciados. No hay catálogo, coordenadas o límites geográficos adjuntos. Fase 1 mostrará la cobertura observada y señalará lo no verificado, sin mapas ficticios.
3. **Pipeline:** sobreescribe el original y el corte público; no conserva snapshots inmutables. Valida principalmente cantidades/encabezados; no basta para histórico ni enriquecimiento. Gzip y metadatos no se publican como transacción conjunta. Fase 5 debe resolverlo antes de análisis longitudinal.
4. **Actualización:** workflow semanal, contrario a periodicidad mensual solicitada. Pruebas de referencia fijan totales de un corte; deben distinguir regresión histórica de validación de cortes nuevos antes de introducirlas en la actualización.
5. **Rendimiento:** descarga 19 MB y expande todas las filas una vez en Worker. Tablas paginadas, no virtualizadas. El Worker evita bloquear la interfaz, pero no acredita escalabilidad móvil. No hay benchmarks guardados ni prueba end-to-end automatizada.
6. **Interfaz:** hero grande desplaza indicadores; textos de 8–11 px, títulos truncados en rankings, faltan ejes/cifras visibles en serie mensual, filtros largos y jerarquía limitada. Navegación de anclas, sin vistas de módulo; no hay modo oscuro ni gestión de foco móvil.
7. **Accesibilidad:** faltan alternativa tabular de series y método explicativo por tarjeta; la matriz usa título flotante y color. No hay auditoría WCAG; no declarar conformidad.
8. **Estado:** resultados antiguos pueden verse mientras se calcula un filtro nuevo; exportaciones sin señal visual consistente. El estado de importación con error y el historial de navegación necesitan validación.
9. **Dependencias/red:** ExcelJS 4.4.0 distribuido localmente con MIT. CSS importa fuentes de Google; retirar esa llamada en el nuevo diseño para no depender de servicios externos al consultar.

## Decisión de migración

Primero se conserva una copia de los archivos originales en `legacy/fase-0/`, con manifiesto SHA-256. Se implementa la Fase 1 sobre la aplicación estática existente, con una capa de presentación y extensión aditiva del Worker. El motor original continúa comprobándose sin cambios. React/TypeScript/Vite y la capa Parquet se describen como destino gradual; no se presentan como instalados. No se habilitan vistas predictivas, inferenciales o GIS con resultados no sustentados.
