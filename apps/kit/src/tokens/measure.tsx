import { Block, Mono, Section, useTokens } from '../kit'

const shell = [
  { token: '--sidebar-w', role: 'sidebar, fijo' },
  { token: '--sidebar-w-collapsed', role: 'sidebar contraído' },
  { token: '--topbar-h', role: 'topbar' },
  { token: '--shell-pad', role: 'padding lateral de toda pantalla' },
  { token: '--nav-item-h', role: 'item de nav' },
  { token: '--nav-item-gap', role: 'entre items de nav' },
  { token: '--nav-sub-indent', role: 'sangría de subitems' },
] as const

const radii = [
  { token: '--radius-sm', cls: 'rounded-sm', role: 'marcas hundidas: un kbd, un badge' },
  { token: '--radius-md', cls: 'rounded-md', role: 'lo cuadrado que se toca: botón de icono' },
  { token: '--radius-lg', cls: 'rounded-lg', role: 'lo que se toca y tiene texto: botón, nav, buscador' },
  { token: '--radius-xl', cls: 'rounded-xl', role: 'lo que va adentro de una tarjeta' },
  { token: '--radius-2xl', cls: 'rounded-2xl', role: 'contenedores: tarjeta, modal, popover' },
] as const

export function MeasureSection() {
  return (
    <>
      <Section
        title="Espaciado y medidas"
        note="El espaciado es la base de 4 que trae Tailwind. Lo que el sistema fija son las medidas del shell y el ladder de alturas de control: esas no se eligen por pantalla, porque si cada una elige la suya el contenido baila al navegar."
      >
        <Block label="Medidas del shell">
          <div className="flex flex-col rounded-xl border border-line bg-surface px-4">
            {shell.map(m => <Measure key={m.token} {...m} />)}
          </div>
        </Block>

        <Block
          label="Alturas de control"
          note="Tres alturas y un rol cada una. La de 36 y la de 40 comparten texto de 14/600 y radio 12; la de 32 baja a 12px porque va inline en una fila densa."
        >
          <div className="flex flex-col gap-3">
            {[
              { h: 32, name: 'sm', role: 'inline en una fila densa' },
              { h: 36, name: 'md', role: 'acciones dentro de un panel' },
              { h: 40, name: 'lg', role: 'la acción principal' },
            ].map(c => (
              <div key={c.h} className="flex flex-wrap items-center gap-3">
                <span className="w-10 shrink-0"><Mono>{c.name}</Mono></span>
                <div className="rounded-lg bg-muted" style={{ height: c.h, width: 132 }} />
                <span className="tabular"><Mono>{c.h}px</Mono></span>
                <span className="text-2xs text-ink-muted">{c.role}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block label="La base de 4" note="Los pasos que se usan de verdad. Todo lo que no está acá es un valor puesto a mano y conviene mirarlo dos veces.">
          <div className="flex flex-wrap items-end gap-4">
            {[2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40].map(px => (
              <div key={px} className="flex flex-col items-center gap-1.5">
                <div className="rounded-sm bg-solid" style={{ width: px, height: px }} />
                <Mono>{px}</Mono>
              </div>
            ))}
          </div>
        </Block>
      </Section>

      <Section
        title="Radios"
        note="Cinco pasos y un rol cada uno. La regla que los ata: el radio de un hijo es el del padre menos el padding del padre."
      >
        <Block label="La escala">
          <div className="flex flex-col rounded-xl border border-line bg-surface px-4">
            {radii.map(r => (
              <div key={r.token} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-3.5 first:border-t-0">
                <span className={`size-11 shrink-0 bg-muted ${r.cls}`} />
                <span className="w-28 shrink-0"><Mono>{r.token.replace('--radius-', '')}</Mono></span>
                <Value token={r.token} />
                <span className="text-2xs text-ink-muted">{r.role}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block
          label="La regla del anidado"
          note="Un contenedor de 24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve doble; si queda más cuadrado, se ven dos curvas distintas. Los dos errores ya pasaron en este repo."
        >
          <div className="flex flex-wrap gap-4">
            <NestDemo child="rounded-xl" label="24 − 8 = 16" verdict="bien" ok />
            <NestDemo child="rounded-2xl" label="24 con hijo de 24" verdict="curva doble" />
            <NestDemo child="rounded-sm" label="24 con hijo de 6" verdict="dos curvas distintas" />
          </div>
        </Block>
      </Section>
    </>
  )
}

function Measure({ token, role }: { token: string; role: string }) {
  const values = useTokens([token])
  const raw = values[token] ?? ''
  const px = Number.parseInt(raw, 10)
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-3.5 first:border-t-0">
      <span className="w-52 shrink-0"><Mono>{token}</Mono></span>
      <span className="w-12 shrink-0 tabular"><Mono>{raw || '—'}</Mono></span>
      <span className="h-2 rounded-full bg-muted" style={{ width: Math.min(Number.isNaN(px) ? 0 : px, 220) }} />
      <span className="text-2xs text-ink-muted">{role}</span>
    </div>
  )
}

function Value({ token }: { token: string }) {
  const values = useTokens([token])
  return <span className="w-12 shrink-0 tabular"><Mono>{values[token] ?? ''}</Mono></span>
}

function NestDemo({ child, label, verdict, ok }: { child: string; label: string; verdict: string; ok?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl bg-muted p-2">
        <div className={`size-24 bg-surface shadow-card ${child}`} />
      </div>
      <Mono>{label}</Mono>
      <span className={ok ? 'text-2xs font-semibold text-ok' : 'text-2xs font-semibold text-bad'}>{verdict}</span>
    </div>
  )
}
