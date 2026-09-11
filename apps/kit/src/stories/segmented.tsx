import { useState } from 'react'
import { Segmented } from '@melu/ui'
import { Block, Panel, Props, Section, Variant } from '../kit'

export function SegmentedStory() {
  const [filtro, setFiltro] = useState<'todas' | 'abiertas'>('todas')
  const [vista, setVista] = useState<'grilla' | 'lista'>('grilla')
  const [rango, setRango] = useState<'semana' | 'mes'>('semana')
  const [chico, setChico] = useState<'semana' | 'mes'>('semana')

  return (
    <Section
      title="Segmented"
      note="Un solo componente para el filtro de texto («Todas · Abiertas») y para el conmutador de grilla/lista. Que sean la misma pieza y no dos parecidas es el punto: dos implementaciones del mismo control se van separando sola una de la otra con cada cambio, y terminan con dos radios, dos alturas y dos ideas de qué es «activo»."
    >
      <Block
        label="Tamaños"
        note="La pista es un contenedor apagado y la opción activa es una superficie con relieve que flota adentro. El radio de la opción es el de la pista menos su padding, y las dos medidas tienen que dar la cuenta: sm es pista 12 menos 2 → opción 10; md es pista 16 menos 4 → opción 12. Este control ya tuvo el bug de un 6 donde iban 10."
      >
        <Panel>
          <Variant name="md · texto">
            <Segmented value={filtro} onChange={setFiltro}
              options={[{ value: 'todas', label: 'Todas' }, { value: 'abiertas', label: 'Abiertas' }]} />
          </Variant>
          <Variant name="md · iconos">
            <Segmented value={vista} onChange={setVista}
              options={[{ value: 'grilla', icon: 'grid', title: 'Grilla' }, { value: 'lista', icon: 'layers', title: 'Lista' }]} />
          </Variant>
          <Variant name="sm">
            <Segmented size="sm" value={rango} onChange={setRango}
              options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]} />
          </Variant>
          <Variant name="xs · sin pista">
            <Segmented size="xs" value={chico} onChange={setChico}
              options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes', dot: true }]} />
          </Variant>
        </Panel>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'value', type: 'T extends string', note: 'obligatorio' },
          { name: 'onChange', type: '(v: T) => void', note: 'obligatorio' },
          { name: 'options', type: '{ value, label?, icon?, dot?, title? }[]', note: 'sin label la opción queda cuadrada, solo icono — y title pasa a obligatorio' },
          { name: 'size', type: "'xs' | 'sm' | 'md'", def: "'md'", note: 'xs va con pista transparente: dentro del header de un panel, una pista gris sobre fondo gris agrega una caja que no hace falta' },
        ]} />
      </Block>
    </Section>
  )
}
