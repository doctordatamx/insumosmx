# Validación de Fase 1 · 25 de octubre de 2026

## Automatizada

- Regresión original Node: correcta antes de la migración; cobertura, brecha, vencimiento, fechas imposibles, filtros, lectura CSV y conciliación de grupos/antigüedad.
- XLSX: generación y lectura del libro con cantidades numéricas y hoja metodológica correctas.
- Extensión del Worker: motor SHA-256 idéntico a la copia de Fase 0; fixture con cantidades cero, negativas y ausentes; denominador de solicitud positiva correcto; conteo CLUES no vacío y rankings sin alterar totales. Prueba del prefijo nuevo de exportación y protección de fórmulas CSV.
- Corte activo completo: 1,002,426 filas, 10 instituciones, 513 nombres de proveedor, 3,361 claves y 491 CLUES distintas no vacías. CLUES verificadas: **no evaluado**, no cero verificadas.
- Empaquetado: lista de archivos públicos, motor/estilos/Worker adicionales incluidos, sin ZIP original. No equivale a ejecutar GitHub Actions.

El archivo `benchmark-fase1.json` registra una ejecución Node v24.13.0 sobre el corte real. Aproximadamente 5.8 segundos para decodificar, analizar y generar el panorama en esa ejecución; aproximadamente 1.9 segundos en la extensión descriptiva. Son observaciones locales de una ejecución, no percentiles ni una garantía de rendimiento. Memoria del Worker, red móvil, dispositivos de baja RAM y carga inicial del navegador: no medidos.

## Navegador local

Pruebas realizadas con el sitio servido por HTTP:

- Carga del corte y ocho tarjetas, conciliadas visualmente con la regresión.
- Ficha de cobertura: diálogo con fórmula, denominador 2,566,801,175, corte, límites y hash del original; cierre correcto.
- Navegación a Instituciones: sólo la vista de comparativo visible y agrupación institución.
- Vista móvil 390×844: ancho de documento observado menor o igual al viewport, sin desbordamiento global horizontal; tarjetas en dos columnas, menú compacto y filtros plegables.
- Menú móvil: apertura anunciada mediante aria-expanded, selección de módulo y cierre.
- Se detectó que la etiqueta implícita del select podía incluir sus opciones. Se añadieron nombres accesibles explícitos a todos los filtros y se repitió la interacción por etiqueta.
- Filtro Institución=IMSS BIENESTAR: 212,479 registros y un grupo; chips de selección visibles.
- Deshacer: restauró institución vacía y el universo de 1,002,426 activas.
- Temas oscuro y claro: cambio de tokens y capturas de ambas variantes; preferencia persistida en localStorage.
- Contratos: agrupación por contrato, 10,821 valores en el universo activo; sin presuponer identidades jurídicas ni montos.
- Evolución: alternativa tabular abierta con 15 meses y valores de ambos flujos.
- Se restauró el viewport de escritorio después de probar móvil.
- Paquete estático servido desde `/_site/`: Worker, estilos y datos cargaron correctamente; 1,002,426 activas y total de piezas original. Valida rutas relativas locales, no un despliegue remoto.

Capturas: `capturas/fase1-claro.png`, `capturas/fase1-oscuro.png` y `capturas/fase1-movil.png`.

## Accesibilidad: alcance y pendientes

Mejoras verificables: enlace de salto, foco visible, controles nativos con nombre explícito, navegación con estado aria-current, botones de definición, diálogo nativo, anuncios de estado, alternativa tabular de serie y foco en barras. El drawer cerrado en móvil usa inert; Escape permite cerrarlo y devolver foco al control.

No se declara conformidad WCAG 2.2 AA. Pendientes: auditoría automatizada completa, pruebas con lector de pantalla, teclado de todas las rutas y exportaciones, contraste de todos los estados, zoom 200/400%, espacios táctiles, calidad de la matriz en pantalla estrecha y pruebas en varios navegadores. Los textos auxiliares pequeños siguen siendo una limitación a revisar. No hay una suite end-to-end automatizada instalada; estas pruebas de interfaz se realizaron mediante el navegador controlado de la sesión.

## Despliegue

Vista local comprobada. GitHub Pages: **no publicado ni comprobado**. No hay repositorio Git/remoto configurado en esta carpeta. El calendario mensual está escrito en el workflow; no se verificó ejecución remota, actualización de la fuente ni recuperación ante interrupción entre reemplazos de datos.
