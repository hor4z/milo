import cls from './intro.module.css'
import { Stack } from './kit'
import { Alert } from '@milo/ui/alert'
import { Avatar } from '@milo/ui/avatar'
import { Button } from '@milo/ui/button'
import { Card } from '@milo/ui/card'
import { BarChart } from '@milo/ui/chart'
import { Chip } from '@milo/ui/chip'
import { Icon, type IconName } from '@milo/ui/icon'
import { Progress } from '@milo/ui/progress'
import { Switch } from '@milo/ui/switch'
import { TextField } from '@milo/ui/text-field'
import { useState } from 'react'

const face = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`

const shortcuts: { id: string; icon: IconName; title: string; body: string }[] = [
  { id: 'accessibility', icon: 'accessibility', title: 'Accesibilidad', body: 'Contraste, teclado y lectores, que es lo que hay que leer antes de tocar nada.' },
  { id: 'color', icon: 'palette', title: 'Color', body: 'Una rampa casi neutra y cuatro familias acotadas.' },
  { id: 'dashboard', icon: 'dashboard', title: 'Dashboard', body: 'Las piezas de la app, juntas en una pantalla real.' },
  { id: 'documento', icon: 'description', title: 'Documento', body: 'Las del editor, juntas en una consigna de verdad.' },
]

export function Intro({ go }: { go: (id: string) => void }) {
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
              Cada pieza de acá es el componente real, con su teclado, sus estados y sus tests. Se
              importa una por una: <code className={cls.inlineCode}>@milo/ui/button</code>.
            </p>
          </Stack>

          <div className={cls.heroActions}>
            <Button variant="brand" iconStart={<Icon name="arrow_forward" />} onClick={() => go('accessibility')}>Ver los fundamentos</Button>
            <Button variant="muted" iconStart={<Icon name="dashboard" />} onClick={() => go('dashboard')}>Ver el dashboard</Button>
            <Button variant="muted" iconStart={<Icon name="description" />} onClick={() => go('documento')}>Ver un documento</Button>
          </div>

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
          <Button size="sm" variant="ghost" iconEnd={<Icon name="chevron_right" />} onClick={() => go('button')}>Ver todas</Button>
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
              <Progress label="Corregidas" value={18} max={24} >
                <Progress.Hint>18 de 24</Progress.Hint>
              </Progress>
            </Card>

            <Card className={cls.peopleCard}>
              <div className={cls.peopleRow}>
                <Avatar.Group people={[
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
          <Alert.Title>Todo lo de arriba es el componente real: tocalo.</Alert.Title>
        </Alert>
      </section>

    </div>
  )
}
