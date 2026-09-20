import cls from './steps.module.css'
import { useState } from 'react'
import { Button } from '@milo/ui/button'
import { Icon } from '@milo/ui/icon'
import { Steps } from '@milo/ui/steps'
import { A11y, Note, Page, Props, Section } from '../kit'

const design = [
  { label: 'Empatizar', hint: 'Escuchar a quien tiene el problema' },
  { label: 'Definir', hint: 'Escribir el problema en una frase' },
  { label: 'Idear', hint: 'Muchas ideas antes de elegir' },
  { label: 'Prototipar', hint: 'Lo más barato que se pueda probar' },
  { label: 'Testear', hint: 'Mirar a alguien usarlo' },
]

const handIn = [
  { label: 'Leer la consigna' },
  { label: 'Resolver' },
  { label: 'Revisar' },
  { label: 'Entregar' },
]

export function StepsStory() {
  const [i, setI] = useState(2)
  const [step, setStep] = useState(2)

  return (
    <Page
      title="Steps"
      kind="Navegación"
      imports="import { Steps } from '@milo/ui/steps'"
      lead="Por dónde va algo que tiene etapas: una actividad en partes, un proceso de diseño, un formulario largo. Dice dónde estás y cuánto falta, que es lo que una barra de progreso no puede decir."
    >
      <Section title="La pieza" note="Las anteriores quedan hechas, la actual se marca, las que siguen esperan.">
        <div className={`${cls.pieceBox} bg-surface`}>
          <Steps steps={design} current={i} label="Etapas del proyecto" />
        </div>
        <div className={cls.pieceActions}>
          <Button size="sm" variant="muted" iconStart={<Icon name="arrow_back" />} disabled={i === 0} onClick={() => setI(n => n - 1)}>Atrás</Button>
          <Button size="sm" variant="muted" iconEnd={<Icon name="arrow_forward" />} disabled={i === design.length - 1} onClick={() => setI(n => n + 1)}>Siguiente</Button>
        </div>
      </Section>

      <Section
        title="Parada"
        note="Cuando cada etapa necesita su propio texto al lado, o cuando la secuencia va en una columna angosta. En pantalla chica la acostada se para sola."
      >
        <div className={`${cls.stoppedBox} bg-surface`}>
          <Steps orientation="vertical" steps={handIn} current={1} label="Cómo se entrega" />
        </div>
      </Section>

      <Section
        title="Indicador o navegación"
        note="Sin `onSelect` no hay nada que tocar: dice dónde estás y nada más. Con `onSelect` cada etapa es un botón, y eso solo va cuando volver atrás es de verdad posible."
      >
        <div className={`${cls.navBox} bg-surface`}>
          <Steps steps={handIn} current={step} label="Cómo se entrega, navegable" onSelect={setStep} />
        </div>
      </Section>

      <Note title="Steps o Progress">
        El `Progress` dice cuánto de un total está hecho y sirve cuando las partes son
        intercambiables: once de dieciocho entregas. `Steps` sirve cuando las partes tienen nombre y
        orden, y lo que importa no es el porcentaje sino cuál viene ahora.
      </Note>

      <Props of={['Steps', 'Step']} />

      <A11y
        items={[
          'Es una lista ordenada con nombre: quien la escucha sabe cuántas etapas hay antes de recorrerlas.',
          'La etapa en curso lleva `aria-current="step"`, y es una sola.',
          'Hecha, en curso y pendiente se dicen con palabras además de con color y con el tilde. El color nunca va solo.',
          'Sin `onSelect` no hay botones: una etapa que no lleva a ningún lado no debería recibir el foco.',
        ]}
      />
    </Page>
  )
}
