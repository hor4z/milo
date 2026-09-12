import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FolderIcon, Icon, type IconName, Avatar, Button, cx, IconButton, Tooltip, Kbd, Dropdown, type DropdownItem, usePrefs, navItemClass, navSubItemClass, NavItemBody, SettingsModal } from '@milo/ui'
import { CommandPalette } from './command-palette'
import { NotificationsButton } from './notifications'
import { spaces } from '../data'

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="flex h-20 items-center rounded-lg px-1 text-lg font-semibold tracking-tight text-ink"
      aria-label="milo, inicio"
    >
      {compact ? 'm' : 'milo'}
    </Link>
  )
}

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

/** El item de nav del router. */
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
          <div className="px-2.5 py-2.5 text-xs font-medium text-ink-muted">Mis espacios</div>
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

function Topbar({ onOpenSettings, onOpenPalette }: { onOpenSettings: () => void; onOpenPalette: () => void }) {
  const navigate = useNavigate()
  const { prefs, set } = usePrefs()

  const menu: DropdownItem[] = [
    { label: 'Mi perfil', icon: 'person', onSelect: onOpenSettings },
    { label: 'Plan', icon: 'credit_card', onSelect: () => navigate('/planes') },
    { label: 'Ajustes', icon: 'tune', onSelect: onOpenSettings },
    { label: prefs.theme === 'dark' ? 'Tema claro' : 'Tema oscuro', icon: prefs.theme === 'dark' ? 'light_mode' : 'dark_mode', onSelect: () => set('theme', prefs.theme === 'dark' ? 'light' : 'dark') },
    { label: 'Novedades', icon: 'star_shine', onSelect: () => navigate('/novedades') },
    { label: 'Salir', icon: 'logout', onSelect: () => navigate('/entrar') },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-3 bg-canvas/90 px-5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <Tooltip label="Atrás">
          <IconButton icon="arrow_back" label="Atrás" size="lg" onClick={() => navigate(-1)} />
        </Tooltip>
        <Tooltip label="Adelante">
          <IconButton icon="arrow_forward" label="Adelante" size="lg" onClick={() => navigate(1)} />
        </Tooltip>
      </div>

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const { prefs } = usePrefs()
  const [settings, setSettings] = useState(false)
  const [palette, setPalette] = useState(false)

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
