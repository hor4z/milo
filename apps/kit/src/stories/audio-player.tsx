import cls from './audio-player.module.css'
import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Rich } from '../kit'

/** Salen de `npm run picos -- apps/kit/public/audio/consigna.mp3 --barras 64`. */
const picos = [
  0.820, 0.945, 0.954, 0.886, 0.717, 1.000, 0.977, 1.000, 0.211, 0.519, 0.775, 1.000,
  0.206, 0.310, 0.015, 0.368, 0.803, 0.712, 0.488, 0.796, 0.373, 0.637, 0.190, 1.000,
  0.368, 0.297, 0.783, 0.702, 0.041, 0.004, 0.000, 0.000, 0.000, 0.005, 0.609, 0.696,
  0.639, 0.520, 0.671, 0.608, 0.724, 0.095, 0.000, 0.000, 0.000, 0.312, 0.586, 0.651,
  0.704, 0.589, 0.807, 0.481, 0.408, 0.328, 0.000, 0.660, 0.321, 0.756, 0.961, 0.375,
  0.082, 0.010, 0.000, 0.000,
] as const

/** Los del archivo largo, con las mismas sesenta y cuatro. */
const picosLargos = [
  0.730, 0.700, 0.593, 0.562, 0.807, 0.526, 0.878, 0.598, 0.896, 0.200, 0.832, 0.637,
  0.787, 1.000, 0.467, 0.038, 1.000, 0.889, 0.862, 0.851, 0.732, 1.000, 0.763, 0.411,
  0.582, 0.588, 0.442, 0.563, 0.812, 0.503, 0.689, 0.892, 0.482, 0.685, 0.430, 0.403,
  0.058, 0.760, 0.746, 0.639, 0.348, 0.495, 0.885, 0.673, 0.771, 0.031, 0.216, 1.000,
  0.755, 0.477, 0.830, 0.738, 0.873, 0.332, 0.754, 0.629, 0.547, 0.546, 0.551, 0.316,
  0.556, 0.533, 0.469, 0.197,
] as const

/** Las reglas de la pieza. Se contrastaron contra la guía de audio de Apple y contra la WCAG, y ninguna las contradice. */
const reglas = [
  ['Se usa cuando hace falta ver la onda', 'Es lo único que da sobre el reproductor del navegador. Si nadie necesita saltar a una parte, va un `audio` con los controles de siempre.'],
  ['El volumen no es de la pieza', 'Lo pone el sistema. Un control adentro compite con el de afuera y pierde.'],
  ['Los controles del sistema hacen lo que dicen', 'Mientras suena, play, pause y seek quedan registrados: el botón del auricular controla este audio y no otra cosa.'],
  ['No arranca solo', 'Y no hay prop para que lo haga.'],
  ['Uno por vez', 'Arrancar el segundo pausa el primero.'],
] as const

const AUDIO = '/audio/consigna.mp3'
const LARGO = '/audio/explicacion.mp3'

export function AudioPlayerStory() {
  return (
    <Page
      title="AudioPlayer"
      kind="Datos"
      imports="import { AudioPlayer } from '@milo/ui'"
      lead="Un archivo de audio con su onda: play, una línea de tiempo que se arrastra y el reloj. Para una consigna grabada o la devolución hablada de una corrección."
    >
      <Section
        title="La pieza"
        note="La onda es el archivo, no un adorno: los huecos son las pausas entre frases, así que se puede volver a la segunda sin escuchar la primera."
      >
        <Panel>
          <div className={cls.div}>
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" peaks={picos} />
          </div>
        </Panel>
      </Section>

      <Section
        title="Sin los picos"
        note="Los picos se calculan antes y se pasan por prop. Sin ellos va una pista pelada: no se inventa una onda que no es la de ese audio."
      >
        <Panel>
          <div className={cls.div2}>
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" />
          </div>
        </Panel>
      </Section>

      <Section
        title="Los tres talles"
        note="Cambian el botón y el alto de la onda. El ancho lo pone siempre lo que la contiene, y con él, el grosor de las barras."
      >
        <Panel>
          <div className={cls.div3}>
            <AudioPlayer src={AUDIO} peaks={picos} size="sm" />
            <AudioPlayer src={AUDIO} peaks={picos} />
            <AudioPlayer src={AUDIO} peaks={picos} size="lg" />
          </div>
        </Panel>
      </Section>

      <Section title="Un archivo largo" note="Cuarenta y nueve segundos con las mismas sesenta y cuatro barras.">
        <Panel>
          <div className={cls.div4}>
            <AudioPlayer src={LARGO} title="Explicación grabada" peaks={picosLargos} />
          </div>
        </Panel>
      </Section>

      <Section title="Uno por vez" note="Arrancar el segundo pausa el primero.">
        <Panel>
          <div className={cls.div5}>
            <AudioPlayer src={AUDIO} title="Devolución para Ana Pérez" peaks={picos} size="sm" />
            <AudioPlayer src={LARGO} title="Devolución para Bruno Díaz" peaks={picosLargos} size="sm" />
          </div>
        </Panel>
      </Section>

      <Section title="Lo que va al costado" note="Descargar, un menú, borrar. Entra por `actions` y no como props propias.">
        <Panel>
          <div className={cls.div6}>
            <AudioPlayer
              src={AUDIO}
              title="Devolución para Ana Pérez"
              peaks={picos}
              actions={(
                <Tooltip label="Descargar">
                  <IconButton icon="download" label="Descargar el audio" size="sm" />
                </Tooltip>
              )}
            />
          </div>
        </Panel>
      </Section>

      <Section title="Cuando el archivo no está" note="Lo dice con palabras y apaga lo que no se puede usar.">
        <Panel>
          <div className={cls.div7}>
            <AudioPlayer src="/audio/no-existe.mp3" title="Consigna · Matemática 4.º A" />
          </div>
        </Panel>
      </Section>

      <Section title="Las reglas" note="Valen para cualquier pantalla que reproduzca audio.">
        <div className={`${cls.div8} bg-surface`}>
          {reglas.map(([regla, porque]) => (
            <div key={regla} className={cls.div9}>
              <span className={cls.span}>{regla}</span>
              <span className={cls.span2}><Rich text={porque} /></span>
            </div>
          ))}
        </div>
      </Section>

      <Note title="La línea de tiempo no es el `Slider`">
        El `Slider` dice "elegí un valor"; acá se mira un archivo y se salta a un lugar. Lo que sí
        comparten es el fondo: los dos son un {' '}<code>input type=range</code> transparente encima
        de lo que se ve, así que el teclado y el arrastre son los del navegador.
      </Note>

      <Props of="AudioPlayer" />

      <A11y
        items={[
          'El botón cambia de nombre según lo que va a hacer: "Reproducir" y "Pausar".',
          'La línea de tiempo es un `slider` de verdad: flechas, Home, End y las dos de página, todas del navegador.',
          'El `aria-valuetext` dice "0:45 de 1:30" y no "45": un número suelto no significa nada cuando el rango es un archivo.',
          'La onda va `aria-hidden` y el significado lo lleva el slider. Escuchar la forma (lo que un gráfico resolvería con un audio graph) acá ya lo hace el botón de play.',
          'Mientras carga hay un `status` que lo anuncia; si el archivo no está, el error va en texto y no solo en el color del borde.',
        ]}
      />
    </Page>
  )
}
