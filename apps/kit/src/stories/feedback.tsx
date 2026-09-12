import { Alert, AlertActions, AlertBody, AlertTitle, Button, useToast } from '@melu/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function FeedbackStory() {
  const { toast } = useToast()

  return (
    <Page
      title="Alert y Toast"
      kind="Avisos"
      imports="import { Alert, AlertTitle, AlertBody, AlertActions, useToast } from '@melu/ui'"
      lead="Los dos dicen que algo pasó. El Alert se queda en la página y forma parte de lo que estás mirando; el Toast pasa por encima y se va solo. Elegir mal es lo que hace que un error importante desaparezca a los cinco segundos."
    >
      <Section
        title="Los cuatro tonos"
        note="El tono nunca va solo: cada uno trae su glifo, porque un color de estado sin forma ni texto no dice nada a quien no distingue colores. El de error va como role=alert y los otros tres como status — la diferencia entre interrumpir a un lector de pantalla y esperar a que termine la frase."
      >
        <div className="flex flex-col gap-3">
          <Alert tone="info">
            <AlertTitle>La corrección automática está en prueba</AlertTitle>
            <AlertBody>Podés desactivarla desde Ajustes mientras la probamos.</AlertBody>
          </Alert>
          <Alert tone="ok">
            <AlertTitle>Se publicó en los siete espacios</AlertTitle>
          </Alert>
          <Alert tone="warn">
            <AlertTitle>Tres entregas vencen mañana</AlertTitle>
            <AlertBody>Después de esa fecha los estudiantes ya no pueden subir nada.</AlertBody>
            <AlertActions>
              <Button size="sm" variant="raised">Ver las entregas</Button>
            </AlertActions>
          </Alert>
          <Alert tone="bad" onDismiss={() => {}}>
            <AlertTitle>No se pudieron traer las entregas</AlertTitle>
            <AlertBody>Puede ser la conexión. Lo que ya estaba corregido sigue estando.</AlertBody>
            <AlertActions>
              <Button size="sm" variant="raised" icon="refresh">Reintentar</Button>
            </AlertActions>
          </Alert>
        </div>
      </Section>

      <Section
        title="Se arma con partes"
        note="El título solo alcanza para lo que se entiende de un vistazo. El cuerpo es para lo que hay que explicar, y las acciones para lo que se puede hacer al respecto — un aviso que no ofrece salida deja al lector con el problema."
      >
        <Demo label="solo título">
          <Alert tone="ok" className="w-full max-w-[520px]"><AlertTitle>Listo</AlertTitle></Alert>
        </Demo>
      </Section>

      <Section
        title="Toast"
        note="Va abajo a la derecha, se apila hasta tres y se va solo. Se pausa mientras el mouse está encima o mientras algo adentro tiene el foco: leer un aviso no tiene que ser una carrera."
      >
        <Demo label="probalo">
          <div className="flex flex-wrap gap-2">
            <Button variant="solid" onClick={() => toast({ title: 'Actividad publicada', body: 'La ven los siete espacios', tone: 'ok' })}>
              Publicar
            </Button>
            <Button variant="raised" onClick={() => toast({ title: 'Se guardó el borrador', duration: 0 })}>
              Sin vencimiento
            </Button>
            <Button variant="raised" onClick={() => toast({ title: 'No se pudo subir el archivo', body: 'Pesa más de 20 MB', tone: 'bad' })}>
              Error
            </Button>
          </div>
        </Demo>
      </Section>

      <Note title="Cuál de los dos">
        Si el aviso es consecuencia de algo que la persona acaba de hacer y no necesita respuesta, va un
        toast. Si describe el estado de la pantalla —algo está roto, algo falta, algo está por vencer—
        va un alert, porque tiene que seguir ahí cuando la persona vuelva a mirar.
      </Note>

      <Section title="Props">
        <Props rows={[
          { name: 'tone', type: "'info' | 'ok' | 'warn' | 'bad'", def: "'info'", note: 'el glifo sale de acá' },
          { name: 'icon', type: 'IconName | null', note: 'lo cambia, o lo saca con null' },
          { name: 'onDismiss', type: '() => void', note: 'agrega la X para cerrarlo' },
          { name: 'toast()', type: '(o: ToastOptions) => string', note: 'title, body, tone, action, duration' },
          { name: 'duration', type: 'number', def: '5000', note: '0 lo deja hasta que lo cierren' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El error va como role="alert" y el resto como role="status": solo lo urgente interrumpe.',
          'La región de toasts es aria-live="polite" con su nombre, así que se anuncian sin cortar lo que se esté leyendo.',
          'El auto-cierre se pausa al enfocar algo adentro: quien navega con teclado no pierde el aviso.',
          'Cada toast se puede cerrar con un botón que se nombra solo.',
        ]} />
      </Section>
    </Page>
  )
}
