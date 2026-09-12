import { useParams } from 'react-router-dom'
import { Page, PageHeader, EmptyState, SectionLabel, Button, Card, cx, Icon , labelColors, labelFill } from '@melu/ui'
import { ActivityCard, ActivityRow } from '../ui/activity-card'
import { activities, spaces } from '../data'

export function SavedScreen() {
  const shown = activities.filter(a => a.liked)
  return (
    <Page>
      <PageHeader title="Guardadas" subtitle="Lo que marcaste para volver. No se avisa a nadie." />
      {shown.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(a => <ActivityCard key={a.id} activity={a} />)}
        </div>
      ) : (
        <EmptyState
          icon="favorite"
          title="Todavía no guardaste nada"
          body="El corazón de una tarjeta la trae hasta acá. Sirve para juntar ideas antes de armar la próxima secuencia."
          action={<Button variant="solid" icon="explore">Ir a explorar</Button>}
        />
      )}
    </Page>
  )
}

export function ResourcesScreen() {
  const kinds = [
    { label: 'Imágenes', count: 38, icon: 'image', tint: 2 },
    { label: 'Documentos', count: 21, icon: 'menu_book', tint: 5 },
    { label: 'Audios', count: 12, icon: 'mic', tint: 6 },
    { label: 'Videos', count: 13, icon: 'layers', tint: 1 },
  ] as const

  return (
    <Page>
      <PageHeader
        title="Recursos"
        subtitle="Lo que subiste y lo que subieron los aprendices, junto."
        actions={<Button variant="solid" icon="add">Subir</Button>}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kinds.map(k => (
          <Card key={k.label} interactive className="p-4">
            {/* Marca viva, no tinte: el cuadradito es lo que te deja encontrar
                un tipo de recurso de reojo, y para eso el color tiene que verse. */}
            <span className={cx('mb-3 flex size-10 items-center justify-center rounded-xl text-on-label', labelFill[labelColors[(k.tint - 1) % labelColors.length]])}>
              <Icon name={k.icon} size={18} />
            </span>
            <div className="text-base font-medium">{k.label}</div>
            <div className="tabular mt-0.5 text-xs text-ink-subtle">{k.count} archivos</div>
          </Card>
        ))}
      </div>

      <SectionLabel>Subidos esta semana</SectionLabel>
      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
        {activities.slice(0, 5).map(a => <ActivityRow key={a.id} activity={a} />)}
      </div>
    </Page>
  )
}

export function SpaceScreen() {
  const { id } = useParams()
  const space = spaces.find(s => s.id === id)
  const shown = activities.slice(0, 6)

  return (
    <Page>
      <PageHeader
        title={space?.name ?? 'Espacio'}
        subtitle={`${space?.count ?? 0} actividades · 26 aprendices · 2 guías`}
        actions={<Button variant="solid" icon="add">Nueva actividad</Button>}
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Entregas esta semana" value="41" hint="+8 vs. la anterior" />
        <Stat label="Sin abrir" value="3" hint="hace más de 2 días" />
        <Stat label="Trabados" value="2" hint="misma fase, dos intentos" />
        <Stat label="Participación" value="92%" hint="26 de 28" />
      </div>
      <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
        {shown.map(a => <ActivityRow key={a.id} activity={a} />)}
      </div>
    </Page>
  )
}

/**
 * La métrica. El número va en `tabular` y en display: una fila de cuatro
 * métricas con números de ancho variable no se alinea, y se ve como un error.
 */
function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs text-ink-subtle">{label}</div>
      <div className="tabular mt-1 font-display text-2xl font-semibold">{value}</div>
      <div className="mt-0.5 text-2xs text-ink-subtle">{hint}</div>
    </Card>
  )
}
