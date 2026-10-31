# Seguridad

## Estado de esta versión

Hay escape de texto en las vistas revisadas, neutralización de fórmulas CSV, hashes, lista explícita de publicación y pruebas de integridad. No se ha completado una auditoría de seguridad ni se afirma ausencia de vulnerabilidades. La aplicación procesa datos localmente en el navegador; el alojamiento puede registrar sus propias solicitudes y no ofrece confidencialidad de reportes por ese hecho.

No hay canal privado de recepción de vulnerabilidades habilitado. Evitar publicar credenciales, datos personales o instrucciones de explotación en canales públicos. El mecanismo responsable y seguro debe configurarse con el repositorio real; no se inventa un correo o servicio de contacto.

## Pendientes antes de activar publicación automática

- Revisar el repositorio real, protección de main, revisiones, checks y entornos de despliegue.
- Armonizar la actualización mediante cambios revisables con la protección de rama; el workflow actual aún escribe directamente a main.
- Gate de pruebas críticas del candidato antes de promoción y despliegue.
- Permisos mínimos, inventario y verificación de dependencias, acciones fijadas por hash y escaneo documentado.
- Pruebas adversariales de HTML/CSV, errores seguros, archivos grandes y políticas de contenido compatibles con Workers, SVG y descargas.
- Verificar hashes y archivos sobrantes de cada build; conservar el último corte válido ante fallos.

Estos puntos son controles pendientes, no garantías ya implementadas. El diagnóstico completo está en docs/DIAGNOSTICO_TRANSPARENCIA.md.
