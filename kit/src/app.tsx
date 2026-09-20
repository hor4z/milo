import cls from './app.module.css'
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Button } from '@milo/ui/button'
import { EmptyState } from '@milo/ui/empty-state'
import { Icon } from '@milo/ui/icon'
import { IconButton } from '@milo/ui/icon-button'
import { cx, fold } from '@milo/ui/lib/cx'
import { usePrefs } from '@milo/ui/prefs'
import { Search } from '@milo/ui/search'
import { ToastProvider } from '@milo/ui/toast'
import { Intro } from './intro'
import { Dashboard } from './dashboard'
import { DocumentStory } from './document'
import { AccessibilitySection } from './foundations/accessibility'
import { TypographySection } from './foundations/typography'
import { ColorSection } from './foundations/color'
import { MeasureSection } from './foundations/measure'
import { ReliefSection } from './foundations/relief'
import { StatesSection } from './foundations/states'
import { NumbersSection } from './foundations/numbers'
import { MediaSection } from './foundations/media'
import { TimeSection } from './foundations/time'
import { AudioPlayerStory } from './stories/audio-player'
import { LayoutSection } from './foundations/layout'
import { CalloutStory } from './stories/callout'
import { FigureStory } from './stories/figure'
import { QuoteStory } from './stories/quote'
import { TaskListStory } from './stories/task-list'
import { MentionStory } from './stories/mention'
import { DatePickerStory } from './stories/date-picker'
import { ReorderStory } from './stories/reorder'
import { CommandMenuStory } from './stories/command-menu'
import { ToolbarStory } from './stories/toolbar'
import { StepsStory } from './stories/steps'
import { AmeliaStory } from './mascots/amelia'
import { OttoStory } from './mascots/otto'
import { WritingSection } from './foundations/writing'
import { ChecklistStory } from './stories/checklist'
import { ButtonStory } from './stories/button'
import { ButtonGroupStory } from './stories/button-group'
import { SplitButtonStory } from './stories/split-button'
import { ToggleButtonStory } from './stories/toggle-button'
import { CopyButtonStory } from './stories/copy-button'
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
import { UtilidadesStory } from './stories/utilidades'
import { KbdStory } from './stories/kbd'
import { DividerStory } from './stories/divider'
import { MenuStory } from './stories/menu'
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
import { IndicatorStory } from './stories/indicator'
import { SearchStory } from './stories/search'
import { ColumnPickerStory } from './stories/column-picker'
import { ProgressStory } from './stories/progress'
import { CriterionCardStory } from './stories/criterion-card'
import { RubricStory } from './stories/rubric'
import { SkeletonStory } from './stories/skeleton'
import { ConfirmStory } from './stories/confirm-dialog'
import { DropdownStory } from './stories/dropdown'
import { ModalStory } from './stories/modal'
import { PopoverStory } from './stories/popover'
import { TooltipStory } from './stories/tooltip'

type Story = { id: string; label: string; render: () => ReactNode; alias?: string; children?: Story[] }
type Group = { label: string; stories: Story[] }

const INTRO = 'intro'

