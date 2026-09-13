import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button, EmptyState, Icon, IconButton, Search, ToastProvider, cx, fold, usePrefs } from '@milo/ui'
import { Intro } from './intro'
import { Dashboard } from './dashboard'
import { Documento } from './document'
import { Principles } from './foundations/principles'
import { AccessibilitySection } from './foundations/accessibility'
import { TypographySection } from './foundations/typography'
import { ColorSection } from './foundations/color'
import { MeasureSection } from './foundations/measure'
import { ReliefSection } from './foundations/relief'
import { MotionSection } from './foundations/motion'
import { StatesSection } from './foundations/states'
import { InclusionSection } from './foundations/inclusion'
import { AudioPlayerStory } from './stories/audio-player'
import { LineChartStory } from './stories/line-chart'
import { ChartsSection } from './foundations/charts'
import { LayoutSection } from './foundations/layout'
import { CalloutStory } from './stories/callout'
import { FigureStory } from './stories/figure'
import { QuoteStory } from './stories/quote'
import { TaskListStory } from './stories/task-list'
import { MentionStory } from './stories/mention'
import { FormulaStory } from './stories/formula'
import { CodeBlockStory } from './stories/code-block'
import { HeatmapStory } from './stories/heatmap'
import { DatePickerStory } from './stories/date-picker'
import { TreeStory } from './stories/tree'
import { StepperStory } from './stories/stepper'
import { ReorderStory } from './stories/reorder'
import { CommandMenuStory } from './stories/command-menu'
import { ToolbarStory } from './stories/toolbar'
import { StepsStory } from './stories/steps'
import { AmeliaStory } from './mascots/amelia'
import { OttoStory } from './mascots/otto'
import { Writing } from './foundations/writing'
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
import { CardStory } from './stories/card'
import { RowStory } from './stories/row'
import { NavStory } from './stories/nav'
import { AlertStory } from './stories/alert'
import { ToastStory } from './stories/toast'
import { FieldStory } from './stories/field'
import { SheetStory } from './stories/sheet'
import { LinkStory } from './stories/link'
import { TabsStory } from './stories/tabs'
import { AccordionStory } from './stories/accordion'
import { BreadcrumbStory } from './stories/breadcrumb'
import { BadgeStory } from './stories/badge'
import { IndicatorStory } from './stories/indicator'
import { SearchStory } from './stories/search'
import { ColumnPickerStory } from './stories/column-picker'
import { ProgressStory } from './stories/progress'
import { SkeletonStory } from './stories/skeleton'
import { ConfirmStory } from './stories/confirm-dialog'
import { DropdownStory } from './stories/dropdown'
import { ModalStory } from './stories/modal'
import { PopoverStory } from './stories/popover'
import { TooltipStory } from './stories/tooltip'

type Story = { id: string; label: string; render: () => ReactNode; alias?: string }
type Group = { label: string; stories: Story[] }

const INTRO = 'intro'

