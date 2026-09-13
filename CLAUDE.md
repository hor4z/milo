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
<<<<<<< HEAD
npm test           # 517 tests con vitest y testing-library
=======
npm test           # 524 tests con vitest y testing-library
>>>>>>> main
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

El stack es el de milo a propósito (React 19 + Tailwind v4 + Vite) y la capa de tokens tiene
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
- **El gris de un icono no es una prop, es la utilidad `icon-muted`.** El gris se hereda de un
  ancestro (un `IconButton` apagado, un item de nav inactivo) y el call site no tiene cómo saberlo.
  Corolario que cuesta ver: **`Icon` no escribe `--icon-wght` salvo que le pasen `weight`**, porque
  un estilo inline le gana a una clase y con un default escrito siempre, `icon-muted` no podría
  subir el peso.
- **Lo que se compone se expone en partes.** `AlertTitle`, `CardHeader`, `TabPanel`. Cuesta dos
  líneas más de escribir y evita la prop número catorce.
- **Un campo no sabe dónde cae.** La superficie que lo contiene escribe `--field-bg`, así que un
  `TextField` adentro de un `Card` adentro de un `Modal` se ve bien sin que nadie se lo diga.

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

**Cara 1, el token que no genera su clase.** Si tocás un token dentro del bloque `@theme` con el
dev server corriendo, Tailwind puede quedarse con el CSS viejo y la utilidad no se genera, en
silencio y sin error: la clase queda en el HTML sin efecto. Así estuvo `bg-scrim` sin aplicar
durante varias rondas, con el backdrop del modal en solo blur. Antes de dar por bueno un color
nuevo, verificar que la regla exista de verdad:

```sh
curl -s http://localhost:5190/src/app.css | grep -o '\.text-icon-muted[^}]*}'
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
packages/tokens/src/    la identidad, en CSS puro. Sin Tailwind y sin JS.
packages/ui/src/        theme.css (el puente) · index.ts (la puerta) ·
                        una carpeta por pieza: button/button.tsx + button/button.test.tsx,
                        y así las 63 (select, modal, toast, chart, table…)
                        lib/ lo compartido que no es un componente: cx · colors ·
                        control · tone · esc · overlay-hooks · roving ·
                        side-scroll · dismiss
                        __tests__/ los cinco que leen el paquete entero:
                        coherencia · contraste · tipografía · utilidades · props
                        icons.gen.ts e icons.meta.ts los genera scripts/icons.mjs
packages/ui/scripts/    icons.mjs (search · add · sync · check) + catalog.json
apps/kit/src/           el sitio: App.tsx (shell y riel) · kit.tsx (Page, Section,
                        Canvas, Props, A11y, Note) · intro.tsx (la portada) ·
                        dashboard.tsx · document.tsx · stories/ (una por pieza) ·
                        mascots/ ·
                        foundations/ (principles · accessibility · typography ·
                        color · measure · layout · relief · motion · states ·
                        charts · writing · inclusion)
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
Principios · Accesibilidad · Tipografía · Color · Medidas y radios · Layout · Relieve · Movimiento ·
Estados · Iconos · Gráficos · Cómo se escribe · Inclusión. El orden adentro no es alfabético: las
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

<<<<<<< HEAD
`npm test` corre vitest con jsdom y testing-library. 517 tests, y lo que prueban es el
comportamiento (teclado, nombres accesibles, estados) y no el markup, que cambia con cada
=======
`npm test` corre vitest con jsdom y testing-library. 524 tests, y lo que prueban es el
comportamiento (teclado, nombres accesibles, estados) y no el markup, que cambia con cada
>>>>>>> main
ajuste de estilo. El test de cada pieza vive en su carpeta, al lado del componente.

Diecisiete de ellos leen el paquete entero y fallan si alguien:

- escribe un color a mano en un componente, o nombra en `bg-`, `text-`, `border-`, `ring-` o
  `fill-` un color que el puente no declara: la clase queda en el HTML, no genera nada y no hay
  error,
- se sale de la escala de radios o de tamaños de texto,
- **usa un nombre de la escala vieja** (`text-xs`, `text-base`…), que no genera nada y por eso no
  se nota solo,
- **escribe el interlineado o el tracking sueltos** (`leading-*`, `tracking-*`) en vez de dejar que
  los traiga el rol, que es el bug que la escala nueva vino a matar,
- **escribe una duración o una curva a mano** (`duration-[120ms]`, `ease-[cubic-bezier(…)]`) en vez
  de usar las tres duraciones y las dos curvas del sistema,
- **se sale de la grilla de espaciado** (un `gap-2.5`, un `p-3.5`),
- **usa un tamaño de icono que no está en la escala**: el tamaño se pasa como número, así que
  ningún linter lo mira,
- **usa el peso de la portada fuera del tamaño display** (`font-bold` a 16px), que se lee como
  negrita y aplasta los otros dos escalones de énfasis,
- deja un `<button>` sin `type`, que adentro de un `form` lo manda,
- deja una clase del puente sin usar: CSS muerto no rompe nada y por eso se queda,
- exporta algo sin sacarlo por `index.ts`,
- deja una carpeta sin el componente que le da nombre, o un componente sin su test al lado.

Trece más leen los tokens de tipografía: que cada rol declare sus tres valores y llegue entero al
`@theme`, que ninguno baje de 12px, que la curva de interlineado tenga su máximo en `reading`, que
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

- **El `sm` de 32 no llega a los 44×44 que Apple pide para el dedo.** Pasa WCAG 2.2 (24×24) con
  holgura y se queda corto en táctil, que es media flota de un aula. La salida no es agrandar los
  tres (la densidad es real) sino decidir que en táctil el piso es `lg`; hoy el tamaño lo elige
  cada call site sin saber con qué se va a tocar. Está escrito en Fundamentos › Accesibilidad.
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
