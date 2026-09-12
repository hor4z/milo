# milo · design system

El sistema de interfaz de milo: la identidad en tokens, las piezas que la usan, y el sitio
donde se ve todo funcionando. No es una lámina de estilos — cada pieza de acá es el componente
real, con su teclado, sus estados y sus tests.

**El repo es del design system y de nada más.** El UI kit —las 48 piezas— es una parte; las
otras son los tokens y lo que el sitio documenta alrededor. Acá adentro no vive producto: el
prototipo de la app que hubo hasta ahora se borró, y cuando haga falta uno de nuevo se arma
aparte.

Lo que se decide acá se porta a `~/melu/packages/ui`, que es el paquete que hoy consume el
producto. **Ese es otro repo y todavía se llama `melu`**, en el disco y en GitHub; este pasó a
llamarse `milo` —`hor4z/milo`— y el día que se renombre el otro, estas dos líneas y la del
final son lo único que hay que tocar.

```sh
npm install
npm run dev        # el sitio · http://localhost:5190
npm run typecheck  # todo el monorepo de una
npm test           # 291 tests con vitest y testing-library
npm run props      # regenera la tabla de props desde los tipos
```

**El código va en inglés y los comentarios en castellano.** Todo lo que es código —variables,
parámetros, tipos, funciones, props— se escribe en inglés; lo que se lee —los comentarios, los
textos de la interfaz, los nombres de los tests, el contenido de ejemplo— va en castellano. Esa
es la línea, y no hay una tercera categoría.

**El código no lleva comentarios de más.** Queda un docblock de una línea por export y por prop
—lo que el editor usa para autocompletar, y lo que el kit muestra como documentación— y algún
`//` donde el motivo no se deduce leyendo. El porqué de cada decisión vive en dos lugares que sí
se leen: este archivo y las notas de cada vista del kit.

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

El stack es el de milo a propósito —React 19 + Tailwind v4 + Vite— y la capa de tokens tiene
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

**Tipografía.** Siete roles, y **cada uno carga tamaño, interlineado y tracking juntos**. Ese es
todo el punto: escritos por separado se despegan, y se despegaron — `text-lg` llegó a ser 20px de
letra dentro de una caja de línea de 16 porque el interlineado era un token aparte que nadie tenía
que recordar.

| rol | px | leading | tracking | para qué |
|---|---|---|---|---|
| `text-meta` | 12 | 16 · 1.33 | `+0.01em` | metadatos, kbd, contadores, ayuda de campo. **El piso: nunca para leer.** |
| `text-label` | 13 | 18 · 1.38 | `+0.005em` | rótulos: cabecera de tabla, chip, badge, título de grupo |
| `text-body` | 14 | 20 · 1.43 | `0` | **la interfaz.** Si dudás, es este |
| `text-reading` | 16 | 24 · 1.5 | `0` | lo que se lee de corrido, títulos de superficie, botón de `md` para arriba |
| `text-title` | 20 | 28 · 1.4 | `-0.01em` | título de pantalla |
| `text-heading` | 28 | 36 · 1.29 | `-0.015em` | encabezado de sección |
| `text-display` | 40 | 44 · 1.1 | `-0.02em` | portadas |

Tres cosas que hay que saber antes de tocar un número:

- **La base es 14 y hay un escalón de 16 para lo que se lee.** Es el modelo de Carbon (14
  productivo, 16 expresivo) y es la decisión edtech: un panel docente es denso, un enunciado que
  lee un estudiante no. Estuvo en 12, que es el piso de un metadato y no el tamaño en el que se
  mira una interfaz ocho horas.
- **El tracking cruza el cero en la base**: positivo donde la letra es chica y se empasta, negativo
  donde es grande y se despega. Es lo que hace el eje óptico de San Francisco y lo que Carbon
  escribe a mano. La regla vieja hacía lo contrario —`-0.015em` a todos los `h1-h3`, medido contra
  Inter a 12px— y apretar la letra chica es exactamente cómo se pierde nitidez.
- **La curva de interlineado tiene su máximo en `reading`** (1.5, el número de WCAG 1.4.12), no en
  el rol más chico. Los dos de abajo son cromo de una sola línea donde lo que importa es que la
  caja no crezca; de `reading` para arriba se aprieta porque a 40px el aire sobra solo.

