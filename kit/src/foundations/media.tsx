import cls from './media.module.css'
import { Figure, Icon } from '@milo/ui'
import { Cluster, Footnote, Note, Page, Rich, Section, Stack } from '../kit'

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
    title: 'Nada arranca solo',
    body: 'Ni audio ni video. Un medio que empieza a sonar sin que nadie lo pida interrumpe una clase entera, y en un aula el que lo escucha no es solo quien tocó. El bucle mudo y corto de una mascota es la excepción, y por eso es mudo y corto.',
  },
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
    body: 'Una pieza puede mezclar sus propios niveles, pero el volumen final lo pone el sistema operativo. Un control adentro compite con el de afuera y pierde. Lo mismo con los botones del auricular: hacen lo que siempre hicieron o no hacen nada, nunca otra cosa.',
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
      lead="Imagen, audio, video y animación. Cuál va cuándo, qué pide cada uno para estar terminado, y qué es lo que ninguno puede hacer solo. La doctrina de la voz grabada vive aparte, en Voz y sonido."
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
        title="Las cuatro formas escritas, que no son la misma"
        note="Acá el sistema venía diciendo 'subtítulos o transcripción' como si fueran dos maneras de decir lo mismo. Son cuatro cosas distintas y cada una cubre a alguien que las otras no."
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

      <Section title="Las seis reglas" note="Valen para cualquier medio, y las tres primeras son las que más se saltean.">
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
            <Figure
              src="/mascotas/otto-primitivo.webp"
              alt="Otto, la nutria, de pie y de frente"
              ratio="4/3"
              fit="contain"
              caption="Es el contenido"
            />
            <code className={cls.sampleAlt}>alt="Otto, la nutria, de pie y de frente"</code>
          </div>
          <div className={cls.sample}>
            <Figure
              src="/mascotas/amelia.webp"
              alt=""
              ratio="4/3"
              fit="contain"
              caption="Acompaña"
            />
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
        es el peso en una red escolar y el "nada arranca solo", que son de acá.
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
    </Page>
  )
}
