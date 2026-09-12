import { useState } from 'react'
import { cx } from '../lib/cx'
import { Button } from '../button/button'
import { Chip } from '../chip/chip'
import { Row } from '../row/row'
import { Segmented } from '../segmented/segmented'
import { Select } from '../select/select'
import { Switch } from '../switch/switch'
import { Icon, type IconName } from '../icon/icon'
import { Modal } from '../modal/modal'
import { usePrefs } from '../prefs/prefs'

type SectionId = 'general' | 'perfil' | 'seguridad' | 'avisos'

/** Quién está mirando los ajustes. */
export type SettingsUser = {
  name: string
  email: string
  /** Cómo lo ven los aprendices. */
  alias: string
  school: string
}

const sections: { id: SectionId; label: string; icon: IconName }[] = [
  { id: 'general', label: 'General', icon: 'tune' },
  { id: 'perfil', label: 'Perfil', icon: 'person' },
  { id: 'seguridad', label: 'Seguridad', icon: 'verified_user' },
  { id: 'avisos', label: 'Avisos', icon: 'notifications' },
]

/** Los ajustes en un modal y no en una página. */
export function SettingsModal({ open, onClose, user }: {
  open: boolean
  onClose: () => void
  user: SettingsUser
}) {
  const [section, setSection] = useState<SectionId>('general')

  return (
    <Modal open={open} onClose={onClose} width={594} label="Ajustes">
      <div className="flex h-[448px] max-h-[calc(100vh-2rem)]">
        <nav className="flex w-[180px] shrink-0 flex-col gap-0.5 border-r border-line p-3">
          {sections.map(s => {
            const active = s.id === section
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex h-10 items-center gap-3 rounded-lg border pr-2.5 pl-[3px] text-left text-xs font-semibold',
                  'text-ink transition-[background-color,border-color] duration-[120ms] ease-out',
                  active
                    ? 'border-line-strong bg-muted'
                    : 'border-transparent hover:bg-hover',
                )}
              >
                <span className={cx(
                  'flex size-8 shrink-0 items-center justify-center rounded-md transition-[background-color,box-shadow] duration-[120ms]',
                  active && 'bg-surface shadow-[0_0_0_1px_var(--border)]',
                )}>
                  <Icon name={s.icon} size={20} className={active ? 'text-ink' : 'icon-muted'} />
                </span>
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center border-b border-line px-6">
            <h2 className="text-xs font-semibold">{sections.find(s => s.id === section)!.label}</h2>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {section === 'general' && <GeneralSection user={user} />}
            {section === 'perfil' && <ProfileSection user={user} />}
            {section === 'seguridad' && <SecuritySection />}
            {section === 'avisos' && <NoticesSection />}
          </div>
        </div>
      </div>
    </Modal>
  )
}

function GeneralSection({ user }: { user: SettingsUser }) {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <EditableRow label="Nombre" value={user.name} />
      <Row label="Correo">
        <span className="text-xs text-ink-muted">{user.email}</span>
      </Row>
      <Row label="Tema">
        <Segmented
          size="sm"
          value={prefs.theme}
          onChange={v => set('theme', v)}
          options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Oscuro' }]}
        />
      </Row>
      <Row label="Sugerir consignas mientras escribo" hint="Aparecen abajo del cursor y se aceptan con Tab.">
        <Switch checked={prefs.suggest} onChange={v => set('suggest', v)} label="Sugerir consignas" />
      </Row>
      <Row label="Abrir la última actividad al entrar">
        <Switch checked={prefs.resume} onChange={v => set('resume', v)} label="Abrir la última actividad" />
      </Row>
      <Row label="Mostrar el método en las tarjetas">
        <Switch checked={prefs.showLens} onChange={v => set('showLens', v)} label="Mostrar el método" />
      </Row>
      <Row label="Idioma">
        <Select width={148} value="Español (AR)" options={['Español (AR)', 'Español', 'Português', 'English']} />
      </Row>
    </div>
  )
}

