import cls from './empty-state.module.css'
import { Button } from '@milo/ui/button'
import { EmptyState } from '@milo/ui/empty-state'
import { FilterReset } from '@milo/ui/filter'
import { A11y, Demo, Example, Page, Practices, Props, Section, Stack } from '../kit'

export function EmptyStateStory() {
  return (
    <Page
      title="EmptyState"
      kind="Avisos"
      imports="import { EmptyState } from '@milo/ui/empty-state'"
      lead="Lo que se ve cuando no hay nada, siempre con una salida: un vacío que no dice qué hacer es una pantalla rota con buena redacción. El icono va adentro de un hueco y en gris: suelto y grande se ve como una imagen que no cargó, que es justo lo que uno teme."
    >
      <Section
        title="Los dos tamaños"
        note="La diferencia no es el padding. `md` es el de una pantalla: 'esto está vacío y podés empezar acá'. `sm` es el de adentro de una pieza, donde el vacío es de una búsqueda y no del lugar: con el aire del grande, filtrar y no encontrar nada empuja la paginación media pantalla para abajo."
      >
        <Stack gap="lg">
          <Demo label="md · una pantalla">
            <EmptyState icon="inbox">
              <EmptyState.Title>Todavía no llegó ninguna entrega</EmptyState.Title>
              <EmptyState.Body>Cuando alguien entregue una actividad de este espacio, la vas a ver acá con su estado.</EmptyState.Body>
              <EmptyState.Action><Button variant="brand">Crear una actividad</Button></EmptyState.Action>
            </EmptyState>
          </Demo>
          <Demo label="sm · adentro de una pieza">
            <div className={`${cls.insetBox} bg-surface`}>
              <EmptyState size="sm" icon="search_off">
                <EmptyState.Title>Ninguna actividad con eso</EmptyState.Title>
                <EmptyState.Body>Probá con otras palabras, o sacá alguno de los filtros puestos.</EmptyState.Body>
                <EmptyState.Action><FilterReset>Limpiar los filtros</FilterReset></EmptyState.Action>
              </EmptyState>
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
            <EmptyState icon="folder_open" >
              <EmptyState.Title>Este espacio está vacío</EmptyState.Title>
              <EmptyState.Body>Todavía no hay actividades acá.</EmptyState.Body>
            </EmptyState>
          </Demo>
          <Demo label="sin caja, adentro de una tarjeta">
            <div className={`${cls.raisedBox} bg-surface`}>
              <EmptyState
                bordered={false}
                icon="folder_open"
               
               
              >
                <EmptyState.Title>Este espacio está vacío</EmptyState.Title>
                <EmptyState.Body>Todavía no hay actividades acá.</EmptyState.Body>
              </EmptyState>
            </div>
          </Demo>
        </Stack>
      </Section>

      <Section
        title="Sin icono"
        note="Sigue funcionando, y es lo que había antes: un bloque de texto centrado. Con icono se reconoce de qué tipo de vacío se trata antes de leerlo: no es lo mismo 'no hay nada todavía' que 'no encontré nada con eso'."
      >
        <Demo label="solo texto">
          <EmptyState>
            <EmptyState.Title>Acá no hay nada</EmptyState.Title>
            <EmptyState.Body>La dirección existe pero no lleva a ninguna pantalla.</EmptyState.Body>
            <EmptyState.Action><Button variant="muted">Volver</Button></EmptyState.Action>
          </EmptyState>
        </Demo>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<EmptyState icon="inbox">
  <EmptyState.Title>Todavía no llegó ninguna entrega</EmptyState.Title>
  <EmptyState.Body>Cuando alguien entregue, la vas a ver acá.</EmptyState.Body>
  <EmptyState.Action><Button variant="brand">Crear una actividad</Button></EmptyState.Action>
</EmptyState>`} />
      </Section>

      <Section title="Props">
        <Props of="EmptyState" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Siempre conviene que haya una salida: el `EmptyState.Action`.</Practices.Do>
          <Practices.Do>El título dice qué falta y el cuerpo qué se puede hacer.</Practices.Do>
          <Practices.Dont>Adentro de una tabla o una galería va en `size="sm"`, sin la caja punteada.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El icono es decorativo y no se anuncia: lo que se lee es el título y el cuerpo.</A11y.Item>
          <A11y.Item>La acción es un botón real, no un texto que parece link.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
