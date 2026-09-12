import { Avatar, AvatarGroup } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const persona = (name: string, foto?: number) => ({ name, src: foto ? cara(foto) : undefined })

export function AvatarStory() {
  return (
    <Section
      title="Avatar · AvatarGroup"
      note="Una persona en el lugar de un nombre. Con foto o con la inicial sobre una etiqueta de color, y las dos tienen que pesar lo mismo: en una fila donde algunos subieron foto y otros no, el que no subió no puede leerse como un error."
    >
      <Block
        label="Sin foto"
        note="Círculo pastel con relieve y la inicial en el mismo tono varios pasos más oscuro: es la familia de las marcas de una fila de lista, no la familia viva. Se cambió después de medirlo — la inicial sobre pastel se lee mejor que el blanco sobre relleno vivo (4.51:1 contra su propio disco, contra 3.78:1), y a cambio el avatar deja de gritarle al texto de al lado, que es el problema real de una fila con cinco. Lo que se pierde es presencia del disco: 1.91:1 contra el papel donde el vivo daba 3.68:1. El tono sale del nombre y no de un random: si saliera de un random, la misma persona cambiaría de color en cada render y el color dejaría de identificar a nadie."
      >
        <Demo>
          <Avatar name="Horacio Rivero" size={24} />
          <Avatar name="Horacio Rivero" size={34} />
          <Avatar name="Horacio Rivero" size={44} />
          <Avatar name="Melina Duarte" size={44} />
          <Avatar name="Equipo Timonel" size={44} />
        </Demo>
      </Block>

      <Block
        label="Con foto"
        note="Con `src`, la etiqueta de color no se reemplaza: se queda de fondo. Es lo que se ve mientras la imagen carga y lo que queda si no carga nunca — un hueco gris en una fila de cinco se lee como una persona sin nombre, y una inicial sobre su color no."
      >
        <Demo>
          <Avatar name="Ana Pérez" src={cara(1)} size={24} />
          <Avatar name="Ana Pérez" src={cara(1)} size={34} />
          <Avatar name="Ana Pérez" src={cara(1)} size={44} />
          <Avatar name="Bruno Díaz" src={cara(2)} size={44} />
          <Avatar name="Carla Sosa" src={cara(3)} size={44} />
          <Avatar name="Damián Ruiz" src={cara(4)} size={44} />
        </Demo>
      </Block>

      <Block
        label="El grupo"
        note="Se montan un tercio de su tamaño y cada uno lleva un anillo del color del fondo de atrás: sin el anillo, dos vecinos de tonos parecidos se leen como una mancha sola en vez de como dos personas. Tres caras como máximo y el resto en un círculo neutro — un «+4» no identifica a nadie, así que no va en la familia viva de las etiquetas, que es la de identificar."
      >
        <Demo label="todos con foto">
          <AvatarGroup people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]} />
        </Demo>
        <Demo label="ninguno con foto">
          <AvatarGroup people={[persona('Irene Lopez'), persona('Julián Cruz'), persona('Karen Ortiz'), persona('Leo Nuñez')]} />
        </Demo>
        <Demo label="mezclados · el caso que importa mirar">
          <AvatarGroup people={[persona('Mora Tello', 6), persona('Nico Arce'), persona('Olivia Rey', 7)]} />
        </Demo>
        <Demo label="con un solo sobrante va la cuarta cara, no un «+1»">
          <AvatarGroup people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4)]} />
        </Demo>
      </Block>

      <Block
        label="Sobre otro fondo"
        note="El anillo es del color de lo que hay atrás y no blanco fijo, así que fuera del papel hay que pasarle `ring`. Es la única forma: un avatar no puede saber sobre qué lo pusieron."
      >
        <Demo label='ring="ring-muted" sobre bg-muted'>
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]}
              size={40}
              ring="ring-muted"
            />
          </span>
        </Demo>
        <Demo label="el mismo grupo con el anillo por default: se corta contra el fondo">
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]}
              size={40}
            />
          </span>
        </Demo>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'Avatar · name', type: 'string', note: 'obligatorio: de acá salen la inicial y el tinte' },
          { name: 'Avatar · src', type: 'string', note: 'opcional; la etiqueta de color queda de fondo' },
          { name: 'Avatar · size', type: 'number', def: '40' },
          { name: 'AvatarGroup · people', type: '{ name, src? }[]', note: 'obligatorio; sin `src` cae a la inicial' },
          { name: 'AvatarGroup · max', type: 'number', def: '3', note: 'cuenta avatares, no personas' },
          { name: 'AvatarGroup · size', type: 'number', def: '28', note: 'el monte sale de acá' },
          { name: 'AvatarGroup · ring', type: 'string', def: "'ring-surface'", note: 'la utilidad del fondo de atrás' },
        ]} />
      </Block>
    </Section>
  )
}
