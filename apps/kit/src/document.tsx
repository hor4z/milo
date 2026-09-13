import { useState } from 'react'
import {
  Callout, CodeBlock, Figure, Formula, Mention, Popover, Quote, TaskList, Toolbar,
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
      { id: 'formula', label: 'Fórmula', hint: 'Matemática en línea o en bloque', icon: 'functions', keywords: ['ecuación', 'latex'] },
      { id: 'chart', label: 'Gráfico', hint: 'Barras o líneas', icon: 'bar_chart' },
      { id: 'code', label: 'Código', hint: 'Con su nombre de archivo', icon: 'code' },
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

const caida = (
  <>
    <mi>h</mi><mo>=</mo>
    <mfrac><mn>1</mn><mn>2</mn></mfrac>
    <mi>g</mi><mo>&#8290;</mo>
    <msup><mi>t</mi><mn>2</mn></msup>
  </>
)


export function Documento() {
  const [formato, setFormato] = useState({ bold: false, italic: false })
  const [tareas, setTareas] = useState(tareasIniciales)
  const [ultimo, setUltimo] = useState<string | null>(null)

  const alternar = (k: keyof typeof formato) => setFormato(f => ({ ...f, [k]: !f[k] }))
  const marcar = (id: string, done: boolean) =>
    setTareas(ts => ts.map(t => (t.id === id ? { ...t, done } : t)))

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-meta font-medium text-ink-muted">Física · 5.º B · Borrador</span>
            <h1 className="text-display font-bold text-ink">Caída libre: medir g en el patio</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Tooltip label="Quién puede verlo">
              <IconButton icon="group" label="Compartir" size="sm" variant="muted" />
            </Tooltip>
            <Popover
              align="end"
              trigger={p => (
                <button
                  {...p}
                  type="button"
                  className="field-focus inline-flex h-8 items-center gap-2 rounded-md border border-line bg-surface px-3 text-body font-semibold text-ink transition-colors duration-fast ease-out hover:bg-hover"
                >
                  <Icon name="add" size={16} className="icon-muted" />
                  Insertar
                </button>
              )}
            >
              {close => (
                <div className="w-[320px] overflow-hidden rounded-xl border border-line bg-popover shadow-popover">
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

        {/* La barra vive arriba del texto y no flotando: en una pantalla táctil
            no hay selección que la haga aparecer, y un control que solo existe
            con mouse no existe para media aula. */}
        <div className="flex flex-wrap items-center gap-3 border-y border-line py-2">
          <Toolbar label="Formato del texto">
            <ToolbarButton icon="format_bold" label="Negrita" pressed={formato.bold} onClick={() => alternar('bold')} />
            <ToolbarButton icon="format_italic" label="Cursiva" pressed={formato.italic} onClick={() => alternar('italic')} />
            <ToolbarSeparator />
            <ToolbarButton icon="format_h2" label="Subtítulo" />
            <ToolbarButton icon="format_quote" label="Cita" />
            <ToolbarButton icon="checklist" label="Lista de tareas" />
            <ToolbarSeparator />
            <ToolbarButton icon="link" label="Enlace" />
            <ToolbarButton icon="functions" label="Fórmula" />
          </Toolbar>
          {ultimo && (
            <span className="text-meta font-medium text-ink-muted">
              Último bloque elegido: {ultimo}
            </span>
          )}
        </div>
      </header>

      <div className="flex max-w-[68ch] flex-col gap-6">
        <p className="text-reading text-ink">
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

        <h2 className="text-title font-semibold text-ink">De dónde sale el número</h2>
        <p className="text-reading text-ink">
          Si la pelota arranca quieta y el rozamiento del aire se puede ignorar, la altura que cae
          en un tiempo <Formula alt="te"><mi>t</mi></Formula> es
        </p>
        <Formula display number={1} alt="hache igual a un medio ge por te al cuadrado">{caida}</Formula>
        <p className="text-reading text-ink">
          Así que si grafican la altura contra el tiempo al cuadrado les tiene que dar una recta, y
          la pendiente va a ser <Formula alt="ge sobre dos"><mi>g</mi><mo>/</mo><mn>2</mn></Formula>.
          Eso es lo que hay que comparar con los 9,8 del libro.
        </p>

        <Quote source="Galileo, Diálogos sobre dos nuevas ciencias" cite="#quote">
          Y encontré que los espacios recorridos están entre sí como los cuadrados de los tiempos.
        </Quote>

        <Divider />

        <h2 className="text-title font-semibold text-ink">Qué hay que entregar</h2>
        <TaskList items={tareas} onToggle={marcar} label="Lo que hay que entregar" />

        {/* `contain` y no `cover`: el retrato es vertical y en una caja apaisada
            recortado deja un pedazo de nutria sin cabeza. */}
        <Figure
          src="/mascotas/otto.webp"
          alt="Otto, una nutria de pie con las manos juntas"
          caption="La pelota se suelta, no se tira. Si la empujan, la velocidad inicial deja de ser cero y la fórmula de arriba no sirve."
          ratio="16/9"
          fit="contain"
        />

        <h2 className="text-title font-semibold text-ink">Para los que quieran ir más lejos</h2>
        <p className="text-reading text-ink">
          Con el cronómetro del celular el error es grande. Se puede filmar a cámara lenta y contar
          los cuadros — a 240 por segundo, cada cuadro son cuatro milésimas.
        </p>
        <CodeBlock
          lang="python"
          filename="cuadros.py"
          numbered
          code={`FPS = 240

def altura(cuadros, g=9.8):
    t = cuadros / FPS
    return 0.5 * g * t ** 2

for c in (12, 24, 36):
    print(c, round(altura(c), 3), "m")
`}
        />

      </div>
    </article>
  )
}
