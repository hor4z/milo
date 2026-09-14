import cls from './link.module.css'
import { Link } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function LinkStory() {
  return (
    <Page
      title="Link"
      kind="Superficies"
      imports="import { Link } from '@milo/ui'"
      lead="Azul **y** subrayado, las dos cosas. El color solo no alcanza (hay quien no lo distingue) y el subrayado solo dejaba al enlace confundido con el texto en negrita de al lado. Con las dos señales, un enlace se reconoce sin leerlo y sin depender de ver el tono."
    >
      <Section
        title="Adentro de un párrafo"
        note="Es el caso para el que existe la pieza: un enlace suelto en medio de una frase. Fuera de un párrafo (una fila de una lista, una acción de una barra) lo que corresponde es un `Button` con variante `ghost`, que tiene el alto y el blanco de click de un control."
      >
        <Canvas stack>
          <p className={cls.paragraphText}>
            Las entregas se cierran en la fecha que elijas. Podés cambiarla desde{' '}
            <Link href="#link">los ajustes de la actividad</Link> mientras siga abierta.
          </p>
        </Canvas>
      </Section>

      <Section
        title="El de afuera avisa"
        note="`external` agrega el glifo, el `target` y el `rel`, y (lo que no se ve) el texto 'se abre en otra pestaña' para el lector de pantalla. Abrir una pestaña sin avisar rompe el botón de volver, que es el control que más se usa de todo el navegador."
      >
        <Canvas stack>
          <Link href="https://m3.material.io/styles/icons" external>Material Symbols</Link>
          <p className={cls.externalText}>
            El set sale de <Link href="https://fonts.google.com/icons" external>Google Fonts</Link>, subseteado
            a los 160 que usamos.
          </p>
        </Canvas>
      </Section>

      <Note title="Link o Button">
        El link va a algún lado; el botón hace algo. Un link que borra no da la opción de abrirlo en
        otra pestaña sin borrar, y un botón que navega no se puede copiar ni guardar. Cuando hay una
        URL de verdad, va link.
      </Note>

      <Section title="Props">
        <Props of="Link" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El subrayado no depende del color: en monocromo o en alto contraste el enlace se sigue reconociendo.',
          'Un link externo dice "se abre en otra pestaña" además de mostrar el glifo.',
          'El texto dice a dónde lleva: "los ajustes de la actividad" y no "hacé click acá", que fuera de la frase no significa nada.',
          'El foco se ve con el mismo anillo azul que el resto del sistema.',
        ]} />
      </Section>
    </Page>
  )
}
