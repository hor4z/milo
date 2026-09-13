import { useState } from 'react'
import {
  Avatar, AvatarGroup, BarChart, Badge, Button, Card, Dropdown, Folder, Icon, IconButton,
  Indicator, Link, List, ListItem, Progress, Search, Segmented, SettingsModal, Tooltip, useToast,
  type IconName,
} from '@milo/ui'
import { useQuieto } from './mascots/reglas'

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

const yo = {
  name: 'Valeria Ochoa',
  email: 'valeria.ochoa@ejemplo.edu',
  alias: 'Profe Vale',
  school: 'Escuela N.º 12 · Turno mañana',
}

const espacios = [
  // Sin color: el ámbar de manila es el default de la pieza, y el azul de un
  // espacio compite con el azul primario, que ya significa otra cosa.
  { label: 'Matemática', meta: '4.º A · 18 archivos', color: undefined, avatars: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3)] },
  { label: 'Ciencias', meta: '5.º B · 24 archivos', color: 'var(--space-green)', avatars: [p('Franco Gil', 6), p('Hugo Paz', 8)] },
  { label: 'Lengua', meta: '6.º · 9 archivos', color: 'var(--space-purple)', avatars: [p('Irene Lopez'), p('Julián Cruz')] },
  { label: 'Sociales', meta: '5.º A · 12 archivos', color: 'var(--space-orange)', avatars: [p('Mora Tello', 2), p('Olivia Rey', 4)] },
] as const

const pendientes = [
  { icon: 'edit', color: 'orange', title: 'Corregir «El sistema solar»', hint: '24 entregas esperando' },
  { icon: 'schedule', color: 'purple', title: 'Cerrar «Fracciones equivalentes»', hint: 'Vence mañana a las 23:59' },
  { icon: 'group_add', color: 'green', title: 'Sumar a Lengua · 6.º', hint: 'Dos aprendices pidieron entrar' },
] as const

export function Dashboard() {
  const [settings, setSettings] = useState(false)
  const [busca, setBusca] = useState('')
  const [range, setRange] = useState('semana')
  const { toast } = useToast()

  return (
    <div className="flex flex-col gap-6">
      {/* La barra de la pantalla: el buscador a la izquierda, los avisos y la
          cuenta a la derecha. Mide lo que dice `--topbar-h` y se despega del
          contenido con una línea, no con relieve — es el borde de la página,
          no una pieza apoyada encima. */}
      <div className="-mx-5 -mt-5 mb-2 flex h-20 items-center gap-4 border-b border-line px-5">
        <Search
          size="md"
          value={busca}
          onValueChange={setBusca}
          placeholder="Buscar una actividad o un espacio"
          aria-label="Buscar"
          className="w-full max-w-[320px]"
        />

        <div className="ml-auto flex items-center gap-2">
          <Avisos />
          <Dropdown
            align="end"
            width={224}
            trigger={({ onClick, ref, 'aria-expanded': expanded }) => (
              <button
                ref={ref}
                type="button"
                onClick={onClick}
                aria-expanded={expanded}
                aria-label={`Cuenta de ${yo.name}`}
                className="flex items-center gap-2 rounded-full transition-shadow duration-fast ease-out hover:shadow-card"
              >
                <Avatar name={yo.name} src={face(4)} size={34} />
              </button>
            )}
            items={[
              { label: 'Ajustes', icon: 'settings', shortcut: ',', onSelect: () => setSettings(true) },
              { label: 'Mis espacios', icon: 'folder', onSelect: () => {} },
              { label: 'Ayuda', icon: 'help', onSelect: () => {} },
              { label: 'Cerrar sesión', icon: 'logout', danger: true, onSelect: () => {} },
            ]}
          />
        </div>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-display font-bold text-ink">Tu semana</h1>
          <p className="text-reading font-medium text-ink-muted">
            Ciencias ya está al día. Lo que falta mirar está en Matemática y Lengua.
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
            <IconButton icon="download" label="Exportar" size="sm" variant="muted" />
          </Tooltip>
          <Button
            size="sm"
            variant="brand"
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

      {/* `items-start`: sin esto el chart se estira para igualar a la de al lado. */}
      <div className="grid items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="flex flex-col gap-6">
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
              height={180}
            />
          </Card>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-reading font-semibold text-ink">Tus espacios</h2>
              <Link href="#folder" className="text-body">Ver todos</Link>
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
        </div>

        {/* En `muted` y no en papel: adentro lleva `ListItem`s, que son papel. */}
        <div className="relative">
          <Otto />
          <Card surface="muted" className="relative flex flex-col gap-5 p-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-reading font-semibold text-ink">Para hoy</h2>
                <Link href="#list" className="text-body">Ver todas</Link>
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
                  />
                ))}
              </List>
            </div>

            <div className="flex flex-col gap-4 border-t border-line pt-5">
              <h2 className="text-reading font-semibold text-ink">Cómo va cada espacio</h2>
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
      </div>


      <SettingsModal open={settings} onClose={() => setSettings(false)} user={yo} />
    </div>
  )
}

function Avisos() {
  return (
    <Dropdown
      align="end"
      width={300}
      trigger={({ onClick, ref, 'aria-expanded': expanded }) => (
        <Indicator dot label="Hay avisos sin leer">
          <IconButton ref={ref} icon="notifications" label="Avisos" size="md" variant="ghost" onClick={onClick} aria-expanded={expanded} />
        </Indicator>
      )}
      items={[
        { label: '24 entregas sin corregir', icon: 'inbox', onSelect: () => {} },
        { label: 'Nadia Britos pidió entrar a Lengua', icon: 'person_add', onSelect: () => {} },
        { label: '«Fracciones equivalentes» vence mañana', icon: 'schedule', onSelect: () => {} },
        { label: 'Marcar todo como leído', icon: 'check', onSelect: () => {} },
      ]}
    />
  )
}

/**
 * Otto flota adelante de todo, apoyado en la esquina de la tarjeta. Va suelto y
 * sin caja: el WebP tiene alfa, así que no hay rectángulo que esconder.
 *
 * Es un `img` y no un `video`, y eso tiene un costo: no se puede pausar ni
 * frenar desde el teclado. Por eso `useQuieto` no lo atenúa, lo saca.
 */
function Otto() {
  const quieto = useQuieto()
  if (quieto) return null
  return (
    <img
      src="/mascotas/otto-anima.webp"
      alt=""
      aria-hidden
      className="pointer-events-none absolute -top-20 right-2 z-20 h-40 w-auto"
    />
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
