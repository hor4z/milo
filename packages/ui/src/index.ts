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

export { cx, fold, labelColors, labelFill } from './primitives'
export type { LabelColor } from './primitives'
export {
  Button, IconButton, Switch, Slider, Checkbox, Radio, RadioGroup, Segmented, Select,
  Chip, Kbd, Avatar, AvatarGroup, Input, Spinner, Card, Row,
} from './primitives'

export { Icon, FolderIcon } from './icon'
export type { FolderColor, IconWeight } from './icon'
/* `iconNames` y `codepoints` salen del barrel porque la galería del kit tiene
   que poder enumerar el set — hoy `paths` era privado y por eso el kit no tenía
   galería. Los tags NO salen de acá: van por el subpath `@melu/ui/icons.meta`,
   así la app de producto no se lleva en el bundle el catálogo de búsqueda del
   muestrario. */
export { codepoints, iconNames } from './icons.gen'
export type { IconName } from './icons.gen'

export { Portal, Dropdown, Popover, Modal, useScrollLock, useEscape, useFocusTrap } from './overlay'
export type { MenuItem } from './overlay'

export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  TableTitle, TableHint, TableNum,
} from './table'

export { Book } from './book'
export type { BookWidth } from './book'

export { List, ListItem } from './list'
export type { MarkColor } from './list'

export { navItemClass, navSubItemClass, NavItemBody } from './nav'

export { Page, PageHeader, SectionLabel, EmptyState } from './page'

export { PrefsProvider, usePrefs } from './prefs'
export type { Prefs } from './prefs'