const groups: Group[] = [
  {
    label: 'Fundamentos',
    stories: [
      { id: 'accessibility', label: 'Accesibilidad', alias: 'accesibilidad a11y contraste teclado foco lector pantalla wcag', render: () => <AccessibilitySection /> },
      { id: 'typography', label: 'Tipografía', alias: 'tipografía fuente texto escala pesos interlineado tracking familia inter legibilidad', render: () => <TypographySection /> },
      { id: 'color', label: 'Color', alias: 'paleta tokens rampa tonos', render: () => <ColorSection /> },
      { id: 'measure', label: 'Medidas y radios', alias: 'espaciado medidas radios tamaños grilla', render: () => <MeasureSection /> },
      { id: 'layout', label: 'Layout', alias: 'layout cortes breakpoints responsive columnas mueble riel ancho pantalla', render: () => <LayoutSection /> },
      { id: 'relief', label: 'Relieve', alias: 'sombra relieve elevación profundidad', render: () => <ReliefSection /> },
      { id: 'states', label: 'Estados', alias: 'estados hover foco pressed disabled vacío cargando error skeleton empty loading', render: () => <StatesSection /> },
      { id: 'icon', label: 'Iconos', alias: 'iconos glifos símbolos', render: () => <IconStory /> },
      { id: 'time', label: 'Fecha y hora', alias: 'fecha hora tiempo zona huso timezone reloj duración vencimiento relativo formato', render: () => <TimeSection /> },
      { id: 'media', label: 'Medios', alias: 'medios imagen video audio animación multimedia subtítulos leyendas audiodescripción transcripción alt proporción autoplay peso voz sonido silencio volumen velocidad escuchar lectura hablada', render: () => <MediaSection /> },
      { id: 'numbers', label: 'Números y valores', alias: 'números cifras decimales coma porcentaje unidades tamaño rango cantidades tabular', render: () => <NumbersSection /> },
      { id: 'writing', label: 'Cómo se escribe', alias: 'texto redacción copy mensajes tono escritura', render: () => <WritingSection /> },
      { id: 'utilidades', label: 'Utilidades', alias: 'utilidades helpers funciones hooks lib time number colorForName plural api', render: () => <UtilidadesStory /> },
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
      { id: 'toolbar', label: 'Barra de formato', alias: 'Toolbar barra herramientas formato negrita cursiva editor texto enriquecido', render: () => <ToolbarStory /> },
      { id: 'command-menu', label: 'Paleta de comandos', alias: 'CommandMenu comandos paleta barra slash menú buscar bloques editor notion', render: () => <CommandMenuStory /> },
      { id: 'callout', label: 'Bloque destacado', alias: 'Callout bloque destacado aclaración pista recordar contenido editor', render: () => <CalloutStory /> },
      { id: 'figure', label: 'Imagen con pie', alias: 'Figure imagen figura pie epígrafe foto alt caption editor', render: () => <FigureStory /> },
      { id: 'quote', label: 'Cita', alias: 'cita blockquote fuente atribución textual editor', render: () => <QuoteStory /> },
      { id: 'task-list', label: 'Lista de tareas', alias: 'TaskList tareas checklist pasos pendientes marcar hacer editor', render: () => <TaskListStory /> },
      { id: 'checklist', label: 'Lista de pasos', alias: 'Checklist primeros pasos onboarding progreso acordeón plegable checklist', render: () => <ChecklistStory /> },
      { id: 'mention', label: 'Mención', alias: 'Mention mención arroba persona espacio referencia enlace texto editor', render: () => <MentionStory /> },
    ],
  },
  {
    label: 'Acciones',
    stories: [
      {
        id: 'button',
        label: 'Botón',
        alias: 'button botón acción primaria cta',
        render: () => <ButtonStory />,
        children: [
          { id: 'icon-button', label: 'Botón de icono', alias: 'IconButton botón icono redondo acción', render: () => <IconButtonStory /> },
          { id: 'button-group', label: 'Grupo de botones', alias: 'ButtonGroup grupo pegados juntos barra', render: () => <ButtonGroupStory /> },
          { id: 'split-button', label: 'Botón partido', alias: 'SplitButton partido flecha menú acción principal', render: () => <SplitButtonStory /> },
          { id: 'toggle-button', label: 'Botón de alternancia', alias: 'ToggleButton toggle alternar hundido pressed', render: () => <ToggleButtonStory /> },
          { id: 'copy-button', label: 'Botón de copiar', alias: 'CopyButton copiar portapapeles clipboard', render: () => <CopyButtonStory /> },
        ],
      },
      { id: 'menu', label: 'Menú', alias: 'Menu menú opciones contextual', render: () => <MenuStory /> },
      { id: 'dropdown', label: 'Desplegable', alias: 'Dropdown menú desplegable opciones', render: () => <DropdownStory /> },
    ],
  },
  {
    label: 'Formularios',
    stories: [
      { id: 'field', label: 'Campo', alias: 'formulario campo etiqueta ayuda error obligatorio fieldset', render: () => <FieldStory /> },
      { id: 'sheet', label: 'Panel lateral', alias: 'Sheet panel lateral drawer formulario largo costado', render: () => <SheetStory /> },
      { id: 'search', label: 'Buscador', alias: 'Search buscador buscar búsqueda lupa filtrar atajo', render: () => <SearchStory /> },
      { id: 'text-field', label: 'Campo de texto', alias: 'TextField input campo texto entrada', render: () => <TextFieldStory /> },
      { id: 'textarea', label: 'Área de texto', alias: 'Textarea campo multilínea texto largo', render: () => <TextareaStory /> },
      { id: 'select', label: 'Selector', alias: 'Select combo desplegable elegir opción', render: () => <SelectStory /> },
      { id: 'date-picker', label: 'Selector de fecha', alias: 'DatePicker fecha calendario vencimiento día mes entrega cuándo almanaque', render: () => <DatePickerStory /> },
      { id: 'checkbox', label: 'Casilla', alias: 'Checkbox casilla marcar tilde', render: () => <CheckboxStory /> },
      { id: 'radio', label: 'Opción única', alias: 'Radio opción única elegir', render: () => <RadioStory /> },
      { id: 'switch', label: 'Interruptor', alias: 'Switch toggle interruptor prender apagar', render: () => <SwitchStory /> },
      { id: 'slider', label: 'Deslizador', alias: 'Slider rango deslizar valor', render: () => <SliderStory /> },
      { id: 'segmented', label: 'Segmentado', alias: 'Segmented filtro conmutador pestañas grupo', render: () => <SegmentedStory /> },
    ],
  },
  {
    label: 'Navegación',
    stories: [
      { id: 'tabs', label: 'Solapas', alias: 'Tabs solapas pestañas paneles', render: () => <TabsStory /> },
      { id: 'accordion', label: 'Acordeón', alias: 'Accordion acordeón desplegable details preguntas frecuentes', render: () => <AccordionStory /> },
      { id: 'breadcrumb', label: 'Migas de pan', alias: 'Breadcrumb ruta migas volver jerarquía', render: () => <BreadcrumbStory /> },
      { id: 'reorder', label: 'Reordenar', alias: 'Reorder reordenar arrastrar soltar mover orden bloques manija drag', render: () => <ReorderStory /> },
      { id: 'steps', label: 'Pasos', alias: 'Steps etapas pasos proceso wizard progreso secuencia', render: () => <StepsStory /> },
      { id: 'nav', label: 'Item de navegación', alias: 'NavItem navegación item sidebar riel', render: () => <NavStory /> },
    ],
  },
  {
    label: 'Datos',
    stories: [
      { id: 'table', label: 'Tabla', alias: 'Table tabla grilla filas columnas datos', render: () => <TableStory /> },
      { id: 'list', label: 'Lista', alias: 'lista filas acciones', render: () => <ListStory /> },
      { id: 'bar-chart', label: 'Gráfico de barras', alias: 'BarChart gráfico barras chart datos progreso visualización ejes leyenda tabla', render: () => <ChartStory /> },
      { id: 'column-picker', label: 'Selector de columnas', alias: 'ColumnPicker columnas tabla elegir mostrar ocultar', render: () => <ColumnPickerStory /> },
      { id: 'indicator', label: 'Indicador', alias: 'Indicator indicador badge marca punto contador aviso notificación campana', render: () => <IndicatorStory /> },
      {
        id: 'rubric',
        label: 'Rúbrica',
        alias: 'Rubric rúbrica criterios niveles evaluación corregir peso descriptores',
        render: () => <RubricStory />,
        children: [
          { id: 'criterion-card', label: 'Tarjeta de criterio', alias: 'CriterionCard criterio tarjeta plegable niveles descriptores rúbrica', render: () => <CriterionCardStory /> },
        ],
      },
      { id: 'progress', label: 'Barra de progreso', alias: 'Progress progreso barra porcentaje avance', render: () => <ProgressStory /> },
      { id: 'audio-player', label: 'Reproductor de audio', alias: 'AudioPlayer audio reproductor sonido onda waveform grabación consigna mp3', render: () => <AudioPlayerStory /> },
      { id: 'skeleton', label: 'Esqueleto', alias: 'Skeleton esqueleto carga hueco placeholder', render: () => <SkeletonStory /> },
      { id: 'avatar', label: 'Avatar', alias: 'Avatar foto persona iniciales grupo', render: () => <AvatarStory /> },
      { id: 'chip', label: 'Ficha', alias: 'Chip etiqueta pill categoría badge marca estado tono', render: () => <ChipStory /> },
    ],
  },
  {
    label: 'Avisos',
    stories: [
      { id: 'alert', label: 'Aviso', alias: 'alerta aviso error banner mensaje', render: () => <AlertStory /> },
      { id: 'toast', label: 'Notificación', alias: 'toast notificación aviso pasajero deshacer', render: () => <ToastStory /> },
      { id: 'empty-state', label: 'Vacío', alias: 'EmptyState vacío sin resultados nada', render: () => <EmptyStateStory /> },
      { id: 'spinner', label: 'Girador', alias: 'Spinner cargando loading esperar', render: () => <SpinnerStory /> },
      { id: 'tooltip', label: 'Etiqueta flotante', alias: 'Tooltip ayuda globo hover', render: () => <TooltipStory /> },
    ],
  },
  {
    label: 'Superficies',
    stories: [
      { id: 'card', label: 'Tarjeta', alias: 'tarjeta card panel superficie grilla', render: () => <CardStory /> },
      { id: 'row', label: 'Fila', alias: 'Row fila ajuste panel preferencia', render: () => <RowStory /> },
      { id: 'modal', label: 'Modal', alias: 'Modal diálogo ventana emergente', render: () => <ModalStory /> },
      { id: 'confirm', label: 'Confirmación', alias: 'ConfirmDialog confirmar borrar peligro pregunta', render: () => <ConfirmStory /> },
      { id: 'popover', label: 'Panel anclado', alias: 'Popover panel anclado flotante', render: () => <PopoverStory /> },
      { id: 'divider', label: 'Separador', alias: 'Divider separador línea corte', render: () => <DividerStory /> },
      { id: 'link', label: 'Enlace', alias: 'Link enlace hipervínculo subrayado externo', render: () => <LinkStory /> },
      { id: 'kbd', label: 'Tecla', alias: 'Kbd tecla atajo teclado', render: () => <KbdStory /> },
      { id: 'folder', label: 'Carpeta', alias: 'Folder carpeta espacio color', render: () => <FolderStory /> },
    ],
  },
]

