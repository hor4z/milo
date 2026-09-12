import { useState } from 'react'
import { Button, Divider, Menu, MenuItem, MenuLabel, Popover } from '@milo/ui'
import { A11y, Mono, Page, Panel, Props, Section, Variant } from '../kit'

export function MenuStory() {
  const [view, setView] = useState<'grilla' | 'lista'>('grilla')

  return (
    <Page
      title="Menu"
      kind="Acciones"
      imports="import { Menu, MenuItem, MenuLabel } from '@milo/ui'"
      lead="Piezas que se arman, no una lista de opciones: un panel y filas que se escriben adentro. Es el mismo corte que la Table, y por el mismo motivo — la lista alcanza hasta el primer menú que necesita un separador, un rótulo de grupo o un atajo, y a partir de ahí cada necesidad nueva es una prop nueva en un objeto."
    >
      <Section
        title="La fila"
        note="40 de alto, radio 12 y el icono en gris a 20 — el texto va en tinta: al revés, con el texto apagado, el menú entero se lee como deshabilitado. A la derecha hay un solo lugar y cuatro cosas que pueden ocuparlo: el atajo, una línea de apoyo, el tilde o el chevron. Nunca dos, porque compiten por el mismo significado."
      >
        <Panel>
          <Variant name="suelta">
            <Menu width={260}>
              <MenuItem icon="edit">Renombrar</MenuItem>
              <MenuItem icon="content_copy" shortcut="⌘D">Duplicar</MenuItem>
              <MenuItem icon="group" hint="7">Compartir</MenuItem>
              <MenuItem icon="folder" submenu>Mover a</MenuItem>
            </Menu>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Rótulo, separador y opción destructiva"
        note="El rótulo va en tinta y no en gris, igual que la cabecera de la Table: en 11 con tracking abierto el tamaño ya dice que es un rótulo, y el gris encima obliga a buscar de qué es cada grupo. La opción destructiva es la única que cambia de color en todo el sistema, y por eso se ve; su icono no va en gris, porque el gris es lo que apaga y esto es lo contrario."
      >
        <Panel>
          <Variant name="armado entero">
            <Menu width={260}>
              <MenuLabel>Esta actividad</MenuLabel>
              <MenuItem icon="edit" shortcut="E">Editar</MenuItem>
              <MenuItem icon="visibility">Ver como estudiante</MenuItem>
              <Divider />
              <MenuLabel>Vista</MenuLabel>
              <MenuItem icon="grid_view" checked={view === 'grilla'} onSelect={() => setView('grilla')}>
                Grilla
              </MenuItem>
              <MenuItem icon="view_list" checked={view === 'lista'} onSelect={() => setView('lista')}>
                Lista
              </MenuItem>
              <Divider />
              <MenuItem icon="inventory_2" disabled>Archivar</MenuItem>
              <MenuItem icon="delete" danger>Eliminar</MenuItem>
            </Menu>
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          El separador se estira hasta el borde del panel, y esa cuenta la hace el panel porque es
          el que conoce su padding. Si la hiciera el separador, cada call site tendría que
          acordarse de un número que no es suyo.
        </p>
      </Section>

      <Section
        title="Adentro de un Popover"
        note="El Menu es la caja y el Popover el comportamiento: uno no sabe abrirse y el otro no dibuja nada. Por eso se arman juntos y por eso cualquiera de los dos sirve solo — un menú se puede mostrar quieto, como acá arriba, y un Popover puede llevar adentro algo que no es un menú."
      >
        <Panel>
          <Variant name="abrí y probá Escape">
            <Popover
              align="start"
              trigger={({ ref, ...rest }) => (
                <Button ref={ref} {...rest} variant="raised" iconEnd="keyboard_arrow_down">
                  Acciones
                </Button>
              )}
            >
              {close => (
                <Menu width={240}>
                  <MenuItem icon="edit" shortcut="E" onSelect={close}>Editar</MenuItem>
                  <MenuItem icon="link" shortcut="⌘L" onSelect={close}>Copiar enlace</MenuItem>
                  <Divider />
                  <MenuItem icon="delete" danger onSelect={close}>Eliminar</MenuItem>
                </Menu>
              )}
            </Popover>
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          Sin <Mono>width</Mono> el Popover mide el panel ya montado para alinearlo y para que
          entre en la ventana. Y si abajo del disparador no hay lugar y arriba sí, el panel sube
          solo.
        </p>
      </Section>

      <Section title="Props">
        <Props of={['Menu', 'MenuItem']} />
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
