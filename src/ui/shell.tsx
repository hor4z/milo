import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FolderIcon, Icon, type IconName } from './icon'
import { Avatar, Button, cx, IconButton, Kbd } from './primitives'
import { Dropdown, type MenuItem } from './overlay'
import { SettingsModal } from './settings-modal'
import { CommandPalette } from './command-palette'
import { NotificationsButton } from './notifications'
import { usePrefs } from '../prefs'
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
    label: 'Explorar', icon: 'compass', to: '/explorar',
    children: [
      { label: 'Recetas', to: '/explorar/recetas' },
      { label: 'Publicadas', to: '/explorar/publicadas' },
    ],
  },
  { label: 'Recursos', icon: 'layers', to: '/recursos', badge: '84' },
  { label: 'Guardadas', icon: 'heart', to: '/guardadas' },
]

/**
 * El item de navegación: 40 de alto, radio 12, el icono en un cuadrado de 34
 * pegado al borde izquierdo (padding de 3) y el texto a 12/600.
 *
 * El activo no se marca con color sino con relieve: superficie blanca sobre el
 * papel del sidebar, con su anillo y su luz interior. En una interfaz monocroma
 * eso distingue más que teñir el texto, y no gasta el único acento que hay.
 */
function NavItem({
  to, icon, label, badge, collapsed, end,
}: { to: string; icon: IconName; label: string; badge?: string; collapsed?: boolean; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) => cx(
        'group/nav flex h-10 items-center gap-3 rounded-lg text-xs font-semibold',
        'transition-[background-color,box-shadow] duration-[120ms] ease-out',
        collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
        /* El activo es una pastilla clara con un borde de un píxel, y el icono
           pasa a un chip blanco adentro. El inactivo NO va en gris: el texto
           queda en tinta y solo el fondo cambia. Con la etiqueta en gris, una
           lista de siete espacios se lee como si estuviera toda deshabilitada. */
        isActive ? 'bg-muted text-ink shadow-[0_0_0_1px_var(--border)]' : 'text-ink hover:bg-hover',
      )}
    >
      {({ isActive }) => (
        <>
          <span className="flex size-[34px] shrink-0 items-center justify-center">
            <span className={cx(
              'flex size-[26px] items-center justify-center rounded-md transition-[background-color,box-shadow] duration-[120ms]',
              isActive && 'bg-surface shadow-[0_0_0_1px_var(--border)]',
            )}>
              <Icon name={icon} size={20} className="text-ink" />
            </span>
          </span>
          {!collapsed && <span className="min-w-0 flex-1 truncate">{label}</span>}
          {/* El badge va hundido, como el kbd: un contador no es accionable. */}
          {!collapsed && badge && (
            <span className="inset-relief tabular rounded-sm bg-muted px-1.5 py-0.5 text-2xs font-medium text-ink-muted">{badge}</span>
          )}
        </>
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
                      <Icon name="chevronDown" size={16} className={cx('transition-transform duration-[190ms] ease-out', isOpen && 'rotate-180')} />
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
                        className={({ isActive }) => cx(
                          'flex h-9 items-center rounded-lg pr-3 pl-12 text-xs font-semibold transition-colors duration-[120ms]',
                          isActive ? 'text-ink' : 'text-ink-muted hover:text-ink',
                        )}
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
          <NavItem to="/" icon="cube" label="Mis actividades" collapsed={collapsed} end />

          <button
            className={cx(
              'flex h-10 items-center gap-3 rounded-lg text-xs font-semibold text-ink transition-colors duration-[120ms] hover:bg-hover',
              collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
            )}
            title={collapsed ? 'Nuevo espacio' : undefined}
          >
            <span className="flex size-[34px] shrink-0 items-center justify-center">
              <Icon name="folderPlus" size={20} />
            </span>
            {!collapsed && 'Nuevo espacio'}
          </button>

          {spaces.map(s => (
            <NavLink
              key={s.id}
              to={`/espacio/${s.id}`}
              title={collapsed ? s.name : undefined}
              className={({ isActive }) => cx(
                'flex h-10 items-center gap-3 rounded-lg text-xs font-semibold transition-[background-color,box-shadow] duration-[120ms]',
                collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
                isActive ? 'bg-muted text-ink shadow-[0_0_0_1px_var(--border)]' : 'text-ink hover:bg-hover',
              )}
            >
              <span className="flex size-[34px] shrink-0 items-center justify-center">
                <FolderIcon color={s.color} size={20} />
              </span>
              {!collapsed && <span className="min-w-0 flex-1 truncate">{s.name}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => set('sidebarCollapsed', !collapsed)}
          className={cx(
            'mt-auto flex h-10 items-center gap-3 rounded-lg text-xs font-semibold text-ink-muted transition-colors hover:bg-hover hover:text-ink',
            collapsed ? 'justify-center px-0' : 'pr-3 pl-[3px]',
          )}
        >
          <span className="flex size-[34px] shrink-0 items-center justify-center">
            <Icon name={collapsed ? 'arrowRight' : 'arrowLeft'} size={20} />
          </span>
          {!collapsed && 'Contraer'}
        </button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ topbar */

function Topbar({ onOpenSettings, onOpenPalette }: { onOpenSettings: () => void; onOpenPalette: () => void }) {
  const navigate = useNavigate()
  const { prefs, set } = usePrefs()

  const menu: MenuItem[] = [
    { label: 'Mi perfil', icon: 'user', onSelect: onOpenSettings },
    { label: 'Plan', icon: 'card', onSelect: () => navigate('/planes') },
    { label: 'Ajustes', icon: 'sliders', onSelect: onOpenSettings },
    { label: prefs.theme === 'dark' ? 'Tema claro' : 'Tema oscuro', icon: prefs.theme === 'dark' ? 'sun' : 'moon', onSelect: () => set('theme', prefs.theme === 'dark' ? 'light' : 'dark') },
    { label: 'Novedades', icon: 'sparkle', onSelect: () => navigate('/novedades') },
    /* Salir no va en rojo: el rojo es para lo que destruye algo, y cerrar
       sesión no borra nada. Gastarlo acá le quita el aviso a lo que sí importa. */
    { label: 'Salir', icon: 'logout', onSelect: () => navigate('/entrar') },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-3 bg-canvas/90 px-5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <IconButton icon="arrowLeft" label="Atrás" onClick={() => navigate(-1)} />
        <IconButton icon="arrowRight" label="Adelante" onClick={() => navigate(1)} />
      </div>

      {/* El buscador no es un input: es un botón que abre la paleta. Un input
          que al enfocarse abre otra cosa deja el cursor titilando en un campo
          que ya no existe. */}
      <button
        onClick={onOpenPalette}
        className="ml-1 flex h-10 w-[260px] items-center gap-2.5 rounded-lg bg-muted px-3 text-left transition-colors hover:bg-sunken max-md:w-auto"
      >
        <Icon name="search" size={20} className="text-ink-muted" />
        <span className="flex-1 text-xs font-medium text-ink-muted max-md:hidden">Buscar…</span>
        <span className="max-md:hidden"><Kbd>⌘K</Kbd></span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <NotificationsButton />
        <Button variant="raised" size="lg" onClick={() => navigate('/')}>Crear</Button>
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
      <SettingsModal open={settings} onClose={() => setSettings(false)} />
      <CommandPalette
        open={palette}
        onClose={() => setPalette(false)}
        onOpenSettings={() => { setPalette(false); setSettings(true) }}
      />
    </div>
  )
}
