import { Quote } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

export function QuoteStory() {
  return (
    <Page
      title="Quote"
      kind="Editor"
      imports="import { Quote } from '@milo/ui'"
      lead="Palabras de otro: lo que dijo alguien, un fragmento de un texto, la respuesta de un estudiante que vale leer en clase."
    >
      <Section
        title="La pieza"
        note="La barra va del lado de la lectura y no alrededor: una caja cerrada se lee como un aviso, y esto es texto adentro del texto. Va en el azul de marca y no en gris: en una página de texto corrido un gris más es una línea entre otras, y lo que la barra tiene que hacer es cortar la lectura."
      >
        <div className="flex max-w-[640px] flex-col gap-6">
          <Quote source="Ana, 6.º B">
            Me di cuenta de que si dibujaba el triángulo adentro del rectángulo, la mitad se veía
            sola y no hacía falta la fórmula.
          </Quote>
          <Quote>Lo que no se mide no se puede mejorar, pero no todo lo que importa se puede medir.</Quote>
        </div>
      </Section>

      <Section
        title="Con la fuente declarada"
        note="`cite` deja la dirección en el markup además de escribirla. No se ve, y es lo que permite que alguien la recupere."
      >
        <div className="max-w-[640px]">
          <Quote cite="https://es.wikipedia.org/wiki/Principio_de_Arquímedes" source="Principio de Arquímedes">
            Todo cuerpo sumergido en un fluido experimenta un empuje vertical hacia arriba igual al
            peso del fluido que desaloja.
          </Quote>
        </div>
      </Section>

      <Note title="Quote o Callout">
        La `Quote` son palabras de otro y por eso lleva de quién. El `Callout` son palabras de quien
        escribe, puestas aparte para que no se pasen de largo. Si lo que va adentro se puede
        atribuir, es una cita; si es una aclaración propia, no.
      </Note>

      <Props of="Quote" />

      <A11y
        items={[
          'Es un `blockquote` de verdad, no un párrafo con un borde a la izquierda: quien navega por elementos lo encuentra como cita.',
          'La fuente va en un `figcaption` atado a la cita, no suelta abajo, así que se sabe de qué cita habla.',
          'La barra de la izquierda es decorativa. Lo que dice que es una cita es el markup, no la línea.',
        ]}
      />
    </Page>
  )
}
