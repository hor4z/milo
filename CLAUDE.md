# Guía visual para melu

Un prototipo que corre, hecho para decidir la identidad visual nueva de melu: densidad,
color, radios, relieve y unos cuantos patrones de interacción. No es un producto ni una
librería: es la guía, con el sistema funcionando en pantallas reales en vez de en una lámina
de estilos.

Lo que se decida acá se porta a `~/melu/packages/ui`, que es el design system de verdad.

```sh
npm install
npm run dev        # el kit  · http://localhost:5190
npm run dev:guide  # la app  · http://localhost:5180
npm run typecheck  # todo el monorepo de una
```

## De dónde salió

Arrancó como "clonar https://ui8-brainwave-2.vercel.app" y derivó en calibrar el sistema de
melu contra esa referencia. **Brainwave 2 es un template comercial de UI8 y no está
licenciado acá.** Lo que hay en este repo es código, iconos y contenido propios; de la
referencia se tomaron medidas y recetas de sombra, que es lo que hace cualquier diseñador con
una referencia enfrente.

Ese límite importa para el futuro: **no seguir igualando pantalla por pantalla hasta que no
quede diferencia.** El conjunto completo ya armado es el producto que UI8 vende. Si hace falta
ese estilo tal cual, el camino es comprar la licencia (unos cientos de dólares, viene con el
código fuente). Si no, las pantallas que falten se resuelven con criterio propio.

## Arquitectura

El stack es el de melu a propósito —React 19 + Tailwind v4 + Vite— y la capa de tokens tiene
la misma forma que `packages/ui`, así portar es copiar valores y no traducir un sistema:

```
packages/tokens/src/primitives.css   valores crudos: la rampa, el canto, los tintes, el azul
packages/tokens/src/semantic.css     los roles: --surface, --border, --text, --relief-*, --switch-*
packages/tokens/src/scales.css       radios, medidas del shell, tipografía, movimiento
packages/ui/src/theme.css            el puente: Tailwind leyendo los tokens + las clases de relieve
```

Los componentes se estilan **solo** contra roles: ninguno sabe que existe `--shade-03`, sabe
que hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug.

Con el monorepo, el `@source` va **dos veces** y las dos hacen falta: el de
`packages/ui/src/theme.css` cubre los componentes del paquete, y el `app.css` de cada app
declara los archivos de esa app. Tailwind v4 arranca la detección automática en el root de
Vite, que ahora es la carpeta de la app y no la del CSS, así que ninguno de los dos alcanza
solo. Cuando falta uno **falla en silencio, sin estilos**: la clase queda en el HTML sin
efecto y no hay error.

## El sistema

**Tipografía.** Geist para todo —interfaz y portadas— y Geist Mono para lo monoespaciado, las
dos por Google Fonts. Display y cuerpo son la misma familia a propósito: a 40px lo que separa un
título del cuerpo es el tamaño y el tracking, no un dibujo distinto de la letra, y dos familias
que se parecen es lo peor de los dos mundos. Antes eran Inter, Inter Tight y JetBrains Mono.

**Densidad.** Base 12px, peso 500, line-height fijo de 16. El 500 de base se decidió contra
Inter, donde el 400 a 12px se leía lavado sobre un fondo casi blanco; con Geist ese número no se
volvió a medir. El line-height único es para que dos filas de 12 y de 14 sigan alineadas entre
sí.

Escala de texto: `2xs` 11 (kbd, metadatos) · `xs` 12 (la interfaz) · `base` 14 (botones y
énfasis) · `lg` 20 (título de pantalla) · `display` 40 (portadas).

**Medidas del shell.** Sidebar 220 `fixed` (72 contraído) · topbar 80 · padding lateral 20 ·
item de nav 40 con radio 12 y el icono en un cuadro de 34 · sangría de subitems 48.

**Controles.** Tres alturas y un rol cada una: `sm` 32 inline en una fila densa · `md` 36
acciones dentro de un panel · `lg` 40 la acción principal. Del `md` para arriba el texto es
14/600 y el radio 12: un botón con el mismo tamaño de letra que su entorno no se lee como
accionable.

**Radios.** `sm` 6 marcas hundidas · `md` 10 lo cuadrado que se toca · `lg` 12 lo que se toca
con texto · `xl` 16 lo que va adentro de una tarjeta · `2xl` 24 contenedores.

