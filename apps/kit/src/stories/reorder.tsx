import { useState } from 'react'
import { Icon, Reorder, type ReorderItem, type IconName } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

type Bloque = ReorderItem & { icon: IconName; meta: string }

const inicial: Bloque[] = [
  { id: 'titulo', label: 'Título', icon: 'format_h1', meta: 'Caída libre: medir g en el patio' },
  { id: 'aviso', label: 'Bloque destacado', icon: 'lightbulb', meta: 'Antes de subir al primer piso' },
  { id: 'cita', label: 'Cita', icon: 'format_quote', meta: 'Galileo, Diálogos sobre dos nuevas ciencias' },
  { id: 'tareas', label: 'Lista de tareas', icon: 'checklist', meta: 'Cuatro cosas para entregar' },
  { id: 'imagen', label: 'Imagen', icon: 'image', meta: 'Otto, con su pie' },
]

export function ReorderStory() {
  const [bloques, setBloques] = useState(inicial)

  return (
    <Page
      title="Reorder"
      kind="Navegación"
      imports="import { Reorder } from '@milo/ui'"
      lead="Una lista que cambia de orden: los bloques de una consigna, las etapas de una entrega. Se arrastra con el dedo o el mouse, y se mueve con el teclado: las dos cosas, no una."
    >
      <Section
        title="Los bloques de una consigna"
        note="Agarrá una manija y arrastrá. O tabulá hasta una y usá las flechas: es la misma operación y hace lo mismo. Lo que se agarra se levanta en papel y deja su hueco gris abajo, que es donde va a caer; las otras se corren solas. Después de mover, el foco se queda en la fila que se movió, que es donde está mirando quien la movió."
      >
        <Canvas>
          <div className="w-full max-w-[520px]">
            <Reorder items={bloques} onReorder={setBloques} label="Bloques de la consigna">
              {b => (
                <div className="flex min-w-0 items-center gap-3">
                  <Icon name={b.icon} size={18} className="shrink-0 icon-muted" />
                  <span className="shrink-0 text-body font-semibold text-ink">{b.label}</span>
                  <span className="min-w-0 truncate text-meta font-medium text-ink-muted">{b.meta}</span>
                </div>
              )}
            </Reorder>
          </div>
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

      <Section title="Props">
        <Props of={['Reorder', 'ReorderItem']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La manija es un `button` con nombre propio: dice qué mueve y en qué posición está ("Mover Fórmula, posición 3 de 5"), así que se sabe dónde se está antes de mover nada.',
          'Las flechas arriba y abajo mueven la fila, y eso está escrito en la descripción de la manija: una tecla que nadie anuncia es una tecla que nadie usa.',
          'Cada movimiento se anuncia con `aria-live`, porque el cambio lo produjo el teclado y no hay nada más que lo diga.',
          'El foco sigue a la fila movida en vez de quedarse en el lugar: si se queda, la próxima flecha mueve otra fila.',
          'En los extremos no pasa nada y no se avisa nada: no hay a dónde ir, y un aviso ahí sería ruido.',
        ]} />
      </Section>
    </Page>
  )
}
