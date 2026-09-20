import { Breadcrumb } from '@milo/ui/breadcrumb'
import { A11y, Canvas, Example, Note, Page, Practices, Props, Section } from '../kit'

export function BreadcrumbStory() {
  return (
    <Page
      title="Breadcrumb"
      kind="Navegación"
      imports="import { Breadcrumb } from '@milo/ui/breadcrumb'"
      lead="Dónde estás parado y cómo volver. Sirve cuando lo que estás mirando vive adentro de algo (una actividad adentro de un espacio) y no sirve cuando la pantalla es un destino suelto: una miga de un solo paso es ruido."
    >
      <Section
        title="De la raíz hasta acá"
        note="El último item no es un link: es dónde estás, y va marcado con `aria-current`. Los de atrás sí lo son, porque son la única forma de subir un nivel sin usar el botón del navegador."
      >
        <Canvas stack>
          <Breadcrumb label="Ruta completa" items={[
            { label: 'Espacios', onClick: () => {} },
            { label: 'Matemática · 4.º A', onClick: () => {} },
            { label: 'Fracciones equivalentes' },
          ]} />
          <Breadcrumb label="Ruta corta" items={[{ label: 'Espacios', onClick: () => {} }, { label: 'Lengua · 6.º' }]} />
        </Canvas>
      </Section>

      <Section
        title="Con href o con onClick"
        note="`href` es lo correcto cuando hay una URL de verdad: el click del medio abre en otra pestaña y el navegador la puede guardar. `onClick` es para cuando la navegación la maneja la app y no hay dirección que dar."
      >
        <Canvas stack>
          <Breadcrumb label="Ruta con nombres largos" items={[
            { label: 'Espacios', href: '#breadcrumb' },
            { label: 'Ciencias · 5.º B', href: '#breadcrumb' },
            { label: 'El sistema solar' },
          ]} />
        </Canvas>
      </Section>

      <Note title="Cuántos pasos">
        Tres o cuatro. Con más, la fila deja de leerse y empieza a cortarse en pantalla chica: si la
        jerarquía es más profunda que eso, lo que hay que revisar es la jerarquía.
      </Note>

      <Section title="Cómo se escribe">
        <Example code={`<Breadcrumb
  label="Dónde estás"
  items={[
    { label: 'Espacios', href: '/espacios' },
    { label: 'Matemática', href: '/espacios/mate' },
    { label: 'Fracciones equivalentes' },
  ]}
/>`} />
      </Section>

      <Section title="Props">
        <Props of="Breadcrumb" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>El último eslabón es dónde estás y no es un enlace.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>{'Es un <nav> con su nombre, así que un lector lo anuncia como la navegación de la página y lo puede saltear.'}</A11y.Item>
          <A11y.Item>El item actual lleva aria-current="page" y no es un link: no se puede ir a donde ya estás.</A11y.Item>
          <A11y.Item>Los separadores son decorativos y no se leen: entre item e item no se escucha "barra".</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
