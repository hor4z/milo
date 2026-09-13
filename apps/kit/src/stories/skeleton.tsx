import cls from './skeleton.module.css'
import { Card, Skeleton } from '@milo/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function SkeletonStory() {
  return (
    <Page
      title="Skeleton"
      kind="Datos"
      imports="import { Skeleton } from '@milo/ui'"
      lead="El hueco que ocupa algo que todavía no llegó. Tiene que medir lo mismo que el contenido real, o al llegar los datos la pantalla salta y se pierde lo que se estaba leyendo."
    >
      <Section
        title="Una fila de lista"
        note="El esqueleto copia la forma, no el contenido: un círculo donde va el avatar, dos barras donde van el título y su línea de apoyo. La segunda va más corta porque los subtítulos son más cortos: si las dos miden igual, el bloque se lee como un párrafo y no como una fila."
      >
        <Demo label="mientras carga">
          <div className={cls.div}>
            {[0, 1, 2].map(i => (
              <div key={i} className={cls.div2}>
                <Skeleton className={cls.skeleton} />
                <div className={cls.div3}>
                  <Skeleton className={cls.skeleton2} />
                  <Skeleton className={cls.skeleton3} />
                </div>
              </div>
            ))}
          </div>
        </Demo>
      </Section>

      <Section
        title="Una tarjeta"
        note="El tamaño lo pone quien lo usa, con las mismas clases que va a tener el contenido: así el esqueleto no se desincroniza del real cuando alguien cambia una medida."
      >
        <div className={cls.div4}>
          <Card className={cls.card}>
            <Skeleton className={cls.skeleton4} />
            <div className={cls.div5}>
              <Skeleton className={cls.skeleton5} />
              <Skeleton className={cls.skeleton6} />
            </div>
          </Card>
          <Card className={cls.card2}>
            <Skeleton className={cls.skeleton7} />
            <div className={cls.div6}>
              <Skeleton className={cls.skeleton8} />
              <Skeleton className={cls.skeleton9} />
            </div>
          </Card>
        </div>
      </Section>

      <Note title="El esqueleto no es un spinner">
        Un <a className={cls.a} href="#spinner">Spinner</a> dice "esperá"; un
        esqueleto dice "va a haber tres filas, así de anchas". Cuando se sabe la forma de lo que
        viene, el esqueleto evita el salto. Cuando no se sabe (una búsqueda que puede traer cero o
        cien) el spinner es más honesto.
      </Note>

      <Section title="Props">
        <Props of="Skeleton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es aria-hidden: un lector de pantalla no anuncia rectángulos vacíos.',
          'Quien espera datos necesita que se lo diga el contenedor (aria-busy en la lista, un aviso al terminar), no cada hueco.',
          'El pulso respeta prefers-reduced-motion: sin animación, el hueco se ve igual.',
        ]} />
      </Section>
    </Page>
  )
}
