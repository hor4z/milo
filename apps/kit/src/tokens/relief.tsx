import { Mono, Page, Section } from '../kit'

const recipes = [
  {
    token: '--relief-raised',
    cls: 'raised',
    role: 'el botón gris que sobresale',
    detail: 'degradado + luz interior al 33% + canto + caída corta',
  },
  {
    token: '--relief-solid',
    cls: 'raised-solid bg-solid',
    role: 'el botón oscuro',
    detail: 'luz al 15% arriba, labio oscuro abajo, canto un paso más claro',
  },
  {
    token: '--relief-brand',
    cls: 'raised-brand',
    role: 'el CTA azul',
    detail: 'las mismas cuatro capas, más flojas: sobre un relleno saturado el relieve del gris se ve exagerado',
  },
  {
    token: '--relief-pressed',
    cls: 'pressed bg-muted',
    role: 'un toggle mientras su panel está abierto',
    detail: 'la sombra entra desde abajo, sin canto',
  },
  {
    token: '--relief-inset',
    cls: 'inset-relief bg-muted',
    role: 'lo hundido que es una marca: kbd, pista de un segmented',
    detail: 'lleva canto y caída, y los blur son sub-píxel: con 1px el labio se derrama hacia adentro',
  },
  { token: '--relief-card', cls: 'bg-surface shadow-card', role: 'una tarjeta', detail: 'tres capas de alpha bajo' },
  { token: '--relief-toolbar', cls: 'bg-surface shadow-toolbar', role: 'la barra que flota sobre el contenido', detail: 'spread negativo' },
  { token: '--relief-popover', cls: 'bg-surface shadow-popover', role: 'un menú o un modal', detail: 'lejos del plano del fondo' },
] as const

export function ReliefSection() {
  return (
    <Page
      title="Relieve"
      lead="Es lo que le da carácter al sistema y lo que más costó acertar. Todas las recetas mezclan luz interior arriba y sombra abajo: es lo que hace que una pieza se sienta física en vez de dibujada."
    >
      <Section
        title="Las recetas"
        note="Dos cosas que conviene no volver a pelear: el canto (--edge) no es un escalón de la rampa, es más oscuro que el borde más oscuro porque dibuja el filo de algo que sobresale. Y hundido son dos cosas distintas: una marca lleva canto y caída, algo que se aprieta no."
      >
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {recipes.map(r => (
            <div key={r.token} className="flex flex-col gap-2.5">
              <div className="flex min-h-[104px] items-center justify-center rounded-xl border border-line bg-canvas p-5">
                <div className={`size-20 rounded-xl ${r.cls}`} />
              </div>
              <div>
                <Mono>{r.token}</Mono>
                <div className="mt-1 text-xs font-semibold text-ink">{r.role}</div>
                <div className="mt-0.5 text-2xs text-ink-muted">{r.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="El degradado" note="Va como token porque el día que cambie, el botón, el select y el chip activo tienen que cambiar juntos.">
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-16 w-40 rounded-xl" style={{ background: 'var(--grad-raised)' }} />
            <Mono>--grad-raised</Mono>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-16 w-40 rounded-xl" style={{ background: 'var(--grad-brand)' }} />
            <Mono>--grad-brand</Mono>
          </div>
        </div>
      </Section>

      <Section title="El anillo de foco" note="Una vez y para todos los roles, y con `:focus-visible` y no `:focus`: con el segundo, un click deja el anillo puesto.">
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5">
          <span className="size-11 rounded-md bg-muted" style={{ boxShadow: 'var(--focus-ring)' }} />
          <Mono>--focus-ring</Mono>
        </div>
      </Section>
    </Page>
  )
}
