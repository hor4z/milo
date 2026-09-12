import { useState } from 'react'
import {
  Button, Field, FieldSet, Select, Sheet, SheetBody, SheetFooter, SheetHeader, Switch,
  TextField, Textarea, useToast,
} from '@melu/ui'
import { A11y, Canvas, Note, Page, Props, Section } from '../kit'

export function SheetStory() {
  const [abierto, setAbierto] = useState(false)
  const [izquierdo, setIzquierdo] = useState(false)
  const { toast } = useToast()

  return (
    <Page
      title="Sheet"
      kind="Formularios"
      imports="import { Sheet, SheetHeader, SheetBody, SheetFooter } from '@melu/ui'"
      lead="El panel que entra de costado, para un formulario largo que no justifica cambiar de pantalla. Lo de atrás se queda donde estaba y al cerrar seguís en el mismo lugar, con el scroll donde lo dejaste."
    >
      <Section
        title="Un formulario entero"
        note="Se arma en tres partes: la cabecera con el título y la X, el cuerpo que scrollea, y el pie con las acciones, que no scrollea nunca. Un formulario de seis campos donde el botón de guardar hay que ir a buscarlo abajo de todo es un formulario que se abandona."
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

      <Section
        title="De qué lado entra"
        note="Por defecto de la derecha, que es de donde vienen las cosas nuevas. El izquierdo es para lo que acompaña a la navegación —un filtro, un índice— y no para un formulario: entrar por donde está el menú se lee como que el menú creció."
      >
        <Canvas className="flex justify-center">
          <Button variant="raised" icon="filter_list" onClick={() => setIzquierdo(true)}>Filtros</Button>
        </Canvas>

        <Sheet open={izquierdo} onClose={() => setIzquierdo(false)} side="left" width={360} label="Filtros">
          <SheetHeader title="Filtros" onClose={() => setIzquierdo(false)} />
          <SheetBody>
            <div className="flex flex-col gap-5">
              <Field label="Espacio">
                <Select value="Todos" options={['Todos', 'Matemática · 4.º A', 'Lengua · 6.º']} />
              </Field>
              <Field label="Estado">
                <Select value="Cualquiera" options={['Cualquiera', 'Abierta', 'Corregida', 'Borrador']} />
              </Field>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setIzquierdo(false)}>Limpiar</Button>
            <Button variant="solid" onClick={() => setIzquierdo(false)}>Aplicar</Button>
          </SheetFooter>
        </Sheet>
      </Section>

      <Note title="Sheet o Modal">
        El <a className="underline underline-offset-2" href="#modal">Modal</a> interrumpe y pide una
        decisión corta: confirmá, elegí, mirá esto. El panel lateral es para trabajar un rato — un
        formulario de seis campos en un modal centrado tapa la pantalla y no deja ver aquello sobre
        lo que estás escribiendo.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'open', type: 'boolean', required: true },
          { name: 'onClose', type: '() => void', required: true, note: 'lo llaman la X, el velo y Escape' },
          { name: 'label', type: 'string', required: true, note: 'nombra el diálogo para el lector' },
          { name: 'side', type: "'right' | 'left'", def: "'right'" },
          { name: 'width', type: 'number', def: '460' },
          { name: 'SheetHeader · title', type: 'string', required: true },
          { name: 'SheetBody', type: 'div', note: 'la parte que scrollea' },
          { name: 'SheetFooter', type: 'div', note: 'las acciones, siempre a la vista' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Es un role="dialog" modal con su nombre, y atrapa el foco mientras está abierto.',
          'Escape cierra por la pila global: cierra el panel de arriba y no todos los que haya detrás.',
          'Al cerrar, el foco vuelve al botón que lo abrió.',
          'Se enfoca el contenedor y no el primer campo, así que el panel no abre corrido con la primera fila tapada.',
          'Bloquea el scroll del fondo compensando el ancho de la barra, así que la página no salta al abrir.',
        ]} />
      </Section>
    </Page>
  )
}
