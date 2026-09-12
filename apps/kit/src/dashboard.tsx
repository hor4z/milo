import { useState } from 'react'
import {
  Avatar, AvatarGroup, BarChart, Badge, Button, Card, Chip, Folder, Icon, IconButton, List,
  ListItem, Progress, Segmented, Table, TableBody, TableCell, TableHead, TableHeader,
  TableHint, TableNum, TableRow, TableTitle, Tooltip, useToast, type IconName,
} from '@milo/ui'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const p = (name: string, photo?: number) => ({ name, src: photo ? face(photo) : undefined })

const week = [
  { label: 'Lun', value: 18, total: 24, caption: 'Corregidas ese día' },
  { label: 'Mar', value: 6, total: 14, caption: 'Corregidas ese día' },
  { label: 'Mié', value: 27, total: 29, caption: 'Corregidas ese día' },
  { label: 'Jue', value: 16, total: 32, caption: 'Corregidas ese día' },
  { label: 'Vie', value: 17, total: 17, caption: 'Corregidas ese día' },
]

const month = [
  { label: 'S1', value: 61, total: 84 }, { label: 'S2', value: 74, total: 91 },
  { label: 'S3', value: 38, total: 77 }, { label: 'S4', value: 84, total: 96 },
]

const rows = [
  { name: 'Fracciones equivalentes', space: 'Matemática · 4.º A', status: 'Abierta', people: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Elena Vega', 5)], done: 11, total: 18 },
  { name: 'El sistema solar', space: 'Ciencias · 5.º B', status: 'Corregida', people: [p('Franco Gil', 6), p('Gabriela Mota', 7), p('Hugo Paz', 8)], done: 24, total: 24 },
  { name: 'Cuento policial', space: 'Lengua · 6.º', status: 'Borrador', people: [p('Irene Lopez'), p('Julián Cruz')], done: 0, total: 0 },
  { name: 'Mapa de América', space: 'Sociales · 5.º A', status: 'Abierta', people: [p('Mora Tello', 2), p('Nico Arce'), p('Olivia Rey', 4)], done: 3, total: 7 },
]

const tone = { 'Abierta': 'green', 'Corregida': 'blue' } as const

const espacios = [
  { label: 'Matemática', meta: '4.º A · 18 archivos', color: 'var(--space-blue)', avatars: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3)] },
  { label: 'Ciencias', meta: '5.º B · 24 archivos', color: 'var(--space-green)', avatars: [p('Franco Gil', 6), p('Hugo Paz', 8)] },
  { label: 'Lengua', meta: '6.º · 9 archivos', color: 'var(--space-purple)', avatars: [p('Irene Lopez'), p('Julián Cruz')] },
  { label: 'Sociales', meta: '5.º A · 12 archivos', color: 'var(--space-orange)', avatars: [p('Mora Tello', 2), p('Olivia Rey', 4)] },
] as const

const pendientes = [
  { icon: 'edit', color: 'orange', title: 'Corregir «El sistema solar»', hint: '24 entregas esperando', count: '24' },
  { icon: 'schedule', color: 'purple', title: 'Cerrar «Fracciones equivalentes»', hint: 'Vence mañana a las 23:59', count: '7' },
  { icon: 'group_add', color: 'green', title: 'Sumar a Lengua · 6.º', hint: 'Dos aprendices pidieron entrar', count: '2' },
] as const

