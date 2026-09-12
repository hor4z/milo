import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Segmented, cx, Icon } from '@melu/ui'
import { plans } from '../data'

/** Planes. */
export function PricingScreen() {
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-screen bg-canvas">
      <header className="flex h-16 items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect width="26" height="26" rx="8" fill="var(--solid)" />
            <path d="M7 17.5V11a4 4 0 018 0v6.5" stroke="var(--on-solid)" strokeWidth="2.1" strokeLinecap="round" />
            <path d="M15 17.5V11a4 4 0 014-4" stroke="var(--jade-500)" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-[-0.03em]">melu</span>
        </Link>
        <Button variant="ghost" iconEnd="arrow_forward" onClick={() => history.back()}>Volver</Button>
      </header>

      <div className="mx-auto max-w-[1120px] px-6 pb-24 pt-10 text-center">
        <h1 className="text-display font-semibold">Elegí cómo seguir</h1>
        <p className="mx-auto mt-3 max-w-[52ch] text-lg text-ink-muted">
          Todos los planes traen las recetas de fábrica y el panel. Lo que cambia es cuánta gente
          entra y cuánto se guarda.
        </p>

        <div className="mt-7 flex justify-center">
          <Segmented
            label="Cada cuánto se paga"
            value={cycle}
            onChange={setCycle}
            options={[
              { value: 'monthly', label: 'Por mes' },
              { value: 'yearly', label: 'Por año', dot: true },
            ]}
          />
        </div>
        {cycle === 'yearly' && (
          <p className="ui-fade mt-2.5 text-sm text-accent">Dos meses sin cargo al pagar el año</p>
        )}

        <div className="mt-10 grid grid-cols-1 items-start gap-5 text-left md:grid-cols-3">
          {plans.map(p => {
            const price = cycle === 'monthly' ? p.monthly : p.yearly
            return (
              <div
                key={p.id}
                className={cx(
                  'flex flex-col overflow-hidden rounded-2xl bg-surface ring-1 transition-shadow duration-[190ms]',
                  p.featured ? 'shadow-card ring-line-strong md:-mt-3' : 'ring-line',
                )}
              >
                {p.featured && (
                  <div className="flex items-center justify-center gap-1.5 bg-solid py-2 text-2xs font-medium uppercase tracking-[0.06em] text-on-solid">
                    <Icon name="star_shine" size={12} />
                    El que usan casi todas las escuelas
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-xl font-semibold">{p.name}</h2>
                  <p className="mt-1.5 min-h-[3.25rem] text-base leading-relaxed text-ink-muted">{p.blurb}</p>

                  <div className="mt-4 rounded-2xl bg-muted p-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-md text-ink-subtle">USD</span>
                      <span className="tabular font-display text-2xl font-semibold">{price}</span>
                      <span className="text-sm leading-tight text-ink-subtle">
                        por {cycle === 'monthly' ? 'mes' : 'año'}
                      </span>
                    </div>
                    {p.current ? (
                      <div className="mt-3.5 flex h-9 items-center justify-center gap-1.5 rounded-lg bg-surface text-base font-medium text-ink-muted ring-1 ring-line">
                        <Icon name="check" size={14} className="text-accent" />
                        Es tu plan
                      </div>
                    ) : (
                      <Button block size="lg" className="mt-3.5" variant={p.featured ? 'solid' : 'raised'}>
                        Pasar a {p.name}
                      </Button>
                    )}
                  </div>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {p.features.map(f => (
                      <li key={f} className="flex gap-2.5 text-base text-ink-muted">
                        <Icon name="check" size={14} className="mt-0.5 text-accent" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-sm text-ink-subtle">
          Las escuelas públicas no pagan. Escribinos y lo arreglamos.
        </p>
      </div>
    </div>
  )
}