**Los tamaños van en `rem`, la geometría del shell en px.** Quien agranda la letra en su navegador
la ve agrandada — el zoom ya escalaba los px y cubría WCAG 1.4.4, pero la preferencia de tamaño de
fuente no, y esa es la que usa quien tiene baja visión. Las piezas que llevan texto en una caja
chica (`Badge`, `Kbd`, `Chip`, `Segmented`) usan `min-h` y no alto fijo, justamente por eso.

**Los nombres viejos están apagados con `--text-*: initial` en el `@theme`.** No es higiene: vivían
en `:root` de `scales.css` y funcionaban solo porque *pisaban* variables que Tailwind ya emite, así
que al sacarlos de ahí los valores de Tailwind resucitan solos. Sin ese `initial`, un `text-xs`
olvidado seguiría andando con 12px, en silencio.

**La familia es Inter, y es una sola para los tres roles.** Cuarta del proyecto: Inter → Geist →
Instrument Sans → Inter. Volver no es andar en círculo, porque lo que se fue no vuelve: aquella vez
eran **tres** familias (Inter + Inter Tight + JetBrains Mono) y el motivo de dejarla fue justamente
ese. Inter v4 trae **eje óptico** (`opsz`), así que una sola instancia cubre el cuerpo y el display
—Inter Tight deja de tener sentido— y el argumento viejo se cae solo.

El eje óptico es lo que la vuelve una elección y no una preferencia: la letra se redibuja más
abierta y con más avance a 12px, y más cerrada a 40px. Es la cura estructural de la falta de
nitidez abajo, en vez de compensarla a mano con tracking. Ninguna de las otras cuatro que se
miraron —IBM Plex Sans, Atkinson Hyperlegible Next, Public Sans, Instrument Sans— lo tiene. Se
pide como `opsz 14..32`, que son los dos extremos que la fuente define. Lo que se paga: es la letra
de media industria y no aporta identidad; acá eso cuesta poco, porque la identidad la ponen el
relieve y la rampa.

**Lo que el CDN de Google no trae, para que nadie lo intente dos veces.** Inter tiene un set de
desambiguación (`ss04`: ele con cola, i mayúscula con serifas) y un cero barrado (`zero`) que
serían ideales acá. **El build de Google los recorta**: su GSUB queda en
`calt ccmp dnom frac locl numr pnum tnum` y nada más, así que escribir
`font-feature-settings: "ss04"` no rompe — no hace nada, en silencio. Lo que sí sobrevive es
`tnum`, así que `.tabular` funciona. Recuperarlos pide auto-alojar la fuente (69 KB subseteada a
latín) y se decidió que tener CDN vale más.

A 40px lo que separa un título del cuerpo es el tamaño y el tracking, no un dibujo distinto de la
letra, y dos familias que se parecen es lo peor de los dos mundos.

El rol `mono` pierde el ancho fijo, y hay que saber qué se pierde con él: una columna de valores ya
no alinea sola. La alinea la clase `.tabular` (`font-variant-numeric: tabular-nums`), que da ancho
fijo a los **números** sin cambiar de letra — verificado, el 1 y el 4 miden lo mismo. Alcanza para
lo que el rol hace de verdad (precios, métricas, una columna de tabla) y no alcanza para un bloque
de código, que no existe en el sistema.

**Pesos.** 400 la interfaz · 500 lo accionable y los títulos de fila · 600 solo display. Bajaron un
escalón entero al pasar de Inter a Instrument Sans, que dibuja más grueso al mismo número —x más
alta, trazo más ancho— y con los tres anteriores la pantalla entera se veía en negrita. Se cambia
en el `@theme` y no en los call sites, así que las utilidades siguen llamándose `font-medium` ·
`font-semibold` · `font-bold`: el nombre es del rol, no del número. Se miraron de nuevo al volver a
Inter y se quedan: el problema documentado era **Inter a 12px**, donde el 400 se leía lavado, y la
base ahora es 14. El pendiente se resolvió solo cuando se movió el tamaño, que es lo que había que
mover.

**Sin `-webkit-font-smoothing: antialiased` y sin `text-rendering: optimizeLegibility`**, y las dos
ausencias son la decisión. El primero no mejora el antialias: lo apaga, y pide rasterizar en escala
de grises en vez de usar el subpíxel, que es justo lo que da nitidez en 1x. Si algo se ve lavado, el
problema es el peso o el contraste.

