import { useState } from 'react'
import { CompareTable } from '@milo/ui/compare-table'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const frentes = [
  { id: 'producto', label: 'Producto' },
  { id: 'precio', label: 'Precio' },
  { id: 'publico', label: 'Público' },
  { id: 'venta', label: 'Forma de venta' },
]

const competidores = [
  { id: 'mio', label: 'El tuyo' },
  { id: 'uno', label: 'Competidor 1' },
  { id: 'dos', label: 'Competidor 2' },
]

const cargado = {
  producto: { mio: 'Tortas por encargo', uno: 'Tortas y budines', dos: 'Solo budines' },
  precio: { mio: '$4.000', uno: '$5.200', dos: '$2.800' },
}

export function CompareTableStory() {
  const [value, setValue] = useState<Record<string, Record<string, string>>>(cargado)

  return (
    <Page
      title="CompareTable"
      kind="Datos"
      imports="import { CompareTable } from '@milo/ui/compare-table'"
      lead="Un cuadro comparativo que se completa: dos o tres cosas en las columnas, en qué se las mira en los renglones. La grilla es de quien arma la consigna y las celdas son de quien la resuelve."
    >
      <Section
        title="Cómo se arma"
        note="Las columnas y los renglones entran como dato, así que dos entregas del mismo curso se pueden leer una al lado de la otra. Si cada uno eligiera en qué comparar, no habría comparación: habría cuatro textos."
      >
        <Panel>
          <Variant name="completándolo" note="Cada celda es un campo de dos renglones que crece hasta cuatro: entra una frase, no un párrafo.">
            <Stack width="md">
              <CompareTable
                rows={frentes}
                columns={competidores}
                value={value}
                onChange={(f, c, t) => setValue(v => ({ ...v, [f]: { ...v[f], [c]: t } }))}
              >
                <CompareTable.Prompt>Contra quién competís</CompareTable.Prompt>
                <CompareTable.Hint>Reales: con nombre, y con el precio que cobran de verdad.</CompareTable.Hint>
              </CompareTable>
            </Stack>
          </Variant>
          <Variant name="ya entregado" note="Una celda vacía lo dice: en un cuadro, el blanco no se distingue de lo que nadie miró.">
            <Stack width="md">
              <CompareTable rows={frentes} columns={competidores} value={cargado}>
                <CompareTable.Prompt>Contra quién competís</CompareTable.Prompt>
              </CompareTable>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Con una sola columna deja de ser un cuadro comparativo y pasa a ser una lista de preguntas
          cortas, que también sirve: los renglones son las preguntas y la columna es la respuesta.
          Es la misma pieza porque es la misma grilla.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<CompareTable
  rows={frentes}
  columns={competidores}
  value={cuadro}
  onChange={(fila, columna, texto) => guardar(fila, columna, texto)}
>
  <CompareTable.Prompt>Contra quién competís</CompareTable.Prompt>
</CompareTable>`} />
      </Section>

      <Section title="Props">
        <Props of="CompareTable" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Poné dos o tres columnas: con cuatro el cuadro se lee de costado y la comparación se pierde en el scroll.</Practices.Do>
          <Practices.Do>Escribí los renglones como aquello en lo que se comparan, no como preguntas sueltas: "Precio" y no "¿Cuánto sale el de ellos?".</Practices.Do>
          <Practices.Dont>No lo uses para texto largo: cada celda entra en una frase, y una celda de ocho renglones rompe la fila entera.</Practices.Dont>
          <Practices.Dont>No dejes que el que responde agregue columnas: dos cuadros con distintas columnas no se comparan entre sí.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Cada celda dice qué cruce es: "Precio de Competidor 1". Sin eso son doce cuadros de texto iguales.</A11y.Item>
          <A11y.Item>La primera columna son encabezados de fila, así que recorrer el cuadro dice en qué renglón estás parado.</A11y.Item>
          <A11y.Item>Leyendo, una celda vacía dice "Sin completar" en vez de no decir nada.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
