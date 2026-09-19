import { Button } from '@milo/ui'
import { useEffect, useRef, useState } from 'react'
import { A11y, Cluster, Demo, Page, Panel, Props, Section, Variant } from '../kit'

/** Dos respuestas de verdad, una más rápida que la espera y otra más lenta, para
 *  ver que la corta no dibuja nada y la larga no se corta. */
function Probar() {
  const [cargando, setCargando] = useState<'' | 'corta' | 'larga'>('')
  const t = useRef<number | undefined>(undefined)
  useEffect(() => () => clearTimeout(t.current), [])
  const correr = (cual: 'corta' | 'larga', ms: number) => {
    setCargando(cual)
    clearTimeout(t.current)
    t.current = setTimeout(() => setCargando(''), ms) as unknown as number
  }
  return (
    <Cluster align="start">
      <Demo label="una acción corta">
        <Button variant="brand" loading={cargando === 'corta'} onClick={() => correr('corta', 80)}>
          Guardar
        </Button>
      </Demo>
      <Demo label="una acción que tarda">
        <Button variant="brand" iconStart="folder" loading={cargando === 'larga'} onClick={() => correr('larga', 900)}>
          Nuevo espacio
        </Button>
      </Demo>
    </Cluster>
  )
}

export function ButtonStory() {
  return (
    <Page
      title="Button"
      kind="Acciones"
      imports="import { Button } from '@milo/ui'"
      lead="El texto va un escalón arriba del de su entorno: un botón con el mismo tamaño de letra que lo que lo rodea no se lee como accionable."
    >
      <Section
        title="Variantes"
        note="Lo que elegís es cuánto pesa la acción en la pantalla. El color sale de eso, no al revés."
      >
        <Panel>
          <Variant
            name="brand"
            note="**La acción que manda**, y hay una sola por pantalla."
          >
            <Button variant="brand">Crear actividad</Button>
          </Variant>
          <Variant
            name="solid"
            note="**La misma acción que manda, en tinta**, para una pantalla donde el azul no se puede usar. Va este o `brand`, nunca los dos, o la mirada no sabe cuál es."
          >
            <Button variant="solid">Crear actividad</Button>
          </Variant>
          <Variant
            name="muted"
            note="**Lo secundario**: la acción que acompaña a la que manda. Relleno claro y tinta, sin color, así que no compite."
          >
            <Button variant="muted">Crear actividad</Button>
          </Variant>
          <Variant
            name="ghost"
            note="**Lo terciario**: la que está ahí por si acaso. No dibuja caja hasta que le pasás el mouse."
          >
            <Button variant="ghost">Crear actividad</Button>
          </Variant>
          <Variant
            name="bad"
            note="**Lo que no se puede deshacer.** No es un aviso de que algo salió mal: es la acción que borra, y por eso lleva el rojo la acción y no el mensaje."
          >
            <Button variant="bad">Eliminar</Button>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Tamaños"
        note="Una fila densa, un panel, la acción principal. El `lg` cae en 44, que es el objetivo táctil, así que la que manda ya llega con el dedo."
      >
        <Panel>
          <Variant name="sm · 36">
            <Button size="sm" variant="brand">Guardar</Button>
            <Button size="sm" variant="muted">Guardar</Button>
          </Variant>
          <Variant name="md · 40">
            <Button size="md" variant="brand">Guardar</Button>
            <Button size="md" variant="muted">Guardar</Button>
          </Variant>
          <Variant name="lg · 44">
            <Button size="lg" variant="brand">Guardar</Button>
            <Button size="lg" variant="muted">Guardar</Button>
          </Variant>
        </Panel>
      </Section>

      <Section title="Iconos, ancho completo y deshabilitado">
        <Cluster align="start">
          <Demo label="iconStart"><Button variant="muted" iconStart="folder">Nuevo espacio</Button></Demo>
          <Demo label="iconEnd"><Button variant="muted" iconEnd="chevron_right">Siguiente</Button></Demo>
          <Demo label="disabled">
            <Button variant="solid" disabled>Guardar</Button>
            <Button variant="muted" disabled>Guardar</Button>
          </Demo>
          <Demo width="xs" label="block"><Button variant="solid" block>Entrar</Button></Demo>
        </Cluster>
      </Section>

      <Section
        title="Cargando"
        note="Para una acción que tarda. El botón avisa que está trabajando y no se deja tocar de nuevo hasta que termina."
      >
        <Cluster align="start">
          <Demo label="las cinco variantes">
            <Button variant="brand" loading>Guardar</Button>
            <Button variant="solid" loading>Guardar</Button>
            <Button variant="muted" loading>Guardar</Button>
          </Demo>
          <Demo label="y las otras dos">
            <Button variant="ghost" loading>Guardar</Button>
            <Button variant="bad" loading>Eliminar</Button>
          </Demo>
          <Demo label="quieto y cargando">
            <Button variant="brand" iconStart="folder">Nuevo espacio</Button>
            <Button variant="brand" iconStart="folder" loading>Nuevo espacio</Button>
          </Demo>
          <Demo label="en los tres tamaños">
            <Button size="sm" variant="brand" loading>Guardar</Button>
            <Button size="md" variant="brand" loading>Guardar</Button>
            <Button size="lg" variant="brand" loading>Guardar</Button>
          </Demo>
        </Cluster>
        <Probar />
      </Section>

      <Section title="Props">
        <Props of="Button" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un <button> real: entra en el orden de tabulación y responde a Enter y Espacio.',
          'El anillo de foco se dibuja por fuera de la caja, con dos píxeles de superficie de por medio: no mueve el botón ni empuja a los de al lado.',
          'Deshabilitado deja de recibir el puntero y baja a 45% de opacidad, pero conserva su texto legible.',
        ]} />
      </Section>
    </Page>
  )
}
