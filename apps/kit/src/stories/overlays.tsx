import { useState } from 'react'
import { Button, Dropdown, IconButton, Modal, Popover, SettingsModal, Tooltip } from '@melu/ui'
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
                /* El chrome lo pone el call site: `Popover` dejó de dibujar el
                   panel y ahora solo lo ubica. Sin esto el contenido queda
                   flotando sobre lo que haya atrás, sin fondo ni borde. */
                <div className="ui-pop rounded-xl border border-line bg-popover p-4 shadow-popover">
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
                <div className="ui-pop rounded-xl border border-line bg-popover p-4 shadow-popover">
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
          { name: 'children', type: '(close: () => void) => ReactNode', note: 'obligatorio: recibe el cierre. El panel lo dibuja el call site — fondo, borde, radio y sombra — porque Popover no tiene aspecto' },
          { name: 'veil', type: 'boolean', note: 'atenúa el resto de la pantalla' },
          { name: 'align', type: "'start' | 'end'", def: "'end'" },
          { name: 'width', type: 'number', note: 'sin esto se mide el ancho real del panel montado' },
          { name: 'offset', type: 'number', def: '8' },
        ]} />
      </Block>
    </Section>
  )
}


export function TooltipStory() {
  return (
    <Section
      title="Tooltip"
      note="La etiqueta que dice qué hace un control que no lo dice solo. No es un Popover chico: se abre solo —hover o foco de teclado—, no recibe el mouse (o taparía justo el botón que explica) y no lleva nada interactivo adentro. Si tiene un link o un botón, es un Popover."
    >
      <Block
        label="El retraso se comparte"
        note="El primero tarda medio segundo, porque un tooltip que aparece apenas el mouse pasa por encima salta solo mientras cruzás la pantalla. Pero una vez que uno se mostró, el de al lado abre al instante: con medio segundo cada uno, recorrer seis iconos son tres segundos de espera y la fila se siente trabada. Pasá el mouse por la fila entera y después salí un rato y volvé."
      >
        <div className="flex flex-wrap items-center gap-1">
          <Tooltip label="Buscar"><IconButton icon="search" label="Buscar" /></Tooltip>
          <Tooltip label="Duplicar"><IconButton icon="content_copy" label="Duplicar" /></Tooltip>
          <Tooltip label="Compartir"><IconButton icon="share" label="Compartir" /></Tooltip>
          <Tooltip label="Archivar"><IconButton icon="inventory_2" label="Archivar" /></Tooltip>
          <Tooltip label="Ajustes"><IconButton icon="tune" label="Ajustes" /></Tooltip>
          <Tooltip label="Más"><IconButton icon="more_horiz" label="Más" /></Tooltip>
        </div>
      </Block>

      <Block
        label="Con el teclado"
        note="Tabulá hasta el botón: el tooltip aparece igual. Pero solo cuando el foco es del teclado — con un onFocus pelado, clickear el botón deja el tooltip puesto encima de lo que acabás de tocar. Escape lo cierra, por la misma pila global que los otros overlays."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Demo label="en un botón con texto">
            <Tooltip label="Se publica para los siete espacios">
              <Button variant="solid">Publicar</Button>
            </Tooltip>
          </Demo>
          <Demo label="texto largo · se envuelve a 240">
            <Tooltip label="Una actividad archivada sale de la lista pero no se borra: queda en «Archivadas» y se puede restaurar.">
              <IconButton icon="inventory_2" label="Archivar" variant="raised" />
            </Tooltip>
          </Demo>
          <Demo label="abajo">
            <Tooltip side="bottom" label="Va abajo si entra">
              <IconButton icon="keyboard_arrow_down" label="Abajo" variant="raised" />
            </Tooltip>
          </Demo>
        </div>
      </Block>

      <Block
        label="Se da vuelta y no se sale"
        note="Contra el borde de arriba se va abajo, y contra el costado se pega a 8 del canto en vez de salirse. Un tooltip de un icono de la punta del sidebar se salía de la ventana."
      >
        <div className="flex items-center justify-between">
          <Tooltip label="Pegado al borde izquierdo de la ventana">
            <IconButton icon="chevron_left" label="Izquierda" variant="raised" />
          </Tooltip>
          <Tooltip label="Pegado al borde derecho de la ventana">
            <IconButton icon="chevron_right" label="Derecha" variant="raised" />
          </Tooltip>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'label', type: 'ReactNode', note: 'obligatorio; lo que dice la etiqueta' },
          { name: 'children', type: 'ReactNode', note: 'el control que explica; se envuelve, no se pide render prop' },
          { name: 'side', type: "'top' | 'bottom'", def: "'top'", note: 'si de ese lado no entra, se da vuelta' },
          { name: 'delay', type: 'number', def: '500', note: 'ms del primero; los siguientes abren en 0 dentro de una ventana de 400' },
        ]} />
      </Block>

      <Block
        label="Lo que no hace"
        note="En touch no aparece: no hay hover que lo abra ni forma de cerrarlo sin tocar otra cosa. Por eso lo que el tooltip diga tiene que estar también en el aria-label del control, y por eso no lleva información que no esté en otro lado. Para un lector de pantalla el control ya se nombra solo; el tooltip es la ayuda de quien ve el icono y no sabe qué hace."
      >
        <p className="max-w-[70ch] text-xs text-ink-muted">
          Queda un <code>title</code> nativo en el <code>Segmented</code> de solo iconos, que es la
          misma caja del sistema operativo que se le sacó al <code>IconButton</code>. Pasarlo a{' '}
          <code>Tooltip</code> ata <code>primitives</code> a <code>overlay</code>, que hoy importa
          al revés: es un movimiento de archivos, no una prop.
        </p>
      </Block>
    </Section>
  )
}

export function ModalStory() {
  const [open, setOpen] = useState(false)
  const [angosto, setAngosto] = useState(false)
  const [ajustes, setAjustes] = useState(false)

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

      <Block
        label="El caso real: los ajustes"
        note="El mismo modal que usa la app, no una maqueta: rail de 180 que no scrollea + panel que sí. Si scrollean los dos, al bajar en una sección larga desaparecen las secciones y no sabés dónde estás. Los ajustes van en un modal y no en una página porque lo que importa es no perder el contexto — al cerrar no hay navegación, seguís donde estabas y con el scroll donde lo dejaste, y por eso el fondo se atenúa apenas en vez de lavarse."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 594">
            <Button variant="raised" icon="tune" onClick={() => setAjustes(true)}>Ajustes</Button>
            <SettingsModal
              open={ajustes}
              onClose={() => setAjustes(false)}
              user={{
                name: 'Ana Pérez',
                email: 'ana.perez@ejemplo.edu',
                alias: 'Profe Ana',
                school: 'Escuela N.º 12 · Distrito 7',
              }}
            />
          </Demo>
        </div>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Vive en el paquete y no en la app por la misma regla que deja al shell afuera: no lee
          `data.ts` ni el router. Lo único que necesita son las preferencias —que ya viven acá— y
          quién está mirando, que va por prop: el nombre y el correo de una persona real no son
          parte de un design system. Adentro hay un Select, que abre un flotante adentro de otro
          flotante: probalo, el listbox queda arriba del modal sin que nadie escriba un z-index.
        </p>
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
