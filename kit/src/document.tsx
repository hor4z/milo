import cls from './document.module.css'
import { useState } from 'react'
import { Avatar } from '@milo/ui/avatar'
import { Button } from '@milo/ui/button'
import { Callout } from '@milo/ui/callout'
import { CommandMenu, type CommandGroup } from '@milo/ui/command-menu'
import { Divider } from '@milo/ui/divider'
import { Choice } from '@milo/ui/choice'
import { NumberAnswer } from '@milo/ui/number-answer'
import { OpenQuestion } from '@milo/ui/open-question'
import { CompareTable } from '@milo/ui/compare-table'
import { SumTable, type SumCell } from '@milo/ui/sum-table'
import { Mention } from '@milo/ui/mention'
import { Chip } from '@milo/ui/chip'
import { Icon } from '@milo/ui/icon'
import { Popover } from '@milo/ui/popover'
import { parseNumber } from '@milo/ui/lib/number'
import { Quote } from '@milo/ui/quote'
import { labelSoft } from '@milo/ui/lib/colors'
import { Segmented } from '@milo/ui/segmented'
import { TaskList, type Task } from '@milo/ui/task-list'
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
      { id: 'sum', label: 'Tabla que se suma', hint: 'Un presupuesto, con tope', icon: 'table_rows' },
      { id: 'compare', label: 'Cuadro comparativo', hint: 'Dos o tres cosas, fila por fila', icon: 'compare_arrows' },
      { id: 'chart', label: 'Gráfico', hint: 'Barras o líneas', icon: 'bar_chart' },
      { id: 'divider', label: 'Separador', icon: 'horizontal_rule' },
    ],
  },
]

const initialTasks: Task[] = [
  { id: 'nombre', label: 'El nombre del emprendimiento', done: true },
  { id: 'imagen', label: 'Un logo o una imagen del producto', done: true },
  { id: 'precio', label: 'Qué vende y a cuánto' },
  { id: 'frase', label: 'Una frase que convenza, no una que describa' },
  { id: 'contacto', label: 'Cómo contactarse' },
]

const rubros = [
  { id: 'comida', label: 'Comida' },
  { id: 'ropa', label: 'Ropa o accesorios' },
  { id: 'personalizados', label: 'Productos personalizados' },
  { id: 'servicio', label: 'Un servicio: edición de video, diseño, lavado de autos' },
  { id: 'reventa', label: 'Reventa por internet' },
]

const salidas = [
  { id: 'precio', label: 'Subir el precio del producto' },
  { id: 'margen', label: 'Bancar el aumento y ganar menos por unidad' },
  { id: 'proveedor', label: 'Buscar otro proveedor' },
]

const cliente = [
  { id: 'quien', label: '¿Quién te compra?', placeholder: 'Los que salen del club a la noche' },
  { id: 'edad', label: '¿Qué edad tiene?', placeholder: 'Entre 15 y 25' },
  { id: 'problema', label: '¿Qué le resolvés?', placeholder: 'No hay nada abierto después de las 22' },
  { id: 'porque', label: '¿Por qué a vos y no al que ya está?', placeholder: 'Porque llevo hasta la puerta y el otro no' },
]

const gastos = [
  { id: 'materia', label: 'Materia prima o productos', qtyExample: 'bolsas', priceExample: 'cada una' },
  { id: 'herramientas', label: 'Herramientas', qtyExample: 'cuántas', priceExample: 'cada una' },
  { id: 'packaging', label: 'Packaging', qtyExample: 'unidades', priceExample: 'cada una' },
  { id: 'publicidad', label: 'Publicidad', qtyExample: 'meses', priceExample: 'por mes' },
  { id: 'transporte', label: 'Transporte', qtyExample: 'viajes', priceExample: 'por viaje' },
  { id: 'otros', label: 'Otros', qtyExample: 'cuántos', priceExample: 'cada uno' },
]

