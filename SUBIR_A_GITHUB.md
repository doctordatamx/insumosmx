# Subir el observatorio a GitHub

## Contenido

Este paquete contiene la aplicación, código, datos públicos transformados, snapshot preservado, documentación, pruebas y licencia. No incluye el ZIP original de 61 MB, catálogos geográficos brutos, archivos temporales, credenciales, otros paquetes ZIP ni la carpeta `_site` generada.

**Descomprime el ZIP y sube su contenido. No subas el ZIP como si fuera el sitio.** `index.html` y las carpetas `data`, `scripts`, `vendor`, `docs` y `.github` deben quedar en la raíz del repositorio.

## Carga por navegador

1. Crea un repositorio en GitHub. Para un proyecto abierto puede usarse un repositorio público, siempre sujeto a las condiciones de las fuentes documentadas en DATA_PROVENANCE.md.
2. En el repositorio, selecciona **Add file → Upload files**.
3. Sube los archivos y carpetas conservando su estructura. El límite documentado del navegador es 25 MiB por archivo y 100 archivos por tanda; este paquete verifica que cada archivo está por debajo del límite individual. Si se supera la cantidad por tanda, separa la carga, por ejemplo raíz y `data` primero, después `docs`, `scripts`, `vendor`, `legacy` y `.github`.
4. Incluye `.github`: contiene el workflow manual de validación y publicación. Si el navegador no acepta esa carpeta, utiliza GitHub Desktop para copiar y sincronizar el contenido completo.
5. Confirma los cambios. Si ya hay reglas de protección de rama, utiliza una rama y PR según la configuración del repositorio.

Fuente: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository

## Validar sin publicar

En **Actions**, elige **Validar y publicar manualmente** y pulsa **Run workflow**. Deja `publish` desmarcado. Se ejecutan comprobaciones del corte incluido y se construye el sitio; no se despliega.

Las pruebas numéricas de referencia corresponden al corte incluido. Si se cambian los datos, deben revisarse esas referencias mediante un proceso documentado; no se deben cambiar sólo para forzar una aprobación.

## Publicación manual en GitHub Pages

Una vez revisados los bloqueos del diagnóstico y los resultados:

1. Ve a **Settings → Pages → Build and deployment → Source** y selecciona **GitHub Actions**.
2. En **Actions → Validar y publicar manualmente → Run workflow**, marca `publish` para solicitar el despliegue.
3. El despliegue depende de que pasen las comprobaciones y de los permisos/reglas reales del repositorio. El job `deploy` muestra la dirección final del sitio.

Referencia: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## Diferencias deliberadas de este paquete

- El workflow de Pages es manual; no se ejecuta publicación por un simple push.
- La actualización mensual original está conservada como **plantilla inactiva** en `.github/workflow-templates/refresh-original.yml`. No está dentro de `.github/workflows`; no actualiza datos, no escribe a main ni despliega por sí sola.
- El paquete no crea un repositorio, no configura protección de ramas ni publica nada desde esta conversación. Tampoco habilita el canal de rectificaciones.
- La auditoría de staging/promoción segura de nuevos datos, revisión de permisos, dependencias y aspectos profesionales sigue pendiente. El gate de este paquete valida la referencia incluida; no sustituye esa auditoría ni certifica cumplimiento jurídico.

El código local de desarrollo conserva sus workflows originales; este perfil de empaquetado aplica las variantes anteriores de forma explícita y reproducible en `scripts/package_github.py`.

## Comprobación de integridad

`GITHUB_PACKAGE_MANIFEST.json` registra tamaño y SHA-256 de los archivos del paquete, excepto del propio manifiesto. El hash del ZIP se entrega en un archivo `.sha256` junto al ZIP. No subas ese ZIP al repositorio como sustituto de su contenido.
