import cls from './icon.module.css'
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  EmptyState, Icon, Segmented, Slider, TextField, fold,
  iconNames, type IconName, type IconWeight,
} from '@milo/ui'
import { iconTags } from '@milo/ui/icons.meta'
import { A11y, Cluster, Footnote, Mono, Note, Page, Panel, Props, Section, Variant } from '../kit'

const sizes = [
  { px: 12, role: 'un badge, la cruz de un chip' },
  { px: 14, role: 'la marca de un Select, un tilde' },
  { px: 16, role: 'adentro de un control chico' },
  { px: 18, role: 'adentro de un botón mediano' },
  { px: 20, role: 'el default: la interfaz' },
  { px: 22, role: 'el glifo de una marca de lista' },
] as const

const weights = [
  { value: '300', label: '300' }, { value: '400', label: '400' },
  { value: '500', label: '500' }, { value: '700', label: '700' },
] as const

export function IconStory() {
  const [q, setQ] = useState('')
  const [size, setSize] = useState(24)
  const [weight, setWeight] = useState<'300' | '400' | '500' | '700'>('300')
  const [copied, setCopied] = useState<string | null>(null)

  const visible = useMemo(() => {
    const n = fold(q.trim())
    if (!n) return iconNames
    return iconNames.filter(k => fold(k).includes(n) || fold(iconTags[k] ?? '').includes(n))
  }, [q])

  const copy = (name: IconName) => {
    navigator.clipboard?.writeText(`<Icon name="${name}" />`)
    setCopied(name)
    setTimeout(() => setCopied(c => (c === name ? null : c)), 1200)
  }

  return (
    <Page
      title="Icon"
      kind="Guía"
      imports="import { Icon } from '@milo/ui'"
      lead="Material Symbols Rounded, subseteado a lo que usamos y servido desde el repo. Peso 300 de base, y peso y relleno son ejes reales de la fuente, no variantes generadas."
    >
      <Section
        title="El eje"
        note="El peso va de 100 a 700 y es continuo porque es una fuente variable: con SVG haría falta un archivo por escalón, y por eso el set es una fuente. El otro eje, FILL, está clavado en 0: todos de contorno, con una sola excepción escrita a mano."
      >
        <Panel>
          <Variant name="wght 100…700">
            {([100, 200, 300, 400, 500, 600, 700] as IconWeight[]).map(w => (
              <span key={w} className={cls.weightSample}>
                <Icon name="notifications" size={28} weight={w} />
                <Mono>{w}</Mono>
              </span>
            ))}
          </Variant>
        </Panel>
      </Section>

      <Section
        title={`El set · ${iconNames.length} iconos`}
        note="Buscá por nombre o por lo que el icono es. Los controles escriben las variables una sola vez en el contenedor de la grilla y los glifos las heredan: cambiar `font-variation-settings` en cada instancia invalida la rasterización de cada glifo, y serían todos los del set por cada movimiento del control."
      >
        <Cluster gap="lg" align="center">
          <span className={cls.searchSlot}>
            <TextField icon="search" value={q} onChange={e => setQ(e.target.value)} placeholder="buscar por nombre o por tag…" />
          </span>
          <Segmented
            label="Peso del glifo"
            value={weight}
            onChange={setWeight}
            options={weights.map(p => ({ value: p.value, label: p.label }))}
            size="sm"
          />
          <span className={cls.sizeSlot}>
            <Slider value={size} onChange={setSize} min={12} max={40} label="Tamaño" />
            <Mono>{size}</Mono>
          </span>
        </Cluster>

        {visible.length === 0 ? (
          <div className={cls.emptySlot}>
            <EmptyState
              size="sm"
              icon="search_off"
              title="Ningún icono con eso"
              body={`Los tags son los de Google y están en inglés. Si no está en el set, buscalo en el catálogo completo: npm run icons -w @milo/ui -- search ${q.trim() || '…'}`}
            />
          </div>
        ) : (
          <div
            className={cls.iconGrid}
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
              '--icon-wght': weight,
            } as CSSProperties}
          >
            {visible.map(name => (
              <button
                key={name}
                type="button"
                onClick={() => copy(name)}
                title={iconTags[name] || name}
                className={`${cls.iconTile} bg-surface`}
              >
                <span className={cls.glyphSlot} style={{ height: 40 }}>
                  <Icon name={name} size={size} />
                </span>
                <span className={cls.glyphName}>
                  {copied === name ? 'copiado' : name}
                </span>
              </button>
            ))}
          </div>
        )}
        <Footnote>
          Click en un icono copia <Mono>{'<Icon name="…" />'}</Mono>. El title trae los tags con los
          que se puede buscar.
        </Footnote>
      </Section>

      <Section
        title="Los tamaños"
        note="Seis pasos pares. Antes eran nueve valores y tres de ellos impares, que salieron de encajar ópticamente dibujos propios; con una fuente un tamaño impar cae en media grilla de píxeles y se ve borroso."
      >
        <Panel>
          {sizes.map(e => (
            <Variant key={e.px} name={`${e.px}`}>
              <Icon name="calendar_month" size={e.px} />
              <span className={cls.sizeRole}>{e.role}</span>
            </Variant>
          ))}
        </Panel>
      </Section>

      <Section
        title="El gris no es una prop"
        note="La regla vieja decía 'icono en gris ⇒ weight 1.5' y era imposible de cumplir: el gris se hereda de un ancestro y el call site no tiene cómo saberlo. Ahora es la utilidad `icon-muted`, que pone el color y sube el peso juntos. Se cumple sola."
      >
        <Panel>
          <Variant name="en tinta">
            <Icon name="search" size={20} />
            <span className={cls.defaultNote}>peso 300</span>
          </Variant>
          <Variant name="icon-muted">
            <Icon name="search" size={20} className="icon-muted" />
            <span className={cls.mutedNote}>el peso sube a 400 solo, sin prop</span>
          </Variant>
          <Variant name="el error">
            <Icon name="search" size={20} className={cls.plainGrayIcon} />
            <span className={cls.plainGrayNote}>gris sin la utilidad: queda en 300 y se apaga</span>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Cómo se agrega uno"
        note="Hay más de tres mil novecientos en el catálogo y el set trae los que usamos. Agregar uno es un comando, no dibujar un path."
      >
        <Panel>
          <Variant name="buscar">
            <Mono>npm run icons -w @milo/ui -- search notification</Mono>
          </Variant>
          <Variant name="agregar">
            <Mono>npm run icons -w @milo/ui -- add rocket_launch</Mono>
          </Variant>
          <Variant name="auditar">
            <Mono>npm run icons -w @milo/ui -- check</Mono>
          </Variant>
        </Panel>
        <p className={cls.commandNote}>
          <code className={cls.commandName}>add</code> hace tres preguntas antes de bajar nada:
          si el nombre existe (y si no, sugiere los cinco más parecidos), si ya lo tenemos, y si hay
          uno en el set que comparta tags y probablemente sirva igual. La tercera es la que evita
          llegar a doscientos iconos con seis variantes de engranaje, y para saltearla hay que
          escribir <Mono>--yes</Mono>. El catálogo está versionado, así que buscar funciona sin
          internet.
        </p>
      </Section>

      <Section title="Props">
        <Props of={['Icon', 'FolderIcon']} />
      </Section>

      <Section
        title="El costo, que conviene saber"
        note="Firefox deja desactivar 'permitir que las páginas elijan sus propias fuentes', y hay gente que lo usa por dislexia o baja visión. Con esa opción todos los iconos quedan en cuadraditos. Un SVG era inmune: es el precio de que el peso sea un eje de verdad, y está escrito y no escondido."
      >
        <div />
      </Section>
    
      <Section title="Accesibilidad">
        <Note icon="warning" title="Sesenta y cinco de los ciento setenta y dos no los usa nadie">
        `npm run icons -w @milo/ui -- check` los lista. Sacarlos llevaría la fuente de 64 KB a 27,
        medido subseteándola de verdad. No se sacan porque el editor y los gráficos van a consumir
        varios, y traer uno de vuelta es un comando; pero el número conviene mirarlo cada tanto,
        porque doscientos iconos con seis variantes de engranaje es exactamente lo que `icons add`
        existe para evitar.
      </Note>

      <Note title="Un glifo que falta deja el hueco, no la pantalla en blanco">
        Un nombre que el manifiesto no tiene no resuelve a ningún codepoint, y
        `String.fromCodePoint` de eso lanza. Adentro de un render no deja un icono roto:
        deja la aplicación entera sin dibujar, que es lo que alguien lee como "el sitio está
        caído". Desde el código no puede pasar (el tipo es la unión del manifiesto y `icons check`
        corre al lado de `typecheck`): pasa cuando el módulo que el navegador tiene y el del disco
        se separan, que es la trampa conocida del dev server. Así que el glifo se saltea y el resto
        de la pantalla sigue en pie.
      </Note>

      <A11y items={[
          'Los glifos van aria-hidden: un icono es una imagen del texto que tiene al lado, no una segunda lectura.',
          'Un icono sin texto vive dentro de un IconButton, que exige su label.',
          'El glifo lleva translate="no": es texto, y un traductor automático puede reescribirlo.',
          'Si alguien desactiva las fuentes de la página, los iconos desaparecen. Es el precio de que el peso sea un eje real y está dicho, no escondido.',
        ]} />
      </Section>
    </Page>
  )
}
