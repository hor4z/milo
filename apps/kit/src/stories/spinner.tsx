import { Button, Spinner } from '@melu/ui'
import { Page, Panel, Props, Section, Variant } from '../kit'

export function SpinnerStory() {
  return (
    <Page
      title="Spinner"
      lead="Pista completa más un arco encima, los dos del mismo grosor. La pista no es decorativa: sin ella, un arco suelto girando no dice «esperá», dice que falta un trozo de la interfaz. El arco es de largo fijo y lo único que pasa es que gira, parejo."
    >
      <Section
        title="Tamaños"
        note="El trazo sí escala: es el 17% del diámetro a cualquier tamaño, que es la proporción de la referencia. Con el trazo fijo, el de 44 quedaba en 3 sobre 44 —un hilo— al lado del de 20 en 3 sobre 20: dos piezas del mismo componente que no se parecían entre sí. Abajo de 12 hay un piso de 2px, para que el trazo no caiga en el medio píxel y el antialias lo apague en vez de adelgazarlo."
      >
        <Panel>
          <Variant name="16 · 20 · 28 · 44">
            <Spinner size={16} />
            <Spinner size={20} />
            <Spinner size={28} />
            <Spinner size={44} />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="En contexto"
        note="El arco va en el azul de marca y no en tinta: en una pantalla monocroma, lo único que se mueve conviene que sea también lo único con color. Adentro de un botón oscuro hay que pasarle `on=&quot;solid&quot;` — el filo es del color del fondo de atrás y la pista sale del color del texto de ese fondo, y con el default puesto ahí el filo blanco se ve como un halo."
      >
        <Panel>
          <Variant name="en un botón">
            <Button variant="solid" aria-busy><Spinner size={16} on="solid" />Guardando</Button>
            <Button variant="raised" aria-busy><Spinner size={16} />Guardando</Button>
          </Variant>
          <Variant name="en una fila">
            <span className="flex items-center gap-2.5 text-xs font-medium text-ink-muted">
              <Spinner size={16} />
              Buscando en siete espacios
            </span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'size', type: 'number', def: '20', note: 'el trazo lo sigue: 17% del diámetro' },
          { name: 'label', type: 'string', def: "'Cargando'", note: 'al aria-label; el rol es status' },
          { name: 'on', type: "'surface' | 'solid'", def: "'surface'", note: 'sobre qué está apoyado: de ahí salen el filo y la pista' },
          { name: 'className', type: 'string' },
        ]} />
      </Section>
    </Page>
  )
}
