import { useState } from 'react'
import { Segmented } from '@melu/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function SegmentedStory() {
  const [filter, setFilter] = useState<'todas' | 'abiertas'>('todas')
  const [view, setView] = useState<'grilla' | 'lista'>('grilla')
  const [range, setRange] = useState<'semana' | 'mes'>('semana')
  const [small, setSmall] = useState<'semana' | 'mes'>('semana')

  return (
    <Page
      title="Segmented"
      kind="Formularios"
      imports="import { Segmented } from '@melu/ui'"
      lead="Un solo componente para el filtro de texto («Todas · Abiertas») y para el conmutador de grilla/lista. Que sean la misma pieza y no dos parecidas es el punto: dos implementaciones del mismo control se van separando sola una de la otra con cada cambio, y terminan con dos radios, dos alturas y dos ideas de qué es «activo»."
    >
      <Section
        title="Tamaños"
        note="La pista es un contenedor apagado y la opción activa es una superficie con relieve que flota adentro. El radio de la opción es el de la pista menos su padding, y las dos medidas tienen que dar la cuenta: sm es pista 12 menos 2 → opción 10; md es pista 16 menos 4 → opción 12. Este control ya tuvo el bug de un 6 donde iban 10."
      >
        <Panel>
          <Variant name="md · texto">
            <Segmented label="Filtro" value={filter} onChange={setFilter}
              options={[{ value: 'todas', label: 'Todas' }, { value: 'abiertas', label: 'Abiertas' }]} />
          </Variant>
          <Variant name="md · iconos">
            <Segmented label="Vista" value={view} onChange={setView}
              options={[{ value: 'grilla', icon: 'grid_view', title: 'Grilla' }, { value: 'lista', icon: 'layers', title: 'Lista' }]} />
          </Variant>
          <Variant name="sm">
            <Segmented size="sm" label="Rango" value={range} onChange={setRange}
              options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
          </Variant>
          <Variant name="xs · sin pista">
            <Segmented size="xs" label="Rango" value={small} onChange={setSmall}
              options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes', dot: true }]} />
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Segmented" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Es un radiogroup: elegir una de varias, que es lo que hace. Antes era un tablist, y un tablist sin paneles le promete a un lector de pantalla algo que no existe.',
          'Las flechas mueven la elección y dan la vuelta; Tab entra al grupo y sale, porque solo la elegida es tabulable.',
          'Con solo iconos, el `title` es el nombre accesible y además la etiqueta del Tooltip: no queda la caja del sistema operativo diciendo lo mismo.',
          'Adentro de un Field o de un Row, el grupo se nombra con la etiqueta que ya está escrita.',
          'El chip elegido conserva el relieve al enfocarse con el teclado.',
        ]} />
      </Section>
    </Page>
  )
}
