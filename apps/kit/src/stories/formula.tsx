import { Formula } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

/** v = v₀ + a·t */
const cinematica = (
  <>
    <mi>v</mi><mo>=</mo>
    <msub><mi>v</mi><mn>0</mn></msub>
    <mo>+</mo><mi>a</mi><mo>&#8290;</mo><mi>t</mi>
  </>
)

/** La resolvente. */
const resolvente = (
  <>
    <mi>x</mi><mo>=</mo>
    <mfrac>
      <mrow>
        <mo>&#8722;</mo><mi>b</mi><mo>&#177;</mo>
        <msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#8722;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt>
      </mrow>
      <mrow><mn>2</mn><mi>a</mi></mrow>
    </mfrac>
  </>
)

/** Una fracción chica, para ver cómo entra en un renglón. */
const tresCuartos = <mfrac><mn>3</mn><mn>4</mn></mfrac>

/** Energía mecánica: larga a propósito, para probar el desplazamiento. */
const energia = (
  <>
    <msub><mi>E</mi><mtext>mec</mtext></msub><mo>=</mo>
    <mfrac><mn>1</mn><mn>2</mn></mfrac><mi>m</mi><msubsup><mi>v</mi><mn>0</mn><mn>2</mn></msubsup>
    <mo>+</mo><mi>m</mi><mi>g</mi><msub><mi>h</mi><mn>0</mn></msub>
    <mo>+</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mi>k</mi><msup><mrow><mo>(</mo><mi>x</mi><mo>&#8722;</mo><msub><mi>x</mi><mn>0</mn></msub><mo>)</mo></mrow><mn>2</mn></msup>
    <mo>&#8722;</mo><mi>&#956;</mi><mi>m</mi><mi>g</mi><mi>d</mi><mo>&#8290;</mo><mi>cos</mi><mi>&#952;</mi>
  </>
)

export function FormulaStory() {
  return (
    <Page
      title="Formula"
      kind="Editor"
      imports="import { Formula } from '@milo/ui'"
      lead="Una expresión matemática, en la frase o en su propio renglón. El contenido es MathML: lo dibuja el navegador, se puede seleccionar y copiar como texto, y un lector de pantalla lo recorre parte por parte en vez de deletrearlo."
    >
      <Section
        title="En la frase"
        note="No abre renglón: una fracción o un subíndice entran en el interlineado del párrafo, y los renglones de arriba y de abajo siguen a la misma distancia. Es la misma prueba que se le hace a una mención."
      >
        <div className="max-w-[640px] rounded-xl border border-line bg-surface p-6">
          <p className="text-reading text-ink">
            Si el móvil arranca con velocidad <Formula alt="ve sub cero"><msub><mi>v</mi><mn>0</mn></msub></Formula>{' '}
            y acelera parejo, la velocidad en cualquier momento es{' '}
            <Formula alt="ve igual a ve sub cero más a por te">{cinematica}</Formula>. Para el tramo de{' '}
            <Formula alt="tres cuartos">{tresCuartos}</Formula> de segundo alcanza con reemplazar y
            despejar; lo que conviene mirar después es de dónde sale ese{' '}
            <Formula alt="a"><mi>a</mi></Formula>.
          </p>
        </div>
      </Section>

      <Section
        title="En su propio renglón"
        note="`display` la saca del párrafo: se centra, las fracciones crecen y los límites se acomodan arriba y abajo del signo. Es para la fórmula de la que habla el texto, no para la que el texto menciona al pasar."
      >
        <div className="flex max-w-[640px] flex-col gap-6 rounded-xl border border-line bg-surface p-6">
          <p className="text-reading text-ink">
            Toda ecuación de segundo grado se resuelve con la misma expresión:
          </p>
          <Formula display alt="equis igual a menos be más menos raíz de be cuadrado menos cuatro a ce, sobre dos a">
            {resolvente}
          </Formula>
          <p className="text-body text-ink-muted">
            El signo <Formula alt="más menos"><mo>&#177;</mo></Formula> es lo que dice que hay dos
            soluciones, y el de adentro de la raíz es lo que dice cuántas son de verdad.
          </p>
        </div>
      </Section>

      <Section
        title="Con número"
        note="El número es la dirección de la fórmula: lo que permite escribir «reemplazando en (2)» tres párrafos más abajo. Va afuera del desplazamiento, así que sigue a la vista cuando la ecuación se corrió de costado."
      >
        <div className="flex max-w-[640px] flex-col gap-5 rounded-xl border border-line bg-surface p-6">
          <Formula display number={1} alt="ve igual a ve sub cero más a por te">{cinematica}</Formula>
          <Formula display number={2} alt="equis igual a menos be más menos raíz de be cuadrado menos cuatro a ce, sobre dos a">
            {resolvente}
          </Formula>
        </div>
      </Section>

      <Section
        title="Cuando no entra"
        note="Una ecuación larga no achica la página ni se parte en dos renglones: se desplaza. Y recién cuando de verdad hay algo cortado a la derecha se vuelve una parada de tabulación, porque sin eso esa parte queda fuera del alcance del teclado. Probalo angostando la ventana."
      >
        <div className="max-w-[380px] rounded-xl border border-line bg-surface p-6">
          <Formula display number={3} alt="energía mecánica igual a un medio eme ve sub cero al cuadrado más eme ge hache sub cero más un medio ka por equis menos equis sub cero al cuadrado menos mu eme ge de por coseno de theta">
            {energia}
          </Formula>
        </div>
      </Section>

      <Note icon="lightbulb" title="Por qué MathML y no LaTeX">
        Un intérprete de LaTeX es una biblioteca entera y lo que devuelve termina siendo MathML
        igual. Acá la pieza recibe el MathML directo: el que escribe una consigna no lo teclea, lo
        genera el editor. Los tipos que faltaban en `@types/react` los declara el sistema en
        `formula/mathml.d.ts`, y un elemento que falte se agrega ahí y en ningún otro lado.
      </Note>

      <Note title="Las variables van en itálica con serifas, y está bien">
        Los números y el texto llevan la letra del sistema. Una variable de una sola letra no:
        `math-auto` la mapea a la itálica matemática de Unicode, que Inter no tiene, así que cae en
        la fuente de matemática del navegador. Es como se lee la matemática en cualquier libro, y
        pelearlo costaría el signo de la raíz, que sale de esa misma fuente.
      </Note>

      <Section title="Props">
        <Props of="Formula" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El MathML es la versión accesible: quien lo soporta recorre la fórmula por partes —numerador, denominador, exponente— en vez de escuchar una cadena de símbolos.',
          '`alt` viaja como `alttext` del propio MathML y no como `aria-label`: un `aria-label` sobre el `<math>` tapa esa estructura y deja a todos con la frase plana, incluso a quien podía navegarla.',
          'La fórmula que desborda es una región enfocable con nombre, y solo cuando desborda: una parada de tabulación en algo que entra entero es ruido.',
          'El número de la ecuación queda fuera del desplazamiento, así que no se pierde al correr la fórmula de costado.',
          'Se selecciona y se copia como texto, porque son caracteres y no una imagen: quien la necesita en otro lado no tiene que volver a escribirla.',
        ]} />
      </Section>
    </Page>
  )
}
