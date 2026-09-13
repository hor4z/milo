import cls from './textarea.module.css'
import { useState } from 'react'
import { Textarea } from '@milo/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function TextareaStory() {
  const [short, setShort] = useState('')
  const [withCap, setWithCap] = useState(
    'Este campo crece hasta seis filas y después scrollea.\nBorrá líneas y mirá cómo se achica: el alto vuelve, que es la mitad que se olvida.',
  )
  const [noCap, setNoCap] = useState('Sin maxRows crece todo lo que haga falta.')
  const [mode, setMode] = useState('Crece con lo que escribís.')
  const [devolucion, setDevolucion] = useState('Resolviste bien las dos primeras. En la tercera te falta justificar por qué la pendiente da la mitad de g.')
  const [cerca, setCerca] = useState('Le puse un techo corto para que veas qué pasa al final.')
  const [corta, setCorta] = useState('Bien')

  return (
    <Page
      title="Textarea"
      kind="Formularios"
      imports="import { Textarea } from '@milo/ui'"
      lead="El campo de varias líneas: el TextField estirado. La misma caja, el mismo borde y la misma marca de foco, porque dos campos que no se parecen se leen como dos sistemas. Lo único que cambia adentro es el interlineado: el 16 fijo aprieta cuando hay varios renglones."
    >
      <Section
        title="Crece con lo que escribís"
        note="Un alto fijo obliga a elegir mal dos veces: corto, y escribís mirando por una ranura; largo, y hay un rectángulo vacío ocupando media pantalla hasta que alguien lo llene. Escribí y borrá en los dos: crecer es la mitad fácil, lo que se olvida es volver."
      >
        <div className={cls.div}>
          <div className={cls.div2}>
            <Demo label="rows 3 · maxRows 6">
              <Textarea
                aria-label="Consigna, con techo de seis filas"
                value={withCap}
                onChange={e => setWithCap(e.target.value)}
                rows={3}
                maxRows={6}
                className={cls.box}
              />
            </Demo>
          </div>
          <div className={cls.div3}>
            <Demo label="sin techo">
              <Textarea
                aria-label="Consigna, sin techo"
                value={noCap}
                onChange={e => setNoCap(e.target.value)}
                rows={2}
                className={cls.box2}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="La cuenta, y por qué no es solo un número"
        note="Con `counter` aparece abajo a la derecha y lee el `maxLength` y el `minLength` que ya le pasás. Mientras sobra lugar cuenta y nada más, en gris, porque ahí el número no es una decisión. Cuando entra en el último diez por ciento deja de contar y dice cuánto queda, y si todavía no llegó al mínimo dice cuánto falta: **un contador informa, una frase orienta**, que es la regla que el sistema ya tiene escrita en Cómo se escribe."
      >
        <div className={cls.div4}>
          <div className={cls.div5}>
            <Demo label="mientras sobra lugar">
              <Textarea
                aria-label="Devolución para el estudiante"
                value={devolucion}
                onChange={e => setDevolucion(e.target.value)}
                counter
                maxLength={400}
                rows={3}
                className={cls.box3}
              />
            </Demo>
          </div>
          <div className={cls.div6}>
            <Demo label="cerca del techo">
              <Textarea
                aria-label="Devolución con techo corto"
                value={cerca}
                onChange={e => setCerca(e.target.value)}
                counter
                maxLength={60}
                rows={3}
                className={cls.box4}
              />
            </Demo>
          </div>
          <div className={cls.div7}>
            <Demo label="todavía no llega al mínimo">
              <Textarea
                aria-label="Devolución con mínimo"
                value={corta}
                onChange={e => setCorta(e.target.value)}
                counter
                minLength={20}
                maxLength={400}
                rows={3}
                className={cls.box5}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="Vacío y deshabilitado"
        note="El placeholder va en el mismo gris que el del TextField, y el deshabilitado usa la misma opacidad: son el mismo campo."
      >
        <div className={cls.div8}>
          <div className={cls.div9}>
            <Demo label="con placeholder">
              <Textarea
                aria-label="Consigna de la actividad"
                value={short}
                onChange={e => setShort(e.target.value)}
                placeholder="Escribí la consigna de la actividad…"
                rows={3}
                maxRows={8}
                className={cls.box6}
              />
            </Demo>
          </div>
          <div className={cls.div10}>
            <Demo label="disabled">
              <Textarea aria-label="Consigna no editable"
                value="No editable" disabled rows={3} className={cls.textarea} />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="Quién decide el alto"
        note="Tres modos, y son excluyentes a propósito: o lo decide el contenido, o lo decide quien arrastra, o no lo decide nadie. Mezclarlos es lo que rompe: con el tirador y el crecimiento a la vez, arrastrás el campo a un alto y la tecla siguiente te lo pisa."
      >
        <div className={cls.div11}>
          <div className={cls.div12}>
            <Demo label="auto · el default">
              <Textarea aria-label="Consigna, alto automático"
                value={mode} onChange={e => setMode(e.target.value)} rows={2} maxRows={6} className={cls.box7} />
            </Demo>
          </div>
          <div className={cls.div13}>
            <Demo label="vertical · el tirador nativo">
              <Textarea aria-label="Consigna, alto arrastrable"
                defaultValue="Arrastrá la esquina." rows={2} resize="vertical" className={cls.box8} />
            </Demo>
          </div>
          <div className={cls.div14}>
            <Demo label="none · fijo, y scrollea">
              <Textarea
                aria-label="Consigna, alto fijo"
                defaultValue={'Alto fijo de dos filas.\nLo que sobra scrollea y el campo no se mueve.'}
                rows={2}
                resize="none"
                className={cls.box9}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Props" note="Todo lo que acepta un `<textarea>` nativo pasa derecho: `value`, `onChange`, `placeholder`, `disabled`, `maxLength`. Menos `style` y `resize`, que son de quien decide el alto.">
        <Props of="Textarea" />
      </Section>

      <Section
        title="Lo que se paga si falta"
        note="Tres cosas que no se ven cuando están bien. `height: auto` antes de leer `scrollHeight`, o el campo crece y no vuelve. El techo prende el scroll, y abajo del techo lo apaga, o aparece una barra que titila en cada tecla. Y se mide en un layout effect: después del paint, cada tecla se ve como un salto."
      >
        <p className={cls.p}>
          El <code>resize</code> nativo no está: es una esquina que solo existe con mouse, y
          arrastrarla deja un alto que el crecimiento automático después pisa. El alto lo decide el
          contenido.
        </p>
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Se remide al cambiar el ancho y al cargar la fuente, así que nunca recorta texto sin barra.',
          'Al llegar al techo prende el scroll; abajo del techo lo apaga para que no titile.',
          'El anillo de foco es de la caja, igual que en TextField.',
        ]} />
      </Section>
    </Page>
  )
}
