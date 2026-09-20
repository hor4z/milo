import type { ReactNode } from 'react'
import type { IconName } from '../icon/icon'
import { Menu } from '../menu/menu'
import { Popover } from '../popover/popover'

/** Una opción de la lista del `Dropdown`. */
export type DropdownItem = {
  /** Lo que dice la fila. */
  label: string
  /** El glifo de la izquierda, en gris. */
  icon?: IconName
  /** El atajo de teclado, a la derecha, en un `Kbd`. */
  shortcut?: string
  /** Lo que no se deshace: borrar, salir, revocar. */
  danger?: boolean
  /** Se queda a la vista y apagada; una opción que desaparece obliga a aprender el menú de nuevo. */
  disabled?: boolean
  /** Al elegirla, el panel se cierra solo. */
  onSelect?: () => void
}

/** El menú de opciones escrito como lista, que es lo más corto cuando el menú no tiene nada raro: cuatro filas con su icono y su acción. */
export function Dropdown({
  trigger, items, align = 'end', width = 220, label = 'Opciones',
}: {
  /** Recibe onClick, ref y aria-expanded. */
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  /** Las opciones, en el orden en que van. */
  items: DropdownItem[]
  /** Contra qué borde del disparador se alinea el panel. */
  align?: 'start' | 'end'
  /** El ancho del panel en px. */
  width?: number
  /** Qué menú es, para quien lo escucha. Por defecto, "Opciones". */
  label?: string
}) {
  return (
    <Popover
      align={align}
      width={width}
      trigger={({ onClick, ref, 'aria-expanded': expanded }) => trigger({ onClick, ref, 'aria-expanded': expanded })}
    >
      {close => (
        <Menu label={label}>
          {items.map((item, i) => (
            <Menu.Item key={i} icon={item.icon} danger={item.danger} disabled={item.disabled} onSelect={() => { item.onSelect?.(); close() }}>
              {item.shortcut && <Menu.Shortcut>{item.shortcut}</Menu.Shortcut>}
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
      )}
    </Popover>
  )
}
