import cls from './dashboard.module.css'
import { useEffect, useState } from 'react'
import {
  Avatar, AvatarGroup, BarChart, Button, Card, Chip, Dropdown, Folder, Icon, IconButton,
  Indicator, Link, List, ListItem, Progress, Search, Segmented, SettingsModal, Tooltip, useToast,
  count, dayAndTime, delta,
  type IconName,
} from '@milo/ui'
import { useQuieto } from './mascots/quieto'

const AR = 'America/Argentina/Buenos_Aires'

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
  { label: 'Matemática', meta: '4.º A · 18 archivos', color: undefined, avatars: [p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3)] },
  { label: 'Ciencias', meta: '5.º B · 24 archivos', color: 'var(--space-green)', avatars: [p('Franco Gil', 6), p('Hugo Paz', 8)] },
  { label: 'Lengua', meta: '6.º · 9 archivos', color: 'var(--space-purple)', avatars: [p('Irene Lopez'), p('Julián Cruz')] },
  { label: 'Sociales', meta: '5.º A · 12 archivos', color: 'var(--space-orange)', avatars: [p('Mora Tello', 2), p('Olivia Rey', 4)] },
] as const

const pendientes = [
  { icon: 'edit', color: 'orange', title: 'Corregir "El sistema solar"', hint: '24 entregas esperando' },
  { icon: 'schedule', color: 'purple', title: 'Cerrar "Fracciones equivalentes"', hint: `Vence el ${dayAndTime('2026-03-10T23:59:00-03:00', { zone: AR })}` },
  { icon: 'group_add', color: 'green', title: 'Sumar a Lengua · 6.º', hint: 'Dos aprendices pidieron entrar' },
] as const

export function Dashboard() {
  const [settings, setSettings] = useState(false)
  const [busca, setBusca] = useState('')
  const [range, setRange] = useState('semana')
  const { toast } = useToast()

  return (
    <div className={cls.div}>
      <div className={cls.div2}>
        <Search
          block
          size="md"
          value={busca}
          onValueChange={setBusca}
          placeholder="Buscar una actividad o un espacio"
          aria-label="Buscar"
          className={cls.box}
        />

        <div className={cls.div3}>
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
                className={cls.box2}
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

      <header className={cls.header}>
        <div className={cls.div4}>
          <h1 className={cls.h1}>Tu semana</h1>
          <p className={cls.p}>
            Ciencias ya está al día. Lo que falta mirar está en Matemática y Lengua.
          </p>
        </div>
        <div className={cls.div5}>
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

      <div className={cls.div6}>
        <Stat label="Entregas" value={count(79)} delta={delta(12, { percent: true })} icon="inbox" />
        <Stat label="Corregidas" value={count(67)} delta={delta(8, { percent: true })} icon="check_circle" />
        <Stat label="Sin mirar" value={count(12)} delta={delta(-3)} icon="schedule" tone="warn" />
        <Stat label="Estudiantes" value={count(96)} delta={delta(4)} icon="group" />
      </div>

      <div className={cls.div7}>
        <div className={cls.div8}>
          <Card className={cls.card}>
            <div className={cls.div9}>
              <div>
                <h2 className={cls.h2}>Corregidas sobre entregadas</h2>
                <p className={cls.p2}>El azul es lo corregido; el gris, lo que entró</p>
              </div>
              <Chip size="sm" color="ok" icon="trending_up">84%</Chip>
            </div>
            <BarChart
              title="Corregidas sobre entregadas"
              data={range === 'semana' ? week : month}
              highlight={range === 'semana' ? 2 : 3}
              height={180}
            />
          </Card>

          <section className={cls.section}>
            <div className={cls.div10}>
              <h2 className={cls.h22}>Tus espacios</h2>
              <Link href="#folder" className={cls.link}>Ver todos</Link>
            </div>
            <div className={cls.div11}>
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

        <div className={cls.div12}>
          <Otto />
          <Card surface="muted" className={cls.card2}>
            <div className={cls.div13}>
              <div className={cls.div14}>
                <h2 className={cls.h23}>Para hoy</h2>
                <Link href="#list" className={cls.link2}>Ver todas</Link>
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

            <div className={cls.div15}>
              <h2 className={cls.h24}>Cómo va cada espacio</h2>
              <Progress label="Matemática · 4.º A" value={11} max={18} hint="11/18" />
              <Progress label="Ciencias · 5.º B" value={24} max={24} hint="listo" tone="ok" />
              <Progress label="Sociales · 5.º A" value={3} max={7} hint="3/7" />
              <Progress label="Lengua · 6.º" value={0} max={12} hint="sin entregas" />
            </div>

            <div className={cls.div16}>
              <AvatarGroup size={24} people={[p('Ana Pérez', 1), p('Bruno Díaz', 2), p('Carla Sosa', 3), p('Elena Vega', 5)]} />
              <span className={cls.span}>96 estudiantes en total</span>
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
        { label: '"Fracciones equivalentes" vence mañana', icon: 'schedule', onSelect: () => {} },
        { label: 'Marcar todo como leído', icon: 'check', onSelect: () => {} },
      ]}
    />
  )
}

/** Lo que dura una pasada del bucle: 100 cuadros a 12 por segundo. */
const PASADA = 8333

/**
 * Que salga pegado al borde derecho de la tarjeta no es una preferencia: el
 * recorte lo deja cortado por donde estaba el canto, así que su borde izquierdo
 * tiene que caer sobre uno. Y solo en pantalla ancha, que es cuando sobra lugar
 * a la derecha de la grilla.
 *
 * Se asoma una vez y se esconde un rato largo al azar. En bucle continuo deja
 * de ser una aparición y pasa a ser algo que se mueve al costado mientras
 * trabajás, que es lo que hay que evitar.
 */
function Otto() {
  const quieto = useQuieto()
  const [vuelta, setVuelta] = useState(0)
  const [asomado, setAsomado] = useState(false)

  useEffect(() => {
    if (quieto) return
    let reloj: ReturnType<typeof setTimeout>
    const asomar = () => {
      setVuelta(v => v + 1)
      setAsomado(true)
      reloj = setTimeout(esconder, PASADA)
    }
    const esconder = () => {
      setAsomado(false)
      reloj = setTimeout(asomar, 40000 + Math.random() * 80000)
    }
    reloj = setTimeout(asomar, 6000)
    return () => clearTimeout(reloj)
  }, [quieto])

  if (quieto || !asomado) return null
  return (
    <img
      key={vuelta}
      src="/mascotas/otto-anima.webp"
      alt=""
      className={cls.img}
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
    <Card className={cls.card3}>
      <div className={cls.div17}>
        <span className={cls.span2}>{label}</span>
        <Icon name={icon} size={16} className="icon-muted" />
      </div>
      <div className={cls.div18}>
        <span className={`${cls.span3} tabular`}>{value}</span>
        <span className={tone === 'ok' ? cls.ok : cls.span4}>{delta}</span>
      </div>
    </Card>
  )
}
