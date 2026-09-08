import { useMemo, useState } from 'react'
import { Page, PageHeader, SectionLabel } from '../ui/page'
import { ActivityCard, ActivityRow } from '../ui/activity-card'
import { Button, Chip, Segmented } from '../ui/primitives'
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
                  { value: 'grid', icon: 'grid', title: 'Ver en grilla' },
                  { value: 'list', icon: 'sliders', title: 'Ver en lista' },
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
          <Chip tint={3}>Los nombres de la cuadra</Chip>
          <Chip tint={5}>Cuántos pasos hay hasta la puerta</Chip>
          <Chip tint={2}>Una carta a quien venga después</Chip>
          <Button size="sm" variant="ghost" icon="plus">Nueva</Button>
        </div>

        {/* El composer flota, así que hay que dejarle aire abajo o tapa la
            última fila de la grilla. */}
        <div className="h-32" />
      </Page>
      <Composer />
    </>
  )
}
