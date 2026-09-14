# Sacar Tailwind: el plan, y lo que ya se midió

El design system deja de depender de Tailwind y pasa a React y CSS Modules, con
los temas en CSS nativo. Este archivo es el estado del trabajo y, sobre todo, lo
que se aprendió midiendo, para que la próxima vuelta no vuelva a descubrirlo.

## Cómo se prueba que nada cambió

Hay un verificador de paridad: recorre las 75 vistas en los dos temas y anota,
por cada elemento, 62 propiedades computadas más su caja. Son 31.368 nodos.

Calibrado contra sí mismo, sin tocar código, da **74 nodos de ruido**, todos en
vistas con animación (esqueleto, spinner, select, estados). Ese es el piso. Un
paso vale cuando el diff queda ahí.

## Hecho y verificado

**La base en CSS nativo.** El reset y todo lo que el sistema define por su cuenta
viven en `packages/ui/src/styles/`. El gris de un icono dejó de ser una
`@utility` y es una clase. Paridad: 78 de 31.368.

## Lo que la medición enseñó, y por qué el resto no es mecánico

**El reset va en una capa, declarada antes que las de Tailwind.** Sin capa le
gana a las utilidades: medido, 23.462 nodos de 31.368 con el padding, el borde y
el tamaño de letra en cero. Una capa vale por dónde se declara, no por dónde se
usa.

**Una migración a medias no puede ser idéntica.** Cuando la pieza pasa a módulo y
el call site sigue en utilidades, la precedencia cambia de forma irreparable:

- Con Tailwind, la base de la pieza (`p-2`) y lo que el call site pasa por
  `className` (`p-5`) son las dos utilidades de la misma capa, así que gana **el
  orden en que Tailwind las emite**, que no es ni el orden del código ni el de
  la especificidad.
- Con el módulo en una capa anterior a las utilidades, gana siempre el call site.
  Con el módulo sin capa, gana siempre la pieza.
- Ninguna de las dos reproduce el orden de Tailwind, y depende de la propiedad.
  Medido: 2.041 nodos con una capa, 1.116 con la otra.

De ahí la conclusión: **las piezas y el kit se migran juntos, en la misma vuelta,
con dos capas propias** (`milo.components` para las piezas, `milo.app` para el
kit) y se saca la librería en el mismo paso. Es la única configuración donde la
precedencia queda definida por el sistema y no heredada de una librería.

**Lo interno de Tailwind hay que resolverlo, no renombrarlo.** El CSS que genera
usa variables suyas, y se dividen en dos:

- Las que solo traen un valor de respaldo (`var(--tw-leading, X)`, `--tw-tracking`,
  `--tw-ease`, `--tw-duration`, `--tw-font-weight`, `--tw-border-style`) se
  resuelven al valor y desaparecen.
- Las que **componen** entre varias clases (la sombra, el anillo, el transform y
  el degradado: 39 en uso) tienen que seguir siendo variables, con su valor
  inicial declarado por `@property`. Sin eso, una que nadie puso resuelve a vacío
  y se lleva puesta la declaración entera.
- Y quedan las de `--default-*` (la curva y la duración por defecto de una
  transición), que también hay que resolver.

**El `transition-property` computado cambia de texto sin cambiar de aspecto.**
Renombrar las variables cambia la cadena que devuelve `getComputedStyle`, así que
el verificador tiene que normalizarla antes de comparar o marca 247 falsos.

## Lo que la conversión mecánica no vio

Se hizo todo lo de arriba, y después apareció lo que un generador no puede ver.

**Las cadenas mezcladas.** Donde una clase de Tailwind convivía con una nuestra
(`px-3 bg-surface font-semibold text-ink`), el generador salteaba la cadena entera
en vez de convertir la mitad que le tocaba. Quedaron ocho: el `Segmented`, el
anillo del avatar, el paso del breadcrumb, el hover del chip, el movimiento del
slider y cuatro vistas de Fundamentos. En pantalla se veía como piezas sin aire.

**`@theme` es una directiva de Tailwind.** Sin Tailwind el navegador se saltea el
bloque entero, y ahí adentro vivían los tres pesos. Todo el sistema venía dibujando
400 donde pedía 450 o 600, en las ochenta vistas, sin un error en ningún lado. Lo
mismo con `@utility` y con `@layer base`. Los pesos se mudaron a `scales.css`, que
es donde viven los otros valores de la escala.

**El puente eran 171 líneas de nada.** Los `--color-*`, `--shadow-*`, `--radius-*`
y `--text-*` existían para que Tailwind emitiera utilidades. Ningún módulo los lee:
los módulos nombran el token de abajo. Se fueron enteros.

**Dos cosas ya estaban rotas y nadie las veía.** El anillo del `AvatarGroup` no
dibujó nunca, ni con Tailwind: `.mark` va sin capa y le gana a cualquier utilidad y
a cualquier módulo. Y dos vistas de Fundamentos imprimían el nombre picado del
módulo (`_cls_a1b2c_3`) donde iba el token.

**El guardián que faltaba no se puede escribir leyendo archivos.** Dibuja las
setenta y cuatro vistas y falla si a un elemento le quedó una clase que no resuelve
a nada. Una clase inexistente no falla ni avisa, y puede llegar por una prop o por
una constante, así que leer las fuentes no alcanza: hay que mirar lo dibujado.
Verificado rompiendo el `Segmented` a propósito.

## Lo que falta

**Los nombres: hecho.** Era lo único grande que quedaba. **1450 de 1630 clases
(el 89%)** salieron con el nombre de la etiqueta y un número, `div2`, `span7`,
`box4`, `p3`, o con un nombre propio numerado, `card2`, `controlLg7`. Un generador
no puede hacer otra cosa, porque el nombre de una clase dice *por qué* existe la
regla y eso no está en el CSS que lee.

Se escribió primero la nomenclatura (está en `CLAUDE.md`, en "Cómo se llama una
clase") y después se aplicó módulo por módulo. Tres cosas que la medición enseñó y
que no se veían desde afuera:

- **La mitad del CSS de las historias era andamio copiado.** La fila de variantes
  en 19 historias con cinco gaps distintos; la caja que capea el ancho en 18, con
  trece topes sin escala. Nombrar 19 copias de lo mismo no arregla nada: fueron a
  `kit.tsx` como `Cluster`, `Frame` y `Footnote`, y se borraron 110 clases.
- **El guardián que se creía que cubría esto no lo cubría.** En los tests los CSS
  Modules son un stub (`css: false`), así que `s.loQueSea` nunca es `undefined` y
  el test que dibuja las vistas no puede ver una referencia huérfana. Hizo falta uno
  estático que resuelva el alias de cada import.
- **Un léxico compartido rompe `estilo()`.** Buscaba el nombre en todos los módulos
  y concatenaba: con `input` en tres piezas, la aserción de una leía el CSS de otra.

Quedan 1523 clases, ninguna se llama por su etiqueta ni termina en un número, y hay
tres guardianes nuevos que lo sostienen.

## Lo que queda del lado de las apps

Los tokens son CSS nativo y no se tocan. Una app que quiera utilidades solo
mapea esos nombres en su propio `@theme`: la velocidad de escribir utilidades se
queda del lado de la app, y el sistema no la necesita.
