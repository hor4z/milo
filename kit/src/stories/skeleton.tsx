import cls from './skeleton.module.css'
import { Card } from '@milo/ui/card'
import { Skeleton } from '@milo/ui/skeleton'
import { A11y, Cluster, Demo, Note, Page, Practices, Props, Section, Stack } from '../kit'

export function SkeletonStory() {
  return (
    <Page
      title="Skeleton"
      kind="Datos"
      imports="import { Skeleton } from '@milo/ui/skeleton'"
      lead="El hueco que ocupa algo que todavía no llegó. Tiene que medir lo mismo que el contenido real, o al llegar los datos la pantalla salta y se pierde lo que se estaba leyendo."
    >
      <Section
        title="Una fila de lista"
        note="El esqueleto copia la forma, no el contenido: un círculo donde va el avatar, dos barras donde van el título y su línea de apoyo. La segunda va más corta porque los subtítulos son más cortos: si las dos miden igual, el bloque se lee como un párrafo y no como una fila."
      >
        <Demo label="mientras carga">
          <Stack gap="lg" width="md">
            {[0, 1, 2].map(i => (
              <div key={i} className={cls.row}>
                <Skeleton className={cls.avatarBone} />
                <div className={cls.rowLines}>
                  <Skeleton className={cls.rowTitleBone} />
                  <Skeleton className={cls.rowMetaBone} />
                </div>
              </div>
            ))}
          </Stack>
        </Demo>
      </Section>

      <Section
        title="Una tarjeta"
        note="El tamaño lo pone quien lo usa, con las mismas clases que va a tener el contenido: así el esqueleto no se desincroniza del real cuando alguien cambia una medida."
      >
        <Cluster gap="lg">
          <Card className={cls.longCard}>
            <Skeleton className={cls.longCoverBone} />
            <div className={cls.longBody}>
              <Skeleton className={cls.longTitleBone} />
              <Skeleton className={cls.longMetaBone} />
            </div>
          </Card>
          <Card className={cls.shortCard}>
            <Skeleton className={cls.shortCoverBone} />
            <div className={cls.shortBody}>
              <Skeleton className={cls.shortTitleBone} />
              <Skeleton className={cls.shortMetaBone} />
            </div>
          </Card>
        </Cluster>
      </Section>

      <Note title="El esqueleto no es un spinner">
        Un [Spinner](#spinner) dice "esperá"; un
        esqueleto dice "va a haber tres filas, así de anchas". Cuando se sabe la forma de lo que
        viene, el esqueleto evita el salto. Cuando no se sabe (una búsqueda que puede traer cero o
        cien) el spinner es más honesto.
      </Note>

      <Section title="Props">
        <Props of="Skeleton" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Ocupa el lugar exacto de lo que viene, así que cuando llega no se mueve nada.</Practices.Do>
          <Practices.Dont>Para una espera de menos de un segundo no va nada: el parpadeo molesta más que la espera.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Es aria-hidden: un lector de pantalla no anuncia rectángulos vacíos.</A11y.Item>
          <A11y.Item>Quien espera datos necesita que se lo diga el contenedor (aria-busy en la lista, un aviso al terminar), no cada hueco.</A11y.Item>
          <A11y.Item>El pulso respeta prefers-reduced-motion: sin animación, el hueco se ve igual.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
