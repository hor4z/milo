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
        note="El esqueleto copia la forma, no el contenido: un círculo donde va el avatar, dos barras donde van el título y su línea de apoyo. La segunda va más corta porque los subtítulos son más cortos — si las dos miden igual, el bloque se lee como un párrafo y no como una fila."
      >
        <Demo label="mientras carga">
          <div className="flex w-full max-w-[420px] flex-col gap-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
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
        <div className="flex flex-wrap gap-4">
          <Card className="w-[260px]">
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <div className="flex flex-col gap-2 px-2 pt-3 pb-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </Card>
          <Card className="w-[260px]">
            <Skeleton className="h-[120px] w-full rounded-xl" />
            <div className="flex flex-col gap-2 px-2 pt-3 pb-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-2/5" />
            </div>
          </Card>
        </div>
      </Section>

      <Note title="El esqueleto no es un spinner">
        Un <a className="underline underline-offset-2" href="#spinner">Spinner</a> dice «esperá»; un
        esqueleto dice «va a haber tres filas, así de anchas». Cuando se sabe la forma de lo que
        viene, el esqueleto evita el salto. Cuando no se sabe —una búsqueda que puede traer cero o
        cien— el spinner es más honesto.
      </Note>

      <Section title="Props">
        <Props of="Skeleton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es aria-hidden: un lector de pantalla no anuncia rectángulos vacíos.',
          'Quien espera datos necesita que se lo diga el contenedor —aria-busy en la lista, un aviso al terminar—, no cada hueco.',
          'El pulso respeta prefers-reduced-motion: sin animación, el hueco se ve igual.',
        ]} />
      </Section>
    </Page>
  )
}