La regla del anidado: **el radio de un hijo es el del padre menos el padding del padre.** Un
24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve
doble; si queda más cuadrado que el padre, se ven dos curvas distintas. Los dos errores ya
pasaron acá (el segmented chico tenía 6 donde iban 10).

**Color.** Rampa casi neutra de nueve pasos, de `#fcfcfc` a `#121212`. El salto de 05
(`#e2e2e2`) a 06 (`#7b7b7b`) es violento a propósito: entre el borde más oscuro y el texto más
claro no tiene que haber nada, o aparecen grises que no se distinguen. Bordes y hovers se
pintan con tinta en alpha, no con un gris opaco: sobre un tinte, el opaco se ve como una línea
sucia.

La interfaz es **monocroma**. El acento (`#d2691e`) se usa poquísimo —un punto, un badge— y por
eso se ve.

Hay dos excepciones, las dos deliberadas y las dos acotadas a una pieza:

- **El azul de marca** (`--blue-400/500/600`, rampa de tres pasos). Es la variante `brand` del
  botón y el arco del spinner, y nada más. `solid` y `brand` son el mismo rol —el botón que
  manda— así que va uno o el otro, nunca los dos en la misma pantalla, o la mirada no sabe cuál
  es. El 600 hace de canto y de labio, y su valor no se elige a ojo: sale de reproducir el salto
  que el botón gris usa entre su relleno y su canto (1.14:1). Con un salto más corto el canto
  desaparece y el botón se ve como un rectángulo pintado.
- **Las marcas de la lista** (`--mark-*`, en pares relleno/glifo). El círculo que identifica una
  fila en la lista de acciones. Relleno pastel y glifo del mismo tono varios pasos más oscuro, y
  eso es deliberado: la marca es de 44 y vive dentro de una fila clara, así que tiene lugar para
  leerse entera sin gritarle al título de al lado. En oscuro se invierten —relleno profundo,
  glifo pastel— porque un pastel de relleno sobre `#131313` es una mancha de luz.
- **Las etiquetas de color** (`--label-*` + `--on-label`). La familia viva de lo chico: un chip,
  la inicial de un avatar, el cuadradito de icono de una tarjeta. Salen de la regla de la familia
  y por eso las seis llevan el mismo texto blanco. Van en orden de rueda porque el avatar reparte
  por hash sobre el índice: con los tonos desordenados, dos nombres consecutivos caían en dos
  tonos casi iguales.

**Las tres paletas de categoría son tres roles y no se mezclan**, y la que las separa es el
tamaño de la pieza:

| | para qué | contenido encima |
|---|---|---|
| `--mark-*` | la marca de 44 de una fila de lista | glifo del mismo tono, oscuro |
| `--label-*` | lo chico: chip, avatar, cuadradito de icono | texto o glifo blanco |
| `--tint-*` | la superficie grande: el hueco 4:3 de una tarjeta, el mock de una novedad, el costado de entrar | un dibujo en tinta al 14% |

Los tres roles vivieron un rato en `--tint-*`, y de ahí salieron dos bugs: los chips quedaron
pastel cuando ya tenían que ser vivos, y al pasar la familia a vivos se llevó puesta la marca de
la lista, que tenía que quedar pastel. **Antes de teñir algo, mirar de qué tamaño es la pieza y
qué va encima.**

El relieve del azul va **más flojo** que el del gris, y no es cuestión de gusto: sobre un relleno
saturado, el mismo relieve que el gris necesita para despegarse del papel se ve exagerado. Filo de
luz al 16% en vez de 28%, labio sin spread, y la caída a un tercio.

**Relieve.** Es lo que le da carácter y lo que más costó acertar. Cinco recetas, todas mezclando
luz interior arriba y sombra abajo:

| receta | para qué |
|---|---|
| `--relief-raised` | el botón gris que sobresale: degradado + luz al 33% + canto + caída corta |
| `--relief-solid` | el botón oscuro: luz al 15% arriba, labio oscuro abajo, canto un paso más claro |
| `--relief-pressed` | un toggle mientras su panel está abierto: la sombra entra desde abajo, sin canto |
| `--relief-inset` | lo hundido que es una marca: kbd, pista de un segmented (lleva canto y caída) |
| `--relief-card` / `-toolbar` / `-popover` | elevación en capas de alpha bajo con spread negativo |

