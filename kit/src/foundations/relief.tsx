import css from './relief.module.css'
import { Note, Page, Section, Stack } from '../kit'

const recipes = [
  { cls: 'pressed', back: css.platePressed, token: '--relief-pressed', role: 'un toggle con su panel abierto', detail: 'la sombra entra desde abajo, sin canto' },
  { cls: 'inset-relief', back: css.plateInset, token: '--relief-inset', role: 'lo hundido que es una marca', detail: 'kbd, la pista de un segmented: lleva canto y caída' },
  { cls: 'mark', back: css.plateMark, token: '--relief-mark', role: 'una marca de fila o la inicial de un avatar', detail: 'canto adentro, labio abajo y una caída de un píxel, todo en el tono de la marca' },
] as const

const layers = [
  { token: '--relief-card', role: 'una tarjeta apoyada' },
  { token: '--relief-toolbar', role: 'una barra flotante' },
  { token: '--relief-popover', role: 'lo que flota sobre todo' },
] as const

export function ReliefSection() {
  return (
    <Page
      title="Relieve"
      kind="Fundamentos"
      lead="Marca lo que se aprieta y lo que sobresale, mezclando luz interior arriba y sombra abajo. Los botones ya no lo usan: van planos, y lo que los separa del fondo es el relleno. Lo que queda con volumen es lo hundido, que es donde el relieve dice algo que el color no puede decir."
    >
      <Note icon="layers" title="Lo que el relieve dejó de tener que hacer">
        Durante un tiempo el relieve era lo único que separaba una tarjeta del fondo: el papel de
        una pieza y el de la página eran el mismo color. No alcanzaba: con la elevación en alpha
        bajo y a 1x, una pantalla densa se leía como un campo blanco enorme con líneas encima.
        Ahora <code>--surface</code> y <code>--canvas</code> son dos tonos distintos, y eso libera
        al relieve de una carga que no le correspondía: ya no tiene que decir <em>si</em> algo
        existe, solo <strong className={css.emphasis}>cuánto se levanta</strong>. Es la
        razón por la que las sombras de abajo son tan bajas y funcionan igual.
        {' '}
        Eso vale mientras la pieza se apoye en la página. Una tarjeta adentro de otra superficie
        de papel vuelve al problema del principio: los dos fondos son el mismo tono y la sombra,
        que es del 5%, no alcanza para decir dónde empieza. Por eso la <code>Card</code> lleva su
        línea siempre. La sombra dice cuánto se levanta y la línea dice que existe, que son dos
        trabajos distintos y no se reemplazan.
      </Note>

      <Section title="Las recetas que se tocan">
        <div className={css.recipeGrid}>
          {recipes.map(r => (
            <div key={r.token} className={`${css.recipeCard} bg-surface`}>
              <div className={`${r.cls} ${r.back} ${css.recipeSample}`}>
                {r.role}
              </div>
              <Stack gap="xs">
                <code className={css.recipeToken}>{r.token}</code>
                <span className={css.recipeDetail}>{r.detail}</span>
              </Stack>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="La elevación en capas"
        note="Alpha bajo y spread negativo. Cuanto más alto flota algo, más difusa y más lejos cae su sombra."
      >
        <div className={css.layerGrid}>
          {layers.map(c => (
            <div key={c.token} className={css.layerCard}>
              <div className={`${css.layerBox} bg-surface`} style={{ boxShadow: `var(${c.token})` }} />
              <div className={css.layerMeta}>
                <code className={css.layerToken}>{c.token}</code>
                <span className={css.layerRole}>{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Dos cosas que costaron"
        note="Las dos están escritas al lado de su token, y las dos se rompieron antes de quedar escritas."
      >
        <div className={css.lessonGrid}>
          <div className={`${css.edgeCard} bg-surface`}>
            <span className={css.edgeTitle}>El canto no es un escalón de la rampa</span>
            <p className={css.edgeText}>
              <code className={css.tokenName}>--edge</code> es más oscuro que el borde más oscuro, porque tiene
              que dibujar el filo de algo que sobresale. Con el paso 05 puesto ahí, el botón gris se ve
              plano sobre un fondo casi blanco.
            </p>
          </div>
          <div className={`${css.sunkenCard} bg-surface`}>
            <span className={css.sunkenTitle}>Hundido son dos cosas distintas</span>
            <p className={css.sunkenText}>
              Una marca lleva canto y sombra de caída; algo que se aprieta, no. Mezclarlas hace que un
              kbd y un toggle activo se vean igual, que son dos cosas que no tienen nada que ver.
            </p>
          </div>
        </div>
      </Section>

      <Note title="Un campo no lleva relieve">
        El relieve dice "esto sobresale" o "esto se aprieta", y un campo no es ninguna de las dos: es un
        lugar donde apoyar texto. Los cuatro campos del sistema se dibujan con un fondo y una línea, y
        al enfocarse se les tiñe el borde que ya tenían.
      </Note>
    </Page>
  )
}
