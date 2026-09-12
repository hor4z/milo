import { useState } from 'react'
import { Card, Row, Select, Switch } from '@melu/ui'
import { Page, Props, Section } from '../kit'

export function ContainersStory() {
  const [uno, setUno] = useState(true)
  const [dos, setDos] = useState(false)
  const [nivel, setNivel] = useState('Todo el equipo')

  return (
    <Page
      title="Card · Row"
      lead="Los dos contenedores del sistema: la tarjeta de una grilla y la fila de un panel."
    >
      <Section
        title="Card"
        note="Radio 24 con 8 de padding, así que lo que va adentro lleva 16. Las tarjetas no se mueven en hover y no tienen acciones flotando encima: una grilla que salta hace temblar la vista, y un botón que aparece al pasar el mouse no se descubre sin mouse y tapa justo lo que estabas mirando."
      >
        <div className="flex flex-wrap gap-4">
          <Card className="w-[260px]">
            <div className="rounded-xl bg-tint-2" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-1.5">
              <div className="text-xs font-semibold">El barrio como mapa</div>
              <div className="mt-1 text-2xs text-ink-muted">Geografía · 6.º · Indagación</div>
            </div>
          </Card>
          <Card className="w-[260px]" interactive>
            <div className="rounded-xl bg-tint-3" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-1.5">
              <div className="text-xs font-semibold">Con interactive</div>
              <div className="mt-1 text-2xs text-ink-muted">Se levanta en hover — para donde haga falta</div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Row"
        note="56 de alto, padding 16/24, label a la izquierda y control a la derecha. El divisor va como borde superior de cada fila menos la primera, y no como borde inferior de todas: así la última no deja una línea suelta contra el fondo del panel."
      >
        <div className="max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Sugerir mejoras" hint="Mientras escribís una consigna">
            <Switch checked={uno} onChange={setUno} label="Sugerir mejoras" />
          </Row>
          <Row label="Aparecer en el directorio" hint="Otras escuelas pueden encontrarte">
            <Switch checked={dos} onChange={setDos} label="Directorio" />
          </Row>
          <Row label="Quién ve mis recetas">
            <Select value={nivel} onChange={setNivel} width={180} options={['Solo yo', 'Todo el equipo', 'Cualquiera con el link']} />
          </Row>
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'Card · interactive', type: 'boolean', note: 'levanta la tarjeta en hover; por defecto no se mueve' },
          { name: 'Card · className', type: 'string', note: 'para el ancho' },
          { name: 'Row · label', type: 'string', note: 'obligatorio' },
          { name: 'Row · hint', type: 'string', note: 'segunda línea en 11px gris' },
          { name: 'Row · children', type: 'ReactNode', note: 'el control, alineado a la derecha' },
        ]} />
      </Section>
    </Page>
  )
}
