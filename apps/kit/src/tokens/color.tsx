import { Block, Grid, Ramp, Section, Swatch } from '../kit'

const shades = [
  '--shade-01', '--shade-02', '--shade-03', '--shade-04', '--shade-05',
  '--shade-06', '--shade-07', '--shade-08', '--shade-09',
] as const

export function ColorSection() {
  return (
    <Section
      title="Color"
      note="Una rampa casi neutra de nueve pasos y un solo acento. El salto de 05 a 06 es violento a propósito: entre el borde más oscuro y el texto más claro no tiene que haber nada, o aparecen grises que no se distinguen entre sí."
    >
      <Block
        label="La rampa"
        note="Tres superficies claras antes del primer borde visible, el salto, y tres tintas oscuras. Nadie la usa directo: los componentes leen roles."
      >
        <Ramp tokens={shades} />
      </Block>

      <Block
        label="Tinta en alpha"
        note="Los bordes y los hovers se pintan con tinta transparente, no con un gris opaco: sobre un tinte, el opaco se ve como una línea sucia."
      >
        <Grid>
          <Swatch token="--shade-09-a04" note="hover" />
          <Swatch token="--shade-09-a06" />
          <Swatch token="--shade-09-a08" note="borde, activo" />
          <Swatch token="--shade-09-a11" note="anillo del hundido" />
          <Swatch token="--shade-09-a35" note="anillo de foco" />
        </Grid>
      </Block>

      <Block label="Superficies" note="El shell y las piezas comparten el papel. Lo que separa una tarjeta del fondo no es un tono distinto, es el relieve.">
        <Grid>
          <Swatch token="--canvas" />
          <Swatch token="--surface" />
          <Swatch token="--surface-muted" />
          <Swatch token="--surface-sunken" />
          <Swatch token="--surface-inverted" />
          <Swatch token="--popover" />
          <Swatch token="--scrim" note="fondo del modal" />
          <Swatch token="--veil" note="fondo del panel anclado" />
        </Grid>
      </Block>

      <Block label="Bordes">
        <Grid>
          <Swatch token="--border" />
          <Swatch token="--border-strong" />
          <Swatch token="--border-alpha" />
          <Swatch token="--edge" note="el canto: más oscuro que el borde más oscuro" />
          <Swatch token="--solid-edge" />
        </Grid>
      </Block>

      <Block label="Texto e iconos" note="`--icon-muted` es un paso más oscuro que el gris del texto: un contorno encierra aire y con el gris del texto se lee más apagado que ese mismo texto. No se usa a mano — lo pone la utilidad `icon-muted`, que además sube el peso del glifo a 400, porque el gris y el peso son la misma decisión.">
        <Grid>
          <Swatch token="--text" />
          <Swatch token="--text-muted" />
          <Swatch token="--text-subtle" />
          <Swatch token="--text-disabled" />
          <Swatch token="--text-inverted" />
          <Swatch token="--icon-muted" />
        </Grid>
      </Block>

      <Block label="Sólidos y marca" note="El botón que manda es tinta. El azul es la única pieza con color, y `solid` y `brand` son el mismo rol: va uno o el otro, nunca los dos en la misma pantalla.">
        <Grid>
          <Swatch token="--solid" />
          <Swatch token="--solid-hover" />
          <Swatch token="--on-solid" />
          <Swatch token="--brand" />
          <Swatch token="--brand-edge" note="canto y labio" />
          <Swatch token="--on-brand" />
        </Grid>
      </Block>

      <Block label="Acento" note="Se usa poquísimo —un punto, un badge, el aviso de algo nuevo— y por eso se ve.">
        <Grid>
          <Swatch token="--accent" />
          <Swatch token="--accent-hover" />
          <Swatch token="--accent-subtle" />
        </Grid>
      </Block>

      <Block label="Estado">
        <Grid>
          <Swatch token="--ok" />
          <Swatch token="--ok-subtle" />
          <Swatch token="--warn" />
          <Swatch token="--warn-subtle" />
          <Swatch token="--bad" />
          <Swatch token="--bad-subtle" />
        </Grid>
      </Block>

      <Block label="Campos" note="Dos roles distintos: el campo que ya muestra algo elegido es gris con borde suave; el campo vacío es casi blanco y lo que dibuja la caja es el borde.">
        <Grid>
          <Swatch token="--field-bg" />
          <Swatch token="--field-border" />
          <Swatch token="--search-bg" />
          <Swatch token="--search-border" />
        </Grid>
      </Block>

      <Block
        label="Etiquetas de color"
        note="La familia viva de lo chico: un chip, la inicial de un avatar, el cuadradito de icono de una tarjeta. Los seis salen de la regla de la familia (saturación 95% y 3.75:1 contra blanco, el número del azul), así que los seis llevan el mismo texto blanco. Van en orden de rueda porque el avatar reparte por hash sobre el índice."
      >
        <Grid min={150}>
          <Swatch token="--label-green" />
          <Swatch token="--label-teal" />
          <Swatch token="--label-blue" note="apunta a la rampa de marca" />
          <Swatch token="--label-purple" />
          <Swatch token="--label-pink" />
          <Swatch token="--label-orange" />
          <Swatch token="--on-label" note="el texto, uno para las seis" />
        </Grid>
      </Block>

      <Block label="Tintes" note="El lavado de una superficie grande que lleva un dibujo oscuro encima: el hueco 4:3 de una tarjeta, el mock de una novedad, el costado de la pantalla de entrar. No son para una etiqueta — si se saturaran, el dibujo desaparecería y una grilla de doce tarjetas se volvería un arcoíris.">
        <Grid min={150}>
          <Swatch token="--tint-1" />
          <Swatch token="--tint-2" />
          <Swatch token="--tint-3" />
          <Swatch token="--tint-4" />
          <Swatch token="--tint-5" />
          <Swatch token="--tint-6" />
        </Grid>
      </Block>

      <Block
        label="Marcas de la lista"
        note="Van en pares relleno/glifo y son de la lista de acciones y de nada más. El relleno es pastel y el glifo el mismo tono varios pasos más oscuro, y eso es a propósito: la marca es de 44 y vive dentro de una fila clara, así que tiene lugar para leerse entera sin gritarle al título de al lado. Para lo chico está la familia de etiquetas, que sí es viva. Los cinco salen de una regla: los tonos son los de las etiquetas, el relleno va a L 0.80 en OKLCH con el techo común de croma de los cinco (0.101) y el glifo es el mismo tono a 4.5:1 de su relleno — en oscuro, a 7:1, porque un trazo claro y fino sobre un relleno profundo se apaga. El techo tiene que ser común y no un porcentaje del de cada tono: a esa luminosidad el verde aguanta el doble de croma que el azul, así que «el 90% de lo que cada uno aguante» da un verde flúor al lado de un azul pastel."
      >
        <Grid min={150}>
          <Swatch token="--mark-green" />
          <Swatch token="--mark-green-ink" />
          <Swatch token="--mark-purple" />
          <Swatch token="--mark-purple-ink" />
          <Swatch token="--mark-orange" />
          <Swatch token="--mark-orange-ink" />
          <Swatch token="--mark-blue" />
          <Swatch token="--mark-blue-ink" />
          <Swatch token="--mark-pink" />
          <Swatch token="--mark-pink-ink" />
        </Grid>
      </Block>
    </Section>
  )
}
