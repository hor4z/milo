import { Button } from '@milo/ui'
import { A11y, Demo, Page, Panel, Props, Section, Variant } from '../kit'

export function ButtonStory() {
  return (
    <Page
      title="Button"
      kind="Acciones"
      imports="import { Button } from '@milo/ui'"
      lead="El texto va un escalón arriba del de su entorno: un botón con el mismo tamaño de letra que lo que lo rodea no se lee como accionable."
    >
      <Section
        title="Variantes"
        note="`brand` es el que manda y hay uno por pantalla, con el relleno anclado donde el blanco encima llega a 4.5:1. `solid` es el mismo rol en tinta, para donde el azul no se puede usar. Va uno o el otro, nunca los dos, o la mirada no sabe cuál es. `raised` es el secundario."
      >
        <Panel>
          <Variant name="brand"><Button variant="brand">Crear actividad</Button></Variant>
          <Variant name="solid"><Button variant="solid">Crear actividad</Button></Variant>
          <Variant name="raised"><Button variant="raised">Crear actividad</Button></Variant>
          <Variant name="muted"><Button variant="muted">Crear actividad</Button></Variant>
          <Variant name="ghost"><Button variant="ghost">Crear actividad</Button></Variant>
          <Variant name="bad"><Button variant="bad">Eliminar</Button></Variant>
        </Panel>
      </Section>

      <Section
        title="Tamaños"
        note="Tres alturas y un rol cada una: 32 inline en una fila densa, 36 dentro de un panel, 40 la acción principal. Ninguna es un número elegido — es la línea de la interfaz (16) más aire que sube de a 2, y el padding lateral de a 4. La escalera la comparte el `IconButton`, así que `md` mide 36 en las dos piezas."
      >
        <Panel>
          <Variant name="sm · 32">
            <Button size="sm" variant="solid">Guardar</Button>
            <Button size="sm" variant="raised">Guardar</Button>
          </Variant>
          <Variant name="md · 36">
            <Button size="md" variant="solid">Guardar</Button>
            <Button size="md" variant="raised">Guardar</Button>
          </Variant>
          <Variant name="lg · 40">
            <Button size="lg" variant="solid">Guardar</Button>
            <Button size="lg" variant="raised">Guardar</Button>
          </Variant>
        </Panel>
      </Section>

      <Section title="Iconos, ancho completo y deshabilitado">
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="icon"><Button variant="raised" icon="add">Nuevo espacio</Button></Demo>
          <Demo label="iconEnd"><Button variant="raised" iconEnd="chevron_right">Siguiente</Button></Demo>
          <Demo label="disabled">
            <Button variant="solid" disabled>Guardar</Button>
            <Button variant="raised" disabled>Guardar</Button>
          </Demo>
          <div className="w-full max-w-[280px]">
            <Demo label="block"><Button variant="solid" block>Entrar</Button></Demo>
          </div>
        </div>
      </Section>

      <Section title="Props">
        <Props of="Button" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Es un <button> real: entra en el orden de tabulación y responde a Enter y Espacio.',
          'El anillo de foco se suma al relieve en vez de reemplazarlo, así que un botón enfocado no se plancha.',
          'Deshabilitado deja de recibir el puntero y baja a 45% de opacidad, pero conserva su texto legible.',
        ]} />
      </Section>
    </Page>
  )
}
