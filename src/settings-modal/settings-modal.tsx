import cls from './settings-modal.module.css'
import { useState } from 'react'
import { cx } from '../lib/cx'
import { Button } from '../button/button'
import { Chip } from '../chip/chip'
import { Row } from '../row/row'
import { Segmented } from '../segmented/segmented'
import { Select } from '../select/select'
import { Switch } from '../switch/switch'
import { Icon, type IconName } from '../icon/icon'
import { Modal, ModalHeader, ModalTitle } from '../modal/modal'
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
  /** Cerrado no monta nada. */
  open: boolean
  /** Al cerrar no hay navegación: seguís donde estabas. */
  onClose: () => void
  /** Quién está mirando los ajustes. */
  user: SettingsUser
}) {
  const [section, setSection] = useState<SectionId>('general')

  return (
    <Modal open={open} onClose={onClose} width={594}>
      <ModalHeader>
        <ModalTitle>Ajustes</ModalTitle>
      </ModalHeader>
      <div className={cls.root}>
        <nav className={cls.rail}>
          {sections.map(s => {
            const active = s.id === section
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  cls.railItem,
                  cls.railItemMotion,
                  active
                    ? cls.railItemActive
                    : cls.railItemIdle,
                )}
              >
                <span className={cls.railGlyph}>
                  <Icon name={s.icon} size={20} />
                </span>
                {s.label}
              </button>
            )
          })}
        </nav>

        <div className={cls.panel}>
          <header className={cls.panelHeader}>
            <h2 className={cls.panelTitle}>{sections.find(s => s.id === section)!.label}</h2>
          </header>
          <div className={cls.panelBody}>
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
        <span className={cls.accountEmail}>{user.email}</span>
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
        <span className={cls.schoolName}>{user.school}</span>
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
        <Button size="sm" variant="ghost" iconEnd={<Icon name="download" />}>Descargar</Button>
      </Row>
      <div className={cls.dangerZone}>
        <div className={cls.dangerBox}>
          <div className={cls.dangerTitle}>Borrar la cuenta</div>
          <p className={cls.dangerText}>
            Se van los espacios que coordinás y las actividades que escribiste. Las entregas de los
            aprendices quedan con su autor, no con vos.
          </p>
          <Button size="sm" variant="bad" className={cls.dangerButton}>Borrar la cuenta</Button>
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
    <div className={`${cls.row} group`}>
      <div className={cls.rowLabel}>{label}</div>
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
          className={`${cls.rowInput} inset-relief`}
        />
      ) : (
        <button
          type="button"
          onClick={() => { setDraft(value); setEditing(true) }}
          className={cls.rowEdit}
        >
          {value}
          <Icon name="edit" size={16} className={`${cls.rowEditIcon} icon-muted`} />
        </button>
      )}
    </div>
  )
}
