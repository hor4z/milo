import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section } from '../kit'

/** Salen de `python3 apps/kit/scripts/picos.py apps/kit/public/audio/consigna.mp3 --barras 40`. */
const picos = [
  0.771, 1.000, 0.699, 1.000, 0.996, 0.450, 0.696, 0.776, 0.297, 0.296, 0.861, 0.441,
  0.662, 0.536, 0.836, 0.296, 0.786, 0.394, 0.003, 0.000, 0.000, 0.510, 0.747, 0.590,
  0.591, 0.594, 0.001, 0.000, 0.482, 0.568, 0.725, 0.698, 0.368, 0.385, 0.531, 0.585,
  0.879, 0.118, 0.014, 0.000,
] as const

/** Los del archivo largo, con las mismas cuarenta: la cantidad la decide el ancho y no la duración. */
const picosLargos = [
  0.799, 0.702, 0.772, 0.780, 0.736, 0.805, 0.754, 0.787, 1.000, 0.049, 1.000, 0.871,
  0.936, 0.968, 0.713, 0.658, 0.493, 0.831, 0.598, 0.934, 0.594, 0.573, 0.356, 0.817,
  0.720, 0.305, 0.996, 0.774, 0.072, 0.948, 0.782, 0.731, 0.991, 0.322, 0.861, 0.480,
  0.710, 0.403, 0.635, 0.349,
] as const

const AUDIO = '/audio/consigna.mp3'
const LARGO = '/audio/explicacion.mp3'

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
        note="La onda no es decoración: es el archivo. Los huecos de esta consigna son las pausas entre frases, así que se ve cuántas cosas se piden y se puede volver a la segunda sin escuchar la primera de nuevo. Las barras se reparten el ancho: cuantos menos picos se pasen, más gordas salen."
      >
        <Panel>
          <div className="py-4">
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" peaks={picos} />
          </div>
        </Panel>
      </Section>

      <Section
        title="Sin los picos"
        note="Los picos se calculan antes y se pasan por prop. Cuando no están, la pieza dibuja una pista pelada: no inventa una onda que no es la de ese audio, porque una onda falsa dice «acá hay voz» donde no hay nada."
      >
        <Panel>
          <div className="py-4">
            <AudioPlayer src={AUDIO} title="Consigna · Matemática 4.º A" />
          </div>
        </Panel>
      </Section>

      <Section
        title="Sin nombre y en una fila"
        note="Sin `title` el reproductor ocupa una sola fila, para cuando va adentro de otra cosa que ya dice de qué audio se trata — una fila de lista, una tarjeta, un mensaje. Los tres talles cambian el botón y el alto de la onda; el ancho siempre lo pone lo que lo contiene."
      >
        <Panel>
          <div className="flex flex-col gap-4 py-4">
            <AudioPlayer src={AUDIO} peaks={picos} size="sm" />
            <AudioPlayer src={AUDIO} peaks={picos} />
            <AudioPlayer src={AUDIO} peaks={picos} size="lg" />
          </div>
        </Panel>
      </Section>

      <Section
        title="Un archivo largo"
        note="Cuarenta y nueve segundos con las mismas cuarenta barras. La cantidad la decide el ancho del reproductor y no la duración: con el doble de barras en el mismo ancho quedan hilos que no se leen, y los silencios —que son lo que sirve— se pierden entre medio."
      >
        <Panel>
          <div className="py-4">
            <AudioPlayer src={LARGO} title="Explicación grabada" peaks={picosLargos} />
          </div>
        </Panel>
      </Section>

      <Section
        title="Uno por vez"
        note="Arrancar el segundo pausa el primero. Dos audios encimados no se entienden, y el que arranca segundo tapa al primero sin que nadie lo haya pedido."
      >
        <Panel>
          <div className="flex flex-col gap-3 py-4">
            <AudioPlayer src={AUDIO} title="Devolución para Ana Pérez" peaks={picos} size="sm" />
            <AudioPlayer src={LARGO} title="Devolución para Bruno Díaz" peaks={picosLargos} size="sm" />
          </div>
        </Panel>
      </Section>

      <Section
        title="Lo que va al costado"
        note="Descargar, un menú, borrar. Va por `actions` y no como props propias: cada pantalla necesita otras, y una prop por cada una termina en la número catorce."
      >
        <Panel>
          <div className="py-4">
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

      <Section
        title="Cuando el archivo no está"
        note="Un audio roto es un caso de todos los días: el archivo se borró, la red se cayó, el formato no va en ese navegador. La pieza lo dice con palabras y apaga lo que no se puede usar."
      >
        <Panel>
          <div className="py-4">
            <AudioPlayer src="/audio/no-existe.mp3" title="Consigna · Matemática 4.º A" />
          </div>
        </Panel>
      </Section>

      <Note icon="campaign" title="Lo que dice Apple sobre reproducir audio">
        La guía es tajante en una cosa: <strong>hacer un reproductor propio se justifica solo si
        ofrece algo que el del sistema no</strong>. Acá eso es la onda — el reproductor nativo no
        deja ver dónde hay voz y dónde hay silencio, que es lo único que permite volver a la segunda
        consigna sin escuchar la primera de nuevo. Si eso no hiciera falta, correspondería el
        {' '}<code>{'<audio controls>'}</code> pelado.
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
        {' '}<code>input type=range</code> transparente encima de lo que se ve, así que el teclado,
        el arrastre y el foco son los del navegador y no un invento.
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
