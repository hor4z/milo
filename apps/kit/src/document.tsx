import cls from './document.module.css'
import { useState } from 'react'
import {
  Callout, Figure, Mention, Popover, Quote, TaskList, Toolbar,
  ToolbarButton, ToolbarSeparator, CommandMenu, Divider, Icon, IconButton, Tooltip,
  type CommandGroup, type Task,
} from '@milo/ui'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const bloques: CommandGroup[] = [
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

const tareasIniciales: Task[] = [
  { id: 'medir', label: 'Medir el tiempo de caída tres veces y anotar las tres', done: true },
  { id: 'promedio', label: 'Sacar el promedio y estimar el error', done: true },
  { id: 'graficar', label: 'Graficar altura contra tiempo al cuadrado' },
  { id: 'escribir', label: 'Escribir en dos párrafos por qué la pendiente da la mitad de g' },
]

export function Documento() {
  const [formato, setFormato] = useState({ bold: false, italic: false })
  const [tareas, setTareas] = useState(tareasIniciales)
  const [ultimo, setUltimo] = useState<string | null>(null)

  const alternar = (k: keyof typeof formato) => setFormato(f => ({ ...f, [k]: !f[k] }))
  const marcar = (id: string, done: boolean) =>
    setTareas(ts => ts.map(t => (t.id === id ? { ...t, done } : t)))

  return (
    <article className={cls.article}>
      <header className={cls.header}>
        <div className={cls.div}>
          <div className={cls.div2}>
            <span className={cls.span}>Física · 5.º B · Borrador</span>
            <h1 className={cls.h1}>Caída libre: medir g en el patio</h1>
          </div>
          <div className={cls.div3}>
            <Tooltip label="Quién puede verlo">
              <IconButton icon="group" label="Compartir" size="sm" variant="muted" />
            </Tooltip>
            <Popover
              align="end"
              trigger={p => (
                <button
                  {...p}
                  type="button"
                  className={`${cls.button} field-focus bg-surface`}
                >
                  <Icon name="add" size={16} className="icon-muted" />
                  Insertar
                </button>
              )}
            >
              {close => (
                <div className={`${cls.div4} bg-popover`}>
                  <CommandMenu
                    autoFocus
                    groups={bloques}
                    onSelect={item => { setUltimo(item.label); close() }}
                  />
                </div>
              )}
            </Popover>
          </div>
        </div>

        <div className={cls.div5}>
          <Toolbar label="Formato del texto">
            <ToolbarButton icon="format_bold" label="Negrita" pressed={formato.bold} onClick={() => alternar('bold')} />
            <ToolbarButton icon="format_italic" label="Cursiva" pressed={formato.italic} onClick={() => alternar('italic')} />
            <ToolbarSeparator />
            <ToolbarButton icon="format_h2" label="Subtítulo" />
            <ToolbarButton icon="format_quote" label="Cita" />
            <ToolbarButton icon="checklist" label="Lista de tareas" />
            <ToolbarSeparator />
            <ToolbarButton icon="link" label="Enlace" />
            <ToolbarButton icon="image" label="Imagen" />
          </Toolbar>
          {ultimo && (
            <span className={cls.span2}>
              Último bloque elegido: {ultimo}
            </span>
          )}
        </div>
      </header>

      <div className={cls.div6}>
        <p className={cls.p}>
          La semana que viene medimos la aceleración de la gravedad soltando una pelota desde el
          primer piso. Traigan el celular con cronómetro. Lo arma{' '}
          <Mention name="Ana Pérez" src={face(1)} href="#mention" /> con{' '}
          <Mention name="Bruno Díaz" src={face(2)} href="#mention" />, y lo que midan lo suben a{' '}
          <Mention name="Física · 5.º B" icon="folder" href="#folder" />.
        </p>

        <Callout icon="warning" color="orange" title="Antes de subir al primer piso">
          Nadie se asoma a la baranda. La pelota la suelta una sola persona y el resto mira desde
          abajo, a tres metros del punto de caída.
        </Callout>

        <h2 className={cls.h2}>De dónde sale el número</h2>
        <p className={cls.p2}>
          Si la pelota arranca quieta y el rozamiento del aire se puede ignorar, la altura que cae
          es la mitad de la gravedad por el tiempo al cuadrado. Así que si grafican la altura contra
          el tiempo al cuadrado les tiene que dar una recta, y la pendiente va a ser la mitad de la
          gravedad. Eso es lo que hay que comparar con los 9,8 del libro.
        </p>

        <Quote source="Galileo, Diálogos sobre dos nuevas ciencias" cite="#quote">
          Y encontré que los espacios recorridos están entre sí como los cuadrados de los tiempos.
        </Quote>

        <Divider />

        <h2 className={cls.h22}>Qué hay que entregar</h2>
        <TaskList items={tareas} onToggle={marcar} label="Lo que hay que entregar" />

        <Figure
          src="/mascotas/otto.webp"
          alt="Otto, una nutria de pie con las manos juntas"
          caption="La pelota se suelta, no se tira. Si la empujan, la velocidad inicial deja de ser cero y la cuenta de arriba no sirve."
          ratio="16/9"
          fit="contain"
        />

        <h2 className={cls.h23}>Para los que quieran ir más lejos</h2>
        <p className={cls.p3}>
          Con el cronómetro del celular el error es grande. Se puede filmar a cámara lenta y contar
          los cuadros: a 240 por segundo, cada cuadro son cuatro milésimas.
        </p>

      </div>
    </article>
  )
}
