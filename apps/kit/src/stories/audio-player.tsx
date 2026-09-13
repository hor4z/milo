import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

/** Salen de `python3 apps/kit/scripts/picos.py apps/kit/public/audio/consigna.mp3 --barras 72`. */
const picos = [
  0.401, 0.569, 0.389, 0.868, 0.533, 0.475, 1.000, 0.614, 0.376, 0.427, 0.726, 0.445,
  0.540, 0.783, 0.480, 0.778, 1.000, 0.649, 0.399, 0.245, 0.231, 0.841, 0.518, 0.462,
  0.924, 0.562, 0.575, 0.973, 0.599, 0.368, 0.518, 0.778, 0.478, 0.722, 0.989, 0.606,
  0.372, 0.228, 0.705, 0.864, 0.528, 0.324, 0.652, 0.703, 0.430, 0.766, 0.758, 0.464,
  1.000, 0.998, 0.610, 0.374, 0.230, 0.141, 0.098, 0.760, 0.473, 0.376, 0.931, 0.572,
  0.571, 1.000, 0.710, 0.435, 0.267, 0.163, 0.099, 0.060, 0.037, 0.016, 0.000, 0.000,
] as const

const AUDIO = '/audio/consigna.mp3'

export function AudioPlayerStory() {
  return (
    <Page
      title="AudioPlayer"
      kind="Datos"
      imports="import { AudioPlayer } from '@milo/ui'"
      lead="Un archivo de audio con su onda: play, una línea de tiempo que se arrastra y el reloj. Para una consigna grabada, la devolución hablada de una corrección o cualquier archivo que alguien subió."
    >
      <Section
        title="La pieza"
        note="La onda no es decoración: es el archivo. Se ve dónde hay voz y dónde hay silencio, así que se puede saltar a la parte que importa sin escuchar todo."
      >
        <Panel>
          <Variant name="con onda y nombre">
            <AudioPlayer src={AUDIO} title="Consigna · Lengua 6.º" peaks={picos} className="max-w-[520px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Sin los picos"
        note="Los picos se calculan antes y se pasan por prop. Cuando no están, la pieza dibuja una pista pelada: no inventa una onda que no es la de ese audio, porque una onda falsa dice «acá hay voz» donde no hay nada."
      >
        <Panel>
          <Variant name="pista pelada">
            <AudioPlayer src={AUDIO} title="Consigna · Lengua 6.º" className="max-w-[520px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Sin nombre y en una fila"
        note="Sin `title` el reproductor ocupa una sola fila, para cuando va adentro de otra cosa que ya dice de qué audio se trata — una fila de lista, una tarjeta, un mensaje."
      >
        <Panel>
          <Variant name="sm">
            <AudioPlayer src={AUDIO} peaks={picos} size="sm" className="max-w-[420px]" />
          </Variant>
          <Variant name="md">
            <AudioPlayer src={AUDIO} peaks={picos} className="max-w-[420px]" />
          </Variant>
          <Variant name="lg">
            <AudioPlayer src={AUDIO} peaks={picos} size="lg" className="max-w-[420px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Lo que va al costado"
        note="Descargar, un menú, borrar. Va por `actions` y no como props propias: cada pantalla necesita otras, y una prop por cada una termina en la número catorce."
      >
        <Panel>
          <Variant name="con descarga">
            <AudioPlayer
              src={AUDIO}
              title="Devolución para Ana Pérez"
              peaks={picos}
              className="max-w-[520px]"
              actions={(
                <Tooltip label="Descargar">
                  <IconButton icon="download" label="Descargar el audio" size="sm" />
                </Tooltip>
              )}
            />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Cuando el archivo no está"
        note="Un audio roto es un caso de todos los días: el archivo se borró, la red se cayó, el formato no va en ese navegador. La pieza lo dice con palabras y apaga lo que no se puede usar."
      >
        <Panel>
          <Variant name="error">
            <AudioPlayer src="/audio/no-existe.mp3" title="Consigna · Lengua 6.º" className="max-w-[520px]" />
          </Variant>
        </Panel>
      </Section>

      <Note title="La línea de tiempo no es el `Slider`">
        El `Slider` es el hermano del `Switch`: una píldora de 22 con un pulgar de 24 encima, y eso
        dice «elegí un valor». Acá no se elige un valor, se mira un archivo y se salta a un lugar:
        lo que se dibuja es el contenido. Lo que sí comparten es el fondo — los dos son un
        <code>input type=range</code> transparente encima de lo que se ve, así que el teclado, el
        arrastre y el foco son los del navegador y no un invento.
      </Note>

      <Props of="AudioPlayer" />

      <A11y
        items={[
          'El botón cambia de nombre según lo que va a hacer: «Reproducir» y «Pausar». Un botón que se llama siempre igual obliga a mirar el glifo para saber en qué estado está.',
          'La línea de tiempo es un `slider` de verdad: flechas para moverse, Home y End para los extremos, y Re Pág y Av Pág para saltos grandes. Todo eso lo da el navegador.',
          'El `aria-valuetext` dice «0:45 de 1:30» y no «45»: un número suelto no significa nada cuando el rango es un archivo.',
          'Mientras carga hay un `status` que lo anuncia, y si el archivo no está el error va en texto y no solo en el color del borde.',
          'No arranca solo. `autoPlay` existe pero el navegador solo lo permite en silencio, y un audio que empieza sin que nadie lo pida tapa a un lector de pantalla.',
        ]}
      />
    </Page>
  )
}
