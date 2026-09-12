import { Button, EmptyState, FilterReset } from '@melu/ui'
import { Demo, Page, Props, Section } from '../kit'

export function EmptyStateStory() {
  return (
    <Page
      title="EmptyState"
      lead="Lo que se ve cuando no hay nada, siempre con una salida: un vacío que no dice qué hacer es una pantalla rota con buena redacción. El icono va adentro de un hueco y en gris — suelto y grande se ve como una imagen que no cargó, que es justo lo que uno teme cuando una pantalla aparece vacía, y el hueco lo convierte en una marca puesta a propósito."
    >
      <Section
        title="Los dos tamaños"
        note="La diferencia no es sólo el padding. `md` es el de una pantalla: dice «esto está vacío y podés empezar acá». `sm` es el de adentro de una pieza —una tabla filtrada, una galería sin coincidencias— donde el vacío es de una búsqueda y no del lugar: con el aire del grande, filtrar y no encontrar nada empuja la paginación media pantalla para abajo y parece que la tabla desapareció."
      >
        <div className="flex flex-col gap-4">
          <Demo label="md · una pantalla">
            <EmptyState
              icon="inbox"
              title="Todavía no llegó ninguna entrega"
              body="Cuando alguien entregue una actividad de este espacio, la vas a ver acá con su estado."
              action={<Button variant="solid" icon="add">Crear una actividad</Button>}
            />
          </Demo>
          <Demo label="sm · adentro de una pieza">
            <div className="rounded-md bg-surface ring-1 ring-line">
              <EmptyState
                size="sm"
                icon="search_off"
                title="Ninguna actividad con eso"
                body="Probá con otras palabras, o sacá alguno de los filtros puestos."
                action={<FilterReset>Limpiar los filtros</FilterReset>}
              />
            </div>
          </Demo>
        </div>
      </Section>

      <Section
        title="La caja punteada"
        note="Opcional, con una regla: adentro de algo que ya tiene marco, no va. El borde punteado dice «acá va a haber contenido», y dibujado dentro de una tabla o de una tarjeta son dos marcos anidados discutiendo cuál es el borde de qué. Por eso `sm` la apaga sola — el lugar donde se usa `sm` es, casi por definición, adentro de otra cosa."
      >
        <div className="flex flex-col gap-4">
          <Demo label="bordered · el default de md">
            <EmptyState icon="folder_open" title="Este espacio está vacío" body="Todavía no hay actividades acá." />
          </Demo>
          <Demo label="sin caja, adentro de una tarjeta">
            <div className="rounded-2xl bg-surface p-2 shadow-card">
              <EmptyState
                bordered={false}
                icon="folder_open"
                title="Este espacio está vacío"
                body="Todavía no hay actividades acá."
              />
            </div>
          </Demo>
        </div>
      </Section>

      <Section
        title="Sin icono"
        note="Sigue funcionando, y es lo que había antes: un bloque de texto centrado. Con icono se reconoce de qué tipo de vacío se trata antes de leerlo — no es lo mismo «no hay nada todavía» que «no encontré nada con eso»."
      >
        <Demo label="solo texto">
          <EmptyState
            title="Acá no hay nada"
            body="La dirección existe pero no lleva a ninguna pantalla."
            action={<Button variant="raised">Volver</Button>}
          />
        </Demo>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'title', type: 'string', note: 'obligatorio' },
          { name: 'body', type: 'string', note: 'obligatorio: qué pasó y qué se puede hacer' },
          { name: 'icon', type: 'IconName', note: 'la marca de arriba, en un hueco y en gris' },
          { name: 'size', type: "'sm' | 'md'", def: "'md'", note: 'md para una pantalla, sm adentro de una pieza' },
          { name: 'bordered', type: 'boolean', def: 'md → true, sm → false', note: 'la caja punteada' },
          { name: 'action', type: 'ReactNode', note: 'la salida. Siempre conviene que haya una' },
        ]} />
      </Section>
    </Page>
  )
}
