import css from './relief.module.css'
import { Note, Page, Section, Stack } from '../kit'

const recipes = [
  {
    cls: 'inset-relief',
    back: css.plateInset,
    token: '--relief-inset',
    role: 'lo hundido que no es una marca',
    detail: 'canto arriba y nada más: no tiene tono propio ni cae hacia afuera',
    used: 'Checkbox · Radio · Kbd · Nav · EmptyState · SettingsModal',
  },
  {
    cls: 'mark',
    back: css.plateMark,
    token: '--relief-mark',
    role: 'una marca de fila o la inicial de un avatar',
    detail: 'canto adentro, labio abajo y una caída de un píxel, todo en el tono de la marca',
    used: 'Avatar · Chip · List',
  },
] as const

const layers = [
  { token: '--relief-card', role: 'una tarjeta apoyada', used: 'Card · List' },
  { token: '--relief-toolbar', role: 'una barra flotante', used: 'Toolbar · Card · List' },
  { token: '--relief-popover', role: 'lo que flota sobre todo', used: 'trece piezas, de Tooltip a Modal' },
] as const

export function ReliefSection() {
  return (
    <Page
      title="Relieve"
      kind="Fundamentos"
      lead="Mezcla luz interior arriba y sombra abajo para decir cuánto se levanta algo. Los botones no lo usan: van planos, y lo que los separa del fondo es el relleno. Lo que sí lleva volumen es lo que flota sobre la página, que son trece piezas, y lo hundido, que es donde el relieve dice algo que el color no puede decir."
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
                <span className={css.used}>{r.used}</span>
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
                <span className={css.used}>{c.used}</span>
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
              Una marca lleva canto, labio y caída, y todo eso en su propio tono; algo que solo está
              apagado lleva el canto y nada más. Mezclarlas hace que un kbd y la inicial de un avatar
              se vean igual, que son dos cosas que no tienen nada que ver.
            </p>
          </div>
        </div>
      </Section>

      <Note icon="visibility_off" title="Lo que está declarado y no usa nadie">
        Tres tokens quedaron sin consumidor y conviene que se sepa antes de que alguien los agarre
        creyendo que son la receta de algo: <code>--relief-solid</code>, <code>--relief-brand</code> y
        <code>--relief-brand-pressed</code>, más la clase global <code>.pressed</code>. Son de cuando
        los botones tenían volumen. No se sacaron todavía porque sacarlos es una decisión sobre la
        superficie del paquete, pero ninguno de los cuatro es algo que haya que imitar.
      </Note>

      <Note title="Un campo no lleva relieve">
        El relieve dice "esto sobresale" o "esto se aprieta", y un campo no es ninguna de las dos: es un
        lugar donde apoyar texto. Los cuatro campos del sistema se dibujan con un fondo y una línea, y
        al enfocarse se les tiñe el borde que ya tenían.
      </Note>
    </Page>
  )
}
