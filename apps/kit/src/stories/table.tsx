import { useMemo, useState } from 'react'
import {
  Avatar, AvatarGroup, Chip, ColumnPicker, Dropdown, EmptyState, Filter, FilterBar, FilterReset,
  FilterSearch, IconButton,
  Pagination, PaginationNext, PaginationPrev, PaginationStatus,
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader,
  TableHint, TableNum, TableRow, TableTitle, facets, fold,
} from '@melu/ui'
import { Mono, Page, Props, Section } from '../kit'

const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const p = (name: string, foto?: number) => ({ name, src: foto ? cara(foto) : undefined })

const tono = { Abierta: 'green', Corregida: 'blue' } as const

const espacios = [
  {
    nombre: 'Fracciones equivalentes', espacio: 'Matemática · 4.º A', estado: 'Abierta',
    estudiantes: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Damián Ruiz', 4), p('Elena Vega', 5)],
    entregas: 18,
    docente: p('Valeria Ochoa', 7), corregidas: 11, cuando: 'hace 2 h'
  },
  {
    nombre: 'El sistema solar', espacio: 'Ciencias · 5.º B', estado: 'Corregida',
    estudiantes: [p('Franco Gil', 6), p('Gabriela Mota', 7), p('Hugo Paz', 8)],
    entregas: 24,
    docente: p('Martín Roldán', 6), corregidas: 24, cuando: 'ayer'
  },
  {
    nombre: 'Cuento policial', espacio: 'Lengua · 6.º', estado: 'Borrador',
    estudiantes: [p('Irene Lopez'), p('Julián Cruz'), p('Karen Ortiz'), p('Leo Nuñez')],
    entregas: 0,
    docente: p('Valeria Ochoa', 7), corregidas: 0, cuando: 'hace 5 días'
  },
  {
    nombre: 'Mapa de América', espacio: 'Sociales · 5.º A', estado: 'Abierta',
    estudiantes: [p('Mora Tello', 2), p('Nico Arce'), p('Olivia Rey', 4)],
    entregas: 7,
    docente: p('Nadia Britos'), corregidas: 3, cuando: 'hace 1 h'
  },
]

const todas = [
  ...espacios,
  { nombre: 'La Revolución de Mayo', espacio: 'Sociales · 6.º', estado: 'Corregida', estudiantes: [p('Pablo Vera', 7), p('Rita Coll', 1)], entregas: 21, docente: p('Martín Roldán', 6), corregidas: 21, cuando: 'hace 3 días' },
  { nombre: 'Ecuaciones de primer grado', espacio: 'Matemática · 6.º', estado: 'Abierta', estudiantes: [p('Sara Luna', 3), p('Tomás Gil'), p('Ulises Paz', 5), p('Vera Ruiz', 6)], entregas: 12, docente: p('Valeria Ochoa', 7), corregidas: 5, cuando: 'hace 20 min' },
  { nombre: 'El ciclo del agua', espacio: 'Ciencias · 4.º A', estado: 'Borrador', estudiantes: [p('Wanda Ise'), p('Ximena Roa', 8)], entregas: 0, docente: p('Nadia Britos'), corregidas: 0, cuando: 'la semana pasada' },
  { nombre: 'Poesía de vanguardia', espacio: 'Lengua · 6.º', estado: 'Corregida', estudiantes: [p('Yago Prat', 4), p('Zoe Marín', 2), p('Aldo Sanz')], entregas: 16, docente: p('Martín Roldán', 6), corregidas: 16, cuando: 'hace 4 h' },
  { nombre: 'Los climas del mundo', espacio: 'Sociales · 5.º A', estado: 'Abierta', estudiantes: [p('Bianca Toro', 6), p('Ciro Vega')], entregas: 9, docente: p('Nadia Britos'), corregidas: 2, cuando: 'hace 6 días' },
]

const TRAMO = 4

