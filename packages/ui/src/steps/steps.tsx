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
      className={cx(cls.ol, acostada ? cls.ol2 : cls.ol3, className)}
    >
      {steps.map((s, i) => {
        const hecha = i < current
        const actual = i === current
        const Marca = onSelect ? 'button' : 'span'
        return (
          <li
            key={s.label}
            aria-current={actual ? 'step' : undefined}
            className={cx(cls.li, acostada ? cls.box : cls.box2)}
          >
            {i > 0 && (
              <span
                aria-hidden
                className={cx(
                  cls.span,
                  acostada ? cls.box3 : cls.box4,
                  hecha || actual ? cls.box5 : cls.box6,
                )}
                style={acostada ? { left: 'calc(-100% + 36px)', right: 'calc(100% + 8px)' } : undefined}
              />
            )}

            <Marca
              {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(i) } : {})}
              className={cx(
                `${cls.box7} tabular`,
                onSelect && cls.onSelect,
                hecha && cls.hecha,
                actual && cls.actual,
                !hecha && !actual && cls.actual2,
              )}
            >
              {hecha ? <Icon name="check" size={16} weight={700} /> : i + 1}
              <span className="sr-only">
                {hecha ? ' · hecha' : actual ? ' · en curso' : ' · pendiente'}
              </span>
            </Marca>

            <span className={cx(cls.span3, acostada && cls.acostada)}>
              <span className={cx(cls.span4, actual ? cls.span5 : cls.span6)}>{s.label}</span>
              {s.hint && <span className={cls.span7}>{s.hint}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
