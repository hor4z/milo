import { Card, Folder, Icon } from '@milo/ui'
import { A11y, Mono, Page, Props, Section } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const p = (name: string, photo?: number) => ({ name, src: photo ? face(photo) : undefined })

export function FolderStory() {
  return (
    <Page
      title="Folder"
      kind="Superficies"
      imports="import { Folder, FolderIcon } from '@milo/ui'"
      lead="Una carpeta que se abre. Cerrada es una silueta limpia; al pasar por encima las hojas suben desde adentro y se abanican, y ahí se ve qué hay sin tener que entrar."
    >
      <Section
        title="Pasá el mouse"
        note="El sistema tiene escrito que las tarjetas no se mueven en hover, porque una grilla que salta hace temblar la vista. Esto no lo contradice: lo que se mueve no es la pieza, es el contenido de la pieza. La carpeta no cambia de tamaño ni de lugar, así que la grilla se queda quieta — y lo que se gana es información, cuántas hojas hay."
      >
        <Card surface="muted" className="flex flex-wrap gap-4 px-6 py-8">
          <Folder label="Onboarding" meta="15 archivos" onClick={() => {}} />
          <Folder label="Matemática · 4.º A" meta="8 actividades" onClick={() => {}} />
          <Folder label="Sin abrir" meta="2 archivos" sheets={2} onClick={() => {}} />
        </Card>
      </Section>

      <Section
        title="Las tres capas"
        note="Contratapa, hojas y solapa. La contratapa y la pestaña son UN solo path y no dos rectángulos: con dos, cada uno trae sus esquinas y en el doblez queda un corte a la vista. Las hojas suben entre la contratapa y la solapa, que es lo que hace que parezca que salen de adentro."
      >
        <Card surface="muted" className="flex flex-wrap items-end gap-8 px-6 py-8">
          {[88, 128, 168, 220].map(s => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Folder size={s} />
              <Mono>{s}</Mono>
            </div>
          ))}
        </Card>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          Adentro no hay un px suelto: todo va en por ciento del ancho, como el <Mono>Book</Mono>,
          así que el mismo dibujo sirve a 88 y a 220.
        </p>
      </Section>

      <Section
        title="El amarillo sale de una regla"
        note="Amarillo propio en H 89.6 de OKLCH. `--warn-500` está en 82.2 y a esa luminosidad sale dorado: siete grados son poco para dos colores de estado y mucho para una carpeta. La croma va al 81% del techo y no al tope — al límite deja de ser una carpeta y pasa a ser un resaltador."
      >
        <Card surface="muted" className="flex flex-wrap items-end gap-6 px-6 py-8">
          <Folder label="Amarillo" meta="el default" />
          <Folder label="Azul" meta="--label-blue" color="var(--label-blue)" />
          <Folder label="Púrpura" meta="--label-purple" color="var(--label-purple)" />
          <Folder label="Rosa" meta="--label-pink" color="var(--label-pink)" />
        </Card>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          Se elige <strong className="font-semibold text-ink">un solo color</strong>, el del cuerpo:
          la pestaña y el canto salen de él con color relativo, así que la carpeta queda pintada
          entera. Antes solo se teñía el cuerpo y quedaba con la oreja amarilla, que se veía como un
          error. Sirve igual para distinguir una carpeta puntual y no para pintar una grilla entera
          — doce carpetas de doce colores es un arcoíris, que es lo mismo que dice la nota de los
          tintes.
        </p>
      </Section>

      <Section
        title="Con avatares"
        note="Abajo a la izquierda de la solapa va quién tiene acceso. Es un `AvatarGroup`, así que hereda todo lo suyo: tres caras como máximo, el resto en un círculo neutro, y con un solo sobrante se muestra la cuarta cara en vez de un «+1». La prop `badges` sigue estando para lo que no es una persona."
      >
        <Card surface="muted" className="flex flex-wrap gap-4 px-6 py-8">
          <Folder label="Con dos" meta="6 archivos" avatars={[p('Ana Pérez', 1), p('Bruno Díaz', 2)]} />
          <Folder label="Con cinco" meta="24 archivos" avatars={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)]} />
          <Folder label="Sin foto" meta="9 archivos" avatars={[p('Irene Lopez'), p('Julián Cruz'), p('Karen Ortiz')]} />
          <Folder label="Teñida" meta="3 archivos" color="var(--label-blue)" avatars={[p('Mora Tello', 6), p('Nico Arce', 7)]} />
          <Folder label="Con un icono" meta="4 archivos" badges={<Icon name="attach_file" size={16} className="text-ink" />} />
        </Card>
        <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
          El anillo de los avatares va del color del cuerpo y no del papel: acá están apoyados sobre
          la carpeta, no sobre la página, y con el anillo blanco se ven recortados. El tamaño sale
          del ancho de la carpeta, como todo lo demás.
        </p>
      </Section>

      <Section title="Props">
        <Props of="Folder" />
      </Section>

      <Section
        title="No reemplaza a FolderIcon"
        note="`FolderIcon` es el glifo de 20 que identifica un espacio en una lista de siete, y sigue siendo el único SVG dibujado a mano del sistema. Esto es la pieza grande: una carpeta que se mira, no una que se lee de reojo."
      >
        <Card surface="muted" className="flex items-center gap-6 px-6 py-6">
          <Folder size={88} />
          <span className="text-body text-ink-muted">la pieza · el glifo</span>
        </Card>
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'El color identifica el espacio de un vistazo, pero el nombre está siempre escrito.',
          'El dibujo es aria-hidden: no se anuncia una carpeta dibujada.',
        ]} />
      </Section>
    </Page>
  )
}
