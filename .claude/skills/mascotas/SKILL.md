---
name: mascotas
description: Prepara los archivos de una mascota del design system a partir de un video o una imagen con fondo — le saca el fondo, arma el retrato con alfa y el bucle animado, y los deja en apps/kit/public/mascotas. Usar cuando alguien trae un render nuevo de Otto, de Amelia o de una mascota nueva, o cuando hay que recortarle el fondo a un personaje.
---

# Mascotas

Las mascotas llegan como un render con fondo gris plano. Lo que el kit consume
son dos archivos con alfa, y los dos salen del mismo comando.

```sh
npm run mascotas -- revisar  ~/Downloads/otto.mp4          # mirá el recorte antes de nada
npm run mascotas -- animar   ~/Downloads/otto.mp4   otto   # → otto-anima.webp
npm run mascotas -- retrato  ~/Downloads/ame.png    amelia # → amelia.webp
npm run mascotas -- lista                                  # qué hay y cuánto pesa
```

## Correr `revisar` primero, siempre

Arma una tira con seis cuadros recortados sobre naranja y sobre el fondo del
sitio, y la deja en un PNG. **Miralo antes de codificar**: si a la mascota le
falta un pedazo se ve ahí, en dos segundos, y no después de un minuto de
codificar ciento veinte cuadros.

El umbral se mide solo, del borde del cuadro. Si algo sale mal se corrige con
`--claro`: subirlo deja más mascota, bajarlo saca más fondo.

`revisar` también avisa cuando **el primer cuadro es una toma suelta**. Pasa
porque estos videos se producen pasándole una imagen de referencia al generador,
y a veces el generador la devuelve como cuadro cero — pero **no siempre**, así
que no se tira el primero por las dudas: se mira el aviso y se anima con
`--desde 1` solo cuando corresponde.

## Lo que ya se probó y no funciona

Antes de proponer una alternativa, esto ya se intentó:

- **`colorkey` de ffmpeg no sirve.** El fondo es gris neutro y la mascota tiene
  partes casi tan claras —la panza de Otto, el blanco de los ojos—, así que un
  umbral plano le abre agujeros en el medio del cuerpo. Por eso el fondo se
  decide por **conectividad**: se saca solo lo que está pegado al borde del
  cuadro, y lo que está encerrado adentro del cuerpo no se toca.
- **WebM con alfa no sale de esta máquina.** Pesaría un tercio que el WebP, y
  ffmpeg acepta `-pix_fmt yuva420p` sin quejarse — pero escribe el archivo sin
  el alfa. Verificado decodificando: vuelve opaco. No perder tiempo ahí de nuevo
  sin antes decodificar y mirar el canal alfa.
- **La rampa del borde no puede aplicarse a todo el cuadro.** Vale solo en el
  anillo que toca al fondo. Aplicada en todos lados le come los ojos y le lava
  el pecho: adentro del cuerpo, claro no quiere decir fondo.
- **El brillo del piso entre las patas queda encerrado** por las patas mismas,
  así que la conectividad sola no lo alcanza. Se separa por altura: el piso está
  abajo del 75% del cuadro y los ojos nunca bajan del 35%.

## Después de generar los archivos

1. **Los retratos se miden por el alto, nunca por el ancho.** Todos salen a 1200
   de alto con el ancho que a cada uno le toque, así que en el markup van con
   `h-*` y `w-auto`. Con un ancho fijo, dos mascotas se ven de dos tamaños.
2. **Actualizar la sección «Los archivos»** de la vista de esa mascota en
   `apps/kit/src/mascots/`, con las medidas y el peso reales — `lista` los
   imprime. Ya pasó que esa tabla mostrara las medidas del original y no las del
   archivo que se sirve.
3. **Un `img` animado no se puede pausar.** Por eso `prefers-reduced-motion` no
   lo atenúa: lo reemplaza por el retrato quieto. Usar `useQuieto` de
   `apps/kit/src/mascots/reglas.tsx`.
4. **Las reglas de dónde va y qué nunca se le hace son de todas las mascotas** y
   viven en `reglas.tsx`. Una vista nueva las muestra con `<ReglasDeMascota />`,
   no las vuelve a escribir.
5. Registrar la vista en `apps/kit/src/App.tsx` —el orden de las props es
   load-bearing, hay un test que lee ese archivo con un regex— y sumar el archivo
   a la lista de `apps/kit/src/__tests__/vistas.test.ts`.