**Medidas del shell.** Sidebar 220 `fixed` (72 contraído) · topbar 80 · padding lateral 20 ·
item de nav 40 con radio 12 y el icono en un cuadro de 34 · sangría de subitems 48.

**El alto de afuera es el de la escalera, siempre.** Una pieza que envuelve a otra —la pista de un
`Segmented` alrededor de sus opciones— **contiene** su padding, no lo suma. El `Segmented` lo sumaba
y su `sm` medía 36, o sea el alto de `md`: puesto al lado de un `Button size="sm"` no apoyaban en la
misma línea, y el resultado es que dos piezas del mismo talle se leen como de sistemas distintos.
Si el mismo nombre de talle da dos alturas, el nombre no sirve para nada.

**Controles.** Tres alturas y un rol cada una: `sm` 32 inline en una fila densa · `md` 36
acciones dentro de un panel · `lg` 40 la acción principal. El `sm` va en `text-body` y del `md`
para arriba en `text-reading` con radio 12: un botón con el mismo tamaño de letra que su entorno
no se lee como accionable, así que cuando subió la base subió también el botón.

**Movimiento.** Dos duraciones y dos curvas, y ninguna tercera. `duration-fast` 120ms para lo que
acompaña al dedo —un hover, un check— y `duration-normal` 190ms para lo que aparece o se va. Entra
con `ease-out` y sale con `ease-in`: abrir se mira, cerrar estorba.

Las duraciones van con **`@utility`** y no en el `@theme`, y eso hay que saberlo: `--duration-*` no
es un namespace de Tailwind, así que declarar el token no genera la utilidad. Estuvieron declarados
y sin leer desde el principio —diecisiete call sites escribían `duration-[120ms]` a mano, cuatro de
ellos con números fuera de escala— que es exactamente el mismo bug que tenía la tipografía: el
token definido y el call site esquivándolo. Hay un test que ahora lo impide.

**Espaciado.** Once pasos con rol: 2 el pelo · 4 adentro de una marca · 6 glifo y texto · 8 dos
cosas de una fila · 12 dos filas · 16 una pieza chica · 20 una tarjeta · 24 un panel · 32 dos
secciones · 40 una pantalla · 48 una portada. Grilla de 4 con dos sub-pasos abajo, porque a 2 y a
6 píxeles todavía hay decisiones reales y de 8 para arriba la diferencia entre 28 y 32 no la ve
nadie. **No existía**: los call sites tomaban los dieciocho valores de Tailwind, así que dos cosas
que hacen lo mismo quedaban separadas por 10 acá y por 12 allá — y eso no se ve como un error, se
ve como desprolijidad. Lo hace cumplir un test. **No manda sobre las alturas de pieza**: un control
de 36 o una fila de 56 salen de la escalera de controles.

**Radios.** `sm` 6 marcas hundidas · `md` 10 lo chico · `lg` 12 lo que se toca de 36 para arriba ·
`xl` 16 adentro de una tarjeta · `2xl` 24 contenedores · `full` lo redondo de verdad. Murió un `xs`
de 5 por estar a un píxel de su vecino.

**El radio sigue al alto**, y esa es la regla que hay que tener presente. El `md` de 10 llegó a
morir con el argumento de que 10 y 12 están a dos píxeles y nadie ve la diferencia; es falso,
porque **el radio se lee en proporción al lado más corto de la pieza, no en píxeles**. Sobre un
botón de 40 de alto, 12 deja 16 de lado plano y se lee como un remate; sobre uno de 32 deja 8, y la
misma curva se lee como una pastilla. Un control de 32 —el `sm` de la escalera— va en 10; de 36
para arriba, en 12. Lo mismo vale para todo lo chico que no es un control: un chip de 28, un
tooltip, un esqueleto, el cuadradito de un glifo.

Sacar el `md` hizo dos píxeles más redondas a dieciséis piezas de golpe, y el efecto es que la
interfaz entera se ve más blanda — se notó primero en un `IconButton` que parecía de otra librería
al lado de un `Segmented`, y después en el CTA del dashboard. Es además lo que da la regla del
anidado en el caso más común: una pista de 12 con 2 de padding pide 10 adentro.

