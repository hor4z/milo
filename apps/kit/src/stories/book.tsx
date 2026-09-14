import s from './book.module.css'
import { Book, Icon } from '@milo/ui'
import { A11y, Mono, Page, Props, Section } from '../kit'

export function BookStory() {
  return (
    <Page
      title="Book"
      kind="Superficies"
      imports="import { Book } from '@milo/ui'"
      lead="Una tapa en tres dimensiones, con su lomo y su canto de hojas. Es una portada (un tema, una guía, una colección) y no una tarjeta: en una grilla de doce filas iguales, doce libros son doce objetos pidiendo atención y ninguno la consigue. Para eso está Card."
    >
      <Section
        title="Las dos variantes"
        note="`stripe` lleva una franja de color arriba con el icono, y el título abajo sobre papel; `simple` tiñe la tapa entera. Con el título solo alcanza, `simple`; si hace falta categoría o jerarquía, `stripe`. Pasá el mouse por encima: al girar aparecen el lomo y las hojas, y ahí se entiende que es un volumen y no un rectángulo con sombra."
      >
        <div className={`${s.variantShelf} bg-surface`}>
          <Book title="La experiencia de doce actividades en siete espacios" />
          <Book
            variant="stripe"
            color="var(--label-blue)"
            icon={<Icon name="menu_book" size={40} />}
            title="Guía de la plataforma"
          />
          <Book
            variant="simple"
            color="var(--label-purple)"
            textColor="var(--on-label)"
            title="Diseño de sistemas en milo"
          />
        </div>
      </Section>

      <Section
        title="El color sale de un token"
        note="Un hex escrito a mano en una tapa es el mismo bug que en cualquier otro lado: con un token, la tapa sigue al tema. La familia de etiquetas es la que corresponde acá: es la de lo chico y lo que identifica, y una portada identifica."
      >
        <div className={`${s.colorShelf} bg-surface`}>
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
        note="Adentro del libro no hay un solo px suelto: todo está en por ciento de su propio ancho, incluido el título. Por eso el mismo libro a 140 y a 260 es el mismo dibujo y no dos. Es el único texto del sistema que no usa la escala tipográfica, y es a propósito: la tapa es un dibujo y el título es parte del dibujo."
      >
        <div className={`${s.widthShelf} bg-surface`}>
          {[140, 180, 220, 260].map(w => (
            <div key={w} className={s.widthSample}>
              <Book title="Doce actividades en siete espacios" width={w} />
              <Mono>{w}</Mono>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Con textura"
        note="Para una portada sola. En una fila de libros la textura le compite al título, que es lo que hay que leer. El grano es de acá (dos tramas cruzadas a alpha muy bajo) y no una imagen traída de afuera: no cuesta un request y sigue al tema."
      >
        <div className={`${s.textureShelf} bg-surface`}>
          <Book variant="simple" color="var(--label-orange)" textColor="var(--on-label)" textured title="Diseño de sistemas" />
          <Book variant="simple" color="var(--label-purple)" textColor="var(--on-label)" title="Diseño de sistemas" />
          <span className={s.textureCaption}>con textura · sin textura</span>
        </div>
      </Section>

      <Section
        title="Como enlace"
        note="Con `href` el libro es un `<a>`, y el anillo de foco va en el enlace y no en la tapa: el que navega con teclado tiene que ver dónde está el blanco de verdad. Tabulá hasta acá."
      >
        <div className={`${s.linkShelf} bg-surface`}>
          <Book href="#" title="Se puede tabular hasta acá" width={160} />
        </div>
      </Section>

      <Section title="Props">
        <Props of="Book" />
      </Section>

      <Section
        title="De dónde salió"
        note="La idea y las medidas son del Book de Geist, el sistema de Vercel: proporción 49/60, lomo al 29% del ancho, perspectiva de 900 y el giro de -20°. Eso es lo que se tomó, que es lo que hace cualquiera con una referencia enfrente. El dibujo está armado con los tokens y los relieves de acá."
      >
        <div />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'La portada es decorativa: lo que se lee es el título que va al lado.',
        ]} />
      </Section>
    </Page>
  )
}
