import { Mono, Page, Section, useTokens } from '../kit'

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
  { token: '--radius-sm', cls: 'rounded-sm', role: 'marcas hundidas: un kbd, un badge, un checkbox' },
  { token: '--radius-md', cls: 'rounded-md', role: 'lo chico: un control de 32, un chip, un tooltip, un esqueleto' },
  { token: '--radius-lg', cls: 'rounded-lg', role: 'lo que se toca de 36 para arriba: botón md y lg, item de nav' },
  { token: '--radius-xl', cls: 'rounded-xl', role: 'lo que se apoya en la página: una tarjeta, una fila de lista' },
  { token: '--radius-2xl', cls: 'rounded-2xl', role: 'lo que flota sobre un velo: un modal, un diálogo' },
  { token: '--radius-full', cls: 'rounded-full', role: 'lo que es redondo de verdad: un avatar, un punto, un pulgar' },
] as const

/** Los once pasos, con el rol que los justifica. El rol es lo que hay que leer. */
const espaciado = [
  { px: 2, role: 'el pelo: el inset de una pista, el aire de un punto' },
  { px: 4, role: 'adentro de una marca: un badge, un kbd' },
  { px: 6, role: 'lo que separa un glifo de su texto' },
  { px: 8, role: 'lo que separa dos cosas de la misma fila' },
  { px: 12, role: 'lo que separa dos filas, y el aire de un control chico' },
  { px: 16, role: 'el padding de una pieza chica, y la separación entre dos piezas' },
  { px: 20, role: 'el padding de una tarjeta' },
  { px: 24, role: 'el padding de un panel, y la separación entre dos bloques' },
  { px: 32, role: 'la separación entre dos secciones' },
  { px: 40, role: 'el aire de una pantalla' },
  { px: 48, role: 'el respiro de una portada' },
] as const

export function MeasureSection() {
  return (
    <Page
      title="Espaciado y medidas"
      kind="Fundamentos"
      lead="Once pasos de espaciado, cuatro radios y un puñado de medidas de shell. Lo que las tres escalas tienen en común es que no dan a elegir entre dos cosas iguales: cada paso existe porque hace algo que el de al lado no hace."
      >
        <Section title="Medidas del shell">
          <div className="flex flex-col rounded-xl border border-line bg-surface px-4">
            {shell.map(m => <Measure key={m.token} {...m} />)}
          </div>
        </Section>

        <Section
          title="Alturas de control"
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
                <span className="text-meta text-ink-muted">{c.role}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="El espaciado: once pasos"
          note="Antes esto no era una escala. Los call sites tomaban los dieciocho valores que trae Tailwind, así que dos cosas que hacen lo mismo quedaban separadas por 10 en un lado y por 12 en el otro — y eso no se ve como un error, se ve como desprolijidad, que es peor porque no se puede señalar. La grilla es de 4 con dos sub-pasos abajo: a 2 y a 6 píxeles todavía hay decisiones reales que tomar, y de 8 para arriba la diferencia entre 28 y 32 no la ve nadie."
        >
          <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
            {espaciado.map(e => (
              <div key={e.px} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line px-4 py-3 first:border-t-0">
                <span className="w-12 shrink-0"><Mono>{e.px}</Mono></span>
                <span className="h-4 shrink-0 rounded-sm bg-brand" style={{ width: e.px }} />
                <span className="min-w-0 flex-1 text-meta text-ink-muted">{e.role}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Lo que la escala no manda"
          note="Las alturas de pieza. Un control de 36, una fila de tabla de 56, una marca de 44: esas salen de la escalera de controles y de lo que la pieza tiene que contener, no de la grilla del aire. Mezclarlas es lo que lleva a subir un padding para arreglar una altura."
        >
          <div className="flex flex-wrap gap-3">
            {[['h-8', 32, 'control sm'], ['h-9', 36, 'control md'], ['h-10', 40, 'control lg'], ['size-11', 44, 'marca de lista'], ['h-14', 56, 'fila de tabla']].map(([cls, px, role]) => (
              <div key={cls as string} className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                <span className="w-1.5 shrink-0 rounded-sm bg-ink-muted" style={{ height: px as number }} />
                <span className="flex flex-col gap-0.5">
                  <Mono>{px}</Mono>
                  <span className="text-meta text-ink-muted">{role}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

      <Section
        title="Radios"
        note="Cinco pasos y el círculo. **El radio sigue al alto**: el radio se lee en proporción al lado más corto de la pieza, no en píxeles. Sobre un botón de 40, 12 deja 16 de lado plano y se lee como un remate; sobre uno de 32 deja 8, y la misma curva se lee como una pastilla. El `md` de 10 llegó a morir con el argumento de que 10 y 12 están a dos píxeles y nadie ve la diferencia — sacarlo hizo dos píxeles más redondas a dieciséis piezas de golpe y la interfaz entera se vio más blanda. La otra regla, la del anidado: el radio de un hijo es el del padre menos el padding del padre."
      >
        <Section title="La escala">
          <div className="flex flex-col rounded-xl border border-line bg-surface px-4">
            {radii.map(r => (
              <div key={r.token} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-4 first:border-t-0">
                <span className={`size-14 shrink-0 bg-ink ${r.cls}`} />
                <span className="w-28 shrink-0"><Mono>{r.token.replace('--radius-', '')}</Mono></span>
                <Value token={r.token} />
                <span className="text-meta text-ink-muted">{r.role}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="La regla del anidado"
          note="Un contenedor de 24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve doble; si queda más cuadrado, se ven dos curvas distintas. Los dos errores ya pasaron en este repo."
        >
          <div className="flex flex-wrap gap-4">
            <NestDemo child="rounded-xl" label="24 − 8 = 16" verdict="bien" ok />
            <NestDemo child="rounded-2xl" label="24 con hijo de 24" verdict="curva doble" />
            <NestDemo child="rounded-sm" label="24 con hijo de 6" verdict="dos curvas distintas" />
          </div>
        </Section>
      </Section>
    </Page>
  )
}

function Measure({ token, role }: { token: string; role: string }) {
  const values = useTokens([token])
  const raw = values[token] ?? ''
  const px = Number.parseInt(raw, 10)
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line py-4 first:border-t-0">
      <span className="w-52 shrink-0"><Mono>{token}</Mono></span>
      <span className="w-12 shrink-0 tabular"><Mono>{raw || '—'}</Mono></span>
      <span className="h-2 rounded-full bg-muted" style={{ width: Math.min(Number.isNaN(px) ? 0 : px, 220) }} />
      <span className="text-meta text-ink-muted">{role}</span>
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
      <div className="w-fit rounded-2xl bg-ink p-2">
        <div className={`size-24 bg-canvas ${child}`} />
      </div>
      <Mono>{label}</Mono>
      <span className={ok ? 'text-meta font-semibold text-ok-ink' : 'text-meta font-semibold text-bad-ink'}>{verdict}</span>
    </div>
  )
}
