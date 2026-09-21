import { useState } from 'react'
import { SumTable, type SumCell } from '@milo/ui/sum-table'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const gastos = [
  { id: 'materia', label: 'Materia prima o productos' },
  { id: 'herramientas', label: 'Herramientas' },
  { id: 'packaging', label: 'Packaging' },
  { id: 'publicidad', label: 'Publicidad' },
]

const cargado: Record<string, SumCell> = {
  materia: { qty: '30', price: '2000' },
  herramientas: { qty: '1', price: '12000' },
  packaging: { qty: '30', price: '300' },
}

export function SumTableStory() {
  const [value, setValue] = useState<Record<string, SumCell>>(cargado)

  return (
    <Page
      title="SumTable"
      kind="Datos"
      imports="import { SumTable } from '@milo/ui/sum-table'"
      lead="Una tabla que se completa y se suma sola: un presupuesto, una lista de materiales, un costeo. El total no se escribe, y por eso no puede estar mal sumado."
    >
      <Section
        title="Cómo se arma"
        note="Los conceptos entran como dato y los pone quien arma la consigna; lo que se carga adentro es de quien la resuelve. Un renglón suma recién cuando tiene los dos números, así que una cantidad sin precio no cuenta como cero."
      >
        <Panel>
          <Variant name="con tope" note="Cambiá una cantidad y mirá el aviso: dice cuánto queda, y cuando te pasás dice de cuánto.">
            <Stack width="md">
              <SumTable rows={gastos} value={value} onChange={(id, c) => setValue(v => ({ ...v, [id]: c }))} cap={100000}>
                <SumTable.Prompt>Repartí los $100.000</SumTable.Prompt>
                <SumTable.Hint>No hace falta gastarlos todos: lo que sobra es lo que te banca el primer mes flojo.</SumTable.Hint>
              </SumTable>
            </Stack>
          </Variant>
          <Variant name="sin tope" note="Sin `cap` la tabla suma y no opina, que es lo que hace falta cuando no hay un límite sino una cuenta.">
            <Stack width="md">
              <SumTable rows={gastos} value={cargado}>
                <SumTable.Prompt>Lo que salió armar el primer lote</SumTable.Prompt>
              </SumTable>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          El aviso del tope es un `Alert` en tono `warn` y no en `bad`: pasarse del presupuesto en
          un ejercicio es algo para volver a mirar, no una falta. El rojo está reservado para lo que
          no tiene vuelta.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<SumTable
  rows={gastos}
  value={presupuesto}
  onChange={(id, celda) => guardar(id, celda)}
  cap={100000}
>
  <SumTable.Prompt>Repartí los $100.000</SumTable.Prompt>
</SumTable>`} />
      </Section>

      <Section title="Props">
        <Props of="SumTable" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Escribí los conceptos vos: una tabla donde el que responde inventa las filas deja de poder compararse con la de al lado.</Practices.Do>
          <Practices.Do>Dejá una fila de "Otros": sin ella, lo que no entra en tus categorías se mete en la que menos se le parece.</Practices.Do>
          <Practices.Dont>No le pidas que escriba el total: el total es la cuenta que la pieza hace, y pedirlo convierte un ejercicio de criterio en uno de sumar.</Practices.Dont>
          <Practices.Dont>No la uses para datos que no se multiplican: para cinco mediciones sueltas va una `Table`, que no finge que hay una cantidad y un precio.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Cada campo dice de qué renglón es: "Cantidad de Packaging", no "Cantidad". Con seis filas eso es la diferencia entre poder completarla y no.</A11y.Item>
          <A11y.Item>El subtotal y el total son texto de la tabla, no un atributo: se leen recorriéndola como cualquier celda.</A11y.Item>
          <A11y.Item>El aviso del tope dice el número, así que no depende de ver que el total se puso de otro color.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
