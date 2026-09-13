import { useState } from 'react'
import { IconButton, Kbd, TextField } from '@milo/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

export function TextFieldStory() {
  const [text, setText] = useState('Fracciones con la receta de la abuela')

  return (
    <Page
      title="TextField"
      kind="Formularios"
      imports="import { TextField } from '@milo/ui'"
      lead="Plano: un fondo y una línea de un píxel, sin relieve. El volumen se fue a propósito — el relieve dice «esto sobresale» o «esto se aprieta», y un campo no es ninguna de las dos. Al enfocarse se le tiñe el borde que ya tenía: el anillo es para una pieza sin borde propio, y acá dibujaba una segunda línea a dos píxeles."
    >
      <Section title="Variantes">
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'solo', el: <TextField value={text} onChange={e => setText(e.target.value)} aria-label="Nombre de la actividad" className="w-full" /> },
            { label: 'con icono', el: <TextField icon="search" aria-label="Buscar una actividad" placeholder="Buscar una actividad…" className="w-full" /> },
            { label: 'con suffix', el: <TextField aria-label="Duración en minutos" placeholder="Duración" suffix={<Kbd>min</Kbd>} className="w-full" /> },
            { label: 'disabled', el: <TextField aria-label="Campo no editable" placeholder="No editable" disabled className="w-full" /> },
          ].map(v => (
            <div key={v.label} className="w-full max-w-[320px]">
              <Demo label={v.label}>{v.el}</Demo>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Las tres alturas"
        note="Las mismas del Button, con los mismos radios, iconos y tamaños de letra: un campo y el botón que lo acompaña en la misma fila tienen que medir lo mismo. Lo único distinto es el padding lateral — el texto de un botón está centrado y necesita aire de los dos lados, el de un campo arranca pegado a la izquierda."
      >
        <div className="flex flex-wrap gap-3">
          {(['sm', 'md', 'lg'] as const).map(s => (
            <div key={s} className="w-full max-w-[320px]">
              <Demo label={s}>
                <TextField size={s} icon="search" aria-label={`Buscar una actividad, alto ${s}`} placeholder="Buscar una actividad…" className="w-full" />
              </Demo>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El click y el foco"
        note="El input tapa la caja entera: mide lo que mide su línea de texto —16px— y adentro de una caja de 40 dejaba 12 muertos arriba y abajo, así que media caja no recibía el click. El anillo de foco es del campo y no del input: si no, queda un rectángulo flotando adentro."
      >
        <div className="flex flex-wrap gap-3">
          <div className="w-full max-w-[320px]">
            <Demo label="con botón adentro">
              <TextField
                placeholder="Buscar…"
                className="w-full"
                suffix={<IconButton icon="close" label="Limpiar" variant="ghost" size="sm" />}
              />
            </Demo>
          </div>
        </div>
      </Section>

      <Section title="Props" note="Todo lo que acepta un `<input>` nativo pasa derecho: `value`, `onChange`, `placeholder`, `disabled`, `type`.">
        <Props of="TextField" />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'El área clickeable es la caja entera y no solo la línea de texto de 16px.',
          'El anillo lo toma el campo y no el <input> de adentro, así que no hay dos marcas de foco.',
          'Con un botón adentro, el campo no se enciende: la marca es del botón que tiene el foco.',
        ]} />
      </Section>
    </Page>
  )
}
