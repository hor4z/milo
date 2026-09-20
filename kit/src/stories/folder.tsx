import cls from './folder.module.css'
import { Card } from '@milo/ui/card'
import { Folder } from '@milo/ui/folder'
import { Icon } from '@milo/ui/icon'
import { A11y, Example, Footnote, Mono, Page, Practices, Props, Section, Stack } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const p = (name: string, photo?: number) => ({ name, src: photo ? face(photo) : undefined })

export function FolderStory() {
  return (
    <Page
      title="Folder"
      kind="Superficies"
      imports="import { Folder } from '@milo/ui/folder' · import { Icon } from '@milo/ui/icon'"
      lead="Una carpeta que se abre. Cerrada es una silueta limpia; al pasar por encima las hojas suben desde adentro y se abanican, y ahí se ve qué hay sin tener que entrar."
    >
      <Section
        title="Pasá el mouse"
        note="El sistema tiene escrito que las tarjetas no se mueven en hover, porque una grilla que salta hace temblar la vista. Esto no lo contradice: lo que se mueve no es la pieza, es el contenido de la pieza. La carpeta no cambia de tamaño ni de lugar, así que la grilla se queda quieta, y lo que se gana es información, cuántas hojas hay."
      >
        <Card surface="muted" className={cls.hoverShelf}>
          <Folder onClick={() => {}}>
            <Folder.Label>Onboarding</Folder.Label>
            <Folder.Meta>15 archivos</Folder.Meta>
          </Folder>
          <Folder onClick={() => {}}>
            <Folder.Label>Matemática · 4.º A</Folder.Label>
            <Folder.Meta>8 actividades</Folder.Meta>
          </Folder>
          <Folder sheets={2} onClick={() => {}}>
            <Folder.Label>Sin abrir</Folder.Label>
            <Folder.Meta>2 archivos</Folder.Meta>
          </Folder>
        </Card>
      </Section>

      <Section
        title="Las tres capas"
        note="Las hojas suben al pasar el mouse y dicen cuántas hay. La carpeta no cambia de tamaño ni de lugar, así que la grilla no se mueve."
      >
        <Card surface="muted" className={cls.layersShelf}>
          {[88, 128, 168, 220].map(s => (
            <Stack key={s} gap="xs" align="center">
              <Folder size={s} />
              <Mono>{s}</Mono>
            </Stack>
          ))}
        </Card>
        <Footnote>
          Adentro no hay un px suelto: todo va en por ciento del ancho, así que el mismo dibujo
          sirve a 88 y a 220.
        </Footnote>
      </Section>

      <Section
        title="El amarillo sale de una regla"
        note="El amarillo de la carpeta es propio y no el de `warn`: una carpeta no está avisando de nada. El color sale de un token, nunca de un hex a mano."
      >
        <Card surface="muted" className={cls.colorShelf}>
          <Folder>
            <Folder.Label>Amarillo</Folder.Label>
            <Folder.Meta>el default</Folder.Meta>
          </Folder>
          <Folder color="var(--label-blue)">
            <Folder.Label>Azul</Folder.Label>
            <Folder.Meta>--label-blue</Folder.Meta>
          </Folder>
          <Folder color="var(--label-purple)">
            <Folder.Label>Púrpura</Folder.Label>
            <Folder.Meta>--label-purple</Folder.Meta>
          </Folder>
          <Folder color="var(--label-pink)">
            <Folder.Label>Rosa</Folder.Label>
            <Folder.Meta>--label-pink</Folder.Meta>
          </Folder>
        </Card>
        <Footnote>
          Se elige <strong className={cls.emphasis}>un solo color</strong>, el del cuerpo:
          la pestaña y el canto salen de él con color relativo, así que la carpeta queda pintada
          entera. Antes solo se teñía el cuerpo y quedaba con la oreja amarilla, que se veía como un
          error. Sirve igual para distinguir una carpeta puntual y no para pintar una grilla entera:
          doce carpetas de doce colores es un arcoíris, que es lo mismo que dice la nota de los
          tintes.
        </Footnote>
      </Section>

      <Section
        title="Con avatares"
        note="Abajo a la izquierda de la solapa va quién tiene acceso. Es un `AvatarGroup`, así que hereda todo lo suyo: tres caras como máximo, el resto en un círculo neutro, y con un solo sobrante se muestra la cuarta cara en vez de un '+1'. La prop `badges` sigue estando para lo que no es una persona."
      >
        <Card surface="muted" className={cls.avatarShelf}>
          <Folder avatars={[p('Ana Pérez', 1), p('Bruno Díaz', 2)]}>
            <Folder.Label>Con dos</Folder.Label>
            <Folder.Meta>6 archivos</Folder.Meta>
          </Folder>
          <Folder avatars={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)]}>
            <Folder.Label>Con cinco</Folder.Label>
            <Folder.Meta>24 archivos</Folder.Meta>
          </Folder>
          <Folder avatars={[p('Irene Lopez'), p('Julián Cruz'), p('Karen Ortiz')]}>
            <Folder.Label>Sin foto</Folder.Label>
            <Folder.Meta>9 archivos</Folder.Meta>
          </Folder>
          <Folder color="var(--label-blue)" avatars={[p('Mora Tello', 6), p('Nico Arce', 7)]}>
            <Folder.Label>Teñida</Folder.Label>
            <Folder.Meta>3 archivos</Folder.Meta>
          </Folder>
          <Folder badges={<Icon name="attach_file" size={16} className={cls.badgeIcon} />}>
            <Folder.Label>Con un icono</Folder.Label>
            <Folder.Meta>4 archivos</Folder.Meta>
          </Folder>
        </Card>
        <Footnote>
          El anillo de los avatares va del color del cuerpo y no del papel: acá están apoyados sobre
          la carpeta, no sobre la página, y con el anillo blanco se ven recortados. El tamaño sale
          del ancho de la carpeta, como todo lo demás.
        </Footnote>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<Folder color="var(--space-green)" onClick={abrir}>
  <Folder.Label>Ciencias</Folder.Label>
  <Folder.Meta>24 archivos</Folder.Meta>
</Folder>`} />
      </Section>

      <Section title="Props">
        <Props of="Folder" />
      </Section>

      <Section
        title="No reemplaza a FolderIcon"
        note="`FolderIcon` es el glifo de 20 que identifica un espacio en una lista de siete, y sigue siendo el único SVG dibujado a mano del sistema. Esto es la pieza grande: una carpeta que se mira, no una que se lee de reojo."
      >
        <Card surface="muted" className={cls.glyphShelf}>
          <Folder size={88} />
          <span className={cls.glyphCaption}>la pieza · el glifo</span>
        </Card>
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>El nombre va en `Folder.Label` y la línea de apoyo en `Folder.Meta`.</Practices.Do>
          <Practices.Dont>El color sale de un token, nunca de un hex escrito a mano.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El color identifica el espacio de un vistazo, pero el nombre está siempre escrito.</A11y.Item>
          <A11y.Item>El dibujo es aria-hidden: no se anuncia una carpeta dibujada.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
