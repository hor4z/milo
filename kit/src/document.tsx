import cls from './document.module.css'
import { useState } from 'react'
import { Avatar } from '@milo/ui/avatar'
import { Button } from '@milo/ui/button'
import { Callout } from '@milo/ui/callout'
import { CommandMenu, type CommandGroup } from '@milo/ui/command-menu'
import { Divider } from '@milo/ui/divider'
import { Chip } from '@milo/ui/chip'
import { Choice } from '@milo/ui/choice'
import { Icon } from '@milo/ui/icon'
import { NumberAnswer } from '@milo/ui/number-answer'
import { OpenQuestion } from '@milo/ui/open-question'
import { Table } from '@milo/ui/table'
import { Mention } from '@milo/ui/mention'
import { Popover } from '@milo/ui/popover'
import { Quote } from '@milo/ui/quote'
import { Segmented } from '@milo/ui/segmented'
import { TaskList, type Task } from '@milo/ui/task-list'
import { labelSoft } from '@milo/ui/lib/colors'
import { RubricRail, type RubricMode } from './rubric'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const blocks: CommandGroup[] = [
  {
    label: 'Texto',
    items: [
      { id: 'h2', label: 'Subtítulo', hint: 'Para partir la consigna', icon: 'format_h2' },
      { id: 'quote', label: 'Cita', hint: 'Palabras de otro', icon: 'format_quote' },
      { id: 'callout', label: 'Bloque destacado', hint: 'Lo que no se puede pasar por alto', icon: 'lightbulb' },
      { id: 'tasks', label: 'Lista de tareas', hint: 'Lo que hay que entregar', icon: 'checklist' },
    ],
  },
  {
    label: 'Que se responde',
    items: [
      { id: 'choice', label: 'Pregunta con opciones', hint: 'Una correcta, o varias', icon: 'check_circle' },
      { id: 'open', label: 'Pregunta abierta', hint: 'Responde escribiendo, la lee una persona', icon: 'edit' },
      { id: 'number', label: 'Respuesta numérica', hint: 'Un cálculo, con unidad y margen', icon: 'calculate' },
    ],
  },
  {
    label: 'Datos',
    items: [
      { id: 'table', label: 'Tabla', hint: 'Donde cargan lo que midieron', icon: 'table_rows' },
      { id: 'chart', label: 'Gráfico', hint: 'Barras o líneas', icon: 'bar_chart' },
      { id: 'divider', label: 'Separador', icon: 'horizontal_rule' },
    ],
  },
]

const initialTasks: Task[] = [
  { id: 'app', label: 'Bajar la app de sonómetro y dejarla abierta 10 segundos antes de anotar', done: true },
  { id: 'lugares', label: 'Medir en los cinco lugares, siempre con el mismo teléfono', done: true },
  { id: 'momentos', label: 'Repetir a las 8, a las 11 y a las 15' },
  { id: 'contexto', label: 'Anotar al lado qué estaba pasando alrededor' },
]


const medido = [
  { lugar: 'Patio', valores: [62, 84, 71] },
  { lugar: 'Biblioteca', valores: [41, 48, 44] },
  { lugar: 'Pasillo', valores: [55, 79, 68] },
  { lugar: 'Aula de 4.º B', valores: [52, 66, 58] },
  { lugar: 'Buffet', valores: [58, 88, 74] },
]

const apuestas = [
  { id: 'patio', label: 'El patio en el recreo' },
  { id: 'buffet', label: 'El buffet al mediodía' },
  { id: 'pasillo', label: 'El pasillo entre horas' },
  { id: 'biblioteca', label: 'La biblioteca a las 11' },
]

