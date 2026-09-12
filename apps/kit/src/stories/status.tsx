import { Badge, Progress, Skeleton } from '@melu/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function StatusStory() {
  return (
    <Page
      title="Badge, Progress y Skeleton"
      kind="Datos"
      imports="import { Badge, Progress, Skeleton } from '@melu/ui'"
      lead="Las tres piezas que dicen en qué estado está algo sin abrirlo: una marca, una barra y un hueco que espera."
    >
      <Section
        title="Badge"
        note="Una marca chica pegada a lo que describe. Siempre con texto: un punto de color no dice en qué estado está algo, y si lo dijera, no lo diría para quien no distingue colores."
      >
        <Demo label="tonos">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Borrador</Badge>
            <Badge tone="info">En prueba</Badge>
            <Badge tone="ok" icon="check_circle">Corregida</Badge>
            <Badge tone="warn" icon="schedule">Vence mañana</Badge>
            <Badge tone="bad" icon="error">Sin entregar</Badge>
          </div>
        </Demo>
      </Section>

      <Section
        title="Progress"
        note="Cuánto va hecho de algo que tiene un final. La pista es el resto y va clarísima: con el mismo peso que el relleno, la barra se lee como dos datos apilados en vez de como una parte de un todo."
      >
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5">
          <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
          <Progress label="Espacio usado" value={92} max={100} hint="92%" tone="warn" />
          <Progress label="Cuota de la cuenta" value={100} max={100} hint="llena" tone="bad" />
        </div>
      </Section>

      <Section
        title="Skeleton"
        note="El hueco que ocupa algo que todavía no llegó. Tiene que medir lo mismo que el contenido real, o al llegar los datos la pantalla salta y se pierde lo que se estaba leyendo."
      >
        <Demo label="una fila de la lista mientras carga">
          <div className="flex w-full max-w-[420px] items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </Demo>
      </Section>

      <Note title="El esqueleto no es un spinner">
        Un spinner dice «esperá»; un esqueleto dice «va a haber tres filas, así de anchas». Cuando se
        sabe la forma de lo que viene, el esqueleto evita el salto. Cuando no se sabe —una búsqueda que
        puede traer cero o cien— el spinner es más honesto.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'Badge · tone', type: "'neutral' | 'info' | 'ok' | 'warn' | 'bad'", def: "'neutral'" },
          { name: 'Badge · icon', type: 'IconName', note: 'el glifo que acompaña al texto' },
          { name: 'Progress · value', type: 'number', required: true },
          { name: 'Progress · max', type: 'number', def: '100' },
          { name: 'Progress · label', type: 'string', required: true, note: 'qué mide; lo usa el lector de pantalla' },
          { name: 'Progress · hint', type: 'ReactNode', note: 'el número al costado' },
          { name: 'Skeleton · className', type: 'string', note: 'el tamaño lo pone quien lo usa' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Progress es un role="progressbar" con valor, mínimo, máximo y nombre.',
          'El estado de un Badge está en su texto, no en su color.',
          'El Skeleton es aria-hidden: un lector no anuncia rectángulos vacíos.',
        ]} />
      </Section>
    </Page>
  )
}
