import { Book, Icon } from '@melu/ui'
import { Mono, Page, Props, Section } from '../kit'

export function BookStory() {
  return (
    <Page
      title="Book"
      kind="Superficies"
      imports="import { Book } from '@melu/ui'"
      lead="Una tapa en tres dimensiones, con su lomo y su canto de hojas. Es una portada —un tema, una guía, una colección— y no una tarjeta: en una grilla de doce filas iguales, doce libros son doce objetos pidiendo atención y ninguno la consigue. Para eso está Card."
    >
      <Section
        title="Las dos variantes"
        note="`stripe` lleva una franja de color arriba con el icono, y el título abajo sobre papel; `simple` tiñe la tapa entera. Con el título solo alcanza, `simple`; si hace falta categoría o jerarquía, `stripe`. Pasá el mouse por encima: al girar aparecen el lomo y las hojas, y ahí se entiende que es un volumen y no un rectángulo con sombra."
      >
        <div className="flex flex-wrap items-end gap-10 rounded-xl border border-line bg-surface px-6 py-8">
          <Book title="La experiencia de doce actividades en siete espacios" />
          <Book
            variant="stripe"
            color="var(--label-blue)"
            icon={<Icon name="menu_book" size={44} />}
            title="Guía de la plataforma"
          />
          <Book
            variant="simple"
            color="var(--label-purple)"
            textColor="var(--on-label)"
            title="Diseño de sistemas en melu"
          />
        </div>
      </Section>

      <Section
        title="El color sale de un token"
        note="Un hex escrito a mano en una tapa es el mismo bug que en cualquier otro lado: con un token, la tapa sigue al tema. La familia de etiquetas es la que corresponde acá — es la de lo chico y lo que identifica, y una portada identifica."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface px-6 py-8">
          {([
            ['--label-green', 'Ciencias'],
            ['--label-orange', 'Matemática'],
            ['--label-pink', 'Lengua'],
            ['--label-teal', 'Sociales'],
          ] as const).map(([t, label]) => (
            <Book key={t} variant="simple" color={`var(${t})`} textColor="var(--on-label)" title={label} width={140} />
          ))}
        </div>
      </Section>

      <Section
        title="El ancho manda"
        note="Adentro del libro no hay un solo px suelto: todo está en por ciento de su propio ancho, incluido el título. Por eso el mismo libro a 140 y a 260 es el mismo dibujo y no dos. Es el único texto del sistema que no usa la escala tipográfica, y es a propósito — la tapa es un dibujo y el título es parte del dibujo."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface px-6 py-8">
          {[140, 180, 220, 260].map(w => (
            <div key={w} className="flex flex-col items-center gap-2">
              <Book title="Doce actividades en siete espacios" width={w} />
              <Mono>{w}</Mono>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Con textura"
        note="Para una portada sola. En una fila de libros la textura le compite al título, que es lo que hay que leer. El grano es de acá —dos tramas cruzadas a alpha muy bajo— y no una imagen traída de afuera: no cuesta un request y sigue al tema."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface px-6 py-8">
          <Book variant="simple" color="var(--label-orange)" textColor="var(--on-label)" textured title="Diseño de sistemas" />
          <Book variant="simple" color="var(--label-purple)" textColor="var(--on-label)" title="Diseño de sistemas" />
          <span className="self-center text-xs text-ink-muted">con textura · sin textura</span>
        </div>
      </Section>

      <Section
        title="Como enlace"
        note="Con `href` el libro es un `<a>`, y el anillo de foco va en el enlace y no en la tapa: el que navega con teclado tiene que ver dónde está el blanco de verdad. Tabulá hasta acá."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface px-6 py-8">
          <Book href="#" title="Se puede tabular hasta acá" width={160} />
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'title', type: 'string', note: 'obligatorio' },
          { name: 'variant', type: "'stripe' | 'simple'", def: "'stripe'" },
          { name: 'color', type: 'string', note: 'un token, no un hex' },
          { name: 'textColor', type: 'string', note: 'sobre un color vivo, --on-label' },
          { name: 'width', type: 'number | { sm, md }', def: '196', note: 'dos anchos para que no se aplaste en pantalla chica' },
          { name: 'textured', type: 'boolean', note: 'solo para una portada sola' },
          { name: 'icon', type: 'ReactNode' },
          { name: 'illustration', type: 'ReactNode', note: 'llena la franja o la tapa' },
          { name: 'href', type: 'string', note: 'lo convierte en <a>' },
        ]} />
      </Section>

      <Section
        title="De dónde salió"
        note="La idea y las medidas son del Book de Geist, el sistema de Vercel: proporción 49/60, lomo al 29% del ancho, perspectiva de 900 y el giro de -20°. Eso es lo que se tomó, que es lo que hace cualquiera con una referencia enfrente. El dibujo está armado con los tokens y los relieves de acá."
      >
        <div />
      </Section>
    </Page>
  )
}
