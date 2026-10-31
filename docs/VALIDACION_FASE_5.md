# Validación Fase 5

- `python scripts/check_snapshots.py`: directorio temporal aislado; inmutabilidad, repetición de recuperaciones, dos originales distintos, transformación incompatible, esquema incompleto, índices inválidos y archivo alterado.
- `node scripts/check_history.cjs`: diccionarios reordenados, filtros por etiquetas, activas/canceladas, grupos presentes/ausentes, conciliación de cambios, filtro no encontrado, rechazo municipal sin catálogo y esquema incompatible. La regresión real concilia 1,002,426 filas activas, 2,566,801,175 solicitadas, 499,165,452 pendientes y 409,486,132 vencidas al evaluar 2026-10-25.
- La prueba asíncrona simula cargas comprimidas de dos fixtures, verifica SHA-256 y compara agregados. También reproduce el informe con el CLI y rechaza una cantidad alterada. Esos fixtures se eliminan y no se publican como observaciones.
- `python scripts/verify_snapshots.py`: inventario real y archivos preservados válidos. Repetir el archivado del conjunto actual conserva un corte y una observación, sin cambiar su payload.
- Construcción estática mediante lista explícita y empaquetado con comprobación CRC. Los originales geográficos y las fixtures temporales quedan fuera.

En navegador local se verificó que Actualizaciones muestra un corte real, 1,102,722 filas sin filtros, metadatos y descargas, y mantiene deshabilitada la comparación al faltar el segundo corte. No se probó una comparación de dos cortes reales porque todavía no existe ese histórico. El cálculo de dos cortes y la reproducción se probaron con fixtures controladas. No se certifica ejecución de GitHub Actions, accesibilidad integral ni rendimiento móvil.

La referencia numérica queda en `phase5-reference.json`; distingue explícitamente la regresión real de los cambios sintéticos.

La conversión válida también se prueba con las 18 cabeceras obligatorias y registro de su forma original; la validación rechaza un esquema incompleto antes de archivarlo. Captura del inventario: `capturas/fase5-historico.png`.
