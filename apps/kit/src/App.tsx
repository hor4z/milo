import { useMemo, useState, type ReactNode } from 'react'
import {
  FolderIcon, Icon, IconButton, cx, usePrefs, navItemClass, navSubItemClass, NavItemBody,
  type FolderColor,
} from '@melu/ui'
import { Intro } from './intro'
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
import { DropdownStory, ModalStory, PopoverStory, TooltipStory } from './stories/overlays'

/**
 * Una historia por pieza, y el riel las agrupa.
 *
 * La versión anterior tenía seis pantallas largas —"Controles" era una sola con
 * botones, campos, toggles y marcas— y encontrar el switch era scrollear
 * buscándolo. Con una historia por componente, el riel es el índice y cada
 * pantalla entra casi entera de una vez, que es cuando un muestrario sirve: lo
 * que se mira son las diferencias entre variantes vecinas, y para eso tienen que
 * estar a la vista juntas.
 */

type Story = { id: string; label: string; render: () => ReactNode }
/**
 * El grupo lleva un color de carpeta y no un icono del set, que es lo mismo que
 * hace el sidebar del producto con los espacios.
 *
 * El motivo es el mismo también: en una lista de grupos, **el color es lo que
 * deja encontrar uno de reojo, sin leer**. Con tres iconos monocromos hay que
 * leer las tres etiquetas para saber cuál es cuál; con tres carpetas de color,
 * la mano va sola a la de siempre.
 *
 * Y es una de las dos únicas excepciones al monocromo que se permiten en la
 * navegación: la carpeta es bicolor a propósito —relleno al 13% y la línea al
 * 55% del mismo tono— por eso es el único SVG que queda en un sistema de
 * iconos que es una fuente.
 */
type Group = { label: string; color: FolderColor; stories: Story[] }

const groups: Group[] = [
  {
    label: 'Tokens', color: 'purple',
    stories: [
      { id: 'color', label: 'Color', render: () => <ColorSection /> },
      { id: 'type', label: 'Tipografía', render: () => <TypeSection /> },
      { id: 'measure', label: 'Medidas y radios', render: () => <MeasureSection /> },
      { id: 'relief', label: 'Relieve', render: () => <ReliefSection /> },
    ],
  },
  {
    label: 'Componentes', color: 'blue',
    stories: [
      { id: 'button', label: 'Button', render: () => <ButtonStory /> },
      { id: 'icon-button', label: 'IconButton', render: () => <IconButtonStory /> },
      { id: 'text-field', label: 'TextField', render: () => <TextFieldStory /> },
      { id: 'textarea', label: 'Textarea', render: () => <TextareaStory /> },
      { id: 'select', label: 'Select', render: () => <SelectStory /> },
      { id: 'checkbox', label: 'Checkbox', render: () => <CheckboxStory /> },
      { id: 'radio', label: 'Radio', render: () => <RadioStory /> },
      { id: 'switch', label: 'Switch', render: () => <SwitchStory /> },
      { id: 'slider', label: 'Slider', render: () => <SliderStory /> },
      { id: 'segmented', label: 'Segmented', render: () => <SegmentedStory /> },
      { id: 'chip', label: 'Chip', render: () => <ChipStory /> },
      { id: 'spinner', label: 'Spinner', render: () => <SpinnerStory /> },
      { id: 'avatar', label: 'Avatar', render: () => <AvatarStory /> },
      { id: 'icon', label: 'Icon', render: () => <IconStory /> },
      { id: 'kbd', label: 'Kbd', render: () => <KbdStory /> },
      { id: 'divider', label: 'Divider', render: () => <DividerStory /> },
      { id: 'empty-state', label: 'EmptyState', render: () => <EmptyStateStory /> },
    ],
  },
  {
    label: 'Charts', color: 'orange',
    stories: [
      { id: 'bar-chart', label: 'BarChart', render: () => <ChartStory /> },
    ],
  },
  {
    label: 'Patrones', color: 'green',
    stories: [
      { id: 'list', label: 'List', render: () => <ListStory /> },
      { id: 'book', label: 'Book', render: () => <BookStory /> },
      { id: 'folder', label: 'Folder', render: () => <FolderStory /> },
      { id: 'table', label: 'Table', render: () => <TableStory /> },
      { id: 'containers', label: 'Card y Row', render: () => <ContainersStory /> },
      { id: 'nav', label: 'NavItem', render: () => <NavStory /> },
      { id: 'menu', label: 'Menu', render: () => <MenuStory /> },
      { id: 'dropdown', label: 'Dropdown', render: () => <DropdownStory /> },
      { id: 'tooltip', label: 'Tooltip', render: () => <TooltipStory /> },
      { id: 'popover', label: 'Popover', render: () => <PopoverStory /> },
      { id: 'modal', label: 'Modal', render: () => <ModalStory /> },
    ],
  },
]

