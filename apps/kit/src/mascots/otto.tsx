import { A11y, Page, Section } from '../kit'

export function OttoStory() {
  return (
    <Page
      title="Otto"
      kind="Mascotas"
      lead="Un compañero intrépido, capaz de sacarte una sonrisa y de empujarte a seguir cuando algo se puso cuesta arriba. Otto es una nutria, y todavía no tiene un lugar asignado: está acá como material."
      imports="<img src='/mascotas/otto.webp' alt='' />"
    >
      <Section title="El retrato">
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-xl border border-line bg-surface p-8">
          <img src="/mascotas/otto.webp" alt="" className="h-64 w-auto shrink-0" />
          <div className="flex flex-col gap-2">
            <span className="text-display font-bold text-ink">Otto</span>
            <span className="max-w-[30ch] text-reading text-ink-muted">
              Curioso, se mete en todos lados y sale con algo para contar.
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="El primitivo"
        note="Otto sin nada encima. Es del que salen los demás: el pañuelo se le puso a este, y lo que venga después también. Si hay que dibujar una variante nueva, se parte de acá y no del retrato de presentación."
      >
        <div className="flex justify-center rounded-xl border border-line bg-surface p-8">
          <img src="/mascotas/otto-primitivo.webp" alt="" className="h-56 w-auto" />
        </div>
      </Section>

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/otto-primitivo.webp', '686 × 1200 · 150 KB', 'Otto sin nada encima. De acá salen los demás.'],
            ['/mascotas/otto.webp', '658 × 1200 · 148 KB', 'El de presentación, con el pañuelo.'],
            ['/mascotas/otto-anima.webp', '105 × 200 · 390 KB', 'El bucle. 100 cuadros a 12 por segundo.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-60 shrink-0 font-mono text-meta font-semibold text-ink">{ruta}</code>
              <span className="w-48 shrink-0 tabular text-meta text-ink-muted">{peso}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[64ch] text-meta text-ink-muted">
          Los dos salen de <code>npm run mascotas</code>, que es lo que les saca el fondo.
        </p>
      </Section>

      <A11y
        items={[
          'Va con `alt=""`: es decorativo, y lo que la pantalla quiera decir va en su texto.',
          'Un `img` animado no se puede pausar, así que donde se use el bucle, `prefers-reduced-motion` no lo atenúa: lo reemplaza por el retrato quieto.',
        ]}
      />
    </Page>
  )
}
