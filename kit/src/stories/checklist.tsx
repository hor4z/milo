import { useState } from 'react'
import { Checklist } from '@milo/ui/checklist'
import { A11y, Example, Note, Page, Panel, Practices, Props, Section, Stack, Variant } from '../kit'

export function ChecklistStory() {
  const [conectada, setConectada] = useState(false)
  const [nivel, setNivel] = useState(2)

  return (
    <Page
      title="Checklist"
      kind="Datos"
      imports="import { Checklist } from '@milo/ui/checklist'"
      lead="Los primeros pasos de algo, con cuánto va hecho a la vista y el detalle plegado. Es lo que acompaña a alguien la primera semana y desaparece cuando ya no hace falta."
    >
      <Section
        title="Cuándo va"
        note="Va para una secuencia que alguien recorre una sola vez y a su ritmo: configurar un espacio, dejar listo un aula. Para los pasos de un formulario que se hace de corrido va `Steps`, que marca dónde estás; para una lista de cosas por hacer que no tiene orden va `TaskList`."
      >
        <Panel>
          <Variant name="plegada" note="Una fila: el nombre, cuánto va y nada más. Es como vive el otro 90% del tiempo, y con tres de cuatro hechos la barra dice sola que falta poco.">
            <Stack width="md">
              <Checklist>
                <Checklist.Title>Primeros pasos</Checklist.Title>
                <Checklist.Item state="done">Creá tu primer espacio</Checklist.Item>
                <Checklist.Item state="done">Sumá a tus estudiantes</Checklist.Item>
                <Checklist.Item state="done">Publicá una actividad</Checklist.Item>
                <Checklist.Item state="doing">Ajustá tus preferencias</Checklist.Item>
              </Checklist>
            </Stack>
          </Variant>
          <Variant name="abierta" note="Cada paso dice dónde está con la marca de la izquierda, no con el color del texto.">
            <Stack width="md">
              <Checklist defaultOpen>
                <Checklist.Title>Primeros pasos</Checklist.Title>
                <Checklist.Item state="done">Creá tu primer espacio</Checklist.Item>
                <Checklist.Item
                  state={conectada ? 'done' : 'doing'}
                  onClick={() => setConectada(v => !v)}
                >
                  Conectá tu cuenta de la escuela
                </Checklist.Item>
                <Checklist.Item
                  state={conectada ? 'todo' : 'blocked'}
                  hint={conectada ? undefined : 'Primero hace falta conectar la cuenta de la escuela'}
                >
                  Sumá a tus estudiantes
                </Checklist.Item>
                <Checklist.Item>Ajustá tus preferencias</Checklist.Item>
                <Checklist.Footer>Podés volver acá desde el menú de tu cuenta.</Checklist.Footer>
              </Checklist>
            </Stack>
          </Variant>
          <Variant name="compacta" note="`size='sm'` para un riel angosto: el título y los pasos van los dos en texto de cuerpo, así que la lista se lee como un bloque y no como cuatro filas sueltas.">
            <Stack width="sm">
              <Checklist size="sm" defaultOpen>
                <Checklist.Title>Toma de datos</Checklist.Title>
                <Checklist.Item state="done">Una sola medición anotada</Checklist.Item>
                <Checklist.Item>Las tres, sin el error</Checklist.Item>
                <Checklist.Item>Las tres, con el error estimado</Checklist.Item>
              </Checklist>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Como escalera"
        note="Con `value` y `onChange` los pasos dejan de ser independientes: cada uno incluye a los de arriba, así que tocar el tercero marca los tres y volver a tocarlo desmarca de ahí para abajo. Es para lo que se recorre en orden y no se saltea: los niveles de un aspecto, el avance de una entrega. El estado de cada paso lo decide la pieza, así que el call site no puede dejar el segundo sin marcar y el tercero marcado."
      >
        <Panel>
          <Variant name="tres de cuatro" note="El contador y la barra salen del mismo número, y tocar un paso ya marcado vuelve al anterior.">
            <Stack width="md">
              <Checklist defaultOpen value={nivel} onChange={setNivel}>
                <Checklist.Title>Toma de datos</Checklist.Title>
                <Checklist.Item>Una sola medición anotada</Checklist.Item>
                <Checklist.Item>Las tres, sin el error</Checklist.Item>
                <Checklist.Item>Las tres, con el error estimado</Checklist.Item>
                <Checklist.Item>Las tres, con el error y de dónde sale</Checklist.Item>
                <Checklist.Footer hint="Cada renglón incluye al anterior: al marcar uno quedan marcados los de arriba.">
                  Vale 33% de la nota.
                </Checklist.Footer>
              </Checklist>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Los cuatro estados de un paso"
        note="`done` es el que ya está. `doing` es el que se está haciendo ahora, y es el único que se anuncia como el actual. `todo` es el que falta. `blocked` es el que no se puede hacer todavía, y ese lleva una aclaración de por qué."
      >
        <Panel>
          <Variant name="uno de cada">
            <Stack width="md">
              <Checklist defaultOpen>
                <Checklist.Title>Los cuatro</Checklist.Title>
                <Checklist.Item state="done">Hecho</Checklist.Item>
                <Checklist.Item state="doing">En curso</Checklist.Item>
                <Checklist.Item state="todo">Todavía no</Checklist.Item>
                <Checklist.Item state="blocked" hint="Falta el anterior">Trabado</Checklist.Item>
              </Checklist>
            </Stack>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Excluyente"
        note="Con `exclusive` los renglones dejan de sumarse: se marca uno y los demás se apagan, y tocar el que ya está marcado no lo apaga. Es para una escala, donde los renglones son descripciones del mismo estado y solo una es cierta, como los cuatro niveles de una rúbrica."
      >
        <Panel>
          <Variant name="una escala" note="Tocá otro renglón: el anterior se apaga. No hay barra ni contador: los dos miden cuánto va hecho, y acá no hay nada hecho sino un lugar donde estás.">
            <Stack width="sm">
              <Checklist defaultOpen exclusive size="sm" value={nivel} onChange={setNivel}>
                <Checklist.Title>La idea</Checklist.Title>
                <Checklist.Item>Poco clara</Checklist.Item>
                <Checklist.Item>Se entiende qué vende</Checklist.Item>
                <Checklist.Item>Clara y posible</Checklist.Item>
                <Checklist.Item>Clara, posible y propia</Checklist.Item>
                <Checklist.Footer hint="Los cuatro niveles son excluyentes: al marcar uno se apagan los demás.">
                  Vale 11% de la nota.
                </Checklist.Footer>
              </Checklist>
            </Stack>
          </Variant>
        </Panel>
        <Note>
          Sin `exclusive` no cambia nada: la lista sigue siendo la escalera de siempre, con su barra
          y su contador. Mirando una lista no se distingue cuál de las dos es: lo dice el contenido,
          así que lo elige quien la escribe.
        </Note>
        <Note>
          Lo que se pierde al sacar la barra es lo que la tarjeta decía plegada. Hoy plegada muestra
          el nombre y nada más, así que en una rúbrica de ocho no se ve en cuál quedaste sin abrir
          cada una. La salida sería que el call site pase el nombre del nivel, y todavía no está.
        </Note>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<Checklist defaultOpen>
  <Checklist.Title>Primeros pasos</Checklist.Title>
  <Checklist.Item state="done">Creá tu primer espacio</Checklist.Item>
  <Checklist.Item state="doing" onClick={conectar}>Conectá tu cuenta</Checklist.Item>
  <Checklist.Item state="blocked" hint="Primero conectá la cuenta">
    Sumá a tus estudiantes
  </Checklist.Item>
  <Checklist.Footer>Podés volver acá desde el menú de tu cuenta.</Checklist.Footer>
</Checklist>`} />
      </Section>

      <Section title="Props">
        <Props of="Checklist" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>El contador sale de los pasos, así que no hay un número que pueda despegarse de la lista.</Practices.Do>
          <Practices.Do>Un paso `blocked` lleva `hint`: si no se puede hacer, hay que decir por qué.</Practices.Do>
          <Practices.Do>Cuando los pasos se recorren en orden, pasale `value` y `onChange`: la escalera no deja estados imposibles, como el tercero hecho y el segundo no.</Practices.Do>
          <Practices.Dont>No la uses para una secuencia que se hace de corrido: eso es `Steps`.</Practices.Dont>
          <Practices.Dont>Cuando todo está hecho, sacala de la pantalla. Una lista de cuatro tildes verdes ocupa lugar y no dice nada.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La cabecera es un botón con `aria-expanded` y `aria-controls`: se anuncia como lo que es y dice qué abre.</A11y.Item>
          <A11y.Item>El contador se lee "1 de 4 pasos hechos" y no solo el número.</A11y.Item>
          <A11y.Item>El paso en curso lleva `aria-current="step"`, así que quien escucha sabe dónde quedó.</A11y.Item>
          <A11y.Item>El estado no depende del color: cada paso lleva su marca, y el trabado además dice por qué.</A11y.Item>
          <A11y.Item>Un paso trabado es un `div` y no un botón apagado: no para en el tabulador, porque no hay nada que hacer ahí.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