const INTRO = 'intro'

export function App() {
  const [current, setCurrent] = useState<string>(INTRO)
  const { prefs, set } = usePrefs()

  /* El grupo de la historia abierta arranca desplegado. Sin esto, entrar
     directo a una historia deja su propio grupo cerrado y el riel no dice
     dónde estás parado. */
  const [open, setOpen] = useState<string[]>(() => ['Componentes'])
  const groupOf = useMemo(
    () => Object.fromEntries(groups.flatMap(g => g.stories.map(s => [s.id, g.label]))),
    [],
  )

  const go = (id: string) => {
    setCurrent(id)
    const g = groupOf[id]
    if (g) setOpen(o => (o.includes(g) ? o : [...o, g]))
  }

  const story = groups.flatMap(g => g.stories).find(s => s.id === current)

  return (
    <div className="flex min-h-screen">
      {/* El riel usa la misma receta que el sidebar del producto —`navItemClass`
          más `NavItemBody`, y `navSubItemClass` para las hojas— y no una copia
          parecida. El kit se mira al lado de la app, así que una diferencia acá
          se lee como un bug del sistema. Y una copia se separa de la original
          sola con cada cambio: esta ya se había ido a `pressed`.

          Ancho 220 y padding lateral 20, los mismos del shell. */}
      <nav className="fixed top-0 bottom-0 left-0 flex w-[220px] shrink-0 flex-col overflow-y-auto border-r border-line bg-canvas px-5 py-5">
        <button onClick={() => setCurrent(INTRO)} className="mb-4 pl-[3px] text-left">
          <div className="font-display text-base font-bold tracking-[-0.015em]">melu · ui kit</div>
          <div className="mt-1 text-2xs text-ink-muted">Los tokens y las piezas, en vivo</div>
        </button>

        <div className="flex flex-col gap-0.5">
          <button onClick={() => setCurrent(INTRO)} className={navItemClass({ active: current === INTRO })}>
            <NavItemBody icon="star_shine" label="Introducción" active={current === INTRO} />
          </button>

          {groups.map(g => {
            const isOpen = open.includes(g.label)
            const hasCurrent = g.stories.some(s => s.id === current)
            return (
              <div key={g.label}>
                <div className="relative flex items-center">
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => setOpen(o => (isOpen ? o.filter(x => x !== g.label) : [...o, g.label]))}
                      aria-expanded={isOpen}
                      className={cx('w-full', navItemClass({ active: hasCurrent && !isOpen }))}
                    >
                      {/* `chip={false}`: la carpeta ya trae su color, y el chip
                          de papel detrás le pelea el contraste en vez de
                          levantarla. Es la misma llamada que el shell. */}
                      <NavItemBody
                        glyph={<FolderIcon color={g.color} size={20} />}
                        label={g.label}
                        active={hasCurrent && !isOpen}
                        chip={false}
                      />
                    </button>
                  </div>
                  <span className="pointer-events-none absolute right-1.5 p-1 text-ink-muted">
                    <Icon
                      name="keyboard_arrow_down"
                      size={16}
                      className={cx('transition-transform duration-[190ms] ease-out', isOpen && 'rotate-180')}
                    />
                  </span>
                </div>

                {isOpen && (
                  <div className="flex flex-col gap-0.5">
                    {g.stories.map(s => (
                      <button
                        key={s.id}
                        onClick={() => go(s.id)}
                        aria-current={s.id === current ? 'page' : undefined}
                        className={navSubItemClass({ active: s.id === current })}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-6 pl-[3px]">
          <span className="text-2xs text-ink-muted">{prefs.theme === 'dark' ? 'Oscuro' : 'Claro'}</span>
          <IconButton
            icon={prefs.theme === 'dark' ? 'light_mode' : 'dark_mode'}
            label={prefs.theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
            size="sm"
            variant="raised"
            onClick={() => set('theme', prefs.theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
      </nav>

      <main className="ml-[220px] min-w-0 flex-1 px-8 py-9">
        {/* `key`: sin eso, al cambiar de historia React reusa los nodos y los
            componentes con estado —un switch, un chip removido— aparecen con el
            estado de la historia anterior. */}
        <div key={current} className="mx-auto flex max-w-[1100px] flex-col gap-10">
          {story ? story.render() : <Intro go={go} />}
        </div>
      </main>
    </div>
  )
}