Dos aprendizajes que quedaron escritos al lado de cada token:

- **El canto no es un escalón de la rampa.** `--edge` (`#d4d4d4`) es más oscuro que el borde más
  oscuro, porque tiene que dibujar el filo de algo que sobresale. Con `--shade-05` puesto ahí, el
  botón gris se ve plano sobre un fondo casi blanco.
- **Hundido son dos cosas distintas.** Una marca lleva canto y sombra de caída; algo que se
  aprieta, no. Mezclarlas hace que un kbd y un toggle activo se vean igual.

**Iconos.** Material Symbols Rounded, subseteado a los 152 que usamos y servido desde el repo
(57 KB de woff2). El peso y el relleno son ejes reales de la fuente —`wght` de 100 a 700 y `FILL`
de 0 a 1—, no variantes generadas: por eso el set es una fuente y no SVG. Los dibujos de Material
son contornos rellenos y no trazos, así que el peso está horneado en la geometría y con SVG haría
falta un archivo por combinación. Google hace lo mismo en Flutter y en Material Web.

Escala de tamaños: 12 · 14 · 16 · 18 · 20 · 22. Solo pares — con una fuente, un tamaño impar cae
en media grilla de píxeles y se ve borroso.

**El gris de un icono no es una prop, es la utilidad `icon-muted`.** La regla vieja decía "icono
en gris ⇒ `weight 1.5`" y era imposible de cumplir: el gris muchas veces lo hereda de un ancestro
—un `IconButton` apagado, un item de nav inactivo, el placeholder de un `Select`— y el call site
no tiene forma de saberlo. Con la utilidad, poner el gris sube el peso a 400 solo.

Corolario que cuesta ver: **`Icon` no escribe `--icon-wght` salvo que le pasen `weight`.** Un
estilo inline le gana a una clase, así que con un default escrito siempre, `icon-muted` no podía
subir nada y la grilla del kit no podía fijar el peso de todos sus glifos de una.

Las carpetas de espacios (`FolderIcon`) son la excepción y el único SVG que queda: son bicolor
—relleno al 13% y una línea al 55% del mismo tono— y una fuente monocroma no puede hacer eso. El
color propio por espacio es el punto: es lo que las deja reconocer de reojo en una lista de siete.

**El estado activo no se marca con color, se marca con relieve o con canto.** En una interfaz
monocroma eso distingue más que teñir el texto, y no gasta el único acento que hay. Corolario
que se rompió tres veces: **el texto de un item inactivo va en tinta, no en gris.** Con la
etiqueta apagada, una lista de siete espacios se lee como si estuviera deshabilitada.

## Patrones que vale la pena portar

- **Ajustes en un modal, no en una página.** Rail de 180 que no scrollea + panel que sí. Al
  cerrar no hay navegación: seguís donde estabas, con el scroll donde lo dejaste. Por eso el
  fondo se atenúa apenas (14%) en vez de lavarse.
- **Panel anclado con velo** (`Popover` con `veil`). Una lista que pide leerse entera necesita
  que el resto se apague; un menú de cuatro items, no. El velo va sin blur: el fondo se sigue
  reconociendo.
- **Paleta de comandos (⌘K).** Busca sin tildes, agrupa sin reordenar, y el índice activo vuelve
  a 0 en cada tecleo.
- **Un solo `Segmented`** para el filtro de texto y para el conmutador de grilla/lista. Dos
  implementaciones del mismo control se separan sola una de la otra con cada cambio.
- **Las tarjetas no se mueven en hover** y no tienen acciones flotando encima: una grilla que
  salta hace temblar la vista, y un botón que aparece al pasar el mouse no se descubre sin mouse
  y tapa justo lo que estabas mirando.

## Overlays: lo que costó y conviene no volver a pelear

Todo en `packages/ui/src/overlay.tsx`.

- **El `Portal` crea su host durante el render**, no en un effect. La versión obvia —crearlo en el
  effect y guardarlo en estado— hace que el primer render devuelva `null`, y eso rompe a
  cualquiera que mida o enfoque el contenido: en el commit en el que el overlay "ya abrió", sus
  nodos todavía no existen.