export function TableStory() {
  const [texto, setTexto] = useState('')
  const [estados, setEstados] = useState<string[]>([])
  const [espaciosElegidos, setEspaciosElegidos] = useState<string[]>([])
  const [gente, setGente] = useState<string[]>([])

  const columnas = [
    { id: 'actividad', label: 'Actividad', locked: true },
    { id: 'estudiantes', label: 'Estudiantes' },
    { id: 'docente', label: 'Docente' },
    { id: 'estado', label: 'Estado' },
    { id: 'corregidas', label: 'Corregidas' },
    { id: 'entregas', label: 'Entregas' },
    { id: 'acciones', label: 'Acciones' },
  ]
  const [visibles, setVisibles] = useState(columnas.map(c => c.id))
  const ver = (id: string) => visibles.includes(id)
  const [pagina, setPagina] = useState(0)

  const filtrar = <T,>(set: (v: T) => void) => (v: T) => { set(v); setPagina(0) }

  const materia = (a: typeof todas[number]) => a.espacio.split(' · ')[0]

  const personas = useMemo(() => {
    const vistas = new Map<string, { name: string; src?: string }>()
    for (const a of todas) for (const e of a.estudiantes) if (!vistas.has(e.name)) vistas.set(e.name, e)
    return [...vistas.values()]
  }, [])

  const porTexto = useMemo(
    () => todas.filter(a => !texto.trim() || fold(a.nombre + ' ' + a.espacio).includes(fold(texto))),
    [texto],
  )
  const conGente = (a: typeof todas[number]) =>
    !gente.length || a.estudiantes.some(e => gente.includes(e.name))

  const cuentaEstados = facets(
    porTexto.filter(a => (!espaciosElegidos.length || espaciosElegidos.includes(materia(a))) && conGente(a)),
    a => a.estado,
  )
  const cuentaEspacios = facets(
    porTexto.filter(a => (!estados.length || estados.includes(a.estado)) && conGente(a)),
    materia,
  )
  const cuentaGente = useMemo(() => {
    const n: Record<string, number> = {}
    for (const a of porTexto) {
      if (estados.length && !estados.includes(a.estado)) continue
      if (espaciosElegidos.length && !espaciosElegidos.includes(materia(a))) continue
      for (const e of a.estudiantes) n[e.name] = (n[e.name] ?? 0) + 1
    }
    return n
  }, [porTexto, estados, espaciosElegidos])

  const lista = porTexto.filter(a =>
    (!estados.length || estados.includes(a.estado))
    && (!espaciosElegidos.length || espaciosElegidos.includes(materia(a)))
    && conGente(a))

  const desde = pagina * TRAMO
  const aLaVista = lista.slice(desde, desde + TRAMO)
  const hayMas = desde + TRAMO < lista.length
  const filtrando = texto.trim() !== '' || estados.length > 0 || espaciosElegidos.length > 0 || gente.length > 0
  const limpiar = () => { setTexto(''); setEstados([]); setEspaciosElegidos([]); setGente([]); setPagina(0) }

  return (
    <Page
      title="Table"
      lead="Piezas que se arman, no un componente que recibe `columns` y `rows`. Una tabla de datos y una de personas con un grupo de avatares y un menú al final no comparten nada más que la grilla, y una API de columnas termina con un `render` por columna: el mismo JSX, pero metido en un objeto y sin poder leerlo de arriba abajo."
    >
      <Section
        title="La tabla entera"
        note="Una tabla de trabajo son tres cosas más que la grilla: con qué se recorta, cuántas hay, y cómo se pasa al tramo siguiente. Buscá, filtrá y paginá — los tres se llevan entre sí, que es la parte que se rompe cuando cada uno se escribe por su lado. Y si las columnas no entran, la tabla scrollea de costado sin dibujar una barra: scrolleá con la rueda y mirá que los botones de paginar no se van con la tabla. Esa franja vive adentro del marco pero afuera del scroll, que es un lugar al que el call site no llega solo."
      >
        <FilterBar className="mb-3">
          <FilterSearch
            value={texto}
            onValueChange={filtrar(setTexto)}
            placeholder="Buscar por actividad o espacio"
          />
          <Filter
            label="Estado"
            value={estados}
            onValueChange={filtrar(setEstados)}
            options={['Abierta', 'Corregida', 'Borrador'].map(v => ({ value: v, count: cuentaEstados[v] ?? 0 }))}
          />
          <Filter
            label="Materia"
            value={espaciosElegidos}
            onValueChange={filtrar(setEspaciosElegidos)}
            options={['Matemática', 'Ciencias', 'Lengua', 'Sociales'].map(v => ({ value: v, count: cuentaEspacios[v] ?? 0 }))}
          />
          <Filter
            label="Estudiantes"
            value={gente}
            onValueChange={filtrar(setGente)}
            options={personas.map(p => ({ value: p.name, count: cuentaGente[p.name] ?? 0, person: p }))}
          />
          {filtrando && <FilterReset onClick={limpiar} />}
          <ColumnPicker
            columns={columnas}
            value={visibles}
            onValueChange={setVisibles}
          />
        </FilterBar>

        <Table
          minWidth={980}
          footer={(
            <Pagination>
              <PaginationStatus
                from={desde + 1}
                to={desde + aLaVista.length}
                total={lista.length}
                noun={['actividad', 'actividades']}
              />
              <PaginationPrev disabled={pagina === 0} onClick={() => setPagina(p => p - 1)} />
              <PaginationNext disabled={!hayMas} onClick={() => setPagina(p => p + 1)} />
            </Pagination>
          )}
        >
          <TableHeader>
            <TableRow>
              <TableHead>Actividad</TableHead>
              {ver('estudiantes') && <TableHead>Estudiantes</TableHead>}
              {ver('docente') && <TableHead>Docente</TableHead>}
              {ver('estado') && <TableHead>Estado</TableHead>}
              {ver('corregidas') && <TableHead className="text-right">Corregidas</TableHead>}
              {ver('entregas') && <TableHead className="text-right">Entregas</TableHead>}
              {ver('acciones') && <TableHead><span className="sr-only">Acciones</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {aLaVista.map(a => (
              <TableRow key={a.nombre} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{a.nombre}</TableTitle>
                  <TableHint>{a.espacio}</TableHint>
                </TableCell>
                {ver('estudiantes') && <TableCell><AvatarGroup people={a.estudiantes} /></TableCell>}
                {ver('docente') && (
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <Avatar name={a.docente.name} src={a.docente.src} size={24} />
                      <span className="truncate">{a.docente.name}</span>
                    </span>
                  </TableCell>
                )}
                {ver('estado') && <TableCell><Chip color={tono[a.estado as keyof typeof tono]}>{a.estado}</Chip></TableCell>}
                {ver('corregidas') && (
                  <TableNum>
                    {a.entregas ? <>{a.corregidas}<span className="text-ink-muted"> / {a.entregas}</span></> : '—'}
                  </TableNum>
                )}
                {ver('entregas') && <TableNum>{a.entregas || '—'}</TableNum>}
                {ver('acciones') && (
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
                        label={`Acciones de ${a.nombre}`}
                        size="sm"
                      />
                    )}
                  />
                </TableCell>
                )}
              </TableRow>
            ))}
            {aLaVista.length === 0 && (
              <tr>
                <td colSpan={visibles.length} className="px-6 py-10">
                  <EmptyState
                    size="sm"
                    icon="search_off"
                    title="Ninguna actividad con eso"
                    body="Probá con otras palabras, o sacá alguno de los filtros puestos."
                    action={<FilterReset onClick={limpiar}>Limpiar los filtros</FilterReset>}
                  />
                </td>
              </tr>
            )}
          </TableBody>
          {aLaVista.length > 0 && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={1 + ['estudiantes', 'docente', 'estado'].filter(ver).length}>
                  Total{filtrando ? ' de lo filtrado' : ''}
                </TableCell>
                {ver('corregidas') && <TableNum>{lista.reduce((n, a) => n + a.corregidas, 0)}</TableNum>}
                {ver('entregas') && <TableNum>{lista.reduce((n, a) => n + a.entregas, 0)}</TableNum>}
                {ver('acciones') && <TableCell />}
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
      </Section>
    </Page>
  )
}
