import { Icon, List, ListItem, type IconName, type MarkColor } from '@melu/ui'
import { A11y, Mono, Page, Props, Section } from '../kit'

const onboarding: { icon: IconName; color: MarkColor; title: string; hint: string; active?: boolean }[] = [
  { icon: 'check', color: 'green', title: 'Update your profile', hint: 'Add a photo and connect your social links.' },
  { icon: 'menu_book', color: 'purple', title: 'Write your first post', hint: 'Share your voice – start creating today.' },
  { icon: 'calendar_month', color: 'orange', title: 'Plan your first post', hint: 'Pick the perfect time to publish.' },
  { icon: 'check', color: 'green', title: 'Create your first link', hint: 'Make a trackable link to share.', active: true },
  { icon: 'lightbulb', color: 'blue', title: 'Explore today’s inspiration', hint: 'Spark ideas with fresh content.' },
]

const espacios: { icon: IconName; color: MarkColor; title: string; hint: string }[] = [
  { icon: 'adjust', color: 'orange', title: 'Matemática · 4.º A', hint: 'Doce actividades · cuatro sin mirar' },
  { icon: 'menu_book', color: 'purple', title: 'Lengua · 6.º', hint: 'Ocho actividades · todas al día' },
  { icon: 'explore', color: 'blue', title: 'Ciencias · 5.º B', hint: 'Cinco actividades · dos abiertas' },
]

export function ListStory() {
  return (
    <Page
      title="List · ListItem"
      kind="Datos"
      imports="import { List, ListItem } from '@melu/ui'"
      lead="Filas altas, cada una con una marca de color, un título y una línea de apoyo. No es `Row`: acá no hay divisores —cada fila es su propia caja con aire alrededor—, el título sube a 16 porque es lo que se lee primero, y la marca de color es lo que te deja encontrar una fila de reojo sin leerla."
    >
      <Section
        title="La pieza"
        note="Las medidas salen de la regla del anidado: contenedor de radio 24 con 8 de padding, así que la fila lleva 16. El alto de 72 tampoco es arbitrario — la marca es de 44 y el aire de 14 arriba y abajo. Cambiar la marca cambia el alto, no el padding."
      >
        <div className="max-w-[460px]">
          <List>
            {onboarding.map(i => (
              <ListItem key={i.title} icon={i.icon} color={i.color} title={i.title} hint={i.hint} active={i.active} onClick={() => {}} />
            ))}
          </List>
        </div>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          La cuarta fila está en <Mono>active</Mono>: queda hundida, no teñida — el color ya lo gasta la marca.
          Pasá el mouse por cualquier otra para ver el hover, que levanta la fila al papel en vez de oscurecerla.
        </p>
      </Section>

      <Section title="Estados de una fila">
        <div className="max-w-[460px]">
          <List>
            <ListItem icon="check" color="green" title="En reposo" hint="Fondo apagado, sin sombra." />
            <ListItem icon="menu_book" color="purple" title="Elegida" hint="Hundida un paso." active />
            <ListItem icon="star_shine" color="blue" title="Se toca" hint="Pasá el mouse: sube al papel y toma sombra." onClick={() => {}} />
          </List>
        </div>
      </Section>

      <Section title="Como índice" note="La misma pieza con contenido de melu: acá el color identifica el espacio, no el estado.">
        <div className="max-w-[460px]">
          <List>
            {espacios.map(e => (
              <ListItem
                key={e.title}
                icon={e.icon} color={e.color} title={e.title} hint={e.hint}
                onClick={() => {}}
                trailing={<Icon name="chevron_right" size={20} className="icon-muted" />}
              />
            ))}
          </List>
        </div>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'ListItem · icon', type: 'IconName', note: 'obligatorio' },
          { name: 'ListItem · color', type: "'green' | 'purple' | 'orange' | 'blue' | 'pink'", note: 'obligatorio: el par relleno/glifo de la marca' },
          { name: 'ListItem · title', type: 'string', note: 'obligatorio · 16/600' },
          { name: 'ListItem · hint', type: 'string', note: '14/500 en gris' },
          { name: 'ListItem · active', type: 'boolean', note: 'hundida, no teñida' },
          { name: 'ListItem · onClick', type: '() => void', note: 'sin esto la fila es un <div> y no toma hover' },
          { name: 'ListItem · trailing', type: 'ReactNode', note: 'a la derecha: un chevron, un contador' },
        ]} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Una fila con onClick es un <button>; sin él es un <div> que no se puede enfocar.',
          'La marca de color no es la única señal: el título dice de qué es la fila.',
        ]} />
      </Section>
    </Page>
  )
}
