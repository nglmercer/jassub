<h1 align="center">
  JASSUB
</h1>
<p align="center">
  Renderizador de subtítulos SSA/ASS en JavaScript.
</p>
JASSUB es un wrapper de JS para <a href="https://github.com/libass/libass">libass</a>, que renderiza <a href="https://en.wikipedia.org/wiki/SubStation_Alpha">subtítulos SSA/ASS</a> directamente en tu navegador. Utiliza Emscripten para compilar el código C++ de libass a WASM.

<p align="center">
  <a href="https://thaunknown.github.io/jassub/">Demos Online</a>
</p>

## Características
- Soporta la mayoría de las características de SSA/ASS (todo lo que soporta libass)
- Soporta todas las fuentes OpenType, TrueType y WOFF, así como fuentes incrustadas
- Soporta videos anamórficos [(en navegadores que lo soporten)](https://caniuse.com/mdn-api_htmlvideoelement_requestvideoframecallback)
- Soporta diferentes espacios de color de video [(en navegadores que lo soporten)](https://caniuse.com/mdn-api_videocolorspace)
- Capaz de usar fuentes locales [(en navegadores que lo soporten)](https://caniuse.com/mdn-api_window_querylocalfonts)
- Funciona rápido (todo el trabajo pesado lo hace WebAssembly)
- Es totalmente multi-hilo (en navegadores que lo soporten, es capaz de trabajar completamente en un hilo separado)
- Es asíncrono (renderiza cuando está disponible, no en orden de ejecución)
- Se beneficia de la aceleración por hardware (utiliza las API de canvas aceleradas por hardware)
- No manipula el DOM para renderizar subtítulos
- Fácil de usar - solo conéctalo a un elemento de video

## ¿No es esto lo mismo que JavascriptSubtitlesOctopus?
No. Mira <a href="https://thaunknown.github.io/jassub/explainer.html">esta</a> comparación.

## Uso
Por defecto, todo lo que necesitas hacer es copiar los archivos de la carpeta `dist/` del repositorio en la misma carpeta donde se ejecuta tu JS, luego haz:
```js
import JASSUB from './jassub.es.js'

const renderer = new JASSUB({
  video: document.querySelector('video'),
  subUrl: './tracks/sub.ass'
})
```
`Nota:` aunque la carpeta `dist/` incluye un dist UMD, todavía usa sintaxis moderna. Si quieres compatibilidad con navegadores antiguos, te recomiendo que lo ejecutes a través de babel.

Si usas un bundler como Vite, puedes hacer en cambio:
```shell
npm i jassub
```

```js
import JASSUB from 'jassub'
import workerUrl from 'jassub/dist/jassub-worker.js?url'
import wasmUrl from 'jassub/dist/jassub-worker.wasm?url'

const renderer = new JASSUB({
  video: document.querySelector('video'),
  subContent: subtitleString,
  workerUrl, // también puedes usar: `new URL('jassub/dist/jassub-worker.js', import.meta.url)` en lugar de importarlo como una url
  wasmUrl
})
```
## Usando solo con canvas
También puedes usarlo sin ningún video. Sin embargo, eso requiere que establezcas el tiempo en el que los subtítulos deben renderizarse:
```js
import JASSUB from './jassub.es.js'

const renderer = new JASSUB({
  canvas: document.querySelector('canvas'),
  subUrl: './tracks/sub.ass'
})

renderer.setCurrentTime(15)
```
## Cambiando subtítulos
No estás limitado a solo mostrar el archivo de subtítulos que referenciaste en tus opciones. Puedes cambiar dinámicamente los subtítulos sobre la marcha. Hay tres métodos que puedes usar específicamente para esto:

- `setTrackByUrl(url):` funciona igual que la opción `subUrl`. Establecerá el subtítulo a mostrar por su URL.
- `setTrack(content):` funciona igual que la opción `subContent`. Establecerá el subtítulo a mostrar por su contenido.
- `freeTrack():` esto simplemente elimina los subtítulos. Puedes usar los dos métodos anteriores para establecer un nuevo archivo de subtítulos para ser mostrado.
```js
renderer.setTrackByUrl('/newsub.ass')
```
## Limpiando el objeto
Después de que hayas terminado de renderizar los subtítulos. Necesitas llamar al método `destroy()` para destruir correctamente el objeto.
```js
const renderer = new JASSUB(options)
// Después de que hayas terminado de usarlo...
renderer.destroy()
```
## Opciones
Las opciones por defecto son las mejores, y automáticamente recurren a las siguientes opciones más rápidas en línea, cuando las API que usan no son soportadas. Sin embargo, puedes cambiar forzosamente este comportamiento especificando opciones. Estas opciones están incluidas en el JSDoc del objeto, así que si tu editor soporta JSDoc IntelliSense verás estas descripciones exactas al llamar a los métodos y especificar las opciones.

- `{Object} options` Objeto de configuración.
- `{HTMLVideoElement} options.video` Video para usar como objetivo para renderizar y escuchar eventos. Opcional si se especifica canvas en su lugar.
- `{HTMLCanvasElement} options.canvas` { Opcional } Canvas para usar para el manejo manual. No requerido si se especifica video.
- `{'js'|'wasm'} options.blendMode` { Opcional = 'js' } Qué modo de mezcla de imagen usar. WASM funcionará mejor en dispositivos de gama baja, JS funcionará mejor si el dispositivo y el navegador soportan la aceleración por hardware.
- `{Boolean} options.asyncRender` { Opcional = true } Si usar o no renderizado asíncrono, que descarga la CPU creando bitmaps de imagen en la GPU.
- `{Boolean} options.offscreenRender` { Opcional = true } Si renderizar o no las cosas completamente en el worker, reduce en gran medida el uso de la CPU.
- `{Boolean} options.onDemandRender` { Opcional = true } Si renderizar o no los subtítulos a medida que el reproductor de video renderiza los fotogramas, en lugar de predecir en qué fotograma está el reproductor usando eventos.
- `{Number} options.targetFps` { Opcional = true } FPS objetivo para renderizar los subtítulos. Ignorado cuando onDemandRender está habilitado.
- `{Number} options.timeOffset` { Opcional = 0 } Desplazamiento de tiempo del subtítulo en segundos.
- `{Boolean} options.debug` { Opcional = false } Si imprimir o no información de depuración.
- `{Number} options.prescaleFactor` { Opcional = 1.0 } Reduce la escala (< 1.0) del canvas de subtítulos para mejorar el rendimiento a expensas de la calidad, o aumenta la escala (> 1.0).
- `{Number} options.prescaleHeightLimit` { Opcional = 1080 } La altura en píxeles más allá de la cual el canvas de subtítulos no se reducirá.
- `{Number} options.maxRenderHeight` { Opcional = 0 } La altura máxima de renderizado en píxeles del canvas de subtítulos. Más allá de esto, los subtítulos serán escalados por el navegador.
- `{Boolean} options.dropAllAnimations` { Opcional = false } Intenta descartar todas las etiquetas animadas. Habilitar esto puede destrozar severamente los subtítulos complejos y solo debe considerarse como un último esfuerzo de éxito incierto para hardware que de otra manera es incapaz de mostrar nada. No funcionará de manera confiable con eventos editados o asignados manualmente.
- `{Boolean} options.dropAllBlur` { Opcional = false } El santo grial de las ganancias de rendimiento. Si un TS pesado se retrasa mucho, deshabilitar esto lo hará ~x10 más rápido. Esto elimina el desenfoque de todas las pistas de subtítulos añadidas, haciendo que la mayoría del texto y los fondos se vean más nítidos, esto es mucho menos intrusivo que eliminar todas las animaciones, al tiempo que ofrece importantes ganancias de rendimiento.
- `{String} options.workerUrl` { Opcional = 'jassub-worker.js' } La URL del worker.
- `{String} options.wasmUrl` { Opcional = 'jassub-worker.wasm' } La URL del worker WASM.
- `{String} options.legacyWasmUrl` { Opcional = 'jassub-worker.wasm.js' } La URL del worker WASM legado. Solo se carga si el navegador no soporta WASM.
- `{String} options.modernWasmUrl` { Opcional } La URL del worker WASM moderno. Esto incluye instrucciones ASM más rápidas, pero solo es soportado por navegadores más nuevos, deshabilitado si la URL no está definida.
- `{String} [options.subUrl=options.subContent]` La URL del archivo de subtítulos para reproducir.
- `{String} [options.subContent=options.subUrl]` El contenido del archivo de subtítulos para reproducir.
- `{String[]|Uint8Array[]} options.fonts` { Opcional } Un array de enlaces o Uint8Arrays a las fuentes usadas en el subtítulo. Si se usa Uint8Array, el array se copia, no se referencia. Esto fuerza a que todas las fuentes en este array sean cargadas por el renderizador, independientemente de si se usan o no.
- `{Object} options.availableFonts` { Opcional = {'liberation sans': './default.woff2'}} Objeto con todas las fuentes disponibles - La clave es la familia de fuentes en minúsculas, el valor es el enlace o Uint8Array: { arial: '/font1.ttf' }. Estas fuentes se cargan selectivamente si se detectan como usadas en la pista de subtítulos actual.
- `{String} options.fallbackFont` { Opcional = 'liberation sans' } La clave de la familia de fuentes de la fuente de respaldo en availableFonts para usar si la otra fuente para el estilo carece de glifos especiales o unicode.
- `{Boolean} options.useLocalFonts` { Opcional = false } Si la API de Acceso a Fuentes Locales está habilitada [chrome://flags/#font-access], la biblioteca consultará los permisos para usar fuentes locales y las usará si falta alguna. El permiso se puede consultar de antemano usando navigator.permissions.request({ name: 'local-fonts' }).
- `{Number} options.libassMemoryLimit` { Opcional } Límite de memoria de la caché de bitmaps de libass en MiB (aproximado).
- `{Number} options.libassGlyphLimit` { Opcional } Límite de memoria de la caché de glifos de libass en MiB (aproximado).

## Métodos y propiedades
Esta biblioteca tiene muchos métodos y propiedades, sin embargo, muchos no están hechos para uso manual o no tienen efecto al cambiar, esos generalmente tienen el prefijo `_`. La mayoría de estos nunca necesitan ser llamados por el usuario.

### Lista de propiedades:
  - `debug` - -||-
  - `prescaleFactor` - -||-
  - `prescaleHeightLimit` - -||-
  - `maxRenderHeight` - -||-
  - `busy` - Booleano que especifica si el renderizador está actualmente ocupado. 
  - `timeOffset` - -||-
### Lista de métodos:
- `resize(width = 0, height = 0, top = 0, left = 0, force)` - Redimensiona el canvas a los parámetros dados. Autogenerado si los valores son omitidos.
  - {Number} [width=0]
  - {Number} [height=0]
  - {Number} [top=0]
  - {Number} [left=0]
  - {Boolean} force
- `setVideo(video)` - Cambia el video para usar como objetivo para los listeners de eventos.
  - {HTMLVideoElement} video
- `setTrackByUrl(url)` - Sobreescribe el contenido actual del subtítulo.
  - {String} url URL para cargar los subtítulos desde.
- `setTrack(content)` - Sobreescribe el contenido actual del subtítulo.
  - {String} content Contenido del archivo ASS.
- `freeTrack()` - Libera la pista de subtítulos actualmente en uso.
- `setIsPaused(isPaused)` - Establece el estado de reproducción del medio.
  - {Boolean} isPaused Pausa/Reproduce la reproducción de subtítulos.
- `setRate(rate)` - Establece la velocidad de reproducción del medio [multiplicador de velocidad].
  - {Number} rate Velocidad de reproducción.
- `setCurrentTime(isPaused, currentTime, rate)` - Establece el tiempo actual, el estado de reproducción y la velocidad de los subtítulos.
  - {Boolean} [isPaused] Pausa/Reproduce la reproducción de subtítulos.
  - {Number} [currentTime] Tiempo en segundos.
  - {Number} [rate] Velocidad de reproducción.
- `destroy(err)` - Destruye el objeto, el worker, los listeners y todos los datos.
  - {String} [err] Error para lanzar al destruir.
- `sendMessage(target, data = {}, transferable)` - Envía datos y ejecuta la función en el worker.
  - {String} target Función objetivo.
  - {Object} [data] Datos para la función.
  - {Transferable[]} [transferable] Array de transferibles.
- `createEvent(event)` - Crea un nuevo evento ASS directamente.
  - {ASS_Event} event
- `setEvent(event, index)` - Sobreescribe los datos del evento con el índice especificado.
  - {ASS_Event} event
  - {Number} index
- `removeEvent(index)` - Elimina el evento con el índice especificado.
  - {Number} index
- `getEvents(callback)` - Obtiene todos los eventos ASS.
  - {function(Error|null, ASS_Event)} callback Función para llamar cuando el worker devuelve los eventos.
- `createStyle(style)` - Crea un nuevo estilo ASS directamente.
  - {ASS_Style} event
- `setStyle (event, index)` - Sobreescribe los datos del estilo con el índice especificado.
  - {ASS_Style} event
  - {Number} index
- `removeStyle (index)` - Elimina el estilo con el índice especificado.
  - {Number} index
- `getStyles (callback)` - Obtiene todos los estilos ASS.
  - {function(Error|null, ASS_Style)} callback Función para llamar cuando el worker devuelve los estilos.
- `addfont (font)` - Añade una fuente al renderizador.
  - {String|Uint8Array} font Fuente para añadir.

### Propiedades del objeto ASS_Event
- `{Number} Start` - Tiempo de inicio del evento, en formato 0:00:00:00, es decir, Hrs:Mins:Secs:centésimas. Este es el tiempo transcurrido durante la reproducción del script en el que el texto aparecerá en pantalla. ¡Ten en cuenta que hay un solo dígito para las horas!
- `{Number} Duration` - Tiempo de finalización del evento, en formato 0:00:00:00, es decir, Hrs:Mins:Secs:centésimas. Este es el tiempo transcurrido durante la reproducción del script en el que el texto desaparecerá de la pantalla. ¡Ten en cuenta que hay un solo dígito para las horas!
- `{String} Style` - Nombre del estilo. Si es "Default", entonces tu propio estilo *Default será sustituido.
- `{String} Name` - Nombre del personaje. Este es el nombre del personaje que dice el diálogo. Es solo para información, para que el script sea más fácil de seguir al editar/sincronizar.
- `{Number} MarginL` - Margen izquierdo de 4 dígitos. Los valores están en píxeles. Todos los ceros significan que se utilizan los márgenes predeterminados definidos por el estilo.
- `{Number} MarginR` - Margen derecho de 4 dígitos. Los valores están en píxeles. Todos los ceros significan que se utilizan los márgenes predeterminados definidos por el estilo.
- `{Number} MarginV` - Margen inferior de 4 dígitos. Los valores están en píxeles. Todos los ceros significan que se utilizan los márgenes predeterminados definidos por el estilo.
- `{String} Effect` - Efecto de transición. Esto está vacío o contiene información para uno de los tres efectos de transición implementados en SSA v4.x
- `{String} Text` - Texto del subtítulo. Este es el texto real que se mostrará como un subtítulo en la pantalla. Todo después de la novena coma se trata como el texto del subtítulo, por lo que puede incluir comas.
- `{Number} ReadOrder` - Número en orden de lectura de este evento.
- `{Number} Layer` - Índice Z de superposición en el que se renderizará este evento.
- `{Number} _index` - (Interno) índice del evento.

### Propiedades del objeto ASS_Style
  - `{String} Name` El nombre del estilo. Distingue entre mayúsculas y minúsculas. No puede incluir comas.
  - `{String} FontName` El nombre de la fuente tal como lo usa Windows. Distingue entre mayúsculas y minúsculas.
  - `{Number} FontSize` Tamaño de la fuente.
  - `{Number} PrimaryColour` Un entero largo BGR (azul-verde-rojo). Es decir, el orden de los bytes en el equivalente hexadecimal de este número es BBGGRR
  - `{Number} SecondaryColour` Un entero largo BGR (azul-verde-rojo). Es decir, el orden de los bytes en el equivalente hexadecimal de este número es BBGGRR
  - `{Number} OutlineColour` Un entero largo BGR (azul-verde-rojo). Es decir, el orden de los bytes en el equivalente hexadecimal de este número es BBGGRR
  - `{Number} BackColour` Este es el color del contorno o la sombra del subtítulo, si se utilizan. Un entero largo BGR (azul-verde-rojo). Es decir, el orden de los bytes en el equivalente hexadecimal de este número es BBGGRR.
  - `{Number} Bold` Esto define si el texto está en negrita (verdadero) o no (falso). -1 es Verdadero, 0 es Falso. Esto es independiente del atributo Italic: puedes tener texto que sea tanto negrita como cursiva.
  - `{Number} Italic` Cursiva. Esto define si el texto está en cursiva (verdadero) o no (falso). -1 es Verdadero, 0 es Falso. Esto es independiente del atributo negrita: puedes tener texto que sea tanto negrita como cursiva.
  - `{Number} Underline` -1 o 0
  - `{Number} StrikeOut` -1 o 0
  - `{Number} ScaleX` Modifica el ancho de la fuente. [porcentaje]
  - `{Number} ScaleY` Modifica la altura de la fuente. [porcentaje]
  - `{Number} Spacing` Espacio extra entre caracteres. [píxeles]
  - `{Number} Angle` El origen de la rotación está definido por la alineación. Puede ser un número de punto flotante. [grados]
  - `{Number} BorderStyle` 1=Contorno + sombra paralela, 3=Caja opaca
  - `{Number} Outline` Si BorderStyle es 1, entonces esto especifica el ancho del contorno alrededor del texto, en píxeles. Los valores pueden ser 0, 1, 2, 3 o 4.
  - `{Number} Shadow` Si BorderStyle es 1, entonces esto especifica la profundidad de la sombra paralela detrás del texto, en píxeles. Los valores pueden ser 0, 1, 2, 3 o 4. La sombra paralela siempre se usa además de un contorno: SSA forzará un contorno de 1 píxel si no se da un ancho de contorno.
  - `{Number} Alignment` Esto establece cómo se "justifica" el texto dentro de los márgenes izquierdo/derecho en pantalla, y también la colocación vertical. Los valores pueden ser 1=Izquierda, 2=Centrado, 3=Derecha. Añade 4 al valor para un "Toptitle". Añade 8 al valor para un "Midtitle". ej. 5 = título superior justificado a la izquierda
  - `{Number} MarginL` Esto define el margen izquierdo en píxeles. Es la distancia desde el borde izquierdo de la pantalla. Los tres márgenes en pantalla (MarginL, MarginR, MarginV) definen áreas en las que se mostrará el texto del subtítulo.
  - `{Number} MarginR` Esto define el margen derecho en píxeles. Es la distancia desde el borde derecho de la pantalla. Los tres márgenes en pantalla (MarginL, MarginR, MarginV) definen áreas en las que se mostrará el texto del subtítulo.
  - `{Number} MarginV` Esto define el margen vertical izquierdo en píxeles. Para un subtítulo, es la distancia desde la parte inferior de la pantalla. Para un título superior, es la distancia desde la parte superior de la pantalla. Para un título medio, el valor se ignora: el texto se centrará verticalmente.
  - `{Number} Encoding` Esto especifica el conjunto de caracteres o la codificación de la fuente y, en las instalaciones de Windows en varios idiomas, proporciona acceso a los caracteres utilizados en varios idiomas. Suele ser 0 (cero) para Windows en inglés (occidental, ANSI).
  - `{Number} treat_fontname_as_pattern`
  - `{Number} Blur`
  - `{Number} Justify`

# ¿Cómo construir?
## Dependencias
- git
- emscripten (Configurar el entorno)
- make
- python3
- cmake
- pkgconfig
- patch
- libtool
- autotools (autoconf, automake, autopoint)
- gettext
- ragel - Requerido por Harfbuzz
- itstool - Requerido por Fontconfig
- gperf - Requerido por Fontconfig
- licensecheck

## Obtener el código fuente
Ejecuta git clone --recursive https://github.com/ThaUnknown/jassub.git

## Construir dentro de un contenedor
### Docker
1. Instala Docker
2. ./run-docker-build.sh
3. Los artefactos están en /dist/js
### Buildah
1. Instala Buildah y un backend adecuado para buildah run como crun o runc
2. ./run-buildah-build.sh
3. Los artefactos están en /dist/js
## Construir sin contenedores
1. Instala los paquetes de dependencias listados arriba
2. make
    - Si estás en macOS con libtool de brew, LIBTOOLIZE=glibtoolize make
3. Los artefactos están en /dist/js
