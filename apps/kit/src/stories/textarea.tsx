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
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-full max-w-[320px]">
            <Demo label="rows 3 · maxRows 6">
              <Textarea
                aria-label="Consigna, con techo de seis filas"
                value={withCap}
                onChange={e => setWithCap(e.target.value)}
                rows={3}
                maxRows={6}
                className="w-full"
              />
            </Demo>
          </div>
          <div className="w-full max-w-[320px]">
            <Demo label="sin techo">
              <Textarea
                aria-label="Consigna, sin techo"
                value={noCap}
                onChange={e => setNoCap(e.target.value)}
                rows={2}
                className="w-full"
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="Vacío y deshabilitado"
        note="El placeholder va en el mismo gris que el del TextField, y el deshabilitado usa la misma opacidad: son el mismo campo."
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-full max-w-[300px]">
            <Demo label="con placeholder">
              <Textarea
                aria-label="Consigna de la actividad"
                value={short}
                onChange={e => setShort(e.target.value)}
                placeholder="Escribí la consigna de la actividad…"
                rows={3}
                maxRows={8}
                className="w-full"
              />
            </Demo>
          </div>
          <div className="w-full max-w-[300px]">
            <Demo label="disabled">
              <Textarea aria-label="Consigna no editable"
                value="No editable" disabled rows={3} className="w-full" />
            </Demo>
          </div>
        </div>
      </Section>

      <Section
        title="Quién decide el alto"
        note="Tres modos, y son excluyentes a propósito: o lo decide el contenido, o lo decide quien arrastra, o no lo decide nadie. Mezclarlos es lo que rompe — con el tirador y el crecimiento a la vez, arrastrás el campo a un alto y la tecla siguiente te lo pisa."
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-full max-w-[260px]">
            <Demo label="auto · el default">
              <Textarea aria-label="Consigna, alto automático"
                value={mode} onChange={e => setMode(e.target.value)} rows={2} maxRows={6} className="w-full" />
            </Demo>
          </div>
          <div className="w-full max-w-[260px]">
            <Demo label="vertical · el tirador nativo">
              <Textarea aria-label="Consigna, alto arrastrable"
                defaultValue="Arrastrá la esquina." rows={2} resize="vertical" className="w-full" />
            </Demo>
          </div>
          <div className="w-full max-w-[260px]">
            <Demo label="none · fijo, y scrollea">
              <Textarea
                aria-label="Consigna, alto fijo"
                defaultValue={'Alto fijo de dos filas.\nLo que sobra scrollea y el campo no se mueve.'}
                rows={2}
                resize="none"
                className="w-full"
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
        <p className="max-w-[70ch] text-body text-ink-muted">
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
