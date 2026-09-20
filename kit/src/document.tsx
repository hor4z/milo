import cls from './document.module.css'
import { useState } from 'react'
import {
  AvatarGroup, Button, Callout, Figure, Mention, Popover, Quote, TaskList,
  CommandMenu, Divider, Icon,
  type CommandGroup, type Task,
} from '@milo/ui'

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
    label: 'Ciencia',
    items: [
      { id: 'chart', label: 'Gráfico', hint: 'Barras o líneas', icon: 'bar_chart' },
    ],
  },
  {
    label: 'Medios',
    items: [
      { id: 'image', label: 'Imagen', hint: 'Con pie', icon: 'image' },
      { id: 'table', label: 'Tabla', icon: 'table_rows' },
      { id: 'divider', label: 'Separador', icon: 'horizontal_rule' },
    ],
  },
]

const initialTasks: Task[] = [
  { id: 'medir', label: 'Medir el tiempo de caída tres veces y anotar las tres', done: true },
  { id: 'promedio', label: 'Sacar el promedio y estimar el error', done: true },
  { id: 'graficar', label: 'Graficar altura contra tiempo al cuadrado' },
  { id: 'escribir', label: 'Escribir en dos párrafos por qué la pendiente da la mitad de g' },
]

export function DocumentStory() {
  const [tasks, setTasks] = useState(initialTasks)
  const [, setLast] = useState<string | null>(null)

  const toggleTask = (id: string, done: boolean) =>
    setTasks(ts => ts.map(t => (t.id === id ? { ...t, done } : t)))

  return (
    <article className={cls.doc}>
      <header className={cls.docHeader}>
        <div className={cls.titleRow}>
          <div className={cls.titleBlock}>
            <span className={cls.breadcrumb}>Física · 5.º B · Borrador</span>
            <h1 className={cls.docTitle}>Caída libre: medir g en el patio</h1>
          </div>
          <div className={cls.docActions}>
            <AvatarGroup
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
                <Button {...p} size="sm" variant="brand" iconStart={<Icon name="add" />}>
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

      <div className={cls.docBody}>
        <p className={cls.intro}>
          La semana que viene medimos la aceleración de la gravedad soltando una pelota desde el
          primer piso.<span aria-hidden className={`${cls.cursor} ${cls.cursorAna}`}>
            <span className={cls.caret} />
            <span className={cls.who}>Ana</span>
          </span> Traigan el celular con cronómetro. Lo arma{' '}
          <Mention name="Ana Pérez" src={face(1)} href="#mention" /> con{' '}
          <Mention name="Bruno Díaz" src={face(2)} href="#mention" />, y lo que midan lo suben a{' '}
          <Mention name="Física · 5.º B" icon="folder" href="#folder" />.
        </p>

        <Callout icon="warning" color="orange" title="Antes de subir al primer piso">
          Nadie se asoma a la baranda. La pelota la suelta una sola persona y el resto mira desde
          abajo, a tres metros del punto de caída.
        </Callout>

        <h2 className={cls.sourceHeading}>De dónde sale el número</h2>
        <p className={cls.sourceText}>
          Si la pelota arranca quieta y el rozamiento del aire se puede ignorar, la altura que cae
          es la mitad de la gravedad por el tiempo al cuadrado. Así que si grafican la altura contra
          el tiempo al cuadrado les tiene que dar una recta, y la pendiente va a ser la mitad de la
          gravedad.<span aria-hidden className={`${cls.cursor} ${cls.cursorBruno}`}>
            <span className={cls.caret} />
            <span className={cls.who}>Bruno</span>
          </span> Eso es lo que hay que comparar con los 9,8 del libro.
        </p>

        <Quote source="Galileo, Diálogos sobre dos nuevas ciencias" cite="#quote">
          Y encontré que los espacios recorridos están entre sí como los cuadrados de los tiempos.
        </Quote>

        <Divider />

        <h2 className={cls.taskHeading}>Qué hay que entregar</h2>
        <TaskList items={tasks} onToggle={toggleTask} label="Lo que hay que entregar" />

        <Figure
          src="/mascotas/otto.webp"
          alt="Otto, una nutria de pie con las manos juntas"
          caption="La pelota se suelta, no se tira. Si la empujan, la velocidad inicial deja de ser cero y la cuenta de arriba no sirve."
          ratio="16/9"
          fit="contain"
        />

        <h2 className={cls.furtherHeading}>Para los que quieran ir más lejos</h2>
        <p className={cls.furtherText}>
          Con el cronómetro del celular el error es grande. Se puede filmar a cámara lenta y contar
          los cuadros: a 240 por segundo, cada cuadro son cuatro milésimas.
        </p>

      </div>
    </article>
  )
}
