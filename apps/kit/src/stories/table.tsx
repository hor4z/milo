import {
  AvatarGroup, Chip, Table, TableBody, TableCell, TableHead, TableHeader,
  TableHint, TableNum, TableRow, TableTitle,
} from '@melu/ui'
import { Block, Mono, Props, Section } from '../kit'

const espacios = [
  {
    nombre: 'Fracciones equivalentes', espacio: 'Matemática · 4.º A', estado: 'Abierta',
    estudiantes: ['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz', 'Elena Vega'],
    entregas: 18,
  },
  {
    nombre: 'El sistema solar', espacio: 'Ciencias · 5.º B', estado: 'Corregida',
    estudiantes: ['Franco Gil', 'Gabriela Mota', 'Hugo Paz'],
    entregas: 24,
  },
  {
    nombre: 'Cuento policial', espacio: 'Lengua · 6.º', estado: 'Borrador',
    estudiantes: ['Irene Lopez', 'Julián Cruz', 'Karen Ortiz', 'Leo Nuñez'],
    entregas: 0,
  },
  {
    nombre: 'Mapa de América', espacio: 'Sociales · 5.º A', estado: 'Abierta',
    estudiantes: ['Mora Tello', 'Nico Arce'],
    entregas: 7,
  },
]

export function TableStory() {
  return (
    <Section
      title="Table"
      note="Piezas que se arman, no un componente que recibe `columns` y `rows`. Una tabla de datos y una de personas con un grupo de avatares y un menú al final no comparten nada más que la grilla, y una API de columnas termina con un `render` por columna: el mismo JSX, pero metido en un objeto y sin poder leerlo de arriba abajo."
    >
      <Block
        label="La pieza"
        note="La fila es de 56, la misma que `Row` en un panel de ajustes: las dos son una línea de contenido con un divisor de un píxel, así que compartir el alto es lo que hace que una tabla y un panel puestos uno arriba del otro no se vean de dos sistemas distintos. La cabecera va en 11 con `tracking-wide` y en gris, que es el rol que la escala le da al `2xs`: es metadato, no contenido."
      >
        <Table minWidth={720}>
          <TableHeader>
            <TableRow>
              <TableHead>Actividad</TableHead>
              <TableHead>Estudiantes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Entregas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {espacios.map(a => (
              <TableRow key={a.nombre} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{a.nombre}</TableTitle>
                  <TableHint>{a.espacio}</TableHint>
                </TableCell>
                <TableCell>
                  <AvatarGroup names={a.estudiantes} />
                </TableCell>
                <TableCell>
                  <Chip>{a.estado}</Chip>
                </TableCell>
                <TableNum>{a.entregas || '—'}</TableNum>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Block>

      <Block
        label="La columna de estudiantes"
        note="Los avatares se montan un tercio de su tamaño y cada uno lleva un anillo del color de la fila: sin el anillo, dos vecinos de tonos parecidos se leen como una mancha sola en vez de como dos personas. El resto va en un círculo neutro y no en otra etiqueta de color — un `+4` no identifica a nadie, y en la familia viva se leería como una persona más del grupo."
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup names={['Ana Pérez', 'Bruno Díaz']} />
            <Mono>2 de 3</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup names={['Ana Pérez', 'Bruno Díaz', 'Carla Sosa']} />
            <Mono>3 de 3</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup names={['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz']} />
            <Mono>4 · se muestra la cuarta cara, no un «+1»</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup names={['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz', 'Elena Vega']} />
            <Mono>5 · tres caras y el resto</Mono>
          </div>
        </div>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          El sobrante de uno solo muestra la cuarta cara en vez de un «+1»: el círculo ocupa
          exactamente lo mismo que la persona que estaría escondiendo, así que no ahorra nada y
          dice menos.
        </p>
      </Block>

      <Block
        label="Sobre otro fondo"
        note="El anillo es del color de la fila y no blanco fijo, así que sobre un fondo distinto hay que pasarle `ring`. Es la única forma: un avatar no puede saber sobre qué lo pusieron."
      >
        <div className="flex items-center gap-6 rounded-xl bg-muted p-4">
          <AvatarGroup names={['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz']} ring="ring-muted" />
          <Mono>ring="ring-muted"</Mono>
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'Table · minWidth', type: 'number', def: '640', note: 'abajo de eso scrollea en vez de apretar' },
          { name: 'TableRow · onClick', type: '() => void', note: 'sin esto la fila no toma hover ni cursor' },
          { name: 'TableRow · active', type: 'boolean', note: 'apagada, no teñida' },
          { name: 'TableHead', type: 'th', note: '11/600 con tracking, en gris' },
          { name: 'TableCell', type: 'td', note: '12/500, alto 56' },
          { name: 'TableNum', type: 'td', note: 'igual pero alineada a la derecha y tabular' },
          { name: 'TableTitle', type: 'ReactNode', note: '14/600: lo que se lee primero' },
          { name: 'TableHint', type: 'ReactNode', note: '12/500 en gris, debajo del título' },
          { name: 'AvatarGroup · names', type: 'readonly string[]', note: 'obligatorio' },
          { name: 'AvatarGroup · max', type: 'number', def: '3', note: 'cuenta avatares, no personas' },
          { name: 'AvatarGroup · size', type: 'number', def: '28', note: 'el monte sale de acá' },
          { name: 'AvatarGroup · ring', type: 'string', def: "'ring-surface'", note: 'la utilidad del fondo de atrás' },
        ]} />
      </Block>
    </Section>
  )
}
