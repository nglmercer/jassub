# Estructura del Proyecto JASSUB

Este documento describe la estructura de carpetas y archivos clave del proyecto JASSUB.

## Carpetas Principales

*   **`/` (Raíz):**
    *   Contiene archivos de configuración importantes como `package.json`, `.gitignore`, `.gitmodules`, `Dockerfile`, `Makefile`, `vite.build.js`.
    *   Scripts de ejecución para Docker y builds (`run-*.sh`).
    *   Archivos de licencia (`LICENSE`, `Makefile_licence`) y documentación (`README.md`).
    *   El punto de entrada principal de tipos (`index.d.ts`).
*   **`src/`:**
    *   Contiene el código fuente principal de la biblioteca JASSUB.
    *   Incluye tanto código JavaScript (`jassub.js`, `worker.js`, `pre-worker.js`) como código C++ (`JASSUB.cpp`), sugiriendo una compilación a WebAssembly (WASM).
*   **`lib/`:**
    *   Alberga bibliotecas de terceros o dependencias, probablemente incluidas como submódulos de Git o código fuente directamente.
    *   Ejemplos: `brotli`, `expat`, `fontconfig`, `freetype`, `fribidi`, `harfbuzz`, `libass`. Estas son dependencias comunes para el renderizado de fuentes y subtítulos, probablemente compiladas en el módulo WASM.
*   **`build/`:**
    *   Contiene scripts auxiliares y parches utilizados durante el proceso de compilación.
    *   Incluye herramientas para la gestión de licencias (`license_*.sh`, `license_*.awk`) y parches para las bibliotecas en `lib/`.
*   **`dist/`:**
    *   La carpeta de distribución. Contiene los archivos finales listos para ser utilizados después de ejecutar el script de compilación.
    *   Según `package.json`, aquí se encontrarán los archivos `jassub*`, la fuente por defecto (`default.woff2`) y el archivo `COPYRIGHT`.
*   **`node_modules/`:**
    *   Carpeta estándar de Node.js que contiene las dependencias del proyecto instaladas a través de npm o pnpm.

## Scripts (`package.json`)

*   **`build`:** `node vite.build.js`
    *   Ejecuta el script de compilación principal utilizando Vite. Este proceso genera los archivos finales en la carpeta `dist/`.
*   **`docker:build`:** `docker build -t thaunknown/jassub-build .`
    *   Construye una imagen Docker basada en el `Dockerfile` del proyecto. Útil para crear un entorno de compilación consistente.
*   **`docker:run`:** `docker run -it --rm -v ${PWD}:/code --name thaunknown_jassub-build thaunknown/jassub-build:latest`
    *   Ejecuta un contenedor Docker a partir de la imagen construida, montando el directorio actual del proyecto dentro del contenedor. Esto permite compilar o trabajar con el proyecto dentro del entorno Docker.

## Tests

No se encontró un script específico para ejecutar tests en la sección `scripts` de `package.json`. Los tests podrían ejecutarse a través de los Makefiles, dentro del entorno Docker, o podrían estar ausentes en este repositorio principal.

## Otros Archivos Relevantes

*   **`Makefile`, `functions.mk`, `Makefile_licence`:** Indican el uso de `make` para orquestar partes del proceso de compilación, posiblemente relacionado con las dependencias nativas (C/C++) en `lib/`.
*   **`Dockerfile`, `.dockerignore`, `run-docker-build.sh`:** Definen y gestionan la creación y ejecución de contenedores Docker para el desarrollo o la compilación.
*   **`vite.build.js`:** Script de configuración específico para Vite, utilizado en el script `build`.
*   **`.gitmodules`:** Define los submódulos de Git utilizados en el proyecto (probablemente las bibliotecas en `lib/`).
