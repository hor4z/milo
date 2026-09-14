import cls from './task-list.module.css'
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
  /** De qué es la lista. Sin esto un lector anuncia "lista, cuatro elementos" y nada más. */
  label: string
  /** Apagada se lee y no se toca: la consigna de otro, una entrega ya cerrada. */
  readOnly?: boolean
  className?: string
}

/** Cosas para hacer, que se marcan al hacerlas: los pasos de una entrega, lo que falta de una actividad. */
export function TaskList({ items, onToggle, label, readOnly, className }: TaskListProps) {
  return (
    <ul aria-label={label} className={cx(cls.root, className)}>
      {items.map(t => (
        <li key={t.id}>
          <label className={cx(cls.item, !readOnly && cls.editable)}>
            <Checkbox checked={!!t.done} disabled={readOnly} onChange={v => onToggle(t.id, v)} />
            <span className={cx(cls.text, t.done ? cls.doneText : cls.pendingText)}>{t.label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
