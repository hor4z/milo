import { Button } from '@melu/ui'
import { Block, Demo, Panel, Props, Section, Variant } from '../kit'

export function ButtonStory() {
  return (
    <Section
      title="Button"
      note="El texto va en 14/600 aunque la interfaz sea de 12: un botón con el mismo tamaño de letra que su entorno no se lee como accionable."
    >
      <Block
        label="Variantes"
        note="`solid` es el que manda y hay uno por pantalla. `brand` es el mismo rol en azul, así que va uno o el otro, nunca los dos en la misma pantalla, o la mirada no sabe cuál es. `raised` es el secundario y el que le da el carácter físico a la interfaz."
      >
        <Panel>
          <Variant name="solid"><Button variant="solid">Crear actividad</Button></Variant>
          <Variant name="brand"><Button variant="brand">Crear actividad</Button></Variant>
          <Variant name="raised"><Button variant="raised">Crear actividad</Button></Variant>
          <Variant name="muted"><Button variant="muted">Crear actividad</Button></Variant>
          <Variant name="ghost"><Button variant="ghost">Crear actividad</Button></Variant>
          <Variant name="bad"><Button variant="bad">Eliminar</Button></Variant>
        </Panel>
      </Block>

      <Block
        label="Tamaños"
        note="Tres alturas y un rol cada una: 32 inline en una fila densa, 36 acciones dentro de un panel, 40 la acción principal. Del 36 para arriba el texto es 14/600 y el radio 12; el 32 baja a 12px porque convive con texto de interfaz."
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
      </Block>

      <Block label="Iconos, ancho completo y deshabilitado">
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
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'variant', type: "'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad'", def: "'raised'", note: 'solid y brand son el mismo rol' },
          { name: 'size', type: "'sm' | 'md' | 'lg'", def: "'md'", note: '32 · 36 · 40' },
          { name: 'icon', type: 'IconName', note: 'antes del texto' },
          { name: 'iconEnd', type: 'IconName', note: 'después del texto' },
          { name: 'block', type: 'boolean', note: 'ocupa el ancho del contenedor' },
          { name: 'ref', type: 'Ref<HTMLButtonElement>', note: 'para usarlo como disparador de Dropdown o Popover' },
        ]} />
      </Block>
    </Section>
  )
}
