import cls from './field.module.css'
import { useState } from 'react'
import { Checkbox, Field, FieldSet, Select, Switch, TextField, Textarea } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function FieldStory() {
  const [fueraDeFecha, setFueraDeFecha] = useState(true)
  const [avisar, setAvisar] = useState(true)
  const [name, setName] = useState('')
  const [espacio, setEspacio] = useState('Matemática · 4.º A')
  const [donde, setDonde] = useState('Matemática · 4.º A')
  const [touched, setTouched] = useState(false)
  const error = touched && !name.trim() ? 'Poné un nombre para la actividad' : undefined

  return (
    <Page
      title="Field"
      kind="Formularios"
      imports="import { Field, FieldSet } from '@milo/ui'"
      lead="Un campo suelto no es un formulario: le falta el nombre, la ayuda y el error, y los tres tienen que estar atados al control para que un lector de pantalla los lea con él. Field hace ese trabajo una vez y en un solo lugar."
    >
      <Section
        title="Nombre, ayuda y error"
        note="La etiqueta enfoca el campo al tocarla, la ayuda se anuncia junto con el control y el error la reemplaza además de marcar el campo como inválido. Los campos del sistema se atan solos: no hay que pasarles `id` ni `aria-describedby`."
      >
        <Canvas>
          <div className={cls.div}>
            <Field label="Nombre de la actividad" hint="Lo ven los estudiantes" required error={error}>
              <TextField
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Fracciones equivalentes"
              />
            </Field>
            <Field label="Consigna" hint="Podés pegar el texto que ya tenías">
              <Textarea rows={3} maxRows={8} placeholder="Escribí la consigna…" />
            </Field>
          </div>
        </Canvas>
      </Section>

      <Section
        title="Sirve para cualquier control del sistema"
        note="No solo para los campos de texto: el select, el switch y la casilla también toman el `id` y la descripción del Field. Es la diferencia entre una etiqueta que enfoca y una etiqueta que es texto al lado de un control."
      >
        <Canvas>
          <div className={cls.div2}>
            <Field label="Espacio" hint="Dónde se publica">
              <Select value={espacio} onChange={setEspacio} options={['Matemática · 4.º A', 'Lengua · 6.º']} />
            </Field>
            <Field label="Entregas fuera de fecha" hint="Permitir que entreguen después del cierre">
              <Switch checked={fueraDeFecha} onChange={setFueraDeFecha} label="Entregas fuera de fecha" />
            </Field>
            <Field label="Avisar al publicar">
              <Checkbox checked={avisar} onChange={setAvisar} label="Avisar al publicar" />
            </Field>
          </div>
        </Canvas>
      </Section>

      <Section
        title="Lo obligatorio se dice con palabras"
        note="El asterisco es una convención que no significa nada para quien no la conoce y que un lector de pantalla lee como 'asterisco'. Acá va el asterisco para la vista y la palabra 'obligatorio' para el lector."
      >
        <Canvas>
          <div className={cls.div3}>
            <Field label="Espacio" required>
              <Select value={donde} onChange={setDonde} options={['Matemática · 4.º A', 'Lengua · 6.º']} />
            </Field>
          </div>
        </Canvas>
      </Section>

      <Section
        title="FieldSet"
        note="Agrupa los campos que van juntos y les pone un título que el lector anuncia al entrar al grupo. En un formulario de tres campos sobra; en uno de doce es lo que lo hace legible."
      >
        <Canvas>
          <div className={cls.div4}>
            <FieldSet legend="Lo básico">
              <Field label="Nombre" required>
                <TextField placeholder="Fracciones equivalentes" />
              </Field>
              <Field label="Consigna" hint="Se puede editar después de publicar">
                <Textarea rows={3} maxRows={8} />
              </Field>
            </FieldSet>
          </div>
        </Canvas>
      </Section>

      <Note title="Field o Row">
        El Field es para un formulario que se completa y se envía. Un ajuste que se guarda solo al
        tocarlo (etiqueta a la izquierda, switch a la derecha) es un
        {' '}<a className={cls.a} href="#row">Row</a>.
      </Note>

      <Section title="Props">
        <Props of="FieldSet" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La etiqueta usa htmlFor: tocarla enfoca el campo, que además agranda el blanco del click.',
          'La ayuda y el error se anuncian como descripción del control, no como texto suelto al lado.',
          'Con error, el campo queda aria-invalid y el mensaje lleva su glifo: no depende del color rojo.',
          'Lo obligatorio se dice con texto además del asterisco.',
          'Los siete controles del sistema toman el id del Field: ninguno queda con la etiqueta colgando.',
        ]} />
      </Section>
    </Page>
  )
}
