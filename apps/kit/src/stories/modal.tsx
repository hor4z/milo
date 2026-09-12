import { useState } from 'react'
import { Button, Modal, SettingsModal } from '@milo/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function ModalStory() {
  const [open, setOpen] = useState(false)
  const [narrowOpen, setNarrowOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <Page
      title="Modal"
      lead="El backdrop es blur de 3px más una capa muy tenue (14%), no un negro al 50%: el contexto de abajo se sigue leyendo y el modal no se siente un cambio de página. El bloqueo de scroll compensa el ancho de la scrollbar, porque sin eso la página salta a la derecha justo al abrir."
      kind="Superficies"
      imports="import { Modal } from '@milo/ui'"
    >
      <Section
        title="Vivo"
        note="Se enfoca el contenedor del diálogo y no su primer control: el navegador scrollea para traer a la vista lo que enfoca, así que enfocar «el primero enfocable» abría el panel corrido 39px con la primera fila tapada. Para el caso que sí quiere un campo —la paleta de comandos— hay un `[data-autofocus]`."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 620">
            <Button variant="raised" onClick={() => setOpen(true)}>Abrir modal</Button>
            <Modal open={open} onClose={() => setOpen(false)} label="Ejemplo" width={620}>
              <div className="p-6">
                <div className="text-title font-medium">Un modal de 620</div>
                <p className="mt-2 max-w-[52ch] text-body font-medium text-ink-muted">
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
            <Button variant="raised" onClick={() => setNarrowOpen(true)}>Confirmación</Button>
            <Modal open={narrowOpen} onClose={() => setNarrowOpen(false)} label="Confirmar" width={420}>
              <div className="p-6">
                <div className="text-reading font-semibold">¿Eliminar la actividad?</div>
                <p className="mt-2 text-body font-medium text-ink-muted">Se va a borrar para todo el equipo.</p>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setNarrowOpen(false)}>Cancelar</Button>
                  <Button variant="bad" size="sm" onClick={() => setNarrowOpen(false)}>Eliminar</Button>
                </div>
              </div>
            </Modal>
          </Demo>
        </div>
      </Section>

      <Section
        title="El caso real: los ajustes"
        note="El mismo modal que usa la app, no una maqueta: rail de 180 que no scrollea + panel que sí. Si scrollean los dos, al bajar en una sección larga desaparecen las secciones y no sabés dónde estás. Los ajustes van en un modal y no en una página porque lo que importa es no perder el contexto — al cerrar no hay navegación, seguís donde estabas y con el scroll donde lo dejaste, y por eso el fondo se atenúa apenas en vez de lavarse."
      >
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="width 594">
            <Button variant="raised" icon="tune" onClick={() => setSettingsOpen(true)}>Ajustes</Button>
            <SettingsModal
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              user={{
                name: 'Ana Pérez',
                email: 'ana.perez@ejemplo.edu',
                alias: 'Profe Ana',
                school: 'Escuela N.º 12 · Distrito 7',
              }}
            />
          </Demo>
        </div>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          Vive en el paquete y no en la app por la misma regla que deja al shell afuera: no lee
          `data.ts` ni el router. Lo único que necesita son las preferencias —que ya viven acá— y
          quién está mirando, que va por prop: el nombre y el correo de una persona real no son
          parte de un design system. Adentro hay un Select, que abre un flotante adentro de otro
          flotante: probalo, el listbox queda arriba del modal sin que nadie escriba un z-index.
        </p>
      </Section>

      <Section title="Props">
        <Props of="Modal" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'role="dialog" con aria-modal y su nombre.',
          'Atrapa el foco mientras está abierto y lo devuelve al cerrarse.',
          'Se enfoca el contenedor y no el primer control: el navegador scrollea a lo que enfoca, y eso abría el panel corrido.',
          'Bloquea el scroll de la página compensando el ancho de la barra, así que nada salta al abrir.',
        ]} />
      </Section>
    </Page>
  )
}
