import { useMemo, useState } from 'react'
import { Page, PageHeader, SectionLabel, Button, Chip, Segmented } from '@melu/ui'
import { ActivityCard, ActivityRow } from '../ui/activity-card'
import { Composer } from '../ui/composer'
import { activities } from '../data'

type View = 'grid' | 'list'
type Filter = 'todas' | 'abiertas'

export function LibraryScreen() {
  const [view, setView] = useState<View>('grid')
  const [filter, setFilter] = useState<Filter>('todas')

  const shown = useMemo(() => activities.filter(a => {
    if (filter === 'abiertas') return a.submissions < a.learners
    return true
  }), [filter])

  return (
    <>
      <Page wide>
        <PageHeader
          title="Mis actividades"
          subtitle="Doce actividades en siete espacios. Cuatro esperan que alguien las mire."
          actions={
            <>
              <Segmented
                size="sm"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: 'todas', label: 'Todas' },
                  { value: 'abiertas', label: 'Abiertas' },
                ]}
              />
              <Segmented
                size="sm"
                value={view}
                onChange={setView}
                options={[
                  { value: 'grid', icon: 'grid_view', title: 'Ver en grilla' },
                  { value: 'list', icon: 'tune', title: 'Ver en lista' },
                ]}
              />
            </>
          }
        />

        {view === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((a, i) => (
              <div key={a.id} className={`ui-rise ui-d${Math.min(i + 1, 6)}`}>
                <ActivityCard activity={a} />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
            {shown.map(a => <ActivityRow key={a.id} activity={a} />)}
          </div>
        )}

        <SectionLabel count={3}>Empezadas y sin asignar</SectionLabel>
        <div className="flex flex-wrap gap-2">
          <Chip color="orange">Los nombres de la cuadra</Chip>
          <Chip color="pink">Cuántos pasos hay hasta la puerta</Chip>
          <Chip color="teal">Una carta a quien venga después</Chip>
          <Button size="sm" variant="ghost" icon="add">Nueva</Button>
        </div>

        <div className="h-32" />
      </Page>
      <Composer />
    </>
  )
}