const groups: Group[] = [
  // El orden no es alfabético: las dos primeras son las que hay que leer antes
  // de tocar nada, y después van las capas en el orden en que se arma una pantalla.
  {
    label: 'Fundamentos',
    stories: [
      { id: 'principles', label: 'Principios', alias: 'principios fundamentos reglas decisiones', render: () => <Principles /> },
      { id: 'accessibility', label: 'Accesibilidad', alias: 'accesibilidad a11y contraste teclado foco lector pantalla wcag', render: () => <AccessibilitySection /> },
      { id: 'typography', label: 'Tipografía', alias: 'tipografía fuente texto escala pesos interlineado tracking familia inter legibilidad', render: () => <TypographySection /> },
      { id: 'color', label: 'Color', alias: 'paleta tokens rampa tonos', render: () => <ColorSection /> },
      { id: 'measure', label: 'Medidas y radios', alias: 'espaciado medidas radios tamaños grilla', render: () => <MeasureSection /> },
      { id: 'layout', label: 'Layout', alias: 'layout cortes breakpoints responsive columnas mueble riel ancho pantalla', render: () => <LayoutSection /> },
      { id: 'relief', label: 'Relieve', alias: 'sombra relieve elevación profundidad', render: () => <ReliefSection /> },
      { id: 'motion', label: 'Movimiento', alias: 'movimiento animación transición duración curva easing reduced motion', render: () => <MotionSection /> },
      { id: 'states', label: 'Estados', alias: 'estados hover foco pressed disabled vacío cargando error skeleton empty loading', render: () => <StatesSection /> },
      { id: 'icon', label: 'Iconos', alias: 'iconos glifos símbolos', render: () => <IconStory /> },
      { id: 'charts', label: 'Gráficos', alias: 'gráficos datos barras línea ejes leyenda visualización', render: () => <ChartsSection /> },
      { id: 'writing', label: 'Cómo se escribe', alias: 'texto redacción copy mensajes tono escritura', render: () => <Writing /> },
      { id: 'inclusion', label: 'Inclusión', alias: 'inclusión género lenguaje nombres personas diversidad edtech', render: () => <InclusionSection /> },
    ],
  },
  {
    label: 'Mascotas',
    stories: [
      { id: 'otto', label: 'Otto', alias: 'otto mascota personaje nutria hurón ilustración', render: () => <OttoStory /> },
      { id: 'amelia', label: 'Amelia', alias: 'amelia mascota personaje chica estudiante ilustración', render: () => <AmeliaStory /> },
    ],
  },
  {
    label: 'Editor',
    stories: [
      { id: 'toolbar', label: 'Toolbar', alias: 'barra herramientas formato negrita cursiva editor texto enriquecido', render: () => <ToolbarStory /> },
      { id: 'command-menu', label: 'CommandMenu', alias: 'comandos paleta barra slash menú buscar bloques editor notion', render: () => <CommandMenuStory /> },
      { id: 'callout', label: 'Callout', alias: 'bloque destacado aclaración pista recordar contenido editor', render: () => <CalloutStory /> },
      { id: 'figure', label: 'Figure', alias: 'imagen figura pie epígrafe foto alt caption editor', render: () => <FigureStory /> },
      { id: 'quote', label: 'Quote', alias: 'cita blockquote fuente atribución textual editor', render: () => <QuoteStory /> },
      { id: 'task-list', label: 'TaskList', alias: 'tareas checklist pasos pendientes marcar hacer editor', render: () => <TaskListStory /> },
      { id: 'mention', label: 'Mention', alias: 'mención arroba persona espacio referencia enlace texto editor', render: () => <MentionStory /> },
      { id: 'formula', label: 'Formula', alias: 'fórmula ecuación matemática física mathml latex expresión raíz fracción', render: () => <FormulaStory /> },
      { id: 'code-block', label: 'CodeBlock', alias: 'código bloque programación sintaxis copiar consola terminal línea', render: () => <CodeBlockStory /> },
    ],
  },
  {
    label: 'Acciones',
    stories: [
      { id: 'button', label: 'Button', alias: 'botón acción primaria cta', render: () => <ButtonStory /> },
      { id: 'icon-button', label: 'IconButton', alias: 'botón icono redondo acción', render: () => <IconButtonStory /> },
      { id: 'menu', label: 'Menu', alias: 'menú opciones contextual', render: () => <MenuStory /> },
      { id: 'dropdown', label: 'Dropdown', alias: 'menú desplegable opciones', render: () => <DropdownStory /> },
    ],
  },
  {
    label: 'Formularios',
    stories: [
      { id: 'field', label: 'Field', alias: 'formulario campo etiqueta ayuda error obligatorio fieldset', render: () => <FieldStory /> },
      { id: 'sheet', label: 'Sheet', alias: 'panel lateral drawer formulario largo costado', render: () => <SheetStory /> },
      { id: 'search', label: 'Search', alias: 'buscador buscar búsqueda lupa filtrar atajo', render: () => <SearchStory /> },
      { id: 'text-field', label: 'TextField', alias: 'input campo texto entrada', render: () => <TextFieldStory /> },
      { id: 'textarea', label: 'Textarea', alias: 'campo multilínea texto largo', render: () => <TextareaStory /> },
      { id: 'select', label: 'Select', alias: 'combo desplegable elegir opción', render: () => <SelectStory /> },
      { id: 'date-picker', label: 'DatePicker', alias: 'fecha calendario vencimiento día mes entrega cuándo almanaque', render: () => <DatePickerStory /> },
      { id: 'checkbox', label: 'Checkbox', alias: 'casilla marcar tilde', render: () => <CheckboxStory /> },
      { id: 'radio', label: 'Radio', alias: 'opción única elegir', render: () => <RadioStory /> },
      { id: 'switch', label: 'Switch', alias: 'toggle interruptor prender apagar', render: () => <SwitchStory /> },
      { id: 'slider', label: 'Slider', alias: 'rango deslizar valor', render: () => <SliderStory /> },
      { id: 'stepper', label: 'Stepper', alias: 'paso número cantidad más menos contador incrementar intentos', render: () => <StepperStory /> },
      { id: 'segmented', label: 'Segmented', alias: 'filtro conmutador pestañas grupo', render: () => <SegmentedStory /> },
    ],
  },
  {
    label: 'Navegación',
    stories: [
      { id: 'tabs', label: 'Tabs', alias: 'solapas pestañas paneles', render: () => <TabsStory /> },
      { id: 'accordion', label: 'Accordion', alias: 'acordeón desplegable details preguntas frecuentes', render: () => <AccordionStory /> },
      { id: 'breadcrumb', label: 'Breadcrumb', alias: 'ruta migas volver jerarquía', render: () => <BreadcrumbStory /> },
      { id: 'tree', label: 'Tree', alias: 'árbol jerarquía carpetas anidado índice esquema outline ramas', render: () => <TreeStory /> },
      { id: 'reorder', label: 'Reorder', alias: 'reordenar arrastrar soltar mover orden bloques manija drag', render: () => <ReorderStory /> },
      { id: 'steps', label: 'Steps', alias: 'etapas pasos proceso wizard progreso secuencia', render: () => <StepsStory /> },
      { id: 'nav', label: 'NavItem', alias: 'navegación item sidebar riel', render: () => <NavStory /> },
    ],
  },
  {
    label: 'Datos',
    stories: [
      { id: 'table', label: 'Table', alias: 'tabla grilla filas columnas datos', render: () => <TableStory /> },
      { id: 'list', label: 'List', alias: 'lista filas acciones', render: () => <ListStory /> },
      { id: 'bar-chart', label: 'BarChart', alias: 'gráfico barras chart datos progreso', render: () => <ChartStory /> },
      { id: 'line-chart', label: 'LineChart', alias: 'gráfico línea función curva tiempo serie física matemática', render: () => <LineChartStory /> },
      { id: 'heatmap', label: 'Heatmap', alias: 'mapa de calor grilla dominio niveles curso matriz diferenciado', render: () => <HeatmapStory /> },
      { id: 'column-picker', label: 'ColumnPicker', alias: 'columnas tabla elegir mostrar ocultar', render: () => <ColumnPickerStory /> },
      { id: 'indicator', label: 'Indicator', alias: 'indicador marca punto contador aviso notificación campana', render: () => <IndicatorStory /> },
      { id: 'badge', label: 'Badge', alias: 'etiqueta marca estado', render: () => <BadgeStory /> },
      { id: 'progress', label: 'Progress', alias: 'progreso barra porcentaje avance', render: () => <ProgressStory /> },
      { id: 'audio-player', label: 'AudioPlayer', alias: 'audio reproductor sonido onda waveform grabación consigna mp3', render: () => <AudioPlayerStory /> },
      { id: 'skeleton', label: 'Skeleton', alias: 'esqueleto carga hueco placeholder', render: () => <SkeletonStory /> },
      { id: 'avatar', label: 'Avatar', alias: 'foto persona iniciales grupo', render: () => <AvatarStory /> },
      { id: 'chip', label: 'Chip', alias: 'etiqueta pill categoría', render: () => <ChipStory /> },
    ],
  },
  {
    label: 'Avisos',
    stories: [
      { id: 'alert', label: 'Alert', alias: 'alerta aviso error banner mensaje', render: () => <AlertStory /> },
      { id: 'toast', label: 'Toast', alias: 'toast notificación aviso pasajero deshacer', render: () => <ToastStory /> },
      { id: 'empty-state', label: 'EmptyState', alias: 'vacío sin resultados nada', render: () => <EmptyStateStory /> },
      { id: 'spinner', label: 'Spinner', alias: 'cargando loading esperar', render: () => <SpinnerStory /> },
      { id: 'tooltip', label: 'Tooltip', alias: 'ayuda globo hover', render: () => <TooltipStory /> },
    ],
  },
  {
    label: 'Superficies',
    stories: [
      { id: 'card', label: 'Card', alias: 'tarjeta card panel superficie grilla', render: () => <CardStory /> },
      { id: 'row', label: 'Row', alias: 'fila ajuste panel preferencia', render: () => <RowStory /> },
      { id: 'modal', label: 'Modal', alias: 'diálogo ventana emergente', render: () => <ModalStory /> },
      { id: 'confirm', label: 'ConfirmDialog', alias: 'confirmar borrar peligro pregunta', render: () => <ConfirmStory /> },
      { id: 'popover', label: 'Popover', alias: 'panel anclado flotante', render: () => <PopoverStory /> },
      { id: 'divider', label: 'Divider', alias: 'separador línea corte', render: () => <DividerStory /> },
      { id: 'link', label: 'Link', alias: 'enlace hipervínculo subrayado externo', render: () => <LinkStory /> },
      { id: 'kbd', label: 'Kbd', alias: 'tecla atajo teclado', render: () => <KbdStory /> },
      { id: 'book', label: 'Book', alias: 'libro portada tapa', render: () => <BookStory /> },
      { id: 'folder', label: 'Folder', alias: 'carpeta espacio color', render: () => <FolderStory /> },
    ],
  },
]

