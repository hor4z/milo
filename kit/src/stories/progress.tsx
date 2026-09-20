import cls from './progress.module.css'
import { Progress } from '@milo/ui/progress'
import { A11y, Note, Page, Props, Section } from '../kit'

export function ProgressStory() {
  return (
    <Page
      title="Progress"
      kind="Datos"
      imports="import { Progress } from '@milo/ui/progress'"
      lead="Cuánto va hecho de algo que tiene un final. La pista es el resto y va clarísima: con el mismo peso que el relleno, la barra se lee como dos datos apilados en vez de como una parte de un todo."
    >
      <Section
        title="La barra y su rótulo"
        note="`label` no es decoración: es lo que un lector de pantalla anuncia con el número, y lo que hace que tres barras apiladas se distingan entre sí. El `hint` es el número a la vista: '18 de 24' dice más que '75%' cuando lo que falta se cuenta."
      >
        <div className={`${cls.labelBox} bg-surface`}>
          <Progress label="Corregidas" value={18} max={24} >
            <Progress.Hint>18 de 24</Progress.Hint>
          </Progress>
          <Progress label="Subida del archivo" value={62} >
            <Progress.Hint>62%</Progress.Hint>
          </Progress>
          <Progress label="Actividades publicadas" value={7} max={7} tone="ok" >
            <Progress.Hint>listo</Progress.Hint>
          </Progress>
        </div>
      </Section>

      <Section
        title="El tono dice algo, no decora"
        note="El default es el azul de dato (no el de marca, aunque en claro sean el mismo) y sirve para todo lo que avanza. `ok` es para lo que se completó, y `warn` y `bad` solo cuando llenar la barra es el problema (una cuota, un espacio que se acaba). Una lista de cuatro barras en cuatro colores distintos se lee como un semáforo y deja de leerse como progreso."
      >
        <div className={`${cls.toneBox} bg-surface`}>
          <Progress label="Espacio usado" value={92} max={100} tone="warn" >
            <Progress.Hint>92%</Progress.Hint>
          </Progress>
          <Progress label="Cuota de la cuenta" value={100} max={100} tone="bad" >
            <Progress.Hint>llena</Progress.Hint>
          </Progress>
        </div>
      </Section>

      <Note title="Progress o Spinner">
        La barra necesita saber cuánto falta. Si eso no se sabe (una búsqueda, una consulta que
        puede tardar dos segundos o veinte) la barra miente, y lo honesto es un
        [Spinner](#spinner). Una barra que
        se queda en el 90% es la forma más cara de perder la confianza de quien mira.
      </Note>

      <Section title="Props">
        <Props of="Progress" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un role="progressbar" con aria-valuenow, aria-valuemin, aria-valuemax y su nombre.',
          'El número está a la vista además de en el atributo: no hay que pasar el mouse para saber cuánto va.',
          'El valor se recorta al rango: un 30 de 24 dibuja la barra llena y no se sale de la pista.',
        ]} />
      </Section>
    </Page>
  )
}
