import cls from './reorder.module.css'
import { useState } from 'react'
import { Icon, type IconName } from '@milo/ui/icon'
import { Reorder, type ReorderItem } from '@milo/ui/reorder'
import { A11y, Canvas, Example, Frame, Note, Page, Practices, Props, Section } from '../kit'

type Block = ReorderItem & { icon: IconName; meta: string }

const initial: Block[] = [
  { id: 'titulo', label: 'Título', icon: 'format_h1', meta: 'Creá tu propio emprendimiento' },
  { id: 'aviso', label: 'Bloque destacado', icon: 'lightbulb', meta: 'La pregunta que hay que contestar' },
  { id: 'presupuesto', label: 'Tabla que se suma', icon: 'table_rows', meta: 'Repartí los $100.000' },
  { id: 'precio', label: 'Respuesta numérica', icon: 'calculate', meta: 'El margen por unidad' },
  { id: 'competencia', label: 'Cuadro comparativo', icon: 'compare_arrows', meta: 'Contra quién competís' },
]

export function ReorderStory() {
  const [blocks, setBlocks] = useState(initial)

  return (
    <Page
      title="Reorder"
      kind="Navegación"
      imports="import { Reorder } from '@milo/ui/reorder'"
      lead="Una lista que cambia de orden: los bloques de una consigna, las etapas de una entrega. Se arrastra con el dedo o el mouse, y se mueve con el teclado: las dos cosas, no una."
    >
      <Section
        title="Los bloques de una consigna"
        note="Agarrá una manija y arrastrá. O tabulá hasta una y usá las flechas: es la misma operación y hace lo mismo. Lo que se agarra se levanta en papel y deja su hueco gris abajo, que es donde va a caer; las otras se corren solas. Después de mover, el foco se queda en la fila que se movió, que es donde está mirando quien la movió."
      >
        <Canvas>
          <Frame width="lg">
            <Reorder items={blocks} onReorder={setBlocks} label="Bloques de la consigna">
              {b => (
                <div className={cls.blockRow}>
                  <Icon name={b.icon} size={18} className={`${cls.blockIcon} icon-muted`} />
                  <span className={cls.blockLabel}>{b.label}</span>
                  <span className={cls.blockMeta}>{b.meta}</span>
                </div>
              )}
            </Reorder>
          </Frame>
        </Canvas>
      </Section>

      <Note title="Cómo se mueve, y por qué así">
        Lo que se agarra queda pegado al dedo exactamente: cada cuadro se lo vuelve a medir contra
        el lugar donde el layout lo dejó, así que sigue estando bajo el puntero aunque el orden
        haya cambiado abajo. Las otras no se dibujan una por una: se anota dónde estaban, se las
        devuelve ahí con un `transform`, y se las suelta con la transición puesta: el navegador
        anima entre las dos posiciones y nadie calcula nada por cuadro. Con el movimiento reducido
        apagado, las filas cambian de lugar de una: lo que se apaga es la animación, no el gesto.
      </Note>

      <Note icon="lightbulb" title="Arrastrar solo con el puntero no alcanza">
        Es la interacción que más fácil deja gente afuera: quien usa el teclado, quien usa un lector
        de pantalla, y cualquiera con un temblor en la mano. Por eso la manija es un botón de verdad
        (se tabula, se enfoca y se ve el anillo) y las flechas hacen lo mismo que el arrastre. El
        arrastre es la comodidad; el teclado es la pieza.
      </Note>

      <Note title="Y lo que cambió se dice">
        Al mover con el teclado la pantalla cambia sola y nadie avisó: la fila se fue a otro lado y
        quien no la ve no tiene cómo enterarse. Después de cada movimiento se anuncia "Fórmula,
        posición 2 de 5", y el aviso se borra solo: si se queda, un lector lo repite al volver a
        entrar en la lista.
      </Note>

      <Section title="Cómo se escribe">
        <Example code={`const [items, setItems] = useState(pasos)
<Reorder label="Pasos de la consigna" items={items} onReorder={setItems} />`} />
      </Section>

      <Section title="Props">
        <Props of={['Reorder', 'ReorderItem']} />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>El teclado es la pieza y el arrastre la comodidad: las flechas mueven la fila.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>La manija es un `button` con nombre propio: dice qué mueve y en qué posición está ("Mover Fórmula, posición 3 de 5"), así que se sabe dónde se está antes de mover nada.</A11y.Item>
          <A11y.Item>Las flechas arriba y abajo mueven la fila, y eso está escrito en la descripción de la manija: una tecla que nadie anuncia es una tecla que nadie usa.</A11y.Item>
          <A11y.Item>Cada movimiento se anuncia con `aria-live`, porque el cambio lo produjo el teclado y no hay nada más que lo diga.</A11y.Item>
          <A11y.Item>El foco sigue a la fila movida en vez de quedarse en el lugar: si se queda, la próxima flecha mueve otra fila.</A11y.Item>
          <A11y.Item>En los extremos no pasa nada y no se avisa nada: no hay a dónde ir, y un aviso ahí sería ruido.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
