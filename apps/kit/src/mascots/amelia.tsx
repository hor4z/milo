import { A11y, Page, Section } from '../kit'
import { useQuieto } from './quieto'

const clips = [
  { archivo: 'amelia-quieta', titulo: 'Quieta', nota: 'Respira. Es el único que se repite.', bucle: true },
  { archivo: 'amelia-saluda', titulo: 'Saluda', nota: 'Entra desde afuera de cuadro y se queda.', bucle: false },
  { archivo: 'amelia-trabaja', titulo: 'Trabaja', nota: 'Casco y cinta métrica.', bucle: false },
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
        <div className="flex justify-center rounded-xl border border-line bg-surface p-8">
          <img src="/mascotas/amelia.webp" alt="" className="h-64 w-auto" />
        </div>
      </Section>

      <Section
        title="Los clips"
        note="Solo «Quieta» lleva `loop`: es el único que termina donde empezó. Los otros dos en bucle harían que Amelia desaparezca y vuelva a entrar cada diez segundos."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map(c => (
            <div key={c.archivo} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
              <div className="flex justify-center rounded-lg bg-sunken py-3">
                {quieto
                  ? <img src="/mascotas/amelia.webp" alt="" className="h-52 w-auto" />
                  : (
                    <video
                      src={`/mascotas/${c.archivo}.mp4`}
                      autoPlay
                      muted
                      playsInline
                      loop={c.bucle}
                      aria-label={`Amelia ${c.titulo.toLowerCase()}`}
                      className="h-52 w-auto"
                    />
                  )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-body font-semibold text-ink">{c.titulo}</span>
                <span className="text-meta text-ink-muted">{c.nota}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[64ch] text-meta text-ink-muted">
          Los tres todavía traen su fondo, así que van adentro de una caja. Sueltos sobre el canvas
          se vería el rectángulo, y en tema oscuro peor.
        </p>
      </Section>

      <Section
        title="Al lado de Otto"
        note="Se alinean por el alto y nunca por el ancho: los retratos comparten los 1200 de alto y no el ancho, así que dos `width` iguales los dejan de dos tamaños."
      >
        <div className="flex flex-wrap items-end justify-center gap-10 rounded-xl border border-line bg-sunken p-8">
          {[['/mascotas/otto.webp', 'Otto'], ['/mascotas/amelia.webp', 'Amelia']].map(([src, nombre]) => (
            <div key={nombre} className="flex flex-col items-center gap-2">
              <img src={src} alt="" className="h-56 w-auto" />
              <span className="text-body font-semibold text-ink">{nombre}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/amelia.webp', '354 × 1200 · 66 KB', 'El retrato, con alfa.'],
            ['/mascotas/amelia-quieta.mp4', '540 × 960 · 10 s · 103 KB', 'El único que lleva `loop`.'],
            ['/mascotas/amelia-saluda.mp4', '540 × 960 · 10 s · 258 KB', 'Se reproduce una vez.'],
            ['/mascotas/amelia-trabaja.mp4', '400 × 736 · 6 s · 166 KB', 'Se reproduce una vez.'],
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
