import cls from './otto.module.css'
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
        <div className={`${cls.div} bg-surface`}>
          <img src="/mascotas/otto.webp" alt="" className={cls.img} />
          <div className={cls.div2}>
            <span className={cls.span}>Otto</span>
            <span className={cls.span2}>
              Curioso, se mete en todos lados y sale con algo para contar.
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="El primitivo"
        note="Otto sin nada encima. Es del que salen los demás: el pañuelo se le puso a este, y lo que venga después también. Si hay que dibujar una variante nueva, se parte de acá y no del retrato de presentación."
      >
        <div className={`${cls.div3} bg-surface`}>
          <img src="/mascotas/otto-primitivo.webp" alt="" className={cls.img2} />
        </div>
      </Section>

      <Section title="Los archivos">
        <div className={`${cls.div4} bg-surface`}>
          {[
            ['/mascotas/otto-primitivo.webp', '686 × 1200 · 150 KB', 'Otto sin nada encima. De acá salen los demás.'],
            ['/mascotas/otto.webp', '658 × 1200 · 148 KB', 'El de presentación, con el pañuelo.'],
            ['/mascotas/otto-anima.webp', '105 × 200 · 390 KB', 'El bucle. 100 cuadros a 12 por segundo.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className={cls.div5}>
              <code className={cls.code}>{ruta}</code>
              <span className={`${cls.span3} tabular`}>{peso}</span>
              <span className={cls.span4}>{nota}</span>
            </div>
          ))}
        </div>
        <p className={cls.p}>
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
