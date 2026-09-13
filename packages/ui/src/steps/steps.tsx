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
      className={cx('flex', acostada ? 'flex-col gap-2 sm:flex-row sm:gap-0' : 'flex-col gap-0', className)}
    >
      {steps.map((s, i) => {
        const hecha = i < current
        const actual = i === current
        const Marca = onSelect ? 'button' : 'span'
        return (
          <li
            key={s.label}
            aria-current={actual ? 'step' : undefined}
            className={cx('relative flex min-w-0', acostada ? 'flex-1 flex-col gap-2' : 'gap-3 pb-6 last:pb-0')}
          >
            {/* La línea que une dos etapas es del hueco entre ellas, no de una
                etapa: dibujada adentro, la última deja una línea colgando. */}
            {i > 0 && (
              <span
                aria-hidden
                className={cx(
                  'absolute',
                  acostada ? 'top-[13px] hidden h-px sm:block' : 'left-[13px] top-0 h-6 w-px -translate-y-6',
                  hecha || actual ? 'bg-brand' : 'bg-line-strong',
                )}
                // Va de una marca a la siguiente y no media etapa: la marca mide
                // 28 y arranca en el borde de su columna, así que la línea sale
                // 28 después de la anterior y frena 8 antes de esta.
                style={acostada ? { left: 'calc(-100% + 36px)', right: 'calc(100% + 8px)' } : undefined}
              />
            )}

            <Marca
              {...(onSelect ? { type: 'button' as const, onClick: () => onSelect(i) } : {})}
              className={cx(
                'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full text-meta font-semibold tabular',
                onSelect && 'transition-colors duration-fast ease-out',
                hecha && 'bg-brand text-on-brand',
                actual && 'bg-brand-soft text-brand-ink ring-2 ring-brand',
                !hecha && !actual && 'bg-muted text-ink-muted',
              )}
            >
              {hecha ? <Icon name="check" size={16} weight={700} /> : i + 1}
              <span className="sr-only">
                {hecha ? ' · hecha' : actual ? ' · en curso' : ' · pendiente'}
              </span>
            </Marca>

            <span className={cx('flex min-w-0 flex-col gap-0.5', acostada && 'sm:pr-4')}>
              <span className={cx('text-body', actual ? 'font-semibold text-ink' : 'font-medium text-ink-muted')}>{s.label}</span>
              {s.hint && <span className="text-meta text-ink-muted">{s.hint}</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
