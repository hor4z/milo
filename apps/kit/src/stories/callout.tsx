import { Callout } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

export function CalloutStory() {
  return (
    <Page
      title="Callout"
      kind="Editor"
      imports="import { Callout } from '@milo/ui'"
      lead="Un bloque de contenido que pide detenerse: una aclaración, una pista, algo para recordar. Lo escribe quien arma el material, no el sistema."
    >
      <Section title="La pieza">
        <div className="flex max-w-[680px] flex-col gap-3">
          <Callout icon="lightbulb" color="blue" title="Para acordarse">
            La velocidad límite no depende de la masa: depende de la forma y del aire.
          </Callout>
          <Callout icon="science" color="green" title="Probalo">
            Soltá una hoja abierta y la misma hoja hecha un bollo. Cronometrá las dos.
          </Callout>
          <Callout icon="visibility" color="orange" title="Ojo con esto">
            Dos figuras con el mismo perímetro pueden tener áreas muy distintas.
          </Callout>
        </div>
      </Section>

      <Section title="Sin título y sin glifo" note="Cuando lo que hay que decir entra en una línea.">
        <div className="max-w-[680px]">
          <Callout>Todo lo que sigue supone que el rozamiento es despreciable.</Callout>
        </div>
      </Section>

      <Section
        title="Los colores"
        note="Salen de la familia de categorías, la misma de los chips. Son para distinguir un bloque de otro cuando hay varios en una página, no para decir si algo está bien o mal."
      >
        <div className="grid max-w-[680px] gap-3 sm:grid-cols-2">
          {(['neutral', 'blue', 'green', 'teal', 'purple', 'pink', 'orange'] as const).map(c => (
            <Callout key={c} color={c} icon="label">{c}</Callout>
          ))}
        </div>
      </Section>

      <Note title="Callout o Alert">
        El `Alert` lo pone el sistema cuando pasa algo: se guardó, falló, falta algo. El `Callout` es
        parte de lo que se está leyendo y sigue ahí aunque nadie haga nada. Por eso no usa los tonos
        de estado: un bloque de contenido en rojo diría "error" sin que haya ninguno.
      </Note>

      <Props of="Callout" />

      <A11y
        items={[
          'Lleva `role="note"`: se anuncia como una nota al margen sin sumar una región. Con once bloques en una página, once regiones dejarían la lista de saltos inservible.',
          'El glifo es decorativo. Lo que el bloque dice está en su texto, así que sacarlo no pierde nada.',
          'El color nunca es la única diferencia: el título y el glifo dicen de qué se trata.',
        ]}
      />
    </Page>
  )
}
