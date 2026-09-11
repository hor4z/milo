import { Icon, cx, type IconName } from '@melu/ui'
import { Mono } from './kit'

/**
 * La portada. No es decoración: es lo que evita que alguien abra el kit, vea
 * doscientos cuadraditos y tenga que deducir de qué se trata el sistema.
 *
 * Dice cuatro cosas y nada más: qué es esto, las cuatro decisiones que explican
 * casi todo lo que va a ver, cómo está organizado, y qué NO es. Lo último
 * importa tanto como el resto — este repo se confundió con una librería más de
 * una vez.
 */

const decisiones: { title: string; body: string }[] = [
  {
    title: 'Base 12, peso 500, leading fijo de 16',
    body: 'El 500 de base se decidió contra Inter, donde el 400 a 12px se leía lavado sobre un fondo casi blanco; con Geist no se volvió a medir. El line-height único es para que una fila de 12 y una de 14 sigan alineadas entre sí.',
  },
  {
    title: 'Monocroma, con dos excepciones acotadas',
    body: 'Rampa casi neutra de nueve pasos. El ámbar señala y se usa poquísimo; el azul es el CTA y el arco del spinner; las marcas de color identifican una fila en una lista. Nada más lleva color.',
  },
  {
    title: 'El estado activo se marca con relieve, no con color',
    body: 'En una interfaz monocroma eso distingue más que teñir el texto, y no gasta el único acento que hay. Corolario: el texto de un item inactivo va en tinta, no en gris.',
  },
  {
    title: 'El radio de un hijo es el del padre menos su padding',
    body: 'Un 24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve doble; si queda más cuadrado, se ven dos curvas distintas.',
  },
]

const grupos: { icon: IconName; label: string; body: string; first: string }[] = [
  {
    icon: 'image', label: 'Tokens', first: 'color',
    body: 'La identidad: la rampa, los roles, la tipografía, las medidas del shell, los radios y las cinco recetas de relieve. Los valores se leen del navegador en vivo, así que un rol roto aparece vacío en vez de aparecer correcto.',
  },
  {
    icon: 'sliders', label: 'Componentes', first: 'button',
    body: 'Una historia por pieza, con sus variantes, sus estados y una tabla de props que dice cuándo usar cada una — no solo su tipo.',
  },
  {
    icon: 'cube', label: 'Patrones', first: 'list',
    body: 'Lo compuesto: la lista de acciones, los contenedores, el item de nav y los tres overlays. Los overlays van con disparadores vivos porque casi todo lo que costó en ellos solo se ve abriéndolos.',
  },
]

export function Intro({ go }: { go: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-10">
      <header>
        <Mono>melu · design system</Mono>
        <h1 className="mt-3 max-w-[26ch] font-display text-display font-bold tracking-[-0.03em]">
          El sistema, funcionando
        </h1>
        <p className="mt-4 max-w-[68ch] text-base font-medium text-ink-muted">
          Esto no es una lámina de estilos: cada pieza de acá es el componente real, con su
          estado y su teclado. Lo que se decida en este kit se porta a{' '}
          <span className="font-mono text-xs text-ink">packages/ui</span> de melu, que es el
          design system de verdad.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold">Las cuatro decisiones que explican el resto</h2>
        <div className="mt-3 grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {decisiones.map((d, i) => (
            <div key={d.title} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-baseline gap-2.5">
                <span className="tabular font-mono text-2xs text-ink-muted">0{i + 1}</span>
                <div className="text-xs font-semibold text-ink">{d.title}</div>
              </div>
              <p className="mt-2 text-2xs text-ink-muted">{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold">Cómo está organizado</h2>
        <div className="mt-3 flex flex-col gap-2">
          {grupos.map(g => (
            <button
              key={g.label}
              onClick={() => go(g.first)}
              className={cx(
                'flex items-start gap-3.5 rounded-xl bg-muted p-4 text-left',
                'transition-[background-color,box-shadow] duration-[120ms] ease-out',
                'hover:bg-surface hover:shadow-card',
              )}
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-surface shadow-[0_0_0_1px_var(--border)]">
                <Icon name={g.icon} size={22} weight={1.5} className="text-ink" />
              </span>
              <span className="min-w-0">
                <span className="block text-md font-semibold text-ink">{g.label}</span>
                <span className="mt-1 block max-w-[68ch] text-base font-medium text-ink-muted">{g.body}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold">Lo que no es</h2>
        <ul className="mt-3 flex max-w-[68ch] flex-col gap-2">
          {[
            'No es una librería publicada. Los paquetes son privados y las apps consumen el .tsx directo, sin build intermedio.',
            'No tiene backend ni datos reales. Nada persiste salvo las preferencias, y el tema vive en localStorage.',
            'No es un clon terminado de la referencia de UI8. De ahí salieron medidas y recetas de sombra; las pantallas que falten se resuelven con criterio propio.',
          ].map(t => (
            <li key={t} className="flex gap-2.5 text-xs font-medium text-ink-muted">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-ink-muted" />
              {t}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
