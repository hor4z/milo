/* Generado por scripts/props.mjs: no se edita a mano.
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
  doc?: string
}

export const propsByComponent: Record<string, ComponentDoc> = {
  "Accordion": {
    "props": [],
    "html": "div",
    "doc": "Varias filas que se abren, una debajo de la otra."
  },
  "Accordion.Item": {
    "props": [
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
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Una fila que se abre. Es un `<details>`, así que funciona sin JavaScript."
  },
  "Accordion.Summary": {
    "props": [],
    "html": "summary",
    "doc": "Lo que se ve siempre y se toca para abrir. Va primero: es el `<summary>` del `<details>`."
  },
  "Accordion.Body": {
    "props": [],
    "html": "div",
    "doc": "Lo que aparece al abrir."
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
      },
      {
        "name": "size",
        "type": "'sm' | 'md'",
        "required": false,
        "def": "'md'",
        "doc": "`sm` para adentro de un panel denso, donde el de siempre se lee más grande que las filas de al lado."
      }
    ],
    "html": "div",
    "doc": "Un aviso fijo en la página: algo pasó o algo hay que saber antes de seguir."
  },
  "Alert.Title": {
    "props": [],
    "html": "p",
    "doc": "El renglón que nombra el aviso."
  },
  "Alert.Body": {
    "props": [],
    "html": "p",
    "doc": "Qué pasó y qué se puede hacer."
  },
  "Alert.Actions": {
    "props": [],
    "html": "div",
    "doc": "La fila de botones del aviso."
  },
  "AudioPlayer": {
    "props": [
      {
        "name": "src",
        "type": "string",
        "required": true,
        "doc": "El archivo."
      },
      {
        "name": "title",
        "type": "string",
        "required": false,
        "doc": "El nombre de la pista, arriba de la onda. Es un string y no una parte porque la pieza lo necesita como texto: alimenta el `MediaMetadata` del sistema operativo y el nombre de la barra de búsqueda. Sin esto el reproductor va en una sola fila."
      },
      {
        "name": "peaks",
        "type": "readonly number[]",
        "required": false,
        "doc": "Los picos del archivo, de 0 a 1, para dibujar la onda. Se reparten el ancho, así que cuantos menos, más gordas salen las barras. Sin esto se dibuja una pista pelada: no se inventa una onda que no es la del audio."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "Las `AudioPlayer.Actions`, si van."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "36 · 40 · 44, los del Button."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ]
  },
  "AudioPlayer.Actions": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "A la derecha del tiempo: descargar, un menú, lo que haga falta."
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
        "def": "40",
        "doc": "El diámetro en px; la inicial y el anillo salen de acá."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Dos estados y nada más: con foto, o el círculo pastel con la inicial."
  },
  "Avatar.Group": {
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
        "def": "'var(--surface)'",
        "doc": "El color del anillo, que tiene que ser el del fondo de atrás."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Varias personas en el lugar de una."
  },
  "Breadcrumb": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Ruta'",
        "doc": "El nombre de la ruta. Dos `nav` con el mismo nombre en una pantalla se leen como uno solo, así que con más de una hay que distinguirlas."
      },
      {
        "name": "items",
        "type": "{ label: string; href?: string; onClick?: () => void }[]",
        "required": true,
        "doc": "De la raíz hasta acá. El último es dónde estás."
      }
    ],
    "html": "nav",
    "doc": "Dónde estás parado y cómo volver."
  },
  "Button": {
    "props": [
      {
        "name": "variant",
        "type": "'solid' | 'brand' | 'muted' | 'ghost' | 'bad'",
        "required": false,
        "def": "'muted'",
        "doc": "Solid y brand son el mismo rol."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "36 · 40 · 44."
      },
      {
        "name": "iconStart",
        "type": "ReactNode",
        "required": false,
        "doc": "Antes del texto. Cualquier nodo, no solo un `Icon`: el botón le fija la caja para que mida lo mismo sea lo que sea. Cuando está cargando, el spinner ocupa su lugar."
      },
      {
        "name": "iconEnd",
        "type": "ReactNode",
        "required": false,
        "doc": "Después del texto, con la misma caja fija que `iconStart`."
      },
      {
        "name": "loading",
        "type": "boolean",
        "required": false,
        "def": "false",
        "doc": "Pone el spinner al principio y deja de aceptar clicks."
      },
      {
        "name": "loadingLabel",
        "type": "string",
        "required": false,
        "def": "'Cargando'",
        "doc": "Lo que el lector de pantalla anuncia mientras carga."
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
  "ButtonGroup": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué agrupa. Sin esto un lector lee los botones sueltos, sin saber que van juntos."
      },
      {
        "name": "vertical",
        "type": "boolean",
        "required": false,
        "doc": "Apilados, para un menú lateral angosto."
      }
    ],
    "html": "div",
    "doc": "Botones pegados, con el canto solo en los extremos: una sola acción repartida en dos o tres pasos, o un conmutador de vista. Para elegir uno entre varios va `Segmented`, que trae el teclado."
  },
  "Callout": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo de la izquierda. Elegilo por lo que dice el bloque, no por el color."
      },
      {
        "name": "color",
        "type": "LabelColor | 'neutral'",
        "required": false,
        "def": "'neutral'",
        "doc": "El color del papel. Sale de la familia de categorías y no de los tonos de estado: un bloque de contenido no está avisando de nada."
      },
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
    ],
    "doc": "Un bloque de contenido que pide detenerse: una aclaración, una pista, algo para recordar."
  },
  "Callout.Title": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ]
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
    ],
    "doc": "El contenedor de radio 16: lo que se apoya en la página. Lo que flota sobre un velo (un modal, un diálogo) va en 24."
  },
  "Card.Header": {
    "props": [],
    "html": "div",
    "doc": "La cabecera de una tarjeta: el título a la izquierda, lo que haya a la derecha."
  },
  "Card.Title": {
    "props": [],
    "html": "h3",
    "doc": "Cómo se llama lo que hay en la tarjeta."
  },
  "Card.Hint": {
    "props": [],
    "html": "p",
    "doc": "La línea de apoyo, debajo del título."
  },
  "Card.Body": {
    "props": [],
    "html": "div",
    "doc": "El cuerpo, con el padding que la tarjeta no pone."
  },
  "Card.Footer": {
    "props": [],
    "html": "div",
    "doc": "La fila de abajo, separada por una línea."
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
    ],
    "doc": "El gráfico de barras."
  },
  "BarDatum": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Lo que va abajo de la barra."
      },
      {
        "name": "value",
        "type": "number",
        "required": true,
        "doc": "Lo hecho: la parte azul."
      },
      {
        "name": "total",
        "type": "number",
        "required": true,
        "doc": "Lo que había para hacer: el alto de la barra gris."
      },
      {
        "name": "detail",
        "type": "ReactNode",
        "required": false,
        "doc": "Lo que el tooltip muestra además del número: un porcentaje, un grupo de caras."
      },
      {
        "name": "caption",
        "type": "string",
        "required": false,
        "doc": "La frase del tooltip, abajo del número."
      }
    ]
  },
  "Checkbox": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": true,
        "doc": "Es controlado: el estado lo lleva quien lo usa."
      },
      {
        "name": "onChange",
        "type": "(v: boolean) => void",
        "required": true,
        "doc": "Recibe el valor nuevo, no el evento."
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
        "required": false,
        "doc": "Apagado no se toca ni recibe el foco."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "doc": "Para atarlo a una etiqueta de afuera. Adentro de un `Field` lo toma solo."
      },
      {
        "name": "indeterminate",
        "type": "boolean",
        "required": false,
        "doc": "Pinta la raya y manda aria-checked=\"mixed\"."
      }
    ],
    "doc": "La caja de 18, la misma medida del pulgar del switch, así una fila con los dos no tiene dos tamaños de \"marca\"."
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
        "type": "ChipColor",
        "required": false,
        "doc": "Uno de los seis de categoría o uno de los cuatro de estado; sin esto va gris."
      },
      {
        "name": "size",
        "type": "'sm' | 'md'",
        "required": false,
        "def": "'md'",
        "doc": "`sm` es la marca pegada a un título; `md` es la etiqueta de una fila de filtros."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "Un glifo adelante, del mismo tono que el texto."
      },
      {
        "name": "dot",
        "type": "boolean",
        "required": false,
        "doc": "Un punto del tono en vez de un glifo: clasifica sin nombrar."
      },
      {
        "name": "avatar",
        "type": "{ name: string; src?: string }",
        "required": false,
        "doc": "La cara de quien el chip nombra, en vez del glifo. Va pegada al canto izquierdo."
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
    ],
    "doc": "La marca chica de texto: el estado de una actividad, el nombre de una categoría, de un método o de una persona."
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
        "required": true,
        "doc": "Recibe los ids de las columnas que quedan a la vista."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Columnas'",
        "doc": "Nombra el botón y encabeza el panel."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Elegir qué columnas se ven."
  },
  "CommandMenu": {
    "props": [
      {
        "name": "groups",
        "type": "CommandGroup[]",
        "required": true,
        "doc": "Agrupados por lo que hacen. Un grupo que queda sin resultados no se muestra."
      },
      {
        "name": "onSelect",
        "type": "(item: CommandItem) => void",
        "required": true,
        "doc": "Recibe el elegido."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "def": "'Buscar un bloque…'",
        "doc": "Qué se busca."
      },
      {
        "name": "empty",
        "type": "string",
        "required": false,
        "def": "'Nada con esas palabras'",
        "doc": "Lo que se ve cuando no queda nada."
      },
      {
        "name": "search",
        "type": "boolean",
        "required": false,
        "def": "true",
        "doc": "Sin esto la lista arranca sin buscador, para cuando lo que se escribe ya está afuera."
      },
      {
        "name": "query",
        "type": "string",
        "required": false,
        "doc": "El texto de búsqueda, si lo maneja quien lo usa, un editor que ya viene escribiendo detrás de la barra."
      },
      {
        "name": "maxHeight",
        "type": "number",
        "required": false,
        "def": "320",
        "doc": "Cuánto mide la lista antes de scrollear."
      },
      {
        "name": "autoFocus",
        "type": "boolean",
        "required": false,
        "doc": "El buscador se lleva el foco al aparecer. Va donde el menú abre por un gesto (una barra, un atajo); suelto en una página, roba el foco y el scroll. Adentro de un overlay alcanza con esto: el `data-autofocus` que esos paneles miran lo pone la pieza."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "La lista de comandos: se escribe, se filtra y se elige con las flechas. Es el menú de la barra en un editor, y la paleta de atajos de una app."
  },
  "CommandItem": {
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "doc": "Único en toda la lista: es lo que se anuncia y lo que vuelve al elegir."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Lo que se lee y lo que se busca."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "Una línea abajo, para cuando el nombre no alcanza."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "A la izquierda."
      },
      {
        "name": "shortcut",
        "type": "string",
        "required": false,
        "doc": "El atajo, a la derecha. Es un recordatorio: la tecla la escucha quien la pone."
      },
      {
        "name": "keywords",
        "type": "string[]",
        "required": false,
        "doc": "Palabras que también lo encuentran y que no están en el nombre: \"foto\" para Imagen."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      }
    ]
  },
  "CommandGroup": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "El encabezado del grupo."
      },
      {
        "name": "items",
        "type": "CommandItem[]",
        "required": true
      }
    ]
  },
  "ConfirmDialog": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "doc": "Cerrado no monta nada."
      },
      {
        "name": "onCancel",
        "type": "() => void",
        "required": true,
        "doc": "Lo llaman el botón de cancelar, el velo y Escape."
      },
      {
        "name": "onConfirm",
        "type": "() => void",
        "required": true,
        "doc": "Lo que pasa si dice que sí."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "tone",
        "type": "'neutral' | 'bad'",
        "required": false,
        "def": "'neutral'",
        "doc": "Bad pinta el botón de confirmar y arranca el foco en cancelar."
      }
    ],
    "doc": "El diálogo que pregunta antes de algo que no se puede deshacer. Se arma con sus partes, igual que el `Modal`."
  },
  "ConfirmDialog.Header": {
    "props": [],
    "html": "div",
    "doc": "La cabecera. No lleva X: la salida segura es el botón de cancelar, que ya está a la vista."
  },
  "ConfirmDialog.Title": {
    "props": [],
    "html": "h2",
    "doc": "La pregunta, con el nombre de lo que se va a tocar adentro. Es el nombre que anuncia el lector."
  },
  "ConfirmDialog.Body": {
    "props": [],
    "html": "div",
    "doc": "Qué más se lleva puesto."
  },
  "ConfirmDialog.Footer": {
    "props": [],
    "html": "div",
    "doc": "La fila de los dos botones, contra el borde derecho."
  },
  "ConfirmDialog.Cancel": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Cancelar'"
      }
    ],
    "doc": "La salida segura. Con `tone=\"bad\"` arranca con el foco."
  },
  "ConfirmDialog.Confirm": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Aceptar'"
      }
    ],
    "doc": "El verbo de lo que va a pasar, no \"Sí\". Con `tone=\"bad\"` se pinta y cede el foco."
  },
  "CopyButton": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "Lo que se copia."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Copiar'",
        "doc": "Qué se copia, para quien no ve el glifo."
      },
      {
        "name": "copiedLabel",
        "type": "string",
        "required": false,
        "def": "'Copiado'",
        "doc": "Lo que se dice cuando ya está."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "La escalera de siempre."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Copiar un texto al portapapeles, con el tilde que avisa que salió bien. El aviso también se anuncia: el cambio de glifo no lo ve quien escucha la pantalla."
  },
  "DatePicker": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "La fecha elegida como `AAAA-MM-DD`, o vacío."
      },
      {
        "name": "onChange",
        "type": "(v: string) => void",
        "required": true,
        "doc": "Recibe la fecha nueva en el mismo formato."
      },
      {
        "name": "min",
        "type": "string",
        "required": false,
        "doc": "Nada antes de este día. Para un vencimiento, el de hoy."
      },
      {
        "name": "max",
        "type": "string",
        "required": false,
        "doc": "Nada después de este día."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "def": "'Elegir fecha'",
        "doc": "Lo que dice el campo mientras no hay fecha."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "De qué es la fecha. Sin esto lo pone el `Field` de alrededor."
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "doc": "Sin esto toma el ancho del contenido."
      }
    ],
    "doc": "Elegir una fecha: un campo que abre un mes."
  },
  "Divider": {
    "props": [
      {
        "name": "orientation",
        "type": "'horizontal' | 'vertical'",
        "required": false,
        "def": "'horizontal'",
        "doc": "El vertical se estira solo: en una fila que centra a sus hijos mediría cero."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "Para el margen, que depende de dónde esté."
      }
    ],
    "doc": "La línea que separa."
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
        "required": true,
        "doc": "Las opciones, en el orden en que van."
      },
      {
        "name": "align",
        "type": "'start' | 'end'",
        "required": false,
        "def": "'end'",
        "doc": "Contra qué borde del disparador se alinea el panel."
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "220",
        "doc": "El ancho del panel en px."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "def": "'Opciones'",
        "doc": "Qué menú es, para quien lo escucha. Por defecto, \"Opciones\"."
      }
    ],
    "doc": "El menú de opciones escrito como lista, que es lo más corto cuando el menú no tiene nada raro: cuatro filas con su icono y su acción."
  },
  "DropdownItem": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Lo que dice la fila."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo de la izquierda, en gris."
      },
      {
        "name": "shortcut",
        "type": "string",
        "required": false,
        "doc": "El atajo de teclado, a la derecha, en un `Kbd`."
      },
      {
        "name": "danger",
        "type": "boolean",
        "required": false,
        "doc": "Lo que no se deshace: borrar, salir, revocar."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "doc": "Se queda a la vista y apagada; una opción que desaparece obliga a aprender el menú de nuevo."
      },
      {
        "name": "onSelect",
        "type": "() => void",
        "required": false,
        "doc": "Al elegirla, el panel se cierra solo."
      }
    ],
    "doc": "Una opción de la lista del `Dropdown`."
  },
  "EmptyState": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El `Title`, el `Body` y, si hay salida, la `Action`."
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
    ],
    "doc": "Lo que se ve cuando no hay nada."
  },
  "EmptyState.Title": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Qué falta, en una línea."
  },
  "EmptyState.Body": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Qué pasó y qué se puede hacer."
  },
  "EmptyState.Action": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La salida. Siempre conviene que haya una."
  },
  "Field": {
    "props": [
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
        "doc": "El `Field.Label`, el `Field.Hint` o el `Field.Error` si van, y el control, que toma el id solo."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Une etiqueta, ayuda, error y control: los tres textos quedan atados al control."
  },
  "Field.Label": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Nombra el control y lo enfoca al tocarla."
  },
  "Field.Hint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Debajo de la etiqueta: para qué sirve el campo."
  },
  "Field.Error": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Lo que está mal. Reemplaza al hint y marca el control."
  },
  "Field.Set": {
    "props": [
      {
        "name": "legend",
        "type": "string",
        "required": false,
        "doc": "Cómo se llama el grupo. Un lector lo anuncia al entrar."
      }
    ],
    "html": "fieldset",
    "doc": "Varios campos, uno debajo del otro, con el aire del sistema."
  },
  "Figure": {
    "props": [
      {
        "name": "src",
        "type": "string",
        "required": true,
        "doc": "El archivo."
      },
      {
        "name": "alt",
        "type": "string",
        "required": true,
        "doc": "Qué se ve, para quien no la ve. No es el epígrafe: si la imagen no aporta nada que el texto no diga, va vacío y la imagen queda decorativa."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El `Figure.Caption`, si lleva."
      },
      {
        "name": "ratio",
        "type": "'16/9' | '4/3' | '1/1' | '3/2'",
        "required": false,
        "def": "'4/3'",
        "doc": "La proporción del hueco. Sin esto, la imagen manda y la página salta cuando carga."
      },
      {
        "name": "fit",
        "type": "'cover' | 'contain'",
        "required": false,
        "def": "'cover'",
        "doc": "`cover` llena el hueco y recorta lo que sobra: va para una foto, donde el borde no importa. `contain` entra entera: va para un dibujo o un diagrama, donde recortar se lleva justo lo que hay que ver."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Una imagen con su pie: lo que ilustra una consigna, una foto de un experimento, el gráfico que alguien dibujó a mano."
  },
  "Figure.Caption": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Lo que se lee abajo, para todo el mundo. Agrega algo que la imagen no dice sola: de dónde salió, qué hay que mirar."
  },
  "FilterBar": {
    "props": [],
    "html": "div",
    "doc": "La barra de arriba de una tabla: el buscador y los filtros, en una línea."
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
        "required": true,
        "doc": "Recibe la lista nueva de valores elegidos."
      }
    ],
    "doc": "Un filtro: un botón que dice qué filtra, y un panel para elegir."
  },
  "FilterReset": {
    "props": [],
    "html": "button",
    "doc": "El botón que devuelve la tabla a como estaba."
  },
  "Folder": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El `Folder.Label` y, si va, el `Folder.Meta`."
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
    ],
    "doc": "Una carpeta que se abre."
  },
  "Folder.Label": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El nombre, debajo."
  },
  "Folder.Meta": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La línea de apoyo: \"15 archivos\"."
  },
  "Icon": {
    "props": [
      {
        "name": "name",
        "type": "IconName",
        "required": true,
        "doc": "El glifo, de la unión de los que están en el manifiesto."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "doc": "Alto y ancho de la caja en px. Sin esto lo manda el ancestro por `--icon-size`, y si nadie lo manda son 20."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "Para el color: `icon-muted` para el gris."
      },
      {
        "name": "weight",
        "type": "IconWeight",
        "required": false,
        "doc": "El eje `wght` de la fuente."
      }
    ]
  },
  "Icon.Folder": {
    "props": [
      {
        "name": "color",
        "type": "FolderColor",
        "required": false,
        "def": "'ink'",
        "doc": "El color del espacio: es lo que la deja reconocer de reojo en una lista de siete."
      },
      {
        "name": "size",
        "type": "number",
        "required": false,
        "def": "20",
        "doc": "El lado en px."
      }
    ]
  },
  "IconButton": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": true,
        "doc": "El glifo, que es todo lo que se ve."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Un botón que solo tiene un icono no dice nada sin esto."
      },
      {
        "name": "variant",
        "type": "'ghost' | 'solid' | 'muted' | 'brand'",
        "required": false,
        "def": "'ghost'",
        "doc": "Las del `Button` menos `bad`: un icono solo no alcanza para anunciar que algo se borra."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "36 · 40 · 44, los del Button."
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
        "required": false,
        "doc": "Para usarlo como disparador de un `Dropdown` o un `Popover`."
      }
    ],
    "html": "button"
  },
  "Indicator": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "Lo que se marca: un icono, un botón, un avatar, una tarjeta."
      },
      {
        "name": "dot",
        "type": "boolean",
        "required": false,
        "doc": "El punto pelado. Es el default cuando no hay nada más que decir."
      },
      {
        "name": "count",
        "type": "number",
        "required": false,
        "doc": "Un número. En 0 no dibuja nada y arriba de 99 dice `99+`."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "Un glifo de 10 en vez del punto: un check, un candado, una alerta."
      },
      {
        "name": "tone",
        "type": "keyof typeof tones",
        "required": false,
        "def": "'accent'",
        "doc": "El color de la marca."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Qué significa la marca, para quien no la ve. Sin esto la marca es decorativa."
      },
      {
        "name": "ring",
        "type": "string",
        "required": false,
        "def": "'transparent'",
        "doc": "El anillo que separa la marca de lo que tiene atrás. Va del color de ese fondo: sobre una foto, el papel de la tarjeta; sobre un control, su relleno."
      },
      {
        "name": "inset",
        "type": "number",
        "required": false,
        "def": "9",
        "doc": "Cuánto meter la marca hacia adentro, en px. El default es el de un `IconButton` `lg`, que es donde va casi siempre: la caja mide 44 y el glifo 24, así que sin esto la marca queda lejos de lo que marca. Sobre un glifo suelto va en 0."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Una marca chica pegada a la esquina de otra cosa: un punto, un contador o un glifo. Lo que marca sigue siendo lo que se toca."
  },
  "Kbd": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "La tecla: un símbolo, un nombre corto o una unidad."
      }
    ],
    "doc": "El kbd va hundido: 11px, radio 6, con luz arriba y sombra interior abajo."
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
    "html": "a",
    "doc": "Un enlace dentro de un texto o suelto en una fila."
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
  "List.Item": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": true,
        "doc": "El glifo de la marca de color."
      },
      {
        "name": "color",
        "type": "MarkColor",
        "required": true,
        "doc": "El par relleno/glifo de la marca."
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
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "El `List.Title`, el `List.Hint` si va y el `List.Trailing` si va."
      }
    ]
  },
  "List.Title": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El nombre de la fila, en 16/600."
  },
  "List.Hint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La línea de apoyo, en 14/500 gris."
  },
  "List.Trailing": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "A la derecha: un chevron, un `Switch`. Un contador no: el número ya está en el hint, y repetirlo al lado obliga a leer dos veces lo mismo."
  },
  "Mention": {
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": true,
        "doc": "Lo que se lee: el nombre de la persona o del espacio."
      },
      {
        "name": "src",
        "type": "string",
        "required": false,
        "doc": "La foto, para una persona. Sin ella se dibuja la inicial sobre su color."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo, para lo que no es una persona: un espacio, una actividad."
      },
      {
        "name": "href",
        "type": "string",
        "required": false,
        "doc": "Adónde lleva. Sin esto es texto y no un enlace."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Una referencia adentro del texto: quién o qué. Va en el renglón, no lo interrumpe."
  },
  "Menu": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Qué menú es. Sin esto un lector lo anuncia como \"menú\" y nada más, y con dos abiertos en una pantalla no se distinguen."
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
    ],
    "doc": "El menú, en piezas."
  },
  "Menu.Item": {
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
        "required": false,
        "doc": "Apagada y a la vista: las flechas la saltean."
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
  "Menu.Label": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El rótulo de un grupo de opciones."
  },
  "Menu.Shortcut": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El atajo, a la derecha, en un `Kbd`."
  },
  "Menu.Hint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Una línea de apoyo a la derecha, en gris."
  },
  "Modal": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "doc": "Cerrado no monta nada."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true,
        "doc": "Lo llaman Escape, el velo y la X del header."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "size",
        "type": "ModalSize",
        "required": false,
        "def": "'md'",
        "doc": "`sm` una pregunta o un campo, `md` el de siempre, `lg` lo que necesita dos columnas."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Solo si no hay `Title`: con título, el nombre sale de ahí."
      }
    ],
    "doc": "El diálogo centrado que tapa la pantalla. Se arma con `ModalHeader`, `ModalBody` y `ModalFooter`."
  },
  "Modal.Header": {
    "props": [],
    "html": "div",
    "doc": "La cabecera: adentro van `Title` y `Hint`, y la X la pone ella."
  },
  "Modal.Title": {
    "props": [],
    "html": "h2",
    "doc": "El título, y de paso el nombre que anuncia el lector: se ata solo."
  },
  "Modal.Hint": {
    "props": [],
    "html": "div",
    "doc": "La línea de apoyo debajo del título, en gris."
  },
  "Modal.Body": {
    "props": [],
    "html": "div",
    "doc": "El cuerpo, y lo único que scrollea cuando el contenido no entra."
  },
  "Modal.Footer": {
    "props": [],
    "html": "div",
    "doc": "La fila de acciones, contra el borde derecho."
  },
  "NavItemBody": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo del set; para uno propio va `glyph`."
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
        "required": true,
        "doc": "El texto del item, que se esconde al contraerse."
      },
      {
        "name": "badge",
        "type": "string",
        "required": false,
        "doc": "Hundido como un kbd: un contador no es accionable."
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "required": false,
        "doc": "El riel de 72: queda el icono y nada más."
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
        "required": false,
        "doc": "Suelta el ancho para una tabla o una grilla larga."
      }
    ],
    "doc": "El contenedor de una pantalla."
  },
  "Page.Header": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "El `Page.Title`, y si van el `Page.Subtitle` y las `Page.Actions`."
      }
    ]
  },
  "Page.Title": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El nombre de la pantalla, como `h1`."
  },
  "Page.Subtitle": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Una línea de apoyo, debajo del título."
  },
  "Page.Actions": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Lo que se puede hacer acá, a la derecha."
  },
  "Page.SectionLabel": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "count",
        "type": "number",
        "required": false,
        "doc": "Cuántos hay, al lado del rótulo."
      }
    ],
    "doc": "El separador con rótulo, para cortar una pantalla larga en tramos."
  },
  "Pagination": {
    "props": [],
    "html": "nav",
    "doc": "La línea de abajo de una tabla: qué tramo se está viendo y cómo pasar al que sigue."
  },
  "Pagination.Status": {
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
    ],
    "doc": "Qué tramo se está viendo."
  },
  "Pagination.Prev": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Anterior'"
      }
    ],
    "doc": "Los dos viajan juntos y están siempre, apagados en las puntas."
  },
  "Pagination.Next": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "def": "'Siguiente'"
      }
    ],
    "doc": "Su `disabled` es el \"hay más\" que contesta el back: mientras haya, hay siguiente."
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
        "doc": "Recibe el cierre. El panel lo dibuja el call site: fondo, borde, radio y sombra, porque Popover no tiene aspecto."
      },
      {
        "name": "align",
        "type": "'start' | 'end'",
        "required": false,
        "def": "'end'",
        "doc": "Contra qué borde del disparador se alinea el panel."
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
        "def": "8",
        "doc": "Cuánto se separa del disparador, en px."
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
        "required": false,
        "doc": "Avisa cuándo abre y cuándo cierra."
      }
    ],
    "doc": "Un panel anclado a su disparador."
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
  "Prefs": {
    "props": [
      {
        "name": "theme",
        "type": "'light' | 'dark'",
        "required": true
      },
      {
        "name": "suggest",
        "type": "boolean",
        "required": true
      },
      {
        "name": "resume",
        "type": "boolean",
        "required": true
      },
      {
        "name": "showLens",
        "type": "boolean",
        "required": true
      },
      {
        "name": "shareRecipes",
        "type": "boolean",
        "required": true
      },
      {
        "name": "directory",
        "type": "boolean",
        "required": true
      },
      {
        "name": "confirmDelete",
        "type": "boolean",
        "required": true
      },
      {
        "name": "notifySubmission",
        "type": "boolean",
        "required": true
      },
      {
        "name": "notifyStuck",
        "type": "boolean",
        "required": true
      },
      {
        "name": "notifyWeekly",
        "type": "boolean",
        "required": true
      },
      {
        "name": "notifyProduct",
        "type": "boolean",
        "required": true
      },
      {
        "name": "sidebarCollapsed",
        "type": "boolean",
        "required": true
      }
    ]
  },
  "Progress": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El `Progress.Hint` con el número, si va."
      },
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
        "def": "100",
        "doc": "El total contra el que se mide."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué mide, para quien no ve la barra."
      },
      {
        "name": "tone",
        "type": "'brand' | 'ok' | 'warn' | 'bad'",
        "required": false,
        "def": "'brand'",
        "doc": "`brand` para lo que avanza y `ok` para lo que terminó; `warn` y `bad` solo cuando llenar la barra es el problema."
      }
    ],
    "html": "div",
    "doc": "Cuánto de algo va hecho. La pista es el resto, no un segundo dato."
  },
  "Progress.Hint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El número al costado."
  },
  "Quote": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "cite",
        "type": "string",
        "required": false,
        "doc": "La dirección de donde se sacó. Con esto, la cita lo declara en el markup además de escribirlo."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Palabras de otro: lo que dijo alguien, un fragmento de un texto, la respuesta de un estudiante."
  },
  "Quote.Source": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Quién lo dijo o de dónde salió. Va abajo, en gris y más chico."
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
        "required": false,
        "doc": "Apagado no se elige ni recibe el foco."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "doc": "Para atarlo a una etiqueta de afuera."
      },
      {
        "name": "tabIndex",
        "type": "number",
        "required": false,
        "doc": "Lo pone `Group` para dejar una sola parada de tabulación."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLButtonElement>",
        "required": false,
        "doc": "Lo usa `Group` para mover el foco con las flechas."
      }
    ],
    "doc": "La elección de una entre varias."
  },
  "Radio.Group": {
    "props": [
      {
        "name": "value",
        "type": "T",
        "required": true,
        "doc": "El valor elegido: es controlado."
      },
      {
        "name": "onChange",
        "type": "(v: T) => void",
        "required": true,
        "doc": "Recibe el valor nuevo."
      },
      {
        "name": "options",
        "type": "readonly { value: T; label: string; disabled?: boolean }[]",
        "required": true,
        "doc": "Las opciones, con su etiqueta."
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
    ],
    "doc": "El grupo va suelto: las opciones sobre el papel, cada una con su etiqueta al lado."
  },
  "Reorder": {
    "props": [
      {
        "name": "items",
        "type": "T[]",
        "required": true,
        "doc": "En el orden actual."
      },
      {
        "name": "onReorder",
        "type": "(items: T[]) => void",
        "required": true,
        "doc": "Recibe la lista entera en el orden nuevo."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "De qué es la lista. Sin esto un lector dice \"lista\" y nada más."
      },
      {
        "name": "children",
        "type": "(item: T, i: number) => ReactNode",
        "required": true,
        "doc": "Lo que va adentro de cada fila, a la derecha de la manija."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Una lista que se reordena: los bloques de una consigna, las etapas de una entrega."
  },
  "ReorderItem": {
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "doc": "Único en la lista: es lo que vuelve en el orden nuevo."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Cómo se llama esta fila cuando se la anuncia al moverla."
      }
    ]
  },
  "Row": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El `Row.Label`, el `Row.Hint` si va, y el control."
      }
    ],
    "doc": "La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha."
  },
  "Row.Label": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Qué se ajusta. Es un `<label>` de verdad: tocarlo acciona el control."
  },
  "Row.Hint": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La segunda línea, en 11 gris."
  },
  "Search": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "Lo que hay escrito: es controlado."
      },
      {
        "name": "onValueChange",
        "type": "(v: string) => void",
        "required": true,
        "doc": "Recibe el texto nuevo, y `''` cuando se limpia."
      },
      {
        "name": "placeholder",
        "type": "string",
        "required": false,
        "def": "'Buscar…'",
        "doc": "Qué se busca, no \"Buscar…\" a secas."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "Las mismas tres del resto de los controles."
      },
      {
        "name": "shortcut",
        "type": "string",
        "required": false,
        "doc": "El atajo que lo enfoca, a la derecha: `/`. Es un recordatorio, no la tecla: esa la escucha quien lo pone."
      },
      {
        "name": "block",
        "type": "boolean",
        "required": false,
        "doc": "Toma el ancho de lo que lo contiene."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      },
      {
        "name": "ref",
        "type": "Ref<HTMLInputElement>",
        "required": false
      }
    ],
    "doc": "El buscador: un campo con la lupa y una cruz que aparece cuando hay algo escrito. Es un `TextField` y no otro campo: se dibuja igual que los demás y hereda su inversión contra el fondo."
  },
  "Segmented": {
    "props": [
      {
        "name": "value",
        "type": "T",
        "required": true,
        "doc": "La opción elegida: es controlado."
      },
      {
        "name": "onChange",
        "type": "(v: T) => void",
        "required": true,
        "doc": "Recibe el valor nuevo."
      },
      {
        "name": "options",
        "type": "SegmentedOption<T>[]",
        "required": true,
        "doc": "Sin label la opción queda cuadrada, solo icono, y title pasa a obligatorio."
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
    ],
    "doc": "Un solo segmented para todo: el de texto (\"Todas · Abiertas\") y el de iconos (grilla · lista) son el mismo componente con distintas opciones."
  },
  "Select": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "El valor elegido, que es lo que se ve en el botón."
      },
      {
        "name": "onChange",
        "type": "(v: string) => void",
        "required": false,
        "doc": "Recibe el valor nuevo; sin esto el control es de solo lectura."
      },
      {
        "name": "options",
        "type": "string[]",
        "required": true,
        "doc": "La lista, en el orden en que se muestra."
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
    ],
    "doc": "El select es un botón con un listbox propio, no un `<select>` nativo."
  },
  "SettingsModal": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "doc": "Cerrado no monta nada."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true,
        "doc": "Al cerrar no hay navegación: seguís donde estabas."
      },
      {
        "name": "user",
        "type": "SettingsUser",
        "required": true,
        "doc": "Quién está mirando los ajustes."
      }
    ],
    "doc": "Los ajustes en un modal y no en una página."
  },
  "SettingsUser": {
    "props": [
      {
        "name": "name",
        "type": "string",
        "required": true
      },
      {
        "name": "email",
        "type": "string",
        "required": true
      },
      {
        "name": "alias",
        "type": "string",
        "required": true,
        "doc": "Cómo lo ven los aprendices."
      },
      {
        "name": "school",
        "type": "string",
        "required": true
      }
    ],
    "doc": "Quién está mirando los ajustes."
  },
  "Sheet": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "doc": "Cerrado no monta nada."
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
        "def": "'right'",
        "doc": "De qué lado entra. La derecha es de donde vienen las cosas nuevas."
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "460",
        "doc": "El ancho del panel en px."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Solo si no hay `Sheet.Title`: con título, el nombre sale de ahí."
      }
    ],
    "doc": "El panel que entra desde un costado: un formulario largo sin cambiar de pantalla."
  },
  "Sheet.Header": {
    "props": [],
    "html": "div",
    "doc": "La cabecera del panel: adentro va `Title`, y la X la pone ella."
  },
  "Sheet.Title": {
    "props": [],
    "html": "h2",
    "doc": "El título, y de paso el nombre que anuncia el lector: se ata solo."
  },
  "Skeleton": {
    "props": [],
    "html": "span",
    "doc": "El hueco que ocupa algo que todavía está cargando."
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
        "required": true,
        "doc": "Recibe el número nuevo."
      },
      {
        "name": "min",
        "type": "number",
        "required": false,
        "def": "0",
        "doc": "El extremo de la izquierda."
      },
      {
        "name": "max",
        "type": "number",
        "required": false,
        "def": "100",
        "doc": "El extremo de la derecha."
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "def": "1",
        "doc": "El salto entre dos valores."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "doc": "Apagado no se arrastra ni recibe el foco."
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
        "required": false,
        "doc": "Para atarlo a una etiqueta de afuera."
      },
      {
        "name": "className",
        "type": "string",
        "required": false,
        "doc": "El ancho se pone desde afuera."
      }
    ],
    "doc": "Un valor en un rango."
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
        "type": "'surface' | 'solid' | 'control'",
        "required": false,
        "def": "'surface'",
        "doc": "Sobre qué está apoyado. `control` toma el color de lo que lo contiene, que es lo que lo hace servir en todas las variantes de botón sin enumerar ninguna."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Pista completa más un arco encima."
  },
  "SplitButton": {
    "props": [
      {
        "name": "variant",
        "type": "Variante",
        "required": false,
        "def": "'brand'",
        "doc": "El mismo juego que `Button`, y vale para las dos mitades."
      },
      {
        "name": "size",
        "type": "Paso",
        "required": false,
        "def": "'md'",
        "doc": "La escalera de siempre."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "menuLabel",
        "type": "string",
        "required": false,
        "doc": "Qué hay en el menú, para quien lo escucha. Sin esto, \"Más opciones\"."
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "220",
        "doc": "El ancho del panel en px."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true,
        "doc": "El `SplitButton.Action` y los `SplitButton.Item` que van en el menú."
      }
    ],
    "doc": "La acción que se hace casi siempre, y al lado las que casi nunca. Es lo que evita una fila de cinco botones donde cuatro no se tocan nunca."
  },
  "SplitButton.Action": {
    "props": [
      {
        "name": "onClick",
        "type": "() => void",
        "required": false,
        "doc": "Lo que hace la acción principal."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La acción que se hace casi siempre: la mitad ancha, la que se toca directo."
  },
  "SplitButton.Item": {
    "props": [
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "A la izquierda, en gris."
      },
      {
        "name": "danger",
        "type": "boolean",
        "required": false,
        "doc": "Borrar, descartar: lo que no se deshace."
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
        "doc": "Cerrar el menú lo hace la pieza."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "Una de las que casi nunca: van adentro del menú que abre la flecha."
  },
  "Stepper": {
    "props": [
      {
        "name": "value",
        "type": "number",
        "required": true,
        "doc": "El número."
      },
      {
        "name": "onChange",
        "type": "(v: number) => void",
        "required": true,
        "doc": "Recibe el número nuevo, siempre dentro de `min` y `max`."
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
        "def": "99"
      },
      {
        "name": "step",
        "type": "number",
        "required": false,
        "def": "1",
        "doc": "Cuánto suben las flechas y los botones."
      },
      {
        "name": "pageStep",
        "type": "number",
        "required": false,
        "def": "10",
        "doc": "Cuánto suben Re Pág y Av Pág: para llegar lejos sin apretar veinte veces."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "De qué es el número. Sin esto lo pone el `Field` de alrededor."
      },
      {
        "name": "suffix",
        "type": "string",
        "required": false,
        "doc": "Lo que va después del número: \"min\", \"pts\". No se escribe ni se lee aparte."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "La misma escalera que el resto de los campos."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "doc": "Sin esto se ajusta al número más largo que puede entrar."
      }
    ],
    "doc": "Un número chico que se sube y se baja: cuántos intentos, cuántas preguntas, una nota."
  },
  "Steps": {
    "props": [
      {
        "name": "steps",
        "type": "Step[]",
        "required": true,
        "doc": "En orden."
      },
      {
        "name": "current",
        "type": "number",
        "required": true,
        "doc": "El índice de la que se está haciendo. Las anteriores quedan hechas."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué es esta secuencia. Sin esto, un lector la anuncia como una lista suelta."
      },
      {
        "name": "orientation",
        "type": "'horizontal' | 'vertical'",
        "required": false,
        "def": "'horizontal'",
        "doc": "Parada, deja lugar para el texto de cada etapa; acostada entra en una franja."
      },
      {
        "name": "onSelect",
        "type": "(i: number) => void",
        "required": false,
        "doc": "Recibe el índice. Sin esto las etapas no se tocan: son un indicador y no una navegación."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Por dónde va algo que tiene etapas: una actividad en partes, un proceso de diseño, un formulario largo."
  },
  "Step": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "El nombre de la etapa."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "Una línea abajo, para lo que el nombre no dice."
      }
    ]
  },
  "Switch": {
    "props": [
      {
        "name": "checked",
        "type": "boolean",
        "required": true,
        "doc": "Es controlado: el estado lo lleva quien lo usa."
      },
      {
        "name": "onChange",
        "type": "(v: boolean) => void",
        "required": true,
        "doc": "Recibe el valor nuevo, no el evento."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Va al `aria-label`. Adentro de un `Field` o de un `Row` sobra: el nombre sale de la etiqueta."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false,
        "doc": "Apagado no se toca ni recibe el foco."
      },
      {
        "name": "id",
        "type": "string",
        "required": false,
        "doc": "Para atarlo a una etiqueta de afuera. Adentro de un `Field` lo toma solo."
      }
    ],
    "doc": "El switch: pista de 40×22 con 2 de padding, así que el pulgar es de 18 y viaja 18 exactos."
  },
  "Table": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "De qué es la tabla. Cuando scrollea se vuelve una región enfocable, y dos regiones que se llaman igual se leen como una sola."
      },
      {
        "name": "minWidth",
        "type": "number",
        "required": false,
        "def": "640",
        "doc": "Abajo de esto la tabla scrollea en vez de apretar las columnas."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "La tabla, en piezas."
  },
  "Table.Header": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La cabecera va sobre `--surface-muted` y no sobre el papel: es lo que la separa del cuerpo sin gastar un divisor más grueso."
  },
  "Table.Footer": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La franja de abajo: vive adentro del marco pero fuera del scroll, y ahí va la paginación. Solo marca el lugar, el estilo lo pone lo que va adentro."
  },
  "Table.Body": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El cuerpo de la tabla."
  },
  "Table.Foot": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La fila del total, abajo de todo."
  },
  "Table.Row": {
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
    ],
    "doc": "La última fila se queda sin divisor: abajo ya está el borde de la tabla."
  },
  "Table.Head": {
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
      },
      {
        "name": "align",
        "type": "Align",
        "required": false,
        "doc": "A la derecha cuando la columna es de números, para que el encabezado caiga sobre ellos."
      }
    ],
    "html": "th",
    "doc": "Un encabezado de columna: 11/600 con tracking, en tinta."
  },
  "Table.Cell": {
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
      },
      {
        "name": "align",
        "type": "Align",
        "required": false,
        "doc": "A la derecha cuando lo que lleva se compara hacia abajo."
      },
      {
        "name": "fit",
        "type": "boolean",
        "required": false,
        "doc": "La columna se achica a lo que lleva adentro: para la de acciones, que va al borde."
      }
    ],
    "html": "td",
    "doc": "Una celda: 12/500, con el alto de fila de 56."
  },
  "Table.Title": {
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
    "doc": "Lo que se lee primero de una fila."
  },
  "Table.Hint": {
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
    "doc": "La línea de apoyo debajo del título, en gris."
  },
  "Table.Num": {
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
    "html": "td",
    "doc": "Una columna de números."
  },
  "Table.Empty": {
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
      },
      {
        "name": "colSpan",
        "type": "number",
        "required": true,
        "doc": "Cuántas columnas tiene la tabla ahora mismo: la tabla no las sabe contar sola."
      }
    ],
    "doc": "La fila entera cuando no hay ninguna: adentro va un `EmptyState`."
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
        "required": false,
        "doc": "Avisa qué solapa quedó abierta."
      }
    ],
    "doc": "Paneles hermanos donde solo se ve uno. Controlado o no, como el resto."
  },
  "Tabs.List": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "De qué son estas solapas. Sin esto un lector las anuncia como \"lista de solapas\" y con dos en una pantalla no se distinguen."
      }
    ],
    "html": "div",
    "doc": "La fila de solapas. Las flechas se mueven entre ellas, como pide un tablist."
  },
  "Tabs.Tab": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "Ata la solapa a su panel."
      }
    ],
    "html": "button",
    "doc": "Una solapa. El activo se marca con la línea y el azul primario."
  },
  "Tabs.Panel": {
    "props": [
      {
        "name": "value",
        "type": "string",
        "required": true,
        "doc": "El mismo valor que su solapa."
      }
    ],
    "html": "div",
    "doc": "El contenido de una solapa."
  },
  "TaskList": {
    "props": [
      {
        "name": "items",
        "type": "Task[]",
        "required": true,
        "doc": "En el orden en que van."
      },
      {
        "name": "onToggle",
        "type": "(id: string, done: boolean) => void",
        "required": true,
        "doc": "Recibe el id y si quedó hecha."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "De qué es la lista. Sin esto un lector anuncia \"lista, cuatro elementos\" y nada más."
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "required": false,
        "doc": "Apagada se lee y no se toca: la consigna de otro, una entrega ya cerrada."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Cosas para hacer, que se marcan al hacerlas: los pasos de una entrega, lo que falta de una actividad."
  },
  "Task": {
    "props": [
      {
        "name": "id",
        "type": "string",
        "required": true,
        "doc": "Único en la lista."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Lo que hay que hacer."
      },
      {
        "name": "done",
        "type": "boolean",
        "required": false
      }
    ]
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
        "def": "'md'",
        "doc": "36 · 40 · 44, las del Button."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLDivElement>",
        "required": false,
        "doc": "Va al contenedor, que es lo que mide y lo que se enfoca."
      },
      {
        "name": "inputRef",
        "type": "Ref<HTMLInputElement>",
        "required": false,
        "doc": "Va al `input` de adentro, para quien necesita enfocarlo desde afuera: un atajo de teclado."
      }
    ],
    "doc": "El campo de texto."
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
      },
      {
        "name": "counter",
        "type": "boolean",
        "required": false,
        "doc": "Muestra la cuenta abajo a la derecha. Lee `maxLength` y `minLength`; sin ninguno de los dos cuenta y nada más."
      }
    ],
    "doc": "El campo de varias líneas: la misma caja que `TextField`, estirada."
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
        "def": "3",
        "doc": "Cuántos se apilan antes de empujar al más viejo."
      }
    ],
    "doc": "Monta la región de avisos pasajeros y el `useToast` que los empuja."
  },
  "ToastOptions": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "Qué pasó, en una línea."
      },
      {
        "name": "body",
        "type": "string",
        "required": false,
        "doc": "El detalle, cuando el título no alcanza."
      },
      {
        "name": "tone",
        "type": "Tone",
        "required": false,
        "doc": "El mismo juego de tonos que `Alert` y `Chip`."
      },
      {
        "name": "action",
        "type": "{ label: string; onClick?: () => void }",
        "required": false,
        "doc": "La salida del aviso: deshacer, ver, reintentar. Al tocarla el aviso se cierra."
      },
      {
        "name": "meta",
        "type": "string",
        "required": false,
        "doc": "Una línea corta a la derecha, en gris, para cuando no hay acción. Si es un tiempo, sale de `timeAgo` y no escrito a mano."
      },
      {
        "name": "duration",
        "type": "number",
        "required": false,
        "doc": "Milisegundos antes de irse solo. `0` lo deja hasta que lo cierren."
      }
    ],
    "doc": "Lo que recibe `toast()`."
  },
  "ToggleButton": {
    "props": [
      {
        "name": "pressed",
        "type": "boolean",
        "required": true,
        "doc": "Hundido o no. Es controlado: el estado lo guarda quien lo usa."
      },
      {
        "name": "onPressedChange",
        "type": "(pressed: boolean) => void",
        "required": false,
        "doc": "Recibe el estado nuevo."
      },
      {
        "name": "icon",
        "type": "IconName",
        "required": false,
        "doc": "El glifo, antes del texto o solo."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "La escalera de siempre."
      },
      {
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "Obligatorio cuando adentro solo hay un glifo: sin esto el botón no dice nada."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false
      }
    ],
    "doc": "Un botón que queda hundido: dice en qué estado está algo, no que algo pasó. El `aria-pressed` es lo que lo separa de un `Button`, y es lo que hace que un lector anuncie \"activado\"."
  },
  "Toolbar": {
    "props": [
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué controla esta barra. Dos barras sin nombre en una pantalla se leen como una sola."
      },
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
    ],
    "doc": "La barra de herramientas: una sola parada de tabulación y flechas adentro, como manda un `toolbar`."
  },
  "Toolbar.Button": {
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
        "doc": "Sin esto el botón no dice nada: adentro solo hay un glifo."
      },
      {
        "name": "pressed",
        "type": "boolean",
        "required": false,
        "doc": "Presente lo vuelve un interruptor. Ausente es una acción que pasa y no queda."
      },
      {
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "onClick",
        "type": "() => void",
        "required": false
      }
    ],
    "doc": "El botón de la barra: siempre un glifo solo, y siempre `sm`. Con `pressed` es un interruptor y sin él una acción que pasa y no queda."
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
    ],
    "doc": "La etiqueta que dice qué hace un control que no lo dice solo: un icono suelto, un valor truncado, una acción con una consecuencia que conviene aclarar."
  }
}
