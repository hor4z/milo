# milo · design system

El sistema de interfaz de milo: la identidad en tokens, las piezas que la usan, y el sitio
donde se ve todo funcionando. No es una lámina de estilos: cada pieza de acá es el componente
real, con su teclado, sus estados y sus tests.

**El repo es del design system y de nada más.** El UI kit (las 63 piezas) es una parte; las
otras son los tokens y lo que el sitio documenta alrededor. Acá adentro no vive producto: el
prototipo de la app que hubo hasta ahora se borró, y cuando haga falta uno de nuevo se arma
aparte.

Lo que se decide acá se porta a `~/melu/packages/ui`, que es el paquete que hoy consume el
producto. **Ese es otro repo y todavía se llama `melu`**, en el disco y en GitHub; este pasó a
llamarse `milo` (`hor4z/milo`) y el día que se renombre el otro, estas dos líneas y la del
final son lo único que hay que tocar.

```sh
npm install
npm run dev        # el sitio · http://localhost:5190
npm run typecheck  # todo el monorepo de una
npm test           # 677 tests con vitest y testing-library
npm run props      # regenera la tabla de props desde los tipos
```

**Ni raya larga ni comillas angulares, en ningún lado.** Ni en el código, ni en la interfaz, ni
en un commit, ni en la descripción de un PR, ni en una respuesta. Nadie las tiene a mano en un
teclado, así que no aparecen en lo que escribe una persona: cuando aparecen, quien lee siente que
el texto lo escribió una máquina y deja de creerle. En su lugar van los dos puntos, la coma, el
paréntesis y las comillas dobles, que dicen lo mismo. Hay un test que lee el repo entero y falla
si vuelve una.

**El código va en inglés y los comentarios en castellano.** Todo lo que es código (variables,
parámetros, tipos, funciones, props) se escribe en inglés; lo que se lee (los comentarios, los
textos de la interfaz, los nombres de los tests, el contenido de ejemplo) va en castellano. Esa
es la línea, y no hay una tercera categoría.

**El código no lleva comentarios.** Lo único que queda es el docblock `/** */` de una línea por
export y por prop, que no es prosa: lo lee `npm run props` para armar la tabla de cada vista, y lo
muestra el editor al autocompletar. Todo lo demás se sacó: eran mil quinientas líneas de
explicación adentro de los archivos, una tercera copia de lo que ya dicen este archivo y el kit, y
la que se despegaba primero porque nada la verifica. El porqué de cada decisión vive en dos
lugares que sí se leen: acá y las notas de cada vista del kit.

## De dónde salió

Arrancó como "clonar https://ui8-brainwave-2.vercel.app" y derivó en calibrar el sistema de
milo contra esa referencia. **Brainwave 2 es un template comercial de UI8 y no está
licenciado acá.** Lo que hay en este repo es código, iconos y contenido propios; de la
referencia se tomaron medidas y recetas de sombra, que es lo que hace cualquier diseñador con
una referencia enfrente.

Ese límite importa para el futuro: **no seguir igualando pantalla por pantalla hasta que no
quede diferencia.** El conjunto completo ya armado es el producto que UI8 vende. Si hace falta
ese estilo tal cual, el camino es comprar la licencia (unos cientos de dólares, viene con el
código fuente). Si no, las pantallas que falten se resuelven con criterio propio.

## Arquitectura

El stack es React 19 + Vite y **nada más**: el sistema no usa ninguna librería de estilo. El
estilo es CSS nativo, en módulos, contra tokens que también son CSS nativo.

```
packages/tokens/src/primitives.css   valores crudos: la rampa, el canto, los tintes, el azul
packages/tokens/src/semantic.css     los roles: --surface, --border, --text, --relief-*, --switch-*
packages/tokens/src/scales.css       radios, medidas del shell, tipografía, pesos, movimiento
packages/ui/src/styles/reset.css     lo que un navegador trae y no queremos
packages/ui/src/styles/base.css      lo que el sistema define para todos: .mark, .raised, .tabular
packages/ui/src/theme.css            el orden de las capas y los tres imports de arriba
<pieza>/<pieza>.module.css           el estilo de esa pieza y de ninguna otra
```

Los componentes se estilan **solo** contra roles: ninguno sabe que existe `--shade-03`, sabe
que hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug.

**Una app sí puede usar Tailwind, y para eso están los tokens.** El sistema exporta valores en
CSS puro; quien quiera utilidades las arma encima con un `@theme` propio. Lo que no vuelve es
tener las dos cosas: acá adentro un estilo se escribe una vez, en el módulo de su pieza.

**El orden de las capas se declara en `theme.css` y antes que nada.** Una capa vale por dónde se
la declara, no por dónde se usa, y lo que está en una capa siempre pierde contra lo que no está
en ninguna. Las dos veces que esto mordió fueron la misma: el reset ganándole a todo porque su
capa se registró tarde. De ahí que `app.css` se importe en la **primera** línea de `main.tsx`.

