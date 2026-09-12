import { Button, Popover } from '@milo/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function PopoverStory() {
  return (
    <Page
      title="Popover"
      lead="El panel anclado. Cierra con `pointerdown` y no con `click`: con click, el mismo gesto que abre otro panel lo cierra y lo reabre, y parpadea. Y el scroll de la página lo cierra, pero el de su propio contenido no — el listener va en captura y se filtra por origen."
      kind="Superficies"
      imports="import { Popover } from '@milo/ui'"
    >
      <Section title="Vivo" note="Con `veil`, el resto de la pantalla se apaga. El velo va sin blur: el fondo se sigue reconociendo, que es lo que te dice de dónde salió el panel.">
        <div className="flex flex-wrap items-start gap-3">
          <Demo label="sin velo">
            <Popover
              width={320}
              trigger={({ onClick, ref, ...rest }) => (
                <Button ref={ref} onClick={onClick} {...rest} variant="raised">Panel anclado</Button>
              )}
            >
              {close => (
                <div className="ui-pop rounded-xl border border-line bg-popover p-4 shadow-popover">
                  <div className="text-body font-semibold">Un panel de 320</div>
                  <p className="mt-2 text-meta text-ink-muted">
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
                  <div className="text-body font-semibold">Una lista que pide leerse entera</div>
                  <p className="mt-2 text-meta text-ink-muted">
                    El resto de la pantalla se atenúa para ganar la mirada. Un menú de cuatro items
                    no necesita esto.
                  </p>
                  <div className="mt-4"><Button size="sm" variant="raised" onClick={close}>Cerrar</Button></div>
                </div>
              )}
            </Popover>
          </Demo>
        </div>
      </Section>

      <Section title="Props">
        <Props of="Popover" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'El disparador declara aria-expanded, así que se anuncia si está abierto.',
          'Escape cierra el de arriba y no todos.',
          'El scroll de la página lo cierra; el de su propio contenido, no.',
        ]} />
      </Section>
    </Page>
  )
}
