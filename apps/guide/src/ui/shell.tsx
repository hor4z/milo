import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FolderIcon, Icon, type IconName, Avatar, Button, cx, IconButton, Kbd, Dropdown, type DropdownItem, usePrefs, navItemClass, navSubItemClass, NavItemBody, SettingsModal } from '@melu/ui'
import { CommandPalette } from './command-palette'
import { NotificationsButton } from './notifications'
import { spaces } from '../data'

/* ------------------------------------------------------------------- marca */

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex h-20 items-center gap-2.5" aria-label="melu, inicio">
      {/* El logo es geometría y no un archivo: vive en el código para que
          herede el color del tema en vez de traer el suyo. */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="10" fill="var(--solid)" />
        <path d="M9 22V13.5a4.5 4.5 0 019 0V22" stroke="var(--on-solid)" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18 22V13.5A4.5 4.5 0 0122.5 9" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {!compact && <span className="text-[19px] font-semibold tracking-[-0.03em]">melu</span>}
    </Link>
  )
}

/* ----------------------------------------------------------------- sidebar */

type NavGroup = {
  label: string
  icon: IconName
  to: string
  badge?: string
  children?: { label: string; to: string }[]
}

const groups: NavGroup[] = [
  {
    label: 'Explorar', icon: 'explore', to: '/explorar',
    children: [
      { label: 'Recetas', to: '/explorar/recetas' },
      { label: 'Publicadas', to: '/explorar/publicadas' },
    ],
  },
  { label: 'Recursos', icon: 'layers', to: '/recursos', badge: '84' },
  { label: 'Guardadas', icon: 'favorite', to: '/guardadas' },
]

/**
 * El item de nav del router. La forma y el estado activo salen de la receta del
 * paquete (`navItemClass` + `NavItemBody`); lo único que agrega esto es el
 * `NavLink` y el `isActive` que le corresponde.
 *
 * Antes esta geometría estaba escrita acá y copiada otras tres veces más abajo
 * —los espacios, «Nuevo espacio», «Contraer»— y una cuarta en el riel del kit,
 * que fue la que se desincronizó: quedó con `pressed` en vez del anillo.
 */
function NavItem({
  to, icon, label, badge, collapsed, end,
}: { to: string; icon: IconName; label: string; badge?: string; collapsed?: boolean; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) => navItemClass({ active: isActive, collapsed })}
    >
      {({ isActive }) => (
        <NavItemBody icon={icon} label={label} badge={badge} active={isActive} collapsed={collapsed} />
      )}
    </NavLink>
  )
}

