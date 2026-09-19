import css from './measure.module.css'
import { Mono, Page, Section, Stack, useTokens } from '../kit'

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
  { token: '--radius-sm', cls: css.radiusSm, role: 'marcas hundidas: un kbd, un badge, un checkbox' },
  { token: '--radius-md', cls: css.radiusMd, role: 'lo chico: un control de 32, un chip, un tooltip, un esqueleto' },
  { token: '--radius-lg', cls: css.radiusLg, role: 'lo que se toca de 36 para arriba: botón md y lg, item de nav' },
  { token: '--radius-xl', cls: css.radiusXl, role: 'lo que se apoya en la página: una tarjeta, una fila de lista' },
  { token: '--radius-2xl', cls: css.radiusXxl, role: 'lo que flota sobre un velo: un modal, un diálogo' },
  { token: '--radius-full', cls: css.radiusFull, role: 'lo que es redondo de verdad: un avatar, un punto, un pulgar' },
] as const

/** Los diez pasos, con el rol que los justifica. El rol es lo que hay que leer. */
const spacing = [
  { px: 2, role: 'el pelo: el inset de una pista, el aire de un punto' },
  { px: 4, role: 'adentro de una marca: un badge, un kbd' },
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
      lead="Diez pasos de espaciado, seis radios y un puñado de medidas de shell. Lo que las tres escalas tienen en común es que no dan a elegir entre dos cosas iguales: cada paso existe porque hace algo que el de al lado no hace."
      >
        <Section title="Medidas del shell">
          <div className={`${css.shellList} bg-surface`}>
            {shell.map(m => <Measure key={m.token} {...m} />)}
          </div>
        </Section>

        <Section
          title="Alturas de control"
          note="Tres alturas y un rol cada una. La de 36 y la de 40 comparten el escalón de lectura (16) y radio 12; la de 32 baja a 14 y a radio 10, porque va inline en una fila densa y el radio sigue al alto. El peso es el mismo en las tres: 450, que es el de lo accionable."
        >
          <Stack>
            {[
              { h: 32, name: 'sm', role: 'inline en una fila densa' },
              { h: 36, name: 'md', role: 'acciones dentro de un panel' },
              { h: 40, name: 'lg', role: 'la acción principal' },
            ].map(c => (
              <div key={c.h} className={css.heightRow}>
                <span className={css.heightName}><Mono>{c.name}</Mono></span>
                <div className={css.heightBar} style={{ height: c.h, width: 132 }} />
                <span className="tabular"><Mono>{c.h}px</Mono></span>
                <span className={css.heightRole}>{c.role}</span>
              </div>
            ))}
          </Stack>
        </Section>

        <Section
          title="El espaciado: diez pasos"
          note="Antes esto no era una escala: los call sites tomaban los dieciocho valores de Tailwind, y dos cosas que hacen lo mismo quedaban separadas por 10 en un lado y por 12 en el otro. Eso no se ve como un error, se ve como desprolijidad, que es peor porque no se puede señalar. La grilla es de 4, con dos sub-pasos abajo."
        >
          <div className={`${css.spaceList} bg-surface`}>
            {spacing.map(e => (
              <div key={e.px} className={css.spaceRow}>
                <span className={css.spaceName}><Mono>{e.px}</Mono></span>
                <span className={css.spaceBar} style={{ width: e.px }} />
                <span className={css.spaceRole}>{e.role}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Lo que la escala no manda"
          note="Las alturas de pieza. Un control de 36, una fila de tabla de 56, una marca de 44: esas salen de la escalera de controles y de lo que la pieza tiene que contener, no de la grilla del aire. Mezclarlas es lo que lleva a subir un padding para arreglar una altura."
        >
          <div className={css.freeGrid}>
            {[[32, 'control sm'], [36, 'control md'], [40, 'control lg'], [44, 'marca de lista'], [56, 'fila de tabla']].map(([px, role]) => (
              <div key={role as string} className={`${css.freeCard} bg-surface`}>
                <span className={css.freeBar} style={{ height: px as number }} />
                <span className={css.freeMeta}>
                  <Mono>{px}</Mono>
                  <span className={css.freeRole}>{role}</span>
                </span>
              </div>
            ))}
          </div>
        </Section>

      <Section
        title="Radios"
        note="Cinco pasos y el círculo. **El radio sigue al alto**: 12 sobre un botón de 40 se lee como un remate, y sobre uno de 32, como una pastilla. Matar el `md` de 10 ('nadie ve dos píxeles') hizo más redondas dieciséis piezas de golpe. La otra regla: el radio de un hijo es el del padre menos su padding."
      >
        <Section title="La escala">
          <div className={`${css.radiusList} bg-surface`}>
            {radii.map(r => (
              <div key={r.token} className={css.radiusRow}>
                <span className={`${css.radiusSample} ${r.cls}`} />
                <span className={css.radiusName}><Mono>{r.token.replace('--radius-', '')}</Mono></span>
                <Value token={r.token} />
                <span className={css.radiusRole}>{r.role}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="La regla del anidado"
          note="Un contenedor de 24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve doble; si queda más cuadrado, se ven dos curvas distintas. Los dos errores ya pasaron en este repo."
        >
          <div className={css.nestGrid}>
            <NestDemo child={css.radiusXl} label="24 − 8 = 16" verdict="bien" ok />
            <NestDemo child={css.radiusXxl} label="24 con hijo de 24" verdict="curva doble" />
            <NestDemo child={css.radiusSm} label="24 con hijo de 6" verdict="dos curvas distintas" />
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
    <div className={css.measureRow}>
      <span className={css.measureName}><Mono>{token}</Mono></span>
      <span className={`${css.measureRaw} tabular`}><Mono>{raw || '-'}</Mono></span>
      <span className={css.measureBar} style={{ width: Math.min(Number.isNaN(px) ? 0 : px, 220) }} />
      <span className={css.measureRole}>{role}</span>
    </div>
  )
}

function Value({ token }: { token: string }) {
  const values = useTokens([token])
  return <span className={`${css.measureValue} tabular`}><Mono>{values[token] ?? ''}</Mono></span>
}

function NestDemo({ child, label, verdict, ok }: { child: string; label: string; verdict: string; ok?: boolean }) {
  return (
    <Stack gap="sm">
      <div className={css.nestParent}>
        <div className={`${css.nestedChild} ${child}`} />
      </div>
      <Mono>{label}</Mono>
      <span className={ok ? css.verdictGood : css.verdictBad}>{verdict}</span>
    </Stack>
  )
}
