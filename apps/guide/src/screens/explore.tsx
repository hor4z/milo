import { useState } from 'react'
import { Page, PageHeader, SectionLabel, Card, Chip, cx, Icon , labelColors, labelFill } from '@melu/ui'
import { ActivityCard } from '../ui/activity-card'
import { activities, recipes } from '../data'

const areas = ['Todas', 'Ciencias', 'Matemática', 'Lengua', 'Historia', 'Convivencia'] as const

export function ExploreScreen() {
  const [area, setArea] = useState<string>('Todas')
  const shown = area === 'Todas' ? activities : activities.filter(a => a.space.startsWith(area))

  return (
    <Page wide>
      <PageHeader
        title="Explorar"
        subtitle="Lo que otros guías publicaron. Se copia a un espacio propio y se edita sin tocar el original."
      />

      {/* La fila de filtros scrollea horizontal en pantallas angostas, con el
          gradiente del borde para que se vea que hay más. */}
      <div className="relative -mx-6 mb-6 overflow-x-auto px-6 pb-1">
        <div className="flex gap-2">
          {areas.map(a => (
            <Chip key={a} active={a === area} onClick={() => setArea(a)}>{a}</Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {shown.map((a, i) => (
          <div key={a.id} className={`ui-rise ui-d${Math.min(i + 1, 6)}`}>
            <ActivityCard activity={a} />
          </div>
        ))}
      </div>

      <SectionLabel count={recipes.length}>Métodos para empezar</SectionLabel>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </Page>
  )
}

export function RecipesScreen() {
  return (
    <Page>
      <PageHeader
        title="Recetas"
        subtitle="Una receta es una actividad que sirve de plantilla: trae las fases, no el contenido."
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </Page>
  )
}

export function PublishedScreen() {
  const shown = activities.filter(a => a.liked)
  return (
    <Page>
      <PageHeader title="Publicadas" subtitle="Las tuyas que hoy puede copiar cualquier guía de la escuela." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map(a => <ActivityCard key={a.id} activity={a} />)}
      </div>
    </Page>
  )
}

function RecipeCard({ recipe }: { recipe: (typeof recipes)[number] }) {
  return (
    <Card interactive className="flex items-start gap-3.5 p-4">
      <span className={cx('flex size-10 shrink-0 items-center justify-center rounded-xl text-on-label', labelFill[labelColors[(recipe.tint - 1) % labelColors.length]])}>
        <Icon name="menu_book" size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-medium text-ink">{recipe.title}</h3>
          <span className="tabular shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-2xs font-medium text-ink-subtle">
            {recipe.phases} fases
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-subtle">{recipe.lens}</p>
      </div>
    </Card>
  )
}