La regla del anidado: **el radio de un hijo es el del padre menos el padding del padre.** Un
24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve
doble; si queda más cuadrado que el padre, se ven dos curvas distintas. Los dos errores ya
pasaron acá (el segmented chico tenía 6 donde iban 10).

**Color.** Dos familias: una rampa de nueve pasos casi neutra que dibuja todo, y **el azul, que es
el color primario** y tiene rampa de diez.

**El papel y el escritorio son dos tonos distintos.** Es la corrección más grande que tuvo el
sistema. `--canvas` y `--surface` apuntaban al mismo token con el argumento de que lo que separa
una tarjeta del fondo es el relieve, y no alcanzaba: con el relieve en alpha bajo y a 1x, una
pantalla densa se lee como un campo blanco enorme con líneas encima y cada widget parece recortado
en vez de apoyado. Ahora una pieza es papel (`--shade-01`) y la página es el escritorio
(`--shade-02`); en oscuro se invierte, el papel se aclara y el escritorio es lo que está más al
fondo. El relieve vuelve a decir solo cuánto se levanta algo en vez de tener que decir si existe.

**La rampa es casi neutra, no neutra**: lleva C 0.0025 del tono del azul en OKLCH. Es un susurro y
tiene que seguir siéndolo — un gris exactamente neutro al lado de un azul saturado se ve de otro
sistema, y un gris que se nota azul convierte una interfaz de dos colores en una de tres. Estuvo en
0.006 y era demasiado: los campos se veían celestes.

**La tinta no es casi negro.** Estaba en `#121212`, que sobre el papel daba 18.26:1 — AAA pide 7,
así que era más del doble del techo. Eso no se lee mejor: se lee duro. El borde entre una letra
casi negra y un fondo casi blanco produce halación, y le pega más fuerte a quien lee con
dificultad, que es a quien hay que cuidar acá. Está en 14:1, que sigue siendo el doble de AAA.

El salto de 05 a 06 es violento a propósito: entre el borde más oscuro y el texto más claro no
tiene que haber nada, o aparecen grises que no se distinguen. Bordes y hovers se pintan con tinta
en alpha, no con un gris opaco: sobre un tinte, el opaco se ve como una línea sucia.

**El azul, diez pasos.** Eran tres valores sueltos elegidos para un botón, y tres no alcanzan para
vestir un estado elegido, un fondo suave, una tinta que se lea encima y un borde. La rampa **se
deriva y no se elige**: tono y croma salen del azul de siempre, la luminosidad baja parejo y el
croma sube al medio y cae en los extremos. **El 600 está anclado**: es el escalón donde el blanco
encima llega exactamente a 4.5:1, y por eso es el relleno del CTA. Eso saldó la única deuda de
accesibilidad que el sistema arrastraba — el botón daba 2.89:1 arriba del degradado y 3.75:1
abajo. Ahora el degradado va de 600 a 700 y pasa AA de punta a punta.

**`brand` es el botón que manda** y hay uno por pantalla. `solid` pasa a ser el mismo rol en tinta,
para donde el azul no se puede usar: adentro de un aviso teñido, o sobre una superficie que ya es
azul. Va uno o el otro, nunca los dos en la misma pantalla.

El anillo de foco es el único lugar donde el color es la señal y no el acompañante, y se defiende
solo: los otros usos son roles —esto manda, esto está cargando—, este es un estado del teclado y es
el único aviso que tiene que reconocerse antes de leerse. Los 2px de `--surface` antes del azul son
lo que lo deja ver también sobre el botón azul.

El acento ámbar (`#d2691e`) se usa poquísimo —un punto, un badge— y por eso se ve.

**Las marcas de la lista** (`--mark-*`, en pares relleno/glifo) son el círculo de 44 que identifica
una fila: relleno pastel y glifo del mismo tono varios pasos más oscuro, porque la marca tiene
lugar para leerse entera sin gritarle al título de al lado. En oscuro se invierten.

**Las etiquetas de color** van en **dos juegos y hay que elegir bien**:

- `--label-*-soft` + `--label-*-ink` — fondo apagado y tinta del mismo tono, las doce ancladas a
  4.6:1. **Es lo que usa un chip.** Un chip nunca viene solo: hay cinco o seis en una fila, se leen
  como texto, y seis rellenos saturados uno al lado del otro compiten entre sí y con todo lo demás.
