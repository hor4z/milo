import cls from './media.module.css'
import { AudioPlayer } from '@milo/ui/audio-player'
import { Figure } from '@milo/ui/figure'
import { Icon } from '@milo/ui/icon'
import { A11y, Cluster, Footnote, Note, Page, Rich, Section, Stack } from '../kit'

const peaks = [0.2, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.85, 0.55, 0.25, 0.65, 0.45, 0.75, 0.35, 0.6]

const media = [
  {
    name: 'Imagen',
    piece: 'Figure',
    solves: 'Lo que se entiende de un vistazo: una figura de geometría, la foto de una consigna en el pizarrón, la portada de un espacio.',
    needs: 'Texto alternativo y una proporción reservada antes de cargar.',
    no: 'No lleva texto adentro: lo que dice una imagen no se puede buscar, ni traducir, ni leer en voz alta.',
  },
  {
    name: 'Audio',
    piece: 'AudioPlayer',
    solves: 'La voz de alguien: una consigna hablada, la devolución de una corrección. Llega el tono, que un texto no lleva.',
    needs: 'Su transcripción, y la onda, que es lo que deja volver a una parte sin escuchar todo.',
    no: 'No arranca solo, y no hay prop para que lo haga.',
  },
  {
    name: 'Video',
    piece: 'todavía no hay pieza',
    solves: 'Lo que pasa en el tiempo: un procedimiento, un experimento, algo que se arma paso a paso.',
    needs: 'Subtítulos y controles desde el primer cuadro, y su proporción original sin barras metidas adentro del archivo.',
    no: 'No es el medio por defecto porque sí: pesa, no se puede hojear y obliga a mirar todo el rato que dure.',
  },
  {
    name: 'Animación',
    piece: 'los bucles de las mascotas',
    solves: 'Un gesto corto que acompaña, no que informa.',
    needs: 'Respetar `prefers-reduced-motion`, y ahí no se atenúa: se reemplaza por la imagen quieta.',
    no: 'Nunca lleva información que no esté en otro lado: quien la apaga no se pierde nada.',
  },
]

const equivalents = [
  {
    name: 'Subtítulos',
    what: 'El diálogo que se dice, escrito y sincronizado.',
    when: 'Todo video con alguien hablando. En un aula con ruido y sin auriculares, es lo que hace que el video sirva.',
  },
  {
    name: 'Leyendas',
    what: 'El equivalente escrito de todo lo que suena, no solo del diálogo: también el golpe, la campana, el silencio que significa algo.',
    when: 'Cuando el sonido lleva información que el diálogo no dice.',
  },
  {
    name: 'Audiodescripción',
    what: 'El espejo de las leyendas: narra hablado lo que solo se ve, metido en las pausas del audio.',
    when: 'Cuando algo importante pasa en la pantalla y nadie lo nombra. Es la que siempre se olvida.',
  },
  {
    name: 'Transcripción',
    what: 'El texto completo de lo que se oye y de lo que se ve, junto y fuera de la línea de tiempo.',
    when: 'Audio largo y video largo, y para lo que se quiera buscar, citar o leer en un colectivo.',
  },
]

