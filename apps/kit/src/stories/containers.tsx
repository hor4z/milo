import { useState } from 'react'
import {
  Badge, Button, Card, CardBody, CardFooter, CardHeader, CardHint, CardTitle, Progress, Row,
  Select, Switch,
} from '@melu/ui'
import { A11y, Page, Props, Section } from '../kit'

export function ContainersStory() {
  const [uno, setUno] = useState(true)
  const [dos, setDos] = useState(false)
  const [nivel, setNivel] = useState('Todo el equipo')

  return (
    <Page
      title="Card · Row"
      kind="Superficies"
      imports="import { Card, Row } from '@melu/ui'"
      lead="Los dos contenedores del sistema: la tarjeta de una grilla y la fila de un panel."
    >
      <Section
        title="La tarjeta se arma con partes"
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
              <p className="text-xs font-medium text-ink-muted">
                La tarjeta sigue aceptando cualquier contenido suelto para lo que no tiene esa forma —
                una portada, un gráfico, una grilla de fotos.
              </p>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section
        title="Card"
        note="Radio 24 con 8 de padding, así que lo que va adentro lleva 16. Las tarjetas no se mueven en hover y no tienen acciones flotando encima: una grilla que salta hace temblar la vista, y un botón que aparece al pasar el mouse no se descubre sin mouse y tapa justo lo que estabas mirando."
      >
        <div className="flex flex-wrap gap-4">
          <Card className="w-[260px]">
            <div className="rounded-xl bg-tint-2" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-1.5">
              <div className="text-xs font-semibold">El barrio como mapa</div>
              <div className="mt-1 text-2xs text-ink-muted">Geografía · 6.º · Indagación</div>
            </div>
          </Card>
          <Card className="w-[260px]" interactive>
            <div className="rounded-xl bg-tint-3" style={{ height: 120 }} />
            <div className="px-2 pt-3 pb-1.5">
              <div className="text-xs font-semibold">Con interactive</div>
              <div className="mt-1 text-2xs text-ink-muted">Se levanta en hover — para donde haga falta</div>
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Row"
        note="56 de alto, padding 16/24, label a la izquierda y control a la derecha. El divisor va como borde superior de cada fila menos la primera, y no como borde inferior de todas: así la última no deja una línea suelta contra el fondo del panel."
      >
        <div className="max-w-[520px] overflow-hidden rounded-2xl border border-line bg-surface">
          <Row label="Sugerir mejoras" hint="Mientras escribís una consigna">
            <Switch checked={uno} onChange={setUno} label="Sugerir mejoras" />
          </Row>
          <Row label="Aparecer en el directorio" hint="Otras escuelas pueden encontrarte">
            <Switch checked={dos} onChange={setDos} label="Directorio" />
          </Row>
          <Row label="Quién ve mis recetas">
            <Select value={nivel} onChange={setNivel} width={180} options={['Solo yo', 'Todo el equipo', 'Cualquiera con el link']} />
          </Row>
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'Card · interactive', type: 'boolean', note: 'levanta la tarjeta en hover; por defecto no se mueve' },
          { name: 'Card · surface', type: "'paper' | 'muted'", def: "'paper'", note: 'papel sobresale y tira sombra; muted es un hueco' },
          { name: 'Card · className', type: 'string', note: 'para el ancho' },
          { name: 'CardHeader', type: 'div', note: 'título a la izquierda, lo que haya a la derecha' },
          { name: 'CardTitle', type: 'h3', note: 'cómo se llama lo que hay adentro' },
          { name: 'CardHint', type: 'p', note: 'la línea de apoyo' },
          { name: 'CardBody', type: 'div', note: 'el cuerpo, con el padding que la tarjeta no pone' },
          { name: 'CardFooter', type: 'div', note: 'la fila de abajo, separada por una línea' },
          { name: 'Row · label', type: 'string', note: 'obligatorio' },
          { name: 'Row · hint', type: 'string', note: 'segunda línea en 11px gris' },
          { name: 'Row · children', type: 'ReactNode', note: 'el control, alineado a la derecha' },
        ]} />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'CardTitle es un <h3>: la tarjeta entra en el esquema de encabezados de la página.',
          'La tarjeta no se mueve en hover ni esconde acciones detrás del puntero.',
          'Row ata su etiqueta al control que lleva adentro.',
        ]} />
      </Section>
    </Page>
  )
}
