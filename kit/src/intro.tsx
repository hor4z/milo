import cls from './intro.module.css'
import { Stack } from './kit'
import {
  Alert, AlertTitle, AvatarGroup, BarChart, Button, Card, Chip, Icon,
  Progress, Switch, TextField, type IconName,
} from '@milo/ui'
import { useState } from 'react'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const shortcuts: { id: string; icon: IconName; title: string; body: string }[] = [
  { id: 'principles', icon: 'target', title: 'Principios', body: 'Las seis decisiones de las que sale todo lo demás.' },
  { id: 'color', icon: 'palette', title: 'Color', body: 'Una rampa casi neutra y cuatro familias acotadas.' },
  { id: 'dashboard', icon: 'dashboard', title: 'Dashboard', body: 'Las piezas de la app, juntas en una pantalla real.' },
  { id: 'documento', icon: 'description', title: 'Documento', body: 'Las del editor, juntas en una consigna de verdad.' },
]

export function Intro({ go, views }: { go: (id: string) => void; views: number }) {
  const [demo, setDemo] = useState(true)

  return (
    <div className={cls.intro}>
      <section className={`${cls.hero} bg-surface`}>
        <div className={cls.heroGlow}>
          <div className={cls.heroGlowTop} />
          <div className={cls.heroGlowBottom} />
        </div>

        <div className={cls.heroContent}>
          <Chip size="sm" color="info" icon="bolt" className={cls.heroChip}>Inter · Material Symbols · CSS nativo</Chip>

          <Stack gap="lg">
            <h1 className={cls.heroTitle}>
              El sistema de milo, funcionando
            </h1>
            <p className={cls.heroLead}>
              No es una lámina de estilos: cada pieza de acá es el componente real, con su teclado, sus
              estados y sus tests. El repo entero es un paquete: <code className={cls.inlineCode}>@milo/ui</code>.
            </p>
          </Stack>

          <div className={cls.heroActions}>
            <Button variant="solid" icon="arrow_forward" onClick={() => go('principles')}>Ver los principios</Button>
            <Button variant="raised" icon="dashboard" onClick={() => go('dashboard')}>Ver el dashboard</Button>
            <Button variant="raised" icon="description" onClick={() => go('documento')}>Ver un documento</Button>
          </div>

          <dl className={cls.statList}>
            {[[String(views), 'vistas'], ['687', 'tests'], ['172', 'iconos'], ['2', 'temas']].map(([n, l]) => (
              <div key={l} className={cls.statItem}>
                <dt className={`${cls.statValue} tabular`}>{n}</dt>
                <dd className={cls.statLabel}>{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={cls.shortcutGrid}>
        {shortcuts.map(a => (
          <button
            key={a.id}
            onClick={() => go(a.id)}
            className={`${cls.shortcutCard} group bg-surface`}
          >
            <span className={`${cls.shortcutBadge} inset-relief`}>
              <Icon name={a.icon} size={20} className="icon-muted" />
            </span>
            <span className={cls.shortcutTitle}>
              {a.title}
              <Icon name="chevron_right" size={16} className={`${cls.shortcutChevron} icon-muted`} />
            </span>
            <span className={cls.shortcutBody}>{a.body}</span>
          </button>
        ))}
      </section>

      <section className={cls.showcase}>
        <div className={cls.showcaseHeader}>
          <Stack gap="sm">
            <h2 className={cls.showcaseTitle}>Una muestra</h2>
            <p className={cls.showcaseLead}>
              Las mismas piezas que hay en el riel, apoyadas juntas. Si algo de acá no se ve como el resto,
              es un bug del sistema y no de la pantalla.
            </p>
          </Stack>
          <Button size="sm" variant="ghost" iconEnd="chevron_right" onClick={() => go('button')}>Ver todas</Button>
        </div>

        <div className={cls.showcaseGrid}>
          <Card className={cls.chartCard}>
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

          <Stack>
            <Card className={cls.chipCard}>
              <TextField size="md" icon="search" placeholder="Buscar una actividad…" />
              <div className={cls.chipRow}>
                <Chip color="green">Abierta</Chip>
                <Chip color="blue">Corregida</Chip>
                <Chip size="sm" color="warn" icon="schedule">Vence mañana</Chip>
              </div>
              <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
            </Card>

            <Card className={cls.peopleCard}>
              <div className={cls.peopleRow}>
                <AvatarGroup people={[
                  { name: 'Ana Pérez', src: face(1) },
                  { name: 'Bruno Díaz', src: face(2) },
                  { name: 'Carla Sosa', src: face(3) },
                ]} />
                <span className={cls.peopleNote}>tres entregaron</span>
              </div>
              <Switch checked={demo} onChange={setDemo} label="Avisos" />
            </Card>
          </Stack>
        </div>

        <Alert tone="ok">
          <AlertTitle>Todo lo de arriba es el componente real: tocalo.</AlertTitle>
        </Alert>
      </section>

      <section className={cls.notSection}>
        <h2 className={cls.notTitle}>Lo que no es</h2>
        <div className={cls.notGrid}>
          {[
            ['No está en npm', 'El repo es privado y se instala desde GitHub por su tag. El paquete es el repo entero.'],
            ['No tiene backend', 'Nada persiste salvo las preferencias, y el tema vive en localStorage.'],
            ['No es un clon terminado', 'De la referencia salieron medidas y recetas de sombra; el resto se resolvió con criterio propio.'],
          ].map(([t, d]) => (
            <div key={t} className={cls.notItem}>
              <span className={cls.notName}>{t}</span>
              <span className={cls.notBody}>{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
