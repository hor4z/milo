import { useState } from 'react'
import {
  Avatar, AvatarGroup, BarChart, Badge, Button, Card, Chip, Icon, IconButton, Progress,
  Segmented, Table, TableBody, TableCell, TableHead, TableHeader, TableHint, TableNum,
  TableRow, TableTitle, Tooltip, useToast, type IconName,
} from '@melu/ui'

const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const p = (name: string, foto?: number) => ({ name, src: foto ? cara(foto) : undefined })

const semana = [
  { label: 'Lun', value: 18, total: 24, caption: 'Corregidas ese día' },
  { label: 'Mar', value: 6, total: 14, caption: 'Corregidas ese día' },
  { label: 'Mié', value: 27, total: 29, caption: 'Corregidas ese día' },
  { label: 'Jue', value: 16, total: 32, caption: 'Corregidas ese día' },
  { label: 'Vie', value: 17, total: 17, caption: 'Corregidas ese día' },
]

const mes = [
  { label: 'S1', value: 61, total: 84 }, { label: 'S2', value: 74, total: 91 },
  { label: 'S3', value: 38, total: 77 }, { label: 'S4', value: 84, total: 96 },
]

const filas = [
  { nombre: 'Fracciones equivalentes', espacio: 'Matemática · 4.º A', estado: 'Abierta', gente: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Elena Vega', 5)], hechas: 11, total: 18 },
  { nombre: 'El sistema solar', espacio: 'Ciencias · 5.º B', estado: 'Corregida', gente: [p('Franco Gil', 6), p('Gabriela Mota', 7), p('Hugo Paz', 8)], hechas: 24, total: 24 },
  { nombre: 'Cuento policial', espacio: 'Lengua · 6.º', estado: 'Borrador', gente: [p('Irene Lopez'), p('Julián Cruz')], hechas: 0, total: 0 },
  { nombre: 'Mapa de América', espacio: 'Sociales · 5.º A', estado: 'Abierta', gente: [p('Mora Tello', 2), p('Nico Arce'), p('Olivia Rey', 4)], hechas: 3, total: 7 },
]

const tono = { Abierta: 'green', Corregida: 'blue' } as const

export function Dashboard() {
  const [rango, setRango] = useState('semana')
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-display font-bold tracking-tight text-ink">Tu semana</h1>
          <p className="text-base font-medium text-ink-muted">
            Cuatro espacios, 79 entregas y 12 sin mirar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            size="sm"
            value={rango}
            onChange={setRango}
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
              <h2 className="text-base font-semibold text-ink">Corregidas sobre entregadas</h2>
              <p className="text-xs font-medium text-ink-muted">El azul es lo corregido; el gris, lo que entró</p>
            </div>
            <Badge tone="ok" icon="trending_up">84%</Badge>
          </div>
          <BarChart
            title="Corregidas sobre entregadas"
            data={rango === 'semana' ? semana : mes}
            highlight={rango === 'semana' ? 2 : 3}
            height={200}
          />
        </Card>

        <Card className="flex flex-col gap-5 p-6">
          <h2 className="text-base font-semibold text-ink">Cómo va cada espacio</h2>
          <div className="flex flex-col gap-4">
            <Progress label="Matemática · 4.º A" value={11} max={18} hint="11/18" />
            <Progress label="Ciencias · 5.º B" value={24} max={24} hint="listo" tone="ok" />
            <Progress label="Sociales · 5.º A" value={3} max={7} hint="3/7" />
            <Progress label="Lengua · 6.º" value={0} max={12} hint="sin entregas" />
          </div>
          <div className="mt-auto flex items-center gap-2.5 border-t border-line pt-4">
            <AvatarGroup size={24} people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Elena Vega', 5)]} />
            <span className="text-2xs font-medium text-ink-muted">96 estudiantes en total</span>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <h2 className="text-base font-semibold text-ink">Últimas actividades</h2>
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
            {filas.map(f => (
              <TableRow key={f.nombre} onClick={() => {}}>
                <TableCell>
                  <TableTitle>{f.nombre}</TableTitle>
                  <TableHint>{f.espacio}</TableHint>
                </TableCell>
                <TableCell><AvatarGroup people={f.gente} /></TableCell>
                <TableCell><Chip color={tono[f.estado as keyof typeof tono]}>{f.estado}</Chip></TableCell>
                <TableNum>{f.total ? <>{f.hechas}<span className="text-ink-muted"> / {f.total}</span></> : '—'}</TableNum>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'Valeria Ochoa', foto: 7, rol: 'Matemática · 4.º A', pend: 7 },
          { name: 'Martín Roldán', foto: 6, rol: 'Ciencias · 5.º B', pend: 0 },
          { name: 'Nadia Britos', rol: 'Sociales · 5.º A', pend: 4 },
        ].map(d => (
          <Card key={d.name} className="flex items-center gap-3 p-4">
            <Avatar name={d.name} src={d.foto ? cara(d.foto) : undefined} size={38} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-ink">{d.name}</span>
              <span className="truncate text-2xs font-medium text-ink-muted">{d.rol}</span>
            </div>
            {d.pend > 0
              ? <Badge>{d.pend}</Badge>
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
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        <Icon name={icon} size={16} className="icon-muted" />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="tabular text-display font-bold tracking-tight text-ink">{value}</span>
        <span className={tone === 'ok' ? 'text-2xs font-semibold text-ok' : 'text-2xs font-semibold text-warn'}>{delta}</span>
      </div>
    </Card>
  )
}
