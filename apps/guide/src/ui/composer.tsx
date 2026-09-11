import { useRef, useState } from 'react'
import { Icon, Button, IconButton, cx, Dropdown, type MenuItem } from '@melu/ui'

/**
 * El composer flotante: se escribe la consigna y sale una actividad.
 *
 * Detalles que hacen la diferencia:
 * - El textarea crece con el contenido hasta un techo. Se hace midiendo
 *   `scrollHeight` después de resetear el alto: sin el reset, solo crece y
 *   nunca vuelve a encogerse al borrar.
 * - `Enter` envía y `Shift+Enter` hace salto de línea, como cualquier chat.
 * - La sombra tiene una capa `inset` blanca arriba: es lo que le da el borde de
 *   luz y lo separa del fondo sin usar un borde.
 */
export function Composer() {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)

  const grow = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`
  }

  const send = () => {
    if (!value.trim()) return
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const lensMenu: MenuItem[] = [
    { label: 'Indagación guiada', icon: 'compass' },
    { label: 'Proyecto por fases', icon: 'layers' },
    { label: 'Taller de escritura', icon: 'book' },
    { label: 'Resolución de problemas', icon: 'target' },
  ]

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6">
      <div className="pointer-events-auto w-full max-w-[680px] rounded-2xl bg-surface shadow-toolbar ring-1 ring-line">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={e => { setValue(e.target.value); grow() }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
          }}
          placeholder="Escribí una consigna y elegí con qué método se trabaja…"
          className="block max-h-[168px] w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-md text-ink outline-none placeholder:text-ink-subtle"
          style={{ boxShadow: 'none' }}
        />
        <div className="flex items-center gap-2 px-3 pb-3">
          <IconButton icon="plus" label="Adjuntar" size="sm" variant="muted" className="!rounded-full" />

          <Dropdown
            items={lensMenu}
            align="start"
            width={220}
            trigger={({ onClick, ref: tRef, ...rest }) => (
              <button
                ref={tRef}
                onClick={onClick}
                {...rest}
                className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent-subtle px-3 text-base font-medium text-accent ring-1 ring-line transition-colors hover:bg-accent-subtle/70"
              >
                <Icon name="sparkle" size={14} />
                Indagación
                <Icon name="chevronDown" size={13} />
              </button>
            )}
          />

          <span className="ml-auto flex items-center gap-1.5">
            <IconButton icon="mic" label="Dictar" size="sm" />
            <Button
              variant="solid"
              size="sm"
              disabled={!value.trim()}
              onClick={send}
              className={cx('!size-8 !rounded-full !px-0')}
              aria-label="Crear la actividad"
            >
              <Icon name="arrowUp" size={16} />
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