- `--label-*` a secas, el relleno vivo con glifo blanco — el cuadradito de icono de una tarjeta,
  donde la pieza es chica, el glifo es blanco y el color tiene que gritar.

Van en orden de rueda porque quien las usa reparte por hash sobre el índice: con los tonos
desordenados, dos nombres consecutivos caían en dos tonos casi iguales.

**Un aviso tiene su propio papel.** `Alert` era `--surface`, o sea blanco sobre el blanco de una
tarjeta: el aviso no se diferenciaba de lo que lo rodeaba, que es lo único que un aviso tiene que
hacer. Ahora lleva el `-subtle` de su tono y un borde `--<tono>-border`, que existe por lo mismo —
un borde neutro alrededor de un fondo teñido se ve como algo pegado encima.

**El campo se invierte contra lo que tiene detrás.** Papel sobre el escritorio, hundido sobre una
tarjeta. Lo decide la superficie escribiendo `--field-bg`, no el call site: un `TextField` no sabe
si va a caer adentro de un `Card` adentro de un `Modal`, y preguntárselo sería la prop número
catorce. Y el texto sugerido tiene su propio paso (`--text-placeholder`), el más claro que todavía
llega a 4.5:1: con el gris del texto puesto ahí, lo que el campo propone se leía igual de firme que
lo que alguien escribió.

**Las paletas de categoría son roles distintos y no se mezclan**, y las separan el tamaño de la
pieza y lo que va encima:

| | para qué | contenido encima |
|---|---|---|
| `--mark-*` | la marca de 44 de una fila de lista, y el avatar sin foto | glifo o inicial del mismo tono, oscuro |
| `--label-*-soft` | un chip | la tinta del mismo tono, `--label-*-ink` |
| `--label-*` | el cuadradito de icono de una tarjeta | glifo blanco |
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
- **Un campo no lleva relieve.** El `TextField` fue un hueco (canto en tinta, luz arriba, labio
  abajo) y se planchó: el relieve dice "esto sobresale" o "esto se aprieta", y un campo no es
  ninguna de las dos. Los cuatro campos del sistema —`TextField`, `Textarea`, `Select` y el
  buscador de la topbar— se dibujan igual: fondo (`--field-bg`) y una línea de un píxel
  (`--field-border`, tinta en alpha, la misma que el relieve usaba de canto). Lo único que aparece
  al enfocar es el anillo, y lo pone la caja de afuera: la regla que apaga el del control de
  adentro nombra `input` **y** `textarea`, o el multilínea se enciende con dos.

**Iconos.** Material Symbols Rounded, subseteado a los 152 que usamos y servido desde el repo
(57 KB de woff2). El peso es un eje real de la fuente —`wght` de 100 a 700—, no un set de
variantes generadas: por eso el set es una fuente y no SVG. Los dibujos de Material son contornos
rellenos y no trazos, así que el peso está horneado en la geometría y con SVG haría falta un
archivo por escalón. Google hace lo mismo en Flutter y en Material Web.

**Todos de contorno.** `FILL` está clavado en 0, sin variable y sin prop. Había tres rellenos por
default —`favorite`, `bolt`, `star_shine`— con el argumento de que una marca pesa más que un
acompañante, y lo que pasaba es que el mismo icono se dibujaba distinto según dónde cayera: el
corazón de la nav relleno y el mismo corazón de la paleta de comandos hueco. Un set mezclado no se
lee como un set. Marca y acompañante se separan con el peso y el tamaño, que el call site ya
tiene.

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

**Dónde estás se marca con el azul; lo que se aprieta, con relieve.** La regla vieja decía que el
estado activo se marca con relieve y nunca con color, y el motivo escrito era que la interfaz es
monocroma y el azul es el único acento que hay, así que gastarlo acá lo dejaba sin decir nada donde
importa. **Esa premisa se cayó**: el azul es el color primario con rampa de diez pasos y ya no hay
un acento que se gaste. Y «dónde estoy» es exactamente lo que un primario sabe hacer mejor que una
pastilla gris: en un riel de doce entradas, el gris hay que buscarlo y el azul se encuentra sin
leer. El item actual va en `--brand-soft` con tinta `--brand-ink` y su canto.

