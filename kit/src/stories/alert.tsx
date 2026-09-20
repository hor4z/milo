import { useState } from 'react'
import { Alert } from '@milo/ui/alert'
import { Button } from '@milo/ui/button'
import { Icon } from '@milo/ui/icon'
import { A11y, Demo, Frame, Note, Page, Practices, Props, Section, Stack } from '../kit'

export function AlertStory() {
  const [dismissed, setDismissed] = useState<string[]>([])
  const dismiss = (id: string) => setDismissed(c => [...c, id])
  const showing = (id: string) => !dismissed.includes(id)

  return (
    <Page
      title="Alert"
      kind="Avisos"
      imports="import { Alert } from '@milo/ui/alert'"
      lead="El aviso que se queda en la página y forma parte de lo que estás mirando: algo está roto, algo falta, algo está por vencer. Si el aviso tiene que seguir ahí cuando la persona vuelva a mirar, es un Alert y no un `Toast`."
    >
      <Section
        title="Los cuatro tonos"
        note="El tono nunca va solo: cada uno trae su glifo, porque un color de estado sin forma ni texto no dice nada a quien no distingue colores. El de error va como `role=alert` y los otros tres como `status`: la diferencia entre interrumpir a un lector de pantalla y esperar a que termine la frase."
      >
        <Stack>
          <Alert tone="info">
            <Alert.Title>La corrección automática está en prueba</Alert.Title>
            <Alert.Body>Podés desactivarla desde Ajustes mientras la probamos.</Alert.Body>
          </Alert>
          <Alert tone="ok">
            <Alert.Title>Se publicó en los siete espacios</Alert.Title>
          </Alert>
          <Alert tone="warn">
            <Alert.Title>Tres entregas vencen mañana</Alert.Title>
            <Alert.Body>Después de esa fecha los estudiantes ya no pueden subir nada.</Alert.Body>
            <Alert.Actions>
              <Button size="sm" variant="muted">Ver las entregas</Button>
            </Alert.Actions>
          </Alert>
          {showing('rojo')
            ? (
              <Alert tone="bad" onDismiss={() => dismiss('rojo')}>
                <Alert.Title>No se pudieron traer las entregas</Alert.Title>
                <Alert.Body>Puede ser la conexión. Lo que ya estaba corregido sigue estando.</Alert.Body>
                <Alert.Actions>
                  <Button size="sm" variant="muted" iconStart={<Icon name="refresh" />}>Reintentar</Button>
                </Alert.Actions>
              </Alert>
            )
            : <Button size="sm" variant="muted" iconStart={<Icon name="undo" />} onClick={() => setDismissed(c => c.filter(x => x !== 'rojo'))}>Mostrarlo de nuevo</Button>}
        </Stack>
      </Section>

      <Section
        title="Se arma con partes"
        note="El título solo alcanza para lo que se entiende de un vistazo. El cuerpo es para lo que hay que explicar, y las acciones para lo que se puede hacer al respecto: un aviso que no ofrece salida deja al lector con el problema y con nada para tocar."
      >
        <Stack>
          <Demo label="solo título">
            <Frame width="lg">
              <Alert tone="ok"><Alert.Title>Listo</Alert.Title></Alert>
            </Frame>
          </Demo>
          <Demo label="título y cuerpo">
            <Frame width="lg">
              <Alert tone="info">
                <Alert.Title>Quedó en borrador</Alert.Title>
                <Alert.Body>Nadie lo ve hasta que lo publiques.</Alert.Body>
              </Alert>
            </Frame>
          </Demo>
          <Demo label="con salida y con X">
            {showing('amarillo')
              ? (
                <Frame width="lg">
                  <Alert tone="warn" onDismiss={() => dismiss('amarillo')}>
                    <Alert.Title>Quedaste sin lugar</Alert.Title>
                    <Alert.Body>El próximo archivo que subas no va a entrar.</Alert.Body>
                    <Alert.Actions>
                      <Button size="sm" variant="muted">Liberar espacio</Button>
                    </Alert.Actions>
                  </Alert>
                </Frame>
              )
              : <Button size="sm" variant="muted" iconStart={<Icon name="undo" />} onClick={() => setDismissed(c => c.filter(x => x !== 'amarillo'))}>Mostrarlo de nuevo</Button>}
          </Demo>
        </Stack>
      </Section>

      <Section
        title="El glifo se puede cambiar, o sacar"
        note="El default sale del tono y casi siempre es el correcto. `icon` lo cambia cuando el aviso es de algo concreto (una fecha, un archivo, una persona) y `null` lo saca para el aviso que ya vive adentro de algo que tiene su propio icono."
      >
        <Stack>
          <Demo label="glifo propio">
            <Frame width="lg">
              <Alert tone="info" icon="schedule">
                <Alert.Title>Cierra el viernes a las 23:59</Alert.Title>
              </Alert>
            </Frame>
          </Demo>
          <Demo label="sin glifo">
            <Frame width="lg">
              <Alert tone="info" icon={null}>
                <Alert.Title>Cuatro entregas nuevas desde ayer</Alert.Title>
              </Alert>
            </Frame>
          </Demo>
        </Stack>
      </Section>

      <Note title="Alert o Toast">
        Si el aviso es consecuencia de algo que la persona acaba de hacer y no necesita respuesta, va
        un [Toast](#toast). Si describe el estado
        de la pantalla, va acá: el toast se va solo a los cinco segundos, y un error importante que
        desaparece solo es un error que nadie leyó.
      </Note>

      <Section title="Props">
        <Props of="Alert" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Va fijo en la pantalla, donde pasó la cosa.</Practices.Do>
          <Practices.Do>Adentro de un panel denso va en `size="sm"`.</Practices.Do>
          <Practices.Dont>Solo `tone="bad"` lleva `role="alert"`: algo que está fijo no tiene que interrumpir cada vez que se monta.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El error va como role="alert" y el resto como role="status": solo lo urgente interrumpe lo que se está leyendo.</A11y.Item>
          <A11y.Item>El estado está en el texto y en el glifo, no solo en el color.</A11y.Item>
          <A11y.Item>La X se nombra sola y no es la única salida: el aviso se puede leer entero sin tocarla.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
