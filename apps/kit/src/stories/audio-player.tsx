import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

/** Salen de `python3 apps/kit/scripts/picos.py apps/kit/public/audio/consigna.mp3 --barras 72`. */
const picos = [
  0.770, 0.921, 0.855, 1.000, 0.455, 0.916, 1.000, 0.944, 0.967, 0.222, 0.553, 0.741,
  0.996, 0.594, 0.357, 0.163, 0.002, 0.391, 0.538, 1.000, 0.403, 0.743, 0.613, 0.402,
  0.590, 0.638, 0.901, 0.383, 0.230, 0.353, 1.000, 0.189, 0.008, 0.000, 0.000, 0.000,
  0.000, 0.000, 0.646, 0.651, 0.679, 0.375, 0.630, 0.634, 0.643, 0.758, 0.175, 0.000,
  0.000, 0.000, 0.000, 0.583, 0.569, 0.562, 0.610, 0.731, 0.838, 0.573, 0.086, 0.537,
  0.144, 0.000, 0.702, 0.236, 0.829, 0.570, 0.945, 0.027, 0.084, 0.002, 0.000, 0.000,
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
        note="La onda no es decoración: es el archivo. Los dos huecos de esta consigna son las pausas entre frases, así que se ve cuántas cosas se piden y se puede volver a la segunda sin escuchar la primera de nuevo."
      >
        <Panel>
          <Variant name="con onda y nombre">
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" peaks={picos} className="max-w-[520px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Sin los picos"
        note="Los picos se calculan antes y se pasan por prop. Cuando no están, la pieza dibuja una pista pelada: no inventa una onda que no es la de ese audio, porque una onda falsa dice «acá hay voz» donde no hay nada."
      >
        <Panel>
          <Variant name="pista pelada">
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" className="max-w-[520px]" />
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
            <AudioPlayer src="/audio/no-existe.mp3" title="Consigna · Matemática 4.º A" className="max-w-[520px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Uno por vez"
        note="Arrancar el segundo pausa el primero. Dos audios encimados no se entienden, y el que arranca segundo tapa al primero sin que nadie lo haya pedido."
      >
        <Panel>
          <Variant name="dos en la misma pantalla">
            <div className="flex w-full max-w-[520px] flex-col gap-3">
              <AudioPlayer src={AUDIO} title="Devolución para Ana Pérez" peaks={picos} size="sm" />
              <AudioPlayer src={AUDIO} title="Devolución para Bruno Díaz" peaks={picos} size="sm" />
            </div>
          </Variant>
        </Panel>
      </Section>

      <Note icon="campaign" title="Lo que dice Apple sobre reproducir audio">
        La guía es tajante en una cosa: <strong>hacer un reproductor propio se justifica solo si
        ofrece algo que el del sistema no</strong>. Acá eso es la onda — el reproductor nativo no
        deja ver dónde hay voz y dónde hay silencio, que es lo único que permite volver a la segunda
        consigna sin escuchar la primera de nuevo. Si eso no hiciera falta, correspondería el
        <code>{'<audio controls>'}</code> pelado.
        {' '}
        De ahí salen otras dos: <strong>el volumen es del sistema</strong> y una app no lo toca, así
        que la pieza no trae control de volumen a propósito; y <strong>los controles de audio no se
        redefinen</strong>, así que mientras suena registra play, pause y seek en el sistema y los
        botones del auricular y la pantalla bloqueada caen acá y significan lo que dicen.
      </Note>

      <Note icon="warning" title="Dos cosas que la guía pide y el navegador no da">
        <strong>Al desconectar el auricular, la reproducción tiene que frenar en el acto.</strong> En
        la web no hay un evento confiable para eso: algunos navegadores pausan solos al cambiar de
        salida y otros siguen sonando por el parlante. No se simula, porque simularlo mal es peor
        que no hacerlo.
        {' '}
        <strong>Y no hay forma de mandar el audio a otro parlante desde la página.</strong> Eso lo
        maneja el sistema operativo, y está bien que así sea.
      </Note>

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
          'No arranca solo, y no hay prop para que lo haga. Un audio que empieza sin que nadie lo pida tapa a un lector de pantalla, y la WCAG pide poder frenarlo; la forma más barata de cumplir es que no arranque.',
          'La onda es un gráfico, así que va `aria-hidden` y quien lleva el significado es el slider. Lo que un gráfico de datos resolvería con un audio graph —escuchar la forma— acá ya lo resuelve el botón de play: el dato es el sonido.',
        ]}
      />
    </Page>
  )
}
