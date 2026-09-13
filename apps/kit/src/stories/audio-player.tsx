import { AudioPlayer, IconButton, Tooltip } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section } from '../kit'

/** Salen de `python3 apps/kit/scripts/picos.py apps/kit/public/audio/consigna.mp3 --barras 140`. */
const picos = [
  0.000, 0.998, 0.740, 0.943, 0.817, 0.760, 1.000, 0.780, 0.414, 0.467, 0.853, 0.751,
  1.000, 0.994, 0.675, 1.000, 0.844, 0.669, 0.031, 0.083, 0.696, 0.046, 0.824, 0.624,
  1.000, 0.944, 0.099, 0.003, 0.429, 0.234, 0.087, 0.004, 0.000, 0.014, 0.495, 0.247,
  0.779, 1.000, 0.269, 0.189, 0.520, 0.480, 0.866, 0.577, 0.376, 0.363, 0.620, 0.535,
  0.022, 0.001, 1.000, 0.692, 0.037, 0.411, 0.275, 0.030, 0.414, 0.151, 0.974, 0.960,
  0.304, 0.063, 0.010, 0.006, 0.001, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000,
  0.000, 0.000, 0.676, 0.460, 0.251, 0.807, 0.486, 0.780, 0.244, 0.377, 0.564, 0.743,
  0.540, 0.022, 0.498, 0.964, 0.600, 0.303, 0.031, 0.001, 0.000, 0.000, 0.000, 0.000,
  0.000, 0.000, 0.000, 0.000, 0.684, 0.428, 0.608, 0.654, 0.368, 0.760, 0.269, 0.887,
  0.023, 0.901, 0.583, 0.472, 0.535, 0.031, 0.002, 0.579, 0.390, 0.091, 0.000, 0.000,
  0.001, 0.745, 0.515, 0.027, 0.570, 0.791, 0.488, 0.253, 1.000, 0.577, 0.057, 0.029,
  0.106, 0.019, 0.011, 0.000, 0.000, 0.000, 0.000, 0.000,
] as const

/** Los del archivo largo, con las mismas ciento cuarenta: la cantidad la decide el ancho y no la duración. */
const picosLargos = [
  0.716, 0.590, 0.719, 0.523, 0.390, 0.550, 0.692, 0.613, 0.139, 0.679, 0.836, 0.671,
  0.074, 0.863, 0.696, 0.687, 0.428, 0.318, 1.000, 0.365, 0.250, 0.035, 0.037, 1.000,
  0.775, 0.398, 0.259, 0.849, 0.776, 0.660, 1.000, 0.221, 0.034, 0.033, 0.036, 1.000,
  0.666, 0.943, 0.593, 0.514, 0.909, 0.656, 0.058, 1.000, 0.486, 0.631, 1.000, 0.860,
  0.395, 0.815, 0.605, 0.344, 0.118, 0.454, 0.700, 0.541, 0.506, 0.457, 0.298, 0.560,
  0.465, 0.764, 0.681, 0.467, 0.462, 0.537, 0.515, 0.654, 0.630, 1.000, 0.154, 0.562,
  0.671, 0.540, 0.390, 0.441, 0.361, 0.416, 0.339, 0.035, 0.042, 0.676, 0.730, 0.733,
  0.651, 0.297, 0.607, 0.626, 0.343, 0.022, 0.021, 0.752, 0.535, 0.974, 0.744, 0.408,
  0.975, 0.403, 0.100, 0.023, 0.022, 0.049, 0.321, 0.998, 0.977, 0.718, 0.668, 0.617,
  0.236, 0.035, 1.000, 0.452, 0.872, 0.763, 0.918, 0.417, 0.341, 0.047, 0.029, 0.825,
  0.712, 0.528, 0.625, 0.589, 0.114, 0.042, 0.723, 0.545, 0.453, 0.375, 0.251, 0.042,
  0.545, 0.639, 0.486, 0.424, 0.391, 0.395, 0.252, 0.034,
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
