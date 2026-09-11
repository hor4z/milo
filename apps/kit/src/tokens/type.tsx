import { Block, Mono, Section } from '../kit'

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
    <Section
      title="Tipografía"
      note="Base 12px con peso 500 y line-height fijo de 16. El peso 500 de base no es capricho: a 12px el 400 de Inter se lee lavado sobre un fondo casi blanco. Y el leading único es para que una fila de 12 y una de 14 sigan alineadas entre sí."
    >
      <Block label="Familias">
        <div className="flex flex-col gap-3">
          <Specimen family="font-sans" token="--font-sans" sample="La interfaz entera, de 11 a 20" />
          <Specimen family="font-display" token="--font-display" sample="Los títulos grandes" />
          <Specimen family="font-mono" token="--font-mono" sample="0123456789 · tokens y valores" />
        </div>
      </Block>

      <Block label="Escala" note="Del md para arriba el texto de un control es 14/600: un botón con el mismo tamaño de letra que su entorno no se lee como accionable.">
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
      </Block>

      <Block label="Pesos" note="Tres y nada más: 500 la interfaz, 600 lo accionable y los títulos de fila, 700 solo en display.">
        <div className="flex flex-wrap gap-6 rounded-xl border border-line bg-surface p-4">
          <div><div className="text-base font-medium">Peso 500</div><Mono>font-medium</Mono></div>
          <div><div className="text-base font-semibold">Peso 600</div><Mono>font-semibold</Mono></div>
          <div><div className="font-display text-base font-bold">Peso 700</div><Mono>font-bold · display</Mono></div>
        </div>
      </Block>

      <Block label="Interletrado y leading">
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
      </Block>
    </Section>
  )
}

function Specimen({ family, token, sample }: { family: string; token: string; sample: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <div className={`${family} text-2xl font-semibold`}>{sample}</div>
      <div className="mt-2"><Mono>{token}</Mono></div>
    </div>
  )
}
