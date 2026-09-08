# ui-kit

Un sistema de interfaz propio: tokens, componentes y un prototipo que corre para verlos
trabajando en pantallas reales. Sirve de guía visual para [melu](https://github.com/hor4z/melu),
de donde salen el stack y la arquitectura de tokens.

```sh
npm install
npm run dev     # http://localhost:5180
```

## Inspiración

El lenguaje visual está **inspirado en Brainwave 2**, de UI8:
<https://ui8-brainwave-2.vercel.app>

De ahí vienen la densidad compacta, el relieve físico de los controles y la paleta casi neutra.
Brainwave 2 es un template comercial y **este repo no lo incluye ni lo redistribuye**: el
código, los iconos y el contenido son propios. Si querés el template en sí, se compra en UI8.

## Arquitectura

```
src/tokens/primitives.css   valores crudos: la rampa, el canto, los tintes, el acento
src/tokens/semantic.css     los roles: --surface, --border, --text, --relief-*, --switch-*
src/tokens/scales.css       radios, medidas del shell, tipografía, movimiento
src/theme.css               el puente: Tailwind v4 leyendo los tokens
```

Los componentes se estilan **solo** contra roles: ninguno sabe que existe `--shade-03`, sabe que
hay un `--surface-muted`. Un hex escrito a mano en un componente es un bug.

## El sistema, en corto

- **Densidad:** base 12px peso 500, line-height fijo de 16. Botones y énfasis en 14/600.
- **Shell:** sidebar 220 `fixed`, topbar 80, padding lateral 20, items de nav de 40.
- **Controles:** tres alturas con un rol cada una — 32 inline, 36 en panel, 40 principal.
- **Radios:** 6 · 10 · 12 · 16 · 24. El radio de un hijo es el del padre menos su padding.
- **Color:** rampa neutra de nueve pasos (`#fcfcfc` → `#121212`). Interfaz monocroma; el acento
  se usa poquísimo y por eso se ve. Bordes y hovers en alpha, nunca gris opaco.
- **Relieve:** cinco recetas (`raised`, `solid`, `pressed`, `inset`, elevación en capas). El
  estado activo se marca con relieve o canto, no tiñendo el texto.
- **Iconos:** set propio de contornos, grilla de 24, trazo 1 (1.5 cuando van en gris).

## Componentes

`Button` · `IconButton` · `Switch` · `Segmented` · `Select` (botón + listbox propio) · `Chip` ·
`Kbd` · `Avatar` · `Input` · `Card` · `Row` · `Icon` · `FolderIcon` · `Portal` · `Popover` ·
`Dropdown` · `Modal` · paleta de comandos · panel de avisos · shell con sidebar y topbar ·
modal de ajustes · composer.

Los tres hooks de overlay (`useScrollLock`, `useEscape`, `useFocusTrap`) resuelven los detalles
que solo se ven cuando faltan: el salto de la scrollbar al abrir un modal, `Escape` cerrando solo
el overlay de arriba, y el foco que se cae al `<body>` si se pone una vez y no se verifica.

## Pantallas del prototipo

Mis actividades (grilla y lista) · explorar · recetas · publicadas · recursos · guardadas ·
espacio · planes · novedades · entrar · 404.

Tema claro y oscuro, ⌘K para la paleta, ⌘, para ajustes.

## Notas

Las decisiones y su por qué están en [CLAUDE.md](CLAUDE.md), junto con los errores que ya se
cometieron acá y conviene no repetir.

No hay backend ni datos reales; nada persiste salvo las preferencias. Los medios de las tarjetas
son geometría derivada del id, no imágenes.
