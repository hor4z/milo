import { useState } from 'react'
import { Button } from '@milo/ui/button'
import { Divider } from '@milo/ui/divider'
import { Icon } from '@milo/ui/icon'
import { Menu } from '@milo/ui/menu'
import { Popover } from '@milo/ui/popover'
import { A11y, Footnote, Mono, Page, Panel, Props, Section, Variant } from '../kit'

export function MenuStory() {
  const [view, setView] = useState<'grilla' | 'lista'>('grilla')

  return (
    <Page
      title="Menu"
      kind="Acciones"
      imports="import { Menu } from '@milo/ui/menu'"
      lead="Piezas que se arman, no una lista de opciones: un panel y filas que se escriben adentro. Es el mismo corte que la Table, y por el mismo motivo: la lista alcanza hasta el primer menú que necesita un separador, un rótulo de grupo o un atajo, y a partir de ahí cada necesidad nueva es una prop nueva en un objeto."
    >
      <Section
        title="La fila"
        note="40 de alto, radio 12 y el icono en gris a 20: el texto va en tinta: al revés, con el texto apagado, el menú entero se lee como deshabilitado. A la derecha hay un solo lugar y cuatro cosas que pueden ocuparlo: el atajo, una línea de apoyo, el tilde o el chevron. Nunca dos, porque compiten por el mismo significado."
      >
        <Panel>
          <Variant name="suelta">
            <Menu label="Acciones de la actividad" width={260}>
              <Menu.Item icon="edit">Renombrar</Menu.Item>
              <Menu.Item icon="content_copy">Duplicar<Menu.Shortcut>⌘D</Menu.Shortcut></Menu.Item>
              <Menu.Item icon="group">Compartir<Menu.Hint>7</Menu.Hint></Menu.Item>
              <Menu.Item icon="folder" submenu>Mover a</Menu.Item>
            </Menu>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Rótulo, separador y opción destructiva"
        note="El rótulo va en tinta y no en gris, igual que la cabecera de la Table: apagado, obliga a buscar de qué es cada grupo. La opción destructiva es la única que cambia de color en todo el sistema, y su icono no va en gris: el gris es lo que apaga y esto es lo contrario."
      >
        <Panel>
          <Variant name="armado entero">
            <Menu label="Acciones con grupos" width={260}>
              <Menu.Label>Esta actividad</Menu.Label>
              <Menu.Item icon="edit">Editar<Menu.Shortcut>E</Menu.Shortcut></Menu.Item>
              <Menu.Item icon="visibility">Ver como estudiante</Menu.Item>
              <Divider />
              <Menu.Label>Vista</Menu.Label>
              <Menu.Item icon="grid_view" checked={view === 'grilla'} onSelect={() => setView('grilla')}>
                Grilla
              </Menu.Item>
              <Menu.Item icon="view_list" checked={view === 'lista'} onSelect={() => setView('lista')}>
                Lista
              </Menu.Item>
              <Divider />
              <Menu.Item icon="inventory_2" disabled>Archivar</Menu.Item>
              <Menu.Item icon="delete" danger>Eliminar</Menu.Item>
            </Menu>
          </Variant>
        </Panel>
        <Footnote>
          El separador se estira hasta el borde del panel, y esa cuenta la hace el panel porque es
          el que conoce su padding. Si la hiciera el separador, cada call site tendría que
          acordarse de un número que no es suyo.
        </Footnote>
      </Section>

      <Section
        title="Adentro de un Popover"
        note="El Menu es la caja y el Popover el comportamiento: uno no sabe abrirse y el otro no dibuja nada. Por eso se arman juntos y por eso cualquiera de los dos sirve solo: un menú se puede mostrar quieto, como acá arriba, y un Popover puede llevar adentro algo que no es un menú."
      >
        <Panel>
          <Variant name="abrí y probá Escape">
            <Popover
              align="start"
              trigger={({ ref, ...rest }) => (
                <Button ref={ref} {...rest} variant="muted" iconEnd={<Icon name="keyboard_arrow_down" />}>
                  Acciones
                </Button>
              )}
            >
              {close => (
                <Menu label="Acciones de la fila" width={240}>
                  <Menu.Item icon="edit" onSelect={close}>Editar<Menu.Shortcut>E</Menu.Shortcut></Menu.Item>
                  <Menu.Item icon="link" onSelect={close}>Copiar enlace<Menu.Shortcut>⌘L</Menu.Shortcut></Menu.Item>
                  <Divider />
                  <Menu.Item icon="delete" danger onSelect={close}>Eliminar</Menu.Item>
                </Menu>
              )}
            </Popover>
          </Variant>
        </Panel>
        <Footnote>
          Sin <Mono>width</Mono> el Popover mide el panel ya montado para alinearlo y para que
          entre en la ventana. Y si abajo del disparador no hay lugar y arriba sí, el panel sube
          solo.
        </Footnote>
      </Section>

      <Section title="Props">
        <Props of="Menu" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'role="menu" con menuitem, y las opciones que se marcan son menuitemradio con aria-checked.',
          'Las flechas recorren las opciones y dan la vuelta; Home y End van a los extremos, y las dos saltean lo apagado. Un `role="menu"` promete eso y hay que cumplirlo.',
          'El rótulo de grupo va como presentation: no es una fila que se pueda enfocar.',
          'Lo peligroso va en el rojo de tinta, no en el del relleno: sobre el papel, el relleno no llega a AA.',
          'Escape cierra solo el menú, no lo que haya detrás.',
        ]} />
      </Section>
    </Page>
  )
}