El corolario que cuesta ver: una clase global de `base.css` va sin capa, así que le gana a
cualquier módulo. Cuando las dos tienen que convivir (el anillo de un avatar sobre el relieve de
`.mark`) la receta se compone en `base.css`, no se pelea desde el módulo.

`touch-target` es la otra clase que no dibuja nada: con `pointer: coarse` le agranda a un botón el
blanco de toque hasta 44×44 con un `::after`, sin mover la caja. Así la densidad de escritorio queda
intacta y el dedo igual lo encuentra. La pone la pieza, no el call site, porque es la pieza la que
sabe de qué tamaño es.

**Va solo donde toda la superficie es un mismo objetivo**, o sea en un botón. En un campo no: el
`::after` se pinta sobre el contenido, así que se quedaría con el tap que iba al `input` y el cursor
no caería donde tocaste. Los campos llegan a 44 subiendo la caja de verdad, que en algo ancho no
cuesta nada.

`.group` y `.peer` son las dos únicas clases que no dibujan nada: existen para que un módulo
pueda colgar de ellas con `:global(.group)` y estilar a un hijo según el estado del padre, que es
lo único que un módulo no puede expresar solo.

## El sistema: dónde está escrito cada porqué

**El porqué de una decisión de diseño vive en el kit, no acá.** Cada vista de Fundamentos se
renderiza, muestra la pieza real y tiene tests que la sostienen; este archivo no puede hacer
ninguna de las tres cosas. Durante un tiempo lo explicó todo dos veces y las dos versiones
divergieron (llegó a decir que el buscador usaba `--field-bg` mientras los tokens decían otra
cosa), así que ahora dirige en vez de explicar.

| si vas a tocar | leé | y los valores están en |
|---|---|---|
| la escala de texto, los pesos, el interlineado | **Fundamentos › Tipografía** | `tokens/scales.css` |
| la rampa, el azul primario, las superficies | **Fundamentos › Color** | `tokens/primitives.css` · `semantic.css` |
| el espaciado y los radios | **Fundamentos › Medidas y radios** | `tokens/scales.css` |
| los cortes, el mueble y el ancho de lectura | **Fundamentos › Layout** | `tokens/scales.css` |
| las sombras y el volumen | **Fundamentos › Relieve** | `tokens/semantic.css` |
| las duraciones y las curvas | **Fundamentos › Movimiento** | `tokens/scales.css` |
| hover, foco, vacío, cargando, error | **Fundamentos › Estados** | - |
| contraste, teclado, lectores | **Fundamentos › Accesibilidad** | `__tests__/contraste.test.ts` |
| el set y cómo crece | **Fundamentos › Iconos** | `scripts/icons.mjs` |
| qué gráfico va y cuándo una tabla | **Fundamentos › Gráficos** | `chart/` |
| cuándo pasa algo, en qué zona | **Fundamentos › Fecha y hora** | `lib/time.ts` |
| cómo se escribe un número | **Fundamentos › Números y valores** | `lib/number.ts` |
| quién está mirando y qué ve | **Fundamentos › Quién está mirando** | - |
| cómo suena, y cuándo | **Fundamentos › Voz y sonido** | `audio-player/` |
| el texto de la interfaz | **Fundamentos › Cómo se escribe** | - |
| a quién le hablamos | **Fundamentos › Inclusión** | - |

Se abre con `npm run dev` y está en `apps/kit/src/foundations/`. Si una decisión no está en
ninguna de esas vistas, es que todavía no se tomó.

**El grupo Editor** son las piezas del editor de texto enriquecido: la barra de formato, la lista
de comandos que abre la barra, el bloque destacado, la imagen con pie y la cita. `document.tsx` las
arma en una consigna de verdad, que es al editor lo que el dashboard es a la app: la prueba de que
juntas funcionan. Se documentan igual que las demás y la diferencia es de quién las usa: ahí el
contenido lo escribe una persona, no el sistema, y eso cambia las reglas: un `Callout` no usa los
tonos de estado porque no está avisando de nada.

La fórmula y el bloque de código estuvieron y se sacaron: son las dos piezas del editor que traen
un lenguaje propio (MathML una, la gramática de cada lenguaje la otra) y eso es un trabajo aparte
del sistema. Cuando vuelvan, vuelven con esa decisión tomada.

## Las reglas al escribir código

Estas sí van acá: no se ven en una pantalla, así que el kit no puede mostrarlas.

- **Los componentes se estilan solo contra roles.** Ninguno sabe que existe `--shade-03`; sabe que
  hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug, y hay un test.
- **Todo lo que se consume entra por `packages/ui/src/index.ts`.** Un export que no sale por la
  puerta hace fallar un test.
- **Una carpeta por pieza, con su test al lado.** Agregar una pieza es agregar una carpeta, no
  editar cuatro archivos. Dos tests lo sostienen: cada carpeta tiene el componente que le da
  nombre, y cada componente tiene su test.