const rules = [
  {
    title: 'Todo lo que se oye se puede leer, y lo que solo se ve también se puede oír',
    body: 'Las cuatro formas de arriba no son lo mismo y no se reemplazan entre sí. La que más se olvida es la audiodescripción, que es la única que sirve a quien no ve el video.',
  },
  {
    title: 'La proporción se reserva antes de cargar, y es la del archivo',
    body: 'Con la proporción puesta de entrada, el hueco ya tiene el tamaño final y nada salta cuando la imagen llega. Y el video va en su proporción original: si trae las barras negras metidas adentro del cuadro, el sistema ya no puede escalarlo bien y aparece más chico de lo que es.',
  },
  {
    title: 'El alt dice para qué está, no qué se ve',
    body: 'Si la imagen es decorativa va con `alt=""` y el lector la saltea. Si es el contenido (una consigna fotografiada, un gráfico) el alt dice lo que hay que saber, y si eso no entra en una línea, entonces no era una imagen: era texto.',
  },
  {
    title: 'El volumen no es de la pieza',
    body: 'Una pieza puede mezclar sus propios niveles, pero el volumen final lo pone el sistema operativo. Un control adentro compite con el de afuera y pierde. Y si el dispositivo está en silencio, está en silencio: no hay contenido tan importante como para sonar en una clase.',
  },
  {
    title: 'La velocidad es de quien escucha, y va a la vista',
    body: 'Es el control que más se usa y el que más cambia si alguien entiende o no, así que no vive en un menú. Lo que no arregla: acelerar una voz mal grabada la vuelve peor, y el orden es grabar bien y después dar el control.',
  },
  {
    title: 'No hay sonidos de aviso, y es una decisión',
    body: 'Treinta dispositivos en un aula haciendo el mismo tintineo cuando el docente publica una actividad es un aula que se detiene. Lo que pasa se dice en pantalla, que es donde alguien lo puede volver a mirar. Si algún día hace falta uno: corto, apagado por defecto, y nunca la única señal de que algo pasó.',
  },
  {
    title: 'Lo que pesa se mide',
    body: 'Una red escolar es el piso, no el promedio. El bucle de Otto son 390 KB por 100 cuadros; el retrato, 148. Un video de dos minutos es dos órdenes de magnitud más que todo eso junto, así que va cuando el tiempo es el contenido y no cuando queda lindo.',
  },
]

