import { Button } from '@milo/ui/button'
import { ButtonGroup } from '@milo/ui/button-group'
import { Icon } from '@milo/ui/icon'
import { A11y, Canvas, Cluster, Example, Page, Props, Section, Stack } from '../kit'

export function ButtonGroupStory() {
  return (
    <Page
      title="ButtonGroup"
      kind="Acciones"
      imports="import { ButtonGroup } from '@milo/ui/button-group'"
      lead="Botones pegados, con el canto solo en los extremos. Dice que las acciones son de la misma familia sin escribirlo."
    >
      <Section
        title="Cuándo va pegado y cuándo separado"
        note="Pegado, las acciones se leen como variantes de una misma cosa. Si no lo son, van separadas con el aire de siempre: pegar dos acciones que no tienen nada que ver obliga a leer las dos para entender cualquiera. Y para elegir una entre varias va `Segmented`, que trae el roving del teclado."
      >
        <Canvas>
          <Stack gap="lg">
            <ButtonGroup label="Zoom">
              <Button iconStart={<Icon name="remove" />} aria-label="Alejar" />
              <Button>100%</Button>
              <Button iconStart={<Icon name="add" />} aria-label="Acercar" />
            </ButtonGroup>
            <ButtonGroup label="Orden">
              <Button>Más reciente</Button>
              <Button>Por nombre</Button>
            </ButtonGroup>
          </Stack>
        </Canvas>
      </Section>

      <Section title="Apilado" note="Para una columna angosta, o para un par que se lee de arriba abajo.">
        <Canvas>
          <Cluster>
            <ButtonGroup label="Mover la fila" vertical>
              <Button iconStart={<Icon name="arrow_upward" />} aria-label="Subir" />
              <Button iconStart={<Icon name="arrow_downward" />} aria-label="Bajar" />
            </ButtonGroup>
          </Cluster>
        </Canvas>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<ButtonGroup label="Orden">
  <Button>Más reciente</Button>
  <Button>Por nombre</Button>
</ButtonGroup>`} />
      </Section>

      <Section title="Props">
        <Props of="ButtonGroup" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un role="group" con su nombre: sin eso un lector lee los botones sueltos y no se entera de que van juntos.',
          'El foco de un botón se dibuja por encima de sus vecinos, así que el anillo no queda cortado por el de al lado.',
          'Cada botón sigue siendo un botón: las flechas no lo recorren, porque son acciones y no opciones.',
        ]} />
      </Section>
    </Page>
  )
}