- **Una pieza suelta no vive adentro de la carpeta de otra.** `filter/` llegó a tener seis exports
  y dos eran controles sueltos (el buscador y el selector de columnas): como no tenían vista
  propia, nadie los encontraba y el buscador terminó dibujado a mano en tres lugares con tres
  alturas distintas. Una carpeta con el nombre de un caso de uso es un cajón.
- **El gris de un icono no es una prop, es la clase `icon-muted`.** El gris se hereda de un
  ancestro (un `IconButton` apagado, un item de nav inactivo) y el call site no tiene cómo saberlo.
  Corolario que cuesta ver: **`Icon` no escribe `--icon-wght` salvo que le pasen `weight`**, porque
  un estilo inline le gana a una clase y con un default escrito siempre, `icon-muted` no podría
  subir el peso.
- **Lo que se compone se expone en partes.** `AlertTitle`, `CardHeader`, `TabPanel`. Cuesta dos
  líneas más de escribir y evita la prop número catorce.
- **Un campo no sabe dónde cae.** La superficie que lo contiene escribe `--field-bg`, así que un
  `TextField` adentro de un `Card` adentro de un `Modal` se ve bien sin que nadie se lo diga.

## Cómo se llama una clase

Un nombre de clase es la única parte del CSS que explica **por qué** existe una regla. La conversión
de Tailwind la dejó vacía (1450 de 1630 se llamaban `div2`, `span7`, `box4`) y volver a llenarla pidió
escribir esto antes de tocar nada. Tres guardianes lo sostienen.

**La forma.** Inglés y camelCase, sin número al final. Kebab está reservado: las clases globales de
`base.css` y `theme.css` son kebab (`icon-muted`, `field-focus`, `raised-brand`, `switch-track-on`) y
las de módulo camelCase, así que mirando una clase se sabe de dónde sale. Kebab adentro de un módulo
además **apaga a los guardianes en silencio**: no matchea el `[A-Za-z][\w]*` con el que leen los
módulos, obliga a `s['card-header']` en TS y eso lo daría por muerto. Hay un test.

**De dónde sale el nombre**, en este orden:

1. **Si es una parte que la pieza ya expone, se llama como la parte.** `CardHeader` es `header`,
   `AlertTitle` es `title`, `TabPanel` es `panel`, `TreeNode` es `node`.
2. **Si es un contenedor, se llama por lo que contiene, en plural**, y la unidad adentro es el
   singular: `items` e `item`, `actions`, `options`, `swatches` y `swatch`.
3. **Si es un estado o una variante, se llama por la condición bajo la cual se aplica**, nunca por la
   prop de la que salió. Esto no es gusto: había cinco que engañaban al que las leía y dos estaban
   dadas vuelta. La del libro que es un link se llamaba `href`; la del `TaskList` se llamaba
   `readOnly` y se aplica cuando **no** es de solo lectura; la del `DatePicker` se llamaba `value` y
   se aplica cuando **no** hay valor.

Si dos reglas se parecen tanto que dan ganas de numerarlas, lo que las separa es el nombre:
`trackRest` y `trackActive`, no `track` y `track2`.

**El léxico**, una palabra por papel y la misma en las 63 piezas:

| | |
|---|---|
| partes de una pieza | `root` `header` `body` `footer` `title` `hint` `actions` `icon` `trailing` `count` `separator` `swatch` |
| listas | `items` `item` `groupLabel` |
| overlays | `viewport` `veil` `panel` `trigger` `arrow` |
| barras de medida | `track` `fill` `thumb` `tick` |
| campos | `control` `input` `suffix` `chevron` |
| estado y variante | `selected` `active` `current` `disabled` `editable` `interactive` `dragging` `loading` `empty` `placeholder` `danger` `open` `horizontal` `vertical` `compact` `muted` `bordered` |
| las vistas de Fundamentos | `specimenGrid` `specimen` `specimenLabel` `specimenBody` `tokenName` `monoValue` `comparison` `comparisonBad` `comparisonGood` `verdictIcon` `roleBadge` |

`selected`, `active` y `current` son tres cosas distintas y conviven en la misma pieza: `selected` es
el valor elegido, `active` es dónde está el cursor del teclado, `current` es dónde estás parado en una
secuencia. En `Select`, en `Tree`, en el `DatePicker` y en el `CommandMenu` hacen falta las tres.

Y cada una tiene su complemento, que son tres y no uno: **`idle`** es lo que no tiene el cursor
encima (`active ? active : idle`), **`plain`** es lo que no recibió ningún tratamiento de tono ni de
elección (`danger ? danger : plain`, `selected ? selected : plain`), y un interruptor va con el par
**`on`/`off`**, que no es ninguna de las dos. Elegir mal el complemento no rompe nada y por eso se
escapa: `Tree` tenía `idle` contra `selected`, que se lee como si el árbol tuviera cursor.

**Una clase no pisa el nombre de una global.** `group`, `peer`, `mark`, `field`, `tabular`, `raised`,
`zebra`, `pressed` y las cincuenta y pico que declaran `base.css` y `theme.css` quedan prohibidas
como nombre de módulo, y hay un test.

