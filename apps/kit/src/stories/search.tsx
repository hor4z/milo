import { useState } from 'react'
import { Search } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function SearchStory() {
  const [uno, setUno] = useState('')
  const [dos, setDos] = useState('fracciones')
  const [tres, setTres] = useState('')
  const [atajo, setAtajo] = useState('')
  const [vacio, setVacio] = useState('')
  const [lleno, setLleno] = useState('6.º B')

  return (
    <Page
      title="Search"
      kind="Formularios"
      lead="Un campo con la lupa y una cruz que aparece cuando hay algo escrito. Es un `TextField` por dentro y no un campo aparte: se dibuja igual que los otros y hereda su inversión contra el fondo."
      imports="import { Search } from '@milo/ui'"
    >
      <Section
        title="Las tres alturas"
        note="Las mismas del `Button` y del `TextField`. `sm` en la barra de una tabla, `md` en la de una pantalla, `lg` cuando el buscador **es** la pantalla."
      >
        <Panel>
          <Variant name="sm"><Search size="sm" value={uno} onValueChange={setUno} placeholder="Buscar una actividad" /></Variant>
          <Variant name="md"><Search size="md" value={tres} onValueChange={setTres} placeholder="Buscar una actividad" /></Variant>
          <Variant name="con texto"><Search size="md" value={dos} onValueChange={setDos} /></Variant>
          <Variant name="con atajo"><Search size="md" value={atajo} onValueChange={setAtajo} shortcut="/" placeholder="Buscar" /></Variant>
        </Panel>
      </Section>

      <Section
        title="El atajo y la cruz ocupan el mismo lugar"
        note="Y eso es a propósito: mientras está vacío, lo que hace falta saber es cómo llegar; una vez que hay algo escrito, lo que hace falta es cómo salir. Nunca se necesitan los dos a la vez, así que no compiten por el espacio. Escribí en el primero y borrá el segundo."
      >
        <Panel>
          <Variant name="vacío · el atajo"><Search value={vacio} onValueChange={setVacio} shortcut="/" /></Variant>
          <Variant name="con texto · la cruz"><Search value={lleno} onValueChange={setLleno} shortcut="/" /></Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Search" />
      </Section>

      <A11y
        items={[
          'La cruz devuelve el foco al campo al vaciarlo: se desmonta al desaparecer, y sin eso el foco se cae al `<body>`.',
          'El atajo es un recordatorio y no la tecla: quien pone el buscador escucha el evento, así que el campo no se apropia de una tecla global.',
          '`ref` va al `input` y no al contenedor — es lo que un atajo necesita para enfocarlo desde afuera.',
          'El campo se nombra con `aria-label` o con un `Field` alrededor: un placeholder desaparece al escribir y deja de nombrar nada.',
        ]}
      />
    </Page>
  )
}
