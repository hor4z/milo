import { CopyButton } from '@milo/ui/copy-button'
import { TextField } from '@milo/ui/text-field'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function CopyButtonStory() {
  return (
    <Page
      title="CopyButton"
      kind="Acciones"
      imports="import { CopyButton } from '@milo/ui/copy-button'
import { TextField } from '@milo/ui/text-field'"
      lead="Copiar un texto al portapapeles, con el tilde que avisa que salió bien."
    >
      <Section
        title="La pieza"
        note="El tilde dura un rato y vuelve solo. Si el navegador no deja copiar (sin permiso, sin contexto seguro) el botón no miente: se queda diciendo Copiar."
      >
        <Panel>
          <Variant name="sm · md · lg" note="Los tres pasos del resto de los controles.">
            <CopyButton size="sm" value="npm install @milo/ui" />
            <CopyButton value="npm install @milo/ui" />
            <CopyButton size="lg" value="npm install @milo/ui" />
          </Variant>
          <Variant name="adentro del campo" note="El caso más común: un enlace para compartir, que se lee y se copia sin seleccionarlo a mano.">
            <TextField
              readOnly
              value="https://milo.escuela/act/fracciones-equivalentes"
              aria-label="Enlace para compartir"
              suffix={<CopyButton size="sm" value="https://milo.escuela/act/fracciones-equivalentes" label="Copiar el enlace" />}
            />
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<CopyButton value="npm install @milo/ui" label="Copiar el comando" />`} />
      </Section>

      <Section title="Props">
        <Props of="CopyButton" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Ponelo al lado de lo que se copia, no lejos.</Practices.Do>
          <Practices.Dont>No supongas que copió: si el navegador no deja, la pieza no miente y tampoco tenés que mentir vos.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El nombre del botón cambia a "Copiado", así que el estado no depende solo del glifo.</A11y.Item>
          <A11y.Item>Además lo anuncia por la región viva: un cambio de icono no lo ve quien escucha la pantalla.</A11y.Item>
          <A11y.Item>Si copiar falla, no se anuncia nada y el nombre no cambia.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
