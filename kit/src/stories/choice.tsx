import { useState } from 'react'
import { Button } from '@milo/ui/button'
import { Choice } from '@milo/ui/choice'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

const lugares = [
  { id: 'patio', label: 'El patio en el recreo' },
  { id: 'biblioteca', label: 'La biblioteca a las 11' },
  { id: 'pasillo', label: 'El pasillo entre horas' },
  { id: 'aula', label: 'El aula con la puerta cerrada' },
]

const cuidados = [
  { id: 'aparato', label: 'Usar siempre el mismo teléfono' },
  { id: 'hora', label: 'Medir a la misma hora en todos los lugares' },
  { id: 'app', label: 'Cambiar de app si una mide más lindo' },
  { id: 'contexto', label: 'Anotar qué estaba pasando alrededor' },
]

export function ChoiceStory() {
  const [una, setUna] = useState<string[]>([])
  const [varias, setVarias] = useState<string[]>(['aparato'])
  const [revelado, setRevelado] = useState(false)

  return (
    <Page
      title="Choice"
      kind="Formularios"
      imports="import { Choice } from '@milo/ui/choice'"
      lead="Una pregunta con opciones: el enunciado y las tarjetas. Responder no dice si estuvo bien, y eso es la pieza y no un olvido: quien contesta elige, y la corrección llega después y la decide otro."
    >
      <Section
        title="Una o varias"
        note="Con `multiple` las tarjetas pasan a ser casillas y se pueden marcar varias. El valor es un array en los dos casos, así que el call site no cambia de forma cuando una pregunta de una pasa a ser de varias."
      >
        <Panel>
          <Variant name="una sola" note="Es un grupo de opción única: una sola parada de tabulación y las flechas mueven entre las tarjetas.">
            <Stack width="sm">
              <Choice options={lugares} value={una} onChange={setUna}>
                <Choice.Prompt>¿Dónde esperás que dé más alto?</Choice.Prompt>
                <Choice.Hint>Todavía no midieron nada: se contesta con lo que cada uno cree.</Choice.Hint>
              </Choice>
            </Stack>
          </Variant>
          <Variant name="varias correctas" note="Cada tarjeta es una casilla y tiene su propia parada de tabulación, porque marcar una no descarta a las otras.">
            <Stack width="sm">
              <Choice multiple options={cuidados} value={varias} onChange={setVarias}>
                <Choice.Prompt>¿Qué hay que cuidar para que los números se puedan comparar?</Choice.Prompt>
              </Choice>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Corregir es otro momento"
        note="Sin `revealed` la pieza no corrige a nadie: guarda `correct` y no lo dibuja. Cuando alguien decide mostrarlo, las que iban quedan con el tilde y las marcadas de más con la raya amarilla, que es el tono de un consejo. Rojo no hay: equivocarse mientras se aprende no es un error del sistema."
      >
        <Panel>
          <Variant name="antes y después">
            <Stack width="sm">
              <Choice
                multiple
                options={cuidados}
                value={varias}
                onChange={setVarias}
                correct={['aparato', 'hora', 'contexto']}
                revealed={revelado}
              >
                <Choice.Prompt>¿Qué hay que cuidar para que los números se puedan comparar?</Choice.Prompt>
              </Choice>
              <Button size="sm" variant="ghost" onClick={() => setRevelado(v => !v)}>
                {revelado ? 'Volver a antes' : 'Mostrar cuáles iban'}
              </Button>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Revelar también apaga la pregunta: una vez corregida no se vuelve a responder, así que no
          hace falta pasar `readOnly` además. `readOnly` queda para el otro caso, que es leer la
          entrega de alguien sin corregirla.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<Choice
  options={opciones}
  value={marcadas}
  onChange={setMarcadas}
  correct={['aparato', 'hora']}
  revealed={yaSeCorrigio}
>
  <Choice.Prompt>¿Qué hay que cuidar?</Choice.Prompt>
</Choice>`} />
      </Section>

      <Section title="Props">
        <Props of="Choice" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Escribí el enunciado como pregunta y las opciones como respuestas enteras: una tarjeta que dice "todas las anteriores" no se puede leer sin volver arriba.</Practices.Do>
          <Practices.Do>Si hay más de una correcta, decilo en el `Choice.Hint` antes de que empiecen: descubrirlo al corregir se lee como una trampa.</Practices.Do>
          <Practices.Do>Guardá `correct` en la consigna y revelalo cuando el docente decida: la pieza no elige ese momento por vos.</Practices.Do>
          <Practices.Dont>No la uses para una opinión ni para un autoreporte: en cuanto hay `correct`, la pregunta tiene una respuesta buena, y preguntar cómo te sentiste no la tiene.</Practices.Dont>
          <Practices.Dont>No pintes de rojo lo marcado de más: el amarillo dice lo mismo sin convertir un intento en una falta.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El enunciado nombra al grupo con `aria-labelledby`, así que un lector dice la pregunta antes de la primera opción.</A11y.Item>
          <A11y.Item>Con una sola correcta es un `radiogroup`: una parada de tabulación y las flechas mueven, como cualquier grupo de opción única.</A11y.Item>
          <A11y.Item>Con varias es un `group` de casillas, cada una con su parada, porque marcar una no descarta a las otras.</A11y.Item>
          <A11y.Item>Toda la tarjeta es zona de toque, no solo el círculo de 18.</A11y.Item>
          <A11y.Item>Al revelar, cada opción dice en texto si iba o no: el resultado no depende de ver el color ni el tilde.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