function Sidebar() {
  const { prefs, set } = usePrefs()
  const collapsed = prefs.sidebarCollapsed
  const { pathname } = useLocation()

  /* Un grupo arranca abierto si la ruta activa está adentro: al recargar en
     /explorar/recetas, un grupo cerrado esconde el item que está activo. */
  const [openGroups, setOpenGroups] = useState<string[]>(() =>
    groups.filter(g => g.children?.some(c => pathname.startsWith(c.to))).map(g => g.label),
  )
  const toggle = (label: string) =>
    setOpenGroups(o => (o.includes(label) ? o.filter(l => l !== label) : [...o, label]))

  return (
    <div
      className={cx(
        'fixed top-0 bottom-0 left-0 z-40 border-r border-line bg-canvas',
        'transition-[width] duration-[190ms] ease-out',
        collapsed ? 'w-[72px] px-3' : 'w-[220px] px-5',
      )}
    >
      <Brand compact={collapsed} />

      <div className="flex h-[calc(100%-80px)] flex-col overflow-y-auto pb-5">
        <nav className="mb-3 flex flex-col gap-0.5">
          {groups.map(g => {
            const isOpen = openGroups.includes(g.label)
            const hasChildren = !!g.children?.length
            return (
              <div key={g.label}>
                <div className="relative flex items-center">
                  <div className="min-w-0 flex-1">
                    <NavItem to={g.to} icon={g.icon} label={g.label} badge={g.badge} collapsed={collapsed} />
                  </div>
                  {hasChildren && !collapsed && (
                    <button
                      onClick={() => toggle(g.label)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Cerrar' : 'Abrir'} ${g.label}`}
                      className="absolute right-1.5 rounded-sm p-1 text-ink-muted hover:bg-active hover:text-ink"
                    >
                      <Icon name="keyboard_arrow_down" size={16} className={cx('transition-transform duration-[190ms] ease-out', isOpen && 'rotate-180')} />
                    </button>
                  )}
                </div>

                {/* Los hijos entran con sangría de 48: la del texto del padre,
                    para que las etiquetas queden en la misma columna. */}
                {hasChildren && isOpen && !collapsed && (
                  <div className="flex flex-col gap-0.5">
                    {g.children!.map(c => (
                      <NavLink
                        key={c.to}
                        to={c.to}
                        className={({ isActive }) => navSubItemClass({ active: isActive })}
                      >
                        {c.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="px-2.5 py-2.5 text-xs font-medium text-ink-muted/70">Mis espacios</div>
        )}

        <nav className="flex flex-col gap-0.5">
          <NavItem to="/" icon="deployed_code" label="Mis actividades" collapsed={collapsed} end />

          <button className={navItemClass({ collapsed })} title={collapsed ? 'Nuevo espacio' : undefined}>
            <NavItemBody icon="create_new_folder" label="Nuevo espacio" collapsed={collapsed} />
          </button>

          {spaces.map(s => (
            <NavLink
              key={s.id}
              to={`/espacio/${s.id}`}
              title={collapsed ? s.name : undefined}
              className={({ isActive }) => navItemClass({ active: isActive, collapsed })}
            >
              {({ isActive }) => (
                /* `chip={false}`: la carpeta ya trae su color, y el chip de
                   papel detrás le pelea el contraste en vez de levantarla. */
                <NavItemBody
                  glyph={<FolderIcon color={s.color} size={20} />}
                  label={s.name}
                  active={isActive}
                  collapsed={collapsed}
                  chip={false}
                />
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => set('sidebarCollapsed', !collapsed)}
          className={cx('mt-auto', navItemClass({ collapsed, muted: true }))}
        >
          <NavItemBody
            glyph={<Icon name={collapsed ? 'arrow_forward' : 'arrow_back'} size={20} />}
            label="Contraer"
            collapsed={collapsed}
          />
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ topbar */

function Topbar({ onOpenSettings, onOpenPalette }: { onOpenSettings: () => void; onOpenPalette: () => void }) {
  const navigate = useNavigate()
  const { prefs, set } = usePrefs()

  const menu: DropdownItem[] = [
    { label: 'Mi perfil', icon: 'person', onSelect: onOpenSettings },
    { label: 'Plan', icon: 'credit_card', onSelect: () => navigate('/planes') },
    { label: 'Ajustes', icon: 'tune', onSelect: onOpenSettings },
    { label: prefs.theme === 'dark' ? 'Tema claro' : 'Tema oscuro', icon: prefs.theme === 'dark' ? 'light_mode' : 'dark_mode', onSelect: () => set('theme', prefs.theme === 'dark' ? 'light' : 'dark') },
    { label: 'Novedades', icon: 'star_shine', onSelect: () => navigate('/novedades') },
    /* Salir no va en rojo: el rojo es para lo que destruye algo, y cerrar
       sesión no borra nada. Gastarlo acá le quita el aviso a lo que sí importa. */
    { label: 'Salir', icon: 'logout', onSelect: () => navigate('/entrar') },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-3 bg-canvas/90 px-5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        {/* `lg` explícito: la topbar es de 80 y sus controles son de 40, que es
            el paso principal. Antes salía del default porque el `md` del
            IconButton medía 40 — ahora el `md` mide 36 en las dos piezas. */}
        <IconButton icon="arrow_back" label="Atrás" size="lg" onClick={() => navigate(-1)} />
        <IconButton icon="arrow_forward" label="Adelante" size="lg" onClick={() => navigate(1)} />
      </div>

      {/* El buscador no es un input: es un botón que abre la paleta. Un input
          que al enfocarse abre otra cosa deja el cursor titilando en un campo
          que ya no existe.

          Pero se dibuja como un campo vacío y no como un botón gris: fondo casi
          blanco (`--search-bg`), borde de un píxel y nada de relieve. En una
          topbar donde el que manda es tinta y el que acompaña es gris con
          relieve, un buscador gris y plano se lee como un tercer botón apagado.
          El borde es el que dibuja la caja; el fondo solo la separa del papel.

          Geometría: el icono va en un cuadro de 32 pegado al canto con 4 de
          aire, así el texto arranca a los 48 —la misma sangría que los subitems
          del nav— y el ⌘K queda a 10 del borde derecho, no a 12: el kbd ya trae
          su propio canto dibujado, y con 12 la caja se ve descentrada.

          El ⌘ y la K van separados por un espacio: pegados, la caja queda 2px
          más angosta y con el mismo radio de 6 se ve más redonda que hundida.

          El cuadro del icono es un span y no un botón como en la referencia: no
          se puede anidar un button dentro de otro, así que el icono se apoya en
          el hover del padre para pasar de gris a tinta. */}
      <button
        onClick={onOpenPalette}
        className="group relative ml-1 flex h-10 w-[260px] items-center rounded-lg border border-search-line bg-search pl-12 pr-2.5 text-left transition-colors hover:bg-search-hover max-md:w-10 max-md:px-0"
      >
        <span className="absolute inset-y-1 left-1 flex w-8 items-center justify-center">
          <Icon name="search" size={20} className="icon-muted transition-colors group-hover:text-ink" />
        </span>
        <span className="flex-1 text-xs font-medium text-ink-muted max-md:hidden">Buscar…</span>
        <span className="max-md:hidden"><Kbd>⌘ K</Kbd></span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <NotificationsButton />
        <Button variant="brand" size="lg" onClick={() => navigate('/')}>Crear</Button>
        <Dropdown
          items={menu}
          width={220}
          trigger={({ onClick, ref, ...rest }) => (
            <button
              ref={ref}
              onClick={onClick}
              {...rest}
              aria-label="Tu cuenta"
              className="ml-1 rounded-full p-[3px] transition-shadow hover:shadow-raised"
            >
              <Avatar name="Horacio Rivero" size={34} />
            </button>
          )}
        />
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------- shell */

export function AppShell({ children }: { children: React.ReactNode }) {
  const { prefs } = usePrefs()
  const [settings, setSettings] = useState(false)
  const [palette, setPalette] = useState(false)

  /* ⌘K / Ctrl+K abre la paleta desde cualquier parte. El `preventDefault` hace
     falta porque en Chrome ⌘K va a la barra de direcciones. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette(p => !p)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setSettings(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      {/* El contenido se corre con padding y no con un flex: el sidebar es
          `fixed`, así que no ocupa lugar en el flujo. */}
      <div
        className="transition-[padding] duration-[190ms] ease-out"
        style={{ paddingLeft: prefs.sidebarCollapsed ? 72 : 220 }}
      >
        <Topbar onOpenSettings={() => setSettings(true)} onOpenPalette={() => setPalette(true)} />
        <main className="min-w-0">{children}</main>
      </div>
      <SettingsModal
        open={settings}
        onClose={() => setSettings(false)}
        user={{
          name: 'Horacio Rivero',
          email: 'horacio.rivero@educabot.com',
          alias: 'Profe Horacio',
          school: 'Escuela N.º 12 · Distrito 7',
        }}
      />
      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        onOpenSettings={() => { setPalette(false); setSettings(true) }}
      />
    </div>
  )
}
