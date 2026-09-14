import cls from './sound.module.css'
import { AudioPlayer, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { A11y, Note, Page, Rich, Section } from '../kit'

const peaks = [0.2, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.3, 0.85, 0.55, 0.25, 0.65, 0.45, 0.75, 0.35, 0.6]

const speeds = [
  ['0,75×', 'Quien todavía está aprendiendo a leer, o escucha en un idioma que no es el suyo'],
  ['1×', 'El default, y es el único que no hay que explicar'],
  ['1,25× y 1,5×', 'Quien vuelve a escuchar algo que ya entendió'],
]

const byRole = [
  ['Estudiante', 'Escuchar es una puerta de entrada, no un extra', 'El control de velocidad es lo que más se usa. Y el punto donde quedó se guarda: nadie quiere volver a buscar el minuto 4'],
  ['Docente', 'Grabar es más rápido que escribir', 'Grabar una devolución tiene que ser un botón, no un flujo. Cuarenta segundos hablando contra cinco minutos tipeando'],
  ['Familia', 'Puede ser el único canal que funciona', 'Hay familias que leen poco. Un audio de veinte segundos llega donde no llega un mail'],
  ['Conducción', 'Casi nunca', 'Un tablero no habla. Si hay audio, es porque alguien lo fue a buscar'],
]

export function SoundSection() {
  return (
    <Page
      title="Voz y sonido"
      kind="Fundamentos"
      imports="import { AudioPlayer } from '@milo/ui'"
      lead="Para parte de quien usa esto, escuchar no es una comodidad: es el único canal que funciona. Un chico de diez años que todavía lee despacio entiende una consigna hablada que no entiende leída. Por eso el sonido acá se trata como contenido y no como efecto."
    >
      <Section
        title="La regla que manda sobre todas"
        note="Nada suena sin que alguien lo pida. Ni un audio, ni un aviso, ni un efecto."
      >
        <div className={`${cls.ruleCard} bg-surface`}>
          <p className={cls.ruleText}>
            Esto se usa en un aula con treinta personas y un solo proyector, en un colectivo, y al
            lado de alguien que tiene un lector de pantalla hablando. Un audio que arranca solo es,
            en el mejor caso, alguien apagando el volumen; en el peor, dos voces encimadas para
            quien depende de una de las dos.
          </p>
          <p className={cls.ruleAside}>
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
        title="La voz"
        note="Sea una persona grabando o una voz sintética leyendo, las decisiones son las mismas."
      >
        <div className={cls.voiceGrid}>
          <Point title="Cálida antes que correcta">{`Tiene que sonar a alguien hablándole a quien escucha, no a un anuncio de aeropuerto. La voz institucional se lee como que el mensaje no es para vos.`}</Point>
          <Point title="En el castellano de acá">{`Rioplatense. Una voz neutra latina o peninsular hace que un chico de diez años deje de escuchar en la primera frase, porque no le habla a él.`}</Point>
          <Point title="Más lenta que una charla">{`Una consigna se escucha una vez y hay que poder seguirla. Alrededor de ciento cuarenta palabras por minuto, que es más lento de lo que suena natural leyendo en voz alta.`}</Point>
          <Point title="Con las pausas puestas">{`Una voz que no respeta el punto y la coma es intransitable. Si la sintética las come, se corrigen en el texto antes de leerlo, no después.`}</Point>
          <Point title="Los números se dicen, no se deletrean">{'`9,8` es "nueve coma ocho" y `3/4` es "tres cuartos", no "tres barra cuatro". En un producto donde se enseña matemática, esto es contenido y no formato.'}</Point>
          <Point title="Sin música atrás">{`Una base musical debajo de una explicación sube el esfuerzo de escucha para todo el mundo y la vuelve imposible para quien usa audífonos.`}</Point>
        </div>
      </Section>

      <Section
        title="La velocidad es del que escucha"
        note="Es el control que más se usa y el que más cambia si alguien entiende o no. Va a la vista, no en un menú."
      >
        <Table label="Qué velocidad sirve a quién" minWidth={480}>
          <TableHeader>
            <TableRow>
              <TableHead>Velocidad</TableHead>
              <TableHead>Para quién</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeds.map(([v, q]) => (
              <TableRow key={v}>
                <TableCell>{v}</TableCell>
                <TableCell>{q}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Note title="Lo que la velocidad no arregla">
          Acelerar una voz mal grabada la vuelve peor. El orden es grabar bien, después dar el
          control.
        </Note>
      </Section>

      <Section
        title="El sistema no tiene sonidos de aviso, y es una decisión"
        note="No es que falten: no van."
      >
        <div className={`${cls.silenceCard} bg-surface`}>
          <p className={cls.silenceText}>
            Treinta dispositivos en un aula haciendo el mismo tintineo cuando el docente publica
            una actividad es un aula que se detiene. Lo que pasa se dice en pantalla, que es donde
            alguien lo puede volver a mirar.
          </p>
          <p className={cls.silenceAside}>
            Si algún día hace falta uno: corto, apagado por defecto, y nunca la única señal de que
            algo pasó. Un sonido que lleva información solo es información que no le llega a quien
            no oye.
          </p>
        </div>
      </Section>

      <Section
        title="El volumen no lo pone el sistema"
        note="Es del dispositivo y de quien lo tiene en la mano."
      >
        <div className={cls.volumeGrid}>
          <Point title="No se normaliza para arriba">{`Subirle el volumen a un audio bajo para que se escuche igual que el resto es decidir por alguien que ya decidió.`}</Point>
          <Point title="No se pisa el silencio">{`Si el dispositivo está en silencio, está en silencio. No hay contenido tan importante como para sonar en una clase.`}</Point>
        </div>
      </Section>

      <Section
        title="Todo lo que suena tiene su equivalente escrito"
        note="No es un extra de accesibilidad: es lo que hace que el contenido se pueda buscar, citar y leer en un colectivo."
      >
        <div className={cls.captionGrid}>
          <Point title="Una devolución grabada lleva su texto">{`Aunque sea un resumen de dos líneas. Sin eso, un estudiante sordo pierde la devolución entera y nadie se entera.`}</Point>
          <Point title="Lo hablado lleva subtítulos">{`Y el subtítulo es el texto de verdad, no una transcripción automática sin revisar: una consigna con una palabra mal transcrita es una consigna distinta.`}</Point>
        </div>
      </Section>

      <Section title="Por rol" note="La misma pieza, y cambia para qué se usa.">
        <Table label="Qué papel juega el audio para cada rol" minWidth={620}>
          <TableHeader>
            <TableRow>
              <TableHead>Quién</TableHead>
              <TableHead>Qué es el audio</TableHead>
              <TableHead>Lo que hay que cuidarle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byRole.map(([r, q, c]) => (
              <TableRow key={r}>
                <TableCell>{r}</TableCell>
                <TableCell><Rich text={q} /></TableCell>
                <TableCell>{c}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <A11y
        items={[
          'Nada arranca solo, así que un lector de pantalla nunca compite con un audio del sistema.',
          'Un audio que arranca detiene al otro: dos voces a la vez no se separan, ni siquiera con buen oído.',
          'El botón dice lo que va a hacer, "Reproducir" o "Pausar", y el tiempo se anuncia como "0:45 de 1:30" y no como un número suelto.',
          'La onda va `aria-hidden`: lo que lleva el significado es el control, no el dibujo.',
          'Todo lo hablado tiene su texto, que es lo que le llega a quien no oye y también a quien está donde no puede escuchar.',
        ]}
      />
    </Page>
  )
}

function Point({ title, children }: { title: string; children: string }) {
  return (
    <div className={`${cls.specimen} bg-surface`}>
      <span className={cls.specimenLabel}>{title}</span>
      <span className={cls.specimenBody}><Rich text={children} /></span>
    </div>
  )
}
