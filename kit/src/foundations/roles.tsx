import cls from './roles.module.css'
import { Icon, type IconName } from '@milo/ui'
import { A11y, Note, Page, Rich, Section, Stack } from '../kit'

type Role = {
  name: string
  icon: IconName
  who: string
  ve: string[]
  first: string
  avoid: string[]
  never: string
}

const roles: Role[] = [
  {
    name: 'Estudiante',
    icon: 'school',
    who: 'Entra desde el celular, muchas veces entre una clase y otra. Tiene diez años o diecisiete, y la diferencia es enorme.',
    ve: ['Lo suyo: qué tiene que hacer y para cuándo', 'La devolución que le dejaron, entera', 'Cómo viene, contra sí mismo y no contra el curso'],
    first: 'La próxima entrega. Una sola, con su fecha.',
    avoid: ['Comparaciones con compañeros: puestos, promedios del curso, quién entregó antes', 'Lo administrativo, que no es suyo', 'La jerga pedagógica: rúbrica, instancia, trayectoria'],
    never: 'El dato de otro estudiante. Ni el nombre.',
  },
  {
    name: 'Docente',
    icon: 'person',
    who: 'Es quien más horas pasa adentro. Tolera y necesita densidad: ve treinta filas y las lee.',
    ve: ['Su curso entero, persona por persona', 'Quién entregó, quién no y quién está trabado', 'Lo que pide una acción suya hoy'],
    first: 'Lo que se le vence o lo que está esperando corrección.',
    avoid: ['Su propio desempeño al lado del de otro docente', 'Esconder el detalle: acá el detalle es el trabajo', 'Confirmaciones para lo que se puede deshacer'],
    never: 'Los cursos que no da.',
  },
  {
    name: 'Familia',
    icon: 'group',
    who: 'Entra una vez por trimestre, casi siempre porque le llegó un aviso. No va a aprender la interfaz.',
    ve: ['Lo de su hijo o hija, y nada más', 'Qué pasó y qué se espera de la familia', 'Las fechas que involucran a la casa'],
    first: 'Si hay algo para hacer, eso. Si no, cómo viene, en una frase.',
    avoid: ['Métricas sin referencia: un 45% suelto asusta y no dice nada', 'La jerga del sistema y la pedagógica', 'Pedirle que navegue para encontrar lo importante'],
    never: 'Otro estudiante, aunque sea del mismo curso.',
  },
  {
    name: 'Conducción',
    icon: 'dashboard',
    who: 'Mira la escuela, no una clase. Necesita ver lo que se sale de lo esperado sin abrir veinte pantallas.',
    ve: ['El agregado por curso, por espacio y por período', 'Lo que se desvía y hace cuánto', 'Dónde hace falta una decisión suya'],
    first: 'Lo que se salió de lo esperado, con el curso que lo explica.',
    avoid: ['El detalle de una persona sin una razón: eso es del docente', 'Rankear docentes: un tablero que ordena cambia lo que el docente hace', 'Números sin el período contra el que se comparan'],
    never: 'Leer una devolución individual como si fuera un dato agregado.',
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
        <Stack>
          {roles.map(r => <RoleCard key={r.name} role={r} />)}
        </Stack>
      </Section>

      <Section
        title="Las reglas que cruzan a los cuatro"
        note="Son las que se olvidan cuando se arma una pantalla pensando en un rol solo."
      >
        <div className={cls.ruleGrid}>
          <Rule title="El rol cambia qué se ve, no cómo se ve" text="La misma `Card`, la misma `Table`, el mismo azul. Si un rol necesita otra pieza para la misma cosa, lo que está mal es la pieza." />
          <Rule title="Esconder no es proteger" text="Lo que un rol no puede ver no se manda al navegador. Un dato que llega y se oculta con CSS está a un inspector de distancia, y acá los datos son de menores." />
          <Rule title="No hay un selector de rol" text="El rol viene de quién entró. Un conmutador de vista es una función de soporte, se anuncia como tal y queda registrado." />
          <Rule title="El vacío también cambia" text={`"Todavía no hay entregas" es distinto para quien las tiene que hacer, para quien las espera y para quien pregunta cómo viene. El vacío ofrece la acción de ese rol.`} />
          <Rule title="La densidad se gana con las horas" text="El docente vive adentro y lee una tabla de treinta filas. La familia entra cuatro veces al año: ahí la misma tabla es una pared." />
          <Rule title="Un dato de una persona tiene dueño" text="Una devolución es del estudiante y de quien la escribió. Que conducción pueda verla no quiere decir que vaya en un tablero." />
        </div>
      </Section>

      <Note title="Por qué esto es un fundamento y no una decisión de producto">
        Porque decide cosas del sistema, no de una pantalla. Es la razón por la que las tarjetas no
        esconden acciones en hover: who entra cuatro veces al año no descubre lo que aparece con
        el mouse. Es la razón por la que el vacío siempre ofrece una salida. Y es la razón por la
        que el texto va en segunda persona: who lee puede tener diez años.
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

function RoleCard({ role }: { role: Role }) {
  return (
    <div className={`${cls.roleCard} bg-surface`}>
      <div className={cls.roleHead}>
        <span className={`${cls.roleBadge} inset-relief`}>
          <Icon name={role.icon} size={20} className="icon-muted" />
        </span>
        <div className={cls.roleIdentity}>
          <span className={cls.roleName}>{role.name}</span>
          <p className={cls.roleWho}>{role.who}</p>
        </div>
      </div>
      <div className={cls.roleColumns}>
        <Bullets title="Ve" items={role.ve} />
        <Bullets title="Evitar" items={role.avoid} />
        <Stack gap="sm">
          <span className={cls.firstLabel}>Primero</span>
          <span className={cls.firstText}>{role.first}</span>
          <span className={cls.neverLabel}>Nunca</span>
          <span className={cls.neverText}>{role.never}</span>
        </Stack>
      </div>
    </div>
  )
}

function Bullets({ title, items }: { title: string; items: string[] }) {
  return (
    <Stack gap="sm">
      <span className={cls.listTitle}>{title}</span>
      <ul className={cls.list}>
        {items.map(i => <li key={i} className={cls.listItem}>{i}</li>)}
      </ul>
    </Stack>
  )
}

function Rule({ title, text }: { title: string; text: string }) {
  return (
    <div className={`${cls.specimen} bg-surface`}>
      <span className={cls.specimenLabel}>{title}</span>
      <span className={cls.specimenBody}><Rich text={text} /></span>
    </div>
  )
}
