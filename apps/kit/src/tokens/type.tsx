import { useEffect, useState } from 'react'
import { Mono, Page, Section, useTokens } from '../kit'

const scale = [
  { cls: 'text-2xs', px: 11, role: 'kbd, metadatos, contadores' },
  { cls: 'text-xs', px: 12, role: 'la base de la interfaz' },
  { cls: 'text-sm', px: 13, role: 'poco usado' },
  { cls: 'text-base', px: 14, role: 'botones y texto con énfasis' },
  { cls: 'text-md', px: 16, role: 'título de una fila de lista' },
  { cls: 'text-lg', px: 20, role: 'título de pantalla' },
  { cls: 'text-xl', px: 24, role: 'título de sección' },
  { cls: 'text-2xl', px: 32, role: '' },
  { cls: 'text-display', px: 40, role: 'portadas' },
] as const

export function TypeSection() {
  return (
    <Page
      title="Tipografía"
      lead="Base 12px con peso 400 y line-height fijo de 16. Estuvo en 500, que se decidió contra Inter: ahí el 400 a 12px se leía lavado sobre un fondo casi blanco. Instrument Sans dibuja más grueso al mismo número, así que los tres escalones bajaron uno entero. El leading único es para que una fila de 12 y una de 14 sigan alineadas entre sí."
    >
      <Section
        title="Familias"
        note="Instrument Sans y nada más: los tres roles son la misma familia. Display y cuerpo lo eran ya a propósito —a 40px lo que separa un título del cuerpo es el tamaño y el tracking, no un dibujo distinto de la letra— y ahora el rol `mono` también. Lo que ese rol pierde es el ancho fijo, y lo que alinea una columna de valores pasa a ser `tabular`: ancho fijo para los números sin cambiar de letra. Alcanza para precios, métricas y una columna de tabla; no alcanzaría para un bloque de código, que en el sistema no hay. Por acá pasaron Inter + Inter Tight + JetBrains Mono, después Geist + Geist Mono, y ahora una sola."
      >
        <div className="flex flex-col gap-3">
          <Specimen family="font-sans" token="--font-sans" rol="la interfaz entera, de 11 a 20" muestra="Doce actividades en siete espacios" px={24} />
          <Specimen family="font-display" token="--font-display" rol="las portadas, a 40" muestra="El sistema" px={40} />
          <Specimen family="font-mono" token="--font-mono" rol="tokens, valores y atajos" muestra="0123456789 · --shade-05" px={24} mono />
        </div>
      </Section>

      <Section title="Escala" note="Del md para arriba el texto de un control es 14/600: un botón con el mismo tamaño de letra que su entorno no se lee como accionable.">
        <div className="rounded-xl border border-line bg-surface px-4">
          {scale.map(s => (
            <div key={s.cls} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line py-3.5 first:border-t-0">
              <span className="w-24 shrink-0"><Mono>{s.cls}</Mono></span>
              <span className="w-10 shrink-0 tabular"><Mono>{s.px}px</Mono></span>
              <span className={`${s.cls} min-w-0 flex-1 font-medium`}>Doce actividades en siete espacios</span>
              {s.role && <span className="text-2xs text-ink-muted">{s.role}</span>}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Pesos" note="Tres y nada más: 400 la interfaz, 500 lo accionable y los títulos de fila, 600 solo en display. Las utilidades siguen llamándose medium · semibold · bold porque son el nombre del rol, no del número: el número se cambia en un lugar, el rol no se renombra en doscientos call sites.">
        <div className="flex flex-wrap gap-6 rounded-xl border border-line bg-surface p-4">
          <div><div className="text-base font-medium">Peso 400</div><Mono>font-medium · la interfaz</Mono></div>
          <div><div className="text-base font-semibold">Peso 500</div><Mono>font-semibold · lo accionable</Mono></div>
          <div><div className="font-display text-base font-bold">Peso 600</div><Mono>font-bold · display</Mono></div>
        </div>
      </Section>

      <Section title="Interletrado y leading">
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4">
          <div>
            <div className="text-xl font-semibold tracking-[-0.015em]">Título con tracking cerrado</div>
            <Mono>--tracking-tight · -0.015em · solo de 20 para arriba</Mono>
          </div>
          <div>
            <div className="text-2xs font-semibold tracking-[0.04em] text-ink-muted uppercase">Rótulo con tracking abierto</div>
            <Mono>--tracking-wide · 0.04em</Mono>
          </div>
          <div>
            <div className="text-xs font-medium">Dos líneas de interfaz, las dos con el mismo<br />line-height de 16 sin importar el tamaño</div>
            <Mono>--leading-ui · 16px</Mono>
          </div>
        </div>
      </Section>
    </Page>
  )
}

/** Un espécimen dice qué familia es y, sobre todo, cuál se está dibujando de verdad. */
function Specimen({ family, token, rol, muestra, px, mono }: {
  family: string
  token: string
  rol: string
  muestra: string
  px: number
  mono?: boolean
}) {
  const valores = useTokens([token])
  const stack = valores[token] ?? ''
  const dibujando = useFamiliaReal(stack)
  const primera = stack.split(',')[0].replace(/["']/g, '').trim()
  const cargada = dibujando === primera

  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-base font-semibold">
          {primera || '—'} <span className="font-medium text-ink-muted">· {rol}</span>
        </span>
        <span className="text-2xs text-ink-muted">
          {dibujando
            ? cargada
              ? 'se está dibujando con esta'
              : `OJO: no cargó, está cayendo a ${dibujando}`
            : 'midiendo…'}
        </span>
      </div>
      <div className={`${family} mt-3 font-semibold`} style={{ fontSize: px, lineHeight: 1.1 }}>
        {muestra}
      </div>
      <div className={`${family} mt-1 text-lg font-medium text-ink-muted`}>
        {mono ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'}
      </div>
      <div className={`${family} text-lg font-medium text-ink-muted`}>
        {mono ? '{ } [ ] ( ) < > / \\ | — _ = + * & % $ #' : 'abcdefghijklmnñopqrstuvwxyz · 0123456789 · ¿? ¡! áéíóú'}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Mono>{token}</Mono>
        <Mono>{stack || '(vacío: el rol está roto)'}</Mono>
      </div>
    </div>
  )
}

/** Cuál de las familias del stack está dibujando de verdad. */
function useFamiliaReal(stack: string) {
  const [real, setReal] = useState('')
  useEffect(() => {
    if (!stack) return
    let vivo = true
    const genericas = new Set(['ui-sans-serif', 'ui-monospace', 'system-ui', 'sans-serif', 'monospace', 'serif', '-apple-system'])
    const ctx = document.createElement('canvas').getContext('2d')
    if (!ctx) { setReal('no se pudo medir'); return }

    const texto = 'mmmMMMwwwiiil10OQ · ABCdef'
    const ancho = (f: string) => { ctx.font = `48px ${f}`; return ctx.measureText(texto).width }
    const existe = (f: string) => ['monospace', 'serif'].some(g => ancho(`"${f}", ${g}`) !== ancho(g))

    document.fonts.ready.then(() => {
      if (!vivo) return
      for (const parte of stack.split(',')) {
        const f = parte.replace(/["']/g, '').trim()
        if (genericas.has(f)) return setReal(f)
        if (existe(f)) return setReal(f)
      }
      setReal('ninguna del stack')
    })
    return () => { vivo = false }
  }, [stack])
  return real
}
