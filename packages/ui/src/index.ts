/**
 * La puerta del paquete. Todo lo que consume una app entra por acá, y nada más:
 * un import a `@melu/ui/src/primitives` desde afuera ataría la app al reparto
 * interno de archivos, y mover una pieza de un archivo a otro pasaría a ser un
 * cambio que rompe.
 *
 * Lo que NO está acá está afuera a propósito. El shell, la paleta de comandos,
 * las notificaciones y la tarjeta de actividad viven en la app porque leen
 * `data.ts` y el router: son producto, no sistema. El día que alguna se vuelva
 * genérica, se muda y se agrega una línea.
 */

export { cx, labelColors, labelFill } from './primitives'
export type { LabelColor } from './primitives'
export {
  Button, IconButton, Switch, Slider, Checkbox, Segmented, Select,
  Chip, Kbd, Avatar, AvatarGroup, Input, Spinner, Card, Row,
} from './primitives'

export { Icon, FolderIcon } from './icon'
export type { IconName, FolderColor } from './icon'

export { Portal, Dropdown, Popover, Modal, useScrollLock, useEscape, useFocusTrap } from './overlay'
export type { MenuItem } from './overlay'

export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  TableTitle, TableHint, TableNum,
} from './table'

export { List, ListItem } from './list'
export type { MarkColor } from './list'

export { navItemClass, navSubItemClass, NavItemBody } from './nav'

export { Page, PageHeader, SectionLabel, EmptyState } from './page'

export { PrefsProvider, usePrefs } from './prefs'
export type { Prefs } from './prefs'
