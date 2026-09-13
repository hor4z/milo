import { useState } from 'react'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '@milo/ui'
import { A11y, Page, Props, Section } from '../kit'

export function ToolbarStory() {
  const [formato, setFormato] = useState({ bold: true, italic: false, underline: false })
  const alternar = (k: keyof typeof formato) => setFormato(f => ({ ...f, [k]: !f[k] }))

  return (
    <Page
      title="Toolbar"
      kind="Editor"
      imports="import { Toolbar, ToolbarButton, ToolbarSeparator } from '@milo/ui'"
      lead="La barra que aparece sobre el texto seleccionado. Una sola parada de tabulación, y adentro se mueve con flechas."
    >
      <Section title="La pieza">
        <div className="flex justify-center rounded-xl border border-line bg-sunken p-8">
          <Toolbar label="Formato del texto">
            <ToolbarButton icon="format_bold" label="Negrita" pressed={formato.bold} onClick={() => alternar('bold')} />
            <ToolbarButton icon="format_italic" label="Cursiva" pressed={formato.italic} onClick={() => alternar('italic')} />
            <ToolbarButton icon="format_underlined" label="Subrayado" pressed={formato.underline} onClick={() => alternar('underline')} />
            <ToolbarSeparator />
            <ToolbarButton icon="format_h1" label="Título" />
            <ToolbarButton icon="format_h2" label="Subtítulo" />
            <ToolbarButton icon="format_quote" label="Cita" />
            <ToolbarSeparator />
            <ToolbarButton icon="link" label="Enlace" />
            <ToolbarButton icon="functions" label="Fórmula" />
            <ToolbarButton icon="delete" label="Borrar el bloque" disabled />
          </Toolbar>
        </div>
      </Section>

      <Section
        title="Interruptor o acción"
        note="Con `pressed` el botón es un interruptor y queda marcado; sin él es algo que pasa y no queda. La diferencia se anuncia: «negrita, activado» contra «enlace, botón»."
      >
        <div className="flex justify-center rounded-xl border border-line bg-sunken p-8">
          <Toolbar label="Dos clases de botón">
            <ToolbarButton icon="format_bold" label="Negrita" pressed={formato.bold} onClick={() => alternar('bold')} />
            <ToolbarButton icon="content_copy" label="Duplicar" />
          </Toolbar>
        </div>
      </Section>

      <Props of={['Toolbar', 'ToolbarButton']} />

      <A11y
        items={[
          'Es un `toolbar` de verdad: se entra con una sola tabulación y adentro se recorre con las flechas. Con diez botones, llegar a lo de al lado costaría diez tabulaciones.',
          'Home y End van a los extremos, y las flechas dan la vuelta salteando lo apagado.',
          'Cada botón tiene nombre: adentro solo hay un glifo, y un glifo no se lee.',
          'La barra lleva nombre propio. Dos barras sin nombre en una pantalla se leen como una sola.',
        ]}
      />
    </Page>
  )
}
