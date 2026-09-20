import { Button } from '@milo/ui/button'
import { ButtonGroup } from '@milo/ui/button-group'
import { Icon } from '@milo/ui/icon'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

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
        <Panel>
          <Variant name="una acción en pasos" note="Alejar, el valor, acercar: tres botones que son la misma cosa.">
            <ButtonGroup label="Zoom">
              <Button size="sm" iconStart={<Icon name="remove" />} aria-label="Alejar" />
              <Button size="sm">100%</Button>
              <Button size="sm" iconStart={<Icon name="add" />} aria-label="Acercar" />
            </ButtonGroup>
          </Variant>
          <Variant name="dos maneras de lo mismo" note="Ordenar por una cosa o por la otra.">
            <ButtonGroup label="Orden">
              <Button size="sm">Más reciente</Button>
              <Button size="sm">Por nombre</Button>
            </ButtonGroup>
          </Variant>
        </Panel>
      </Section>

      <Section title="Apilado" note="Para una columna angosta, o para un par que se lee de arriba abajo.">
        <Panel>
          <Variant name="vertical">
            <ButtonGroup label="Mover la fila" vertical>
              <Button size="sm" iconStart={<Icon name="arrow_upward" />} aria-label="Subir" />
              <Button size="sm" iconStart={<Icon name="arrow_downward" />} aria-label="Bajar" />
            </ButtonGroup>
          </Variant>
        </Panel>
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

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>`label` nombra el grupo: sin eso los botones se leen sueltos.</Practices.Do>
          <Practices.Do>Va solo cuando las acciones son variantes de una misma cosa.</Practices.Do>
          <Practices.Dont>Para elegir una opción entre varias va `Segmented`, que trae las flechas del teclado.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Es un role="group" con su nombre: sin eso un lector lee los botones sueltos y no se entera de que van juntos.</A11y.Item>
          <A11y.Item>El foco de un botón se dibuja por encima de sus vecinos, así que el anillo no queda cortado por el de al lado.</A11y.Item>
          <A11y.Item>Cada botón sigue siendo un botón: las flechas no lo recorren, porque son acciones y no opciones.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