**Dónde el léxico no coincide con la API, y por qué.** El vocabulario público de `index.ts` se
contradice consigo mismo: `Body` es el cuerpo en `Card` y en `Sheet` pero la línea de apoyo en
`Alert`, que en `Card` se llama `Hint`; `Footer` son tres cosas; hay seis palabras para el texto de
apoyo (`hint`, `meta`, `caption`, `subtitle`, `body`, `detail`), cinco para lo elegido y cinco para el
adorno de la izquierda. Las clases eligieron una y la usan en todas las piezas. **La API no se tocó**:
cambiarla rompe a quien consume el paquete, y eso es otro trabajo. Así que en `Alert` la clase del
texto de apoyo se llama `text` aunque la parte se llame `AlertBody`.

## Patrones que el sistema da por decididos

Salieron de armar pantallas de verdad con estas piezas, y valen para cualquiera que las use.

- **Ajustes en un modal, no en una página.** Rail de 180 que no scrollea + panel que sí. Al
  cerrar no hay navegación: seguís donde estabas, con el scroll donde lo dejaste. Por eso el
  fondo se atenúa en vez de lavarse, 14% en claro, 55% en oscuro, que sobre fondo oscuro es lo que se necesita para que el velo exista. El `SettingsModal` del paquete es eso.
- **Panel anclado con velo** (`Popover` con `veil`). Una lista que pide leerse entera necesita
  que el resto se apague; un menú de cuatro items, no. El velo va sin blur: el fondo se sigue
  reconociendo.
- **Un solo `Segmented`** para el filtro de texto y para el conmutador de grilla/lista. Dos
  implementaciones del mismo control se separan sola una de la otra con cada cambio.
- **Las tarjetas no se mueven en hover** y no tienen acciones flotando encima: una grilla que
  salta hace temblar la vista, y un botón que aparece al pasar el mouse no se descubre sin mouse
  y tapa justo lo que estabas mirando.

## Overlays: lo que costó y conviene no volver a pelear

Repartido entre `portal/`, `popover/`, `tooltip/`, `dropdown/`, `modal/`, `sheet/` y
`confirm-dialog/`, con `lib/overlay-hooks.ts` y `lib/esc.ts` para lo que comparten.

- **El `Portal` crea su host durante el render**, no en un effect. La versión obvia (crearlo en el
  effect y guardarlo en estado) hace que el primer render devuelva `null`, y eso rompe a
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
- **Todo lo que se mide contra un disparador y se dibuja en un portal tiene que cerrarse solo.**
  La posición se calcula una vez, al abrir, contra el rectángulo del disparador; si después la
  página scrollea, el panel se queda donde estaba y se le despega. El `Select` lo tuvo así desde
  siempre y el `Tooltip` llevaba su propia copia a medias de la receta. Hay un test que busca los
  dos rasgos juntos, medir el disparador y montar un `Portal`, y exige `useDismiss`.
- **Cerrar con `pointerdown` y no con `click`**: con click, el mismo gesto que abre otro panel lo
  cierra y lo reabre, y parpadea.
- Esas dos y la de afuera viven juntas en `lib/dismiss`, porque las comparten el `Popover` y el
  `DatePicker`. Ahí adentro el filtro pregunta si el target es un `Node` antes de tocarlo: el
  `scroll` de `window` no lo es, y `contains` revienta.
- **Al cerrar, el foco vuelve al disparador solo si estaba adentro del panel.** Se pregunta antes de
  cerrar, que es cuando el panel todavía existe; si alguien tocó en otro lado, no se le mueve nada.
- **El `Select` es un botón con listbox propio, no un `<select>` nativo.** `appearance: none` te
  saca la flecha, pero la lista desplegada la sigue dibujando el sistema operativo, así que en
  Linux aparece un control de GTK en medio de la interfaz: se ve "sin estilo" por más que la caja
  esté bien. El costo es traer el teclado a mano: flechas, Enter, Escape, Home/End.

## El dev server se despega del disco, y ya mordió cuatro veces

Es la misma causa con dos caras, y las dos terminan en algo que se lee como "el sitio está roto"
cuando el repo está perfecto. `npm run typecheck`, `npm test` y `vite build` pasan mientras el
navegador muestra otra cosa: **lo que se ve en localhost no es prueba de nada si el servidor
lleva rato corriendo.**

**Cara 1, el CSS que se quedó viejo.** El servidor puede seguir sirviendo la hoja anterior, así
que un token recién tocado no llega y el elemento se dibuja con el valor de antes, en silencio.
Antes de dar por bueno un valor nuevo, medirlo en el navegador y no leerlo en el archivo:

```sh
# en la consola del sitio
getComputedStyle(document.documentElement).getPropertyValue('--chart-warn')
```

**Cara 2, el módulo que quedó viejo.** El servidor se guarda cada archivo ya transformado, y esa
copia no se invalida cuando el archivo se borra ni cuando git reescribe medio repo de golpe, que
es lo que pasa al cambiar de rama. El síntoma es **pantalla en blanco**, y la causa está siempre
en la pestaña de red, no en la consola: un 404 sobre un módulo que ya no existe, o un módulo
servido con contenido viejo. Los dos casos medidos:

