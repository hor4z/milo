import { useMemo, useState } from 'react'
import {
  Avatar, AvatarGroup, Chip, ColumnPicker, Dropdown, EmptyState, Filter, FilterBar, FilterReset,
  FilterSearch, IconButton,
  Pagination, PaginationNext, PaginationPrev, PaginationStatus,
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader,
  TableHint, TableNum, TableRow, TableTitle, facets, fold,
} from '@melu/ui'
import { A11y, Mono, Page, Props, Section } from '../kit'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const p = (name: string, photo?: number) => ({ name, src: photo ? face(photo) : undefined })

const tone = { 'Abierta': 'green', 'Corregida': 'blue' } as const

const spaces = [
  {
    name: 'Fracciones equivalentes', space: 'Matemática · 4.º A', status: 'Abierta',
    students: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)],
    total: 18,
    teacher: p('Valeria Ochoa', 7), done: 11, when: 'hace 2 h'
  },
  {
    name: 'El sistema solar', space: 'Ciencias · 5.º B', status: 'Corregida',
    students: [p('Franco Gil', 6), p('Gabriela Mota', 7), p('Hugo Paz', 8)],
    total: 24,
    teacher: p('Martín Roldán', 6), done: 24, when: 'ayer'
  },
  {
    name: 'Cuento policial', space: 'Lengua · 6.º', status: 'Borrador',
    students: [p('Irene Lopez'), p('Julián Cruz'), p('Karen Ortiz'), p('Leo Nuñez')],
    total: 0,
    teacher: p('Valeria Ochoa', 7), done: 0, when: 'hace 5 días'
  },
  {
    name: 'Mapa de América', space: 'Sociales · 5.º A', status: 'Abierta',
    students: [p('Mora Tello', 2), p('Nico Arce'), p('Olivia Rey', 4)],
    total: 7,
    teacher: p('Nadia Britos'), done: 3, when: 'hace 1 h'
  },
]

const all = [
  ...spaces,
  { name: 'La Revolución de Mayo', space: 'Sociales · 6.º', status: 'Corregida', students: [p('Pablo Vera', 7), p('Rita Coll', 1)], total: 21, teacher: p('Martín Roldán', 6), done: 21, when: 'hace 3 días' },
  { name: 'Ecuaciones de primer grado', space: 'Matemática · 6.º', status: 'Abierta', students: [p('Sara Luna', 3), p('Tomás Gil'), p('Ulises Paz', 5), p('Vera Ruiz', 6)], total: 12, teacher: p('Valeria Ochoa', 7), done: 5, when: 'hace 20 min' },
  { name: 'El ciclo del agua', space: 'Ciencias · 4.º A', status: 'Borrador', students: [p('Wanda Ise'), p('Ximena Roa', 8)], total: 0, teacher: p('Nadia Britos'), done: 0, when: 'la semana pasada' },
  { name: 'Poesía de vanguardia', space: 'Lengua · 6.º', status: 'Corregida', students: [p('Yago Prat', 4), p('Zoe Marín', 2), p('Aldo Sanz')], total: 16, teacher: p('Martín Roldán', 6), done: 16, when: 'hace 4 h' },
  { name: 'Los climas del mundo', space: 'Sociales · 5.º A', status: 'Abierta', students: [p('Bianca Toro', 6), p('Ciro Vega')], total: 9, teacher: p('Nadia Britos'), done: 2, when: 'hace 6 días' },
]

const PAGE_SIZE = 4

