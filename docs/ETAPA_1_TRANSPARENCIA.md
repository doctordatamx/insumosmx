# Transparencia — etapa 1: implementación y validación

Fecha: 2026-10-26, México. Complementa el diagnóstico inicial; no reescribe sus hallazgos históricos. Alcance: textos públicos, enlaces, contexto de interpretación y políticas. No es dictamen jurídico ni auditoría externa.

## Cambios implementados

- Rutas permanentes de independencia, tecnología/supervisión humana, política editorial y rectificaciones.
- Declaración de independencia íntegra y texto de apoyo de IA del encargo, comprobados automáticamente contra el prompt conservado.
- Aviso completo sobre proveedores visible en las vistas de análisis pertinentes, junto con fuente actual, recuperación, evaluación, remisiones y filas filtradas. Aplica a rankings, tablas, perfiles y gráficos del universo; conserva los nombres publicados.
- Enlaces desde encabezado, navegación y pie compartido para llegar a políticas desde todas las rutas. Fuente oficial y metodología enlazadas en el aviso contextual.
- Advertencia sobre disponibilidad para pacientes en la sección de alcance, sin anticipar un catálogo oncológico que aún no está validado.
- Página de revisión con categorías y flujo previsto, marcada expresamente como recepción no habilitada; cero formularios y cero acuses ficticios. Bitácora JSON sin correcciones registradas, con recepción deshabilitada.
- Documentos públicos: metodología, procedencia, diccionario de 18 campos, límites, política editorial, rectificaciones, transparencia IA y seguridad. README y CHANGELOG actualizados.
- MIT para código/documentación propios, con atribución y alcance separado. Datos, geometrías, marcas y materiales de terceros mantienen sus condiciones. La selección no constituye revisión jurídica completa de todas las fuentes.
- Entrega separada: observatorio-insumos-transparencia-etapa1.zip; las entregas anteriores no se renombran ni se eliminan.

## Estado frente al diagnóstico

| Criterio | Estado después de esta etapa |
|---|---|
| D10, declaración y avisos de la interfaz | APROBADO para el texto íntegro, enlaces y contexto probado en navegador; mantener revisión editorial de interpretaciones |
| D11, declaración de IA y alcance de revisión | APROBADO para la comunicación implementada; no se atribuyen revisiones externas inexistentes |
| D15, documentos y licencia de código propio | APROBADO para los archivos creados; REQUIERE REVISIÓN para condiciones de fuentes, derechos y revisión profesional |
| D13, política y descripción del flujo | APROBADO como información; BLOQUEANTE para afirmar recepción/seguimiento: el canal sigue sin habilitar |
| D01 y D02, gates y promoción del candidato | BLOQUEANTE; sin cambios en esta etapa |
| D03, GitHub y revisión obligatoria | REQUIERE REVISIÓN en el repositorio real; sin configuración remota acreditada |
| D12, oncología y pediatría | REQUIERE REVISIÓN; no se incorpora una clasificación inferida por nombre |
| D14, seguridad y dependencias | REQUIERE REVISIÓN; los documentos no sustituyen controles ni escaneo |

## Pruebas y evidencia

`python scripts/build_static.py`: verifica el snapshot y prepara los archivos por lista explícita, incluidos documentos públicos y bitácora.

`node scripts/check_transparency.cjs`: textos de independencia, proveedores, IA y advertencia prioritaria comparados íntegramente con el encargo; rutas, enlaces, documentos y hashes publicados; recepción deshabilitada; escape HTML con entrada maliciosa; motor de referencia idéntico y payload actual idéntico al preservado.

`node scripts/check_analytics.cjs`: regresión y conciliación del corte completo aprobadas. El universo activo mantiene 1,002,426 filas; 2,566,801,175 solicitadas; 2,067,851,443 entregadas reportadas; brecha 499,165,452; mediana 12 y P90 27 días. Esta etapa no recalifica proveedores ni modifica fuentes o snapshots.

En navegador local: apertura de independencia, tecnología y rectificaciones; texto IA visible; bitácora sin entradas y formulario inexistente; aviso íntegro en Proveedores con recuperación, ACTIVA, fecha de evaluación y 1,002,426 filas; sin errores de consola en la revisión. Capturas en capturas/transparencia-independencia.png y capturas/transparencia-proveedores.png.

La presencia de enlaces y semántica de encabezados no certifica una auditoría integral de accesibilidad o rendimiento móvil. Las descargas nativas y controles remotos no fueron probados como parte de esta etapa. El paquete se comprueba por CRC al generarse; no se ha publicado en GitHub Pages.

## Siguiente etapa

Implementar gate de pruebas críticas del candidato y staging/promoción segura, con manifiestos de auditoría complementarios y pruebas de fallos que conserven el último corte válido. Mantener el inventario histórico inmutable. Después, configurar revisión y seguridad en el repositorio real, verificar clasificación oficial de prioritarios y resolver el canal operativo de rectificaciones con privacidad y moderación.
