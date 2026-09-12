import { useState } from 'react'
import { Button, Row, Select, Switch } from '@melu/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

export function RowStory() {
  const [first, setFirst] = useState(true)
  const [second, setSecond] = useState(false)
  const [level, setLevel] = useState('Todo el equipo')

  return (
    <Page
      title="Row"
      kind="Superficies"
      imports="import { Row } from '@melu/ui'"
      lead="La fila de un panel de ajustes: qué es a la izquierda, con qué se cambia a la derecha. 56 de alto y padding 16/24, iguales en todas, que es lo que hace que una lista de ocho se lea como una sola cosa."
    >
      <Section
        title="Una lista de ajustes"
        note="El divisor va como borde superior de cada fila menos la primera, y no como borde inferior de todas: así la última no deja una línea suelta contra el fondo del panel. Es un detalle de un píxel que se nota en cuanto falta."
      >
        <div className="max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Sugerir mejoras" hint="Mientras escribís una consigna">
            <Switch checked={first} onChange={setFirst} label="Sugerir mejoras" />
          </Row>
          <Row label="Aparecer en el directorio" hint="Otras escuelas pueden encontrarte">
            <Switch checked={second} onChange={setSecond} label="Directorio" />
          </Row>
          <Row label="Quién ve mis recetas">
            <Select value={level} onChange={setLevel} width={180} options={['Solo yo', 'Todo el equipo', 'Cualquiera con el link']} />
          </Row>
        </div>
      </Section>

      <Section
        title="La etiqueta enfoca el control"
        note="El `label` es un `<label>` de verdad atado al control que lleva adentro: tocar el texto prende el switch, que además agranda muchísimo el blanco del click. Adentro de la etiqueta va solo el nombre — con la ayuda adentro, el nombre accesible pasaría a ser las dos frases pegadas."
      >
        <div className="max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Avisos por mail" hint="Cuando llega una entrega">
            <Switch checked={first} onChange={setFirst} label="Avisos por mail" />
          </Row>
        </div>
      </Section>

      <Section
        title="Lo que va a la derecha no siempre es un control"
        note="Un valor que no se edita acá, un botón que lleva a otro lado, un dato: la fila sirve igual, y el que decide si hay algo que tocar es el contenido."
      >
        <div className="max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Correo">
            <span className="text-xs text-ink-muted">melina@melu.app</span>
          </Row>
          <Row label="Contraseña" hint="La última vez que la cambiaste fue en marzo">
            <Button size="sm" variant="raised">Cambiar</Button>
          </Row>
        </div>
      </Section>

      <Note title="Row o Field">
        La fila es para un ajuste que se guarda solo al tocarlo. Si lo que hay es un formulario que
        se completa y se envía —con su ayuda, su error y su asterisco— eso es un
        {' '}<a className="underline underline-offset-2" href="#field">Field</a>, que es otra pieza y
        otra forma de leer.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'label', type: 'string', required: true, note: 'nombra el control y lo enfoca al tocarlo' },
          { name: 'hint', type: 'string', note: 'segunda línea en 11px gris' },
          { name: 'children', type: 'ReactNode', note: 'el control, alineado a la derecha' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La etiqueta envuelve solo el nombre, así que el control se llama «Avisos por mail» y no «Avisos por mailCuando llega una entrega».',
          'Tocar la etiqueta acciona el control, que es blanco de click de sobra para el dedo.',
          'Las filas no son botones: lo que se toca es lo que hay adentro, y se ve cuál es.',
        ]} />
      </Section>
    </Page>
  )
}