function ProfileSection({ user }: { user: SettingsUser }) {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <EditableRow label="Cómo te ven los aprendices" value={user.alias} />
      <Row label="Rol" hint="Lo define quien coordina el espacio.">
        <Chip color="green">Guía</Chip>
      </Row>
      <Row label="Escuela">
        <span className="text-xs text-ink-muted">{user.school}</span>
      </Row>
      <Row label="Dejar que otros guías vean mis recetas" hint="Solo las que publiques, nunca los borradores.">
        <Switch checked={prefs.shareRecipes} onChange={v => set('shareRecipes', v)} label="Compartir recetas" />
      </Row>
      <Row label="Aparecer en el directorio de la escuela">
        <Switch checked={prefs.directory} onChange={v => set('directory', v)} label="Aparecer en el directorio" />
      </Row>
    </div>
  )
}

function SecuritySection() {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <Row label="Ingreso" hint="Se entra con Google y con nada más.">
        <Chip color="blue">Google</Chip>
      </Row>
      <Row label="Sesiones abiertas" hint="Chrome en Linux · Safari en iPhone">
        <Button size="sm">Cerrar las otras</Button>
      </Row>
      <Row label="Preguntar antes de borrar una actividad" hint="Con entregas adentro siempre pregunta; esto es para las vacías.">
        <Switch checked={prefs.confirmDelete} onChange={v => set('confirmDelete', v)} label="Preguntar antes de borrar" />
      </Row>
      <Row label="Registro de accesos">
        <Button size="sm" variant="ghost" iconEnd="download">Descargar</Button>
      </Row>
      <div className="border-t border-line px-6 py-4">
        <div className="rounded-xl bg-bad-subtle p-4">
          <div className="text-xs font-semibold text-ink">Borrar la cuenta</div>
          <p className="mt-1.5 text-2xs leading-relaxed text-ink-muted">
            Se van los espacios que coordinás y las actividades que escribiste. Las entregas de los
            aprendices quedan con su autor, no con vos.
          </p>
          <Button size="sm" variant="bad" className="mt-3">Borrar la cuenta</Button>
        </div>
      </div>
    </div>
  )
}

function NoticesSection() {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <Row label="Cuando entra una entrega">
        <Switch checked={prefs.notifySubmission} onChange={v => set('notifySubmission', v)} label="Avisar entregas" />
      </Row>
      <Row label="Cuando un aprendiz queda trabado" hint="Dos intentos sin avanzar en la misma fase.">
        <Switch checked={prefs.notifyStuck} onChange={v => set('notifyStuck', v)} label="Avisar trabas" />
      </Row>
      <Row label="Resumen de la semana" hint="Los domingos, con lo que pasó en cada espacio.">
        <Switch checked={prefs.notifyWeekly} onChange={v => set('notifyWeekly', v)} label="Resumen semanal" />
      </Row>
      <Row label="Novedades del producto">
        <Switch checked={prefs.notifyProduct} onChange={v => set('notifyProduct', v)} label="Novedades" />
      </Row>
      <Row label="Por dónde">
        <Select width={148} value="Correo" options={['Correo', 'Solo en la app', 'Correo y app']} />
      </Row>
    </div>
  )
}

/** El campo editable inline: se ve como texto hasta que lo tocás. */
function EditableRow({ label, value: initial }: { label: string; value: string }) {
  const [value, setValue] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initial)

  const commit = () => { setValue(draft.trim() || value); setEditing(false) }

  return (
    <div className="group flex min-h-14 items-center gap-4 border-t border-line px-6 py-4 first:border-t-0">
      <div className="min-w-0 flex-1 text-xs font-medium text-ink">{label}</div>
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') { setDraft(value); setEditing(false) }
          }}
          className="inset-relief h-8 w-48 rounded-md bg-muted px-2.5 text-right text-xs font-medium text-ink outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => { setDraft(value); setEditing(true) }}
          className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs font-medium text-ink hover:bg-hover"
        >
          {value}
          <Icon name="edit" size={16} className="icon-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}
    </div>
  )
}
