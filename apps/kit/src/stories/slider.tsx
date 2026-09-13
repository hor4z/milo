import { useState } from 'react'
import { Slider } from '@milo/ui'
import { A11y, Mono, Page, Panel, Props, Section, Variant } from '../kit'

export function SliderStory() {
  const [a, setA] = useState(59)
  const [b, setB] = useState(0)
  const [c, setC] = useState(100)
  const [steps, setSteps] = useState(3)

  return (
    <Page
      title="Slider"
      kind="Formularios"
      imports="import { Slider } from '@milo/ui'"
      lead="El hermano del switch, y por eso no tiene recetas propias: la pista llena, la vacía y el pulgar son los del switch. Los dos son una píldora con una pieza redonda encima, así que el día que cambie el relieve de uno tiene que cambiar el del otro."
    >
      <Section
        title="La pieza"
        note="Pista de 22, la del switch — dos píldoras en el mismo sistema con dos alturas distintas se ven como dos sistemas. El pulgar es de 24 y sobresale, al revés que el del switch, que es de 18 y vive adentro: esa es la diferencia entre los dos controles. El del switch corre por un canal; el del slider está apoyado sobre un riel y se agarra."
      >
        <Panel>
          <Variant name={`valor ${a}`}>
            <Slider value={a} onChange={setA} label="Volumen" className="max-w-[320px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Los extremos"
        note="El pulgar viaja entre 12 y el ancho menos 12, así que la cuenta lleva su propio tamaño adentro. Sin eso, en 0 y en 100 la mitad del pulgar queda afuera de la pista."
      >
        <Panel>
          <Variant name="en 0">
            <Slider value={b} onChange={setB} label="En cero" className="max-w-[320px]" />
          </Variant>
          <Variant name="en 100">
            <Slider value={c} onChange={setC} label="En cien" className="max-w-[320px]" />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Con pasos"
        note="`step`, las flechas y el arrastre son del input nativo: adentro hay un `range` de verdad, transparente y encima de todo. No es el caso del `Select`, donde la lista la dibuja el sistema operativo y no hay forma de estilarla — un range se tapa entero con un div y el teclado viene gratis."
      >
        <Panel>
          <Variant name={`${steps} de 5 · step 1, max 5`}>
            <Slider value={steps} onChange={setSteps} min={0} max={5} step={1} label="Dificultad" className="max-w-[320px]" />
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          Probalo con el teclado: tabulá hasta el slider y usá las flechas. El anillo de foco se
          suma al relieve del pulgar en vez de reemplazarlo — la regla global de <code>:focus-visible</code>
          pisa el <code>box-shadow</code> entero y deja la pieza plana, que es el bug que está anotado en
          Pendiente para el resto de los controles.
        </p>
      </Section>

      <Section title="Deshabilitado">
        <Panel>
          <Variant name="disabled">
            <Slider value={40} onChange={() => {}} disabled label="Deshabilitado" className="max-w-[320px]" />
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Slider" />
      </Section>

      <Section title="El azul no se elige acá">
        <p className="max-w-[70ch] text-body text-ink-muted">
          Es la regla de rol que ya está escrita: el azul es lo que el usuario prendió o
          confirmó —el switch, el checkbox, el CTA— y el valor de un slider es exactamente eso.
          El punto azul del pulgar es la misma frase dicha en la pieza que se agarra.{' '}
          <Mono>--switch-on</Mono> y <Mono>--brand</Mono>, sin un hex nuevo.
        </p>
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Es un <input type="range"> de verdad: flechas, Home, End y PageUp funcionan solas.',
          'El pulgar dibujado toma el foco del input que hay debajo.',
          'El label lo nombra aunque en pantalla no haya texto al lado.',
        ]} />
      </Section>
    </Page>
  )
}
