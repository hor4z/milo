import cls from './card.module.css'
import { Button, Card, CardBody, CardFooter, CardHeader, CardHint, CardTitle, Chip, Icon, Progress } from '@milo/ui'
import { A11y, Cluster, Note, Page, Props, Section } from '../kit'

export function CardStory() {
  return (
    <Page
      title="Card"
      kind="Superficies"
      imports="import { Card, CardHeader, CardTitle, CardHint, CardBody, CardFooter } from '@milo/ui'"
      lead="La superficie de una grilla: una cosa por tarjeta, y la tarjeta entera es la unidad que se escanea. Radio 16 con 8 de padding, así que lo que va adentro lleva 8: la regla del anidado, no un número elegido a ojo."
    >
      <Section
        title="Se arma con partes"
        note="`CardHeader`, `CardTitle`, `CardHint`, `CardBody` y `CardFooter` traen el espaciado y la tipografía del sistema. Sin ellas, cada pantalla inventaba su propia cabecera: tres tamaños de título distintos en tres tarjetas vecinas."
      >
        <Cluster gap="lg" align="start">
          <Card className={cls.partsCard}>
            <CardHeader>
              <div className={cls.partsHeading}>
                <CardTitle>Entregas de la semana</CardTitle>
                <CardHint>De todos tus espacios</CardHint>
              </div>
              <Chip size="sm" color="ok">84%</Chip>
            </CardHeader>
            <CardBody>
              <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" iconEnd={<Icon name="chevron_right" />}>Ver todas</Button>
            </CardFooter>
          </Card>

          <Card className={cls.looseCard}>
            <CardHeader>
              <CardTitle>Sin partes</CardTitle>
            </CardHeader>
            <CardBody>
              <p className={cls.looseText}>
                La tarjeta sigue aceptando cualquier contenido suelto para lo que no tiene esa forma,
                una portada, un gráfico, una grilla de fotos.
              </p>
            </CardBody>
          </Card>
        </Cluster>
      </Section>

      <Section
        title="Quieta, y sin acciones escondidas"
        note="Las tarjetas no se mueven en hover y no tienen botones flotando encima: una grilla que salta hace temblar la vista, y un botón que aparece con el mouse no se descubre sin mouse. `interactive` es para la tarjeta que es un link entero: sube la sombra sin mover el contenido. Llegó a llevar un `-translate-y` que contradecía esta misma regla."
      >
        <Cluster gap="lg">
          <Card className={cls.stillCard}>
            <div className={cls.stillCover} style={{ height: 120 }} />
            <div className={cls.stillBody}>
              <div className={cls.stillTitle}>El barrio como mapa</div>
              <div className={cls.stillMeta}>Geografía · 6.º · Indagación</div>
            </div>
          </Card>
          <Card className={cls.hoverCard} interactive>
            <div className={cls.hoverCover} style={{ height: 120 }} />
            <div className={cls.hoverBody}>
              <div className={cls.hoverTitle}>Con interactive</div>
              <div className={cls.hoverMeta}>Sube la sombra en hover, sin moverse</div>
            </div>
          </Card>
        </Cluster>
      </Section>

      <Section
        title="Papel o hueco"
        note="`paper` sobresale del fondo, lleva su línea y tira su sombra: es una cosa apoyada arriba. `muted` es lo contrario, un hueco hundido en la pantalla, y sirve para lo que agrupa sin ser protagonista: un resumen, un bloque de ayuda. El hueco no lleva línea, porque un hueco no tiene contorno: lo que lo dibuja es el cambio de fondo."
      >
        <Cluster gap="lg">
          <Card className={cls.paperCard} surface="paper">
            <div className={cls.paperTitle}>paper</div>
            <div className={cls.paperMeta}>Sobresale. El default.</div>
          </Card>
          <Card className={cls.mutedCard} surface="muted">
            <div className={cls.mutedTitle}>muted</div>
            <div className={cls.mutedMeta}>Un hueco, para lo que agrupa.</div>
          </Card>
        </Cluster>
      </Section>

      <Note title="Card o Row">
        La tarjeta es para una grilla de cosas que se comparan de reojo. Si lo que hay es una lista
        de ajustes (etiqueta a la izquierda, control a la derecha) eso es un
        [Row](#row) adentro de un panel, y
        no seis tarjetas apiladas.
      </Note>

      <Section title="Props">
        <Props of={['Card', 'CardHeader', 'CardTitle', 'CardHint', 'CardBody', 'CardFooter']} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'CardTitle es un <h3>: la tarjeta entra en el esquema de encabezados de la página en vez de ser texto en negrita.',
          'La tarjeta no se mueve en hover ni esconde acciones detrás del puntero, así que se descubre igual sin mouse.',
          'Con interactive, lo que se toca sigue siendo un control de verdad (un link o un botón) y no un div con onClick.',
        ]} />
      </Section>
    </Page>
  )
}
