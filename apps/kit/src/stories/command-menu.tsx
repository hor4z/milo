import { useState } from 'react'
import { CommandMenu, Kbd, type CommandGroup, type CommandItem } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

const bloques: CommandGroup[] = [
  {
    label: 'Texto',
    items: [
      { id: 'h1', label: 'Título', hint: 'Abre una sección', icon: 'format_h1', shortcut: '#' },
      { id: 'h2', label: 'Subtítulo', hint: 'Divide una sección', icon: 'format_h2', shortcut: '##' },
      { id: 'quote', label: 'Cita', icon: 'format_quote', keywords: ['comilla', 'textual'] },
      { id: 'callout', label: 'Bloque destacado', hint: 'Una pista, algo para recordar', icon: 'lightbulb', keywords: ['callout', 'aviso'] },
    ],
  },
  {
    label: 'Listas',
    items: [
      { id: 'ul', label: 'Lista', icon: 'format_list_bulleted', shortcut: '-' },
      { id: 'ol', label: 'Lista numerada', icon: 'format_list_numbered', shortcut: '1.' },
      { id: 'todo', label: 'Lista de tareas', hint: 'Con casillas para marcar', icon: 'checklist' },
    ],
  },
  {
    label: 'Material',
    items: [
      { id: 'img', label: 'Imagen', icon: 'image', keywords: ['foto', 'dibujo'] },
      { id: 'video', label: 'Video', icon: 'videocam' },
      { id: 'audio', label: 'Audio', hint: 'Una consigna grabada', icon: 'mic', keywords: ['grabación', 'voz'] },
      { id: 'table', label: 'Tabla', icon: 'table_rows' },
      { id: 'formula', label: 'Fórmula', hint: 'Matemática en línea o en bloque', icon: 'functions', keywords: ['ecuación', 'latex'] },
      { id: 'chart', label: 'Gráfico', icon: 'bar_chart', keywords: ['datos', 'curva'] },
      { id: 'divider', label: 'Separador', icon: 'horizontal_rule' },
      { id: 'embed', label: 'Simulación', hint: 'Todavía no', icon: 'science', disabled: true },
    ],
  },
]

export function CommandMenuStory() {
  const [ultimo, setUltimo] = useState<CommandItem | null>(null)

  return (
    <Page
      title="CommandMenu"
      kind="Editor"
      imports="import { CommandMenu } from '@milo/ui'"
      lead="La lista de comandos: se escribe, se filtra y se elige con las flechas. Es el menú que abre la barra en un editor, y la paleta de atajos de una app."
    >
      <Section
        title="La pieza"
        note="Probá las flechas, Home y End, y escribí «foto» para ver que Imagen aparece sin que la palabra esté en su nombre."
      >
        <div className="flex flex-col items-start gap-3">
          <CommandMenu groups={bloques} onSelect={setUltimo} className="w-full max-w-[380px]" />
          <p className="text-meta text-ink-muted">
            {ultimo ? <>Elegiste <strong className="font-semibold text-ink">{ultimo.label}</strong>.</> : 'Elegí uno para ver qué devuelve.'}
          </p>
        </div>
      </Section>

      <Section
        title="Sin buscador"
        note="Para cuando lo que se escribe ya está afuera: en un editor, el texto va detrás de la barra y el menú solo filtra."
      >
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3 text-reading text-ink">
            <span className="text-ink-muted">Escribí</span>
            <Kbd>/</Kbd>
            <span className="text-ink-muted">y después</span>
            <span className="font-mono text-body">lis</span>
          </div>
          <CommandMenu groups={bloques} onSelect={setUltimo} search={false} query="lis" className="w-full max-w-[380px]" />
        </div>
      </Section>

      <Note title="Esto no abre nada">
        La pieza es la lista y nada más: no se posiciona sola ni se cierra sola. Adentro de un
        `Popover` queda anclada a la barra; adentro de un `Modal` es la paleta de la app. Separarlo
        es lo que deja usar la misma lista en los dos lados.
      </Note>

      <Props of={['CommandMenu', 'CommandGroup', 'CommandItem']} />

      <A11y
        items={[
          'El buscador es un `combobox` y la lista un `listbox`. Lo marcado viaja por `aria-activedescendant`, así que el foco no se mueve y lo que se escribe sigue llegando al campo.',
          'Flechas para moverse, Home y End para los extremos, Enter para elegir. Lo apagado se saltea.',
          'Al cambiar lo buscado, la marca vuelve al primero: dejarla donde estaba marca algo que ya no se está mirando.',
          'Un grupo que se queda sin resultados no deja su encabezado solo, y cuando no queda nada se dice con palabras.',
        ]}
      />
    </Page>
  )
}
