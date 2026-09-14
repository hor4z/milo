import cls from './intro.module.css'
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
    <div className={cls.div}>
      <section className={`${cls.section} bg-surface`}>
        <div className={cls.div2}>
          <div className={cls.div3} />
          <div className={cls.div4} />
        </div>

        <div className={cls.div5}>
          <Chip size="sm" color="info" icon="bolt" className={cls.chip}>Inter · Material Symbols · CSS nativo</Chip>

          <div className={cls.div6}>
            <h1 className={cls.h1}>
              El sistema de milo, funcionando
            </h1>
            <p className={cls.p}>
              No es una lámina de estilos: cada pieza de acá es el componente real, con su teclado, sus
              estados y sus tests. Lo que se decide acá se porta a <code className={cls.code}>packages/ui</code>.
            </p>
          </div>

          <div className={cls.div7}>
            <Button variant="solid" icon="arrow_forward" onClick={() => go('principles')}>Ver los principios</Button>
            <Button variant="raised" icon="dashboard" onClick={() => go('dashboard')}>Ver el dashboard</Button>
            <Button variant="raised" icon="description" onClick={() => go('documento')}>Ver un documento</Button>
          </div>

          <dl className={cls.dl}>
            {[[String(views), 'vistas'], ['675', 'tests'], ['172', 'iconos'], ['2', 'temas']].map(([n, l]) => (
              <div key={l} className={cls.div8}>
                <dt className={`${cls.dt} tabular`}>{n}</dt>
                <dd className={cls.dd}>{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={cls.section2}>
        {shortcuts.map(a => (
          <button
            key={a.id}
            onClick={() => go(a.id)}
            className={`${cls.box} group bg-surface`}
          >
            <span className={`${cls.span} inset-relief`}>
              <Icon name={a.icon} size={20} className="icon-muted" />
            </span>
            <span className={cls.span2}>
              {a.title}
              <Icon name="chevron_right" size={16} className={`${cls.icon2} icon-muted`} />
            </span>
            <span className={cls.span3}>{a.body}</span>
          </button>
        ))}
      </section>

      <section className={cls.section3}>
        <div className={cls.div9}>
          <div className={cls.div10}>
            <h2 className={cls.h2}>Una muestra</h2>
            <p className={cls.p2}>
              Las mismas piezas que hay en el riel, apoyadas juntas. Si algo de acá no se ve como el resto,
              es un bug del sistema y no de la pantalla.
            </p>
          </div>
          <Button size="sm" variant="ghost" iconEnd="chevron_right" onClick={() => go('button')}>Ver todas</Button>
        </div>

        <div className={cls.div11}>
          <Card className={cls.card}>
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

          <div className={cls.div12}>
            <Card className={cls.card2}>
              <TextField size="md" icon="search" placeholder="Buscar una actividad…" />
              <div className={cls.div13}>
                <Chip color="green">Abierta</Chip>
                <Chip color="blue">Corregida</Chip>
                <Chip size="sm" color="warn" icon="schedule">Vence mañana</Chip>
              </div>
              <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
            </Card>

            <Card className={cls.card3}>
              <div className={cls.div14}>
                <AvatarGroup people={[
                  { name: 'Ana Pérez', src: face(1) },
                  { name: 'Bruno Díaz', src: face(2) },
                  { name: 'Carla Sosa', src: face(3) },
                ]} />
                <span className={cls.span4}>tres entregaron</span>
              </div>
              <Switch checked={demo} onChange={setDemo} label="Avisos" />
            </Card>
          </div>
        </div>

        <Alert tone="ok">
          <AlertTitle>Todo lo de arriba es el componente real: tocalo.</AlertTitle>
        </Alert>
      </section>

      <section className={cls.section4}>
        <h2 className={cls.h22}>Lo que no es</h2>
        <div className={cls.div15}>
          {[
            ['No es una librería publicada', 'Los paquetes son privados y las apps consumen el .tsx directo, sin build intermedio.'],
            ['No tiene backend', 'Nada persiste salvo las preferencias, y el tema vive en localStorage.'],
            ['No es un clon terminado', 'De la referencia salieron medidas y recetas de sombra; el resto se resolvió con criterio propio.'],
          ].map(([t, d]) => (
            <div key={t} className={cls.div16}>
              <span className={cls.span5}>{t}</span>
              <span className={cls.span6}>{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
