# Guía visual para melu

Un prototipo que corre, hecho para decidir la identidad visual nueva de melu: densidad,
color, radios, relieve y unos cuantos patrones de interacción. No es un producto ni una
librería: es la guía, con el sistema funcionando en pantallas reales en vez de en una lámina
de estilos.

Lo que se decida acá se porta a `~/melu/packages/ui`, que es el design system de verdad.

```sh
npm install
npm run dev     # http://localhost:5180
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
src/tokens/primitives.css   valores crudos: la rampa, el canto, los tintes, el acento
src/tokens/semantic.css     los roles: --surface, --border, --text, --relief-*, --switch-*
src/tokens/scales.css       radios, medidas del shell, tipografía, movimiento
src/theme.css               el puente: Tailwind leyendo los tokens + las clases de relieve
```

Los componentes se estilan **solo** contra roles: ninguno sabe que existe `--shade-03`, sabe
que hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug.

`@source "./**/*.{ts,tsx}"` en `theme.css` es obligatorio: Tailwind v4 escanea desde el root
de Vite, no desde el directorio del CSS. Sin eso, las clases que solo usan estos componentes
no se generan y **falla en silencio, sin estilos**.

## El sistema

**Densidad.** Base 12px, peso 500, line-height fijo de 16. El peso 500 de base no es capricho:
a 12px el 400 de Inter se lee lavado sobre un fondo casi blanco. El line-height único es para
que dos filas de 12 y de 14 sigan alineadas entre sí.

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
eso se ve. El botón que manda es tinta, no color de marca.

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

**Iconos.** Set propio de contornos, grilla de 24, 20px, trazo 1. La prop `weight` sube a 1.5
donde el icono va en gris: un trazo fino encierra aire y se apaga al lado del texto. Por lo
mismo hay un `--icon-muted` (`#5f5f5f`) más oscuro que el gris del texto. Si algún día el set
pasa a glifos macizos, ese token vuelve a `--shade-06` y el `weight` desaparece.

Las carpetas de espacios (`FolderIcon`) son la excepción: traen color propio, elegido a mano
por espacio y no derivado, para reconocerlas de reojo en una lista de siete.

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

Todo en `src/ui/overlay.tsx`.

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
curl -s http://localhost:5180/src/theme.css | grep -o '\.text-icon-muted[^}]*}'
```

## Estructura

```
src/tokens/      la identidad
src/theme.css    el puente a Tailwind
src/ui/          primitives · icon · overlay · shell · settings-modal ·
                 command-palette · notifications · composer · activity-card · page
src/screens/     library · explore · misc (guardadas/recursos/espacio) · pricing ·
                 updates · signin
src/data.ts      contenido de muestra (español; claves técnicas en inglés)
src/prefs.tsx    preferencias en localStorage, con el tema aplicado en <html>
```

`prefs` aplica el tema en `<html>` y no en un wrapper: los portales viven en el `<body>`, fuera
de cualquier wrapper de React, y un `data-theme` en un div no los alcanza.

## Pendiente

- **`planes` y `entrar`** siguen con las medidas viejas (14px, sin relieve).
- **`README.md` quedó desactualizado**: describe la primera identidad (jade y ámbar, radios
  3·6·8·10·14) que después se reemplazó por la rampa neutra y la escala 6·10·12·16·24.
- Portar los tokens a `~/melu/packages/ui`, que es para lo que existe todo esto.
- Opcional: dibujar un set de iconos macizo propio. Resolvería de raíz el "se ven livianos" que
  hoy se compensa con `weight` y con `--icon-muted`.

## Lo que no está

No hay backend ni datos reales, y nada persiste salvo las preferencias. Los medios de las
tarjetas son geometría derivada del id, no imágenes: una grilla de fotos se ve linda y no dice
nada del contenido.
