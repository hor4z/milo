import { useState } from 'react'
import {
  Button, Field, FieldSet, Select, Sheet, SheetBody, SheetFooter, SheetHeader, Switch,
  TextField, Textarea, useToast,
} from '@melu/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function FormStory() {
  const [abierto, setAbierto] = useState(false)
  const [nombre, setNombre] = useState('')
  const [tocado, setTocado] = useState(false)
  const { toast } = useToast()
  const error = tocado && !nombre.trim() ? 'Poné un nombre para la actividad' : undefined

  return (
    <Page
      title="Field y Sheet"
      kind="Formularios"
      imports="import { Field, FieldSet, Sheet, SheetHeader, SheetBody, SheetFooter } from '@melu/ui'"
      lead="Un campo suelto no es un formulario: le falta el nombre, la ayuda y el error, y los tres tienen que estar atados al control para que un lector de pantalla los lea con él. Field hace ese trabajo; Sheet es dónde entra un formulario largo sin cambiar de pantalla."
    >
      <Section
        title="Field"
        note="La etiqueta enfoca el campo al tocarla, la ayuda se anuncia junto con el control y el error la reemplaza además de marcar el campo como inválido. Los campos del sistema se atan solos: no hay que pasarles `id` ni `aria-describedby`."
      >
        <Canvas>
          <div className="flex max-w-[420px] flex-col gap-5">
            <Field label="Nombre de la actividad" hint="Lo ven los estudiantes" required error={error}>
              <TextField
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onBlur={() => setTocado(true)}
                placeholder="Fracciones equivalentes"
              />
            </Field>
            <Field label="Consigna" hint="Podés pegar el texto que ya tenías">
              <Textarea rows={3} maxRows={8} placeholder="Escribí la consigna…" />
            </Field>
          </div>
        </Canvas>
      </Section>

      <Section
        title="Lo obligatorio se dice con palabras"
        note="El asterisco es una convención que no significa nada para quien no la conoce y que un lector de pantalla lee como «asterisco». Acá va el asterisco para la vista y la palabra «obligatorio» para el lector."
      >
        <Canvas>
          <div className="w-full max-w-[320px]">
            <Field label="Espacio" required>
              <Select value="Matemática · 4.º A" options={['Matemática · 4.º A', 'Lengua · 6.º']} />
            </Field>
          </div>
        </Canvas>
      </Section>

      <Section
        title="Sheet"
        note="El panel que entra de costado. Sirve para un formulario largo que no justifica cambiar de pantalla: lo de atrás se queda donde estaba y al cerrar seguís en el mismo lugar, con el scroll donde lo dejaste. Atrapa el foco, cierra con Escape y bloquea el scroll de la página, igual que el Modal."
      >
        <Canvas className="flex justify-center">
          <Button variant="solid" icon="add" onClick={() => setAbierto(true)}>Nueva actividad</Button>
        </Canvas>

        <Sheet open={abierto} onClose={() => setAbierto(false)} label="Nueva actividad">
          <SheetHeader title="Nueva actividad" onClose={() => setAbierto(false)} />
          <SheetBody>
            <FieldSet legend="Lo básico">
              <Field label="Nombre" required>
                <TextField placeholder="Fracciones equivalentes" />
              </Field>
              <Field label="Espacio">
                <Select value="Matemática · 4.º A" options={['Matemática · 4.º A', 'Lengua · 6.º', 'Ciencias · 5.º B']} />
              </Field>
              <Field label="Consigna" hint="Se puede editar después de publicar">
                <Textarea rows={4} maxRows={10} />
              </Field>
              <Field label="Entregas fuera de fecha" hint="Permitir que entreguen después del cierre">
                <Switch checked onChange={() => {}} label="Entregas fuera de fecha" />
              </Field>
            </FieldSet>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setAbierto(false)}>Cancelar</Button>
            <Button
              variant="solid"
              onClick={() => {
                setAbierto(false)
                toast({ title: 'Actividad creada', body: 'Quedó en borrador', tone: 'ok' })
              }}
            >
              Crear
            </Button>
          </SheetFooter>
        </Sheet>
      </Section>

      <Note title="Sheet o Modal">
        El modal interrumpe y pide una decisión corta: confirmá, elegí, mirá esto. El panel lateral es
        para trabajar un rato — un formulario de seis campos en un modal centrado tapa la pantalla y
        no deja ver aquello sobre lo que estás escribiendo.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'Field · label', type: 'string', required: true, note: 'nombra el control y lo enfoca al tocarla' },
          { name: 'Field · hint', type: 'string', note: 'para qué sirve el campo; se anuncia con él' },
          { name: 'Field · error', type: 'string', note: 'reemplaza al hint y marca aria-invalid' },
          { name: 'Field · required', type: 'boolean', note: 'asterisco a la vista, «obligatorio» al lector' },
          { name: 'Sheet · side', type: "'right' | 'left'", def: "'right'" },
          { name: 'Sheet · width', type: 'number', def: '460' },
          { name: 'Sheet · label', type: 'string', required: true, note: 'nombra el diálogo' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La etiqueta usa htmlFor: tocarla enfoca el campo, que además agranda el blanco del click.',
          'La ayuda y el error se anuncian como descripción del control, no como texto suelto al lado.',
          'Con error, el campo queda aria-invalid y el mensaje lleva su glifo: no depende del color rojo.',
          'El Sheet atrapa el foco, cierra con Escape por la pila global y devuelve el foco al abrirlo.',
          'Lo obligatorio se dice con texto además del asterisco.',
        ]} />
      </Section>
    </Page>
  )
}
