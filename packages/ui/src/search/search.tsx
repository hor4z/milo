import { useRef, type ComponentPropsWithoutRef, type Ref } from 'react'
import { Icon } from '../icon/icon'
import { Kbd } from '../kbd/kbd'
import { TextField } from '../text-field/text-field'
import { cx } from '../lib/cx'

type SearchProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'onChange' | 'value'> & {
  /** Lo que hay escrito: es controlado. */
  value: string
  /** Recibe el texto nuevo, y `''` cuando se limpia. */
  onValueChange: (v: string) => void
  /** Qué se busca, no "Buscar…" a secas. */
  placeholder?: string
  /** Las mismas tres del resto de los controles. */
  size?: 'sm' | 'md' | 'lg'
  /** El atajo que lo enfoca, a la derecha: `/`. Es un recordatorio, no la tecla: esa la escucha quien lo pone. */
  shortcut?: string
  /** Toma el ancho de lo que lo contiene. */
  block?: boolean
  className?: string
  ref?: Ref<HTMLInputElement>
}

/** El buscador: un campo con la lupa y una cruz que aparece cuando hay algo escrito. Es un `TextField` y no otro campo: se dibuja igual que los demás y hereda su inversión contra el fondo. */
export function Search({
  value, onValueChange, placeholder = 'Buscar…', size = 'sm',
  shortcut, block, className, ref, ...rest
}: SearchProps) {
  const caja = useRef<HTMLDivElement>(null)
  const foco = () => caja.current?.querySelector('input')?.focus()

  return (
    <TextField
      ref={caja}
      inputRef={ref}
      size={size}
      icon="search"
      value={value}
      onChange={e => onValueChange(e.target.value)}
      placeholder={placeholder}
      className={cx(block ? 'w-full' : 'w-[240px]', className)}
      suffix={value
        ? (
          <button
            type="button"
            aria-label="Limpiar la búsqueda"
            onClick={() => { onValueChange(''); foco() }}
            className="-mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded-sm text-ink-muted transition-colors ease-out duration-fast hover:bg-hover hover:text-ink"
          >
            <Icon name="close" size={14} />
          </button>
        )
        : shortcut
          ? <Kbd>{shortcut}</Kbd>
          : undefined}
      {...rest}
    />
  )
}