- después de sacar el `Badge`, el servidor seguía sirviendo un `index.ts` que importaba
  `./badge/badge`: 404, y la aplicación entera sin dibujar;
- servía un `icons.gen.ts` de 159 glifos contra los 172 del disco, así que `format_bold` no
  resolvía a ningún codepoint y el `Icon` tiraba.

La regla, entonces: **después de borrar un archivo o de cambiar de rama, se reinicia el
servidor.** No alcanza con recargar el navegador, porque lo viejo está del lado del servidor.
`npm run dev` ya borra la caché de Vite al arrancar, así que reiniciar es todo lo que hay que
hacer, y de paso cierra la cara 1.

Y cuando la pantalla aparece en blanco, el primer lugar donde mirar es la red y no la consola: un
módulo que no carga no siempre deja un error escrito.

## Agregar un icono

El set son 172 de los más de 3900 de Material Symbols. Agregar uno **no es dibujar un path**, es
un comando, y el que lo corre no tiene que acordarse de nada:

```sh
npm run icons -w @milo/ui -- search notification   # busca en el catálogo, offline
npm run icons -w @milo/ui -- add rocket_launch     # agrega y regenera todo
npm run icons -w @milo/ui -- check                 # usados que faltan, y al revés
npm run icons -w @milo/ui -- refresh               # rebaja el catálogo desde Google
```

`add` hace tres preguntas antes de bajar nada, y las hace el script y no el prompt:

1. **¿el nombre existe?** Si no, sugiere los cinco más parecidos por distancia de edición.
2. **¿ya lo tenemos?** Si sí, no baja nada y lo dice.
3. **¿hay uno mejor?** Compara los tags del candidato contra todo el set y muestra los que
   comparten dos o más: *"ya tenés `tune`, ¿seguro que querés `settings_input_component`?"*.
   Para saltearlo hay que escribir `--yes`. Esto es lo que evita llegar a doscientos iconos con
   seis variantes de engranaje.

La regla: **el set crece solo por `icons add`.** `icons check` corre al lado de `typecheck` y
falla cuando alguien usa un glifo que no está en el manifiesto: esa mitad sí está cerrada.

La otra mitad no: hoy hay **65 de 172 que no usa ningún call site**, y el chequeo los lista sin
fallar. Medido con `pyftsubset`, sacarlos llevaría la fuente de 64 KB a 27 KB. No se sacaron
porque la decisión es de quien arma el producto y no de un script: el editor y los gráficos van a
consumir varios de esos, y volver a traer uno es `icons add`, que tarda lo mismo que leer esta
línea. Lo que sí importa es que el número esté a la vista.

El catálogo podado (3912 iconos con codepoint, popularidad y tags) está versionado en
`packages/ui/scripts/catalog.json` para que buscar funcione sin internet: el mismo argumento por
el que las caras de los avatares están commiteadas. Nunca llega al browser: al bundle solo van los
codepoints, y los tags viajan por el subpath `@milo/ui/icons.meta`, que importa únicamente la
galería del kit.

Los tags son los de Google y están en inglés: "calendar" encuentra `calendar_month`, "calendario"
no encuentra nada.

## Estructura

Monorepo de npm workspaces. Dos paquetes y una app:

```
packages/tokens/src/    la identidad, en CSS puro. Sin librerías y sin JS.
packages/ui/src/        theme.css (las capas) · styles/ (reset y base) · index.ts (la puerta) ·
                        una carpeta por pieza: button/button.tsx + button/button.test.tsx,
                        y así las 63 (select, modal, toast, chart, table…)
                        lib/ lo compartido que no es un componente: cx · colors ·
                        control · tone · time · number · esc · overlay-hooks ·
                        roving · side-scroll · dismiss
                        __tests__/ los cinco que leen el paquete entero:
                        coherencia · contraste · tipografía · utilidades · props
                        icons.gen.ts e icons.meta.ts los genera scripts/icons.mjs
packages/ui/scripts/    icons.mjs (search · add · sync · check) + catalog.json
apps/kit/src/           el sitio: App.tsx (shell y riel) · kit.tsx (Page, Section, Canvas,
                        Cluster, Frame, Footnote, Grid, Props, A11y, Note) · intro.tsx (la portada) ·
                        dashboard.tsx · document.tsx · stories/ (una por pieza) ·
                        mascots/ ·
                        foundations/ (principles · accessibility · roles · typography ·
                        color · measure · layout · relief · motion · states ·
                        charts · time · numbers · sound · writing · inclusion)
```

**El corte entre el paquete y el sitio es por dependencia, no por gusto.** `packages/ui` no
sabe que el sitio existe: exporta piezas y nada más. El sitio las consume como lo haría
cualquier app de afuera, que es lo que lo vuelve una prueba de verdad y no una demo.

