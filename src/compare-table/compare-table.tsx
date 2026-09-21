import s from './compare-table.module.css'
import { useId, type ReactNode } from 'react'
import { Table } from '../table/table'
import { Textarea } from '../textarea/textarea'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

/** Lo que se compara: una columna por cosa. */
export type CompareColumn = {
  /** Único en el cuadro. */
  id: string
  /** Cómo se llama esa cosa. */
  label: string
}

/** En qué se las compara: un renglón por aspecto. */
export type CompareRow = {
  /** Único en el cuadro. */
  id: string
  /** Qué se mira en ese renglón. */
  label: string
  /** Un ejemplo de la forma que se espera, no de la respuesta: se ve con la celda vacía y se va al escribir. */
  placeholder?: string
}

/** Qué se compara y para qué. */
function Prompt({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La línea de apoyo: dónde buscar lo que va en cada celda. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Un cuadro comparativo que se completa: dos o tres cosas en las columnas, en qué se las mira en los renglones. La grilla es de quien arma la consigna y las celdas son de quien la resuelve, así que nadie compara peras con manzanas por accidente. */
function Root({
  rows, columns, value, onChange, lines = 1, readOnly, children, className,
}: {
  /** En qué se comparan, en el orden en que se leen. */
  rows: CompareRow[]
  /** Qué se compara. Dos o tres entran; con más, el cuadro se lee de costado. */
  columns: CompareColumn[]
  /** Lo cargado, por renglón y después por columna. */
  value: Record<string, Record<string, string>>
  /** Recibe el renglón, la columna y el texto nuevo. */
  onChange?: (rowId: string, columnId: string, next: string) => void
  /** Los renglones de arranque de cada celda. Uno, porque acá entra una frase: la celda crece sola hasta el triple si hace falta. */
  lines?: number
  /** Se lee y no se completa. */
  readOnly?: boolean
  /** El `CompareTable.Prompt` y, si hace falta, el `CompareTable.Hint`. */
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const promptId = `${id}-prompt`
  const [prompt, rest] = takePart(children, Prompt)
  const [hint] = takePart(rest, Hint)

  const quieto = readOnly || !onChange
  const celda = (r: CompareRow, c: CompareColumn) => value[r.id]?.[c.id] ?? ''
  const nombra = (r: CompareRow, c: CompareColumn) =>
    columns.length === 1 ? r.label : `${r.label} de ${c.label}`

  return (
    <div className={cx(s.root, className)}>
      <p id={promptId} className={s.prompt}>{prompt}</p>
      {hint.length > 0 && <p className={s.hint}>{hint}</p>}

      <Table label={typeof prompt[0] === 'string' ? prompt[0] : undefined} minWidth={160 * (columns.length + 1)}>
        <Table.Header>
          <Table.Row>
            <Table.Head />
            {columns.map(c => <Table.Head key={c.id}>{c.label}</Table.Head>)}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(r => (
            <Table.Row key={r.id}>
              <Table.Cell><Table.Title>{r.label}</Table.Title></Table.Cell>
              {columns.map(c => (
                <Table.Cell key={c.id}>
                  {quieto
                    ? <span className={cx(s.text, !celda(r, c) && s.empty)}>{celda(r, c) || 'Sin completar'}</span>
                    : (
                        <Textarea
                          rows={lines}
                          maxRows={lines * 3}
                          value={celda(r, c)}
                          placeholder={r.placeholder}
                          aria-label={nombra(r, c)}
                          onChange={e => onChange(r.id, c.id, e.target.value)}
                        />
                      )}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export const CompareTable = Object.assign(Root, { Prompt, Hint })
