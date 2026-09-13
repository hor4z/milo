import { A11y, Page, Section } from '../kit'
import { useQuieto } from './quieto'

const clips = [
  { archivo: 'amelia-quieta', titulo: 'Quieta', nota: 'Respira. Es el único que se repite.' },
  { archivo: 'amelia-saluda', titulo: 'Saluda', nota: 'Entra desde afuera de cuadro y se queda.' },
  { archivo: 'amelia-trabaja', titulo: 'Trabaja', nota: 'Casco y cinta métrica.' },
] as const

export function AmeliaStory() {
  const quieto = useQuieto()

  return (
    <Page
      title="Amelia"
      kind="Mascotas"
      lead="Una chica de primaria. Como Otto, todavía no tiene un lugar asignado: está acá como material."
      imports="<img src='/mascotas/amelia.webp' alt='' />"
    >
      <Section title="El retrato">
        <div className="flex flex-wrap items-center justify-center gap-10 rounded-xl border border-line bg-surface p-8">
          <img src="/mascotas/amelia.webp" alt="" className="h-64 w-auto shrink-0" />
          <div className="flex flex-col gap-2">
            <span className="text-display font-bold text-ink">Amelia</span>
            <span className="max-w-[28ch] text-reading text-ink-muted">
              Una chica de primaria, de anteojos redondos y dos rodetes.
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Los clips"
        note="Solo «Quieta» se repite: es el único que termina donde empezó. Las vueltas van adentro del archivo — un `img` no tiene `loop` como un `video`."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map(c => (
            <div key={c.archivo} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
              <div className="flex justify-center py-3">
                <img
                  src={quieto ? '/mascotas/amelia.webp' : `/mascotas/${c.archivo}.webp`}
                  alt=""
                  className="h-52 w-auto"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-body font-semibold text-ink">{c.titulo}</span>
                <span className="text-meta text-ink-muted">{c.nota}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/amelia.webp', '354 × 1200 · 66 KB', 'El retrato.'],
            ['/mascotas/amelia-quieta.webp', '66 × 179 · 628 KB', 'El único que se repite. 120 cuadros a 12 por segundo.'],
            ['/mascotas/amelia-saluda.webp', '124 × 186 · 686 KB', 'Se reproduce una vez. 142 cuadros a 16, que es lo que pide una entrada caminando.'],
            ['/mascotas/amelia-trabaja.webp', '126 × 216 · 399 KB', 'Se reproduce una vez. 73 cuadros a 12 por segundo.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-60 shrink-0 font-mono text-meta font-semibold text-ink">{ruta}</code>
              <span className="w-48 shrink-0 tabular text-meta text-ink-muted">{peso}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
      </Section>

      <A11y
        items={[
          'Va con `alt=""`: es decorativo, y lo que la pantalla quiera decir va en su texto.',
          'Respeta `prefers-reduced-motion`: quien pidió menos movimiento ve el retrato quieto en vez de los clips.',
        ]}
      />
    </Page>
  )
}