Todo lo que se consume entra por `packages/ui/src/index.ts`. Un test lo verifica: si alguien
exporta algo de un archivo y no lo saca por la puerta, falla.

**Una carpeta por pieza, con su test adentro.** El archivo largo con doce componentes
(`primitives.tsx` tenía 922 líneas) obliga a leer todo para tocar uno, y su test hermano en
`__tests__/` obliga a buscar en otro lado qué es lo que ya está probado. Con la carpeta, lo
que hay que mirar para cambiar el `Select` son dos archivos que están uno al lado del otro, y
agregar una pieza es agregar una carpeta y no editar cuatro archivos. Dos tests de coherencia
lo sostienen: cada carpeta tiene el componente que le da nombre, y cada componente tiene su
test al lado.

Lo que no es un componente vive en `lib/`: `cx` y `fold`, las familias de color, la escalera
de alturas de control, los pares de tono de aviso, la pila de Escape y los hooks de overlay.
El corte es el mismo de siempre: si dos piezas lo comparten, no es de ninguna de las dos.

**El kit va con una historia por pieza, y una sola pieza por historia.** Las vistas que juntaban
dos o tres ("Alert y Toast", "Chip y Progress", "Card y Row") hacían a escala chica lo mismo que
las seis pantallas temáticas del principio: quien busca `Skeleton` en el riel no lo ve, porque la
vista se llama por otra pieza. Donde la comparación importa, queda escrita en las dos vistas y
cada una linkea a la otra: solapas o acordeón, alert o toast, sheet o modal, link o button.

Las piezas se agrupan por el trabajo que hacen
(Fundamentos, Mascotas, Editor, Acciones, Formularios, Navegación, Datos, Avisos, Superficies) y
no por su tipo técnico. **Fundamentos va primero** y es la capa de la que sale todo lo demás:
Principios · Accesibilidad · Quién está mirando · Tipografía · Color · Medidas y radios · Layout ·
Relieve · Movimiento · Estados · Iconos · Gráficos · Fecha y hora · Números y valores ·
Voz y sonido · Cómo se escribe · Inclusión. El orden adentro no es alfabético: las
dos primeras son las que hay que leer antes de tocar nada, y después van las capas en el orden en
que se construye una pantalla.

Se llevó puestos a "Guía" y a "Tokens", que eran dos grupos separados por si el contenido era una
regla o un valor: una distinción que le importa a quien los escribió y a nadie más: el que busca
"contraste" no sabe en cuál de los dos caería. Cada vista abre con una portada: el nombre, una línea de qué es y cuándo se usa, la
categoría y el `import` para copiar; y cierra con lo que la pieza resuelve en accesibilidad.
Dos tests verifican que ninguna vista se quede sin portada ni sin import.

El riel tiene buscador con atajo `/` y no tiene logo: el nombre va en texto.

## La documentación de las props

**La tabla de props de cada vista sale del código y no de una lista escrita al lado.** Antes
cada vista del kit llevaba su tabla a mano (el tipo, el default y la descripción copiados del
componente) y eso se despega solo: el `Dropdown` declaraba tres props de su `items` cuando la
pieza acepta siete.

Ahora la descripción vive en el docblock de la prop, al lado de su tipo:

```tsx
export function Select({ value, onChange, options, width }: {
  value: string
  /** Sin esto toma el ancho del contenido. */
  width?: number
}) {
```

`npm run props` lee el AST de cada pieza y escribe `packages/ui/src/props.gen.ts` con el
nombre, el tipo, si es obligatoria, su default, su descripción y de qué etiqueta nativa hereda
la pieza. La vista pide `<Props of="Select" />` y nada más. Un test corre el script con
`--check` y falla si el archivo quedó viejo, igual que `icons check`.

Lo mismo vale para los tipos que una pieza recibe como argumento (`ToastOptions`,
`DropdownItem`, `BarDatum`): son API pública y se documentan igual.

## Los tests

`npm test` corre vitest con jsdom y testing-library. 677 tests, y lo que prueban es el
comportamiento (teclado, nombres accesibles, estados) y no el markup, que cambia con cada
ajuste de estilo. El test de cada pieza vive en su carpeta, al lado del componente.

Veinte de ellos leen el paquete entero y fallan si alguien:

- escribe un color a mano en un componente, o nombra en un `var()` un token que no existe: eso no
  falla, resuelve a vacío y el elemento se queda sin color, sin error y sin que nadie se entere,
- se sale de la escala de radios o de tamaños de texto,
- **escribe un tamaño de letra sin su interlineado y su tracking**, que es el bug que los roles
  vinieron a matar: escritos por separado se despegan, y ya se despegaron una vez,
- **nombra un rol, una duración o una curva que el sistema no declara**,
- **se sale de la grilla de espaciado**,
- **usa un tamaño de icono que no está en la escala**: el tamaño se pasa como número, así que
  ningún linter lo mira,
- **usa el peso de la portada fuera del tamaño display**, que se lee como negrita y aplasta los
  otros dos escalones de énfasis,
