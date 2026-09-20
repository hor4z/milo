import { Icon, type IconName } from '@milo/ui/icon'
import { type MarkColor } from '@milo/ui/lib/colors'
import { List } from '@milo/ui/list'
import { A11y, Example, Footnote, Frame, Mono, Page, Practices, Props, Section } from '../kit'

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
      imports="import { List } from '@milo/ui/list'"
      lead="Filas altas, cada una con una marca de color, un título y una línea de apoyo. No es `Row`: acá no hay divisores (cada fila es su propia caja con aire alrededor), el título sube a 16 porque es lo que se lee primero, y la marca de color es lo que te deja encontrar una fila de reojo sin leerla."
    >
      <Section
        title="La pieza"
        note="Cada fila es una pieza apoyada en la página, con el mismo canto que una `Card`. La marca de color es lo que la identifica de reojo en una lista larga."
      >
        <Frame width="md">
          <List>
            {onboarding.map(i => (
              <List.Item key={i.title} icon={i.icon} color={i.color} active={i.active} onClick={() => {}}>
                <List.Title>{i.title}</List.Title>
                <List.Hint>{i.hint}</List.Hint>
              </List.Item>
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
            <List.Item icon="check" color="green">
              <List.Title>En reposo</List.Title>
              <List.Hint>Fondo apagado, sin sombra.</List.Hint>
            </List.Item>
            <List.Item icon="menu_book" color="purple" active>
              <List.Title>Elegida</List.Title>
              <List.Hint>Hundida un paso.</List.Hint>
            </List.Item>
            <List.Item icon="star_shine" color="blue" onClick={() => {}}>
              <List.Title>Se toca</List.Title>
              <List.Hint>Pasá el mouse: sube al papel y toma sombra.</List.Hint>
            </List.Item>
          </List>
        </Frame>
      </Section>

      <Section title="Como índice" note="La misma pieza con contenido de milo: acá el color identifica el espacio, no el estado.">
        <Frame width="md">
          <List>
            {spaces.map(e => (
              <List.Item key={e.title} icon={e.icon} color={e.color} onClick={() => {}}>
                <List.Title>{e.title}</List.Title>
                <List.Hint>{e.hint}</List.Hint>
                <List.Trailing><Icon name="chevron_right" size={20} className="icon-muted" /></List.Trailing>
              </List.Item>
            ))}
          </List>
        </Frame>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<List>
  <List.Item icon="edit" color="blue" onClick={abrir}>
    <List.Title>Corregir entregas</List.Title>
    <List.Hint>24 esperando</List.Hint>
    <List.Trailing><Icon name="chevron_right" size={20} className="icon-muted" /></List.Trailing>
  </List.Item>
</List>`} />
      </Section>

      <Section title="Props">
        <Props of="List" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>El nombre va en `List.Title` y la línea de apoyo en `List.Hint`.</Practices.Do>
          <Practices.Dont>Un contador no va en `List.Trailing`: el número ya está en el hint, y repetirlo obliga a leer dos veces.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>{'Una fila con onClick es un <button>; sin él es un <div> que no se puede enfocar.'}</A11y.Item>
          <A11y.Item>La marca de color no es la única señal: el título dice de qué es la fila.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
