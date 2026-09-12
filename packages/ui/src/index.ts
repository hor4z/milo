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

export { cx, fold, labelColors, labelFill, markColors, markFill } from './primitives'
export type { LabelColor, MarkColor } from './primitives'
export {
  Button, IconButton, Switch, Slider, Checkbox, Radio, RadioGroup, Segmented, Select,
  Chip, Kbd, Avatar, AvatarGroup, TextField, Textarea, Spinner, Card, Row, Divider,
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

export { Portal, Dropdown, Popover, Tooltip, Modal, useScrollLock, useEscape, useFocusTrap } from './overlay'
export type { DropdownItem } from './overlay'

export { Menu, MenuItem, MenuLabel } from './menu'

export {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
  TableTitle, TableHint, TableNum,
} from './table'

export { Book } from './book'
export { Folder } from './folder'
export type { BookWidth } from './book'

export { List, ListItem } from './list'

export { navItemClass, navSubItemClass, NavItemBody } from './nav'

export { Page, PageHeader, SectionLabel, EmptyState } from './page'

export { PrefsProvider, usePrefs } from './prefs'
export type { Prefs } from './prefs'

/* El modal de ajustes entra al paquete por la misma regla que deja afuera al
   shell: **no lee `data.ts` ni el router**. Lo único que necesita son las
   preferencias, que ya viven acá, y quién está mirando, que ahora va por prop —
   el nombre y el correo de una persona real no son parte de un design system.
   Con eso, el kit y la app muestran el mismo modal y no dos copias. */
export { SettingsModal } from './settings-modal'
export type { SettingsUser } from './settings-modal'
