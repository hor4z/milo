import s from './split-button.module.css'
import { createContext, useContext, type ReactNode } from 'react'
import { Button } from '../button/button'
import { ButtonGroup } from '../button-group/button-group'
import { Icon, type IconName } from '../icon/icon'
import { Menu } from '../menu/menu'
import { Popover } from '../popover/popover'
import { cx } from '../lib/cx'
import { takePart } from '../lib/parts'

const ancho = { sm: s.sm, md: s.md, lg: s.lg }

type Ctx = { variant: Variante; size: Paso; disabled?: boolean; close: () => void }
const SplitContext = createContext<Ctx | null>(null)

type Variante = 'brand' | 'solid' | 'muted' | 'ghost' | 'bad'
type Paso = 'sm' | 'md' | 'lg'

/** La acción que se hace casi siempre: la mitad ancha, la que se toca directo. */
function Action({ onClick, children }: {
  /** Lo que hace la acción principal. */
  onClick?: () => void
  children: ReactNode
}) {
  const ctx = useContext(SplitContext)
  return (
    <Button variant={ctx?.variant} size={ctx?.size} disabled={ctx?.disabled} onClick={onClick}>
      {children}
    </Button>
  )
}

/** Una de las que casi nunca: van adentro del menú que abre la flecha. */
function Item({ icon, danger, disabled, onSelect, children }: {
  /** A la izquierda, en gris. */
  icon?: IconName
  /** Borrar, descartar: lo que no se deshace. */
  danger?: boolean
  disabled?: boolean
  /** Cerrar el menú lo hace la pieza. */
  onSelect?: () => void
  children: ReactNode
}) {
  const ctx = useContext(SplitContext)
  return (
    <Menu.Item icon={icon} danger={danger} disabled={disabled} onSelect={() => { onSelect?.(); ctx?.close() }}>
      {children}
    </Menu.Item>
  )
}

/** La acción que se hace casi siempre, y al lado las que casi nunca. Es lo que evita una fila de cinco botones donde cuatro no se tocan nunca. */
function Root({ variant = 'brand', size = 'md', disabled, menuLabel, width = 220, children }: {
  /** El mismo juego que `Button`, y vale para las dos mitades. */
  variant?: Variante
  /** La escalera de siempre. */
  size?: Paso
  disabled?: boolean
  /** Qué hay en el menú, para quien lo escucha. Sin esto, "Más opciones". */
  menuLabel?: string
  /** El ancho del panel en px. */
  width?: number
  /** El `SplitButton.Action` y los `SplitButton.Item` que van en el menú. */
  children: ReactNode
}) {
  const [accion, resto] = takePart(children, Action)
  const [items] = takePart(resto, Item)
  const nombre = typeof (accion[0] as { props?: { children?: unknown } })?.props?.children === 'string'
    ? String((accion[0] as { props: { children: string } }).props.children)
    : undefined
  const otras = menuLabel ?? (nombre ? `Más opciones de ${nombre}` : 'Más opciones')

  return (
    <ButtonGroup label={nombre ?? otras}>
      <SplitContext.Provider value={{ variant, size, disabled, close: () => {} }}>
        {accion}
      </SplitContext.Provider>
      <Popover
        width={width}
        align="end"
        trigger={({ onClick, ref, 'aria-expanded': expanded }) => (
          <Button
            ref={ref}
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={otras}
            aria-expanded={expanded}
            aria-haspopup="menu"
            onClick={onClick}
            className={cx(s.chevron, ancho[size])}
          >
            <Icon name="keyboard_arrow_down" size={size === 'sm' ? 16 : 18} />
          </Button>
        )}
      >
        {close => (
          <Menu label={otras}>
            <SplitContext.Provider value={{ variant, size, disabled, close }}>
              {items}
            </SplitContext.Provider>
          </Menu>
        )}
      </Popover>
    </ButtonGroup>
  )
}

export const SplitButton = Object.assign(Root, { Action, Item })
