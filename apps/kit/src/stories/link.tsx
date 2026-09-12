import { Link } from '@milo/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function LinkStory() {
  return (
    <Page
      title="Link"
      kind="Superficies"
      imports="import { Link } from '@milo/ui'"
      lead="Un enlace lleva subrayado, siempre. El azul primario está tomado —lo usan el CTA y el estado activo— así que teñir un enlace lo confundiría con una de esas dos cosas. El subrayado no es decoración: es la única señal que queda."
    >
      <Section
        title="Adentro de un párrafo"
        note="Es el caso para el que existe la pieza: un enlace suelto en medio de una frase. Fuera de un párrafo —una fila de una lista, una acción de una barra— lo que corresponde es un `Button` con variante `ghost`, que tiene el alto y el blanco de click de un control."
      >
        <Canvas className="flex-col items-start gap-3">
          <p className="max-w-[60ch] text-body font-medium text-ink-muted">
            Las entregas se cierran en la fecha que elijas. Podés cambiarla desde{' '}
            <Link href="#link">los ajustes de la actividad</Link> mientras siga abierta.
          </p>
        </Canvas>
      </Section>

      <Section
        title="El de afuera avisa"
        note="`external` agrega el glifo, el `target` y el `rel`, y —lo que no se ve— el texto «se abre en otra pestaña» para el lector de pantalla. Abrir una pestaña sin avisar rompe el botón de volver, que es el control que más se usa de todo el navegador."
      >
        <Canvas className="flex-col items-start gap-3">
          <Link href="https://m3.material.io/styles/icons" external>Material Symbols</Link>
          <p className="max-w-[60ch] text-body font-medium text-ink-muted">
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
          'El subrayado no depende del color: se ve igual en monocromo y en alto contraste.',
          'Un link externo dice «se abre en otra pestaña» además de mostrar el glifo.',
          'El texto dice a dónde lleva: «los ajustes de la actividad» y no «hacé click acá», que fuera de la frase no significa nada.',
          'El foco se ve con el mismo anillo azul que el resto del sistema.',
        ]} />
      </Section>
    </Page>
  )
}
