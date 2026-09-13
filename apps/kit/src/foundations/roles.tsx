import { Icon, type IconName } from '@milo/ui'
import { A11y, Note, Page, Rich, Section } from '../kit'

type Rol = {
  nombre: string
  icon: IconName
  quien: string
  ve: string[]
  primero: string
  evitar: string[]
  nunca: string
}

const roles: Rol[] = [
  {
    nombre: 'Estudiante',
    icon: 'school',
    quien: 'Entra desde el celular, muchas veces entre una clase y otra. Tiene diez años o diecisiete, y la diferencia es enorme.',
    ve: ['Lo suyo: qué tiene que hacer y para cuándo', 'La devolución que le dejaron, entera', 'Cómo viene, contra sí mismo y no contra el curso'],
    primero: 'La próxima entrega. Una sola, con su fecha.',
    evitar: ['Comparaciones con compañeros: puestos, promedios del curso, quién entregó antes', 'Lo administrativo, que no es suyo', 'La jerga pedagógica: rúbrica, instancia, trayectoria'],
    nunca: 'El dato de otro estudiante. Ni el nombre.',
  },
  {
    nombre: 'Docente',
    icon: 'person',
    quien: 'Es quien más horas pasa adentro. Tolera y necesita densidad: ve treinta filas y las lee.',
    ve: ['Su curso entero, persona por persona', 'Quién entregó, quién no y quién está trabado', 'Lo que pide una acción suya hoy'],
    primero: 'Lo que se le vence o lo que está esperando corrección.',
    evitar: ['Su propio desempeño al lado del de otro docente', 'Esconder el detalle: acá el detalle es el trabajo', 'Confirmaciones para lo que se puede deshacer'],
    nunca: 'Los cursos que no da.',
  },
  {
    nombre: 'Familia',
    icon: 'group',
    quien: 'Entra una vez por trimestre, casi siempre porque le llegó un aviso. No va a aprender la interfaz.',
    ve: ['Lo de su hijo o hija, y nada más', 'Qué pasó y qué se espera de la familia', 'Las fechas que involucran a la casa'],
    primero: 'Si hay algo para hacer, eso. Si no, cómo viene, en una frase.',
    evitar: ['Métricas sin referencia: un 45% suelto asusta y no dice nada', 'La jerga del sistema y la pedagógica', 'Pedirle que navegue para encontrar lo importante'],
    nunca: 'Otro estudiante, aunque sea del mismo curso.',
  },
  {
    nombre: 'Conducción',
    icon: 'dashboard',
    quien: 'Mira la escuela, no una clase. Necesita ver lo que se sale de lo esperado sin abrir veinte pantallas.',
    ve: ['El agregado por curso, por espacio y por período', 'Lo que se desvía y hace cuánto', 'Dónde hace falta una decisión suya'],
    primero: 'Lo que se salió de lo esperado, con el curso que lo explica.',
    evitar: ['El detalle de una persona sin una razón: eso es del docente', 'Rankear docentes: un tablero que ordena cambia lo que el docente hace', 'Números sin el período contra el que se comparan'],
    nunca: 'Leer una devolución individual como si fuera un dato agregado.',
  },
]

export function RolesSection() {
  return (
    <Page
      title="Quién está mirando"
      kind="Fundamentos"
      lead="Una plataforma de escuela la usan cuatro personas muy distintas y la mayoría de las decisiones de interfaz dependen de cuál de las cuatro entró. No es una preferencia ni un modo que se elige: es de quién es la sesión."
    >
      <Section
        title="Los cuatro"
        note="El orden no es de importancia: es el de cuánto tiempo pasa cada uno adentro, que es lo que decide cuánta densidad tolera."
      >
        <div className="flex flex-col gap-3">
          {roles.map(r => <Tarjeta key={r.nombre} rol={r} />)}
        </div>
      </Section>

      <Section
        title="Las reglas que cruzan a los cuatro"
        note="Son las que se olvidan cuando se arma una pantalla pensando en un rol solo."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Regla titulo="El rol cambia qué se ve, no cómo se ve" text="La misma `Card`, la misma `Table`, el mismo azul. Si un rol necesita otra pieza para la misma cosa, lo que está mal es la pieza." />
          <Regla titulo="Esconder no es proteger" text="Lo que un rol no puede ver no se manda al navegador. Un dato que llega y se oculta con CSS está a un inspector de distancia, y acá los datos son de menores." />
          <Regla titulo="No hay un selector de rol" text="El rol viene de quién entró. Un conmutador de vista es una función de soporte, se anuncia como tal y queda registrado." />
          <Regla titulo="El vacío también cambia" text={`"Todavía no hay entregas" es distinto para quien las tiene que hacer, para quien las espera y para quien pregunta cómo viene. El vacío ofrece la acción de ese rol.`} />
          <Regla titulo="La densidad se gana con las horas" text="El docente vive adentro y lee una tabla de treinta filas. La familia entra cuatro veces al año: ahí la misma tabla es una pared." />
          <Regla titulo="Un dato de una persona tiene dueño" text="Una devolución es del estudiante y de quien la escribió. Que conducción pueda verla no quiere decir que vaya en un tablero." />
        </div>
      </Section>

      <Note title="Por qué esto es un fundamento y no una decisión de producto">
        Porque decide cosas del sistema, no de una pantalla. Es la razón por la que las tarjetas no
        esconden acciones en hover: quien entra cuatro veces al año no descubre lo que aparece con
        el mouse. Es la razón por la que el vacío siempre ofrece una salida. Y es la razón por la
        que el texto va en segunda persona: quien lee puede tener diez años.
      </Note>

      <A11y
        items={[
          'El rol no cambia el contrato de accesibilidad: la misma pieza, el mismo teclado, el mismo contraste para los cuatro.',
          'Cuanto menos seguido entra alguien, más pesa que el nombre de cada cosa se entienda sin contexto: la familia no aprendió el vocabulario del sistema.',
          'Un aviso dirigido a un rol dice a quién le habla en el texto, no solo por dónde aparece.',
        ]}
      />
    </Page>
  )
}

function Tarjeta({ rol }: { rol: Rol }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start gap-3">
        <span className="inset-relief flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
          <Icon name={rol.icon} size={20} className="icon-muted" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-reading font-semibold text-ink">{rol.nombre}</span>
          <p className="max-w-[70ch] text-meta font-medium text-ink-muted">{rol.quien}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Lista titulo="Ve" items={rol.ve} />
        <Lista titulo="Evitar" items={rol.evitar} />
        <div className="flex flex-col gap-2">
          <span className="text-meta font-semibold text-ink">Primero</span>
          <span className="text-meta font-medium text-ink-muted">{rol.primero}</span>
          <span className="mt-1 text-meta font-semibold text-ink">Nunca</span>
          <span className="text-meta font-medium text-ink-muted">{rol.nunca}</span>
        </div>
      </div>
    </div>
  )
}

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-meta font-semibold text-ink">{titulo}</span>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {items.map(i => <li key={i} className="text-meta font-medium text-ink-muted">{i}</li>)}
      </ul>
    </div>
  )
}

function Regla({ titulo, text }: { titulo: string; text: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4">
      <span className="text-body font-semibold text-ink">{titulo}</span>
      <span className="text-meta font-medium text-ink-muted"><Rich text={text} /></span>
    </div>
  )
}
