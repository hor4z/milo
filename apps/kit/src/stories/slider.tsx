import { useState } from 'react'
import { Slider } from '@melu/ui'
import { Block, Mono, Panel, Props, Section, Variant } from '../kit'

export function SliderStory() {
  const [a, setA] = useState(59)
  const [b, setB] = useState(0)
  const [c, setC] = useState(100)
  const [pasos, setPasos] = useState(3)

  return (
    <Section
      title="Slider"
      note="El hermano del switch, y por eso no tiene recetas propias: la pista llena, la vacía y el pulgar son los del switch. Los dos son una píldora con una pieza redonda encima, así que el día que cambie el relieve de uno tiene que cambiar el del otro."
    >
      <Block
        label="La pieza"
        note="Pista de 22, la del switch — dos píldoras en el mismo sistema con dos alturas distintas se ven como dos sistemas. El pulgar es de 24 y sobresale, al revés que el del switch, que es de 18 y vive adentro: esa es la diferencia entre los dos controles. El del switch corre por un canal; el del slider está apoyado sobre un riel y se agarra."
      >
        <Panel>
          <Variant name={`valor ${a}`}>
            <Slider value={a} onChange={setA} label="Volumen" className="max-w-[320px]" />
          </Variant>
        </Panel>
      </Block>

      <Block
        label="Los extremos"
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
      </Block>

      <Block
        label="Con pasos"
        note="`step` es del input nativo, igual que las flechas del teclado y el arrastre: adentro hay un `<input type=&quot;range&quot;>` de verdad, transparente y encima de todo. No es el caso del Select —ahí la lista desplegada la dibuja el sistema operativo y no hay forma de estilarla—; un range se tapa entero con un div y a cambio el teclado y el rol vienen gratis."
      >
        <Panel>
          <Variant name={`${pasos} de 5 · step 1, max 5`}>
            <Slider value={pasos} onChange={setPasos} min={0} max={5} step={1} label="Dificultad" className="max-w-[320px]" />
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Probalo con el teclado: tabulá hasta el slider y usá las flechas. El anillo de foco se
          suma al relieve del pulgar en vez de reemplazarlo — la regla global de `:focus-visible`
          pisa el `box-shadow` entero y deja la pieza plana, que es el bug que está anotado en
          Pendiente para el resto de los controles.
        </p>
      </Block>

      <Block label="Deshabilitado">
        <Panel>
          <Variant name="disabled">
            <Slider value={40} onChange={() => {}} disabled label="Deshabilitado" className="max-w-[320px]" />
          </Variant>
        </Panel>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'value', type: 'number', note: 'obligatorio: es controlado' },
          { name: 'onChange', type: '(v: number) => void', note: 'obligatorio' },
          { name: 'min', type: 'number', def: '0' },
          { name: 'max', type: 'number', def: '100' },
          { name: 'step', type: 'number', def: '1' },
          { name: 'label', type: 'string', note: 'va al aria-label del input' },
          { name: 'disabled', type: 'boolean' },
          { name: 'className', type: 'string', note: 'el ancho se pone desde afuera' },
        ]} />
      </Block>

      <Block label="El azul no se elige acá">
        <p className="max-w-[70ch] text-xs text-ink-muted">
          Es la regla de rol que ya está escrita: el azul es lo que el usuario prendió o
          confirmó —el switch, el checkbox, el CTA— y el valor de un slider es exactamente eso.
          El punto azul del pulgar es la misma frase dicha en la pieza que se agarra.{' '}
          <Mono>--switch-on</Mono> y <Mono>--brand</Mono>, sin un hex nuevo.
        </p>
      </Block>
    </Section>
  )
}
