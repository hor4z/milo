import { Note, Page, Section, useTokens } from '../kit'

const escala = [
  { token: '--text-2xs', cls: 'text-2xs', px: '11', rol: 'kbd, metadatos, la línea de apoyo de una fila' },
  { token: '--text-xs', cls: 'text-xs', px: '12', rol: 'la interfaz entera' },
  { token: '--text-base', cls: 'text-base', px: '14', rol: 'botones, títulos de fila, lo que se lee primero' },
  { token: '--text-lg', cls: 'text-lg', px: '20', rol: 'título de una sección' },
  { token: '--text-display', cls: 'text-display', px: '40', rol: 'portadas' },
] as const

export function TypeSection() {
  return (
    <Page
      title="Tipografía"
      kind="Guía"
      lead="Instrument Sans y nada más: interfaz, portadas y el rol mono. Display y cuerpo son la misma familia a propósito — a 40px lo que separa un título del cuerpo es el tamaño y el tracking, no un dibujo distinto de la letra, y dos familias que se parecen es lo peor de los dos mundos."
    >
      <Section title="La escala">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {escala.map(e => (
            <div key={e.token} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b border-line px-5 py-4 last:border-0">
              <span className="w-14 shrink-0">
                <code className="font-mono text-2xs text-ink-muted">{e.px}px</code>
              </span>
              <span className={`${e.cls} min-w-0 flex-1 font-semibold text-ink`}>Doce actividades</span>
              <span className="w-[34ch] shrink-0 text-2xs font-medium text-ink-muted">{e.rol}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Tres pesos"
        note="400 la interfaz, 500 lo accionable y los títulos de fila, 600 solo en portada. Bajaron un escalón entero al pasar a Instrument Sans, que dibuja más grueso al mismo número: con los tres anteriores la pantalla entera se veía en negrita. Se cambió en el @theme y no en los call sites, así que las utilidades siguen llamándose medium, semibold y bold: el nombre es del rol, no del número."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['font-medium', '400', 'la interfaz'],
            ['font-semibold', '500', 'lo accionable'],
            ['font-bold', '600', 'la portada'],
          ].map(([cls, n, rol]) => (
            <div key={cls} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
              <span className={`${cls} text-display leading-none text-ink`}>Aa</span>
              <code className="font-mono text-2xs text-ink">{cls}</code>
              <span className="text-2xs font-medium text-ink-muted">{n} · {rol}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El line-height es uno solo"
        note="16px fijo para todo lo que no sea portada. Es lo que hace que una fila de 12 y una de 14 sigan alineadas entre sí cuando van una al lado de la otra."
      >
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <span className="text-xs font-medium text-ink">12 sobre 16</span>
            <span className="text-base font-semibold text-ink">14 sobre 16</span>
          </div>
          <span className="text-2xs font-medium text-ink-muted">Las dos líneas apoyan en la misma base.</span>
        </div>
      </Section>

      <Section
        title="El rol mono"
        note="Es la misma familia, así que pierde el ancho fijo. Lo que lo reemplaza es --tabular, que da ancho fijo a los números sin cambiar de letra: alcanza para un precio, una métrica o una columna de tabla, y no alcanza para un bloque de código, que en este sistema no existe."
      >
        <div className="flex flex-wrap gap-10 rounded-2xl border border-line bg-surface p-5">
          <div className="flex flex-col items-start gap-1">
            <span className="mb-1 text-2xs font-medium text-ink-muted">sin tabular</span>
            {['11.111', '40.000', '18.914', '88.100'].map(n => (
              <span key={n} className="border-r border-line pr-1 text-lg font-semibold text-ink">{n}</span>
            ))}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="mb-1 text-2xs font-medium text-ink-muted">con tabular</span>
            {['11.111', '40.000', '18.914', '88.100'].map(n => (
              <span key={n} className="tabular border-r border-line pr-1 text-lg font-semibold text-ink">{n}</span>
            ))}
          </div>
          <p className="max-w-[30ch] self-center text-2xs font-medium text-ink-muted">
            Mirá dónde termina cada número. En la primera columna el borde derecho baila, porque el
            1 mide casi la mitad que el 0. En la segunda, todos los dígitos miden lo mismo y la
            columna cierra derecha.
          </p>
        </div>
      </Section>

      <Familias />

      <Note title="Lo que queda por mirar">
        El <code>--tracking-tight</code> de -0.015em salió de mirar Inter a 12px y no se volvió a mirar
        en tres familias. El peso ya se corrigió al pasar a Instrument Sans; el tracking es el que
        queda.
      </Note>
    </Page>
  )
}

function Familias() {
  const vals = useTokens(['--font-sans', '--font-mono'])
  return (
    <Section title="Las familias">
      <div className="flex flex-col gap-3">
        {[['--font-sans', 'la interfaz, las portadas'], ['--font-mono', 'tokens, valores y atajos']].map(([t, rol]) => (
          <div key={t} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
            <div className="flex min-w-0 flex-col gap-1">
              <code className="font-mono text-2xs font-semibold text-ink">{t}</code>
              <span className="text-2xs font-medium text-ink-muted">{rol}</span>
            </div>
            <code className="truncate font-mono text-2xs text-ink-muted">{vals[t]}</code>
          </div>
        ))}
      </div>
    </Section>
  )
}
