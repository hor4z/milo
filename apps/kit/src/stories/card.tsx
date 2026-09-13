import { Badge, Button, Card, CardBody, CardFooter, CardHeader, CardHint, CardTitle, Progress } from '@milo/ui'
import { A11y, Note, Page, Props, Section } from '../kit'

export function CardStory() {
  return (
    <Page
      title="Card"
      kind="Superficies"
      imports="import { Card, CardHeader, CardTitle, CardHint, CardBody, CardFooter } from '@milo/ui'"
      lead="La superficie de una grilla: una cosa por tarjeta, y la tarjeta entera es la unidad que se escanea. Radio 16 con 8 de padding, así que lo que va adentro lleva 8 — la regla del anidado, no un número elegido a ojo."
    >
      <Section
        title="Se arma con partes"
        note="`CardHeader`, `CardTitle`, `CardHint`, `CardBody` y `CardFooter` traen el espaciado y la tipografía del sistema. Sin ellas, cada pantalla inventaba su propia cabecera: tres tamaños de título distintos en tres tarjetas vecinas."
      >
        <div className="flex flex-wrap items-start gap-4">
          <Card className="w-[320px]">
            <CardHeader>
              <div className="flex flex-col">
                <CardTitle>Entregas de la semana</CardTitle>
                <CardHint>De todos tus espacios</CardHint>
              </div>
              <Badge tone="ok">84%</Badge>
            </CardHeader>
            <CardBody>
              <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" iconEnd="chevron_right">Ver todas</Button>
            </CardFooter>
          </Card>

          <Card className="w-[320px]">
            <CardHeader>
              <CardTitle>Sin partes</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-body font-medium text-ink-muted">
                La tarjeta sigue aceptando cualquier contenido suelto para lo que no tiene esa forma —
                una portada, un gráfico, una grilla de fotos.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section
        title="Quieta, y sin acciones escondidas"
        note="Las tarjetas no se mueven en hover y no tienen botones flotando encima: una grilla que salta hace temblar la vista, y un botón que aparece con el mouse no se descubre sin mouse. `interactive` es para la tarjeta que es un link entero: sube la sombra sin mover el contenido. Llegó a llevar un `-translate-y` que contradecía esta misma regla."
      >
        <div className="flex flex-wrap gap-4">
          <Card className="w-[260px]">
            <div className="rounded-sm bg-tint-2" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-2">
              <div className="text-body font-semibold">El barrio como mapa</div>
              <div className="mt-1 text-meta text-ink-muted">Geografía · 6.º · Indagación</div>
            </div>
          </Card>
          <Card className="w-[260px]" interactive>
            <div className="rounded-sm bg-tint-3" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-2">
              <div className="text-body font-semibold">Con interactive</div>
              <div className="mt-1 text-meta text-ink-muted">Sube la sombra en hover, sin moverse</div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Papel o hueco"
        note="`paper` sobresale del fondo y tira su sombra: es una cosa apoyada arriba. `muted` es lo contrario, un hueco hundido en la pantalla, y sirve para lo que agrupa sin ser protagonista — un resumen, un bloque de ayuda."
      >
        <div className="flex flex-wrap gap-4">
          <Card className="w-[260px] p-4" surface="paper">
            <div className="text-body font-semibold">paper</div>
            <div className="mt-1 text-meta text-ink-muted">Sobresale. El default.</div>
          </Card>
          <Card className="w-[260px] p-4" surface="muted">
            <div className="text-body font-semibold">muted</div>
            <div className="mt-1 text-meta text-ink-muted">Un hueco, para lo que agrupa.</div>
          </Card>
        </div>
      </Section>

      <Note title="Card o Row">
        La tarjeta es para una grilla de cosas que se comparan de reojo. Si lo que hay es una lista
        de ajustes —etiqueta a la izquierda, control a la derecha— eso es un
        {' '}<a className="underline underline-offset-2" href="#row">Row</a> adentro de un panel, y
        no seis tarjetas apiladas.
      </Note>

      <Section title="Props">
        <Props of={['Card', 'CardHeader', 'CardTitle', 'CardHint', 'CardBody', 'CardFooter']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'CardTitle es un <h3>: la tarjeta entra en el esquema de encabezados de la página en vez de ser texto en negrita.',
          'La tarjeta no se mueve en hover ni esconde acciones detrás del puntero, así que se descubre igual sin mouse.',
          'Con interactive, lo que se toca sigue siendo un control de verdad —un link o un botón— y no un div con onClick.',
        ]} />
      </Section>
    </Page>
  )
}
