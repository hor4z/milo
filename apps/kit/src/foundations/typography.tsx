import { Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { A11y, Note, Page, Section, useTokens } from '../kit'

/** Los siete roles, en orden de tamaño. `cls` es la utilidad y el resto es lo que documenta. */
const roles = [
  { cls: 'text-meta', px: 12, lh: 16, ls: '+0.01em', role: 'Metadatos, kbd, contadores, la ayuda de un campo. El piso del sistema: nunca para leer.' },
  { cls: 'text-label', px: 13, lh: 18, ls: '+0.005em', role: 'Rótulos: la cabecera de una tabla, un chip, un badge, el título de un grupo del menú.' },
  { cls: 'text-body', px: 14, lh: 20, ls: '0', role: 'La interfaz. Si dudás, es este.' },
  { cls: 'text-reading', px: 16, lh: 24, ls: '0', role: 'Lo que se lee de corrido: un enunciado, una consigna. También el título de una superficie y el botón de md para arriba.' },
  { cls: 'text-title', px: 20, lh: 28, ls: '-0.01em', role: 'El título de una pantalla.' },
  { cls: 'text-heading', px: 28, lh: 36, ls: '-0.015em', role: 'El encabezado de una sección larga.' },
  { cls: 'text-display', px: 40, lh: 44, ls: '-0.02em', role: 'Portadas.' },
] as const

export function TypographySection() {
  return (
    <Page
      title="Tipografía"
      kind="Fundamentos"
      lead="Una familia —Inter— y siete roles, cada uno cargando tamaño, interlineado y tracking juntos. La base es 14 y hay un escalón explícito de 16 para lo que un estudiante lee de corrido."
      imports="import { Icon } from '@milo/ui'"
    >
      <Section
        title="Los siete roles"
        note="La utilidad escribe los tres valores de una. Escritos por separado se despegan, y se despegaron: `text-lg` llegó a ser 20px de letra dentro de una caja de línea de 16px porque el interlineado era un token aparte que nadie tenía que recordar."
      >
        <div className="overflow-x-auto rounded-xl border border-line bg-surface">
          {roles.map(r => (
            <div key={r.cls} className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-line px-5 py-4 last:border-0">
              <code className="w-24 shrink-0 font-mono text-meta text-ink-muted">{r.px}/{r.lh}</code>
              <span className={`${r.cls} min-w-0 flex-1 font-semibold text-ink`}>Doce actividades</span>
              <code className="w-32 shrink-0 font-mono text-meta font-semibold text-ink">{r.cls}</code>
              <span className="w-[38ch] shrink-0 text-meta text-ink-muted">{r.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Cómo se elige"
        note="En orden, y la primera que da verdadera es la que va."
      >
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Si el texto…</TableHead>
                <TableHead>va en</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ['se lee de corrido, en párrafos', 'text-reading'],
                ['es el título de la pantalla', 'text-title'],
                ['nombra una columna, un chip o un grupo', 'text-label'],
                ['es un dato de apoyo que se mira de reojo', 'text-meta'],
                ['es cualquier otra cosa', 'text-body'],
              ].map(([q, a]) => (
                <TableRow key={a}>
                  <TableCell>{q}</TableCell>
                  <TableCell><code className="font-mono text-meta font-semibold text-ink">{a}</code></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Section>

      <PorQueInter />

      <Section
        title="El interlineado dejó de ser uno solo"
        note="Era 16px fijo para todo, y el argumento era bueno: con interlineado proporcional, una fila de 12 y una de 14 dejan de alinearse entre sí. Dejó de importar por dos razones. Los interlineados nuevos son todos pares y casi todos múltiplos de cuatro, así que apilan predecible; y las filas del sistema centran sus hijos con flex, no haciendo coincidir cajas de línea."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="close" size={14} className="text-bad" />
              <span className="text-label font-semibold text-ink">Antes · 16 fijo</span>
            </div>
            <p className="text-reading text-ink" style={{ lineHeight: '16px' }}>
              Escribí una consigna clara: qué tienen que entregar, hasta cuándo, y con qué se los
              va a mirar. Lo que no está escrito acá se pregunta por privado y lo contestás siete veces.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              16px de letra en una caja de 16. Los renglones se pisan y eso se percibe como falta de nitidez,
              no como falta de aire.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="check" size={14} className="text-ok" />
              <span className="text-label font-semibold text-ink">Ahora · 16/24</span>
            </div>
            <p className="text-reading text-ink">
              Escribí una consigna clara: qué tienen que entregar, hasta cuándo, y con qué se los
              va a mirar. Lo que no está escrito acá se pregunta por privado y lo contestás siete veces.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              1.5 de interlineado, que es el número de WCAG 1.4.12 y el que pide cualquier guía de
              lectura.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="El tracking cruza el cero en la base"
        note="Positivo donde la letra es chica y se empasta, cero en la interfaz, negativo donde es grande y se despega. Antes era al revés: −0.015em en todos los títulos por igual, un número medido contra otra familia a 12px. Apretar la letra chica es exactamente cómo se pierde nitidez."
      >
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
          {roles.map(r => (
            <div key={r.cls} className="flex flex-wrap items-baseline gap-4">
              <code className="w-32 shrink-0 font-mono text-meta text-ink-muted">{r.ls}</code>
              <span className={`${r.cls} text-ink`}>Hola, ¿cómo anduvo la entrega?</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Tres pesos, y una regla que pesa más que los tres"
        note="400 la interfaz · 450 lo accionable y los títulos · 600 solo display. **El peso lo lleva el elegido, no la lista**: si las doce entradas de un riel van en el escalón de énfasis, ninguna está enfatizada. Se llegó a medir un 44% de una pantalla ahí arriba. Y es 450 y no 500 porque el 500 ya se lee como negrita."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['font-medium', '400', 'la interfaz'],
            ['font-semibold', '450', 'lo elegido'],
            ['font-bold', '600', 'la portada'],
          ].map(([cls, n, role]) => (
            <div key={cls} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
              <span className={`${cls} text-display text-ink`}>Aa</span>
              <code className="font-mono text-meta text-ink">{cls}</code>
              <span className="text-meta text-ink-muted">{n} · {role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="La medida de una línea"
        note="Entre 60 y 75 caracteres para lo que se lee de corrido. Más largo y el ojo pierde el renglón al volver; más corto y el salto de línea interrumpe cada tres palabras. Se fija con `max-w-[65ch]` y no con un ancho en píxeles, porque `ch` sigue al tamaño de la letra: si el rol cambia, la medida se acomoda sola."
      >
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
          <p className="max-w-[65ch] text-reading text-ink">
            Esta columna mide 65 caracteres. Es la que va cuando lo que hay abajo es un enunciado, una
            consigna o una devolución — cualquier cosa que alguien lee entera en vez de barrer con
            la vista. El ojo vuelve al principio del renglón siguiente sin tener que buscarlo.
          </p>
          <p className="text-reading text-ink">
            Esta no tiene medida y ocupa todo lo que le den. En una pantalla ancha el renglón se
            estira hasta que volver al principio deja de ser automático, y la lectura se vuelve
            trabajo — el mismo texto, la misma letra, y cuesta más. Es el error más barato de
            cometer y el más barato de arreglar.
          </p>
        </div>
      </Section>

      <Section
        title="Los números se alinean solos"
        note="El rol mono es la misma familia que el resto, así que perdió el ancho fijo. Lo que lo reemplaza es `.tabular`, que le da ancho fijo a los números sin cambiar de letra: alcanza para un precio, una métrica o una columna de tabla, y no alcanza para un bloque de código, que en este sistema no existe."
      >
        <div className="flex flex-wrap gap-10 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-col items-start gap-1">
            <span className="mb-1 text-meta text-ink-muted">sin tabular</span>
            {['11.111', '40.000', '18.914', '88.100'].map(n => (
              <span key={n} className="border-r border-line pr-1 text-title font-semibold text-ink">{n}</span>
            ))}
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className="mb-1 text-meta text-ink-muted">con tabular</span>
            {['11.111', '40.000', '18.914', '88.100'].map(n => (
              <span key={n} className="tabular border-r border-line pr-1 text-title font-semibold text-ink">{n}</span>
            ))}
          </div>
          <p className="max-w-[30ch] self-center text-meta text-ink-muted">
            Mirá dónde termina cada número. En la primera columna el borde derecho baila, porque el
            1 mide casi la mitad que el 0. En la segunda, todos los dígitos miden lo mismo y la
            columna cierra derecha.
          </p>
        </div>
      </Section>

      <Familias />

      <Note title="Por qué no se toca el suavizado">
        Ni <code>-webkit-font-smoothing: antialiased</code> ni <code>text-rendering:
        optimizeLegibility</code>, y las dos ausencias son la decisión. El primero no mejora el
        antialias: lo apaga, y le pide al navegador que rasterice en escala de grises en vez de
        usar el subpíxel — que es justo lo que da nitidez en una pantalla de 1x, que es donde se
        está mirando esto. La receta circula porque en un panel 2x adelgazar el texto queda mejor.
        Si alguna vez esto se ve lavado, el problema es el peso o el contraste, no el suavizado.
      </Note>

      <A11y
        items={[
          'El piso del sistema es 12px y es un rol con nombre —`text-meta`— para que se note cuándo se está usando abajo de lo que corresponde. La única cosa que baja de ahí es la inicial de un avatar chico, que es una marca y no un texto: nadie la lee, identifica.',
          'Los tamaños van en `rem` y no en píxeles: quien agranda la letra en las preferencias de su navegador la ve agrandada. El zoom ya escalaba los píxeles y cubría WCAG 1.4.4; la preferencia de tamaño de fuente no, y esa es la que usa quien tiene baja visión.',
          'El escalón de lectura tiene 1.5 de interlineado, el número de WCAG 1.4.12, y las piezas que llevan texto encima usan `min-h` en vez de alto fijo, así que aguantan que alguien fuerce más espaciado sin que se corte nada.',
          'El tracking es positivo en los dos escalones más chicos. La letra apretada a 12px es la que más se empasta, y es la que peor le cae a quien lee con dificultad.',
          'La jerarquía nunca se apoya solo en el tamaño: un título lleva tamaño y peso, y lo que es accionable lleva además su propio rol semántico en el HTML.',
        ]}
      />
    </Page>
  )
}

function PorQueInter() {
  return (
    <Section
      title="Por qué Inter, y por qué una sola"
      note="Cuarta familia del proyecto: Inter → Geist → Instrument Sans → Inter. Volver no es andar en círculo: aquella vez eran tres familias, y ese era justamente el motivo de dejarla. Inter v4 trae eje óptico, así que una sola instancia cubre el cuerpo y el display."
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="visibility" size={16} />
              <span className="text-label font-semibold text-ink">El eje óptico</span>
            </div>
            <p className="max-w-[52ch] text-body text-ink-muted">
              La letra se redibuja sola según el tamaño: más abierta y con más avance a 12px, más
              cerrada a 40px. Es la cura estructural de la falta de nitidez abajo, en vez de
              compensarla a mano con tracking. Ninguna de las otras candidatas que se miraron lo
              tiene, y es lo que hace que esta sea una elección y no una preferencia.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              Se pide como <code>opsz 14..32</code>: son los dos extremos que la fuente define, así
              que pedir más rango no agrega dibujo y sí agrega bytes.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="warning" size={16} />
              <span className="text-label font-semibold text-ink">Lo que se paga</span>
            </div>
            <p className="max-w-[52ch] text-body text-ink-muted">
              Es la letra de media industria y no aporta identidad. En un sistema que se apoya en el
              relieve y en una rampa casi neutra eso cuesta menos que en otro lado: acá la identidad
              no la pone la letra. Si algún día tiene que ponerla, el lugar es la portada y no la
              interfaz.
            </p>
            <p className="mt-3 text-meta text-ink-muted">
              Las otras cuatro que se miraron: IBM Plex Sans, Atkinson Hyperlegible Next, Public
              Sans e Instrument Sans, la anterior.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5">
          <div className="mb-1 flex items-center gap-2">
            <Icon name="info" size={16} />
            <span className="text-label font-semibold text-ink">Lo que el CDN no trae</span>
          </div>
          <p className="mb-4 max-w-[70ch] text-body text-ink-muted">
            Inter tiene un set de desambiguación —<code>ss04</code>: la ele minúscula con cola y la
            i mayúscula con serifas— y un cero barrado. Serían ideales acá: separan{' '}
            <span className="text-ink">1 l I</span> y <span className="text-ink">0 O</span> de un
            vistazo, que es exactamente lo que le cuesta a quien está aprendiendo a leer.{' '}
            <strong className="font-semibold text-ink">El build que sirve Google los recorta.</strong>{' '}
            Su tabla de features queda en <code>calt ccmp dnom frac locl numr pnum tnum</code> y nada
            más, así que escribir <code>font-feature-settings: "ss04"</code> no rompe: no hace nada,
            en silencio. Está anotado en el <code>theme.css</code> para que nadie lo intente dos veces.
          </p>
          <p className="max-w-[70ch] text-body text-ink-muted">
            Lo que sí sobrevive es <code>tnum</code>, así que <code>.tabular</code> funciona.
            Recuperar los otros dos pide auto-alojar la fuente —unos 69 KB subseteada a latín— y se
            decidió que tener CDN vale más: una red escolar cachea Google Fonts, y la primera visita
            de cada alumno no paga la descarga.
          </p>
        </div>
      </div>
    </Section>
  )
}

function Familias() {
  const vals = useTokens(['--font-sans', '--font-mono'])
  return (
    <Section
      title="Los tres roles, una sola familia"
      note="Interfaz, portadas y mono apuntan al mismo stack. A 40px lo que separa un título del cuerpo es el tamaño y el tracking, no un dibujo distinto de la letra, y dos familias que se parecen es lo peor de los dos mundos: no contrastan y no son la misma."
    >
      <div className="flex flex-col gap-3">
        {[['--font-sans', 'la interfaz, las portadas'], ['--font-mono', 'tokens, valores y atajos']].map(([t, role]) => (
          <div key={t} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface px-5 py-4">
            <div className="flex min-w-0 flex-col gap-1">
              <code className="font-mono text-meta font-semibold text-ink">{t}</code>
              <span className="text-meta text-ink-muted">{role}</span>
            </div>
            <code className="truncate font-mono text-meta text-ink-muted">{vals[t]}</code>
          </div>
        ))}
      </div>
    </Section>
  )
}
