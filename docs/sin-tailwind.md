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

## Lo que falta

1. Migrar `packages/ui` y `apps/kit` en una sola vuelta, con las dos capas.
2. Resolver `--default-*` además de `--tw-*`.
3. Sacar la dependencia, el plugin de Vite y el puente.
4. Reescribir los guardianes que hoy leen clases de Tailwind para que lean los
   módulos, y los tests de piezas que asertan sobre el nombre de una clase.
5. Nombres: la generación mecánica da `chipSizeSm` y `noHorizontal`. Se leen,
   pero un design system merece nombres escritos a mano.

## Lo que queda del lado de las apps

Los tokens son CSS nativo y no se tocan. Una app que quiera utilidades solo
mapea esos nombres en su propio `@theme`: la velocidad de escribir utilidades se
queda del lado de la app, y el sistema no la necesita.
