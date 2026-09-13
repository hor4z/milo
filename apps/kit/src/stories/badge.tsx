import { Badge, Card, CardBody, CardHeader, CardTitle } from '@milo/ui'
import { A11y, Demo, Note, Page, Props, Section } from '../kit'

export function BadgeStory() {
  return (
    <Page
      title="Badge"
      kind="Datos"
      imports="import { Badge } from '@milo/ui'"
      lead="Una marca chica pegada a lo que describe: en qué estado está una actividad, cuántas entregas faltan, qué es esto que estoy mirando. Siempre con texto: un punto de color no dice en qué estado está algo, y si lo dijera, no lo diría para quien no distingue colores."
    >
      <Section
        title="Los cinco tonos"
        note="`neutral` es el default y es el que más se usa: la mayoría de las marcas no son un estado, son una etiqueta. Los otros cuatro son los mismos de `Alert` y de `Toast`, y significan lo mismo en las tres piezas, que es de lo que se trata tener un sistema."
      >
        <Demo label="tonos">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Borrador</Badge>
            <Badge tone="info">En prueba</Badge>
            <Badge tone="ok" icon="check_circle">Corregida</Badge>
            <Badge tone="warn" icon="schedule">Vence mañana</Badge>
            <Badge tone="bad" icon="error">Sin entregar</Badge>
          </div>
        </Demo>
      </Section>

      <Section
        title="Dónde va"
        note="Pegado a lo que describe, no suelto en una esquina: una marca lejos de su sujeto obliga a adivinar de qué está hablando. En una tarjeta va en la cabecera, al lado del título; en una fila de tabla, en su columna."
      >
        <div className="flex flex-wrap items-start gap-4">
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Fracciones equivalentes</CardTitle>
              <Badge tone="ok" icon="check_circle">Corregida</Badge>
            </CardHeader>
            <CardBody>
              <p className="text-body font-medium text-ink-muted">Matemática · 4.º A · 24 entregas</p>
            </CardBody>
          </Card>
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Mapa de América</CardTitle>
              <Badge tone="warn" icon="schedule">Vence mañana</Badge>
            </CardHeader>
            <CardBody>
              <p className="text-body font-medium text-ink-muted">Sociales · 5.º A · 3 de 7</p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Note title="Badge o Chip">
        El badge describe algo y no se toca: es el estado de una actividad. El
        {' '}<a className="underline underline-offset-2" href="#chip">Chip</a> es una etiqueta que
        alguien puso y que se puede sacar, y por eso lleva su X y su color de la familia viva. Si se
        puede tocar, no es un badge.
      </Note>

      <Section title="Props">
        <Props of="Badge" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El estado está en el texto, no en el color: quien no distingue tonos lee lo mismo.',
          'El glifo es decorativo y no se anuncia dos veces: lo que se lee es el texto.',
          'El contraste de cada tono contra su fondo está verificado en los dos temas, y hay un test que falla si alguien lo rompe.',
        ]} />
      </Section>
    </Page>
  )
}
