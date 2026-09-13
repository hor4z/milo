import { Avatar, AvatarGroup } from '@milo/ui'
import { A11y, Demo, Page, Props, Section } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const person = (name: string, photo?: number) => ({ name, src: photo ? face(photo) : undefined })

export function AvatarStory() {
  return (
    <Page
      title="Avatar · AvatarGroup"
      kind="Datos"
      imports="import { Avatar, AvatarGroup } from '@milo/ui'"
      lead="Una persona en el lugar de un nombre. Con foto o con la inicial sobre una etiqueta de color, y las dos tienen que pesar lo mismo: en una fila donde algunos subieron foto y otros no, el que no subió no puede leerse como un error."
    >
      <Section
        title="Sin foto"
        note="Círculo pastel con la inicial en el mismo tono: es la familia de las marcas de fila, no la viva. Medido, la inicial sobre pastel se lee mejor que el blanco sobre relleno vivo (los cinco pares pasan de 4.5:1 y el blanco sobre el vivo no llega a 3.8:1 en ninguno) y deja de gritarle al texto de al lado. El tono sale del nombre: de un random, la misma persona cambiaría de color en cada render."
      >
        <Demo>
          <Avatar name="Horacio Rivero" size={24} />
          <Avatar name="Horacio Rivero" size={34} />
          <Avatar name="Horacio Rivero" size={44} />
          <Avatar name="Melina Duarte" size={44} />
          <Avatar name="Equipo Timonel" size={44} />
        </Demo>
      </Section>

      <Section
        title="Con foto"
        note="Con `src`, la etiqueta de color no se reemplaza: se queda de fondo. Es lo que se ve mientras la imagen carga y lo que queda si no carga nunca: un hueco gris en una fila de cinco se lee como una persona sin nombre, y una inicial sobre su color no."
      >
        <Demo>
          <Avatar name="Ana Pérez" src={face(1)} size={24} />
          <Avatar name="Ana Pérez" src={face(1)} size={34} />
          <Avatar name="Ana Pérez" src={face(1)} size={44} />
          <Avatar name="Bruno Díaz" src={face(2)} size={44} />
          <Avatar name="Carla Sosa" src={face(3)} size={44} />
          <Avatar name="Damián Ruiz" src={face(4)} size={44} />
        </Demo>
      </Section>

      <Section
        title="El grupo"
        note="Se montan un tercio y cada uno lleva un anillo del color del fondo de atrás: sin él, dos vecinos de tonos parecidos se leen como una mancha sola y no como dos personas. Tres caras y el resto en un círculo neutro: un '+4' no identifica a nadie."
      >
        <Demo label="todos con foto">
          <AvatarGroup people={[person('Ana Pérez', 1), person('Bruno Díaz', 2), person('Carla Sosa', 3), person('Damián Ruiz', 4), person('Elena Vega', 5)]} />
        </Demo>
        <Demo label="ninguno con foto">
          <AvatarGroup people={[person('Irene Lopez'), person('Julián Cruz'), person('Karen Ortiz'), person('Leo Nuñez')]} />
        </Demo>
        <Demo label="mezclados · el caso que importa mirar">
          <AvatarGroup people={[person('Mora Tello', 6), person('Nico Arce'), person('Olivia Rey', 7)]} />
        </Demo>
        <Demo label="con un solo sobrante va la cuarta cara, no un '+1'">
          <AvatarGroup people={[person('Ana Pérez', 1), person('Bruno Díaz', 2), person('Carla Sosa', 3), person('Damián Ruiz', 4)]} />
        </Demo>
      </Section>

      <Section
        title="Sobre otro fondo"
        note="El anillo es del color de lo que hay atrás y no blanco fijo, así que fuera del papel hay que pasarle `ring`. Es la única forma: un avatar no puede saber sobre qué lo pusieron."
      >
        <Demo label='ring="ring-muted" sobre bg-muted'>
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[person('Ana Pérez', 1), person('Bruno Díaz', 2), person('Carla Sosa', 3), person('Damián Ruiz', 4), person('Elena Vega', 5)]}
              size={40}
              ring="ring-muted"
            />
          </span>
        </Demo>
        <Demo label="el mismo grupo con el anillo por default: se corta contra el fondo">
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[person('Ana Pérez', 1), person('Bruno Díaz', 2), person('Carla Sosa', 3), person('Damián Ruiz', 4), person('Elena Vega', 5)]}
              size={40}
            />
          </span>
        </Demo>
      </Section>

      <Section title="Props">
        <Props of={['Avatar', 'AvatarGroup']} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'El grupo publica los nombres completos en texto para quien no ve las caras.',
          'Sin foto, la inicial va sobre su color con contraste suficiente.',
        ]} />
      </Section>
    </Page>
  )
}
