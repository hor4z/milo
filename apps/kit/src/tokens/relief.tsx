import { Note, Page, Section } from '../kit'

const recetas = [
  { cls: 'raised', token: '--relief-raised', rol: 'el botón gris que sobresale', detalle: 'degradado, luz al 33%, canto y caída corta' },
  { cls: 'raised-solid', token: '--relief-solid', rol: 'el botón oscuro', detalle: 'luz al 15% arriba, labio oscuro abajo, canto un paso más claro' },
  { cls: 'pressed', token: '--relief-pressed', rol: 'un toggle con su panel abierto', detalle: 'la sombra entra desde abajo, sin canto' },
  { cls: 'inset-relief', token: '--relief-inset', rol: 'lo hundido que es una marca', detalle: 'kbd, la pista de un segmented: lleva canto y caída' },
] as const

const capas = [
  { token: '--relief-card', rol: 'una tarjeta apoyada' },
  { token: '--relief-toolbar', rol: 'una barra flotante' },
  { token: '--relief-popover', rol: 'lo que flota sobre todo' },
] as const

export function ReliefSection() {
  return (
    <Page
      title="Relieve"
      kind="Guía"
      lead="Es lo que le da carácter al sistema y lo que más costó acertar. Cinco recetas, todas mezclando luz interior arriba y sombra abajo. El estado activo se marca con relieve y no con color: en una interfaz monocroma distingue más, y no gasta el único acento que hay."
    >
      <Section title="Las recetas que se tocan">
        <div className="grid gap-3 sm:grid-cols-2">
          {recetas.map(r => (
            <div key={r.token} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
              <div className={`${r.cls} flex h-14 items-center justify-center rounded-xl bg-muted text-xs font-semibold text-ink`}>
                {r.rol}
              </div>
              <div className="flex flex-col gap-1">
                <code className="font-mono text-2xs font-semibold text-ink">{r.token}</code>
                <span className="text-2xs font-medium text-ink-muted">{r.detalle}</span>
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
          {capas.map(c => (
            <div key={c.token} className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-muted p-6">
              <div className="size-20 rounded-xl bg-surface" style={{ boxShadow: `var(${c.token})` }} />
              <div className="flex flex-col items-center gap-1 text-center">
                <code className="font-mono text-2xs font-semibold text-ink">{c.token}</code>
                <span className="text-2xs font-medium text-ink-muted">{c.rol}</span>
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
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
            <span className="text-xs font-semibold text-ink">El canto no es un escalón de la rampa</span>
            <p className="text-2xs font-medium text-ink-muted">
              <code className="font-mono">--edge</code> es más oscuro que el borde más oscuro, porque tiene
              que dibujar el filo de algo que sobresale. Con el paso 05 puesto ahí, el botón gris se ve
              plano sobre un fondo casi blanco.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
            <span className="text-xs font-semibold text-ink">Hundido son dos cosas distintas</span>
            <p className="text-2xs font-medium text-ink-muted">
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
