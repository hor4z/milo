import { useState } from 'react'
import { Checkbox } from '@milo/ui/checkbox'
import { Field } from '@milo/ui/field'
import { Select } from '@milo/ui/select'
import { Switch } from '@milo/ui/switch'
import { TextField } from '@milo/ui/text-field'
import { Textarea } from '@milo/ui/textarea'
import { A11y, Canvas, Example, Frame, Note, Page, Practices, Props, Section, Stack } from '../kit'

export function FieldStory() {
  const [overdue, setOverdue] = useState(true)
  const [notify, setNotify] = useState(true)
  const [name, setName] = useState('')
  const [space, setSpace] = useState('Matemática · 4.º A')
  const [where, setWhere] = useState('Matemática · 4.º A')
  const [touched, setTouched] = useState(false)
  const error = touched && !name.trim() ? 'Poné un nombre para la actividad' : undefined

  return (
    <Page
      title="Field"
      kind="Formularios"
      imports="import { Field } from '@milo/ui/field'"
      lead="Un campo suelto no es un formulario: le falta el nombre, la ayuda y el error, y los tres tienen que estar atados al control para que un lector de pantalla los lea con él. Field hace ese trabajo una vez y en un solo lugar."
    >
      <Section
        title="Nombre, ayuda y error"
        note="La etiqueta enfoca el campo al tocarla, la ayuda se anuncia junto con el control y el error la reemplaza además de marcar el campo como inválido. Los campos del sistema se atan solos: no hay que pasarles `id` ni `aria-describedby`."
      >
        <Canvas>
          <Stack gap="xl" width="md">
            <Field required>
              <Field.Label>Nombre de la actividad</Field.Label>
              <Field.Hint>Lo ven los estudiantes</Field.Hint>
              <Field.Error>{error}</Field.Error>
              <TextField
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Fracciones equivalentes"
              />
            </Field>
            <Field>
              <Field.Label>Consigna</Field.Label>
              <Field.Hint>Podés pegar el texto que ya tenías</Field.Hint>
              <Textarea rows={3} maxRows={8} placeholder="Escribí la consigna…" />
            </Field>
          </Stack>
        </Canvas>
      </Section>

      <Section
        title="Sirve para cualquier control del sistema"
        note="No solo para los campos de texto: el select, el switch y la casilla también toman el `id` y la descripción del Field. Es la diferencia entre una etiqueta que enfoca y una etiqueta que es texto al lado de un control."
      >
        <Canvas>
          <Stack gap="xl" width="md">
            <Field>
              <Field.Label>Espacio</Field.Label>
              <Field.Hint>Dónde se publica</Field.Hint>
              <Select value={space} onChange={setSpace} options={['Matemática · 4.º A', 'Lengua · 6.º']} />
            </Field>
            <Field>
              <Field.Label>Entregas fuera de fecha</Field.Label>
              <Field.Hint>Permitir que entreguen después del cierre</Field.Hint>
              <Switch checked={overdue} onChange={setOverdue} label="Entregas fuera de fecha" />
            </Field>
            <Field>
              <Field.Label>Avisar al publicar</Field.Label>
              <Checkbox checked={notify} onChange={setNotify} label="Avisar al publicar" />
            </Field>
          </Stack>
        </Canvas>
      </Section>

      <Section
        title="Lo obligatorio se dice con palabras"
        note="El asterisco es una convención que no significa nada para quien no la conoce y que un lector de pantalla lee como 'asterisco'. Acá va el asterisco para la vista y la palabra 'obligatorio' para el lector."
      >
        <Canvas>
          <Frame width="sm">
            <Field required>
              <Field.Label>Espacio</Field.Label>
              <Select value={where} onChange={setWhere} options={['Matemática · 4.º A', 'Lengua · 6.º']} />
            </Field>
          </Frame>
        </Canvas>
      </Section>

      <Section
        title="Field.Set"
        note="Agrupa los campos que van juntos y les pone un título que el lector anuncia al entrar al grupo. En un formulario de tres campos sobra; en uno de doce es lo que lo hace legible."
      >
        <Canvas>
          <Frame width="md">
            <Field.Set legend="Lo básico">
              <Field required>
                <Field.Label>Nombre</Field.Label>
                <TextField placeholder="Fracciones equivalentes" />
              </Field>
              <Field>
                <Field.Label>Consigna</Field.Label>
                <Field.Hint>Se puede editar después de publicar</Field.Hint>
                <Textarea rows={3} maxRows={8} />
              </Field>
            </Field.Set>
          </Frame>
        </Canvas>
      </Section>

      <Note title="Field o Row">
        El Field es para un formulario que se completa y se envía. Un ajuste que se guarda solo al
        tocarlo (etiqueta a la izquierda, switch a la derecha) es un
        [Row](#row).
      </Note>

      <Section title="Cómo se escribe">
        <Example code={`<Field>
  <Field.Label>Nombre de la actividad</Field.Label>
  <Field.Hint>Lo ven los estudiantes</Field.Hint>
  <TextField value={nombre} onChange={e => setNombre(e.target.value)} />
</Field>`} />
      </Section>

      <Section title="Props">
        <Props of="Field" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>La etiqueta va en `Field.Label`, el apoyo en `Field.Hint` y lo que está mal en `Field.Error`.</Practices.Do>
          <Practices.Do>El control de adentro toma el id solo: no le pongas `label` también, se nombra dos veces.</Practices.Do>
          <Practices.Dont>El error reemplaza al hint, no se apila: dos líneas de apoyo compiten por la misma mirada.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La etiqueta usa htmlFor: tocarla enfoca el campo, que además agranda el blanco del click.</A11y.Item>
          <A11y.Item>La ayuda y el error se anuncian como descripción del control, no como texto suelto al lado.</A11y.Item>
          <A11y.Item>Con error, el campo queda aria-invalid y el mensaje lleva su glifo: no depende del color rojo.</A11y.Item>
          <A11y.Item>Lo obligatorio se dice con texto además del asterisco.</A11y.Item>
          <A11y.Item>Los siete controles del sistema toman el id del Field: ninguno queda con la etiqueta colgando.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
