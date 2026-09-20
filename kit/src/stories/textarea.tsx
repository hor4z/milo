import cls from './textarea.module.css'
import { useState } from 'react'
import { Textarea } from '@milo/ui/textarea'
import { A11y, Cluster, Demo, Page, Practices, Props, Section } from '../kit'

export function TextareaStory() {
  const [short, setShort] = useState('')
  const [withCap, setWithCap] = useState(
    'Este campo crece hasta seis filas y después scrollea.\nBorrá líneas y mirá cómo se achica: el alto vuelve, que es la mitad que se olvida.',
  )
  const [noCap, setNoCap] = useState('Sin maxRows crece todo lo que haga falta.')
  const [mode, setMode] = useState('Crece con lo que escribís.')
  const [feedback, setFeedback] = useState('Resolviste bien las dos primeras. En la tercera te falta justificar por qué la pendiente da la mitad de g.')
  const [near, setNear] = useState('Le puse un techo corto para que veas qué pasa al final.')
  const [belowMin, setBelowMin] = useState('Bien')

  return (
    <Page
      title="Textarea"
      kind="Formularios"
      imports="import { Textarea } from '@milo/ui/textarea'"
      lead="El campo de varias líneas: el TextField estirado. La misma caja, el mismo borde y la misma marca de foco, porque dos campos que no se parecen se leen como dos sistemas. Lo único que cambia adentro es el interlineado: el 16 fijo aprieta cuando hay varios renglones."
    >
      <Section
        title="Crece con lo que escribís"
        note="Un alto fijo obliga a elegir mal dos veces: corto, y escribís mirando por una ranura; largo, y hay un rectángulo vacío ocupando media pantalla hasta que alguien lo llene. Escribí y borrá en los dos: crecer es la mitad fácil, lo que se olvida es volver."
      >
        <Cluster align="start">
          <Demo width="sm" fill label="rows 3 · maxRows 6">
            <Textarea
              aria-label="Consigna, con techo de seis filas"
              value={withCap}
              onChange={e => setWithCap(e.target.value)}
              rows={3}
              maxRows={6}

            />
          </Demo>
          <Demo width="sm" fill label="sin techo">
            <Textarea
              aria-label="Consigna, sin techo"
              value={noCap}
              onChange={e => setNoCap(e.target.value)}
              rows={2}

            />
          </Demo>
        </Cluster>
      </Section>

      <Section
        title="La cuenta, y por qué no es solo un número"
        note="Con `counter` aparece abajo a la derecha y lee el `maxLength` y el `minLength` que ya le pasás. Mientras sobra lugar cuenta y nada más, en gris, porque ahí el número no es una decisión. Cuando entra en el último diez por ciento deja de contar y dice cuánto queda, y si todavía no llegó al mínimo dice cuánto falta: **un contador informa, una frase orienta**, que es la regla que el sistema ya tiene escrita en Cómo se escribe."
      >
        <Cluster align="start">
          <Demo width="sm" fill label="mientras sobra lugar">
            <Textarea
              aria-label="Devolución para el estudiante"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              counter
              maxLength={400}
              rows={3}

            />
          </Demo>
          <Demo width="sm" fill label="cerca del techo">
            <Textarea
              aria-label="Devolución con techo corto"
              value={near}
              onChange={e => setNear(e.target.value)}
              counter
              maxLength={60}
              rows={3}

            />
          </Demo>
          <Demo width="sm" fill label="todavía no llega al mínimo">
            <Textarea
              aria-label="Devolución con mínimo"
              value={belowMin}
              onChange={e => setBelowMin(e.target.value)}
              counter
              minLength={20}
              maxLength={400}
              rows={3}

            />
          </Demo>
        </Cluster>
      </Section>

      <Section
        title="Vacío y deshabilitado"
        note="El placeholder va en el mismo gris que el del TextField, y el deshabilitado usa la misma opacidad: son el mismo campo."
      >
        <Cluster align="start">
          <Demo width="sm" fill label="con placeholder">
            <Textarea
              aria-label="Consigna de la actividad"
              value={short}
              onChange={e => setShort(e.target.value)}
              placeholder="Escribí la consigna de la actividad…"
              rows={3}
              maxRows={8}

            />
          </Demo>
          <Demo width="sm" fill label="disabled">
            <Textarea aria-label="Consigna no editable"
              value="No editable" disabled rows={3} />
          </Demo>
        </Cluster>
      </Section>

      <Section
        title="Quién decide el alto"
        note="Tres modos, y son excluyentes a propósito: o lo decide el contenido, o lo decide quien arrastra, o no lo decide nadie. Mezclarlos es lo que rompe: con el tirador y el crecimiento a la vez, arrastrás el campo a un alto y la tecla siguiente te lo pisa."
      >
        <Cluster align="start">
          <Demo width="xs" fill label="auto · el default">
            <Textarea aria-label="Consigna, alto automático"
              value={mode} onChange={e => setMode(e.target.value)} rows={2} maxRows={6} />
          </Demo>
          <Demo width="xs" fill label="vertical · el tirador nativo">
            <Textarea aria-label="Consigna, alto arrastrable"
              defaultValue="Arrastrá la esquina." rows={2} resize="vertical" />
          </Demo>
          <Demo width="xs" fill label="none · fijo, y scrollea">
            <Textarea
              aria-label="Consigna, alto fijo"
              defaultValue={'Alto fijo de dos filas.\nLo que sobra scrollea y el campo no se mueve.'}
              rows={2}
              resize="none"

            />
          </Demo>
        </Cluster>
      </Section>

      <Section title="Props" note="Todo lo que acepta un `<textarea>` nativo pasa derecho: `value`, `onChange`, `placeholder`, `disabled`, `maxLength`. Menos `style` y `resize`, que son de quien decide el alto.">
        <Props of="Textarea" />
      </Section>

      <Section
        title="Lo que se paga si falta"
        note="Tres cosas que no se ven cuando están bien. `height: auto` antes de leer `scrollHeight`, o el campo crece y no vuelve. El techo prende el scroll, y abajo del techo lo apaga, o aparece una barra que titila en cada tecla. Y se mide en un layout effect: después del paint, cada tecla se ve como un salto."
      >
        <p className={cls.costText}>
          El <code>resize</code> nativo no está: es una esquina que solo existe con mouse, y
          arrastrarla deja un alto que el crecimiento automático después pisa. El alto lo decide el
          contenido.
        </p>
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>`maxRows` le pone techo al crecimiento, así que la página no se estira sin fin.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Se remide al cambiar el ancho y al cargar la fuente, así que nunca recorta texto sin barra.</A11y.Item>
          <A11y.Item>Al llegar al techo prende el scroll; abajo del techo lo apaga para que no titile.</A11y.Item>
          <A11y.Item>El anillo de foco es de la caja, igual que en TextField.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