const everything = groups.flatMap(g => g.stories.map(s => ({ ...s, group: g.label })))

export function App() {
  const [current, setCurrent] = useState(() => location.hash.slice(1) || INTRO)
  const [query, setQuery] = useState('')
  const [railOpen, setRailOpen] = useState(false)
  const { prefs, set } = usePrefs()
  const searchRef = useRef<HTMLInputElement>(null)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const onHash = () => setCurrent(location.hash.slice(1) || INTRO)
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const where = document.activeElement as HTMLElement | null
      const typing = where?.tagName === 'INPUT' || where?.tagName === 'TEXTAREA' || where?.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const go = (id: string) => {
    location.hash = id
    setCurrent(id)
    setRailOpen(false)
    window.scrollTo({ top: 0 })
  }

  const filtered = useMemo(() => {
    const q = fold(query.trim())
    if (!q) return groups
    return groups
      .map(g => ({
        ...g,
        stories: g.stories.filter(s =>
          fold(s.label).includes(q)
          || fold(g.label).includes(q)
          || (s.alias ? fold(s.alias).includes(q) : false)),
      }))
      .filter(g => g.stories.length > 0)
  }, [query])

  const story = everything.find(s => s.id === current)

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-canvas lg:flex-row">
        {railOpen && (
          <div
            className="ui-fade fixed inset-0 z-30 bg-veil lg:hidden"
            onClick={() => setRailOpen(false)}
            aria-hidden="true"
          />
        )}

        <nav
          id="riel"
          className={cx(
            'fixed top-0 bottom-0 left-0 z-40 flex w-[248px] shrink-0 flex-col border-r border-line bg-canvas',
            'transition-transform duration-normal ease-out lg:translate-x-0',
            railOpen ? 'translate-x-0 shadow-popover' : '-translate-x-full',
          )}
        >
          <div className="flex flex-col gap-3 px-4 pt-5 pb-3">
            <button onClick={() => go(INTRO)} className="flex items-baseline gap-2 self-start rounded-md px-1 text-left">
              <span className="text-reading font-semibold text-ink">milo</span>
              <span className="text-meta font-medium text-ink-muted">design system</span>
            </button>

            <Search
              ref={searchRef}
              value={query}
              onValueChange={setQuery}
              placeholder="Buscar"
              aria-label="Buscar una pieza"
              shortcut="/"
              block
              onKeyDown={e => {
                const found = filtered.flatMap(g => g.stories)
                if (e.key === 'Enter' && found.length > 0) {
                  go(found[0].id)
                  setQuery('')
                  searchRef.current?.blur()
                }
                if (e.key === 'Escape') {
                  if (query) setQuery('')
                  else searchRef.current?.blur()
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault()
                  document.querySelector<HTMLButtonElement>('nav [data-pieza]')?.focus()
                }
              }}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <SideLink active={current === INTRO} onClick={() => go(INTRO)} icon="deployed_code">Introducción</SideLink>
            <SideLink active={current === 'dashboard'} onClick={() => go('dashboard')} icon="dashboard">Dashboard</SideLink>
            <SideLink active={current === 'documento'} onClick={() => go('documento')} icon="description">Documento</SideLink>

            {filtered.map(g => (
              <div key={g.label} className="mt-5 first:mt-4">
                <div className="px-2 pb-2 text-label font-semibold text-ink-muted uppercase">
                  {g.label}
                </div>
                <div className="flex flex-col gap-px">
                  {g.stories.map(s => (
                    <SideLink key={s.id} active={current === s.id} onClick={() => go(s.id)} piece>{s.label}</SideLink>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="px-2 py-6 text-body font-medium text-ink-muted">Nada con «{query}».</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
            <span className="text-meta font-medium text-ink-muted">
              {everything.length} vistas
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

        {/* `header` y no `div`: es la cabecera de la página, y como `div` dejaba
            el nombre del sitio fuera de toda landmark en pantalla chica. */}
        <header className="sticky top-0 z-20 flex items-center gap-2 border-b border-line bg-canvas/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <IconButton
            icon="menu"
            label="Abrir el índice"
            size="sm"
            variant="ghost"
            aria-expanded={railOpen}
            aria-controls="riel"
            onClick={() => setRailOpen(true)}
          />
          <span className="text-body font-semibold text-ink">milo · design system</span>
        </header>

        <main ref={main} className="min-w-0 flex-1 px-5 py-8 lg:ml-[248px] lg:px-10 lg:py-10">
          <div key={current} className="mx-auto flex max-w-[980px] flex-col">
            {current === INTRO && <Intro go={go} views={everything.length} />}
            {current === 'dashboard' && <Dashboard />}
            {current === 'documento' && <Documento />}
            {story?.render()}
            {!story && current !== INTRO && current !== 'dashboard' && current !== 'documento' && (
              // Cada vista es un link que alguien puede tener guardado, y una
              // pieza que se renombra deja ese link apuntando a nada. Sin esto
              // el canvas quedaba en blanco, que se lee como que el sitio está
              // roto y no como que la dirección cambió.
              <EmptyState
                icon="search_off"
                title="Esa vista ya no está acá"
                body={`No hay ninguna pieza que se llame «${current}». Puede que se haya renombrado: el buscador del riel encuentra por nombre y por sinónimo.`}
                action={<Button variant="raised" icon="arrow_back" onClick={() => go(INTRO)}>Volver a la introducción</Button>}
              />
            )}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}

function SideLink({ active, onClick, icon, piece, children }: {
  active: boolean
  onClick: () => void
  icon?: 'deployed_code' | 'dashboard' | 'description'
  piece?: boolean
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      data-pieza={piece ? '' : undefined}
      onKeyDown={e => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
        e.preventDefault()
        const all = [...document.querySelectorAll<HTMLButtonElement>('nav [data-pieza]')]
        const i = all.indexOf(e.currentTarget)
        const next = all[i + (e.key === 'ArrowDown' ? 1 : -1)]
        next?.focus()
      }}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left text-body transition-colors duration-fast ease-out',
        active ? 'bg-brand-soft font-semibold text-brand-ink shadow-[0_0_0_1px_var(--brand-border)]' : 'font-medium text-ink hover:bg-hover',
      )}
    >
      {icon && <Icon name={icon} size={16} className={active ? undefined : 'icon-muted'} />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  )
}
