import { Button } from '@milo/ui/button'
import { Icon } from '@milo/ui/icon'
import { useToast } from '@milo/ui/toast'
import { A11y, Cluster, Demo, Note, Page, Props, Section } from '../kit'

export function ToastStory() {
  const { toast } = useToast()

  return (
    <Page
      title="Toast"
      kind="Avisos"
      imports="import { ToastProvider, useToast } from '@milo/ui/toast'"
      lead="El acuse de recibo de algo que la persona acaba de hacer. Va abajo a la derecha, se apila hasta tres y se va solo. No pide respuesta y no interrumpe: si hace falta que alguien conteste, eso es un `Modal`, y si tiene que seguir ahí después, es un `Alert`."
    >
      <Section
        title="Probalo"
        note="`toast()` sale de `useToast()`, y el provider va una sola vez arriba de todo. Devuelve el id del aviso, que es lo único que hace falta para cerrarlo antes de tiempo."
      >
        <Demo label="los cuatro casos">
          <Cluster gap="sm">
            <Button variant="brand" onClick={() => toast({ title: 'Actividad publicada', body: 'La ven los siete espacios', tone: 'ok' })}>
              Publicar
            </Button>
            <Button variant="muted" onClick={() => toast({ title: 'Se guardó el borrador' })}>
              Guardar
            </Button>
            <Button variant="muted" onClick={() => toast({ title: 'No se pudo subir el archivo', body: 'Pesa más de 20 MB', tone: 'bad' })}>
              Error
            </Button>
            <Button variant="muted" onClick={() => toast({ title: 'Se archivaron 12 actividades', duration: 0 })}>
              Sin vencimiento
            </Button>
            <Button variant="muted" onClick={() => toast({ title: 'Resumen de la semana', body: 'El lunes ya está listo.', meta: 'recién' })}>
              Con hora
            </Button>
          </Cluster>
        </Demo>
      </Section>

      <Section
        title="Deshacer"
        note="Un toast con acción es lo que reemplaza al '¿estás seguro?' de lo que se puede revertir. Preguntar antes cuesta un click siempre; deshacer después cuesta un click solo cuando alguien se equivocó."
      >
        <Demo label="con salida">
          <Button
            variant="muted"
            iconStart={<Icon name="delete" />}
            onClick={() => toast({
              title: 'Se archivó "Fracciones equivalentes"',
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
            variant="muted"
            onClick={() => {
              const names = ['Fracciones', 'El sistema solar', 'Cuento policial', 'Mapa de América', 'Ecosistemas']
              names.forEach((n, i) => setTimeout(() => toast({ title: `Se corrigió "${n}"`, tone: 'ok' }), i * 260))
            }}
          >
            Cinco de una
          </Button>
        </Demo>
      </Section>

      <Note title="Toast o Alert">
        El toast pasa por encima y se va; el [Alert](#alert) se
        queda en la página. La prueba es simple: si la persona se fue a hacer otra cosa y vuelve
        dentro de un minuto, ¿tiene que seguir viendo el aviso? Si sí, no es un toast.
      </Note>

      <Section title="Props">
        <Props of={['ToastOptions', 'ToastProvider']} />
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
