import cls from './button.module.css'
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode, type Ref } from 'react'
import { Spinner } from '../spinner/spinner'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Solid y brand son el mismo rol. */
  variant?: 'solid' | 'brand' | 'muted' | 'ghost' | 'bad'
  /** 36 · 40 · 44. */
  size?: 'sm' | 'md' | 'lg'
  /** Antes del texto. Cualquier nodo, no solo un `Icon`: el botón le fija la caja para que mida lo mismo sea lo que sea. Cuando está cargando, el spinner ocupa su lugar. */
  iconStart?: ReactNode
  /** Después del texto, con la misma caja fija que `iconStart`. */
  iconEnd?: ReactNode
  /** Pone el spinner al principio y deja de aceptar clicks. */
  loading?: boolean
  /** Lo que el lector de pantalla anuncia mientras carga. */
  loadingLabel?: string
  /** Ocupa el ancho del contenedor. */
  block?: boolean
  /** Para usarlo como disparador de Dropdown o Popover. */
  ref?: Ref<HTMLButtonElement>
}

/** Una respuesta más rápida que una transición no alcanza a leerse, así que el
 *  spinner no aparece; y una vez que apareció se queda lo que dura un cambio de
 *  contenido, para que no se vaya antes de que el ojo lo registre. Los dos
 *  números son los del sistema: `--duration-fast` y `--duration-content`. */
const SPINNER_DELAY = 120
const SPINNER_MIN_VISIBLE = 280

function useSteadySpinner(loading: boolean) {
  const [visible, setVisible] = useState(false)
  const shownAt = useRef(0)

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => { shownAt.current = Date.now(); setVisible(true) }, SPINNER_DELAY)
      return () => clearTimeout(t)
    }
    if (!visible) return
    const left = SPINNER_MIN_VISIBLE - (Date.now() - shownAt.current)
    if (left <= 0) { setVisible(false); return }
    const t = setTimeout(() => setVisible(false), left)
    return () => clearTimeout(t)
  }, [loading, visible])

  return visible
}

export function Button({
  variant = 'muted', size = 'md', iconStart, iconEnd, loading = false,
  loadingLabel = 'Cargando', block, type = 'button', disabled, className, children, ...rest
}: ButtonProps) {
  const c = control[size]
  const spinning = useSteadySpinner(loading)
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={spinning || undefined}
      className={cx(
        `${cls.root} touch-target`,
        cls.motion,
        cls.pressed,
        cls.disabled,
        spinning && cls.loading,
        variants[variant], c.box, c.px, c.text, c.gap, c.radius, block && cls.block, className,
      )}
      {...rest}
    >
      {(spinning || iconStart) && (
        <span className={cls.slot} style={{ '--icon-size': `${c.icon}px` } as CSSProperties}>
          {spinning ? <Spinner size={c.icon} on="control" label={loadingLabel} /> : iconStart}
        </span>
      )}
      {children}
      {iconEnd && (
        <span className={cls.slot} style={{ '--icon-size': `${c.icon}px` } as CSSProperties}>
          {iconEnd}
        </span>
      )}
    </button>
  )
}
