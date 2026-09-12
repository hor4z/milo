import {
  Alert, AlertTitle, AvatarGroup, Badge, BarChart, Button, Card, Chip, Icon,
  Progress, Switch, TextField, type IconName,
} from '@melu/ui'
import { useState } from 'react'

const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const atajos: { id: string; icon: IconName; title: string; body: string }[] = [
  { id: 'foundations', icon: 'target', title: 'Principios', body: 'Las seis decisiones de las que sale todo lo demás.' },
  { id: 'color', icon: 'palette', title: 'Color', body: 'Una rampa casi neutra y tres familias acotadas.' },
  { id: 'button', icon: 'touch_app', title: 'Componentes', body: 'Cada una con su teclado, sus estados y sus tests.' },
  { id: 'dashboard', icon: 'dashboard', title: 'Dashboard', body: 'Todo junto, funcionando en una pantalla real.' },
]

export function Intro({ go, piezas }: { go: (id: string) => void; piezas: number }) {
  const [demo, setDemo] = useState(true)

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="pointer-events-none absolute inset-0 opacity-[0.55]">
          <div className="absolute -top-24 -right-16 size-72 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 size-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-7 px-9 py-11">
          <Badge tone="info" icon="bolt" className="self-start">Instrument Sans · Material Symbols · Tailwind v4</Badge>

          <div className="flex flex-col gap-4">
            <h1 className="max-w-[20ch] text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.04] font-bold tracking-tight text-ink">
              El sistema de melu, funcionando
            </h1>
            <p className="max-w-[62ch] text-base font-medium text-ink-muted">
              No es una lámina de estilos: cada pieza de acá es el componente real, con su teclado, sus
              estados y sus tests. Lo que se decide en este kit se porta a <code className="font-mono text-xs text-ink">packages/ui</code>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="solid" icon="arrow_forward" onClick={() => go('foundations')}>Ver los principios</Button>
            <Button variant="raised" icon="dashboard" onClick={() => go('dashboard')}>Ver el dashboard</Button>
          </div>

          <dl className="mt-1 flex flex-wrap gap-x-9 gap-y-3 border-t border-line pt-6">
            {[[String(piezas), 'piezas'], ['195', 'tests'], ['160', 'iconos'], ['2', 'temas']].map(([n, l]) => (
              <div key={l} className="flex items-baseline gap-2">
                <dt className="tabular text-lg font-bold text-ink">{n}</dt>
                <dd className="text-xs font-medium text-ink-muted">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {atajos.map(a => (
          <button
            key={a.id}
            onClick={() => go(a.id)}
            className="group flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 text-left transition-[background-color,box-shadow] hover:bg-muted"
          >
            <span className="inset-relief flex size-9 items-center justify-center rounded-xl bg-muted">
              <Icon name={a.icon} size={20} className="icon-muted" />
            </span>
            <span className="flex items-center gap-1 text-base font-semibold text-ink">
              {a.title}
              <Icon name="chevron_right" size={16} className="icon-muted transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="text-xs font-medium text-ink-muted">{a.body}</span>
          </button>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Una muestra</h2>
            <p className="max-w-[70ch] text-xs font-medium text-ink-muted">
              Las mismas piezas que hay en el riel, apoyadas juntas. Si algo de acá no se ve como el resto,
              es un bug del sistema y no de la pantalla.
            </p>
          </div>
          <Button size="sm" variant="ghost" iconEnd="chevron_right" onClick={() => go('button')}>Ver todas</Button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
          <Card className="flex flex-col gap-4 p-5">
            <BarChart
              title="Corregidas esta semana"
              height={150}
              highlight={2}
              data={[
                { label: 'Lun', value: 18, total: 24 },
                { label: 'Mar', value: 6, total: 14 },
                { label: 'Mié', value: 27, total: 29 },
                { label: 'Jue', value: 16, total: 32 },
                { label: 'Vie', value: 17, total: 17 },
              ]}
            />
          </Card>

          <div className="flex flex-col gap-3">
            <Card className="flex flex-col gap-4 p-5">
              <TextField size="md" icon="search" placeholder="Buscar una actividad…" />
              <div className="flex flex-wrap items-center gap-2">
                <Chip color="green">Abierta</Chip>
                <Chip color="blue">Corregida</Chip>
                <Badge tone="warn" icon="schedule">Vence mañana</Badge>
              </div>
              <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
            </Card>

            <Card className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-2.5">
                <AvatarGroup people={[
                  { name: 'Ana Pérez', src: cara(1) },
                  { name: 'Bruno Díaz', src: cara(2) },
                  { name: 'Carla Sosa', src: cara(3) },
                ]} />
                <span className="text-2xs font-medium text-ink-muted">tres entregaron</span>
              </div>
              <Switch checked={demo} onChange={setDemo} label="Avisos" />
            </Card>
          </div>
        </div>

        <Alert tone="ok">
          <AlertTitle>Todo lo de arriba es el componente real: tocalo.</AlertTitle>
        </Alert>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Lo que no es</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['No es una librería publicada', 'Los paquetes son privados y las apps consumen el .tsx directo, sin build intermedio.'],
            ['No tiene backend', 'Nada persiste salvo las preferencias, y el tema vive en localStorage.'],
            ['No es un clon terminado', 'De la referencia salieron medidas y recetas de sombra; el resto se resolvió con criterio propio.'],
          ].map(([t, d]) => (
            <div key={t} className="flex flex-col gap-2 rounded-2xl border border-line border-dashed p-5">
              <span className="text-xs font-semibold text-ink">{t}</span>
              <span className="text-2xs font-medium text-ink-muted">{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