const frentes = [
  { id: 'producto', label: 'Producto', placeholder: 'Qué vende' },
  { id: 'precio', label: 'Precio', placeholder: 'Cuánto sale' },
  { id: 'publico', label: 'Público', placeholder: 'A quién' },
  { id: 'venta', label: 'Forma de venta', placeholder: 'Local, redes' },
]

const competidores = [
  { id: 'mio', label: 'El tuyo' },
  { id: 'uno', label: 'Competidor 1' },
  { id: 'dos', label: 'Competidor 2' },
]

export function DocumentStory() {
  const [tasks, setTasks] = useState(initialTasks)
  const [, setLast] = useState<string | null>(null)
  const [mode, setMode] = useState<RubricMode>('teacher')
  const [corregido, setCorregido] = useState(false)
  const [rubro, setRubro] = useState<string[]>([])
  const [porque, setPorque] = useState('')
  const [quien, setQuien] = useState<Record<string, Record<string, string>>>({})
  const [presupuesto, setPresupuesto] = useState<Record<string, SumCell>>({})
  const [precio, setPrecio] = useState('')
  const [margen, setMargen] = useState('')
  const [veinte, setVeinte] = useState('')
  const [cincuenta, setCincuenta] = useState('')
  const [salida, setSalida] = useState<string[]>([])
  const [defensa, setDefensa] = useState('')
  const [competencia, setCompetencia] = useState<Record<string, Record<string, string>>>({})
  const [diferencia, setDiferencia] = useState('')
  const [ingresos, setIngresos] = useState('')
  const [costos, setCostos] = useState('')
  const [ganancia, setGanancia] = useState('')
  const [equilibrio, setEquilibrio] = useState('')

  const precioNum = parseNumber(precio)
  const margenNum = parseNumber(margen)

  const responderQuien = (fila: string, columna: string, texto: string) =>
    setQuien(q => ({ ...q, [fila]: { ...q[fila], [columna]: texto } }))

  const compararCon = (fila: string, columna: string, texto: string) =>
    setCompetencia(c => ({ ...c, [fila]: { ...c[fila], [columna]: texto } }))

  const cargarGasto = (id: string, celda: SumCell) =>
    setPresupuesto(p => ({ ...p, [id]: celda }))

  const toggleTask = (id: string, done: boolean) =>
    setTasks(ts => ts.map(t => (t.id === id ? { ...t, done } : t)))

  return (
    <article className={cls.doc}>
      <header className={cls.docHeader}>
        <div className={cls.titleRow}>
          <div className={cls.titleBlock}>
            <span className={cls.breadcrumb}>Economía · 4.º B · Borrador</span>
            <h1 className={cls.docTitle}>💼 Creá tu propio emprendimiento</h1>
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
            Tenés $100.000 y uno o dos compañeros. Con eso armá un emprendimiento que pueda ser
            rentable de verdad, no en el
            papel.<span aria-hidden className={`${cls.cursor} ${cls.cursorAna}`}>
              <span className={cls.caret} />
              <span className={cls.who}>Ana</span>
            </span> Todo se completa acá abajo y al final lo presentan en siete minutos. Lo arma{' '}
            <Mention name="Ana Pérez" src={face(1)} href="#mention" /> con{' '}
            <Mention name="Bruno Díaz" src={face(2)} href="#mention" />, y queda guardado en{' '}
            <Mention name="Economía · 4.º B" icon="folder" href="#folder" />.
          </p>

          <Callout icon="lightbulb" color="blue">
            <Callout.Title>La pregunta que hay que contestar</Callout.Title>
            ¿Este emprendimiento podría funcionar de verdad? La respuesta no es que sí: es el número
            que lo demuestra, y está al final, en el punto de equilibrio.
          </Callout>

          <h2 className={cls.sourceHeading}>1. Qué vas a vender</h2>

          <Choice options={rubros} value={rubro} onChange={setRubro}>
            <Choice.Prompt>Elegí un producto o un servicio</Choice.Prompt>
            <Choice.Hint>Uno solo. Si no está en la lista, contalo en la respuesta de abajo.</Choice.Hint>
          </Choice>

          <OpenQuestion value={porque} onChange={setPorque} rows={2} maxLength={240}
            placeholder="Porque en el barrio no hay nadie que lo haga y en casa ya sabemos hacerlo">
            <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
          </OpenQuestion>

          <Divider />

          <h2 className={cls.sourceHeading}>2. Quién te compra</h2>

          <CompareTable rows={cliente} columns={[{ id: 'vos', label: 'Tu respuesta' }]} value={quien} onChange={responderQuien}>
            <CompareTable.Prompt>Contestá las cuatro, en una línea cada una</CompareTable.Prompt>
            <CompareTable.Hint>La última es la más difícil y es la que importa: por qué a vos y no al que ya está.</CompareTable.Hint>
          </CompareTable>

          <Divider />

          <h2 className={cls.sourceHeading}>3. Tu presupuesto</h2>

          <SumTable rows={gastos} value={presupuesto} onChange={cargarGasto} cap={100000}>
            <SumTable.Prompt>Repartí los $100.000</SumTable.Prompt>
            <SumTable.Hint>No hace falta gastarlos todos: lo que sobra es lo que te banca el primer mes flojo.</SumTable.Hint>
          </SumTable>

          <Divider />

          <h2 className={cls.sourceHeading}>4. El precio</h2>
          <p className={cls.sourceText}>
            Producir una unidad te cuesta $2.000, y de eso $1.000 es materia prima. Acordate del
            segundo número, que vuelve en el punto 5.
          </p>

          <NumberAnswer value={precio} onChange={setPrecio} unit="$" placeholder="4000" revealed={corregido}>
            <NumberAnswer.Prompt>¿A cuánto la vendés?</NumberAnswer.Prompt>
            <NumberAnswer.Hint>No hay respuesta correcta acá: la que elijas manda en todas las cuentas que siguen.</NumberAnswer.Hint>
          </NumberAnswer>

          <NumberAnswer value={margen} onChange={setMargen} unit="$" expected={precioNum === null ? undefined : precioNum - 2000} revealed={corregido}>
            <NumberAnswer.Prompt>El margen por unidad</NumberAnswer.Prompt>
            <NumberAnswer.Hint>Precio de venta menos los $2.000 que cuesta producirla.</NumberAnswer.Hint>
          </NumberAnswer>

          <NumberAnswer value={veinte} onChange={setVeinte} unit="$" expected={margenNum === null ? undefined : margenNum * 20} revealed={corregido}>
            <NumberAnswer.Prompt>Si vendés 20 unidades, ¿cuánto ganás?</NumberAnswer.Prompt>
          </NumberAnswer>

          <NumberAnswer value={cincuenta} onChange={setCincuenta} unit="$" expected={margenNum === null ? undefined : margenNum * 50} revealed={corregido}>
            <NumberAnswer.Prompt>¿Y con 50?</NumberAnswer.Prompt>
          </NumberAnswer>

          <Divider />

          <h2 className={cls.sourceHeading}>5. El problema inesperado</h2>

          <Callout icon="warning" color="orange">
            <Callout.Title>La materia prima aumentó 30%</Callout.Title>
            De los $2.000 que te costaba producir una unidad, $1.000 eran materia prima. Ahora esos
            $1.000 son $1.300, así que producir una unidad te sale $2.300.
          </Callout>

          <Choice options={salidas} value={salida} onChange={setSalida}>
            <Choice.Prompt>¿Qué hacés?</Choice.Prompt>
            <Choice.Hint>Las tres se pueden defender. Lo que se evalúa es con qué la defendés.</Choice.Hint>
          </Choice>

          <OpenQuestion value={defensa} onChange={setDefensa} rows={3} maxLength={400}
            placeholder="Subir el precio me deja afuera de lo que cobra el de al lado, así que prefiero...">
            <OpenQuestion.Prompt>¿Por qué esa y no las otras dos?</OpenQuestion.Prompt>
            <OpenQuestion.Hint>Tiene que nombrar un número del punto 4.</OpenQuestion.Hint>
          </OpenQuestion>

          <div className={cls.comment}>
            <div className={cls.commentBy}>
              <span aria-hidden className={`${cls.commentBot} ${labelSoft.blue}`}><Icon name="smart_toy" size={14} /></span>
              <span className={cls.commentName}>Amelia</span>
              <Chip size="sm" color="blue">asistente</Chip>
            </div>
            <p className={cls.commentText}>
              Si elegís cambiar de proveedor, fijate que el precio nuevo tiene que ser más barato
              que los $1.300 de ahora, no que los $1.000 de antes. Es el error más común de este
              punto.
            </p>
          </div>

          <Divider />

          <h2 className={cls.sourceHeading}>6. Contra quién competís</h2>

          <CompareTable rows={frentes} columns={competidores} value={competencia} onChange={compararCon}>
            <CompareTable.Prompt>Buscá dos emprendimientos reales que vendan algo parecido</CompareTable.Prompt>
            <CompareTable.Hint>Reales: con nombre, y con el precio que cobran de verdad.</CompareTable.Hint>
          </CompareTable>

          <OpenQuestion value={diferencia} onChange={setDiferencia} rows={2} maxLength={240}
            placeholder="Ninguno de los dos entrega de noche, y ahí es cuando la gente lo quiere">
            <OpenQuestion.Prompt>¿Qué tendría el tuyo que no tienen esos dos?</OpenQuestion.Prompt>
          </OpenQuestion>

          <Divider />

          <h2 className={cls.taskHeading}>7. La publicidad</h2>
          <p className={cls.sourceText}>
            Armá una publicación para la red que quieras. No alcanza con poner "comprá mi producto":
            tenés que convencer a alguien de que lo necesita.
          </p>
          <TaskList items={tasks} onToggle={toggleTask} label="Lo que la publicación tiene que tener" />

          <Divider />

          <h2 className={cls.sourceHeading}>8. Pasó un mes</h2>
          <p className={cls.sourceText}>
            Vendiste 40 unidades a $4.000 cada una. Producir cada una te costó $2.300, los de
            después del aumento.<span aria-hidden className={`${cls.cursor} ${cls.cursorBruno}`}>
              <span className={cls.caret} />
              <span className={cls.who}>Bruno</span>
            </span> Y gastaste $15.000 más en publicidad y transporte.
          </p>

          <NumberAnswer value={ingresos} onChange={setIngresos} unit="$" expected={160000} revealed={corregido}>
            <NumberAnswer.Prompt>Ingresos</NumberAnswer.Prompt>
          </NumberAnswer>

          <NumberAnswer value={costos} onChange={setCostos} unit="$" expected={92000} revealed={corregido}>
            <NumberAnswer.Prompt>Costo de producción</NumberAnswer.Prompt>
          </NumberAnswer>

          <NumberAnswer value={ganancia} onChange={setGanancia} unit="$" expected={53000} revealed={corregido}>
            <NumberAnswer.Prompt>Ganancia del mes</NumberAnswer.Prompt>
            <NumberAnswer.Hint>Ingresos menos costo de producción menos los $15.000 de gastos.</NumberAnswer.Hint>
          </NumberAnswer>

          <NumberAnswer value={equilibrio} onChange={setEquilibrio} unit="unidades" expected={59} revealed={corregido}>
            <NumberAnswer.Prompt>¿Cuántas unidades tenés que vender para recuperar los $100.000?</NumberAnswer.Prompt>
            <NumberAnswer.Hint>Con el precio y el costo de arriba, cada unidad te deja $1.700. Y no se venden unidades a medias.</NumberAnswer.Hint>
          </NumberAnswer>

          <Quote cite="#quote">
            <Quote.Source>Carla, presentando el año pasado</Quote.Source>
            Nos dio 59 unidades y en el mes vendimos 40. O sea que todavía no recuperamos nada:
            recién en el segundo mes empezamos a ganar.
          </Quote>

          <div className={cls.check}>
            <Button size="sm" variant={corregido ? 'ghost' : 'brand'} onClick={() => setCorregido(v => !v)}>
              {corregido ? 'Volver a la entrega' : 'Corregir las cuentas'}
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
