import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  EmptyState, Icon, Segmented, Slider, TextField, fold,
  iconNames, type IconName, type IconWeight,
} from '@melu/ui'
import { iconTags } from '@melu/ui/icons.meta'
import { Mono, Page, Panel, Props, Section, Variant } from '../kit'

const escala = [
  { px: 12, rol: 'un badge, la cruz de un chip' },
  { px: 14, rol: 'la marca de un Select, un tilde' },
  { px: 16, rol: 'adentro de un control chico' },
  { px: 18, rol: 'adentro de un botón mediano' },
  { px: 20, rol: 'el default: la interfaz' },
  { px: 22, rol: 'el glifo de una marca de lista' },
] as const

const pesos = [
  { value: '300', label: '300' }, { value: '400', label: '400' },
  { value: '500', label: '500' }, { value: '700', label: '700' },
] as const

export function IconStory() {
  const [q, setQ] = useState('')
  const [size, setSize] = useState(24)
  const [weight, setWeight] = useState<'300' | '400' | '500' | '700'>('300')
  const [copiado, setCopiado] = useState<string | null>(null)

  const visibles = useMemo(() => {
    const n = fold(q.trim())
    if (!n) return iconNames
    return iconNames.filter(k => fold(k).includes(n) || fold(iconTags[k] ?? '').includes(n))
  }, [q])

  const copiar = (name: IconName) => {
    navigator.clipboard?.writeText(`<Icon name="${name}" />`)
    setCopiado(name)
    setTimeout(() => setCopiado(c => (c === name ? null : c)), 1200)
  }

  return (
    <Page
      title="Icon"
      lead="Material Symbols Rounded, subseteado a lo que usamos y servido desde el repo. Peso 300 de base, y peso y relleno son ejes reales de la fuente, no variantes generadas."
    >
      <Section
        title="El eje"
        note="El peso va de 100 a 700 y es continuo porque es una fuente variable: con SVG haría falta un archivo por escalón — por eso el set es una fuente, y por eso Google la distribuye así: sus SVG estáticos, dice su propio repo, «do not have all the variations available». El otro eje de Material, FILL, está clavado en 0: todos los glifos son de contorno, sin excepciones y sin prop para moverlo."
      >
        <Panel>
          <Variant name="wght 100…700">
            {([100, 200, 300, 400, 500, 600, 700] as IconWeight[]).map(w => (
              <span key={w} className="flex flex-col items-center gap-1">
                <Icon name="notifications" size={28} weight={w} />
                <Mono>{w}</Mono>
              </span>
            ))}
          </Variant>
        </Panel>
      </Section>

      <Section
        title={`El set · ${iconNames.length} iconos`}
        note="Buscá por nombre o por lo que el icono es. Los controles escriben las variables una sola vez en el contenedor de la grilla y los glifos las heredan: cambiar `font-variation-settings` en cada instancia invalida la rasterización de cada glifo, y serían 152 por cada movimiento del control."
      >
        <div className="flex flex-wrap items-center gap-4">
          <span className="w-[260px]">
            <TextField icon="search" value={q} onChange={e => setQ(e.target.value)} placeholder="buscar por nombre o por tag…" />
          </span>
          <Segmented
            value={weight}
            onChange={setWeight}
            options={pesos.map(p => ({ value: p.value, label: p.label }))}
            size="sm"
          />
          <span className="flex w-[180px] items-center gap-3 text-xs text-ink-muted">
            <Slider value={size} onChange={setSize} min={12} max={40} label="Tamaño" />
            <Mono>{size}</Mono>
          </span>
        </div>

        {visibles.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              size="sm"
              icon="search_off"
              title="Ningún icono con eso"
              body={`Los tags son los de Google y están en inglés. Si no está en el set, buscalo en el catálogo completo: npm run icons -w @melu/ui -- search ${q.trim() || '…'}`}
            />
          </div>
        ) : (
          <div
            className="mt-4 grid gap-1.5"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
              '--icon-wght': weight,
            } as CSSProperties}
          >
            {visibles.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => copiar(name)}
                title={iconTags[name] || name}
                className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface px-2 py-3 transition-colors hover:bg-muted"
              >
                <span className="flex items-center justify-center" style={{ height: 40 }}>
                  <Icon name={name} size={size} />
                </span>
                <span className="w-full truncate text-center font-mono text-2xs text-ink-muted">
                  {copiado === name ? 'copiado' : name}
                </span>
              </button>
            ))}
          </div>
        )}
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Click en un icono copia <Mono>{'<Icon name="…" />'}</Mono>. El title trae los tags con los
          que se puede buscar.
        </p>
      </Section>

      <Section
        title="Los tamaños"
        note="Seis pasos pares. Antes eran nueve valores y tres de ellos impares, que salieron de encajar ópticamente dibujos propios; con una fuente un tamaño impar cae en media grilla de píxeles y se ve borroso."
      >
        <Panel>
          {escala.map(e => (
            <Variant key={e.px} name={`${e.px}`}>
              <Icon name="calendar_month" size={e.px} />
              <span className="text-xs text-ink-muted">{e.rol}</span>
            </Variant>
          ))}
        </Panel>
      </Section>

      <Section
        title="El gris no es una prop"
        note="La regla vieja decía «icono en gris ⇒ weight 1.5», y era imposible de cumplir: el gris muchas veces lo hereda de un ancestro —un IconButton apagado, un item de nav inactivo, el placeholder de un Select— y desde el call site no hay forma de saberlo. Ahora es la utilidad `icon-muted`, que pone el color y sube el peso a 400 juntos. Se cumple sola."
      >
        <Panel>
          <Variant name="en tinta">
            <Icon name="search" size={20} />
            <span className="text-xs text-ink-muted">peso 300</span>
          </Variant>
          <Variant name="icon-muted">
            <Icon name="search" size={20} className="icon-muted" />
            <span className="text-xs text-ink-muted">el peso sube a 400 solo, sin prop</span>
          </Variant>
          <Variant name="el error">
            <Icon name="search" size={20} className="text-ink-muted" />
            <span className="text-xs text-ink-muted">gris sin la utilidad: queda en 300 y se apaga</span>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Cómo se agrega uno"
        note="Hay más de tres mil novecientos en el catálogo y el set trae los que usamos. Agregar uno es un comando, no dibujar un path."
      >
        <Panel>
          <Variant name="buscar">
            <Mono>npm run icons -w @melu/ui -- search notification</Mono>
          </Variant>
          <Variant name="agregar">
            <Mono>npm run icons -w @melu/ui -- add rocket_launch</Mono>
          </Variant>
          <Variant name="auditar">
            <Mono>npm run icons -w @melu/ui -- check</Mono>
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-xs text-ink-muted">
          <code className="font-mono text-2xs">add</code> hace tres preguntas antes de bajar nada:
          si el nombre existe —y si no, sugiere los cinco más parecidos—, si ya lo tenemos, y si hay
          uno en el set que comparta tags y probablemente sirva igual. La tercera es la que evita
          llegar a doscientos iconos con seis variantes de engranaje, y para saltearla hay que
          escribir <Mono>--yes</Mono>. El catálogo está versionado, así que buscar funciona sin
          internet.
        </p>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'name', type: 'IconName', note: 'obligatorio; la unión de los 152 del set' },
          { name: 'size', type: 'number', def: '20', note: 'la escala 12 · 14 · 16 · 18 · 20 · 22' },
          { name: 'weight', type: '100…700', def: '300', note: 'el eje wght; el gris lo sube solo' },
          { name: 'className', type: 'string', note: 'para el color; `icon-muted` para el gris' },
        ]} />
      </Section>

      <Section
        title="El costo, que conviene saber"
        note="Firefox deja desactivar «permitir que las páginas elijan sus propias fuentes», y hay gente que lo usa por dislexia o baja visión. Con esa opción todos los iconos desaparecen y quedan cuadraditos. Un <svg> era inmune. No tiene mitigación dentro de este enfoque: es el precio de que el peso y el relleno sean ejes de verdad, y está acá escrito y no escondido."
      >
        <div />
      </Section>
    </Page>
  )
}
