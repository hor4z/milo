import { Button } from '@milo/ui/button'
import { Icon } from '@milo/ui/icon'
import { useEffect, useRef, useState } from 'react'
import { A11y, Demo, Example, Grid, Page, Panel, Practices, Props, Section, Variant } from '../kit'

/** Dos respuestas de verdad, una más rápida que la espera y otra más lenta, para ver que la corta no dibuja nada y la larga no se corta. */
function TryLoading() {
  const [running, setRunning] = useState<'' | 'short' | 'long'>('')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const run = (which: 'short' | 'long', ms: number) => {
    setRunning(which)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setRunning(''), ms) as unknown as number
  }
  return (
    <Grid>
      <Demo label="Tocá: esta responde enseguida">
        <Button variant="brand" iconStart={<Icon name="save" />} loading={running === 'short'} onClick={() => run('short', 80)}>
          Guardar
        </Button>
      </Demo>
      <Demo label="Tocá: esta tarda">
        <Button variant="brand" iconStart={<Icon name="save" />} loading={running === 'long'} onClick={() => run('long', 900)}>
          Guardar
        </Button>
      </Demo>
    </Grid>
  )
}

export function ButtonStory() {
  return (
    <Page
      title="Button"
      kind="Acciones"
      imports="import { Button } from '@milo/ui/button'"
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

      <Section title="Con icono, ancho completo y deshabilitado">
        <Grid>
          <Demo label="Con un icono al comienzo">
            <Button variant="muted" iconStart={<Icon name="folder" />}>Nuevo espacio</Button>
          </Demo>
          <Demo label="Con un icono al final">
            <Button variant="muted" iconEnd={<Icon name="chevron_right" />}>Siguiente</Button>
          </Demo>
          <Demo label="Deshabilitado">
            <Button variant="brand" disabled>Guardar</Button>
          </Demo>
          <Demo label="Ocupando el ancho">
            <Button variant="brand" block>Entrar</Button>
          </Demo>
        </Grid>
      </Section>

      <Section
        title="Cargando"
        note="Para una acción que tarda. El botón avisa que está trabajando y no se deja tocar de nuevo hasta que termina."
      >
        <Panel>
          <Variant name="brand"><Button variant="brand" loading>Guardar</Button></Variant>
          <Variant name="solid"><Button variant="solid" loading>Guardar</Button></Variant>
          <Variant name="muted"><Button variant="muted" loading>Guardar</Button></Variant>
          <Variant name="ghost"><Button variant="ghost" loading>Guardar</Button></Variant>
          <Variant name="bad"><Button variant="bad" loading>Eliminar</Button></Variant>
        </Panel>
        <Grid min={340}>
          <Demo label="Antes y mientras carga">
            <Button variant="brand" iconStart={<Icon name="folder" />}>Nuevo espacio</Button>
            <Button variant="brand" iconStart={<Icon name="folder" />} loading>Nuevo espacio</Button>
          </Demo>
          <Demo label="Los tres tamaños">
            <Button size="sm" variant="brand" loading>Guardar</Button>
            <Button size="md" variant="brand" loading>Guardar</Button>
            <Button size="lg" variant="brand" loading>Guardar</Button>
          </Demo>
        </Grid>
        <TryLoading />
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`
<Button variant="brand" onClick={crear}>
  Crear actividad
</Button>

<Button variant="muted" iconStart={<Icon name="folder" />} size="sm">
  Nuevo espacio
</Button>

<Button variant="brand" loading={guardando} onClick={guardar}>
  Guardar
</Button>
`} />
      </Section>

      <Section title="Props">
        <Props of="Button" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>La acción que manda va en `variant="brand"`, y hay una sola por pantalla: si hay dos, ninguna manda.</Practices.Do>
          <Practices.Do>El texto dice qué va a pasar (`Publicar`, `Archivar`), no `Aceptar`.</Practices.Do>
          <Practices.Dont>No pongas `solid` y `brand` juntos: son el mismo rol en dos tintas, va uno o el otro.</Practices.Dont>
          <Practices.Dont>No uses un botón para navegar: eso es un `Link`, y con el botón se pierde abrir en otra pestaña.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>{'Es un <button> real: entra en el orden de tabulación y responde a Enter y Espacio.'}</A11y.Item>
          <A11y.Item>El anillo de foco se dibuja por fuera de la caja, con dos píxeles de superficie de por medio: no mueve el botón ni empuja a los de al lado.</A11y.Item>
          <A11y.Item>Deshabilitado deja de recibir el puntero y baja a 45% de opacidad, pero conserva su texto legible.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