const flatten = (stories: Story[]): Story[] => stories.flatMap(s => [s, ...(s.children ?? [])])
const everything = groups.flatMap(g => flatten(g.stories).map(s => ({ ...s, group: g.label })))

export function App() {
  const [current, setCurrent] = useState(() => location.hash.slice(1) || INTRO)
  const [query, setQuery] = useState('')
  const [railOpen, setRailOpen] = useState(false)
  const [abiertos, setAbiertos] = useState<string[]>([])
  const { prefs, set } = usePrefs()
  const searchRef = useRef<HTMLInputElement>(null)
  const main = useRef<HTMLElement>(null)

  useEffect(() => {
    const onHash = () => {
      setCurrent(location.hash.slice(1) || INTRO)
      setRailOpen(false)
      window.scrollTo({ top: 0 })
    }
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
        stories: g.stories.flatMap(s => {
          const coincide = (x: Story) =>
            fold(x.label).includes(q)
            || fold(g.label).includes(q)
            || (x.alias ? fold(x.alias).includes(q) : false)
          const hijos = (s.children ?? []).filter(coincide)
          if (coincide(s)) return [{ ...s, children: hijos.length ? hijos : s.children }]
          return hijos.length ? [{ ...s, children: hijos }] : []
        }),
      }))
      .filter(g => g.stories.length > 0)
  }, [query])

  const story = everything.find(s => s.id === current)

  return (
    <ToastProvider>
      <div className={cls.shell}>
        {railOpen && (
          <div
            className={`${cls.railVeil} ui-fade`}
            onClick={() => setRailOpen(false)}
            aria-hidden="true"
          />
        )}

        <nav
          id="riel"
          className={cx(
            cls.rail,
            cls.railMotion,
            railOpen ? cls.railOpen : cls.railClosed,
          )}
        >
          <div className={cls.railHead}>
            <button onClick={() => go(INTRO)} className={cls.brand}>
              <span className={cls.brandName}>milo</span>
              <span className={cls.brandTagline}>design system</span>
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

          <div className={cls.railScroll}>
            <SideLink active={current === INTRO} onClick={() => go(INTRO)} icon="deployed_code">Introducción</SideLink>
            <SideLink active={current === 'dashboard'} onClick={() => go('dashboard')} icon="dashboard">Dashboard</SideLink>
            <SideLink active={current === 'documento'} onClick={() => go('documento')} icon="description">Documento</SideLink>

            {filtered.map(g => (
              <div key={g.label} className={cls.navGroup}>
                <div className={cls.navGroupLabel}>
                  {g.label}
                </div>
                <div className={cls.navGroupItems}>
                  {g.stories.map(s => {
                    // se despliega al tocarlo, o solo si estás parado en uno de sus hijos
                    const desplegado = abiertos.includes(s.id)
                      || Boolean(s.children?.some(c => c.id === current))
                      || Boolean(query && s.children?.length)
                    return (
                      <Fragment key={s.id}>
                        <SideLink
                          active={current === s.id}
                          expanded={s.children?.length ? desplegado : undefined}
                          onClick={() => {
                            if (s.children?.length) {
                              setAbiertos(a => a.includes(s.id) ? a.filter(x => x !== s.id) : [...a, s.id])
                            }
                            go(s.id)
                          }}
                          piece
                        >
                          {s.label}
                        </SideLink>
                        {desplegado && s.children?.map(c => (
                          <SideLink key={c.id} active={current === c.id} onClick={() => go(c.id)} piece sub>{c.label}</SideLink>
                        ))}
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className={cls.railEmpty}>Nada con "{query}".</p>
            )}
          </div>

          <div className={cls.railFoot}>
            <span className={cls.railCount}>
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

        <header className={cls.topBar}>
          <IconButton
            icon="menu"
            label="Abrir el índice"
            size="sm"
            variant="ghost"
            aria-expanded={railOpen}
            aria-controls="riel"
            onClick={() => setRailOpen(true)}
          />
          <span className={cls.topBarTitle}>milo · design system</span>
        </header>

        <main ref={main} className={cls.main}>
          <div key={current} className={cls.viewSlot}>
            {current === INTRO && <Intro go={go} />}
            {current === 'dashboard' && <Dashboard />}
            {current === 'documento' && <DocumentStory />}
            {story?.render()}
            {!story && current !== INTRO && current !== 'dashboard' && current !== 'documento' && (
              <>
              <h1 className="sr-only">Esa vista ya no está acá</h1>
              <EmptyState icon="search_off">
                <EmptyState.Title>Esa vista ya no está acá</EmptyState.Title>
                <EmptyState.Body>{`No hay ninguna pieza que se llame "${current}". Puede que se haya renombrado: el buscador del riel encuentra por nombre y por sinónimo.`}</EmptyState.Body>
                <EmptyState.Action><Button variant="muted" iconStart={<Icon name="arrow_back" />} onClick={() => go(INTRO)}>Volver a la introducción</Button></EmptyState.Action>
              </EmptyState>
              </>
            )}
          </div>
        </main>
      </div>
    </ToastProvider>
  )
}

function SideLink({ active, onClick, icon, piece, sub, expanded, children }: {
  active: boolean
  onClick: () => void
  icon?: 'deployed_code' | 'dashboard' | 'description'
  piece?: boolean
  /** La sangría del tercer nivel: la columna del texto del padre, no un valor nuevo. */
  sub?: boolean
  /** Presente cuando el item tiene hijos: dibuja el chevron y dice si están a la vista. */
  expanded?: boolean
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
      aria-expanded={expanded}
      className={cx(
        cls.navItem,
        sub && cls.navSubItem,
        active ? cls.navItemActive : cls.navItemIdle,
      )}
    >
      {icon && <Icon name={icon} size={16} className={active ? undefined : 'icon-muted'} />}
      <span className={cls.navItemLabel}>{children}</span>
      {expanded !== undefined && (
        <Icon
          name="keyboard_arrow_down"
          size={16}
          className={cx(cls.navChevron, expanded && cls.navChevronOpen, 'icon-muted')}
        />
      )}
    </button>
  )
}
