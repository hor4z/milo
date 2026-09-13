import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section } from '../kit'

/** Salen de `python3 apps/kit/scripts/picos.py apps/kit/public/audio/consigna.mp3 --barras 56`. */
const picos = [
  0.848, 0.896, 1.000, 0.544, 0.906, 1.000, 1.000, 0.202, 0.584, 0.971, 0.665, 0.342,
  0.061, 0.347, 0.906, 0.466, 0.659, 0.641, 0.612, 0.136, 0.978, 0.346, 0.302, 0.960,
  0.217, 0.005, 0.000, 0.000, 0.000, 0.474, 0.599, 0.713, 0.447, 0.686, 0.570, 0.689,
  0.022, 0.000, 0.000, 0.000, 0.565, 0.665, 0.824, 0.647, 0.621, 0.233, 0.492, 0.006,
  0.622, 0.409, 0.656, 0.970, 0.056, 0.069, 0.000, 0.000,
] as const

/** Los del archivo largo, con las mismas cincuenta y seis: la cantidad la decide el ancho y no la duración. */
const picosLargos = [
  0.737, 0.604, 0.706, 0.571, 0.761, 0.787, 0.616, 0.845, 0.180, 0.943, 0.602, 0.798,
  0.909, 0.038, 1.000, 0.793, 0.796, 0.953, 1.000, 0.654, 0.500, 0.593, 0.550, 0.531,
  0.741, 0.553, 0.595, 0.918, 0.553, 0.561, 0.428, 0.355, 0.495, 0.859, 0.617, 0.326,
  0.655, 0.870, 0.785, 0.182, 0.046, 1.000, 0.749, 0.380, 0.995, 0.852, 0.383, 0.586,
  0.715, 0.514, 0.626, 0.443, 0.253, 0.665, 0.487, 0.204,
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
        note="La onda no es decoración: es el archivo. Los huecos de esta consigna son las pausas entre frases, así que se ve cuántas cosas se piden y se puede volver a la segunda sin escuchar la primera de nuevo. Las barras se reparten el ancho y el hueco mide lo mismo que la barra, así que la cantidad de picos es lo que decide si salen finas o gordas."
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
