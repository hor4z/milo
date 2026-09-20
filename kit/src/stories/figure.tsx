import s from './figure.module.css'
import { Figure } from '@milo/ui/figure'
import { A11y, Example, Note, Page, Practices, Props, Section } from '../kit'

export function FigureStory() {
  return (
    <Page
      title="Figure"
      kind="Editor"
      imports="import { Figure } from '@milo/ui/figure'"
      lead="Una imagen con su pie: lo que ilustra una consigna, la foto de un experimento, el gráfico que alguien dibujó a mano."
    >
      <Section
        title="La pieza"
        note="El hueco reserva su proporción antes de que la imagen llegue. Sin eso, todo lo que está abajo salta cuando carga y alguien pierde el renglón que estaba leyendo."
      >
        <div className={s.pieceGrid}>
          <Figure
            src="/avatars/03.webp"
            alt="Una persona sonriendo, de frente"
           
          >
            <Figure.Caption>Con una foto va cover: llena el hueco y el borde no importa</Figure.Caption>
          </Figure>
          <Figure
            src="/mascotas/otto.webp"
            alt="Otto, una nutria de pie con un pañuelo azul"
           
            fit="contain"
          >
            <Figure.Caption>Con un dibujo va contain: recortar se lleva justo lo que hay que ver</Figure.Caption>
          </Figure>
        </div>
      </Section>

      <Section
        title="Las proporciones"
        note="Cuatro, y la elige quien arma la pantalla. Una grilla donde cada imagen trae la suya se ve como una pila de recortes."
      >
        <div className={s.ratioGrid}>
          {(['16/9', '4/3', '3/2', '1/1'] as const).map((r, i) => (
            <Figure key={r} src={`/avatars/0${i + 1}.webp`} alt="" ratio={r} >
              <Figure.Caption>{r}</Figure.Caption>
            </Figure>
          ))}
        </div>
      </Section>

      <Note title="`alt` y epígrafe no son lo mismo">
        El `alt` dice qué se ve, y lo escucha solo quien no ve la imagen. El epígrafe agrega algo
        que la imagen no dice sola (de dónde salió, qué hay que mirar) y lo lee todo el mundo.
        Repetir el epígrafe en el `alt` hace que quien usa un lector escuche la misma frase dos
        veces. Y si la imagen no aporta nada que el texto ya no diga, el `alt` va vacío: ahí es
        decoración, y anunciarla interrumpe.
      </Note>

      <Section title="Cómo se escribe">
        <Example code={`<Figure src="/diagrama.png" alt="Dos figuras con el mismo perímetro" ratio="16/9" fit="contain">
  <Figure.Caption>Las dos miden 20 cm de contorno.</Figure.Caption>
</Figure>`} />
      </Section>

      <Props of="Figure" />

      <Practices>
        <Practices.Do>`alt` es qué se ve y `Figure.Caption` es qué hay que mirar: no son lo mismo.</Practices.Do>
        <Practices.Do>`ratio` reserva el hueco, así que la página no salta cuando la imagen carga.</Practices.Do>
        <Practices.Dont>Si la imagen no aporta nada que el texto no diga, `alt` va vacío y queda decorativa.</Practices.Dont>
      </Practices>

      <A11y>
        <A11y.Item>El `alt` es obligatorio, y vacío es una respuesta válida: dice "esto es decorativo" en vez de dejar que un lector invente el nombre del archivo.</A11y.Item>
        <A11y.Item>El epígrafe va en un `figcaption` atado a la figura, así que quien lo escucha sabe de qué imagen habla.</A11y.Item>
        <A11y.Item>La imagen carga en diferido y el hueco ya tiene su proporción: la página no salta.</A11y.Item>
      </A11y>
    </Page>
  )
}
