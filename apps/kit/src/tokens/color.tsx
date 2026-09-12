import { Note, Page, Ramp, Section, Swatch, useTokens } from '../kit'

const rampa = ['--shade-01', '--shade-02', '--shade-03', '--shade-04', '--shade-05', '--shade-06', '--shade-07', '--shade-08', '--shade-09'] as const
const marcas = ['--mark-green', '--mark-purple', '--mark-orange', '--mark-blue', '--mark-pink'] as const
const etiquetas = ['--label-green', '--label-teal', '--label-blue', '--label-purple', '--label-pink', '--label-orange'] as const
const tintes = ['--tint-1', '--tint-2', '--tint-3', '--tint-4', '--tint-5'] as const
const espacios = ['--space-green', '--space-purple', '--space-orange', '--space-blue', '--space-pink'] as const

export function ColorSection() {
  return (
    <Page
      title="Color"
      kind="Guía"
      lead="La interfaz es monocroma. Una rampa casi neutra de nueve pasos dibuja todo, y el color aparece contado: el azul manda, el ámbar señala y tres familias identifican espacios y personas."
    >
      <Section
        title="La rampa"
        note="Nueve pasos de #fcfcfc a #121212. El salto de 05 a 06 es violento a propósito: entre el borde más oscuro y el texto más claro no tiene que haber nada, o aparecen grises que no se distinguen entre sí."
      >
        <Ramp tokens={rampa} />
      </Section>

      <Section
        title="Superficies"
        note="El shell y las piezas comparten el papel. Lo que separa una tarjeta del fondo no es un tono distinto: es el relieve."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--canvas" note="el fondo de la app" />
          <Swatch token="--surface" note="el papel de una pieza" />
          <Swatch token="--surface-alt" note="la banda alterna de una tabla" />
          <Swatch token="--surface-muted" note="lo apagado: una bandeja, un hueco" />
          <Swatch token="--surface-sunken" note="el fondo de algo hundido" />
          <Swatch token="--popover" note="lo que flota" />
        </div>
      </Section>

      <Section title="Bordes y líneas">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--border" note="el divisor de siempre" />
          <Swatch token="--border-strong" note="cuando hay que separar de verdad" />
          <Swatch token="--edge" note="el filo de algo que sobresale" />
          <Swatch token="--field-border" note="la línea de un campo, en tinta" />
          <Swatch token="--focus-border" note="el borde de un campo enfocado" />
          <Swatch token="--track" note="la pista de una barra de progreso" />
        </div>
      </Section>

      <Section
        title="Texto e iconos"
        note="El gris del icono es un paso más oscuro que el del texto: un contorno fino encierra aire y con el mismo gris se lee más apagado que el texto que acompaña. No se escribe a mano — lo pone la utilidad icon-muted, que además sube el peso del glifo, porque el tono y el peso son la misma decisión."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--text" note="lo que se lee" />
          <Swatch token="--text-muted" note="lo que acompaña" />
          <Swatch token="--icon-muted" note="el gris de un glifo" />
          <Swatch token="--text-inverted" note="sobre tinta" />
        </div>
      </Section>

      <Section
        title="El azul, y cuándo"
        note="Es la excepción más usada y la más acotada: el botón que manda, el arco del spinner, el anillo del foco y el relleno de una barra de progreso. solid y brand son el mismo rol —el botón que manda— así que va uno o el otro, nunca los dos en la misma pantalla."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--solid" note="el botón en tinta" />
          <Swatch token="--brand" note="el botón en azul" />
          <Swatch token="--brand-subtle" note="el fondo de un aviso" />
          <Swatch token="--accent" note="el ámbar que señala" />
        </div>
      </Section>

      <Section
        title="Estado"
        note="Cuatro tonos, y ninguno viaja solo: cada uno trae su glifo y su texto, porque un color de estado sin forma no dice nada a quien no distingue colores."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--ok" note="salió bien" />
          <Swatch token="--warn" note="mirá esto" />
          <Swatch token="--bad" note="se rompió" />
          <Swatch token="--ok-subtle" />
          <Swatch token="--warn-subtle" />
          <Swatch token="--bad-subtle" />
        </div>
      </Section>

      <Section
        title="Las tres familias, y qué las separa"
        note="Las tres son de categoría y no se mezclan. La que decide cuál va no es el gusto: es el tamaño de la pieza y qué se apoya encima."
      >
        <div className="flex flex-col gap-5">
          <Familia
            titulo="mark · la marca de 44 de una fila"
            detalle="Relleno pastel y glifo del mismo tono varios pasos más oscuro. La marca vive dentro de una fila clara y tiene lugar para leerse entera sin gritarle al título de al lado."
            tokens={marcas}
          />
          <Familia
            titulo="label · lo chico"
            detalle="Un chip, el cuadradito de icono de una tarjeta. Van vivos y todos llevan el mismo texto blanco encima. En orden de rueda, porque quien las usa reparte por hash: desordenadas, dos nombres consecutivos caían en dos tonos casi iguales."
            tokens={etiquetas}
          />
          <Familia
            titulo="tint · la superficie grande"
            detalle="El hueco 4:3 de una tarjeta, el mock de una novedad. Llevan un dibujo en tinta al 14% encima: saturados, el dibujo desaparece y una grilla de doce tarjetas se vuelve un arcoíris."
            tokens={tintes}
          />
          <Familia
            titulo="space · la carpeta de un espacio"
            detalle="El único color que se dibuja con SVG, porque la carpeta es bicolor y una fuente monocroma no puede. El color propio por espacio es lo que las deja reconocer de reojo en una lista de siete."
            tokens={espacios}
          />
        </div>
      </Section>

      <Note title="Antes de teñir algo">
        Mirá de qué tamaño es la pieza y qué va encima. Los tres roles vivieron un rato juntos bajo el
        mismo nombre y de ahí salieron dos bugs: los chips quedaron pastel cuando ya tenían que ser
        vivos, y al pasar la familia a vivos se llevó puesta la marca de la lista, que tenía que
        quedar pastel.
      </Note>
    </Page>
  )
}

function Familia({ titulo, detalle, tokens }: { titulo: string; detalle: string; tokens: readonly string[] }) {
  const vals = useTokens(tokens)
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-col gap-1">
        <code className="font-mono text-xs font-semibold text-ink">{titulo}</code>
        <p className="max-w-[70ch] text-2xs font-medium text-ink-muted">{detalle}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tokens.map(t => (
          <div key={t} className="flex items-center gap-2 rounded-lg border border-line px-2 py-1.5">
            <span className="size-5 rounded-md" style={{ background: `var(${t})` }} />
            <code className="font-mono text-2xs text-ink-muted">{vals[t] || t.replace('--', '')}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