- **El foco se pone y después se verifica.** Enfocar una vez y confiar no alcanza: entre el effect
  y el frame siguiente el nodo puede desprenderse y volver a colgarse (React reejecuta los
  effects en desarrollo) y el foco se cae al `<body>` sin avisar. Se reintenta en dos frames
  mientras el foco no esté adentro.
- **Se enfoca el contenedor del diálogo, no su primer control.** El navegador scrollea para traer
  a la vista lo que enfoca, así que enfocar "el primero enfocable" abría el panel corrido 39px con
  la primera fila tapada. `preventScroll` de cinturón, y `[data-autofocus]` para el caso que sí
  quiere un campo (la paleta).
- **`Escape` usa una pila global**: cierra el overlay de arriba y no todos.
- **El bloqueo de scroll compensa el ancho de la scrollbar.** Sin eso la página salta a la derecha
  justo al abrir el modal. El contador es para overlays anidados.
- **`scroll` en captura hay que filtrarlo por origen.** La captura es la única forma de enterarse
  del scroll de la página, pero atrapa el de cualquier hijo: sin filtrar, scrollear la lista del
  propio panel lo cerraba. Un `resize` sí cierra siempre.
- **Cerrar con `pointerdown` y no con `click`**: con click, el mismo gesto que abre otro panel lo
  cierra y lo reabre, y parpadea.
- **El `Select` es un botón con listbox propio, no un `<select>` nativo.** `appearance: none` te
  saca la flecha, pero la lista desplegada la sigue dibujando el sistema operativo, así que en
  Linux aparece un control de GTK en medio de la interfaz — se ve "sin estilo" por más que la caja
  esté bien. El costo es traer el teclado a mano: flechas, Enter, Escape, Home/End.

## Trampa de Tailwind v4 que ya mordió dos veces

Si tocás un token dentro del bloque `@theme` con el dev server corriendo, Tailwind puede quedarse
con el CSS viejo y **la utilidad no se genera, en silencio y sin error**: la clase queda en el
HTML sin efecto. Así estuvo `bg-scrim` sin aplicar durante varias rondas (el backdrop del modal
era solo blur).

```sh
rm -rf node_modules/.vite   # y reiniciar vite
```

Antes de dar por bueno un color nuevo, verificar que la regla exista:

```sh
curl -s http://localhost:5190/src/app.css | grep -o '\.text-icon-muted[^}]*}'
```

## Agregar un icono

El set son 152 de los más de 3900 de Material Symbols. Agregar uno **no es dibujar un path**, es
un comando, y el que lo corre no tiene que acordarse de nada:

```sh
npm run icons -w @melu/ui -- search notification   # busca en el catálogo, offline
npm run icons -w @melu/ui -- add rocket_launch     # agrega y regenera todo
npm run icons -w @melu/ui -- check                 # usados que faltan, y al revés
npm run icons -w @melu/ui -- refresh               # rebaja el catálogo desde Google
```

`add` hace tres preguntas antes de bajar nada, y las hace el script y no el prompt:

1. **¿el nombre existe?** Si no, sugiere los cinco más parecidos por distancia de edición.
2. **¿ya lo tenemos?** Si sí, no baja nada y lo dice.
3. **¿hay uno mejor?** Compara los tags del candidato contra todo el set y muestra los que
   comparten dos o más: *"ya tenés `tune` — ¿seguro que querés `settings_input_component`?"*.
   Para saltearlo hay que escribir `--yes`. Esto es lo que evita llegar a doscientos iconos con
   seis variantes de engranaje.

La regla: **el set crece solo por `icons add`, y un icono que no renderiza ningún call site no va
en el manifiesto.** `icons check` es lo que lo audita, y corre al lado de `typecheck`.

El catálogo podado (3912 iconos con codepoint, popularidad y tags) está versionado en
`packages/ui/scripts/catalog.json` para que buscar funcione sin internet — el mismo argumento por
el que las caras de los avatares están commiteadas. Nunca llega al browser: al bundle solo van los
codepoints, y los tags viajan por el subpath `@melu/ui/icons.meta`, que importa únicamente la
galería del kit.

Los tags son los de Google y están en inglés: "calendar" encuentra `calendar_month`, "calendario"
no encuentra nada.

## Estructura

Monorepo de npm workspaces. Dos paquetes y dos apps:

