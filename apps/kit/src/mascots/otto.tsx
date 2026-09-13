import { A11y, Page, Section } from '../kit'
import { useQuieto } from './quieto'

export function OttoStory() {
  const quieto = useQuieto()

  return (
    <Page
      title="Otto"
      kind="Mascotas"
      lead="Una nutria. Todavía no tiene un lugar asignado en el producto: está acá como material, no como pieza."
      imports="<img src='/mascotas/otto.webp' alt='' />"
    >
      <Section title="El retrato">
        <div className="flex justify-center rounded-xl border border-line bg-surface p-8">
          <img src="/mascotas/otto.webp" alt="" className="h-64 w-auto" />
        </div>
      </Section>

      <Section
        title="El bucle"
        note="Se asoma, se agarra con las dos manos y se vuelve a esconder. Viene cortado por donde estaba el canto, así que su borde izquierdo se apoya contra algo — acá, contra la caja."
      >
        <div className="relative flex h-[280px] w-[220px] justify-end rounded-xl border border-line bg-surface p-4">
          <img
            src={quieto ? '/mascotas/otto.webp' : '/mascotas/otto-anima.webp'}
            alt=""
            className="absolute left-full top-8 h-32 w-auto"
          />
        </div>
      </Section>

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/otto.webp', '686 × 1200 · 150 KB', 'El retrato, con alfa.'],
            ['/mascotas/otto-anima.webp', '105 × 200 · 9 s · 393 KB', 'El bucle, con alfa. 107 cuadros a 12 por segundo.'],
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
          'Un `img` animado no se puede pausar, así que `prefers-reduced-motion` no lo atenúa: lo reemplaza por el retrato quieto.',
        ]}
      />
    </Page>
  )
}
