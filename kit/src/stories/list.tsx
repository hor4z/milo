import { Icon, type IconName } from '@milo/ui/icon'
import { type MarkColor } from '@milo/ui/lib/colors'
import { List, ListItem } from '@milo/ui/list'
import { A11y, Footnote, Frame, Mono, Page, Props, Section } from '../kit'

const onboarding: { icon: IconName; color: MarkColor; title: string; hint: string; active?: boolean }[] = [
  { icon: 'check', color: 'green', title: 'Completá tu perfil', hint: 'Una foto y en qué materias das clase.' },
  { icon: 'menu_book', color: 'purple', title: 'Armá tu primera actividad', hint: 'Con una consigna y un método alcanza para empezar.' },
  { icon: 'calendar_month', color: 'orange', title: 'Elegí cuándo se cierra', hint: 'Después de esa fecha nadie puede entregar.' },
  { icon: 'check', color: 'green', title: 'Invitá a tu primer grupo', hint: 'Con un link que podés revocar cuando quieras.', active: true },
  { icon: 'lightbulb', color: 'blue', title: 'Mirá lo que hicieron otros', hint: 'Actividades públicas de docentes de tu área.' },
]

const spaces: { icon: IconName; color: MarkColor; title: string; hint: string }[] = [
  { icon: 'adjust', color: 'orange', title: 'Matemática · 4.º A', hint: 'Doce actividades · cuatro sin mirar' },
  { icon: 'menu_book', color: 'purple', title: 'Lengua · 6.º', hint: 'Ocho actividades · todas al día' },
  { icon: 'explore', color: 'blue', title: 'Ciencias · 5.º B', hint: 'Cinco actividades · dos abiertas' },
]

export function ListStory() {
  return (
    <Page
      title="List · ListItem"
      kind="Datos"
      imports="import { List, ListItem } from '@milo/ui/list'"
      lead="Filas altas, cada una con una marca de color, un título y una línea de apoyo. No es `Row`: acá no hay divisores (cada fila es su propia caja con aire alrededor), el título sube a 16 porque es lo que se lee primero, y la marca de color es lo que te deja encontrar una fila de reojo sin leerla."
    >
      <Section
        title="La pieza"
        note="El contenedor es una bandeja transparente y las que flotan son las filas, cada una en papel con radio 16: el mismo de la `Card`, porque las dos se apoyan en la página. El alto de 72 tampoco es arbitrario: la marca es de 44 y el aire de 14 arriba y abajo. Cambiar la marca cambia el alto, no el padding."
      >
        <Frame width="md">
          <List>
            {onboarding.map(i => (
              <ListItem key={i.title} icon={i.icon} color={i.color} title={i.title} hint={i.hint} active={i.active} onClick={() => {}} />
            ))}
          </List>
        </Frame>
        <Footnote>
          La cuarta fila está en <Mono>active</Mono>: queda hundida, no teñida, el color ya lo gasta la marca.
          Pasá el mouse por cualquier otra para ver el hover, que levanta la fila al papel en vez de oscurecerla.
        </Footnote>
      </Section>

      <Section title="Estados de una fila">
        <Frame width="md">
          <List>
            <ListItem icon="check" color="green" title="En reposo" hint="Fondo apagado, sin sombra." />
            <ListItem icon="menu_book" color="purple" title="Elegida" hint="Hundida un paso." active />
            <ListItem icon="star_shine" color="blue" title="Se toca" hint="Pasá el mouse: sube al papel y toma sombra." onClick={() => {}} />
          </List>
        </Frame>
      </Section>

      <Section title="Como índice" note="La misma pieza con contenido de milo: acá el color identifica el espacio, no el estado.">
        <Frame width="md">
          <List>
            {spaces.map(e => (
              <ListItem
                key={e.title}
                icon={e.icon} color={e.color} title={e.title} hint={e.hint}
                onClick={() => {}}
                trailing={<Icon name="chevron_right" size={20} className="icon-muted" />}
              />
            ))}
          </List>
        </Frame>
      </Section>

      <Section title="Props">
        <Props of="ListItem" />
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
