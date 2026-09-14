import { Button, Dropdown } from '@milo/ui'
import { A11y, Cluster, Demo, Page, Props, Section } from '../kit'

export function DropdownStory() {
  return (
    <Page
      title="Dropdown"
      lead="Un menú de cuatro items. No lleva velo: el velo va para lo que pide leerse entero, y un menú corto no lo pide. Cierra con Escape, que usa una pila global: cierra el overlay de arriba y no todos."
      kind="Acciones"
      imports="import { Dropdown } from '@milo/ui'"
    >
      <Section title="Vivo" note="El disparador va como render prop porque el Dropdown necesita su ref para medir dónde abrir. Desde que `Button` acepta ref, el disparador puede ser el botón del sistema y no un <button> crudo repitiendo las clases.">
        <Cluster align="start">
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
        </Cluster>
      </Section>

      <Section
        title="Lo que puede llevar una opción"
        note="Un glifo adelante, el atajo de teclado a la derecha, el tilde de 'esta es la que está puesta', y el rojo de lo que no se deshace. Lo apagado se queda a la vista y no desaparece: una opción que aparece y desaparece según el estado obliga a aprender el menú de nuevo cada vez."
      >
        <Cluster align="start">
          <Demo label="con atajos y una peligrosa">
            <Dropdown
              width={240}
              items={[
                { label: 'Duplicar', icon: 'content_copy', shortcut: '⌘D' },
                { label: 'Descargar', icon: 'download', shortcut: '⌘S' },
                { label: 'Archivar', icon: 'inventory_2', disabled: true },
                { label: 'Borrar', icon: 'delete', danger: true },
              ]}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised" icon="more_horiz">Acciones</Button>
              )}
            />
          </Demo>
        </Cluster>
      </Section>

      <Section title="Props">
        <Props of={['Dropdown', 'DropdownItem']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El panel es role="menu" y cada opción un menuitem.',
          'Las flechas recorren las opciones y dan la vuelta; Home y End van a los extremos, y las dos saltean lo apagado.',
          'El disparador dice si está abierto con `aria-expanded`, y al cerrar el foco vuelve a él.',
          'Escape cierra solo este menú y deja abierto lo que haya detrás, por la pila global.',
          'Cierra con pointerdown y no con click: el mismo gesto que abre otro menú no lo reabre.',
        ]} />
      </Section>
    </Page>
  )
}