El relieve no se fue: sigue marcando lo que se aprieta y lo que sobresale. Lo que cambió es que
dejó de tener que marcar también dónde estás parado.

**La línea que separa los dos: orientación va en azul, preferencia va en relieve.** Un item de nav
y una solapa dicen *dónde estás* —eso no cambia por minuto y conviene encontrarlo sin leer—, así
que van en el primario. Un `Segmented` se les parece y **no** lleva azul: ahí lo que se elige es un
filtro, una decisión que cambia diez veces por minuto, y teñirla de primario le da el peso de una
ubicación a algo que es una preferencia. Si todo lo elegido fuera azul, el azul dejaría de decir
dónde estás.

Corolario que se rompió cuatro veces: **el texto de un item inactivo va en tinta, no en gris.** Con
la etiqueta apagada, una lista de siete espacios se lee como si estuviera deshabilitada. La cuarta
fue el subitem del riel, que la rompía mientras su propio padre la cumplía.

**El relleno que lleva texto encima está anclado.** Los dos rellenos saturados con una palabra
arriba —el `brand` azul y el `bad` rojo— usan el escalón donde el blanco encima llega exactamente a
4.5:1, y no uno elegido mirando. El `--bad-500` se queda para lo que no lleva texto (el glifo de un
estado, el borde de un campo inválido) y `--bad-fill` es el que se pinta con una palabra arriba. Un
test lo mide en los dos temas. **Era la única deuda de accesibilidad que el sistema arrastraba.**

**Estado.** Cuatro tonos —`ok`, `warn`, `bad` e `info`— y ninguno viaja solo: cada uno trae su
glifo y su texto, porque un color de estado sin forma no dice nada a quien no distingue colores.
Cada tono tiene tres pasos: el **fuerte** (el borde, el relleno de una barra), el **suave** (el
fondo de un aviso) y la **tinta** (`--ok-ink` y compañía), que es el único que va sobre el suave.
Ese tercero existe porque el fuerte sobre el suave daba 3,2:1 —pasa apenas para un glifo y no
alcanza para texto— y un `Badge` pone texto ahí. Hay tests que lo miden.

**Un aviso que se queda y uno que pasa.** `Alert` forma parte de la pantalla y describe su estado;
`Toast` es consecuencia de algo que acabás de hacer y se va solo. Elegir mal es lo que hace que un
error importante desaparezca a los cinco segundos.

**Un campo nunca va suelto.** `Field` ata etiqueta, ayuda y error al control, y los campos del
sistema se enganchan solos por contexto. Lo obligatorio se dice con la palabra «obligatorio»
además del asterisco: un asterisco es una convención que no significa nada para quien no la
conoce, y un lector de pantalla lo lee como «asterisco».

**Las piezas que se parecen dicen cuál va.** `Chip` identifica —una categoría, una persona— y
`Badge` dice en qué estado está algo: si el texto cambia según lo que pasó, es un badge. El
`Switch` aplica en el momento y el `Checkbox` es parte de un formulario que se confirma con un
botón. El `Modal` interrumpe para una decisión corta y el `Sheet` es para trabajar un rato. El
`ConfirmDialog` es la pregunta de lo que no se deshace, y con `tone="bad"` el foco arranca en
Cancelar.

**Un enlace lleva subrayado siempre.** En una interfaz monocroma no hay color que lo distinga
del texto que lo rodea. El externo avisa que abre en otra pestaña, con el glifo y con texto.

**Lo que se compone se expone en partes.** `Alert` es `AlertTitle`, `AlertBody` y `AlertActions`;
una tarjeta es `CardHeader`, `CardTitle`, `CardHint`, `CardBody` y `CardFooter`; unas solapas son
`Tabs`, `TabList`, `Tab` y `TabPanel`. Cuesta dos líneas más de escribir y evita la prop número
catorce.

## Patrones que el sistema da por decididos

Salieron de armar pantallas de verdad con estas piezas, y valen para cualquiera que las use.

