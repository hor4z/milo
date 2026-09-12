# milo · design system

El sistema de interfaz de **milo**: la identidad en tokens, las piezas que la usan y el sitio
donde se ve todo funcionando. No es una lámina de estilos — cada pieza de acá es el componente
real, con su teclado, sus estados y sus tests.

El UI kit —las 51 piezas— es **una parte** del sistema, no el sistema. Acá adentro no vive
producto: este repo es del design system y de nada más.

```sh
npm install
npm run dev        # el sitio · http://localhost:5190
npm run typecheck  # todo el monorepo de una
npm test           # 302 tests
npm run props      # regenera la tabla de props desde los tipos
```

Los **fundamentos** son la capa de la que sale todo lo demás, y en el sitio van primero:
principios · accesibilidad · tipografía · color · medidas y radios · relieve · movimiento ·
estados · iconos · cómo se escribe · inclusión.

## Qué hay adentro

```
packages/tokens/   la identidad, en CSS puro: primitives · semantic · scales
packages/ui/       el UI kit: 51 piezas, una carpeta cada una, con su test al lado
apps/kit/          el sitio: los fundamentos y una vista por pieza
```

El corte entre el paquete y el sitio es por dependencia: `packages/ui` no sabe que el sitio
existe. El sitio consume las piezas como lo haría cualquier app de afuera, que es lo que lo
vuelve una prueba de verdad y no una demo. Todo entra por `packages/ui/src/index.ts`, y hay un
test que falla si alguien exporta algo de un archivo sin sacarlo por esa puerta.

## El sistema, en corto

- **Tipografía:** Inter, una sola familia para los tres roles, elegida por su eje óptico. Siete
  roles que cargan tamaño, interlineado y tracking juntos: base `text-body` 14/20 y un escalón
  `text-reading` 16/24 para lo que se lee de corrido; portadas en 40. En `rem`, para que la
  preferencia del navegador cuente. El rol `mono` alinea números con la clase `.tabular`.
- **Shell:** sidebar 220 `fixed` (72 contraído), topbar 80, padding lateral 20, item de nav 40.
- **Controles:** tres alturas con un rol cada una — 32 inline, 36 en panel, 40 la principal.
- **Radios:** 6 · 10 · 12 · 16 · 24. El radio de un hijo es el del padre menos su padding.
- **Color:** rampa casi neutra de nueve pasos (`#fcfcfc` → `#121212`). La interfaz es monocroma;
  las tres excepciones —el azul de marca, las marcas de una lista y las etiquetas de color—
  están acotadas a una pieza cada una. Bordes y hovers en alpha, nunca gris opaco.
- **Relieve:** cinco recetas (`raised`, `solid`, `pressed`, `inset` y la elevación en capas). El
  estado activo se marca con relieve o canto, no tiñendo el texto.
- **Iconos:** Material Symbols Rounded, subseteado a los 160 que usamos, servido desde el repo
  (57 KB). Se agregan con `npm run icons -w @milo/ui -- add <nombre>`, nunca a mano.

El código va en inglés y los comentarios en castellano: lo que es código se escribe en inglés,
lo que se lee —comentarios, textos de la interfaz, nombres de los tests— en castellano.

La documentación de cada prop vive en su docblock y el kit la extrae con `npm run props`: la
tabla que se ve en cada vista es el tipo real, no una copia escrita al lado.

Los componentes se estilan **solo** contra roles: ninguno sabe que existe `--shade-03`, sabe que
hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug, y hay un test que lo
busca.

## Las piezas

Acciones: `Button` · `IconButton` · `Menu` · `Dropdown`
Formularios: `Field` · `Sheet` · `TextField` · `Textarea` · `Select` · `Checkbox` · `Radio` ·
`Switch` · `Slider` · `Segmented`
Navegación: `Tabs` · `Accordion` · `Breadcrumb` · `NavItem` · `Pagination`
Datos: `Table` · `List` · `BarChart` · `Badge` · `Progress` · `Skeleton` · `Avatar` · `Chip` ·
`Filter`
Avisos: `Alert` · `Toast` · `EmptyState` · `Spinner` · `Tooltip`
Superficies: `Card` · `Row` · `Modal` · `ConfirmDialog` · `Popover` · `Divider` · `Link` ·
`Kbd` · `Book` · `Folder` · `Page`

## Accesibilidad

No es un párrafo de buenas intenciones: cada vista del kit cierra con lo que la pieza resuelve,
y los tests lo sostienen. El teclado de cada control está probado —flechas, Escape, la pila que
cierra un overlay y no todos, el foco que vuelve a donde estaba—, el contraste de los tokens se
calcula en los dos temas, y axe da 100 sobre las pantallas del kit. Lo que todavía no llega está
escrito con sus números en [CLAUDE.md](CLAUDE.md).

## Inspiración

El lenguaje visual arrancó **inspirado en Brainwave 2**, de UI8:
<https://ui8-brainwave-2.vercel.app>. De ahí vienen la densidad compacta y las recetas de
relieve. Brainwave 2 es un template comercial y **este repo no lo incluye ni lo redistribuye**:
el código, los iconos y el contenido son propios. Si hace falta ese estilo tal cual, se compra
la licencia.

## Notas

Las decisiones y su por qué están en [CLAUDE.md](CLAUDE.md), junto con los errores que ya se
cometieron acá y conviene no repetir.

No hay backend ni datos reales; nada persiste salvo las preferencias del sitio. Los medios de
las tarjetas son geometría derivada del id, no imágenes: una grilla de fotos se ve linda y no
dice nada del contenido.

El prototipo de la app que vivía en `apps/guide` se borró: este repo es del design system. Se
va a armar de nuevo cuando sea el momento, y del lado del producto.