- deja un `<button>` sin `type`, que adentro de un `form` lo manda,
- deja una clase de un módulo sin usar: CSS muerto no rompe nada y por eso se queda,
- **escribe `s.loQueSea` para una clase que el módulo no declara**, que es la mitad que faltaba de
  la anterior y la que el renombre necesitaba: ver abajo por qué no la puede dar el que dibuja,
- **le pone a una clase un nombre que no dice por qué existe la regla**: la etiqueta sola, un
  número al final, kebab, o uno de la lista corta de vacíos,
- exporta algo sin sacarlo por `index.ts`,
- deja una carpeta sin el componente que le da nombre, o un componente sin su test al lado.

Y hay uno que no se puede escribir leyendo archivos: **dibuja las setenta y cuatro vistas y falla
si a algún elemento le quedó una clase literal que no resuelve a nada** (un resto de Tailwind, un
string suelto). Una clase que no existe no falla, no avisa y deja la pieza sin estilo, y leer las
fuentes no alcanza porque una clase puede llegar por una prop o por una constante.

**Ojo con lo que ese test no puede ver, que se creyó durante un tiempo que sí.** En los tests los
CSS Modules son un stub: `vitest.config.ts` tiene `css: false`, así que `s.loQueSea` devuelve
siempre `_loQueSea_hash` y **nunca** es `undefined`. Una referencia a una clase de módulo que no
existe pasa el filtro y la suite queda en verde. Por eso esa mitad la cubre un guardián estático,
el que resuelve el alias de cada import y exige que toda referencia apunte a una clase declarada.
La palanca para verlo en vivo, si alguna vez hace falta, es correr esa suite con
`css: { include: [/\.module\.css$/] }`.

**El test de una pieza aserta sobre lo que la clase declara, no sobre su nombre.** Con módulos el
nombre que llega al DOM está hasheado, así que asertar sobre él es ilegible. `__tests__/estilo.ts`
resuelve el nombre picado contra el módulo del que salió. Lo hacía buscando el nombre en **todos**
los módulos del paquete y concatenando los cuerpos, que funcionaba mientras los nombres eran
únicos por accidente: con un léxico compartido `input` existe en el `Textarea`, en el `Slider` y en
el `Stepper`, y la aserción del textarea empezó a leer el `flex` del stepper.

Catorce más leen los tokens de tipografía: que cada rol declare sus tres valores y que quien
escriba un tamaño escriba los tres, que ninguno baje de 12px, que la curva de interlineado tenga su máximo en `reading`, que
el tracking cruce el cero en la base. Del lado del kit hay diecisiete más: los guardianes de
escala repetidos sobre `apps/kit` (que hasta ahora se escapaba), el peso de display fuera de su
tamaño, las transiciones sin duración ni curva, un control de estado sin su manija, y que cada
vista tenga portada, import y sinónimos para buscarla.

Y hay uno que **renderiza las sesenta y nueve vistas**, una por test. Encuentra dos cosas que
ninguna lectura encuentra: una vista que tira al dibujarse (eso antes se veía solo abriéndola) y
un backtick o un `**` que quedó a la vista porque ese texto no pasó por `Rich`. Había diez.

Y cincuenta y nueve leen los tokens y calculan contraste: cada tono de estado contra su fondo, el
gris del texto secundario contra las superficies sobre las que se escribe, el gris del texto
sugerido contra los cuatro fondos de campo, la tinta de una etiqueta de color contra los seis
rellenos de la familia viva, el glifo de una marca contra su propio pastel, y el relleno de un
dato contra su pista: todo en los dos temas. Los tres últimos faltaban, y las tres reglas estaban
escritas desde antes de que los valores las cumplieran. Si alguien cambia un tono y rompe un par,
falla antes de llegar a una pantalla.

## Lo que se revisó contra una referencia, y qué se decidió

Se recorrió entero el mapa de una guía de interfaz de referencia (dieciocho fundamentos,
veinticinco patrones, cincuenta y seis componentes) no para copiarla sino para usarla de lista de
control: qué problemas de interfaz existen, y cuáles de esos tenemos resueltos. Lo que entró, entró
adaptado a este sistema y a un producto de aula; lo que no entró, no entró por una razón escrita.

**Ya estaba resuelto** todo lo que tiene vista propia en Fundamentos, más los patrones de
modalidad, feedback, cargando, ajustes, buscar, audio y gráficos.

**No aplica** y no se va a hacer: iconos de aplicación, experiencias inmersivas, layout espacial,
pantalla completa, arranque, multitarea, y los catorce componentes que son de un sistema operativo
(widgets, complicaciones, barra de menú, dock). Esto corre en un navegador.

**Entró en esta vuelta**, porque el propósito del sistema lo pedía: `DatePicker` y `Tree` y
`Stepper` y `Reorder`, más el `Documento` que las prueba juntas. De arrastrar y soltar entró la mitad que importa: reordenar una lista, con el teclado como
pieza y el arrastre como comodidad. Lo que sigue afuera es soltar algo **adentro** de otra cosa
(un archivo en una carpeta) que es otro problema.

