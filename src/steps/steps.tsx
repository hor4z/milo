import cls from './steps.module.css'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

export type Step = {
  /** El nombre de la etapa. */
  label: string
  /** Una línea abajo, para lo que el nombre no dice. */
  hint?: string
}

type StepsProps = {
  /** En orden. */
  steps: Step[]
  /** El índice de la que se está haciendo. Las anteriores quedan hechas. */
  current: number
  /** Qué es esta secuencia. Sin esto, un lector la anuncia como una lista suelta. */
  label: string
  /** Parada, deja lugar para el texto de cada etapa; acostada entra en una franja. */
  orientation?: 'horizontal' | 'vertical'
  /** Recibe el índice. Sin esto las etapas no se tocan: son un indicador y no una navegación. */
  onSelect?: (i: number) => void
  className?: string
}

/** Por dónde va algo que tiene etapas: una actividad en partes, un proceso de diseño, un formulario largo. */
export function Steps({ steps, current, label, orientation = 'horizontal', onSelect, className }: StepsProps) {
  const horizontal = orientation === 'horizontal'
  return (
    <ol
      aria-label={label}
      className={cx(cls.root, horizontal ? cls.horizontal : cls.vertical, className)}
    >
      {steps.map((s, i) => {
        const isDone = i < current
        const isCurrent = i === current
        const Bullet = onSelect ? 'button' : 'span'
        return (
          <li
            key={s.label}
            aria-current={isCurrent ? 'step' : undefined}
            className={cx(cls.item, horizontal ? cls.itemHorizontal : cls.itemVertical)}
          >
            {i > 0 && (
              <span
                aria-hidden
                className={cx(
                  cls.connector,
                  horizontal ? cls.connectorHorizontal : cls.connectorVertical,
                  isDone || isCurrent ? cls.connectorReached : cls.connectorAhead,
                )}
                style={horizontal ? { left: 'calc(-100% + 28px)', right: '100%' } : undefined}
              />
            )}

            <Bullet
              {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(i) } : {})}
              className={cx(
                `${cls.bullet} tabular`,
                cls.bulletMotion,
                isDone && cls.bulletDone,
                isCurrent && cls.bulletCurrent,
                !isDone && !isCurrent && cls.bulletAhead,
              )}
            >
              {isDone ? <Icon name="check" size={16} weight={700} /> : i + 1}
              <span className="sr-only">
                {isDone ? ' · hecha' : isCurrent ? ' · en curso' : ' · pendiente'}
              </span>
            </Bullet>

            <span className={cx(cls.body, horizontal && cls.bodyHorizontal)}>
              <span className={cx(cls.label, isCurrent ? cls.labelCurrent : cls.labelPlain)}>{s.label}</span>
              {s.hint && <span className={cls.hint}>{s.hint}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