export function DocumentStory() {
  const [tasks, setTasks] = useState(initialTasks)
  const [, setLast] = useState<string | null>(null)
  const [mode, setMode] = useState<RubricMode>('teacher')
  const [apuesta, setApuesta] = useState<string[]>([])
  const [porque, setPorque] = useState('')
  const [promedio, setPromedio] = useState('')
  const [salto, setSalto] = useState('')
  const [brecha, setBrecha] = useState('')
  const [propuesta, setPropuesta] = useState('')
  const [corregido, setCorregido] = useState(false)

  const toggleTask = (id: string, done: boolean) =>
    setTasks(ts => ts.map(t => (t.id === id ? { ...t, done } : t)))

  return (
    <article className={cls.doc}>
      <header className={cls.docHeader}>
        <div className={cls.titleRow}>
          <div className={cls.titleBlock}>
            <span className={cls.breadcrumb}>Física · 4.º B · Borrador</span>
            <h1 className={cls.docTitle}>🔊 El mapa del ruido de la escuela</h1>
          </div>
          <div className={cls.docActions}>
            <Avatar.Group
              size={28}
              people={[
                { name: 'Ana Pérez', src: face(4) },
                { name: 'Bruno Díaz', src: face(5) },
                { name: 'Carla Ríos', src: face(7) },
                { name: 'Diego Sosa', src: face(2) },
                { name: 'Emilia Paz', src: face(6) },
              ]}
            />
            <Popover
              align="end"
              trigger={p => (
                <Button {...p} size="sm" variant="brand">
                  Insertar
                </Button>
              )}
            >
              {close => (
                <div className={`${cls.insertPanel} bg-popover`}>
                  <CommandMenu
                    autoFocus
                    groups={blocks}
                    onSelect={item => { setLast(item.label); close() }}
                  />
                </div>
              )}
            </Popover>
          </div>
        </div>

      </header>

      <div className={cls.columns}>
        <div className={cls.docBody}>
          <p className={cls.intro}>
            Vamos a medir el ruido de la escuela y a usar esos números para decidir una cosa que se
            pueda cambiar.<span aria-hidden className={`${cls.cursor} ${cls.cursorAna}`}>
              <span className={cls.caret} />
              <span className={cls.who}>Ana</span>
            </span> Se hace de a dos, en cuatro etapas, y todo se completa acá abajo. Lo arma{' '}
            <Mention name="Ana Pérez" src={face(1)} href="#mention" /> con{' '}
            <Mention name="Bruno Díaz" src={face(2)} href="#mention" />, y queda guardado en{' '}
            <Mention name="Física · 4.º B" icon="folder" href="#folder" />.
          </p>


          <Callout icon="warning" color="orange">
            <Callout.Title>El mismo teléfono todas las veces</Callout.Title>
            Dos celulares distintos dan números distintos en el mismo lugar. Si cambian de aparato a
            mitad de camino, las mediciones dejan de compararse entre sí y hay que empezar de nuevo.
          </Callout>

            <h2 className={cls.sourceHeading}>1. Antes de medir, la apuesta</h2>
            <p className={cls.sourceText}>
              Esto se contesta ahora, con lo que cada uno cree, y no se cambia después. Es la parte
              del método que más se saltea: si escriben lo que esperaban recién al final, van a
              escribir lo que pasó.
            </p>

            <Choice
              options={apuestas}
              value={apuesta}
              onChange={setApuesta}
              correct={['buffet']}
              revealed={corregido}
            >
              <Choice.Prompt>¿Dónde les parece que va a dar más alto?</Choice.Prompt>
              <Choice.Hint>Una sola. Todavía no midieron nada.</Choice.Hint>
            </Choice>

            <OpenQuestion
              value={porque}
              onChange={setPorque}
              rows={2}
              maxLength={240}
              readOnly={corregido}
              placeholder="Porque ahí se junta todo el curso y además está el eco del techo"
            >
              <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
            </OpenQuestion>

            <h2 className={cls.taskHeading}>2. Medir</h2>
            <TaskList items={tasks} onToggle={toggleTask} label="Los pasos de la medición" />

            <Table label="Lo que midió el grupo, en decibeles" minWidth={420}>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Lugar</Table.Head>
                  <Table.Head align="right">8:00</Table.Head>
                  <Table.Head align="right">11:00</Table.Head>
                  <Table.Head align="right">15:00</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {medido.map(f => (
                  <Table.Row key={f.lugar}>
                    <Table.Cell><Table.Title>{f.lugar}</Table.Title></Table.Cell>
                    {f.valores.map((v, i) => <Table.Num key={i}>{v}</Table.Num>)}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

          <Divider />

            <h2 className={cls.sourceHeading}>3. Tres números que salen de la tabla</h2>
            <p className={cls.sourceText}>
              Los decibeles no se suman: la escala es logarítmica, así que 60 no es el doble de 30 y
              dos fuentes de 50 no dan 100. Promediar y restar sí se puede, y es lo que hace falta
              acá.<span aria-hidden className={`${cls.cursor} ${cls.cursorBruno}`}>
                <span className={cls.caret} />
                <span className={cls.who}>Bruno</span>
              </span> Una decimal alcanza: el aparato no mide más fino que eso.
            </p>

            <NumberAnswer
              value={promedio}
              onChange={setPromedio}
              unit="dB"
              expected={72.3}
              tolerance={0.2}
              revealed={corregido}
            >
              <NumberAnswer.Prompt>El promedio del patio en los tres momentos</NumberAnswer.Prompt>
              <NumberAnswer.Hint>Sumen los tres valores de la fila y dividan por tres.</NumberAnswer.Hint>
            </NumberAnswer>

            <NumberAnswer
              value={salto}
              onChange={setSalto}
              unit="dB"
              expected={22}
              revealed={corregido}
            >
              <NumberAnswer.Prompt>El salto del recreo en el patio</NumberAnswer.Prompt>
              <NumberAnswer.Hint>Lo de las 11 menos lo de las 8, en la misma fila.</NumberAnswer.Hint>
            </NumberAnswer>

            <NumberAnswer
              value={brecha}
              onChange={setBrecha}
              unit="dB"
              expected={40}
              revealed={corregido}
            >
              <NumberAnswer.Prompt>La brecha de las 11: el lugar más ruidoso menos el más silencioso</NumberAnswer.Prompt>
              <NumberAnswer.Hint>Esa es la métrica que van a comparar contra la de los otros grupos.</NumberAnswer.Hint>
            </NumberAnswer>

            <h2 className={cls.furtherHeading}>4. La propuesta</h2>

            <OpenQuestion
              value={propuesta}
              onChange={setPropuesta}
              rows={4}
              readOnly={corregido}
              placeholder="En la biblioteca dio 48 a las 11, que es cuando el pasillo de al lado dio 79. Propondríamos..."
            >
              <OpenQuestion.Prompt>Una cosa que se pueda hacer el lunes, y de qué número sale</OpenQuestion.Prompt>
              <OpenQuestion.Hint>Tiene que nombrar una medición de la tabla y decir cómo se sabría si funcionó.</OpenQuestion.Hint>
            </OpenQuestion>

            <div className={cls.comment}>
              <div className={cls.commentBy}>
                <span aria-hidden className={`${cls.commentBot} ${labelSoft.blue}`}><Icon name="smart_toy" size={14} /></span>
                <span className={cls.commentName}>Amelia</span>
                <Chip size="sm" color="blue">asistente</Chip>
              </div>
              <p className={cls.commentText}>
                Ojo con la brecha: el buffet a las 11 puede estar alto por una sola cosa que pasó ese
                día. Si pueden, midan otra vez el jueves antes de apoyar la propuesta ahí.
              </p>
            </div>

          <Quote cite="#quote">
            <Quote.Source>Carla, en la puesta en común del año pasado</Quote.Source>
            En la biblioteca nos dio más que en el aula y no lo podíamos creer. Habíamos medido
            justo cuando pasaba el carro de la limpieza.
          </Quote>

          <div className={cls.check}>
            <Button size="sm" variant={corregido ? 'ghost' : 'brand'} onClick={() => setCorregido(v => !v)}>
              {corregido ? 'Volver a la entrega' : 'Corregir'}
            </Button>
          </div>
        </div>

        <div className={cls.rail}>
          <div className={cls.railTop}>
            <Segmented
              size="xs"
              label="Ver el documento como"
              value={mode}
              onChange={setMode}
              options={[{ value: 'teacher', label: 'Docente' }, { value: 'student', label: 'Estudiante' }]}
            />
          </div>
          <RubricRail mode={mode} />
        </div>
      </div>
    </article>
  )
}
