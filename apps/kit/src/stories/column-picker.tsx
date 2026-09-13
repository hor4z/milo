import s from './column-picker.module.css'
import { useState } from 'react'
import { ColumnPicker } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

const columnas = [
  { id: 'actividad', label: 'Actividad', locked: true },
  { id: 'estudiantes', label: 'Estudiantes' },
  { id: 'docente', label: 'Docente' },
  { id: 'estado', label: 'Estado' },
  { id: 'entregas', label: 'Entregas' },
]

export function ColumnPickerStory() {
  const [value, setValue] = useState(['actividad', 'estudiantes', 'estado'])

  return (
    <Page
      title="ColumnPicker"
      kind="Datos"
      lead="Qué columnas de una tabla se ven. Vivía adentro de `filter/` y no tenía vista propia: una pieza que no se puede encontrar es una pieza que alguien vuelve a escribir a mano."
      imports="import { ColumnPicker } from '@milo/ui'"
    >
      <Section
        title="Cómo se usa"
        note="La primera columna va `locked`: una tabla sin la columna que nombra cada fila deja de ser una tabla. Lo apagado se queda a la vista y no desaparece: una opción que se esconde obliga a aprender el menú de nuevo."
      >
        <Panel>
          <Variant name="columnas">
            <ColumnPicker columns={columnas} value={value} onValueChange={setValue} />
          </Variant>
          <Variant name="lo elegido">
            <span className={s.span}>{value.join(' · ')}</span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="ColumnPicker" />
      </Section>

      <A11y
        items={[
          'Cada opción es un `checkbox` de verdad, así que se recorre y se marca con el teclado sin nada agregado.',
          'La columna bloqueada se anuncia como deshabilitada y sigue leyéndose: se entiende por qué no se puede sacar.',
          'El panel se cierra con Escape y el foco vuelve al botón que lo abrió.',
        ]}
      />
    </Page>
  )
}
