import css from './relief.module.css'
import { Note, Page, Section, Stack } from '../kit'

const recipes = [
  {
    cls: 'inset-relief',
    back: css.plateInset,
    token: '--relief-inset',
    role: 'lo hundido que no es una marca',
    detail: 'canto arriba y nada más: no tiene tono propio ni cae hacia afuera',
    used: 'Kbd · Nav · EmptyState · SettingsModal',
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
        note="Las dos están escritas al lado de su token."
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

      <Note icon="visibility_off" title="Tres tokens sin consumidor">
        `--relief-solid`, `--relief-brand` y `--relief-brand-pressed` no los usa ninguna pieza: son de cuando los botones tenían volumen. Están a la vista para que nadie los agarre creyendo que son la receta de algo.
      </Note>

      <Note title="Un campo no lleva relieve">
        El relieve dice "esto sobresale" o "esto se aprieta", y un campo no es ninguna de las dos: es un
        lugar donde apoyar texto. Los cuatro campos del sistema se dibujan con un fondo y una línea, y
        al enfocarse se les tiñe el borde que ya tenían.
      </Note>
    </Page>
  )
}
