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
    ],
    "doc": "Una fila que se abre. Es un `<details>`, así que funciona sin JavaScript."
  },
  "Accordion": {
    "props": [],
    "html": "div",
    "doc": "Varias filas que se abren, una debajo de la otra."
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
    "html": "div",
    "doc": "Un aviso fijo en la página: algo pasó o algo hay que saber antes de seguir."
  },
  "AlertTitle": {
    "props": [],
    "html": "p",
    "doc": "El renglón que nombra el aviso."
  },
  "AlertBody": {
    "props": [],
    "html": "p",
    "doc": "Qué pasó y qué se puede hacer."
  },
  "AlertActions": {
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
        "doc": "El nombre de la pista, arriba de la onda. Sin esto el reproductor va en una sola fila."
      },
      {
        "name": "peaks",
        "type": "readonly number[]",
        "required": false,
        "doc": "Los picos del archivo, de 0 a 1, para dibujar la onda. Se reparten el ancho, así que cuantos menos, más gordas salen las barras. Sin esto se dibuja una pista pelada: no se inventa una onda que no es la del audio."
      },
      {
        "name": "actions",
        "type": "ReactNode",
        "required": false,
        "doc": "A la derecha del tiempo: descargar, un menú, lo que haga falta."
      },
      {
        "name": "size",
        "type": "'sm' | 'md' | 'lg'",
        "required": false,
        "def": "'md'",
        "doc": "32 · 36 · 40, los del Button."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Un archivo de audio con su onda: play, una línea de tiempo que se arrastra y el reloj."
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
    ],
    "doc": "Varias personas en el lugar de una."
  },
  "Book": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "El nombre, en la tapa."
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
        "required": false,
        "doc": "El glifo de la franja en `stripe`, o el de la tapa en `simple`."
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
        "name": "title",
        "type": "string",
        "required": false,
        "doc": "La primera línea, en negrita. Sin esto el bloque arranca directo con el texto."
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
  "CardHeader": {
    "props": [],
    "html": "div",
    "doc": "La cabecera de una tarjeta: el título a la izquierda, lo que haya a la derecha."
  },
  "CardTitle": {
    "props": [],
    "html": "h3",
    "doc": "Cómo se llama lo que hay en la tarjeta."
  },
  "CardHint": {
    "props": [],
    "html": "p",
    "doc": "La línea de apoyo, debajo del título."
  },
  "CardBody": {
    "props": [],
    "html": "div",
    "doc": "El cuerpo, con el padding que la tarjeta no pone."
  },
  "CardFooter": {
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
  "ConfirmDialog": {
    "props": [
      {
        "name": "open",
        "type": "boolean",
        "required": true,
        "doc": "Lo dibuja o no: cerrado no monta nada."
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
        "required": true,
        "doc": "Lo que pasa si dice que sí."
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
        "doc": "El verbo de lo que va a pasar, no \"Sí\"."
      },
      {
        "name": "cancelLabel",
        "type": "string",
        "required": false,
        "def": "'Cancelar'",
        "doc": "La salida segura."
      },
      {
        "name": "tone",
        "type": "'neutral' | 'bad'",
        "required": false,
        "def": "'neutral'",
        "doc": "Bad pinta el botón de confirmar y arranca el foco en Cancelar."
      }
    ],
    "doc": "El diálogo que pregunta antes de algo que no se puede deshacer."
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
        "doc": "El vertical lleva `self-stretch` adentro: en una fila con `items-center` mediría cero."
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
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "Qué falta, en una línea."
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
    ],
    "doc": "Lo que se ve cuando no hay nada."
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
    ],
    "doc": "Une etiqueta, ayuda, error y control: los tres textos quedan atados al control."
  },
  "FieldSet": {
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
        "name": "caption",
        "type": "ReactNode",
        "required": false,
        "doc": "Lo que se lee abajo, para todo el mundo. Agrega algo que la imagen no dice sola: de dónde salió, qué hay que mirar."
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
        "name": "label",
        "type": "string",
        "required": false,
        "doc": "El nombre, debajo."
      },
      {
        "name": "meta",
        "type": "string",
        "required": false,
        "doc": "La línea de apoyo: \"15 archivos\"."
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
        "def": "20",
        "doc": "Alto y ancho de la caja en px."
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
  "FolderIcon": {
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
        "type": "'ghost' | 'raised' | 'solid' | 'muted'",
        "required": false,
        "def": "'ghost'",
        "doc": "La misma escalera del `Button`, sin `brand` ni `bad`."
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
        "doc": "El puntito de \"hay algo nuevo\", adentro del botón. Para un contador o un glifo, `Indicator`."
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
  "ListItem": {
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
        "doc": "A la derecha: un chevron, un `Switch`. Un contador no: el número ya está en `hint`, y repetirlo al lado obliga a leer dos veces lo mismo."
      }
    ]
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
    ],
    "doc": "Una fila del menú."
  },
  "MenuLabel": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El rótulo de un grupo de opciones."
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
        "def": "620",
        "doc": "El ancho del panel en px."
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
        "name": "active",
        "type": "boolean",
        "required": false,
        "doc": "Dónde estás parado. Se marca con el azul primario y su canto."
      },
      {
        "name": "collapsed",
        "type": "boolean",
        "required": false,
        "doc": "El riel de 72: queda el icono y nada más."
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
        "required": false,
        "doc": "Suelta el ancho para una tabla o una grilla larga."
      }
    ],
    "doc": "El contenedor de una pantalla."
  },
  "PageHeader": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "El nombre de la pantalla, como `h1`."
      },
      {
        "name": "subtitle",
        "type": "string",
        "required": false,
        "doc": "Una línea de apoyo."
      },
      {
        "name": "actions",
        "type": "ReactNode",
        "required": false,
        "doc": "Lo que se puede hacer acá, a la derecha."
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
    ],
    "doc": "Qué tramo se está viendo."
  },
  "PaginationPrev": {
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
  "PaginationNext": {
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
        "name": "hint",
        "type": "ReactNode",
        "required": false,
        "doc": "El número al costado."
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
  "Quote": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      },
      {
        "name": "source",
        "type": "ReactNode",
        "required": false,
        "doc": "Quién lo dijo o de dónde salió. Va abajo, en gris y más chico."
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
        "doc": "Lo pone `RadioGroup` para dejar una sola parada de tabulación."
      },
      {
        "name": "ref",
        "type": "Ref<HTMLButtonElement>",
        "required": false,
        "doc": "Lo usa `RadioGroup` para mover el foco con las flechas."
      }
    ],
    "doc": "La elección de una entre varias."
  },
  "RadioGroup": {
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
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "Qué se ajusta. Es un `<label>` de verdad: tocarlo acciona el control."
      },
      {
        "name": "hint",
        "type": "string",
        "required": false,
        "doc": "La segunda línea, en 11 gris."
      },
      {
        "name": "children",
        "type": "ReactNode",
        "required": false,
        "doc": "El control, alineado a la derecha."
      }
    ],
    "doc": "La fila de un panel: 56px de alto, padding 16/24, label a la izquierda y control a la derecha."
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
        "def": "'sm'",
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
        "required": true,
        "doc": "Nombra el diálogo para el lector."
      }
    ],
    "doc": "El panel que entra desde un costado: un formulario largo sin cambiar de pantalla."
  },
  "SheetHeader": {
    "props": [
      {
        "name": "title",
        "type": "string",
        "required": true,
        "doc": "El nombre del panel."
      },
      {
        "name": "onClose",
        "type": "() => void",
        "required": true,
        "doc": "La X. Es la salida a la vista Escape y el velo hacen lo mismo."
      }
    ],
    "doc": "La cabecera del panel, con su título y el botón de cerrar."
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
    ],
    "doc": "Pista completa más un arco encima."
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
        "name": "salto",
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
        "name": "disabled",
        "type": "boolean",
        "required": false
      },
      {
        "name": "width",
        "type": "number",
        "required": false,
        "def": "132"
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
    ],
    "doc": "La tabla, en piezas."
  },
  "TableHeader": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La cabecera va sobre `--surface-muted` y no sobre el papel: es lo que la separa del cuerpo sin gastar un divisor más grueso."
  },
  "TableBody": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "El cuerpo de la tabla."
  },
  "TableFooter": {
    "props": [
      {
        "name": "children",
        "type": "ReactNode",
        "required": true
      }
    ],
    "doc": "La fila del total, abajo de todo."
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
    ],
    "doc": "`last:border-0` saca el divisor de la última fila."
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
    "html": "th",
    "doc": "Un encabezado de columna: 11/600 con tracking, en tinta."
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
    "html": "td",
    "doc": "Una celda: 12/500, con el alto de fila de 56."
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
    ],
    "doc": "Lo que se lee primero de una fila."
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
    ],
    "doc": "La línea de apoyo debajo del título, en gris."
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
    "html": "td",
    "doc": "Una columna de números."
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
  "TabList": {
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
  "Tab": {
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
  "TabPanel": {
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
        "name": "duration",
        "type": "number",
        "required": false,
        "doc": "Milisegundos antes de irse solo. `0` lo deja hasta que lo cierren."
      }
    ],
    "doc": "Lo que recibe `toast()`."
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
  "ToolbarButton": {
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
    "doc": "Un botón de la barra. Con `pressed` es un interruptor y lo dice: \"negrita, activado\"."
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
  },
  "Tree": {
    "props": [
      {
        "name": "nodes",
        "type": "TreeNode[]",
        "required": true,
        "doc": "Las ramas de arriba. Cada una puede traer `children`."
      },
      {
        "name": "label",
        "type": "string",
        "required": true,
        "doc": "De qué es el árbol. Sin esto un lector dice \"árbol\" y nada más."
      },
      {
        "name": "expanded",
        "type": "string[]",
        "required": false,
        "doc": "Los ids abiertos. Sin esto el árbol los maneja solo."
      },
      {
        "name": "onExpandedChange",
        "type": "(ids: string[]) => void",
        "required": false,
        "doc": "Recibe la lista nueva de ids abiertos."
      },
      {
        "name": "selected",
        "type": "string",
        "required": false,
        "doc": "El id elegido."
      },
      {
        "name": "onSelect",
        "type": "(id: string) => void",
        "required": false,
        "doc": "Recibe el id al elegir con Enter, espacio o el mouse."
      },
      {
        "name": "className",
        "type": "string",
        "required": false
      }
    ],
    "doc": "Una jerarquía que se abre y se cierra: los espacios de alguien, el índice de un documento."
  }
}