- **Ajustes en un modal, no en una página.** Rail de 180 que no scrollea + panel que sí. Al
  cerrar no hay navegación: seguís donde estabas, con el scroll donde lo dejaste. Por eso el
  fondo se atenúa apenas (14%) en vez de lavarse. El `SettingsModal` del paquete es eso.
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
npm run icons -w @milo/ui -- search notification   # busca en el catálogo, offline
npm run icons -w @milo/ui -- add rocket_launch     # agrega y regenera todo
npm run icons -w @milo/ui -- check                 # usados que faltan, y al revés
npm run icons -w @milo/ui -- refresh               # rebaja el catálogo desde Google
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
codepoints, y los tags viajan por el subpath `@milo/ui/icons.meta`, que importa únicamente la
galería del kit.

Los tags son los de Google y están en inglés: "calendar" encuentra `calendar_month`, "calendario"
no encuentra nada.

## Estructura

Monorepo de npm workspaces. Dos paquetes y dos apps:

```
packages/tokens/src/    la identidad, en CSS puro. Sin Tailwind y sin JS.
packages/ui/src/        theme.css (el puente) · index.ts (la puerta) ·
                        una carpeta por pieza: button/button.tsx + button/button.test.tsx,
                        y así las 48 (select, modal, toast, chart, table…)
                        lib/ lo compartido que no es un componente: cx · colors ·
                        control · tone · esc · overlay-hooks
                        __tests__/ los dos que leen el paquete entero:
                        coherencia y contraste
                        icons.gen.ts e icons.meta.ts los genera scripts/icons.mjs
packages/ui/scripts/    icons.mjs (search · add · sync · check) + catalog.json
apps/kit/src/           el sitio: App.tsx (shell y riel) · kit.tsx (Page, Section,
                        Canvas, Props, A11y, Note) · intro.tsx (la portada) ·
                        dashboard.tsx · stories/ (una por pieza) ·
                        foundations/ (principles · accessibility · typography ·
                        color · measure · relief · motion · states · writing ·
                        inclusion)
```

**El corte entre el paquete y el sitio es por dependencia, no por gusto.** `packages/ui` no
sabe que el sitio existe: exporta piezas y nada más. El sitio las consume como lo haría
cualquier app de afuera, que es lo que lo vuelve una prueba de verdad y no una demo.

Todo lo que se consume entra por `packages/ui/src/index.ts`. Un test lo verifica: si alguien
exporta algo de un archivo y no lo saca por la puerta, falla.

**Una carpeta por pieza, con su test adentro.** El archivo largo con doce componentes
—`primitives.tsx` tenía 922 líneas— obliga a leer todo para tocar uno, y su test hermano en
`__tests__/` obliga a buscar en otro lado qué es lo que ya está probado. Con la carpeta, lo
que hay que mirar para cambiar el `Select` son dos archivos que están uno al lado del otro, y
agregar una pieza es agregar una carpeta y no editar cuatro archivos. Dos tests de coherencia
lo sostienen: cada carpeta tiene el componente que le da nombre, y cada componente tiene su
test al lado.

Lo que no es un componente vive en `lib/`: `cx` y `fold`, las familias de color, la escalera
de alturas de control, los pares de tono de aviso, la pila de Escape y los hooks de overlay.
El corte es el mismo de siempre: si dos piezas lo comparten, no es de ninguna de las dos.

**El kit va con una historia por pieza, y una sola pieza por historia.** Las vistas que juntaban
dos o tres —"Alert y Toast", "Badge y Progress", "Card y Row"— hacían a escala chica lo mismo que
las seis pantallas temáticas del principio: quien busca `Skeleton` en el riel no lo ve, porque la
vista se llama por otra pieza. Donde la comparación importa, queda escrita en las dos vistas y
cada una linkea a la otra: solapas o acordeón, alert o toast, sheet o modal, link o button.

Las piezas se agrupan por el trabajo que hacen
—Fundamentos, Acciones, Formularios, Navegación, Datos, Avisos, Superficies— y no por su tipo
técnico. **Fundamentos va primero** y es la capa de la que sale todo lo demás: Principios ·
Accesibilidad · Tipografía · Color · Medidas y radios · Relieve · Movimiento · Iconos · Cómo se
escribe. El orden adentro no es alfabético: las dos primeras son las que hay que leer antes de
tocar nada, y después van las capas en el orden en que se construye una pantalla.

