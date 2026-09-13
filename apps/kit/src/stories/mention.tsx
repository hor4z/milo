import { Mention } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

export function MentionStory() {
  return (
    <Page
      title="Mention"
      kind="Editor"
      imports="import { Mention } from '@milo/ui'"
      lead="Una referencia adentro del texto: quién o qué. Va en el renglón y no lo interrumpe."
    >
      <Section
        title="En un párrafo"
        note="Es la prueba que importa: los renglones de arriba y de abajo tienen que seguir a la misma distancia. Con la caja de un chip, el renglón que lleva una mención se separa de los otros y el párrafo se ve roto."
      >
        <div className="max-w-[640px] rounded-xl border border-line bg-surface p-6">
          <p className="text-reading text-ink">
            Para el jueves, <Mention name="Ana Pérez" src={face(1)} href="#avatar" /> y{' '}
            <Mention name="Bruno Díaz" src={face(2)} href="#avatar" /> tienen que subir el informe
            del experimento a <Mention name="Ciencias · 5.º B" icon="folder" href="#folder" />. Si
            algo no se entiende, escríbanlo en el bloque de dudas y lo vemos en clase — la consigna
            entera está en <Mention name="Empuje y flotación" icon="description" href="#book" />, y
            la parte de las mediciones la explicó <Mention name="Carla Sosa" src={face(3)} /> el
            martes.
          </p>
        </div>
      </Section>

      <Section title="Sueltas" note="Una persona lleva su foto o su inicial; lo que no es una persona lleva un glifo.">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface p-6 text-reading">
          <Mention name="Ana Pérez" src={face(1)} href="#avatar" />
          <Mention name="Elena Vega" />
          <Mention name="Matemática · 4.º A" icon="folder" href="#folder" />
          <Mention name="Fracciones equivalentes" icon="description" />
        </div>
      </Section>

      <Note title="Mention o Chip">
        El `Chip` es una pieza de una fila: un filtro, una categoría, algo que se saca con una cruz.
        La `Mention` vive adentro de una oración y se lee con ella. Si está en un párrafo, es
        mención; si está en una barra, es chip.
      </Note>

      <Props of="Mention" />

      <A11y
        items={[
          'Sin `href` es texto: no promete un lugar al que ir ni recibe el foco.',
          'La foto va con `alt` vacío — el nombre está escrito al lado, y anunciarlo dos veces es ruido.',
          'Con `href` es un enlace de verdad, así que aparece en la lista de enlaces de la página con el nombre como texto.',
          'Y lleva subrayado, como todo enlace del sistema: adentro de un párrafo, el fondo teñido lo distingue solo por color, y eso no le llega a quien no separa el azul del negro.',
        ]}
      />
    </Page>
  )
}
