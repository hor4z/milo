import type { ReactNode } from 'react'
import type { IconName } from '../icon/icon'
import { Menu, MenuItem } from '../menu/menu'
import { Popover } from '../popover/popover'

/** Una opción de la lista del `Dropdown`. */
export type DropdownItem = {
  label: string
  icon?: IconName
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onSelect?: () => void
}

/** El menú de opciones escrito como lista, que es lo más corto cuando el menú no tiene nada raro: cuatro filas con su icono y su acción. */
export function Dropdown({
  trigger, items, align = 'end', width = 220,
}: {
  /** Recibe onClick, ref y aria-expanded. */
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  width?: number
}) {
  return (
    <Popover
      align={align}
      width={width}
      trigger={({ onClick, ref, 'aria-expanded': expanded }) => trigger({ onClick, ref, 'aria-expanded': expanded })}
    >
      {close => (
        <Menu>
          {items.map((item, i) => (
            <MenuItem
              key={i}
              icon={item.icon}
              shortcut={item.shortcut}
              danger={item.danger}
              disabled={item.disabled}
              onSelect={() => { item.onSelect?.(); close() }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Popover>
  )
}