export function TableStory() {
  const [query, setQuery] = useState('')
  const [statuses, setStatuses] = useState<string[]>([])
  const [pickedSpaces, setPickedSpaces] = useState<string[]>([])
  const [pickedPeople, setPickedPeople] = useState<string[]>([])

  const columns = [
    { id: 'actividad', label: 'Actividad', locked: true },
    { id: 'estudiantes', label: 'Estudiantes' },
    { id: 'docente', label: 'Docente' },
    { id: 'estado', label: 'Estado' },
    { id: 'corregidas', label: 'Corregidas' },
    { id: 'entregas', label: 'Entregas' },
    { id: 'acciones', label: 'Acciones' },
  ]
  const [visible, setVisible] = useState(columns.map(c => c.id))
  const view = (id: string) => visible.includes(id)
  const [page, setPage] = useState(0)

  const narrow = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPage(0) }

  const subject = (a: typeof all[number]) => a.space.split(' · ')[0]

  const people = useMemo(() => {
    const views = new Map<string, { name: string; src?: string }>()
    for (const a of all) for (const e of a.students) if (!views.has(e.name)) views.set(e.name, e)
    return [...views.values()]
  }, [])

  const byText = useMemo(
    () => all.filter(a => !query.trim() || fold(a.name + ' ' + a.space).includes(fold(query))),
    [query],
  )
  const withPeople = (a: typeof all[number]) =>
    !pickedPeople.length || a.students.some(e => pickedPeople.includes(e.name))

  const statusCounts = facets(
    byText.filter(a => (!pickedSpaces.length || pickedSpaces.includes(subject(a))) && withPeople(a)),
    a => a.status,
  )
  const spaceCounts = facets(
    byText.filter(a => (!statuses.length || statuses.includes(a.status)) && withPeople(a)),
    subject,
  )
  const peopleCounts = useMemo(() => {
    const n: Record<string, number> = {}
    for (const a of byText) {
      if (statuses.length && !statuses.includes(a.status)) continue
      if (pickedSpaces.length && !pickedSpaces.includes(subject(a))) continue
      for (const e of a.students) n[e.name] = (n[e.name] ?? 0) + 1
    }
    return n
  }, [byText, statuses, pickedSpaces])

  const list = byText.filter(a =>
    (!statuses.length || statuses.includes(a.status))
    && (!pickedSpaces.length || pickedSpaces.includes(subject(a)))
    && withPeople(a))

  const from = page * PAGE_SIZE
  const onScreen = list.slice(from, from + PAGE_SIZE)
  const hasMore = from + PAGE_SIZE < list.length
  const filtering = query.trim() !== '' || statuses.length > 0 || pickedSpaces.length > 0 || pickedPeople.length > 0
  const clear = () => { setQuery(''); setStatuses([]); setPickedSpaces([]); setPickedPeople([]); setPage(0) }

  return (
    <Page
      title="Table"
      kind="Datos"
      imports="import { Table, TableHeader, TableRow, TableCell } from '@melu/ui'"
      lead="Piezas que se arman, no un componente que recibe `columns` y `rows`. Una tabla de datos y una de personas con un grupo de avatares y un menú al final no comparten nada más que la grilla, y una API de columnas termina con un `render` por columna: el mismo JSX, pero metido en un objeto y sin poder leerlo de arriba abajo."
    >
      <Section
        title="La tabla entera"
        note="Una tabla de trabajo son tres cosas más que la grilla: con qué se recorta, cuántas hay, y cómo se pasa al tramo siguiente. Buscá, filtrá y paginá — los tres se llevan entre sí, que es la parte que se rompe cuando cada uno se escribe por su lado. Y si las columnas no entran, la tabla scrollea de costado sin dibujar una barra: scrolleá con la rueda y mirá que los botones de paginar no se van con la tabla. Esa franja vive adentro del marco pero afuera del scroll, que es un lugar al que el call site no llega solo."
      >
        <FilterBar className="mb-3">
          <FilterSearch
            value={query}
            onValueChange={narrow(setQuery)}
            placeholder="Buscar por actividad o espacio"
          />
          <Filter
            label="Estado"
            value={statuses}
            onValueChange={narrow(setStatuses)}
            options={['Abierta', 'Corregida', 'Borrador'].map(v => ({ value: v, count: statusCounts[v] ?? 0 }))}
          />
          <Filter
            label="Materia"
            value={pickedSpaces}
            onValueChange={narrow(setPickedSpaces)}
            options={['Matemática', 'Ciencias', 'Lengua', 'Sociales'].map(v => ({ value: v, count: spaceCounts[v] ?? 0 }))}
          />
          <Filter
            label="Estudiantes"
            value={pickedPeople}
            onValueChange={narrow(setPickedPeople)}
            options={people.map(p => ({ value: p.name, count: peopleCounts[p.name] ?? 0, person: p }))}
          />
          {filtering && <FilterReset onClick={clear} />}
          <ColumnPicker
            columns={columns}
            value={visible}
            onValueChange={setVisible}
          />
        </FilterBar>

        <Table
          minWidth={980}
          footer={(
            <Pagination>
              <PaginationStatus
                from={from + 1}
                to={from + onScreen.length}
                total={list.length}
                noun={['actividad', 'actividades']}
              />
              <PaginationPrev disabled={page === 0} onClick={() => setPage(p => p - 1)} />
              <PaginationNext disabled={!hasMore} onClick={() => setPage(p => p + 1)} />
            </Pagination>
          )}
        >
          <TableHeader>
            <TableRow>
              <TableHead>Actividad</TableHead>
              {view('estudiantes') && <TableHead>Estudiantes</TableHead>}
              {view('docente') && <TableHead>Docente</TableHead>}
              {view('estado') && <TableHead>Estado</TableHead>}
              {view('corregidas') && <TableHead className="text-right">Corregidas</TableHead>}
              {view('entregas') && <TableHead className="text-right">Entregas</TableHead>}
              {view('acciones') && <TableHead><span className="sr-only">Acciones</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {onScreen.map(a => (
              <TableRow key={a.name} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{a.name}</TableTitle>
                  <TableHint>{a.space}</TableHint>
                </TableCell>
                {view('estudiantes') && <TableCell><AvatarGroup people={a.students} /></TableCell>}
                {view('docente') && (
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar name={a.teacher.name} src={a.teacher.src} size={24} />
                      <span className="truncate">{a.teacher.name}</span>
                    </span>
                  </TableCell>
                )}
                {view('estado') && <TableCell><Chip color={tone[a.status as keyof typeof tone]}>{a.status}</Chip></TableCell>}
                {view('corregidas') && (
                  <TableNum>
                    {a.total ? <>{a.done}<span className="text-ink-muted"> / {a.total}</span></> : '—'}
                  </TableNum>
                )}
                {view('entregas') && <TableNum>{a.total || '—'}</TableNum>}
                {view('acciones') && (
                <TableCell className="w-0 pr-4">
                  <Dropdown
                    items={[
                      { label: 'Abrir', icon: 'open_in_new' },
                      { label: 'Duplicar', icon: 'content_copy' },
                      { label: 'Archivar', icon: 'inventory_2' },
                    ]}
                    trigger={({ onClick, ref, ...rest }) => (
                      <IconButton
                        ref={ref}
                        onClick={e => { e.stopPropagation(); onClick() }}
                        {...rest}
                        icon="more_horiz"
                        label={`Acciones de ${a.name}`}
                        size="sm"
                      />
                    )}
                  />
                </TableCell>
                )}
              </TableRow>
            ))}
            {onScreen.length === 0 && (
              <tr>
                <td colSpan={visible.length} className="px-6 py-10">
                  <EmptyState
                    size="sm"
                    icon="search_off"
                    title="Ninguna actividad con eso"
                    body="Probá con otras palabras, o sacá alguno de los filtros puestos."
                    action={<FilterReset onClick={clear}>Limpiar los filtros</FilterReset>}
                  />
                </td>
              </tr>
            )}
          </TableBody>
          {onScreen.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1 + ['estudiantes', 'docente', 'estado'].filter(view).length}>
                  Total{filtering ? ' de lo filtrado' : ''}
                </TableCell>
                {view('corregidas') && <TableNum>{list.reduce((n, a) => n + a.done, 0)}</TableNum>}
                {view('entregas') && <TableNum>{list.reduce((n, a) => n + a.total, 0)}</TableNum>}
                {view('acciones') && <TableCell />}
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Section>

      <Section
        title="La pieza"
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
            {spaces.map(a => (
              <TableRow key={a.name} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{a.name}</TableTitle>
                  <TableHint>{a.space}</TableHint>
                </TableCell>
                <TableCell>
                  <AvatarGroup people={a.students} />
                </TableCell>
                <TableCell>
                  <Chip color={tone[a.status as keyof typeof tone]}>{a.status}</Chip>
                </TableCell>
                <TableNum>{a.total || '—'}</TableNum>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        title="La columna de estudiantes"
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
      </Section>

      <Section
        title="Sobre otro fondo"
        note="El anillo es del color de la fila y no blanco fijo, así que sobre un fondo distinto hay que pasarle `ring`. Es la única forma: un avatar no puede saber sobre qué lo pusieron."
      >
        <div className="flex items-center gap-6 rounded-xl bg-muted p-4">
          <AvatarGroup people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4)]} ring="ring-muted" />
          <Mono>ring="ring-muted"</Mono>
        </div>
      </Section>

      <Section title="Props">
        <Props of={['Table', 'TableRow', 'Avatar', 'AvatarGroup']} />
      </Section>
    
      <Section title="Accesibilidad">
        <A11y items={[
          'Es una <table> de verdad: encabezados con `scope`, filas y celdas con su semántica.',
          'Una fila que se toca entra en el orden de tabulación y contesta a Enter y a la barra: no es un click y nada más.',
          'Cuando las columnas no entran, el scroll lateral es una parada de tabulación con nombre — sin barra a la vista, es la única forma de llegar a la derecha sin mouse.',
          'La franja de paginación es un <nav> con su nombre y anuncia el tramo con role="status" cuando cambia.',
          'Las opciones de filtros y columnas se nombran una por una.',
        ]} />
      </Section>
    </Page>
  )
}
