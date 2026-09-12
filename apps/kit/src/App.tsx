import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Icon, IconButton, Kbd, ToastProvider, cx, fold, usePrefs } from '@melu/ui'
import { Intro } from './intro'
import { Dashboard } from './dashboard'
import { Foundations } from './guide/foundations'
import { Writing } from './guide/writing'
import { ColorSection } from './tokens/color'
import { TypeSection } from './tokens/type'
import { MeasureSection } from './tokens/measure'
import { ReliefSection } from './tokens/relief'
import { ButtonStory } from './stories/button'
import { IconButtonStory } from './stories/icon-button'
import { TextFieldStory } from './stories/text-field'
import { TextareaStory } from './stories/textarea'
import { EmptyStateStory } from './stories/empty-state'
import { ChartStory } from './stories/chart'
import { SelectStory } from './stories/select'
import { CheckboxStory } from './stories/checkbox'
import { RadioStory } from './stories/radio'
import { SliderStory } from './stories/slider'
import { SwitchStory } from './stories/switch'
import { SegmentedStory } from './stories/segmented'
import { ChipStory } from './stories/chip'
import { SpinnerStory } from './stories/spinner'
import { AvatarStory } from './stories/avatar'
import { IconStory } from './stories/icon'
import { KbdStory } from './stories/kbd'
import { DividerStory } from './stories/divider'
import { MenuStory } from './stories/menu'
import { BookStory } from './stories/book'
import { FolderStory } from './stories/folder'
import { ListStory } from './stories/list'
import { TableStory } from './stories/table'
import { ContainersStory } from './stories/containers'
import { NavStory } from './stories/nav'
import { FeedbackStory } from './stories/feedback'
import { TabsStory } from './stories/tabs'
import { StatusStory } from './stories/status'
import { DropdownStory, ModalStory, PopoverStory, TooltipStory } from './stories/overlays'

type Story = { id: string; label: string; render: () => ReactNode }
type Group = { label: string; stories: Story[] }

const INTRO = 'intro'

const groups: Group[] = [
  {
    label: 'Guía',
    stories: [
      { id: 'foundations', label: 'Principios', render: () => <Foundations /> },
      { id: 'color', label: 'Color', render: () => <ColorSection /> },
      { id: 'type', label: 'Tipografía', render: () => <TypeSection /> },
      { id: 'measure', label: 'Medidas y radios', render: () => <MeasureSection /> },
      { id: 'relief', label: 'Relieve', render: () => <ReliefSection /> },
      { id: 'icon', label: 'Iconos', render: () => <IconStory /> },
      { id: 'writing', label: 'Cómo se escribe', render: () => <Writing /> },
    ],
  },
  {
    label: 'Acciones',
    stories: [
      { id: 'button', label: 'Button', render: () => <ButtonStory /> },
      { id: 'icon-button', label: 'IconButton', render: () => <IconButtonStory /> },
      { id: 'menu', label: 'Menu', render: () => <MenuStory /> },
      { id: 'dropdown', label: 'Dropdown', render: () => <DropdownStory /> },
    ],
  },
  {
    label: 'Formularios',
    stories: [
      { id: 'text-field', label: 'TextField', render: () => <TextFieldStory /> },
      { id: 'textarea', label: 'Textarea', render: () => <TextareaStory /> },
      { id: 'select', label: 'Select', render: () => <SelectStory /> },
      { id: 'checkbox', label: 'Checkbox', render: () => <CheckboxStory /> },
      { id: 'radio', label: 'Radio', render: () => <RadioStory /> },
      { id: 'switch', label: 'Switch', render: () => <SwitchStory /> },
      { id: 'slider', label: 'Slider', render: () => <SliderStory /> },
      { id: 'segmented', label: 'Segmented', render: () => <SegmentedStory /> },
    ],
  },
  {
    label: 'Navegación',
    stories: [
      { id: 'tabs', label: 'Tabs y Accordion', render: () => <TabsStory /> },
      { id: 'nav', label: 'NavItem', render: () => <NavStory /> },
    ],
  },
  {
    label: 'Datos',
    stories: [
      { id: 'table', label: 'Table', render: () => <TableStory /> },
      { id: 'list', label: 'List', render: () => <ListStory /> },
      { id: 'bar-chart', label: 'BarChart', render: () => <ChartStory /> },
      { id: 'status', label: 'Badge y Progress', render: () => <StatusStory /> },
      { id: 'avatar', label: 'Avatar', render: () => <AvatarStory /> },
      { id: 'chip', label: 'Chip', render: () => <ChipStory /> },
    ],
  },
  {
    label: 'Avisos',
    stories: [
      { id: 'feedback', label: 'Alert y Toast', render: () => <FeedbackStory /> },
      { id: 'empty-state', label: 'EmptyState', render: () => <EmptyStateStory /> },
      { id: 'spinner', label: 'Spinner', render: () => <SpinnerStory /> },
      { id: 'tooltip', label: 'Tooltip', render: () => <TooltipStory /> },
    ],
  },
  {
    label: 'Superficies',
    stories: [
      { id: 'containers', label: 'Card y Row', render: () => <ContainersStory /> },
      { id: 'modal', label: 'Modal', render: () => <ModalStory /> },
      { id: 'popover', label: 'Popover', render: () => <PopoverStory /> },
      { id: 'divider', label: 'Divider', render: () => <DividerStory /> },
      { id: 'kbd', label: 'Kbd', render: () => <KbdStory /> },
      { id: 'book', label: 'Book', render: () => <BookStory /> },
      { id: 'folder', label: 'Folder', render: () => <FolderStory /> },
    ],
  },
]

