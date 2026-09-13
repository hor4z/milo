import cls from './spinner.module.css'
import { Button, Spinner } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function SpinnerStory() {
  return (
    <Page
      title="Spinner"
      kind="Avisos"
      imports="import { Spinner } from '@milo/ui'"
      lead="Pista completa más un arco encima, los dos del mismo grosor. La pista no es decorativa: sin ella, un arco suelto girando no dice 'esperá', dice que falta un trozo de la interfaz. El arco es de largo fijo y lo único que pasa es que gira, parejo."
    >
      <Section
        title="Tamaños"
        note="El trazo escala: es el 17% del diámetro a cualquier tamaño. Con el trazo fijo, el de 44 quedaba en 3 sobre 44 (un hilo) al lado del de 20 en 3 sobre 20. Abajo de 12 hay un piso de 2px, para que no caiga en el medio píxel y el antialias lo apague."
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
            <Button variant="raised" aria-busy><Spinner size={16} />Guardando</Button>
          </Variant>
          <Variant name="en una fila">
            <span className={cls.span}>
              <Spinner size={16} />
              Buscando en siete espacios
            </span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Spinner" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Lleva role="status" y un nombre, así que un lector dice qué está cargando.',
        ]} />
      </Section>
    </Page>
  )
}
