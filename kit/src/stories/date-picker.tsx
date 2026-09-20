import { useState } from 'react'
import { DatePicker } from '@milo/ui/date-picker'
import { Field } from '@milo/ui/field'
import { A11y, Canvas, Note, Page, Props, Section, Stack } from '../kit'

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function DatePickerStory() {
  const [due, setDue] = useState('')
  const [from, setFrom] = useState(today())
  const [loose, setLoose] = useState('2026-03-09')
  const [bounded, setBounded] = useState('')

  return (
    <Page
      title="DatePicker"
      kind="Formularios"
      imports="import { DatePicker } from '@milo/ui/date-picker'"
      lead="Un campo que abre un mes. El valor es el texto `AAAA-MM-DD` y no un `Date`: una fecha de entrega no tiene hora ni zona, y un `Date` arrastra las dos."
    >
      <Section
        title="En un campo"
        note="Como cualquier otro control del sistema: el `Field` de alrededor le pone el nombre y la ayuda, y el campo se hunde o no según la superficie donde caiga."
      >
        <Canvas>
          <Stack gap="xl" width="md">
            <Field.Set legend="Cuándo">
              <Field label="Abre" hint="Desde cuándo se puede entregar">
                <DatePicker value={from} onChange={setFrom} />
              </Field>
              <Field label="Vence" hint="Después de esta fecha no entra nada">
                <DatePicker value={due} onChange={setDue} min={from} placeholder="Sin fecha de cierre" />
              </Field>
            </Field.Set>
          </Stack>
        </Canvas>
      </Section>

      <Section
        title="Suelto"
        note="Sin `Field` alrededor hay que nombrarlo con `label`. El campo dice la fecha en palabras: 03/09/2026 quiere decir dos cosas distintas según de dónde sea quien lo lee."
      >
        <Canvas>
          <DatePicker value={loose} onChange={setLoose} label="Fecha del examen" width={260} />
        </Canvas>
      </Section>

      <Section
        title="Acotado"
        note="`min` y `max` apagan lo que queda afuera en vez de esconderlo: un día que desaparece deja a quien mira buscando dónde está, y uno apagado dice que existe y que no se puede."
      >
        <Canvas>
          <DatePicker value={bounded} onChange={setBounded} min={today()} label="Nueva entrega" placeholder="No se puede antes de hoy" width={260} />
        </Canvas>
      </Section>

      <Note icon="lightbulb" title="Por qué el valor es texto y no un `Date`">
        `new Date('2026-03-09')` se interpreta en UTC, así que acá es el 8 a las 21. Una fecha de
        vencimiento no tiene hora ni zona: es un día del calendario. El texto `AAAA-MM-DD` lo dice
        tal cual, se ordena comparando cadenas y viaja a cualquier base sin traducción.
      </Note>

      <Note title="La semana empieza el lunes">
        Y no sale de la configuración del navegador: una grilla que a veces arranca el domingo y a
        veces el lunes se lee mal justo cuando hay que contar días. Si hace falta soportar las dos,
        es una prop y no una pieza nueva.
      </Note>

      <Section title="Props">
        <Props of="DatePicker" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Cada día se nombra entero ("lunes, 9 de marzo de 2026") en vez de leerse como un número suelto sin contexto.',
          'El mes entero se recorre con el teclado: flechas de a un día y de a una semana, Re Pág y Av Pág de a un mes, con Shift de a un año, Inicio y Fin a los extremos de la semana.',
          'Una sola parada de tabulación en la grilla (el día del cursor) en vez de treinta para llegar al final del mes. Escape cierra y el foco vuelve al campo.',
          'El mes se anuncia al cambiar: con el teclado lo único que cambia es el título, y sin `aria-live` el salto es mudo.',
          'Hoy lleva un punto además del color, y lo elegido va en relleno: dos señales distintas para dos cosas distintas.',
        ]} />
      </Section>
    </Page>
  )
}