Se llevó puestos a «Guía» y a «Tokens», que eran dos grupos separados por si el contenido era una
regla o un valor — una distinción que le importa a quien los escribió y a nadie más: el que busca
«contraste» no sabe en cuál de los dos caería. Cada vista abre con una portada: el nombre, una línea de qué es y cuándo se usa, la
categoría y el `import` para copiar; y cierra con lo que la pieza resuelve en accesibilidad.
Dos tests verifican que ninguna vista se quede sin portada ni sin import.

El riel tiene buscador con atajo `/` y no tiene logo: el nombre va en texto.

## La documentación de las props

**La tabla de props de cada vista sale del código y no de una lista escrita al lado.** Antes
cada vista del kit llevaba su tabla a mano —el tipo, el default y la descripción copiados del
componente— y eso se despega solo: el `Dropdown` declaraba tres props de su `items` cuando la
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

Lo mismo vale para los tipos que una pieza recibe como argumento —`ToastOptions`,
`DropdownItem`, `BarDatum`—: son API pública y se documentan igual.

## Los tests

`npm test` corre vitest con jsdom y testing-library. 291 tests, y lo que prueban es el
comportamiento —teclado, nombres accesibles, estados— y no el markup, que cambia con cada
ajuste de estilo. El test de cada pieza vive en su carpeta, al lado del componente.

Diez de ellos leen el paquete entero y fallan si alguien:

- escribe un color a mano en un componente,
- se sale de la escala de radios o de tamaños de texto,
- **usa un nombre de la escala vieja** (`text-xs`, `text-base`…), que no genera nada y por eso no
  se nota solo,
- **escribe el interlineado o el tracking sueltos** (`leading-*`, `tracking-*`) en vez de dejar que
  los traiga el rol — que es el bug que la escala nueva vino a matar,
- **escribe una duración o una curva a mano** (`duration-[120ms]`, `ease-[cubic-bezier(…)]`) en vez
  de usar las dos del sistema,
- **se sale de la grilla de espaciado** (un `gap-2.5`, un `p-3.5`),
- **usa un tamaño de icono que no está en la escala** — el tamaño se pasa como número, así que
  ningún linter lo mira,
- exporta algo sin sacarlo por `index.ts`,
- deja una carpeta sin el componente que le da nombre, o un componente sin su test al lado.

Trece más leen los tokens de tipografía: que cada rol declare sus tres valores y llegue entero al
`@theme`, que ninguno baje de 12px, que la curva de interlineado tenga su máximo en `reading`, que
el tracking cruce el cero en la base. Y uno del lado del kit repite los guardianes de escala sobre
`apps/kit`, que hasta ahora se escapaba.

Y veintinueve leen los tokens y calculan contraste: cada tono de estado contra su fondo, el gris
del texto secundario contra las cuatro superficies claras sobre las que se escribe, y la tinta de
una etiqueta de color contra los seis rellenos de la familia viva — todo en los dos temas. Si
alguien cambia un tono y rompe un par, falla antes de llegar a una pantalla.

## Pendiente

- **El `sm` de 32 no llega a los 44×44 que Apple pide para el dedo.** Pasa WCAG 2.2 (24×24) con
  holgura y se queda corto en táctil, que es media flota de un aula. La salida no es agrandar los
  tres —la densidad es real— sino decidir que en táctil el piso es `lg`; hoy el tamaño lo elige
  cada call site sin saber con qué se va a tocar. Está escrito en Fundamentos › Accesibilidad.
- **Recuperar `ss04` y el cero barrado** pide auto-alojar Inter: 69 KB subseteada a latín, con la
  receta de `pyftsubset` anotada. Se eligió el CDN; si algún día una red escolar filtra Google
  Fonts, la decisión se da vuelta y el trabajo ya está pensado.
- Portar los tokens a `~/melu/packages/ui`, que es para lo que existe todo esto. Ojo con el
  nombre: ese repo es otro y sigue llamándose `melu`.

## Lo que no está

No hay backend ni datos reales, y nada persiste salvo las preferencias del sitio. El contenido
de las vistas es de ejemplo y está escrito a mano: nombres, entregas, espacios. Los medios de
las tarjetas son geometría derivada del id, no imágenes — una grilla de fotos se ve linda y no
dice nada del contenido.

**Y no está el prototipo de la app.** Vivía en `apps/guide` y se borró a propósito: este repo
es del design system. Cuando haga falta probar el sistema en pantallas de producto, eso se arma
donde vive el producto, consumiendo el paquete como cualquier otro consumidor.
