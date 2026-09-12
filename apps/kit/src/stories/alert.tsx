import { Alert, AlertActions, AlertBody, AlertTitle, Button } from '@melu/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function AlertStory() {
  return (
    <Page
      title="Alert"
      kind="Avisos"
      imports="import { Alert, AlertTitle, AlertBody, AlertActions } from '@melu/ui'"
      lead="El aviso que se queda en la página y forma parte de lo que estás mirando: algo está roto, algo falta, algo está por vencer. Si el aviso tiene que seguir ahí cuando la persona vuelva a mirar, es un Alert y no un `Toast`."
    >
      <Section
        title="Los cuatro tonos"
        note="El tono nunca va solo: cada uno trae su glifo, porque un color de estado sin forma ni texto no dice nada a quien no distingue colores. El de error va como `role=alert` y los otros tres como `status` — la diferencia entre interrumpir a un lector de pantalla y esperar a que termine la frase."
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
        note="El título solo alcanza para lo que se entiende de un vistazo. El cuerpo es para lo que hay que explicar, y las acciones para lo que se puede hacer al respecto — un aviso que no ofrece salida deja al lector con el problema y con nada para tocar."
      >
        <div className="flex flex-col gap-3">
          <Demo label="solo título">
            <Alert tone="ok" className="w-full max-w-[520px]"><AlertTitle>Listo</AlertTitle></Alert>
          </Demo>
          <Demo label="título y cuerpo">
            <Alert tone="info" className="w-full max-w-[520px]">
              <AlertTitle>Quedó en borrador</AlertTitle>
              <AlertBody>Nadie lo ve hasta que lo publiques.</AlertBody>
            </Alert>
          </Demo>
          <Demo label="con salida y con X">
            <Alert tone="warn" className="w-full max-w-[520px]" onDismiss={() => {}}>
              <AlertTitle>Quedaste sin lugar</AlertTitle>
              <AlertBody>El próximo archivo que subas no va a entrar.</AlertBody>
              <AlertActions>
                <Button size="sm" variant="raised">Liberar espacio</Button>
              </AlertActions>
            </Alert>
          </Demo>
        </div>
      </Section>

      <Section
        title="El glifo se puede cambiar, o sacar"
        note="El default sale del tono y casi siempre es el correcto. `icon` lo cambia cuando el aviso es de algo concreto —una fecha, un archivo, una persona— y `null` lo saca para el aviso que ya vive adentro de algo que tiene su propio icono."
      >
        <div className="flex flex-col gap-3">
          <Demo label="glifo propio">
            <Alert tone="info" icon="schedule" className="w-full max-w-[520px]">
              <AlertTitle>Cierra el viernes a las 23:59</AlertTitle>
            </Alert>
          </Demo>
          <Demo label="sin glifo">
            <Alert tone="info" icon={null} className="w-full max-w-[520px]">
              <AlertTitle>Cuatro entregas nuevas desde ayer</AlertTitle>
            </Alert>
          </Demo>
        </div>
      </Section>

      <Note title="Alert o Toast">
        Si el aviso es consecuencia de algo que la persona acaba de hacer y no necesita respuesta, va
        un <a className="underline underline-offset-2" href="#toast">Toast</a>. Si describe el estado
        de la pantalla, va acá: el toast se va solo a los cinco segundos, y un error importante que
        desaparece solo es un error que nadie leyó.
      </Note>

      <Section title="Props">
        <Props of="Alert" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El error va como role="alert" y el resto como role="status": solo lo urgente interrumpe lo que se está leyendo.',
          'El estado está en el texto y en el glifo, no solo en el color.',
          'La X se nombra sola y no es la única salida: el aviso se puede leer entero sin tocarla.',
        ]} />
      </Section>
    </Page>
  )
}