```
packages/tokens/src/    la identidad, en CSS puro. Sin Tailwind y sin JS.
packages/ui/src/        theme.css (el puente) · index.ts (la puerta) ·
                        primitives · icon · overlay · nav · list · table · book ·
                        folder · page · prefs
                        icons.gen.ts e icons.meta.ts los genera scripts/icons.mjs
packages/ui/scripts/    icons.mjs (search · add · sync · check) + catalog.json
apps/kit/src/           la galería, estilo storybook: intro.tsx (la portada) ·
                        kit.tsx (los andamios) · tokens/ (color · type ·
                        measure · relief) · stories/ (una por componente)
apps/guide/src/         el prototipo: screens/ · data.ts · ui/ (shell ·
                        command-palette · notifications · composer ·
                        activity-card · settings-modal)
```

**El corte entre el paquete y la app es por dependencia, no por gusto.** Lo que está en
`packages/ui` no sabe que existen `data.ts` ni el router; lo que los lee es producto y se
queda en `apps/guide`. Por eso el shell y la paleta de comandos no están en el paquete
todavía, y por eso el kit puede depender solo de `@melu/ui`.

Todo lo que consume una app entra por `packages/ui/src/index.ts`. Un import a
`@melu/ui/src/primitives` desde afuera ataría la app al reparto interno de archivos, y mover
una pieza de un archivo a otro pasaría a ser un cambio que rompe.

`packages/ui` es además el ensayo del port: tiene la forma que va a tener `~/melu/packages/ui`,
así que mudarlo es copiar la carpeta y no traducir un sistema.

**El kit va con una historia por pieza, no con pantallas temáticas.** La primera versión tenía
seis pantallas largas —"Controles" era una sola con botones, campos, toggles y marcas— y
encontrar el switch era scrollear buscándolo. Con una por componente, el riel es el índice y
cada pantalla entra casi entera de una vez, que es cuando un muestrario sirve: lo que se mira
son las diferencias entre variantes vecinas, y para eso tienen que estar a la vista juntas.

**El riel del kit usa la receta del sidebar del producto** (`navItemClass` + `NavItemBody`), no
una copia parecida. Esa geometría estaba escrita cuatro veces dentro de `shell.tsx` y una
quinta en el kit, y la quinta fue la que se desincronizó: marcaba el activo con
`--relief-pressed` —la receta de un toggle mientras su panel está abierto— en vez del anillo de
un píxel con el chip de papel. Ahora vive solo en `packages/ui/src/nav.tsx`.

`prefs` aplica el tema en `<html>` y no en un wrapper: los portales viven en el `<body>`, fuera
de cualquier wrapper de React, y un `data-theme` en un div no los alcanza.

## Pendiente

- **Revisar los números que se calibraron contra Inter.** El peso 500 de base y el
  `--tracking-tight` de -0.015em salieron de mirar Inter a 12px; la familia ahora es Geist y
  ninguno de los dos se volvió a mirar. Geist tiene otra altura de x y otro ancho, así que lo
  más probable es que al menos el tracking quiera otro valor.
- **`planes` y `entrar`** siguen con las medidas viejas (14px, sin relieve).
- **El foco se come el relieve.** El `:focus-visible` global pisa el `box-shadow` completo, así que
  un botón enfocado con teclado queda plano. Le pasa a `raised`, a `solid` y a `brand` por igual.
  Se arregla sumando el relieve dentro de la regla de foco, una vez para todas las variantes.
- **El shell y la paleta de comandos siguen en `apps/guide`** porque leen `data.ts`. Para que
  entren al paquete hay que pasarles el contenido por props.
- **`README.md` quedó desactualizado**: describe la primera identidad (jade y ámbar, radios
  3·6·8·10·14) que después se reemplazó por la rampa neutra y la escala 6·10·12·16·24.
- Portar los tokens a `~/melu/packages/ui`, que es para lo que existe todo esto.
- ~~Dibujar un set de iconos macizo propio~~. Cerrado: el set es Material Symbols, y el "se ven
  livianos" se resuelve con el eje `wght` en vez de con un `strokeWidth` inventado. `--icon-muted`
  sobrevive igual, porque a `FILL 0` los glifos siguen siendo contornos.

## Lo que no está

No hay backend ni datos reales, y nada persiste salvo las preferencias. Los medios de las
tarjetas son geometría derivada del id, no imágenes: una grilla de fotos se ve linda y no dice
nada del contenido.
