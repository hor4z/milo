import { CopyButton } from '@milo/ui/copy-button'
import { A11y, Canvas, Cluster, Example, Page, Props, Section, Variant } from '../kit'

export function CopyButtonStory() {
  return (
    <Page
      title="CopyButton"
      kind="Acciones"
      imports="import { CopyButton } from '@milo/ui/copy-button'"
      lead="Copiar un texto al portapapeles, con el tilde que avisa que salió bien."
    >
      <Section
        title="La pieza"
        note="El tilde dura un rato y vuelve solo. Si el navegador no deja copiar (sin permiso, sin contexto seguro) el botón no miente: se queda diciendo Copiar."
      >
        <Canvas>
          <Cluster>
            <Variant name="sm"><CopyButton size="sm" value="npm install @milo/ui" /></Variant>
            <Variant name="md"><CopyButton value="npm install @milo/ui" /></Variant>
            <Variant name="lg"><CopyButton size="lg" value="npm install @milo/ui" /></Variant>
          </Cluster>
        </Canvas>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<CopyButton value="npm install @milo/ui" label="Copiar el comando" />`} />
      </Section>

      <Section title="Props">
        <Props of="CopyButton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El nombre del botón cambia a "Copiado", así que el estado no depende solo del glifo.',
          'Además lo anuncia por la región viva: un cambio de icono no lo ve quien escucha la pantalla.',
          'Si copiar falla, no se anuncia nada y el nombre no cambia.',
        ]} />
      </Section>
    </Page>
  )
}
