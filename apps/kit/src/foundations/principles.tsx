import { Icon, type IconName } from '@milo/ui'
import { Page, Section } from '../kit'

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'contrast',
    title: 'Monocroma, con el color contado',
    body: 'La interfaz se dibuja con una rampa casi neutra. El azul es lo que manda, lo que está cargando y lo que tiene el foco; el ámbar señala; y las familias de color identifican un espacio o una persona. Nada más lleva color, y por eso el poco que hay se ve.',
  },
  {
    icon: 'layers',
    title: 'El estado se marca con relieve, no con tinte',
    body: 'Lo activo sobresale o se hunde. Teñir el texto de un item elegido gasta el acento y, peor, apaga a los que no están elegidos: una lista de siete espacios con seis en gris parece deshabilitada.',
  },
  {
    icon: 'square_foot',
    title: 'Una sola escalera de medidas',
    body: 'Tres alturas de control, cinco radios y una base de espaciado de cuatro. El mismo nombre da el mismo número en todas las piezas, así que un campo y el botón que lo acompaña apoyan en la misma línea sin que nadie lo calcule.',
  },
  {
    icon: 'target',
    title: 'El radio de un hijo es el del padre menos su padding',
    body: 'Un contenedor de 24 con 8 de padding pide 16 adentro. Si el hijo repite el radio del padre, la curva se ve doble; si queda más cuadrado, se ven dos curvas peleando.',
  },
  {
    icon: 'keyboard',
    title: 'Todo se usa con el teclado',
    body: 'Cada pieza que se puede tocar se puede tabular, y lo que aparece al pasar el mouse aparece también al enfocar. Un dato que solo existe con hover no existe para media pantalla de gente.',
  },
  {
    icon: 'visibility',
    title: 'El color nunca dice algo solo',
    body: 'Un estado se dice con texto y con forma además de con tono. Los tonos de estado vienen con su glifo, y las barras de un gráfico suben de tono con la altura para que el tamaño y el color digan lo mismo.',
  },
]

export function Principles() {
  return (
    <Page
      title="Principios"
      lead="Seis decisiones de las que sale casi todo lo demás. No son gustos: cada una se rompió al menos una vez y dejó una cicatriz que conviene no repetir."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {principles.map(p => (
          <div key={p.title} className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
            <span className="inset-relief flex size-9 items-center justify-center rounded-xl bg-muted">
              <Icon name={p.icon} size={20} className="icon-muted" />
            </span>
            <h2 className="text-reading font-semibold text-ink">{p.title}</h2>
            <p className="text-body font-medium text-ink-muted">{p.body}</p>
          </div>
        ))}
      </div>

      <Section
        title="Cómo se arma una pieza"
        note="Todo lo que se compone se expone en partes en vez de recibir un objeto de configuración. Un Alert es AlertTitle, AlertBody y AlertActions; unas solapas son Tabs, TabList, Tab y TabPanel. Cuesta dos líneas más de escribir y evita la prop número catorce."
      >
        <pre className="overflow-x-auto rounded-xl border border-line bg-muted p-4 font-mono text-body text-ink">
{`<Alert tone="warn">
  <AlertTitle>Tres entregas vencen mañana</AlertTitle>
  <AlertBody>Después de esa fecha nadie puede subir nada.</AlertBody>
  <AlertActions>
    <Button size="sm" variant="raised">Ver las entregas</Button>
  </AlertActions>
</Alert>`}
        </pre>
      </Section>
    </Page>
  )
}
