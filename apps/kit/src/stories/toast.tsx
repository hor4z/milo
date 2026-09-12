import { Button, useToast } from '@melu/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function ToastStory() {
  const { toast } = useToast()

  return (
    <Page
      title="Toast"
      kind="Avisos"
      imports="import { ToastProvider, useToast } from '@melu/ui'"
      lead="El acuse de recibo de algo que la persona acaba de hacer. Va abajo a la derecha, se apila hasta tres y se va solo. No pide respuesta y no interrumpe: si hace falta que alguien conteste, eso es un `Modal`, y si tiene que seguir ahí después, es un `Alert`."
    >
      <Section
        title="Probalo"
        note="`toast()` sale de `useToast()`, y el provider va una sola vez arriba de todo. Devuelve el id del aviso, que es lo único que hace falta para cerrarlo antes de tiempo."
      >
        <Demo label="los cuatro casos">
          <div className="flex flex-wrap gap-2">
            <Button variant="solid" onClick={() => toast({ title: 'Actividad publicada', body: 'La ven los siete espacios', tone: 'ok' })}>
              Publicar
            </Button>
            <Button variant="raised" onClick={() => toast({ title: 'Se guardó el borrador' })}>
              Guardar
            </Button>
            <Button variant="raised" onClick={() => toast({ title: 'No se pudo subir el archivo', body: 'Pesa más de 20 MB', tone: 'bad' })}>
              Error
            </Button>
            <Button variant="raised" onClick={() => toast({ title: 'Se archivaron 12 actividades', duration: 0 })}>
              Sin vencimiento
            </Button>
          </div>
        </Demo>
      </Section>

      <Section
        title="Deshacer"
        note="Un toast con acción es lo que reemplaza al «¿estás seguro?» de lo que se puede revertir. Preguntar antes cuesta un click siempre; deshacer después cuesta un click solo cuando alguien se equivocó."
      >
        <Demo label="con salida">
          <Button
            variant="raised"
            icon="delete"
            onClick={() => toast({
              title: 'Se archivó «Fracciones equivalentes»',
              action: { label: 'Deshacer', onClick: () => toast({ title: 'Volvió a tus actividades', tone: 'ok' }) },
              duration: 8000,
            })}
          >
            Archivar
          </Button>
        </Demo>
      </Section>

      <Section
        title="Se apila hasta tres"
        note="Más de tres avisos a la vez tapan la esquina y ya no se leen: el cuarto empuja al más viejo. Y el reloj se pausa mientras el mouse está encima o mientras algo adentro tiene el foco, porque leer un aviso no tiene que ser una carrera."
      >
        <Demo label="tirá cinco seguidos">
          <Button
            variant="raised"
            onClick={() => {
              const names = ['Fracciones', 'El sistema solar', 'Cuento policial', 'Mapa de América', 'Ecosistemas']
              names.forEach((n, i) => setTimeout(() => toast({ title: `Se corrigió «${n}»`, tone: 'ok' }), i * 260))
            }}
          >
            Cinco de una
          </Button>
        </Demo>
      </Section>

      <Note title="Toast o Alert">
        El toast pasa por encima y se va; el <a className="underline underline-offset-2" href="#alert">Alert</a> se
        queda en la página. La prueba es simple: si la persona se fue a hacer otra cosa y vuelve
        dentro de un minuto, ¿tiene que seguir viendo el aviso? Si sí, no es un toast.
      </Note>

      <Section title="Props">
        <Props of="ToastProvider" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'La región es aria-live="polite" con su nombre: los avisos se anuncian sin cortar lo que se esté leyendo.',
          'El auto-cierre se pausa al enfocar algo adentro, así que quien navega con teclado no pierde el aviso.',
          'Cada toast se cierra con un botón que se nombra solo, además de irse por su cuenta.',
          'La acción es un botón de verdad y entra en el orden de tabulación mientras el aviso está a la vista.',
        ]} />
      </Section>
    </Page>
  )
}
