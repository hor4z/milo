import { useState } from 'react'
import { Button } from '@milo/ui/button'
import { NumberAnswer } from '@milo/ui/number-answer'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

export function NumberAnswerStory() {
  const [valor, setValor] = useState('')
  const [revelado, setRevelado] = useState(false)

  return (
    <Page
      title="NumberAnswer"
      kind="Formularios"
      imports="import { NumberAnswer } from '@milo/ui/number-answer'"
      lead="Un número que sale de una cuenta: un promedio, una diferencia, una métrica. La tolerancia existe porque una medición no da siempre lo mismo, así que la respuesta es un rango y no un valor."
    >
      <Section
        title="Calculando"
        note="La unidad va al lado del campo y no adentro del número: lo que se escribe es un número y se puede comparar, y lo que se lee sigue diciendo de qué se habla. El campo acepta la coma y el punto, porque acá se escribe 72,3 y el teclado del celular manda un punto."
      >
        <Panel>
          <Variant name="antes y después" note="Revelar muestra el veredicto y apaga el campo: una cuenta corregida no se vuelve a responder.">
            <Stack width="sm">
              <NumberAnswer
                value={valor}
                onChange={setValor}
                unit="dB"
                expected={72.3}
                tolerance={0.2}
                revealed={revelado}
              >
                <NumberAnswer.Prompt>El promedio del patio en los tres momentos</NumberAnswer.Prompt>
                <NumberAnswer.Hint>Sumá los tres valores de la fila y dividí por tres.</NumberAnswer.Hint>
              </NumberAnswer>
              <Button size="sm" variant="ghost" onClick={() => setRevelado(v => !v)}>
                {revelado ? 'Volver a antes' : 'Corregir'}
              </Button>
            </Stack>
          </Variant>
          <Variant name="sin margen" note="En cero la respuesta es exacta, que es lo correcto cuando sale de una resta entre dos números dados y no de una medición.">
            <Stack width="sm">
              <NumberAnswer value="21" unit="dB" expected={22} revealed>
                <NumberAnswer.Prompt>El salto del recreo en el patio</NumberAnswer.Prompt>
              </NumberAnswer>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          El margen no es una concesión: es lo que hace que la pregunta sea sobre la cuenta y no
          sobre los decimales. Si la respuesta sale de algo que se midió, ponelo; si sale de una
          resta entre dos números que están escritos, dejalo en cero.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<NumberAnswer
  value={valor}
  onChange={setValor}
  unit="dB"
  expected={72.3}
  tolerance={0.2}
  revealed={yaSeCorrigio}
>
  <NumberAnswer.Prompt>El promedio del patio</NumberAnswer.Prompt>
</NumberAnswer>`} />
      </Section>

      <Section title="Props">
        <Props of="NumberAnswer" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Decí en el `Hint` de dónde sale el número: qué cuenta, con qué datos. La pregunta es si sabe armarla, no si adivina qué querías.</Practices.Do>
          <Practices.Do>Poné la unidad aunque parezca obvia: sin ella, 40 y 40 dB son dos respuestas distintas para el que corrige.</Practices.Do>
          <Practices.Dont>No la uses para un número que no sale de una cuenta: una fecha va en `DatePicker` y una cantidad elegida, en `Slider`.</Practices.Dont>
          <Practices.Dont>No dejes el margen en cero cuando el dato se midió: ahí el que se equivoca por un decimal no se equivocó en nada.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El enunciado nombra al campo con `aria-labelledby`.</A11y.Item>
          <A11y.Item>El campo va con `inputMode="decimal"`, así que en un teléfono aparece el teclado con la coma.</A11y.Item>
          <A11y.Item>Al corregir, el veredicto está escrito: cae adentro del margen, o cuál era el valor. No depende de ver el tilde ni el color.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
