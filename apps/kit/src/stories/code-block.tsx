import { CodeBlock } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

const arduino = `void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(500);
  digitalWrite(LED, LOW);
  delay(500);
}
`

const python = `def promedio(notas):
    if not notas:
        return None
    return sum(notas) / len(notas)
`

const largo = `const resultado = estudiantes.filter(e => e.entregas.some(x => x.estado === 'corregida')).map(e => ({ nombre: e.nombre, promedio: media(e.entregas) }))
`

export function CodeBlockStory() {
  return (
    <Page
      title="CodeBlock"
      kind="Editor"
      imports="import { CodeBlock } from '@milo/ui'"
      lead="Código para leer, no para editar. Lleva su nombre de archivo, su botón de copiar y, si hace falta, la columna de números para poder decir «mirá la línea 6»."
    >
      <Section
        title="Lo básico"
        note="El nombre del archivo arriba y el botón de copiar a la derecha. Sin nombre queda el lenguaje, y sin ninguno de los dos la franja igual está: es donde vive el botón, y un botón que aparece al pasar el mouse no se descubre sin mouse."
      >
        <div className="flex flex-col gap-4">
          <CodeBlock code={python} filename="promedio.py" lang="python" />
          <CodeBlock code={`npm run dev\n`} lang="sh" />
        </div>
      </Section>

      <Section
        title="Con números"
        note="Para cuando el código se comenta en voz alta. Los números no se copian ni se leen en voz alta: son una referencia para quien mira, y en lo que se pega solo va el código."
      >
        <CodeBlock code={arduino} filename="parpadeo.ino" lang="cpp" numbered />
      </Section>

      <Section
        title="Cuando no entra"
        note="Una línea larga no se parte ni encoge el resto: el bloque se desplaza. Y recién cuando de verdad hay algo cortado a la derecha se vuelve una parada de tabulación, porque sin eso esa parte no se alcanza sin mouse."
      >
        <div className="max-w-[420px]">
          <CodeBlock code={largo} lang="js" />
        </div>
      </Section>

      <Note icon="lightbulb" title="El color lo pone quien sabe colorear">
        Marcar la sintaxis pide una gramática por lenguaje, y eso es una biblioteca — de las que
        pesan más que todo este paquete. La pieza deja el lugar hecho: `code` es siempre el texto
        que se copia, y `children` recibe el mismo código ya coloreado por fuera. El `language-*`
        de la etiqueta es el que esos coloreadores buscan.
      </Note>

      <Section title="Props">
        <Props of="CodeBlock" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es `pre` y `code` de verdad, así que un lector de pantalla anuncia que entra en código y deja de leer la puntuación como prosa.',
          'Los números de línea van con `aria-hidden` y sin poder seleccionarse: no se escuchan y no ensucian lo que se pega.',
          'El bloque que desborda es una región enfocable con nombre, y solo cuando desborda.',
          'El botón de copiar dice qué hace y confirma que copió, para quien no ve el cambio de glifo.',
        ]} />
      </Section>
    </Page>
  )
}
