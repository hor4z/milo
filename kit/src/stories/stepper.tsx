import { useState } from 'react'
import { Field } from '@milo/ui/field'
import { Stepper } from '@milo/ui/stepper'
import { A11y, Canvas, Cluster, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

export function StepperStory() {
  const [attempts, setAttempts] = useState(3)
  const [questions, setQuestions] = useState(10)
  const [minutes, setMinutes] = useState(45)
  const [grade, setGrade] = useState(7)
  const [plain, setPlain] = useState(1)

  return (
    <Page
      title="Stepper"
      kind="Formularios"
      imports="import { Stepper } from '@milo/ui/stepper'"
      lead="Un número chico que se sube y se baja. Para lo que se cuenta y no se escribe: cuántos intentos, cuántas preguntas, cuántos minutos. Arriba de dos cifras conviene un `TextField`, que se teclea más rápido de lo que se aprieta."
    >
      <Section
        title="En un campo"
        note="El `Field` de alrededor le pone el nombre y la ayuda, igual que a cualquier otro control. El sufijo va adentro y se lee con el número ('45 min') y no como una palabra suelta después."
      >
        <Canvas>
          <Stack gap="xl" width="md">
            <Field.Set legend="Cómo se entrega">
              <Field>
                <Field.Label>Intentos</Field.Label>
                <Field.Hint>Cuántas veces puede volver a entregar</Field.Hint>
                <Stepper value={attempts} onChange={setAttempts} min={1} max={9} label="Intentos" />
              </Field>
              <Field>
                <Field.Label>Tiempo</Field.Label>
                <Field.Hint>Desde que abre la actividad</Field.Hint>
                <Stepper value={minutes} onChange={setMinutes} min={5} max={120} step={5} suffix="min" label="Tiempo" width={148} />
              </Field>
            </Field.Set>
          </Stack>
        </Canvas>
      </Section>

      <Section
        title="Los topes se ven"
        note="En el extremo, el botón de ese lado se apaga en vez de no hacer nada al apretarlo. Un botón que responde a veces enseña que la pieza está rota."
      >
        <Panel>
          <Variant name="en el piso"><Stepper value={1} onChange={() => {}} min={1} max={5} label="Intentos" /></Variant>
          <Variant name="en el medio"><Stepper value={plain} onChange={setPlain} min={1} max={5} label="Intentos" /></Variant>
          <Variant name="en el techo"><Stepper value={5} onChange={() => {}} min={1} max={5} label="Intentos" /></Variant>
          <Variant name="apagado"><Stepper value={3} onChange={() => {}} disabled label="Intentos" /></Variant>
        </Panel>
      </Section>

      <Section
        title="Otros dos que aparecen todo el tiempo"
        note="Una nota sobre diez y la cantidad de preguntas de una actividad. El paso no siempre es uno: en el tiempo va de a cinco, porque nadie pone una actividad de cuarenta y tres minutos."
      >
        <Canvas>
          <Cluster gap="xl" align="end">
            <Field>
              <Field.Label>Nota</Field.Label>
              <Stepper value={grade} onChange={setGrade} min={1} max={10} label="Nota" width={120} />
            </Field>
            <Field>
              <Field.Label>Preguntas</Field.Label>
              <Stepper value={questions} onChange={setQuestions} min={1} max={50} label="Preguntas" width={120} />
            </Field>
          </Cluster>
        </Canvas>
      </Section>

      <Note icon="lightbulb" title="Se puede escribir, y eso no es un detalle">
        Llegar a 45 apretando de a uno son cuarenta y cinco clicks. El campo del medio se teclea, y
        mientras se escribe puede quedar vacío o a medio número sin que el valor salte: al salir,
        lo que no era un número vuelve al último que sí lo era. Y para llegar lejos con el teclado
        están Re Pág y Av Pág, que van de a diez, e Inicio y Fin, que van a los topes.
      </Note>

      <Section title="Cómo se escribe">
        <Example code={`const [intentos, setIntentos] = useState(3)
<Stepper value={intentos} onChange={setIntentos} min={1} max={9} size="sm" label="Intentos" />`} />
      </Section>

      <Section title="Props">
        <Props of="Stepper" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>`suffix` pone la unidad adentro del campo: no se escribe ni se borra.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El campo del medio es un `spinbutton` que dice dónde está y hasta dónde llega, así que un lector anuncia "5, mínimo 1, máximo 10" sin que haga falta mirar los topes.</A11y.Item>
          <A11y.Item>Las flechas suben y bajan sin tocar los botones, y por eso los botones no son paradas de tabulación: con ellas serían tres paradas para un solo dato.</A11y.Item>
          <A11y.Item>El sufijo viaja en `aria-valuetext` y no como texto aparte: se escucha "45 min" y no "45" y después "min".</A11y.Item>
          <A11y.Item>En el tope el botón de ese lado se deshabilita, que es lo que dice que no hay más para ese lado.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
