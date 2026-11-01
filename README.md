# Observatorio de Insumos para la Salud en México

**Análisis de solicitudes y entregas institucionales de medicamentos e insumos · by Doctor DS**

Aplicación web para explorar los registros públicos de la Secretaría de Salud, comparar piezas solicitadas y entregadas reportadas, y examinar diferencias por proveedor, institución, territorio, producto y periodo.

> Proyecto independiente. No es un portal gubernamental. Los registros permiten analizar el cumplimiento reportado de solicitudes; no certifican recepción física ni permiten medir, por sí solos, el desabasto clínico.

## Qué incluye

- **Panorama general:** piezas solicitadas, entregadas, cobertura, pendientes y pendientes vencidos.
- **Proveedores:** tiempos de respuesta, puntualidad y tabla de productos con entrega completa, parcial o sin entrega reportada.
- **Instituciones y productos:** análisis por institución, clave, descripción, contrato y licitación.
- **Territorio:** mapas por entidad y vínculos por municipio y CLUES, con indicadores de calidad del cruce geográfico.
- **Evolución e histórico:** flujos temporales, cortes preservados y comparación entre exportaciones.
- **Fichas y comparador:** consulta y comparación de proveedores, instituciones, claves y contratos.
- **Laboratorio de datos:** estadísticas descriptivas, concentración, redes y señales para revisión.
- **Exportaciones:** tablas y registros filtrados en CSV y XLSX, con límites de tamaño según el formato.
- **Transparencia:** metodología, procedencia de datos, limitaciones, política editorial y rectificaciones.

## Datos incluidos

Fuente: [Plataforma de entrega de medicamentos de la Secretaría de Salud](https://entregamedicamentos.salud.gob.mx/insumos/), mediante su exportación sin filtros.

| Concepto | Corte actual |
| --- | ---: |
| Actualización declarada por la fuente | 23 de octubre de 2026 |
| Recuperación del archivo, hora de México | 30 de octubre de 2026 |
| Registros totales | 1,098,561 |
| Registros activos | 997,747 |
| Registros cancelados | 100,814 |
| Piezas solicitadas en registros activos | 2,556,338,435 |
| Piezas entregadas reportadas en registros activos | 2,067,933,904 |
| Piezas pendientes en registros activos | 488,622,544 |

Se conservan **18 campos de análisis y dos cortes históricos**. Las fechas de recuperación y de actualización declarada son distintas. La comparación entre exportaciones incluye revisiones y cancelaciones; no equivale a entregas realizadas durante ese intervalo.

Consulta el [informe de actualización](docs/ACTUALIZACION_2026-10-30.md), los [metadatos del corte](data/metadata.json) y el [inventario histórico](data/snapshots/index.json).

## Uso local

Requiere Python 3 para servir los archivos y un navegador moderno compatible con Web Workers y `DecompressionStream`.

```bash
git clone https://github.com/doctordatamx/insumosmx.git
cd insumosmx
python -m http.server 8765 --bind 127.0.0.1
```

Abre **http://127.0.0.1:8765/**. El repositorio privado requiere acceso autorizado para clonarlo. La consulta se calcula en el navegador; el conjunto completo se carga en memoria y puede tardar en equipos con pocos recursos. Sirve la aplicación mediante HTTP, en lugar de abrir `index.html` directamente.

## Metodología y alcance

- **Cobertura:** suma de piezas acreditables, limitadas a las solicitadas en cada fila, dividida entre las piezas solicitadas.
- **Pendiente:** suma de `máximo(solicitadas − entregadas, 0)` por fila. Las sobreentregas no compensan faltantes de otros registros.
- **Pendiente vencido:** pendiente con fecha límite válida anterior a la fecha de corte elegida.
- **Tiempo de respuesta:** días naturales entre solicitud y entrega registrada, con fechas válidas y duración no negativa.

Se conservan duplicados y remisiones canceladas para mantener trazabilidad; los filtros definen el universo analizado. Una fila no se presupone como una orden única. Las piezas de distintos productos no equivalen a dosis o tratamientos comparables.

**El observatorio no estima recetas no surtidas, existencias en anaquel, pacientes afectados ni responsabilidad contractual.** Las señales estadísticas requieren revisión contextual y no constituyen evidencia de irregularidad.

## Estructura del repositorio

```text
index.html              Entrada de la aplicación
*.js / *.css            Interfaz, análisis y trabajadores en segundo plano
data/                   Datos transformados, geografía y cortes históricos
docs/                   Metodología técnica, validaciones e informes
scripts/                Importación, verificaciones y construcción del sitio
vendor/                 Dependencias distribuidas y sus licencias
legacy/                 Referencia preservada del motor original
.github/workflows/      Validación y publicación manual
```

## Validación y publicación

Comprobaciones principales, con Python 3 y Node.js:

```bash
python scripts/verify_snapshots.py
python scripts/check_current_data.py
node scripts/check_analytics.cjs
node scripts/check_supplier_products.cjs
python scripts/build_static.py
node scripts/check_transparency.cjs
```

El motor se verifica contra una referencia histórica fija; el corte actual se concilia por separado con los totales de la exportación oficial. La construcción genera el directorio `_site/`.

El workflow **Validar y publicar manualmente** sólo se ejecuta a petición y tiene la publicación desactivada por defecto. La plantilla de actualización automática se conserva inactiva. Tener un repositorio privado no garantiza que un sitio publicado sea privado: el acceso de la web debe configurarse en el alojamiento elegido antes de desplegarla.

## Documentación y transparencia

- [Metodología](METHODOLOGY.md) · [Diccionario de datos](DATA_DICTIONARY.md)
- [Procedencia de los datos](DATA_PROVENANCE.md) · [Limitaciones](LIMITATIONS.md)
- [Política editorial](EDITORIAL_POLICY.md) · [Política de rectificaciones](CORRECTIONS_POLICY.md)
- [Uso de inteligencia artificial](AI_TRANSPARENCY.md) · [Seguridad](SECURITY.md)
- [Registro de cambios](CHANGELOG.md)

La recepción de rectificaciones aún no está habilitada. No se declara una auditoría externa del proyecto.

## Licencia

El código y la documentación propios se distribuyen bajo [licencia MIT](LICENSE). Los datos oficiales, las geometrías y las dependencias conservan sus condiciones de origen; consulta el [alcance de la licencia](LICENSE_SCOPE.md).
