import { Checkbox } from '../checkbox/checkbox'
import { cx } from '../lib/cx'

export type Task = {
  /** Único en la lista. */
  id: string
  /** Lo que hay que hacer. */
  label: string
  done?: boolean
}

type TaskListProps = {
  /** En el orden en que van. */
  items: Task[]
  /** Recibe el id y si quedó hecha. */
  onToggle: (id: string, done: boolean) => void
  /** De qué es la lista. Sin esto un lector anuncia «lista, cuatro elementos» y nada más. */
  label: string
  /** Apagada se lee y no se toca: la consigna de otro, una entrega ya cerrada. */
  readOnly?: boolean
  className?: string
}

/** Cosas para hacer, que se marcan al hacerlas: los pasos de una entrega, lo que falta de una actividad. */
export function TaskList({ items, onToggle, label, readOnly, className }: TaskListProps) {
  return (
    <ul aria-label={label} className={cx('flex flex-col', className)}>
      {items.map(t => (
        <li key={t.id}>
          <label className={cx('flex items-start gap-3 py-1', !readOnly && 'cursor-pointer')}>
            <Checkbox checked={!!t.done} disabled={readOnly} onChange={v => onToggle(t.id, v)} />
            <span className={cx('text-reading', t.done ? 'text-ink-muted line-through' : 'text-ink')}>{t.label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
