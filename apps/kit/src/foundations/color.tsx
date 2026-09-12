import { Note, Page, Ramp, Section, Swatch, useTokens } from '../kit'

const azul = ['--blue-050', '--blue-100', '--blue-200', '--blue-300', '--blue-400', '--blue-500', '--blue-600', '--blue-700', '--blue-800', '--blue-900'] as const

const ramp = ['--shade-01', '--shade-02', '--shade-03', '--shade-04', '--shade-05', '--shade-06', '--shade-07', '--shade-08', '--shade-09'] as const
const marks = ['--mark-green', '--mark-purple', '--mark-orange', '--mark-blue', '--mark-pink'] as const
const labels = ['--label-green', '--label-teal', '--label-blue', '--label-purple', '--label-pink', '--label-orange'] as const
const tints = ['--tint-1', '--tint-2', '--tint-3', '--tint-4', '--tint-5'] as const
const spaces = ['--space-green', '--space-purple', '--space-orange', '--space-blue', '--space-pink'] as const

export function ColorSection() {
  return (
    <Page
      title="Color"
      kind="Fundamentos"
      lead="El azul es el color primario y tiene rampa de diez pasos. Todo lo demás lo dibuja una rampa casi neutra de nueve: el sistema sigue siendo sobrio, pero ya no es monocromo con una excepción."
    >
      <Section
        title="La rampa"
        note="Nueve pasos, y **casi** neutra: lleva C 0.0025 del tono del azul en OKLCH. Es un susurro y tiene que seguir siéndolo — un gris exactamente neutro al lado de un azul saturado se ve de otro sistema, y un gris que se nota azul convierte una interfaz de dos colores en una de tres. Estuvo en 0.006 y era demasiado: los campos se veían celestes. El salto de 05 a 06 es violento a propósito: entre el borde más oscuro y el texto más claro no tiene que haber nada."
      >
        <Ramp tokens={ramp} />
      </Section>

      <Section
        title="El azul primario"
        note="Diez pasos, derivados y no elegidos: se toman el tono y el croma del azul de siempre, se fija una curva de luminosidad que baja parejo, y el croma sube hacia el medio y cae en los extremos — si no, los pasos claros salen lavados y los oscuros embarrados. **El 600 está anclado**: es el escalón donde el blanco encima llega exactamente a 4.5:1, y por eso es el relleno del botón que manda. Antes eran tres valores sueltos elegidos para un botón, y tres no alcanzan para vestir un estado elegido, un fondo suave, una tinta que se lea encima y un borde."
      >
        <Ramp tokens={azul} />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--brand" note="el relleno del CTA · 4.5:1 con blanco" />
          <Swatch token="--brand-hover" note="el mismo, un paso más" />
          <Swatch token="--brand-edge" note="el filo y el labio" />
          <Swatch token="--brand-soft" note="el fondo suave: un estado elegido" />
          <Swatch token="--brand-ink" note="la tinta que va sobre el suave" />
          <Swatch token="--brand-border" note="la línea de una pieza de marca" />
        </div>
      </Section>

      <Section
        title="Superficies: el papel y el escritorio"
        note="**Son dos tonos distintos, y esto cambió.** `--canvas` y `--surface` apuntaban al mismo token con el argumento de que lo que separa una tarjeta del fondo es el relieve. No alcanzaba: con el relieve en alpha bajo y a 1x, el resultado se lee como un campo blanco enorme con líneas encima, y cada widget parece recortado en vez de apoyado. Ahora una pieza es papel y la página es el escritorio, que es como se separan dos superficies desde que existe el papel. El relieve sigue estando y vuelve a decir solo cuánto se levanta algo, en vez de tener que decir si existe."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Swatch token="--canvas" note="el escritorio: el fondo de la página" />
          <Swatch token="--surface" note="el papel: una tarjeta, un panel" />
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
          <Swatch token="--text-placeholder" note="lo que el campo sugiere" />
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
          <Family
            title="mark · la marca de 44 de una fila"
            detail="Relleno pastel y glifo del mismo tono varios pasos más oscuro. La marca vive dentro de una fila clara y tiene lugar para leerse entera sin gritarle al título de al lado."
            tokens={marks}
          />
          <Family
            title="label · lo chico"
            detail="Un chip, el cuadradito de icono de una tarjeta. Van vivos y todos llevan el mismo texto blanco encima. En orden de rueda, porque quien las usa reparte por hash: desordenadas, dos nombres consecutivos caían en dos tonos casi iguales."
            tokens={labels}
          />
          <Family
            title="tint · la superficie grande"
            detail="El hueco 4:3 de una tarjeta, el mock de una novedad. Llevan un dibujo en tinta al 14% encima: saturados, el dibujo desaparece y una grilla de doce tarjetas se vuelve un arcoíris."
            tokens={tints}
          />
          <Family
            title="space · la carpeta de un espacio"
            detail="El único color que se dibuja con SVG, porque la carpeta es bicolor y una fuente monocroma no puede. El color propio por espacio es lo que las deja reconocer de reojo en una lista de siete."
            tokens={spaces}
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

function Family({ title, detail, tokens }: { title: string; detail: string; tokens: readonly string[] }) {
  const vals = useTokens(tokens)
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
      <div className="flex flex-col gap-1">
        <code className="font-mono text-body font-semibold text-ink">{title}</code>
        <p className="max-w-[70ch] text-meta font-medium text-ink-muted">{detail}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tokens.map(t => (
          <div key={t} className="flex items-center gap-2 rounded-lg border border-line px-2 py-2">
            <span className="size-5 rounded-lg" style={{ background: `var(${t})` }} />
            <code className="font-mono text-meta text-ink-muted">{vals[t] || t.replace('--', '')}</code>
          </div>
        ))}
      </div>
    </div>
  )
}
