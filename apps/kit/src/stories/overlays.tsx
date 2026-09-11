import { useState } from 'react'
import { Button, Dropdown, Modal, Popover } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function DropdownStory() {
  return (
    <Section
      title="Dropdown"
      note="Un menú de cuatro items. No lleva velo: el velo va para lo que pide leerse entero, y un menú corto no lo pide. Cierra con Escape, que usa una pila global — cierra el overlay de arriba y no todos."
    >
      <Block label="Vivo" note="El disparador va como render prop porque el Dropdown necesita su ref para medir dónde abrir. Desde que `Button` acepta ref, el disparador puede ser el botón del sistema y no un <button> crudo repitiendo las clases.">
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="align end · width 220">
            <Dropdown
              width={220}
              items={[
                { label: 'Mi perfil', icon: 'user' },
                { label: 'Plan', icon: 'card' },
                { label: 'Ajustes', icon: 'sliders' },
                { label: 'Salir', icon: 'logout' },
              ]}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised" iconEnd="chevronDown">Abrir menú</Button>
              )}
            />
          </Demo>
          <Demo label="align start">
            <Dropdown
              align="start"
              width={200}
              items={[{ label: 'Duplicar', icon: 'copy' }, { label: 'Descargar', icon: 'download' }, { label: 'Eliminar', icon: 'trash' }]}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised" icon="more">Acciones</Button>
              )}
            />
          </Demo>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'items', type: '{ label, icon?, onSelect? }[]', note: 'obligatorio' },
          { name: 'trigger', type: '(props) => ReactNode', note: 'obligatorio: recibe onClick, ref y aria-expanded' },
          { name: 'align', type: "'start' | 'end'", def: "'end'" },
          { name: 'width', type: 'number', def: '220' },
        ]} />
      </Block>
    </Section>
  )
}

export function PopoverStory() {
  return (
    <Section
      title="Popover"
      note="El panel anclado. Cierra con `pointerdown` y no con `click`: con click, el mismo gesto que abre otro panel lo cierra y lo reabre, y parpadea. Y el scroll de la página lo cierra, pero el de su propio contenido no — el listener va en captura y se filtra por origen."
    >
      <Block label="Vivo" note="Con `veil`, el resto de la pantalla se apaga. El velo va sin blur: el fondo se sigue reconociendo, que es lo que te dice de dónde salió el panel.">
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="sin velo">
            <Popover
              width={320}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised">Panel anclado</Button>
              )}
            >
              {close => (
                <div className="p-4">
                  <div className="text-xs font-semibold">Un panel de 320</div>
                  <p className="mt-2 text-2xs text-ink-muted">
                    Cierra con Escape, con un click afuera, o al scrollear la página — pero no al
                    scrollear su propio contenido. Un resize sí lo cierra siempre.
                  </p>
                  <div className="mt-4"><Button size="sm" variant="raised" onClick={close}>Cerrar</Button></div>
                </div>
              )}
            </Popover>
          </Demo>

          <Demo label="veil">
            <Popover
              width={340}
              veil
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised">Con velo</Button>
              )}
            >
              {close => (
                <div className="p-4">
                  <div className="text-xs font-semibold">Una lista que pide leerse entera</div>
                  <p className="mt-2 text-2xs text-ink-muted">
                    El resto de la pantalla se atenúa para ganar la mirada. Un menú de cuatro items
                    no necesita esto.
                  </p>
                  <div className="mt-4"><Button size="sm" variant="raised" onClick={close}>Cerrar</Button></div>
                </div>
              )}
            </Popover>
          </Demo>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'trigger', type: '(props) => ReactNode', note: 'obligatorio: recibe onClick, ref, aria-expanded y data-open' },
          { name: 'children', type: '(close: () => void) => ReactNode', note: 'obligatorio: recibe el cierre' },
          { name: 'veil', type: 'boolean', note: 'atenúa el resto de la pantalla' },
          { name: 'align', type: "'start' | 'end'", def: "'end'" },
          { name: 'width', type: 'number', def: '384' },
          { name: 'offset', type: 'number', def: '8' },
        ]} />
      </Block>
    </Section>
  )
}

export function ModalStory() {
  const [open, setOpen] = useState(false)
  const [angosto, setAngosto] = useState(false)

  return (
    <Section
      title="Modal"
      note="El backdrop es blur de 3px más una capa muy tenue (14%), no un negro al 50%: el contexto de abajo se sigue leyendo y el modal no se siente un cambio de página. El bloqueo de scroll compensa el ancho de la scrollbar, porque sin eso la página salta a la derecha justo al abrir."
    >
      <Block
        label="Vivo"
        note="Se enfoca el contenedor del diálogo y no su primer control: el navegador scrollea para traer a la vista lo que enfoca, así que enfocar «el primero enfocable» abría el panel corrido 39px con la primera fila tapada. Para el caso que sí quiere un campo —la paleta de comandos— hay un `[data-autofocus]`."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 620">
            <Button variant="raised" onClick={() => setOpen(true)}>Abrir modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} label="Ejemplo" width={620}>
              <div className="p-6">
                <div className="text-lg font-medium">Un modal de 620</div>
                <p className="mt-2 max-w-[52ch] text-xs font-medium text-ink-muted">
                  Probá Escape, y probá hacer scroll en la página de atrás: está bloqueado, y no hay
                  salto lateral al abrir.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button variant="solid" onClick={() => setOpen(false)}>Entendido</Button>
                </div>
              </div>
            </Modal>
          </Demo>

          <Demo label="width 420">
            <Button variant="raised" onClick={() => setAngosto(true)}>Confirmación</Button>
            <Modal open={angosto} onClose={() => setAngosto(false)} label="Confirmar" width={420}>
              <div className="p-6">
                <div className="text-base font-semibold">¿Eliminar la actividad?</div>
                <p className="mt-2 text-xs font-medium text-ink-muted">Se va a borrar para todo el equipo.</p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setAngosto(false)}>Cancelar</Button>
                  <Button variant="bad" size="sm" onClick={() => setAngosto(false)}>Eliminar</Button>
                </div>
              </div>
            </Modal>
          </Demo>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'open', type: 'boolean', note: 'obligatorio' },
          { name: 'onClose', type: '() => void', note: 'obligatorio: lo llaman Escape y el click en el backdrop' },
          { name: 'label', type: 'string', note: 'obligatorio: el aria-label del role="dialog"' },
          { name: 'width', type: 'number', def: '620' },
        ]} />
      </Block>
    </Section>
  )
}
