import cls from './empty-state.module.css'
import { Button, EmptyState, FilterReset } from '@milo/ui'
import { A11y, Demo, Page, Props, Section, Stack } from '../kit'

export function EmptyStateStory() {
  return (
    <Page
      title="EmptyState"
      kind="Avisos"
      imports="import { EmptyState } from '@milo/ui'"
      lead="Lo que se ve cuando no hay nada, siempre con una salida: un vacío que no dice qué hacer es una pantalla rota con buena redacción. El icono va adentro de un hueco y en gris: suelto y grande se ve como una imagen que no cargó, que es justo lo que uno teme."
    >
      <Section
        title="Los dos tamaños"
        note="La diferencia no es el padding. `md` es el de una pantalla: 'esto está vacío y podés empezar acá'. `sm` es el de adentro de una pieza, donde el vacío es de una búsqueda y no del lugar: con el aire del grande, filtrar y no encontrar nada empuja la paginación media pantalla para abajo."
      >
        <Stack gap="lg">
          <Demo label="md · una pantalla">
            <EmptyState
              icon="inbox"
              title="Todavía no llegó ninguna entrega"
              body="Cuando alguien entregue una actividad de este espacio, la vas a ver acá con su estado."
              action={<Button variant="solid">Crear una actividad</Button>}
            />
          </Demo>
          <Demo label="sm · adentro de una pieza">
            <div className={`${cls.insetBox} bg-surface`}>
              <EmptyState
                size="sm"
                icon="search_off"
                title="Ninguna actividad con eso"
                body="Probá con otras palabras, o sacá alguno de los filtros puestos."
                action={<FilterReset>Limpiar los filtros</FilterReset>}
              />
            </div>
          </Demo>
        </Stack>
      </Section>

      <Section
        title="La caja punteada"
        note="Opcional, con una regla: adentro de algo que ya tiene marco, no va. El borde punteado dice 'acá va a haber contenido', y dibujado dentro de una tabla o de una tarjeta son dos marcos anidados discutiendo cuál es el borde de qué. Por eso `sm` la apaga sola: el lugar donde se usa `sm` es, casi por definición, adentro de otra cosa."
      >
        <Stack gap="lg">
          <Demo label="bordered · el default de md">
            <EmptyState icon="folder_open" title="Este espacio está vacío" body="Todavía no hay actividades acá." />
          </Demo>
          <Demo label="sin caja, adentro de una tarjeta">
            <div className={`${cls.raisedBox} bg-surface`}>
              <EmptyState
                bordered={false}
                icon="folder_open"
                title="Este espacio está vacío"
                body="Todavía no hay actividades acá."
              />
            </div>
          </Demo>
        </Stack>
      </Section>

      <Section
        title="Sin icono"
        note="Sigue funcionando, y es lo que había antes: un bloque de texto centrado. Con icono se reconoce de qué tipo de vacío se trata antes de leerlo: no es lo mismo 'no hay nada todavía' que 'no encontré nada con eso'."
      >
        <Demo label="solo texto">
          <EmptyState
            title="Acá no hay nada"
            body="La dirección existe pero no lleva a ninguna pantalla."
            action={<Button variant="muted">Volver</Button>}
          />
        </Demo>
      </Section>

      <Section title="Props">
        <Props of="EmptyState" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El icono es decorativo y no se anuncia: lo que se lee es el título y el cuerpo.',
          'La acción es un botón real, no un texto que parece link.',
        ]} />
      </Section>
    </Page>
  )
}
