import { useState } from 'react'
import { Modal, Button, Chip, cx, Row, Segmented, Select, Switch, Icon, type IconName, usePrefs } from '@melu/ui'

type SectionId = 'general' | 'perfil' | 'seguridad' | 'avisos'

const sections: { id: SectionId; label: string; icon: IconName }[] = [
  { id: 'general', label: 'General', icon: 'sliders' },
  { id: 'perfil', label: 'Perfil', icon: 'user' },
  { id: 'seguridad', label: 'Seguridad', icon: 'shield' },
  { id: 'avisos', label: 'Avisos', icon: 'bell' },
]

/**
 * Los ajustes en un modal y no en una página.
 *
 * La diferencia de sensación no está en el modal: está en que no perdés el
 * contexto. Por eso el fondo se atenúa apenas y por eso al cerrar no hay
 * navegación — seguís donde estabas, con el scroll donde lo dejaste.
 *
 * Rail de 180 que no scrollea + panel que sí. Si scrollean los dos, al bajar en
 * una sección larga desaparecen las secciones y no sabés dónde estás.
 *
 * El título de la sección va en 12/600, igual que el resto de la interfaz: un
 * encabezado grande acá compite con el rail, que es lo que hay que leer primero.
 */
export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [section, setSection] = useState<SectionId>('general')

  return (
    <Modal open={open} onClose={onClose} width={594} label="Ajustes">
      <div className="flex h-[448px] max-h-[calc(100vh-2rem)]">
        {/* ------- rail ------- */}
        <nav className="flex w-[180px] shrink-0 flex-col gap-0.5 border-r border-line p-3">
          {sections.map(s => {
            const active = s.id === section
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex h-10 items-center gap-3 rounded-lg border pr-2.5 pl-[3px] text-left text-xs font-semibold',
                  'text-ink transition-[background-color,border-color] duration-[120ms] ease-out',
                  /* El borde está siempre, transparente cuando no está activo:
                     si apareciera solo al activarse, el texto se correría un
                     píxel a cada click. */
                  active
                    ? 'border-line-strong bg-muted'
                    : 'border-transparent hover:bg-hover',
                )}
              >
                {/* El chip de 32 con el icono adentro. Se pinta de blanco solo
                    cuando la sección está activa: es lo que la separa sin
                    teñir el texto ni agregar sombra. Radio 10, el escalón de la
                    escala más cercano al que pide el anidado (12 del item
                    menos sus 3 de padding). */}
                <span className={cx(
                  'flex size-8 shrink-0 items-center justify-center rounded-md transition-[background-color,box-shadow] duration-[120ms]',
                  /* El chip blanco sobre la pastilla apagada son cuatro pasos de
                     diferencia: sin canto no se lee como una superficie aparte,
                     se lee blando. La línea de 1px es la misma que usa el chip
                     del sidebar activo, así los dos estados se explican igual. */
                  active && 'bg-surface shadow-[0_0_0_1px_var(--border)]',
                )}>
                  {/* El trazo NO cambia con el estado: 1.5 siempre. Con 1 en
                      el activo y 1.5 en el inactivo, al seleccionar cambiaba el
                      grosor del dibujo y el icono daba un salto de peso. Lo que
                      distingue el estado es el color, nada más. */}
                  <Icon name={s.icon} size={20} weight={1.5} className={active ? 'text-ink' : 'text-icon-muted'} />
                </span>
                {s.label}
              </button>
            )
          })}
        </nav>

        {/* ------- panel ------- */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center border-b border-line px-6">
            <h2 className="text-xs font-semibold">{sections.find(s => s.id === section)!.label}</h2>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {section === 'general' && <GeneralSection />}
            {section === 'perfil' && <PerfilSection />}
            {section === 'seguridad' && <SeguridadSection />}
            {section === 'avisos' && <AvisosSection />}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------------- */

function GeneralSection() {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <EditableRow label="Nombre" value="Horacio Rivero" />
      <Row label="Correo">
        <span className="text-xs text-ink-muted">horacio.rivero@educabot.com</span>
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

function PerfilSection() {
  const { prefs, set } = usePrefs()
  return (
    <div>
      <EditableRow label="Cómo te ven los aprendices" value="Profe Horacio" />
      <Row label="Rol" hint="Lo define quien coordina el espacio.">
        <Chip color="green">Guía</Chip>
      </Row>
      <Row label="Escuela">
        <span className="text-xs text-ink-muted">Escuela N.º 12 · Distrito 7</span>
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

function SeguridadSection() {
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

function AvisosSection() {
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

/* ------------------------------------------------------- piezas de la fila */

/**
 * El campo editable inline: se ve como texto hasta que lo tocás. El lápiz
 * aparece en hover del contenedor y no siempre: con el lápiz permanente, seis
 * filas seguidas se llenan de iconos y ninguno se ve.
 */
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
            /* Escape descarta y no guarda: es la única forma de arrepentirse. */
            if (e.key === 'Escape') { setDraft(value); setEditing(false) }
          }}
          className="inset-relief h-8 w-48 rounded-md bg-muted px-2.5 text-right text-xs font-medium text-ink outline-none"
        />
      ) : (
        <button
          onClick={() => { setDraft(value); setEditing(true) }}
          className="flex items-center gap-2 rounded-md px-1.5 py-1 text-xs font-medium text-ink hover:bg-hover"
        >
          {value}
          <Icon name="pencil" size={16} className="text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      )}
    </div>
  )
}