export function MediaSection() {
  return (
    <Page
      title="Medios"
      kind="Fundamentos"
      imports="import { AudioPlayer } from '@milo/ui/audio-player' · import { Figure } from '@milo/ui/figure'"
      lead="Imagen, audio, video y animación. Cuál va cuándo, qué pide cada uno para estar terminado, y qué es lo que ninguno puede hacer solo."
    >
      <Section
        title="Cuatro medios, y qué decide cada uno"
        note="La pregunta no es cuál se ve mejor: es qué parte de lo que hay que entender vive en el tiempo, cuál en el espacio y cuál en el tono de alguien."
      >
        <Stack>
          {media.map(m => (
            <div key={m.name} className={`${cls.mediumCard} bg-surface`}>
              <div className={cls.mediumHead}>
                <span className={cls.mediumName}>{m.name}</span>
                <code className={cls.mediumPiece}>{m.piece}</code>
              </div>
              <span className={cls.mediumBody}><Rich text={m.solves} /></span>
              <div className={cls.mediumRow}>
                <Icon name="check" size={16} className={cls.verdictIconGood} />
                <span className={cls.mediumNote}><Rich text={m.needs} /></span>
              </div>
              <div className={cls.mediumRow}>
                <Icon name="close" size={16} className={cls.verdictIconBad} />
                <span className={cls.mediumNote}><Rich text={m.no} /></span>
              </div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section
        title="Nada suena sin que alguien lo pida"
        note="Ni un audio, ni un aviso, ni un efecto. Es la regla que manda sobre todas las demás."
      >
        <div className={`${cls.ruleCard} bg-surface`}>
          <p className={cls.ruleText}>
            Esto se usa en un aula con treinta personas y un solo proyector, en un colectivo, y al
            lado de alguien que tiene un lector de pantalla hablando. Un audio que arranca solo es,
            en el mejor caso, alguien apagando el volumen; en el peor, dos voces encimadas para
            quien depende de una de las dos. El bucle mudo y corto de una mascota es la excepción,
            y por eso es mudo y corto.
          </p>
          <p className={cls.ruleText}>
            El corolario, que se olvida: si dos audios pueden sonar juntos, van a sonar juntos.
            Arrancar uno para el otro, y el sistema ya lo hace: probá abrir los dos de abajo.
          </p>
        </div>
        <div className={cls.ruleGrid}>
          <AudioPlayer src="/audio/consigna.mp3" title="Consigna de Física, grabada" peaks={peaks} />
          <AudioPlayer src="/audio/consigna.mp3" title="Devolución para Ana" peaks={peaks} />
        </div>
      </Section>

      <Section
        title="Las cuatro formas escritas, que no son la misma"
        note="Son cuatro cosas distintas y cada una cubre a alguien que las otras no."
      >
        <div className={cls.specimenGrid}>
          {equivalents.map(e => (
            <div key={e.name} className={`${cls.specimen} bg-surface`}>
              <span className={cls.specimenLabel}>{e.name}</span>
              <span className={cls.specimenBody}><Rich text={e.what} /></span>
              <span className={cls.specimenWhen}><Rich text={e.when} /></span>
            </div>
          ))}
        </div>
        <Footnote>
          Y el texto de los subtítulos se puede configurar: tamaño y contraste los elige quien lee, no quien
          hizo el video.
        </Footnote>
      </Section>

      <Section title="Las siete reglas" note="Valen para cualquier medio, y las dos primeras son las que más se saltean.">
        <div className={cls.specimenGrid}>
          {rules.map(r => (
            <div key={r.title} className={`${cls.specimen} bg-surface`}>
              <span className={cls.specimenLabel}>{r.title}</span>
              <span className={cls.specimenBody}><Rich text={r.body} /></span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Una imagen que es contenido y una que no"
        note="La misma pieza, y lo único que cambia es el alt. La de la izquierda tiene algo que saber; la de la derecha acompaña."
      >
        <Cluster gap="lg" align="start">
          <div className={cls.sample}>
            <Figure src="/mascotas/otto-primitivo.webp" alt="Otto, la nutria, de pie y de frente" ratio="4/3" fit="contain">
              <Figure.Caption>Es el contenido</Figure.Caption>
            </Figure>
            <code className={cls.sampleAlt}>alt="Otto, la nutria, de pie y de frente"</code>
          </div>
          <div className={cls.sample}>
            <Figure src="/mascotas/amelia.webp" alt="" ratio="4/3" fit="contain">
              <Figure.Caption>Acompaña</Figure.Caption>
            </Figure>
            <code className={cls.sampleAlt}>alt=""</code>
          </div>
        </Cluster>
        <Footnote>
          La decorativa no lleva un alt vacío por descuido: lo lleva a propósito, para que el lector de
          pantalla la saltee en vez de leer un nombre de archivo.
        </Footnote>
      </Section>

      <Note title="De dónde sale esto">
        Las cuatro formas escritas, la proporción original del video, el volumen que es del sistema y los
        controles que no se reinterpretan salen de las Human Interface Guidelines de Apple, que es la
        referencia que este sistema toma para lo que ya está resuelto en otro lado. Lo que no sale de ahí
        es el peso en una red escolar, el "nada suena sin que alguien lo pida" y el silencio de los avisos,
        que son de acá.
      </Note>

      <Section
        title="Lo que todavía no está"
        note="Escrito para que se note, que es la diferencia entre una decisión pendiente y un olvido."
      >
        <Stack gap="sm">
          {[
            ['No hay pieza de video', 'Cuando entre, entra con los subtítulos adentro y no como una prop que se puede olvidar.'],
            ['No hay doctrina de proporción por tipo de contenido', '`Figure` acepta cuatro, pero nadie dice cuál va para qué.'],
            ['No hay hoja de impresión', 'Un docente imprime una consigna, y hoy lo que sale es la pantalla.'],
          ].map(([t, d]) => (
            <div key={t} className={cls.gapRow}>
              <span className={cls.gapTitle}>{t}</span>
              <span className={cls.gapBody}><Rich text={d} /></span>
            </div>
          ))}
        </Stack>
      </Section>

      <A11y>
        <A11y.Item>Nada arranca solo, así que un lector de pantalla nunca compite con un audio del sistema.</A11y.Item>
        <A11y.Item>Un audio que arranca detiene al otro: dos voces a la vez no se separan, ni siquiera con buen oído.</A11y.Item>
        <A11y.Item>El botón dice lo que va a hacer, "Reproducir" o "Pausar", y el tiempo se anuncia como "0:45 de 1:30" y no como un número suelto.</A11y.Item>
        <A11y.Item>La onda va `aria-hidden`: lo que lleva el significado es el control, no el dibujo.</A11y.Item>
        <A11y.Item>Todo lo hablado tiene su texto, que es lo que le llega a quien no oye y también a quien está donde no puede escuchar.</A11y.Item>
        <A11y.Item>Una imagen decorativa va con `alt=""` para que el lector la saltee, y una animación se reemplaza por su cuadro quieto con `prefers-reduced-motion`.</A11y.Item>
      </A11y>
    </Page>
  )
}
