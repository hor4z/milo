import { Button } from '../button/button'
import { ButtonGroup } from '../button-group/button-group'
import { Dropdown, type DropdownItem } from '../dropdown/dropdown'
import { Icon } from '../icon/icon'

/** La acción que se hace casi siempre, y al lado las que casi nunca. Es lo que evita una fila de cinco botones donde cuatro no se tocan nunca: el que manda queda a la vista y el resto a un clic. */
export function SplitButton({
  label, onClick, items, variant = 'brand', size = 'md', disabled, menuLabel,
}: {
  /** La acción principal, la que se hace casi siempre. */
  label: string
  /** Lo que hace esa acción. */
  onClick?: () => void
  /** Las de al lado, en el menú. */
  items: DropdownItem[]
  /** El mismo juego que `Button`. */
  variant?: 'brand' | 'solid' | 'muted' | 'ghost' | 'bad'
  /** La escalera de siempre. */
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  /** Qué hay en el menú, para quien lo escucha. Sin esto dice "Más opciones". */
  menuLabel?: string
}) {
  const otras = menuLabel ?? `Más opciones de ${label}`
  return (
    <ButtonGroup label={label}>
      <Button variant={variant} size={size} disabled={disabled} onClick={onClick}>
        {label}
      </Button>
      <Dropdown
        items={items}
        label={otras}
        trigger={({ onClick: abrir, ref, 'aria-expanded': expanded }) => (
          <Button
            ref={ref}
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={otras}
            aria-expanded={expanded}
            aria-haspopup="menu"
            onClick={abrir}
          >
            <Icon name="keyboard_arrow_down" size={size === 'sm' ? 16 : 18} />
          </Button>
        )}
      />
    </ButtonGroup>
  )
}
