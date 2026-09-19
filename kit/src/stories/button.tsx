import { Button } from '@milo/ui'
import { A11y, Cluster, Demo, Page, Panel, Props, Section, Variant } from '../kit'

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
        note="`brand` es el que manda y hay uno por pantalla, con el relleno anclado donde el blanco encima llega a 4.5:1. `solid` es el mismo rol en tinta, para donde el azul no se puede usar. Va uno o el otro, nunca los dos, o la mirada no sabe cuál es. `raised` es el secundario, y es el único que se dibuja con un borde: sin relleno propio hace falta algo que diga dónde termina el botón."
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
        note="Tres alturas y un rol cada una: 36 inline en una fila densa, 40 dentro de un panel, 44 la acción principal. Ninguna es un número elegido: es la línea de la interfaz (16) más aire que sube de a 2 por lado, y el padding lateral de a 4. El `lg` cae en 44, que es el objetivo táctil que pide Apple por defecto, así que la acción principal ya llega con el dedo sin que el táctil la agrande. La escalera la comparten el `IconButton` y los campos, así que `md` mide 40 en todas."
      >
        <Panel>
          <Variant name="sm · 36">
            <Button size="sm" variant="solid">Guardar</Button>
            <Button size="sm" variant="raised">Guardar</Button>
          </Variant>
          <Variant name="md · 40">
            <Button size="md" variant="solid">Guardar</Button>
            <Button size="md" variant="raised">Guardar</Button>
          </Variant>
          <Variant name="lg · 44">
            <Button size="lg" variant="solid">Guardar</Button>
            <Button size="lg" variant="raised">Guardar</Button>
          </Variant>
        </Panel>
      </Section>

      <Section title="Iconos, ancho completo y deshabilitado">
        <Cluster align="start">
          <Demo label="icon"><Button variant="raised" icon="folder">Nuevo espacio</Button></Demo>
          <Demo label="iconEnd"><Button variant="raised" iconEnd="chevron_right">Siguiente</Button></Demo>
          <Demo label="disabled">
            <Button variant="solid" disabled>Guardar</Button>
            <Button variant="raised" disabled>Guardar</Button>
          </Demo>
          <Demo width="xs" label="block"><Button variant="solid" block>Entrar</Button></Demo>
        </Cluster>
      </Section>

      <Section title="Props">
        <Props of="Button" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un <button> real: entra en el orden de tabulación y responde a Enter y Espacio.',
          'El anillo de foco se dibuja por fuera de la caja, con dos píxeles de superficie de por medio: no mueve el botón ni empuja a los de al lado.',
          'Deshabilitado deja de recibir el puntero y baja a 45% de opacidad, pero conserva su texto legible.',
        ]} />
      </Section>
    </Page>
  )
}