const todas = groups.flatMap(g => g.stories.map(s => ({ ...s, grupo: g.label })))

export function App() {
  const [current, setCurrent] = useState(() => location.hash.slice(1) || INTRO)
  const [busqueda, setBusqueda] = useState('')
  const { prefs, set } = usePrefs()
  const buscador = useRef<HTMLInputElement>(null)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const onHash = () => setCurrent(location.hash.slice(1) || INTRO)
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        buscador.current?.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => {
    location.hash = id
    setCurrent(id)
    main.current?.scrollTo({ top: 0 })
  }

  const filtrados = useMemo(() => {
    const q = fold(busqueda.trim())
    if (!q) return groups
    return groups
      .map(g => ({ ...g, stories: g.stories.filter(s => fold(s.label).includes(q)) }))
      .filter(g => g.stories.length > 0)
  }, [busqueda])

  const story = todas.find(s => s.id === current)

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-canvas">
        <nav className="fixed top-0 bottom-0 left-0 flex w-[248px] shrink-0 flex-col border-r border-line bg-canvas">
          <div className="flex flex-col gap-3 px-4 pt-5 pb-3">
            <button onClick={() => go(INTRO)} className="flex items-baseline gap-1.5 self-start rounded-md px-1 text-left">
              <span className="text-base font-bold tracking-tight text-ink">melu</span>
              <span className="text-2xs font-semibold text-ink-muted">ui kit</span>
            </button>

            <label className="field flex h-8 cursor-text items-center gap-2 rounded-lg border border-field-line bg-field px-2.5">
              <Icon name="search" size={14} className="icon-muted shrink-0" />
              <input
                ref={buscador}
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar"
                aria-label="Buscar una pieza"
                className="min-w-0 flex-1 bg-transparent text-xs font-normal text-ink outline-none placeholder:text-ink-muted"
              />
              {busqueda
                ? (
                  <button type="button" onClick={() => setBusqueda('')} aria-label="Limpiar" className="shrink-0 text-ink-muted hover:text-ink">
                    <Icon name="close" size={14} />
                  </button>
                )
                : <Kbd>/</Kbd>}
            </label>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <SideLink active={current === INTRO} onClick={() => go(INTRO)} icon="deployed_code">Introducción</SideLink>
            <SideLink active={current === 'dashboard'} onClick={() => go('dashboard')} icon="dashboard">Dashboard</SideLink>

            {filtrados.map(g => (
              <div key={g.label} className="mt-5 first:mt-4">
                <div className="px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.06em] text-ink-muted uppercase">
                  {g.label}
                </div>
                <div className="flex flex-col gap-px">
                  {g.stories.map(s => (
                    <SideLink key={s.id} active={current === s.id} onClick={() => go(s.id)}>{s.label}</SideLink>
                  ))}
                </div>
              </div>
            ))}

            {filtrados.length === 0 && (
              <p className="px-2.5 py-6 text-xs font-medium text-ink-muted">Nada con «{busqueda}».</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
            <span className="text-2xs font-medium text-ink-muted">
              {todas.length} piezas
            </span>
            <IconButton
              icon={prefs.theme === 'dark' ? 'light_mode' : 'dark_mode'}
              label={prefs.theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
              size="sm"
              variant="ghost"
              onClick={() => set('theme', prefs.theme === 'dark' ? 'light' : 'dark')}
            />
          </div>
        </nav>

        <main ref={main} className="ml-[248px] min-w-0 flex-1 px-10 py-10">
          <div key={current} className="mx-auto flex max-w-[980px] flex-col">
            {current === INTRO && <Intro go={go} />}
            {current === 'dashboard' && <Dashboard />}
            {story?.render()}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}

function SideLink({ active, onClick, icon, children }: {
  active: boolean
  onClick: () => void
  icon?: 'deployed_code' | 'dashboard'
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'flex h-8 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors',
        active ? 'bg-muted font-semibold text-ink' : 'font-medium text-ink-muted hover:bg-hover hover:text-ink',
      )}
    >
      {icon && <Icon name={icon} size={16} className={active ? undefined : 'icon-muted'} />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  )
}
