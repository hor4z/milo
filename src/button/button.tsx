import cls from './button.module.css'
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type Ref } from 'react'
import { Icon, type IconName } from '../icon/icon'
import { Spinner } from '../spinner/spinner'
import { control, variants } from '../lib/control'
import { cx } from '../lib/cx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Solid y brand son el mismo rol. */
  variant?: 'solid' | 'brand' | 'muted' | 'ghost' | 'bad'
  /** 36 · 40 · 44. */
  size?: 'sm' | 'md' | 'lg'
  /** Antes del texto. Cuando el botón está cargando, el spinner ocupa su lugar. */
  iconStart?: IconName
  /** Después del texto. */
  iconEnd?: IconName
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
const ESPERA = 120
const MINIMO = 280

function useSinParpadeo(loading: boolean) {
  const [visible, setVisible] = useState(false)
  const desde = useRef(0)

  useEffect(() => {
    if (loading) {
      const t = setTimeout(() => { desde.current = Date.now(); setVisible(true) }, ESPERA)
      return () => clearTimeout(t)
    }
    if (!visible) return
    const resto = MINIMO - (Date.now() - desde.current)
    if (resto <= 0) { setVisible(false); return }
    const t = setTimeout(() => setVisible(false), resto)
    return () => clearTimeout(t)
  }, [loading, visible])

  return visible
}

export function Button({
  variant = 'muted', size = 'md', iconStart, iconEnd, loading = false,
  loadingLabel = 'Cargando', block, type = 'button', disabled, className, children, ...rest
}: ButtonProps) {
  const c = control[size]
  const cargando = useSinParpadeo(loading)
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={cargando || undefined}
      className={cx(
        `${cls.root} touch-target`,
        cls.motion,
        cls.disabled,
        cargando && cls.loading,
        variants[variant], c.box, c.px, c.text, c.gap, c.radius, block && cls.block, className,
      )}
      {...rest}
    >
      {cargando
        ? <Spinner size={c.icon} on="control" label={loadingLabel} />
        : iconStart && <Icon name={iconStart} size={c.icon} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={c.icon} />}
    </button>
  )
}
