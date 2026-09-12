import {
  AvatarGroup, Chip, Table, TableBody, TableCell, TableHead, TableHeader,
  TableHint, TableNum, TableRow, TableTitle,
} from '@melu/ui'
import { Block, Mono, Props, Section } from '../kit'

/* Las caras son sintéticas —generadas, no fotografiadas— y por eso se pueden
   usar acá: no hay nadie atrás de ninguna. En una columna que se llama
   "estudiantes" eso no es un detalle legal, es la diferencia entre un ejemplo
   que alguien copia y pega y una foto de un menor en una pantalla. Están en
   `public/avatars` y no apuntan a un host: un kit que le pide imágenes a un
   tercero se rompe sin internet y filtra un request por avatar. */
const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const p = (name: string, foto?: number) => ({ name, src: foto ? cara(foto) : undefined })

/* El estado va en un chip de color y no en texto suelto: es lo único de la fila
   que se busca de reojo —cuáles están abiertas— y en una columna de texto plano
   hay que leer las cuatro para saberlo.

   `Borrador` se queda neutro a propósito. El color acá quiere decir "esto está
   pasando"; un borrador es justamente lo que todavía no pasa, y si las tres
   opciones llevan color la columna vuelve a ser un bloque parejo que hay que
   leer entero. */
const tono = { Abierta: 'green', Corregida: 'blue' } as const

const espacios = [
  {
    nombre: 'Fracciones equivalentes', espacio: 'Matemática · 4.º A', estado: 'Abierta',
    estudiantes: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)],
    entregas: 18,
  },
  {
    nombre: 'El sistema solar', espacio: 'Ciencias · 5.º B', estado: 'Corregida',
    estudiantes: [p('Franco Gil', 6), p('Gabriela Mota', 7), p('Hugo Paz', 8)],
    entregas: 24,
  },
  {
    nombre: 'Cuento policial', espacio: 'Lengua · 6.º', estado: 'Borrador',
    /* Una fila sin fotos: es lo que pasa de verdad cuando nadie subió una, y el
       grupo tiene que seguir leyéndose como cinco personas. */
    estudiantes: [p('Irene Lopez'), p('Julián Cruz'), p('Karen Ortiz'), p('Leo Nuñez')],
    entregas: 0,
  },
  {
    nombre: 'Mapa de América', espacio: 'Sociales · 5.º A', estado: 'Abierta',
    /* Mezcla: dos con foto y una sin. La inicial sobre su color tiene que pesar
       lo mismo que una cara, o la persona sin foto se lee como un hueco. */
    estudiantes: [p('Mora Tello', 2), p('Nico Arce'), p('Olivia Rey', 4)],
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
        note="La fila es de 56, la misma que `Row` en un panel de ajustes: las dos son una línea de contenido con un divisor de un píxel, así que compartir el alto es lo que hace que una tabla y un panel puestos uno arriba del otro no se vean de dos sistemas distintos. La cabecera va en 11 con `tracking-wide` y en tinta: en 11 el tamaño ya dice que es un rótulo, y el gris encima lo apagaba tanto que había que buscar de qué era cada columna. Las filas alternan papel y un paso más oscuro — en una tabla ancha el divisor de un píxel no alcanza para seguir una fila hasta la última columna, la banda sí. Y contra los bordes las celdas llevan 24 en vez de 16: entre dos columnas el aire se reparte entre las dos, contra el canto hay uno solo."
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
                  <AvatarGroup people={a.estudiantes} />
                </TableCell>
                <TableCell>
                  <Chip color={tono[a.estado as keyof typeof tono]}>{a.estado}</Chip>
                </TableCell>
                <TableNum>{a.entregas || '—'}</TableNum>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Block>

      <Block
        label="La columna de estudiantes"
        note="Los avatares se montan un tercio de su tamaño y cada uno lleva un anillo del color de la fila: sin el anillo, dos vecinos de tonos parecidos se leen como una mancha sola en vez de como dos personas. El resto va en un círculo neutro y no en otra etiqueta de color — un `+4` no identifica a nadie, y en la familia viva se leería como una persona más del grupo. Con foto, la etiqueta de color se queda de fondo: es lo que se ve mientras la imagen carga y lo que queda si no carga nunca, y una inicial sobre su color pesa lo mismo que una cara — un hueco gris, no."
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2)]} />
            <Mono>2 de 3</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3)]} />
            <Mono>3 de 3</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4)]} />
            <Mono>4 · se muestra la cuarta cara, no un «+1»</Mono>
          </div>
          <div className="flex items-center gap-6 rounded-xl bg-surface p-4 ring-1 ring-line">
            <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)]} />
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
          <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4)]} ring="ring-muted" />
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
          { name: 'Avatar · src', type: 'string', note: 'opcional; la etiqueta de color queda de fondo' },
          { name: 'AvatarGroup · people', type: '{ name, src? }[]', note: 'obligatorio; sin `src` cae a la inicial' },
          { name: 'AvatarGroup · max', type: 'number', def: '3', note: 'cuenta avatares, no personas' },
          { name: 'AvatarGroup · size', type: 'number', def: '28', note: 'el monte sale de acá' },
          { name: 'AvatarGroup · ring', type: 'string', def: "'ring-surface'", note: 'la utilidad del fondo de atrás' },
        ]} />
      </Block>
    </Section>
  )
}
