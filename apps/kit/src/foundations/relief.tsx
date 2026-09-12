import { Note, Page, Section } from '../kit'

const recipes = [
  { cls: 'raised', back: 'bg-muted text-ink', token: '--relief-raised', role: 'el botón gris que sobresale', detail: 'degradado, luz al 33%, canto y caída corta' },
  { cls: 'raised-solid', back: 'bg-solid text-on-solid', token: '--relief-solid', role: 'el botón oscuro', detail: 'luz al 15% arriba, labio oscuro abajo, canto un paso más claro' },
  { cls: 'pressed', back: 'bg-muted text-ink', token: '--relief-pressed', role: 'un toggle con su panel abierto', detail: 'la sombra entra desde abajo, sin canto' },
  { cls: 'inset-relief', back: 'bg-muted text-ink', token: '--relief-inset', role: 'lo hundido que es una marca', detail: 'kbd, la pista de un segmented: lleva canto y caída' },
] as const

const layers = [
  { token: '--relief-card', role: 'una tarjeta apoyada' },
  { token: '--relief-toolbar', role: 'una barra flotante' },
  { token: '--relief-popover', role: 'lo que flota sobre todo' },
] as const

export function ReliefSection() {
  return (
    <Page
      title="Relieve"
      kind="Fundamentos"
      lead="Es lo que le da carácter al sistema y lo que más costó acertar. Cinco recetas, todas mezclando luz interior arriba y sombra abajo. Marca lo que se aprieta y lo que sobresale; dónde estás parado lo marca el azul, que para eso es el primario."
    >
      <Note icon="layers" title="Lo que el relieve dejó de tener que hacer">
        Durante un tiempo el relieve era lo único que separaba una tarjeta del fondo: el papel de
        una pieza y el de la página eran el mismo color. No alcanzaba — con la elevación en alpha
        bajo y a 1x, una pantalla densa se leía como un campo blanco enorme con líneas encima.
        Ahora <code>--surface</code> y <code>--canvas</code> son dos tonos distintos, y eso libera
        al relieve de una carga que no le correspondía: ya no tiene que decir <em>si</em> algo
        existe, solo <strong className="font-semibold text-ink">cuánto se levanta</strong>. Es la
        razón por la que las sombras de abajo son tan bajas y funcionan igual.
      </Note>

      <Section title="Las recetas que se tocan">
        <div className="grid gap-3 sm:grid-cols-2">
          {recipes.map(r => (
            <div key={r.token} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
              <div className={`${r.cls} ${r.back} flex h-14 items-center justify-center rounded-xl text-body font-semibold`}>
                {r.role}
              </div>
              <div className="flex flex-col gap-1">
                <code className="font-mono text-meta font-semibold text-ink">{r.token}</code>
                <span className="text-meta font-medium text-ink-muted">{r.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="La elevación en capas"
        note="Alpha bajo y spread negativo. Cuanto más alto flota algo, más difusa y más lejos cae su sombra."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {layers.map(c => (
            <div key={c.token} className="flex flex-col items-center gap-4 rounded-xl border border-line bg-muted p-6">
              <div className="size-20 rounded-xl bg-surface" style={{ boxShadow: `var(${c.token})` }} />
              <div className="flex flex-col items-center gap-1 text-center">
                <code className="font-mono text-meta font-semibold text-ink">{c.token}</code>
                <span className="text-meta font-medium text-ink-muted">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Dos cosas que costaron"
        note="Las dos están escritas al lado de su token, y las dos se rompieron antes de quedar escritas."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
            <span className="text-body font-semibold text-ink">El canto no es un escalón de la rampa</span>
            <p className="text-meta font-medium text-ink-muted">
              <code className="font-mono">--edge</code> es más oscuro que el borde más oscuro, porque tiene
              que dibujar el filo de algo que sobresale. Con el paso 05 puesto ahí, el botón gris se ve
              plano sobre un fondo casi blanco.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
            <span className="text-body font-semibold text-ink">Hundido son dos cosas distintas</span>
            <p className="text-meta font-medium text-ink-muted">
              Una marca lleva canto y sombra de caída; algo que se aprieta, no. Mezclarlas hace que un
              kbd y un toggle activo se vean igual, que son dos cosas que no tienen nada que ver.
            </p>
          </div>
        </div>
      </Section>

      <Note title="Un campo no lleva relieve">
        El relieve dice «esto sobresale» o «esto se aprieta», y un campo no es ninguna de las dos: es un
        lugar donde apoyar texto. Los cuatro campos del sistema se dibujan con un fondo y una línea, y
        al enfocarse se les tiñe el borde que ya tenían.
      </Note>
    </Page>
  )
}
