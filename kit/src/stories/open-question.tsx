import { useState } from 'react'
import { OpenQuestion } from '@milo/ui/open-question'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

export function OpenQuestionStory() {
  const [texto, setTexto] = useState('')

  return (
    <Page
      title="OpenQuestion"
      kind="Formularios"
      imports="import { OpenQuestion } from '@milo/ui/open-question'"
      lead="Una pregunta que se responde escribiendo. No la corrige nadie solo: lo que se escribe acá lo lee una persona, y por eso la pieza no tiene noción de respuesta correcta."
    >
      <Section
        title="Respondiendo"
        note="El enunciado va como hijo porque lo escribe una persona; lo que se escribe abajo es dato y va por `value`. El tope no frena la tecla en silencio: el campo avisa recién cuando quedan pocos caracteres."
      >
        <Panel>
          <Variant name="en blanco" note="El `placeholder` es una pista de por dónde empezar, nunca la respuesta.">
            <Stack width="sm">
              <OpenQuestion
                value={texto}
                onChange={setTexto}
                rows={3}
                maxLength={240}
                placeholder="Porque ahí se junta todo el curso y además está el eco del techo"
              >
                <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
                <OpenQuestion.Hint>Dos renglones alcanzan.</OpenQuestion.Hint>
              </OpenQuestion>
            </Stack>
          </Variant>
          <Variant name="ya entregada" note="Sin `onChange` la pregunta se lee y no se escribe, así que una consigna cerrada no necesita pasar `readOnly` además.">
            <Stack width="sm">
              <OpenQuestion value="Porque el buffet junta a los dos turnos al mismo tiempo y el techo es de chapa.">
                <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
              </OpenQuestion>
            </Stack>
          </Variant>
          <Variant name="sin responder" note="Una caja en blanco no se distingue de un campo que nadie tocó, así que lo dice con todas las letras.">
            <Stack width="sm">
              <OpenQuestion value="">
                <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
              </OpenQuestion>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          No tiene `correct` y no lo va a tener. En cuanto una pregunta abierta sabe la respuesta,
          lo que se está evaluando es si adivinaste las palabras: para lo que se corrige solo está
          `Choice`, y para lo que mira una persona está la rúbrica.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<OpenQuestion value={texto} onChange={setTexto} rows={3} maxLength={240}>
  <OpenQuestion.Prompt>¿Por qué ese y no otro?</OpenQuestion.Prompt>
  <OpenQuestion.Hint>Dos renglones alcanzan.</OpenQuestion.Hint>
</OpenQuestion>`} />
      </Section>

      <Section title="Props">
        <Props of="OpenQuestion" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Poné en el `Hint` qué tiene que aparecer en la respuesta: sin eso, el que escribe adivina cuánto se espera.</Practices.Do>
          <Practices.Do>Dale un tope acorde a lo que pedís: 240 para una justificación de dos renglones, 600 para una conclusión.</Practices.Do>
          <Practices.Dont>No la uses para un dato que se puede calcular: para un número va `NumberAnswer`, que sabe de unidad y de margen.</Practices.Dont>
          <Practices.Dont>No pongas la respuesta esperada en el `placeholder`: se copia tal cual y deja de decir nada.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El enunciado nombra al campo con `aria-labelledby`, así que un lector dice la pregunta antes de dejar escribir.</A11y.Item>
          <A11y.Item>El contador del campo viaja también por una región viva, así que el aviso de que queda poco no depende de verlo.</A11y.Item>
          <A11y.Item>Leyendo, la respuesta es un párrafo que viene justo después del enunciado, así que se escucha en ese orden. No lleva `aria-labelledby`, que en un párrafo la mayoría de los lectores ignora.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
