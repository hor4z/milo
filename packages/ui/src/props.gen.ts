/* Generado por scripts/props.mjs — no se edita a mano.
   La descripción de cada prop vive en su docblock, al lado del tipo. */

export type PropDoc = {
  name: string
  type: string
  required: boolean
  def?: string
  doc?: string
}

/** Lo propio de la pieza, y la etiqueta nativa cuyos atributos pasa de largo. */
export type ComponentDoc = {
  props: PropDoc[]
  html?: string
}

export const propsByComponent: Record<string, ComponentDoc> = {
  "AccordionItem": {
    "props": [
      {
        "name": "summary",
        "type": "ReactNode",
        "required": true,
        "doc": "Lo que se ve siempre y se toca para abrir."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "Lo que aparece al abrir."
      },
      {
        "name": "defaultOpen",
        "type": "boolean",
        "required": false,
        "doc": "Arranca abierta."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Accordion": {
    "props": [],
    "html": "div"
  },
  "Alert": {
    "props": [
      {
        "name": "tone",
        "type": "Tone",
        "required": false,
        "def": "'info'",
        "doc": "De acá salen el glifo, el color y la urgencia con que se anuncia."
      },
      {
        "name": "icon",
        "type": "IconName | null",
        "required": false,
        "doc": "Sin esto lo pone el tono; `null` lo saca."
      },
      {
        "name": "onDismiss",
        "type": "() => void",
        "required": false,
        "doc": "Agrega la X para cerrarlo; sin esto no se cierra."
      }
    ],
    "html": "div"
  },
  "AlertTitle": {
    "props": [],
    "html": "p"
  },
  "AlertBody": {
    "props": [],
    "html": "p"
  },
  "AlertActions": {
    "props": [],
    "html": "div"
  },
  "Avatar": {
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "doc": "De acá salen la inicial y el tinte."
      },
      {
        "name": "src",
        "type": "string",
        "required": false,
        "doc": "Opcional; la etiqueta de color queda de fondo."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "40"
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "AvatarGroup": {
    "props": [
      {
        "name": "people",
        "type": "readonly { name: string; src?: string }[]",
        "required": true,
        "doc": "Sin `src` cae a la inicial."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "def": "3",
        "doc": "Cuenta avatares, no personas."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "28",
        "doc": "El monte sale de acá."
      },
      {
        "name": "ring",
        "type": "string",
        "required": false,
        "def": "'ring-surface'",
        "doc": "La utilidad de color del anillo, que tiene que ser la del fondo de atrás."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Badge": {
    "props": [
      {
        "name": "tone",
        "type": "Tone | 'neutral'",
        "required": false,
        "def": "'neutral'"
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo que acompaña al texto, a la izquierda."
      }
    ],
    "html": "span"
  },
  "Book": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true
      },
      {
        "name": "variant",
        "type": "'stripe' | 'simple'",
        "required": false,
        "def": "'stripe'",
        "doc": "`stripe` lleva una franja de color arriba con el icono o la ilustración, y el título abajo sobre papel."
      },
      {
        "name": "color",
        "type": "string",
        "required": false,
        "doc": "Un token, no un hex: así la tapa sigue al tema."
      },
      {
        "name": "textColor",
        "type": "string",
        "required": false,
        "doc": "El color de lo que va encima del color: el glifo de la franja en `stripe`, y el título en `simple`."
      },
      {
        "name": "width",
        "type": "BookWidth",
        "required": false,
        "def": "196",
        "doc": "Ancho en px, o dos anchos para que el libro no se aplaste en pantalla chica."
      },
      {
        "name": "textured",
        "type": "boolean",
        "required": false,
        "doc": "Solo para una portada sola."
      },
      {
        "name": "icon",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "illustration",
        "type": "ReactNode",
        "required": false,
        "doc": "Llena la franja o la tapa."
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "doc": "Lo convierte en <a>."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Breadcrumb": {
    "props": [
      {
        "name": "items",
        "type": "{ label: string; href?: string; onClick?: () => void }[]",
        "required": true,
        "doc": "De la raíz hasta acá. El último es dónde estás."
      }
    ],
    "html": "nav"
  },
  "Button": {
    "props": [
      {
        "name": "variant",
        "type": "'solid' | 'raised' | 'brand' | 'ghost' | 'muted' | 'bad'",
        "required": false,
        "def": "'raised'",
        "doc": "Solid y brand son el mismo rol."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "32 · 36 · 40."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "Antes del texto."
      },
      {
        "name": "iconEnd",
        "type": "IconName",
        "required": false,
        "doc": "Después del texto."
      },
      {
        "name": "block",
        "type": "boolean",
        "required": false,
        "doc": "Ocupa el ancho del contenedor."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLButtonElement>",
        "required": false,
        "doc": "Para usarlo como disparador de Dropdown o Popover."
      }
    ],
    "html": "button"
  },
  "Card": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "Para el ancho y para cambiar el padding."
      },
      {
        "name": "interactive",
        "type": "boolean",
        "required": false,
        "doc": "Levanta la tarjeta en hover; por defecto no se mueve."
      },
      {
        "name": "surface",
        "type": "'paper' | 'muted'",
        "required": false,
        "def": "'paper'",
        "doc": "Papel sobresale y tira sombra; muted es un hueco."
      }
    ]
  },
  "CardHeader": {
    "props": [],
    "html": "div"
  },
  "CardTitle": {
    "props": [],
    "html": "h3"
  },
  "CardHint": {
    "props": [],
    "html": "p"
  },
  "CardBody": {
    "props": [],
    "html": "div"
  },
  "CardFooter": {
    "props": [],
    "html": "div"
  },
  "BarChart": {
    "props": [
      {
        "name": "data",
        "type": "BarDatum[]",
        "required": true,
        "doc": "Label, value (lo hecho), total, y opcionales detail y caption."
      },
      {
        "name": "highlight",
        "type": "number",
        "required": false,
        "doc": "El índice de la barra de la que habla la pantalla: le pesa la etiqueta."
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "Para el lector de pantalla y la tabla de abajo."
      },
      {
        "name": "height",
        "type": "number",
        "required": false,
        "def": "220",
        "doc": "El alto del área de barras, sin las etiquetas."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Checkbox": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onChange",
        "type": "(v: boolean) => void",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Al aria-label; si va dentro de un <label>, se omite."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "id",
        "type": "string",
        "required": false
      },
      {
        "name": "indeterminate",
        "type": "boolean",
        "required": false,
        "doc": "Pinta la raya y manda aria-checked=\"mixed\"."
      }
    ]
  },
  "Chip": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "color",
        "type": "LabelColor",
        "required": false,
        "doc": "Una de las seis etiquetas vivas; sin esto va gris."
      },
      {
        "name": "onRemove",
        "type": "() => void",
        "required": false,
        "doc": "Agrega la cruz."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "doc": "Pasa a tinta plena y pisa el color."
      },
      {
        "name": "onClick",
        "type": "() => void",
        "required": false,
        "doc": "Lo convierte en <button>."
      }
    ]
  },
  "ConfirmDialog": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onCancel",
        "type": "() => void",
        "required": true,
        "doc": "Lo llaman Cancelar, el velo y Escape."
      },
      {
        "name": "onConfirm",
        "type": "() => void",
        "required": true
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "La pregunta, con el nombre de lo que se va a tocar adentro."
      },
      {
        "name": "body",
        "type": "ReactNode",
        "required": false,
        "doc": "Qué más se lleva puesto."
      },
      {
        "name": "confirmLabel",
        "type": "string",
        "required": false,
        "def": "'Aceptar'",
        "doc": "El verbo de lo que va a pasar, no «Sí»."
      },
      {
        "name": "cancelLabel",
        "type": "string",
        "required": false,
        "def": "'Cancelar'"
      },
      {
        "name": "tone",
        "type": "'neutral' | 'bad'",
        "required": false,
        "def": "'neutral'",
        "doc": "Bad pinta el botón de confirmar y arranca el foco en Cancelar."
      }
    ]
  },
  "Divider": {
    "props": [
      {
        "name": "orientation",
        "type": "'horizontal' | 'vertical'",
        "required": false,
        "def": "'horizontal'"
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "Para el margen, que depende de dónde esté."
      }
    ]
  },
  "Dropdown": {
    "props": [
      {
        "name": "trigger",
        "type": "(props: { onClick: () => void; 'aria-expanded': boolean; ref: React.Ref<HTMLButtonElement> }) => ReactNode",
        "required": true,
        "doc": "Recibe onClick, ref y aria-expanded."
      },
      {
        "name": "items",
        "type": "DropdownItem[]",
        "required": true
      },
      {
        "name": "align",
        "type": "'start' | 'end'",
        "required": false,
        "def": "'end'"
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "220"
      }
    ]
  },
  "EmptyState": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true
      },
      {
        "name": "body",
        "type": "string",
        "required": true,
        "doc": "Qué pasó y qué se puede hacer."
      },
      {
        "name": "action",
        "type": "ReactNode",
        "required": false,
        "doc": "La salida. Siempre conviene que haya una."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "La marca de arriba."
      },
      {
        "name": "size",
        "type": "'sm' | 'md'",
        "required": false,
        "def": "'md'",
        "doc": "`md` para una pantalla, `sm` para adentro de una tabla o una galería."
      },
      {
        "name": "bordered",
        "type": "boolean",
        "required": false,
        "def": "size === 'md'",
        "doc": "La caja punteada."
      }
    ]
  },
  "Field": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Nombra el control y lo enfoca al tocarla."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "Debajo de la etiqueta: para qué sirve el campo."
      },
      {
        "name": "error",
        "type": "string",
        "required": false,
        "doc": "Lo que está mal. Reemplaza al hint y marca el control."
      },
      {
        "name": "required",
        "type": "boolean",
        "required": false,
        "doc": "Marca visible de que sin esto no se puede seguir."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "El control, que toma el id solo."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "FieldSet": {
    "props": [
      {
        "name": "legend",
        "type": "string",
        "required": false
      }
    ],
    "html": "fieldset"
  },
  "FilterBar": {
    "props": [],
    "html": "div"
  },
  "FilterSearch": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true
      },
      {
        "name": "onValueChange",
        "type": "(v: string) => void",
        "required": true
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "def": "'Buscar…'"
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Filter": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "El rótulo: qué filtra."
      },
      {
        "name": "options",
        "type": "FilterOption[]",
        "required": true,
        "doc": "Las opciones, con cuántas filas cae en cada una."
      },
      {
        "name": "value",
        "type": "string[]",
        "required": true,
        "doc": "Lo elegido."
      },
      {
        "name": "onValueChange",
        "type": "(v: string[]) => void",
        "required": true
      }
    ]
  },
  "FilterReset": {
    "props": [],
    "html": "button"
  },
  "ColumnPicker": {
    "props": [
      {
        "name": "columns",
        "type": "{ id: string; label: string; locked?: boolean }[]",
        "required": true,
        "doc": "Todas las columnas que la tabla puede mostrar, en el orden en que van."
      },
      {
        "name": "value",
        "type": "string[]",
        "required": true,
        "doc": "Los ids de las que están a la vista."
      },
      {
        "name": "onValueChange",
        "type": "(v: string[]) => void",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Columnas'"
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Folder": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "El nombre, debajo."
      },
      {
        "name": "meta",
        "type": "string",
        "required": false,
        "doc": "La línea de apoyo: «15 archivos»."
      },
      {
        "name": "sheets",
        "type": "2 | 3",
        "required": false,
        "def": "3",
        "doc": "Cuántas hojas se abanican."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "128",
        "doc": "El ancho de la carpeta en px."
      },
      {
        "name": "color",
        "type": "string",
        "required": false,
        "doc": "Un token, no un hex."
      },
      {
        "name": "avatars",
        "type": "readonly { name: string; src?: string }[]",
        "required": false,
        "doc": "Quiénes tienen acceso, abajo a la izquierda."
      },
      {
        "name": "badges",
        "type": "ReactNode",
        "required": false,
        "doc": "Lo mismo pero a mano, para lo que no es una persona: un logo, un icono."
      },
      {
        "name": "onClick",
        "type": "() => void",
        "required": false,
        "doc": "Sin esto es un <div> y no se puede tabular."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Icon": {
    "props": [
      {
        "name": "name",
        "type": "IconName",
        "required": true,
        "doc": "La unión de los 152 del set."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "20",
        "doc": "Alto y ancho de la caja en px."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "Para el color; `icon-muted` para el gris."
      },
      {
        "name": "weight",
        "type": "IconWeight",
        "required": false,
        "doc": "El eje wght."
      }
    ]
  },
  "FolderIcon": {
    "props": [
      {
        "name": "color",
        "type": "FolderColor",
        "required": false,
        "def": "'ink'"
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "20"
      }
    ]
  },
  "IconButton": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Un botón que solo tiene un icono no dice nada sin esto."
      },
      {
        "name": "variant",
        "type": "'ghost' | 'raised' | 'solid' | 'muted'",
        "required": false,
        "def": "'ghost'"
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "32 · 36 · 40, los del Button."
      },
      {
        "name": "dot",
        "type": "boolean",
        "required": false,
        "doc": "El puntito de \"hay algo nuevo\", arriba a la derecha."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "doc": "Solo cambia el ghost, que pasa a muted."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLButtonElement>",
        "required": false
      }
    ],
    "html": "button"
  },
  "Kbd": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "Link": {
    "props": [
      {
        "name": "external",
        "type": "boolean",
        "required": false,
        "doc": "Abre en otra pestaña y lo avisa, en vez de hacerlo en silencio."
      }
    ],
    "html": "a"
  },
  "List": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "ListItem": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": true
      },
      {
        "name": "color",
        "type": "MarkColor",
        "required": true,
        "doc": "El par relleno/glifo de la marca."
      },
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "· 16/600."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "14/500 en gris."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "doc": "La fila elegida: queda hundida, no teñida."
      },
      {
        "name": "onClick",
        "type": "() => void",
        "required": false,
        "doc": "Sin esto la fila es un <div> y no toma hover."
      },
      {
        "name": "trailing",
        "type": "ReactNode",
        "required": false,
        "doc": "A la derecha: un chevron, un contador."
      }
    ]
  },
  "Menu": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "doc": "Opcional: sin él, el panel mide lo que su contenido."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "MenuItem": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "A la izquierda, en gris."
      },
      {
        "name": "shortcut",
        "type": "string",
        "required": false,
        "doc": "El atajo, en un Kbd."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "Una línea de apoyo a la derecha, en gris."
      },
      {
        "name": "checked",
        "type": "boolean",
        "required": false,
        "doc": "El tilde de \"esta es la que está puesta\"."
      },
      {
        "name": "submenu",
        "type": "boolean",
        "required": false,
        "doc": "El chevron de \"hay otro nivel\"."
      },
      {
        "name": "danger",
        "type": "boolean",
        "required": false,
        "doc": "Borrar, salir, revocar: lo que no se deshace."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "onSelect",
        "type": "() => void",
        "required": false,
        "doc": "Cerrar el panel es de quien lo abrió."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "MenuLabel": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "Modal": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true,
        "doc": "Lo llaman Escape y el click en el backdrop."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "620"
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "El aria-label del role=\"dialog\"."
      }
    ]
  },
  "NavItemBody": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": false
      },
      {
        "name": "glyph",
        "type": "ReactNode",
        "required": false,
        "doc": "Para cuando el glifo no sale del set: la carpeta de color de un espacio."
      },
      {
        "name": "label",
        "type": "string",
        "required": true
      },
      {
        "name": "badge",
        "type": "string",
        "required": false,
        "doc": "Hundido como un kbd: un contador no es accionable."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "required": false
      },
      {
        "name": "chip",
        "type": "boolean",
        "required": false,
        "def": "true",
        "doc": "El chip de papel detrás del icono cuando el item está activo."
      }
    ]
  },
  "Page": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "wide",
        "type": "boolean",
        "required": false
      }
    ]
  },
  "PageHeader": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true
      },
      {
        "name": "subtitle",
        "type": "string",
        "required": false
      },
      {
        "name": "actions",
        "type": "ReactNode",
        "required": false
      }
    ]
  },
  "SectionLabel": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "count",
        "type": "number",
        "required": false
      }
    ]
  },
  "Pagination": {
    "props": [],
    "html": "nav"
  },
  "PaginationStatus": {
    "props": [
      {
        "name": "to",
        "type": "number",
        "required": true,
        "doc": "El último de la pantalla, contando desde uno."
      },
      {
        "name": "from",
        "type": "number",
        "required": false,
        "def": "1",
        "doc": "El primero de la pantalla."
      },
      {
        "name": "total",
        "type": "number",
        "required": false,
        "doc": "Cuántos hay en total."
      },
      {
        "name": "noun",
        "type": "string | [singular: string, plural: string]",
        "required": false,
        "doc": "Qué se está contando."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "Reemplaza la frase entera cuando la pantalla tiene una mejor."
      }
    ]
  },
  "PaginationPrev": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Anterior'"
      }
    ]
  },
  "PaginationNext": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Siguiente'"
      }
    ]
  },
  "Popover": {
    "props": [
      {
        "name": "trigger",
        "type": "(props: { onClick: () => void 'aria-expanded': boolean ref: React.Ref<HTMLButtonElement> 'data-open': boolean }) => ReactNode",
        "required": true,
        "doc": "Recibe onClick, ref, aria-expanded y data-open."
      },
      {
        "name": "children",
        "type": "(close: () => void) => ReactNode",
        "required": true,
        "doc": "Recibe el cierre. El panel lo dibuja el call site — fondo, borde, radio y sombra — porque Popover no tiene aspecto."
      },
      {
        "name": "align",
        "type": "'start' | 'end'",
        "required": false,
        "def": "'end'"
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "doc": "Sin esto se mide el ancho real del panel para alinearlo y encajarlo."
      },
      {
        "name": "offset",
        "type": "number",
        "required": false,
        "def": "8"
      },
      {
        "name": "veil",
        "type": "boolean",
        "required": false,
        "doc": "Atenúa el resto de la pantalla."
      },
      {
        "name": "onOpenChange",
        "type": "(open: boolean) => void",
        "required": false
      }
    ]
  },
  "Portal": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "PrefsProvider": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "Progress": {
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": true,
        "doc": "Lo hecho, en las unidades de max."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "def": "100"
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué mide, para quien no ve la barra."
      },
      {
        "name": "hint",
        "type": "ReactNode",
        "required": false,
        "doc": "El número al costado."
      },
      {
        "name": "tone",
        "type": "'brand' | 'ok' | 'warn' | 'bad'",
        "required": false,
        "def": "'brand'"
      }
    ],
    "html": "div"
  },
  "Radio": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": true,
        "doc": "Es controlado."
      },
      {
        "name": "onChange",
        "type": "() => void",
        "required": true,
        "doc": "Sin valor: el radio solo se prende."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Va al `aria-label`."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "id",
        "type": "string",
        "required": false
      },
      {
        "name": "tabIndex",
        "type": "number",
        "required": false,
        "doc": "Lo pone `RadioGroup` para dejar una sola parada de tabulación."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLButtonElement>",
        "required": false
      }
    ]
  },
  "RadioGroup": {
    "props": [
      {
        "name": "value",
        "type": "T",
        "required": true
      },
      {
        "name": "onChange",
        "type": "(v: T) => void",
        "required": true
      },
      {
        "name": "options",
        "type": "readonly { value: T; label: string; disabled?: boolean }[]",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Al aria-label del grupo."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Row": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true
      },
      {
        "name": "hint",
        "type": "string",
        "required": false
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      }
    ]
  },
  "Segmented": {
    "props": [
      {
        "name": "value",
        "type": "T",
        "required": true
      },
      {
        "name": "onChange",
        "type": "(v: T) => void",
        "required": true
      },
      {
        "name": "options",
        "type": "SegmentedOption<T>[]",
        "required": true,
        "doc": "Sin label la opción queda cuadrada, solo icono — y title pasa a obligatorio."
      },
      {
        "name": "size",
        "type": "'xs' | 'sm' | 'md'",
        "required": false,
        "def": "'md'",
        "doc": "Xs va con pista transparente: dentro del header de un panel, una pista gris sobre fondo gris agrega una caja que no hace falta."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Cómo se llama el grupo. Adentro de un `Field` lo toma de la etiqueta."
      }
    ]
  },
  "Select": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true
      },
      {
        "name": "onChange",
        "type": "(v: string) => void",
        "required": false
      },
      {
        "name": "options",
        "type": "string[]",
        "required": true
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "doc": "Sin esto toma el ancho del contenido."
      },
      {
        "name": "leading",
        "type": "ReactNode",
        "required": false,
        "doc": "Adelante del valor: un `Icon`, un `FolderIcon`, un `Avatar`, un `Spinner`."
      },
      {
        "name": "loading",
        "type": "boolean",
        "required": false,
        "doc": "Mientras los datos no están: no abre, y el spinner va solo si no hay `leading`."
      }
    ]
  },
  "SettingsModal": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true
      },
      {
        "name": "user",
        "type": "SettingsUser",
        "required": true
      }
    ]
  },
  "Sheet": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true,
        "doc": "Lo llaman la X, el velo y Escape."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "side",
        "type": "'right' | 'left'",
        "required": false,
        "def": "'right'"
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "460"
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Nombra el diálogo para el lector."
      }
    ]
  },
  "SheetHeader": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true
      }
    ]
  },
  "Skeleton": {
    "props": [],
    "html": "span"
  },
  "Slider": {
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": true,
        "doc": "Es controlado."
      },
      {
        "name": "onChange",
        "type": "(v: number) => void",
        "required": true
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "def": "0"
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "def": "100"
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "def": "1"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Va al aria-label del input."
      },
      {
        "name": "id",
        "type": "string",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "El ancho se pone desde afuera."
      }
    ]
  },
  "Spinner": {
    "props": [
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "20",
        "doc": "El trazo lo sigue: 17% del diámetro."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Cargando'",
        "doc": "Al aria-label; el rol es status."
      },
      {
        "name": "on",
        "type": "'surface' | 'solid'",
        "required": false,
        "def": "'surface'",
        "doc": "Sobre qué está apoyado."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "Switch": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": true
      },
      {
        "name": "onChange",
        "type": "(v: boolean) => void",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "id",
        "type": "string",
        "required": false
      }
    ]
  },
  "Table": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "minWidth",
        "type": "number",
        "required": false,
        "def": "640",
        "doc": "Abajo de esto la tabla scrollea en vez de apretar las columnas."
      },
      {
        "name": "footer",
        "type": "ReactNode",
        "required": false,
        "doc": "La franja de abajo: vive adentro del marco pero fuera del scroll."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "TableHeader": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "TableBody": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "TableFooter": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
  },
  "TableRow": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "onClick",
        "type": "() => void",
        "required": false,
        "doc": "Sin esto la fila no toma hover ni cursor."
      },
      {
        "name": "active",
        "type": "boolean",
        "required": false,
        "doc": "La fila elegida: apagada, no teñida."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "TableHead": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "html": "th"
  },
  "TableCell": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "html": "td"
  },
  "TableTitle": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "TableHint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "TableNum": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "html": "td"
  },
  "Tabs": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": false,
        "doc": "Controlado; sin esto usa defaultValue."
      },
      {
        "name": "defaultValue",
        "type": "string",
        "required": false,
        "doc": "La solapa abierta al entrar."
      },
      {
        "name": "onValueChange",
        "type": "(v: string) => void",
        "required": false
      }
    ]
  },
  "TabList": {
    "props": [],
    "html": "div"
  },
  "Tab": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true
      }
    ],
    "html": "button"
  },
  "TabPanel": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true
      }
    ],
    "html": "div"
  },
  "TextField": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "A la izquierda, en gris."
      },
      {
        "name": "suffix",
        "type": "ReactNode",
        "required": false,
        "doc": "A la derecha: una unidad, un kbd, un botón."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'lg'",
        "doc": "32 · 36 · 40, las del Button. Default lg."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLDivElement>",
        "required": false,
        "doc": "Va al contenedor, que es lo que mide y lo que se enfoca."
      }
    ]
  },
  "Textarea": {
    "props": [
      {
        "name": "rows",
        "type": "number",
        "required": false,
        "def": "3",
        "doc": "Las filas de arranque: el alto mínimo del campo."
      },
      {
        "name": "maxRows",
        "type": "number",
        "required": false,
        "doc": "Hasta cuántas filas crece antes de scrollear."
      },
      {
        "name": "resize",
        "type": "'auto' | 'vertical' | 'none'",
        "required": false,
        "def": "'auto'",
        "doc": "Quién decide el alto."
      }
    ]
  },
  "ToastProvider": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "def": "3"
      }
    ]
  },
  "Tooltip": {
    "props": [
      {
        "name": "label",
        "type": "ReactNode",
        "required": true,
        "doc": "Lo que dice la etiqueta."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "El control que explica; se envuelve, no se pide render prop."
      },
      {
        "name": "side",
        "type": "'top' | 'bottom'",
        "required": false,
        "def": "'top'",
        "doc": "Dónde va si entra."
      },
      {
        "name": "delay",
        "type": "number",
        "required": false,
        "def": "500",
        "doc": "Ms del primero; los siguientes abren en 0 dentro de una ventana de 400."
      }
    ]
  }
}
