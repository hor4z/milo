import { Button, Dropdown } from '@melu/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function DropdownStory() {
  return (
    <Page
      title="Dropdown"
      lead="Un menú de cuatro items. No lleva velo: el velo va para lo que pide leerse entero, y un menú corto no lo pide. Cierra con Escape, que usa una pila global — cierra el overlay de arriba y no todos."
      kind="Acciones"
      imports="import { Dropdown } from '@melu/ui'"
    >
      <Section title="Vivo" note="El disparador va como render prop porque el Dropdown necesita su ref para medir dónde abrir. Desde que `Button` acepta ref, el disparador puede ser el botón del sistema y no un <button> crudo repitiendo las clases.">
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="align end · width 220">
            <Dropdown
              width={220}
              items={[
                { label: 'Mi perfil', icon: 'person' },
                { label: 'Plan', icon: 'credit_card' },
                { label: 'Ajustes', icon: 'tune' },
                { label: 'Salir', icon: 'logout' },
              ]}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised" iconEnd="keyboard_arrow_down">Abrir menú</Button>
              )}
            />
          </Demo>
          <Demo label="align start">
            <Dropdown
              align="start"
              width={200}
              items={[{ label: 'Duplicar', icon: 'content_copy' }, { label: 'Descargar', icon: 'download' }, { label: 'Eliminar', icon: 'delete' }]}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised" icon="more_horiz">Acciones</Button>
              )}
            />
          </Demo>
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'items', type: '{ label, icon?, onSelect? }[]', note: 'obligatorio' },
          { name: 'trigger', type: '(props) => ReactNode', note: 'obligatorio: recibe onClick, ref y aria-expanded' },
          { name: 'align', type: "'start' | 'end'", def: "'end'" },
          { name: 'width', type: 'number', def: '220' },
        ]} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'El panel es role="menu" y cada opción un menuitem.',
          'Escape cierra solo este menú y deja abierto lo que haya detrás, por la pila global.',
          'Cierra con pointerdown y no con click: el mismo gesto que abre otro menú no lo reabre.',
        ]} />
      </Section>
    </Page>
  )
}
