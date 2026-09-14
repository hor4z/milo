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
  const acostada = orientation === 'horizontal'
  return (
    <ol
      aria-label={label}
      className={cx(cls.root, acostada ? cls.horizontal : cls.vertical, className)}
    >
      {steps.map((s, i) => {
        const hecha = i < current
        const actual = i === current
        const Marca = onSelect ? 'button' : 'span'
        return (
          <li
            key={s.label}
            aria-current={actual ? 'step' : undefined}
            className={cx(cls.item, acostada ? cls.itemHorizontal : cls.itemVertical)}
          >
            {i > 0 && (
              <span
                aria-hidden
                className={cx(
                  cls.connector,
                  acostada ? cls.connectorHorizontal : cls.connectorVertical,
                  hecha || actual ? cls.connectorReached : cls.connectorAhead,
                )}
                style={acostada ? { left: 'calc(-100% + 36px)', right: 'calc(100% + 8px)' } : undefined}
              />
            )}

            <Marca
              {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(i) } : {})}
              className={cx(
                `${cls.bullet} tabular`,
                onSelect && cls.bulletClickable,
                hecha && cls.bulletDone,
                actual && cls.bulletCurrent,
                !hecha && !actual && cls.bulletAhead,
              )}
            >
              {hecha ? <Icon name="check" size={16} weight={700} /> : i + 1}
              <span className="sr-only">
                {hecha ? ' · hecha' : actual ? ' · en curso' : ' · pendiente'}
              </span>
            </Marca>

            <span className={cx(cls.body, acostada && cls.bodyHorizontal)}>
              <span className={cx(cls.label, actual ? cls.labelCurrent : cls.labelPlain)}>{s.label}</span>
              {s.hint && <span className={cls.hint}>{s.hint}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