**Queda afuera por ahora, y esta es la lista corta de lo que falta**, en orden de cuánto lo pide
un aula:

| | por qué todavía no |
|---|---|
| campo de fichas | asignar personas a una entrega. `Chip` ya dibuja la ficha; falta el campo que las arma |
| menú contextual | el clic derecho sobre un bloque. `Menu` y `Popover` ya están: falta la posición y la tecla de menú |
| puntuación de rúbrica | corregir con criterios y no con un número. Es más una decisión pedagógica que de interfaz, y todavía no está tomada |
| imágenes, como fundamento | `Figure` resuelve la pieza; falta la doctrina de proporción, carga y texto alternativo en un solo lugar |
| deshacer | hoy vive en el `Toast` con acción, que alcanza para una acción por vez y no para un editor |
| imprimir | un docente imprime una consigna. No hay ni una hoja de estilos de impresión |
| de derecha a izquierda | no hay plan de idiomas que lo pidan. Si aparece, lo que cambia es el layout y no las piezas |

## Pendiente

- **Los otros arrastres de la conversión mecánica**, que quedaron cuando se arreglaron los nombres:
  96 apariciones de la maquinaria de gradiente de Tailwind escrita a mano
  (`--milo-gradient-from/via/to/stops`, casi todas adentro de un `transition-property` que no anima
  nada), y 56 `transition-duration: 150ms` seguidas de la `var(--duration-fast)` que sí vale.
- **`Modal` tiene dos fuentes para su nombre.** La prop `label` es la que el lector de pantalla
  anuncia, y `ModalTitle` es la que se ve: en la historia dicen cosas distintas y nada lo mira. La
  salida es que el título se ate solo con `aria-labelledby`, como hace el `Sheet`.
- **El helper `face()` está copiado en cinco historias** (avatar, mention, table, chart, folder), y
  `p()` o `person()` en tres. Es contenido de ejemplo, así que va a un `fixtures.ts` compartido.
- **Un `Stack` hermano de `Cluster`.** Hay 23 clases en 18 archivos que son la misma columna con
  gap, pero los valores van de 0.125 a 1.5rem y no entran en una escala sin mover cosas de lugar.
- **Props que le faltan a dos piezas, y que las historias suplen con CSS.** `Table` no tiene
  `align="right"` ni columna de acciones, y `Modal` no tiene `ModalHeader`/`Body`/`Footer` como sí
  tiene `Card`: la historia del modal construye el interior entero a mano.
- **La familia de controles ya llega a 44×44 en táctil; el resto de las piezas no.** Con
  `pointer: coarse` los botones suben a `lg` y llevan `touch-target`, que agranda el blanco de toque
  a 44 sin mover la caja; los campos suben la caja a 44 de verdad, porque ahí el tap tiene que llegar
  al `input`. En escritorio no cambia un píxel. Lo tienen `Button`, `IconButton`, `ToolbarButton`,
  `TextField`, `Textarea`, `Select`, `DatePicker` y `Stepper`. **Lo que falta, medido**: `Checkbox` y `Radio` de 18, `Switch` de 22, el tachito de
  `Chip` de 24 y el de `Search` de 24, el eslabón de `Breadcrumb` de 24, las opciones de
  `Segmented` de 28 a 32, y las solapas de `Tabs` y los ítems de `Menu` de 36 a 40. Esas no son
  una omisión: varias son compactas a propósito, así que subirlas es una decisión sobre cómo se
  siente el sistema en un teléfono y no un arreglo. Está escrito en Fundamentos › Accesibilidad.
- **Recuperar `ss04` y el cero barrado** pide auto-alojar Inter: 69 KB subseteada a latín, con la
  receta de `pyftsubset` anotada. Se eligió el CDN; si algún día una red escolar filtra Google
  Fonts, la decisión se da vuelta y el trabajo ya está pensado.
- **El sitio entra en un solo bundle de 687 KB (202 gzip) y `vite build` avisa.** Son las 69
  vistas importadas de una: nada está mal, está todo junto. La salida es `lazy` por historia con
  un `Skeleton` de espera, y el costo es un parpadeo por navegación en una pantalla que hoy es
  instantánea. No se hizo porque es una decisión sobre cómo se siente el sitio y no un bug.
- Portar los tokens a `~/melu/packages/ui`, que es para lo que existe todo esto. Ojo con el
  nombre: ese repo es otro y sigue llamándose `melu`.

## Lo que no está

No hay backend ni datos reales, y nada persiste salvo las preferencias del sitio. El contenido
de las vistas es de ejemplo y está escrito a mano: nombres, entregas, espacios. Los medios de
las tarjetas son geometría derivada del id, no imágenes: una grilla de fotos se ve linda y no
dice nada del contenido.

**Y no está el prototipo de la app.** Vivía en `apps/guide` y se borró a propósito: este repo
es del design system. Cuando haga falta probar el sistema en pantallas de producto, eso se arma
donde vive el producto, consumiendo el paquete como cualquier otro consumidor.