export function Dashboard() {
  const [range, setRange] = useState('semana')
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold text-ink">Tu semana</h1>
          <p className="text-reading font-medium text-ink-muted">
            Cuatro espacios, 79 entregas y 12 sin mirar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            size="sm"
            label="Rango"
            value={range}
            onChange={setRange}
            options={[{ value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mes' }]}
          />
          <Tooltip label="Exportar a CSV">
            <IconButton icon="download" label="Exportar" size="sm" variant="raised" />
          </Tooltip>
          <Button
            size="sm"
            variant="solid"
            icon="add"
            onClick={() => toast({ title: 'Actividad creada', body: 'Quedó en borrador', tone: 'ok' })}
          >
            Nueva actividad
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Entregas" value="79" delta="+12%" icon="inbox" />
        <Stat label="Corregidas" value="67" delta="+8%" icon="check_circle" />
        <Stat label="Sin mirar" value="12" delta="-3" icon="schedule" tone="warn" />
        <Stat label="Estudiantes" value="96" delta="+4" icon="group" />
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-reading font-semibold text-ink">Corregidas sobre entregadas</h2>
              <p className="text-body font-medium text-ink-muted">El azul es lo corregido; el gris, lo que entró</p>
            </div>
            <Badge tone="ok" icon="trending_up">84%</Badge>
          </div>
          <BarChart
            title="Corregidas sobre entregadas"
            data={range === 'semana' ? week : month}
            highlight={range === 'semana' ? 2 : 3}
            height={200}
          />
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <h2 className="text-reading font-semibold text-ink">Cómo va cada espacio</h2>
          <div className="flex flex-col gap-4">
            <Progress label="Matemática · 4.º A" value={11} max={18} hint="11/18" />
            <Progress label="Ciencias · 5.º B" value={24} max={24} hint="listo" tone="ok" />
            <Progress label="Sociales · 5.º A" value={3} max={7} hint="3/7" />
            <Progress label="Lengua · 6.º" value={0} max={12} hint="sin entregas" />
          </div>
          <div className="mt-auto flex items-center gap-2 border-t border-line pt-4">
            <AvatarGroup size={24} people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Elena Vega', 5)]} />
            <span className="text-meta font-medium text-ink-muted">96 estudiantes en total</span>
          </div>
        </Card>
      </div>

      {/* Los espacios y lo que hay que hacer: las dos piezas que mejor cuentan de
          qué se trata el producto, y las dos que el dashboard no mostraba. La
          lista va sin contenedor propio —las filas son el papel— así que se
          apoya directo sobre el escritorio, al lado de las carpetas. */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-reading font-semibold text-ink">Tus espacios</h2>
            <Button size="sm" variant="ghost" iconEnd="chevron_right">Ver todos</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {espacios.map(e => (
              <Folder
                key={e.label}
                size={104}
                label={e.label}
                meta={e.meta}
                color={e.color}
                avatars={e.avatars}
                onClick={() => {}}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-reading font-semibold text-ink">Para hoy</h2>
            <Chip color="orange" icon="bolt">3 sin hacer</Chip>
          </div>
          <List>
            {pendientes.map(t => (
              <ListItem
                key={t.title}
                icon={t.icon}
                color={t.color}
                title={t.title}
                hint={t.hint}
                onClick={() => {}}
                trailing={<Badge tone="neutral">{t.count}</Badge>}
              />
            ))}
          </List>
        </section>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="text-reading font-semibold text-ink">Últimas actividades</h2>
          <Button size="sm" variant="ghost" iconEnd="chevron_right">Ver todas</Button>
        </div>
        <Table minWidth={720} className="rounded-none border-0 ring-0">
          <TableHeader>
            <TableRow>
              <TableHead>Actividad</TableHead>
              <TableHead>Estudiantes</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Corregidas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(f => (
              <TableRow key={f.name} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{f.name}</TableTitle>
                  <TableHint>{f.space}</TableHint>
                </TableCell>
                <TableCell><AvatarGroup people={f.people} /></TableCell>
                <TableCell><Chip color={tone[f.status as keyof typeof tone]}>{f.status}</Chip></TableCell>
                <TableNum>{f.total ? <>{f.done}<span className="text-ink-muted"> / {f.total}</span></> : '—'}</TableNum>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Valeria Ochoa', photo: 7, role: 'Matemática · 4.º A', pending: 7 },
          { name: 'Martín Roldán', photo: 6, role: 'Ciencias · 5.º B', pending: 0 },
          { name: 'Nadia Britos', role: 'Sociales · 5.º A', pending: 4 },
        ].map(d => (
          <Card key={d.name} className="flex items-center gap-3 p-4">
            <Avatar name={d.name} src={d.photo ? face(d.photo) : undefined} size={38} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-body font-semibold text-ink">{d.name}</span>
              <span className="truncate text-meta font-medium text-ink-muted">{d.role}</span>
            </div>
            {d.pending > 0
              ? <Badge>{d.pending}</Badge>
              : <Badge tone="ok" icon="check">al día</Badge>}
          </Card>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, delta, icon, tone = 'ok' }: {
  label: string
  value: string
  delta: string
  icon: IconName
  tone?: 'ok' | 'warn'
}) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-body font-medium text-ink-muted">{label}</span>
        <Icon name={icon} size={16} className="icon-muted" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="tabular text-display font-bold text-ink">{value}</span>
        <span className={tone === 'ok' ? 'text-meta font-semibold text-ok-ink' : 'text-meta font-semibold text-warn-ink'}>{delta}</span>
      </div>
    </Card>
  )
}
