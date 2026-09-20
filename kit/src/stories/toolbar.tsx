import s from './toolbar.module.css'
import { useState } from 'react'
import { Toolbar } from '@milo/ui/toolbar'
import { A11y, Page, Practices, Props, Section } from '../kit'

export function ToolbarStory() {
  const [format, setFormat] = useState({ bold: true, italic: false, underline: false })
  const toggle = (k: keyof typeof format) => setFormat(f => ({ ...f, [k]: !f[k] }))

  return (
    <Page
      title="Toolbar"
      kind="Editor"
      imports="import { Toolbar } from '@milo/ui/toolbar'"
      lead="La barra que aparece sobre el texto seleccionado. Una sola parada de tabulación, y adentro se mueve con flechas."
    >
      <Section title="La pieza">
        <div className={s.pieceBox}>
          <Toolbar label="Formato del texto">
            <Toolbar.Button icon="format_bold" label="Negrita" pressed={format.bold} onClick={() => toggle('bold')} />
            <Toolbar.Button icon="format_italic" label="Cursiva" pressed={format.italic} onClick={() => toggle('italic')} />
            <Toolbar.Button icon="format_underlined" label="Subrayado" pressed={format.underline} onClick={() => toggle('underline')} />
            <Toolbar.Separator />
            <Toolbar.Button icon="format_h1" label="Título" />
            <Toolbar.Button icon="format_h2" label="Subtítulo" />
            <Toolbar.Button icon="format_quote" label="Cita" />
            <Toolbar.Separator />
            <Toolbar.Button icon="link" label="Enlace" />
            <Toolbar.Button icon="functions" label="Fórmula" />
            <Toolbar.Button icon="delete" label="Borrar el bloque" disabled />
          </Toolbar>
        </div>
      </Section>

      <Section
        title="Interruptor o acción"
        note="Con `pressed` el botón es un interruptor y queda marcado; sin él es algo que pasa y no queda. La diferencia se anuncia: 'negrita, activado' contra 'enlace, botón'."
      >
        <div className={s.toggleBox}>
          <Toolbar label="Dos clases de botón">
            <Toolbar.Button icon="format_bold" label="Negrita" pressed={format.bold} onClick={() => toggle('bold')} />
            <Toolbar.Button icon="content_copy" label="Duplicar" />
          </Toolbar>
        </div>
      </Section>

      <Props of="Toolbar" />

      <Practices>
        <Practices.Do>`label` dice qué controla: dos barras sin nombre en una pantalla se leen igual.</Practices.Do>
        <Practices.Do>Con `pressed` el botón es un interruptor; sin él, una acción que pasa y no queda.</Practices.Do>
      </Practices>

      <A11y>
        <A11y.Item>Es un `toolbar` de verdad: se entra con una sola tabulación y adentro se recorre con las flechas. Con diez botones, llegar a lo de al lado costaría diez tabulaciones.</A11y.Item>
        <A11y.Item>Home y End van a los extremos, y las flechas dan la vuelta salteando lo apagado.</A11y.Item>
        <A11y.Item>Cada botón tiene nombre: adentro solo hay un glifo, y un glifo no se lee.</A11y.Item>
        <A11y.Item>La barra lleva nombre propio. Dos barras sin nombre en una pantalla se leen como una sola.</A11y.Item>
      </A11y>
    </Page>
  )
}
