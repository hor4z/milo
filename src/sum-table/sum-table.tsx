import s from './sum-table.module.css'
import { useId, type ReactNode } from 'react'
import { Alert } from '../alert/alert'
import { Table } from '../table/table'
import { TextField } from '../text-field/text-field'
import { cx } from '../lib/cx'
import { amount, parseNumber } from '../lib/number'
import { takePart } from '../lib/parts'

/** Un renglón de la tabla: el concepto, que lo escribe quien arma la consigna. */
export type SumRow = {
  /** Único en la tabla. */
  id: string
  /** En qué se gasta. */
  label: string
  /** Un ejemplo de qué se cuenta acá: bolsas, horas, unidades. */
  qtyExample?: string
  /** Un ejemplo de a cuánto, con la forma que se espera y no con el número que va. */
  priceExample?: string
}

/** Lo que alguien cargó en un renglón, tal cual lo escribió. */
export type SumCell = {
  /** Cuántas unidades. */
  qty: string
  /** Cuánto sale cada una. */
  price: string
}

const vacia: SumCell = { qty: '', price: '' }

/** El subtotal de un renglón: sin los dos números, todavía no hay nada que sumar. */
function subtotal(cell: SumCell): number | null {
  const q = parseNumber(cell.qty)
  const p = parseNumber(cell.price)
  return q === null || p === null ? null : q * p
}

/** De qué es la tabla. */
function Prompt({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** La línea de apoyo: de dónde sale cada número, qué no se puede olvidar. */
function Hint({ children }: { children: ReactNode }) {
  return <>{children}</>
}

/** Una tabla que se completa y se suma sola: un presupuesto, una lista de materiales, un costeo. El total no se escribe, y por eso no puede estar mal sumado. Con `cap`, además dice cuánto queda o de cuánto se pasaron. */
function Root({
  rows, value, onChange, cap, currency = '$', readOnly, children, className,
}: {
  /** Los conceptos, en el orden en que se leen. */
  rows: SumRow[]
  /** Lo cargado hasta ahora, por id de renglón. */
  value: Record<string, SumCell>
  /** Recibe el renglón entero, no la celda suelta. */
  onChange?: (id: string, next: SumCell) => void
  /** El tope que no se puede pasar. Sin esto la tabla suma y no opina. */
  cap?: number
  /** Lo que se antepone a cada número. */
  currency?: string
  /** Se lee y no se completa. */
  readOnly?: boolean
  /** El `SumTable.Prompt` y, si hace falta, el `SumTable.Hint`. */
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const promptId = `${id}-prompt`
  const [prompt, rest] = takePart(children, Prompt)
  const [hint] = takePart(rest, Hint)

  const quieto = readOnly || !onChange
  const total = rows.reduce((acc, r) => acc + (subtotal(value[r.id] ?? vacia) ?? 0), 0)
  const sobra = cap === undefined ? null : cap - total

  const escribir = (r: SumRow, campo: keyof SumCell, texto: string) =>
    onChange?.(r.id, { ...(value[r.id] ?? vacia), [campo]: texto })

  const plata = (n: number) => `${currency}${amount(n)}`

  return (
    <div className={cx(s.root, className)}>
      <p id={promptId} className={s.prompt}>{prompt}</p>
      {hint.length > 0 && <p className={s.hint}>{hint}</p>}

      <Table label={typeof prompt[0] === 'string' ? prompt[0] : undefined} minWidth={460}>
        <Table.Header>
          <Table.Row>
            <Table.Head>Concepto</Table.Head>
            <Table.Head align="right">Cantidad</Table.Head>
            <Table.Head align="right">Precio</Table.Head>
            <Table.Head align="right">Subtotal</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rows.map(r => {
            const celda = value[r.id] ?? vacia
            const sub = subtotal(celda)
            return (
              <Table.Row key={r.id}>
                <Table.Cell><Table.Title>{r.label}</Table.Title></Table.Cell>
                <Table.Cell align="right">
                  <TextField
                    size="sm"
                    inputMode="decimal"
                    value={celda.qty}
                    placeholder={r.qtyExample}
                    readOnly={quieto}
                    aria-label={`Cantidad de ${r.label}`}
                    onChange={e => escribir(r, 'qty', e.target.value)}
                    className={s.control}
                  />
                </Table.Cell>
                <Table.Cell align="right">
                  <TextField
                    size="sm"
                    inputMode="decimal"
                    value={celda.price}
                    placeholder={r.priceExample}
                    readOnly={quieto}
                    aria-label={`Precio de ${r.label}`}
                    onChange={e => escribir(r, 'price', e.target.value)}
                    className={s.control}
                  />
                </Table.Cell>
                <Table.Num>{sub === null ? '' : plata(sub)}</Table.Num>
              </Table.Row>
            )
          })}
        </Table.Body>
        <Table.Foot>
          <Table.Row>
            <Table.Cell><Table.Title>Total</Table.Title></Table.Cell>
            <Table.Cell />
            <Table.Cell />
            <Table.Num>{plata(total)}</Table.Num>
          </Table.Row>
        </Table.Foot>
      </Table>

      {sobra !== null && (
        <Alert size="sm" tone={sobra < 0 ? 'warn' : 'info'}>
          {sobra < 0
            ? `Te pasaste por ${plata(-sobra)}. El tope es ${plata(cap!)}.`
            : sobra === 0
              ? `Usaste los ${plata(cap!)} enteros.`
              : `Te quedan ${plata(sobra)} de los ${plata(cap!)}.`}
        </Alert>
      )}
    </div>
  )
}

export const SumTable = Object.assign(Root, { Prompt, Hint })
