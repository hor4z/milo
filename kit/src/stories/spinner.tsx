import cls from './spinner.module.css'
import { Button } from '@milo/ui/button'
import { Spinner } from '@milo/ui/spinner'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function SpinnerStory() {
  return (
    <Page
      title="Spinner"
      kind="Avisos"
      imports="import { Spinner } from '@milo/ui/spinner'"
      lead="Pista completa más un arco encima, los dos del mismo grosor. La pista no es decorativa: sin ella, un arco suelto girando no dice 'esperá', dice que falta un trozo de la interfaz. El arco es de largo fijo y lo único que pasa es que gira, parejo."
    >
      <Section
        title="Tamaños"
        note="El trazo crece con el diámetro, así que el mismo spinner se lee igual adentro de un botón chico que en el medio de una pantalla."
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
        note="El arco va en el azul y no en tinta: lo único que se mueve conviene que se distinga también por el color. Adentro de un botón oscuro hay que pasarle `on=&quot;solid&quot;`, o el filo blanco se ve como un halo."
      >
        <Panel>
          <Variant name="en un botón">
            <Button variant="solid" aria-busy><Spinner size={16} on="solid" />Guardando</Button>
            <Button variant="muted" aria-busy><Spinner size={16} />Guardando</Button>
          </Variant>
          <Variant name="en una fila">
            <span className={cls.inlineWait}>
              <Spinner size={16} />
              Buscando en siete espacios
            </span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<Spinner label="Cargando las entregas" />

<Button loading>Guardar</Button>`} />
      </Section>

      <Section title="Props">
        <Props of="Spinner" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Adentro de un control va `on="control"`, que pinta el hueco del color del relleno.</Practices.Do>
          <Practices.Dont>Para una pantalla entera va un `Skeleton`: el girador no dice qué está por venir.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Lleva role="status" y un nombre, así que un lector dice qué está cargando.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
