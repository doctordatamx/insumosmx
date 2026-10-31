# Fase 5 — Cortes inmutables e histórico

## Entrega

La sección **Actualizaciones** incorpora el inventario de cortes preservados, fechas, hashes, número de filas, claves y empresas sin filtros, estado del esquema y descargas del archivo transformado, manifiesto y geografía relacionada. La versión inicial preserva **un único corte real**: recuperación UTC `2026-10-26T03:37:19.351187+00:00`, 1,102,722 filas, 3,375 claves no vacías y 517 proveedores no vacíos, incluyendo activas y canceladas. No se fabrican cortes anteriores.

El hash del original oficial es `f99bef47ef61efbfadc2be7a96c1c04448ff3a3ae98f06d1a297e56a815b92f2`. La fecha declarada de actualización de la fuente no está documentada en los metadatos de esa recuperación: no se sustituye por una fecha de solicitud, entrega, captura de pantalla o recuperación.

## Inmutabilidad e integridad

`python scripts/archive_snapshot.py` valida el esquema transformado de 18 campos, índices de diccionario, conteo y cantidades finitas. Usa el SHA-256 del original para identificar la carpeta histórica y conserva una copia del JSON comprimido y su hash. Registra también un hash de contenido transformado, campos, cabeceras originales cuando están disponibles y la primera geografía compatible archivada.

Una recuperación del mismo original agrega una observación fechada, sin duplicar ni sobrescribir el archivo. Si el mismo original produce otra transformación, el archivador exige revisión y se detiene. Cambiar metadatos de recuperación no modifica el contenido analítico. Un archivo preservado alterado se rechaza por hash. La inmutabilidad es una regla del escritor y de la validación; no constituye una firma externa ni almacenamiento WORM.

`python scripts/verify_snapshots.py` comprueba todos los manifiestos, hashes de archivos y geografía y observaciones relacionadas. La construcción pública y el empaquetado ejecutan esa verificación. Sólo se distribuyen archivos del inventario con identificadores hexadecimales válidos; los directorios temporales no entran en el sitio.

El archivo ZIP original no se duplica en el directorio público: se conserva el conjunto transformado y el hash del paquete fuente. La geografía archivada no se reemplaza por un catálogo posterior bajo el mismo identificador de corte.

## Comparación

El comparador se habilita con dos cortes reales distintos en orden cronológico. Descarga ambos archivos en un Worker separado, verifica sus SHA-256 y utiliza el motor original. Procesa los cortes secuencialmente y libera sus referencias antes de continuar; no sustituye el conjunto del dashboard principal. La memoria temporal necesaria para descomprimir cada corte depende del navegador.

Aplica los mismos filtros globales por etiqueta exacta, búsqueda, fechas de solicitud, universo y **misma fecha de evaluación** de vencimientos. Los identificadores internos de diccionarios no se trasladan entre cortes. Si una etiqueta no existe, ese universo queda vacío y se advierte; no se elimina el filtro silenciosamente. El municipio requiere la geografía compatible archivada en ambos cortes; si falta, se rechaza el cálculo municipal.

Compara cantidades solicitadas, entregadas reportadas y acreditables, brecha, brecha vencida y conteos. Ofrece desgloses por empresa, institución, clave, estado, contrato, CLUES y procedimiento; variaciones de cobertura en puntos porcentuales y presencia de grupos. La pantalla pagina 25 grupos; CSV y JSON incluyen el desglose completo. Para conciliar cantidades aditivas se usa cero cuando un grupo está ausente, pero la pantalla distingue ausencia de registros y los porcentajes no evaluables.

**B−A es una variación neta entre agregados**, no el número de entregas nuevas, solicitudes resueltas, solicitudes nuevas ni cancelaciones identificadas. No se enlazan filas por suministro, contrato ni combinaciones que no sean una llave validada. Los grupos con brecha en ambas fechas no necesariamente contienen las mismas solicitudes y no demuestran persistencia mensual continua. No se calcula una tasa de resolución por solicitud ni persistencia de meses consecutivos sin evidencia.

Los cambios pueden reflejar cancelaciones, correcciones, composición, captura o cambios de cobertura de la fuente. Las cantidades de productos distintos no equivalen a tratamientos. La fuente no certifica recepción física, inventario o desabasto clínico.

## Reproducción

Exportar la comparación JSON y ejecutar:

```powershell
node scripts/reproduce_history.cjs comparacion.json
```

El script verifica archivos preservados y geografía si procede, reaplica el contexto y exige igualdad exacta en ambos análisis, variaciones y grupos. No necesita recuperar la página oficial. Las pruebas de dos cortes usan únicamente fixtures sintéticas y nunca las incorporan al inventario público.

## Pipeline mensual

El workflow `refresh.yml` preserva el conjunto anterior antes de descargar. La conversión registra las cabeceras originales y rechaza columnas obligatorias ausentes o duplicadas; luego actualiza geografía, archiva el nuevo conjunto y hace un commit con datos, geografía e inventario. La actualización concurrente se serializa. Una descarga, validación o reconstrucción fallida detiene el flujo antes del commit/publicación; no hay publicación parcial. Una recuperación que falló antes de archivarse no se presenta como corte disponible.

La configuración conserva el calendario del primer día del mes a las 12:30 UTC y ejecución manual. Sólo operará cuando el repositorio y sus permisos de Actions/Pages estén configurados. No se ha ejecutado ni activado un workflow remoto en esta entrega. Los cortes completos aumentan el tamaño del repositorio y despliegue; no hay retención o borrado automático de históricos.
