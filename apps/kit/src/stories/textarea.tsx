import { useState } from 'react'
import { Textarea } from '@melu/ui'
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
      imports="import { Textarea } from '@melu/ui'"
      lead="El campo de varias líneas: el TextField estirado. La misma caja, el mismo borde y la misma marca de foco, porque un campo de una línea y uno de varias que no se parecen se leen como dos sistemas. Lo único que cambia adentro es el leading — el 16 fijo de la interfaz aprieta cuando hay varios renglones. Al enfocarse se le tiñe el borde en vez de rodearse de un anillo: el anillo es para una pieza sin borde propio, y sobre un campo dibujaba una segunda línea azul a dos píxeles de la primera."
    >
      <Section
        title="Crece con lo que escribís"
        note="Un alto fijo obliga a elegir mal dos veces: corto, y escribís mirando por una ranura; largo, y hay un rectángulo vacío ocupando media pantalla hasta que alguien lo llene. Escribí y borrá en los dos: crecer es la mitad fácil, lo que se olvida es volver."
      >
        <div className="flex flex-wrap items-start gap-3">
          <div className="w-full max-w-[320px]">
            <Demo label="rows 3 · maxRows 6">
              <Textarea
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
              <Textarea value="No editable" disabled rows={3} className="w-full" />
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
              <Textarea value={mode} onChange={e => setMode(e.target.value)} rows={2} maxRows={6} className="w-full" />
            </Demo>
          </div>
          <div className="w-full max-w-[260px]">
            <Demo label="vertical · el tirador nativo">
              <Textarea defaultValue="Arrastrá la esquina." rows={2} resize="vertical" className="w-full" />
            </Demo>
          </div>
          <div className="w-full max-w-[260px]">
            <Demo label="none · fijo, y scrollea">
              <Textarea
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
        note="Tres cosas que no se ven cuando están bien. Primero `height: auto` y después leer `scrollHeight`, porque scrollHeight nunca es menor que el alto puesto: midiendo sin resetear, el campo crece y no vuelve. El techo tiene que prender el scroll, o el texto sigue existiendo sin forma de llegar a él — y abajo del techo tiene que estar apagado, o aparece una barra que titila en cada tecla. Y se mide en un layout effect: midiendo después del paint, cada tecla que agranda el campo se ve como un salto."
      >
        <p className="max-w-[70ch] text-xs text-ink-muted">
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
