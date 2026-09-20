import cls from './slider.module.css'
import { useState } from 'react'
import { Slider } from '@milo/ui/slider'
import { A11y, Example, Footnote, Frame, Mono, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function SliderStory() {
  const [a, setA] = useState(59)
  const [b, setB] = useState(0)
  const [c, setC] = useState(100)
  const [steps, setSteps] = useState(3)

  return (
    <Page
      title="Slider"
      kind="Formularios"
      imports="import { Slider } from '@milo/ui/slider'"
      lead="El hermano del switch, y por eso no tiene recetas propias: la pista llena, la vacía y el pulgar son los del switch. Los dos son una píldora con una pieza redonda encima, así que el día que cambie el relieve de uno tiene que cambiar el del otro."
    >
      <Section
        title="La pieza"
        note="El pulgar sobresale del riel y se agarra, al revés que el del `Switch`, que corre adentro de su canal. Esa es la diferencia entre elegir un valor y prender algo."
      >
        <Panel>
          <Variant name={`valor ${a}`}>
            <Frame width="sm">
              <Slider value={a} onChange={setA} label="Volumen" />
            </Frame>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Los extremos"
        note="El pulgar viaja entre 12 y el ancho menos 12, así que la cuenta lleva su propio tamaño adentro. Sin eso, en 0 y en 100 la mitad del pulgar queda afuera de la pista."
      >
        <Panel>
          <Variant name="en 0">
            <Frame width="sm">
              <Slider value={b} onChange={setB} label="En cero" />
            </Frame>
          </Variant>
          <Variant name="en 100">
            <Frame width="sm">
              <Slider value={c} onChange={setC} label="En cien" />
            </Frame>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Con pasos"
        note="Las flechas, Home, End y el arrastre vienen del `range` nativo, así que el teclado funciona sin que nadie lo escriba."
      >
        <Panel>
          <Variant name={`${steps} de 5 · step 1, max 5`}>
            <Frame width="sm">
              <Slider value={steps} onChange={setSteps} min={0} max={5} step={1} label="Dificultad" />
            </Frame>
          </Variant>
        </Panel>
        <Footnote>
          Probalo con el teclado: tabulá hasta el slider y usá las flechas. El anillo de foco se
          suma al relieve del pulgar en vez de reemplazarlo: la regla global de <code>:focus-visible</code>{' '}
          pisa el <code>box-shadow</code> entero y deja la pieza plana, que es el bug que está anotado en
          Pendiente para el resto de los controles.
        </Footnote>
      </Section>

      <Section title="Deshabilitado">
        <Panel>
          <Variant name="disabled">
            <Frame width="sm">
              <Slider value={40} onChange={() => {}} disabled label="Deshabilitado" />
            </Frame>
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`const [peso, setPeso] = useState(50)
<Slider value={peso} onChange={setPeso} min={0} max={100} step={5} label="Peso de la nota" />`} />
      </Section>

      <Section title="Props">
        <Props of="Slider" />
      </Section>

      <Section title="El azul no se elige acá">
        <p className={cls.blueText}>
          Es la regla de rol que ya está escrita: el azul es lo que el usuario prendió o
          confirmó (el switch, el checkbox, el CTA) y el valor de un slider es exactamente eso.
          El punto azul del pulgar es la misma frase dicha en la pieza que se agarra.{' '}
          <Mono>--switch-on</Mono> y <Mono>--brand</Mono>, sin un hex nuevo.
        </p>
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Va cuando el valor exacto no importa; si importa, va un `Stepper`.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>{'Es un <input type="range"> de verdad: flechas, Home, End y PageUp funcionan solas.'}</A11y.Item>
          <A11y.Item>El pulgar dibujado toma el foco del input que hay debajo.</A11y.Item>
          <A11y.Item>El label lo nombra aunque en pantalla no haya texto al lado.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
