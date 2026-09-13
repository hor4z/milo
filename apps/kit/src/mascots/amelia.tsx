import s from './amelia.module.css'
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
        <div className={`${s.div} bg-surface`}>
          <img src="/mascotas/amelia.webp" alt="" className={s.img} />
          <div className={s.div2}>
            <span className={s.span}>Amelia</span>
            <span className={s.span2}>
              Una chica de primaria, de anteojos redondos y dos rodetes.
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Los clips"
        note="Solo 'Quieta' se repite: es el único que termina donde empezó. Las vueltas van adentro del archivo: un `img` no tiene `loop` como un `video`."
      >
        <div className={s.div3}>
          {clips.map(c => (
            <div key={c.archivo} className={`${s.div4} bg-surface`}>
              <div className={s.div5}>
                <img
                  src={quieto ? '/mascotas/amelia.webp' : `/mascotas/${c.archivo}.webp`}
                  alt=""
                  className={s.box}
                />
              </div>
              <div className={s.div6}>
                <span className={s.span3}>{c.titulo}</span>
                <span className={s.span4}>{c.nota}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Los archivos">
        <div className={`${s.div7} bg-surface`}>
          {[
            ['/mascotas/amelia.webp', '354 × 1200 · 66 KB', 'El retrato.'],
            ['/mascotas/amelia-quieta.webp', '66 × 179 · 628 KB', 'El único que se repite. 120 cuadros a 12 por segundo.'],
            ['/mascotas/amelia-saluda.webp', '124 × 186 · 686 KB', 'Se reproduce una vez. 142 cuadros a 16, que es lo que pide una entrada caminando.'],
            ['/mascotas/amelia-trabaja.webp', '126 × 216 · 399 KB', 'Se reproduce una vez. 73 cuadros a 12 por segundo.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className={s.div8}>
              <code className={s.code}>{ruta}</code>
              <span className={`${s.span5} tabular`}>{peso}</span>
              <span className={s.span6}>{nota}</span>
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
