import { useEffect, useState } from 'react'
import { Badge, Chip, Icon, Segmented, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
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

/** Las candidatas del comparador. `stack` es lo que se escribe en `--font-sans`. */
const families = [
  { value: 'instrument', label: 'Instrument Sans', stack: '"Instrument Sans"', note: 'La actual, y la tercera del proyecto: Inter → Geist → Instrument Sans. Está en revisión porque se eligió mirando una referencia comercial, no pensando en quién va a leer esto.' },
  { value: 'inter', label: 'Inter', stack: 'Inter', note: 'La única de la lista con eje óptico (opsz): la letra se redibuja más abierta a 12px y más cerrada a 40px, que es exactamente el problema de nitidez que estamos corrigiendo a mano. El costo es que es la letra de media industria.' },
  { value: 'plex', label: 'IBM Plex Sans', stack: '"IBM Plex Sans"', note: 'La de Carbon, probada años a 14px en consolas densas. Tiene más carácter que Inter sin volverse rara, y viene con una monoespaciada hermana de verdad — eso recuperaría el rol mono, que hoy es la misma familia y perdió el ancho fijo.' },
  { value: 'atkinson', label: 'Atkinson Hyperlegible Next', stack: '"Atkinson Hyperlegible Next"', note: 'Del Braille Institute, dibujada para baja visión: cada par que suele confundirse está resuelto a propósito. Es el argumento edtech más fuerte de la lista, y la que más hay que mirar contra el relieve — tiene personalidad y el sistema es sobrio.' },
  { value: 'public', label: 'Public Sans', stack: '"Public Sans"', note: 'La del sistema de diseño del gobierno de Estados Unidos, obligada a accesibilidad por mandato. Neutra hasta el aburrimiento, que a veces es la virtud.' },
] as const

type Family = (typeof families)[number]['value']

export function TypographySection() {
  return (
    <Page
      title="Tipografía"
      kind="Fundamentos"
      lead="Siete roles, y cada uno carga tamaño, interlineado y tracking juntos. La base es 14 y hay un escalón explícito de 16 para lo que un estudiante lee de corrido. La familia está en revisión: abajo está el comparador."
      imports="import { Icon } from '@milo/ui'"
    >
      <Section
        title="Los siete roles"
        note="La utilidad escribe los tres valores de una. Escritos por separado se despegan, y se despegaron: `text-lg` llegó a ser 20px de letra dentro de una caja de línea de 16px porque el interlineado era un token aparte que nadie tenía que recordar."
      >
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
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

      <Comparador />

      <Section
        title="El interlineado dejó de ser uno solo"
        note="Era 16px fijo para todo, y el argumento era bueno: con interlineado proporcional, una fila de 12 y una de 14 dejan de alinearse entre sí. Dejó de importar por dos razones. Los interlineados nuevos son todos pares y casi todos múltiplos de cuatro, así que apilan predecible; y las filas del sistema centran sus hijos con flex, no haciendo coincidir cajas de línea."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
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
          <div className="rounded-2xl border border-line bg-surface p-5">
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
        note="Positivo donde la letra es chica y se empasta, cero en la interfaz, negativo donde es grande y se despega. Antes era al revés: -0.015em aplicado a todos los h1, h2 y h3 por igual, un número medido contra Inter a 12px dos familias atrás. Apretar la letra chica es exactamente cómo se pierde nitidez. Es lo que hace el eje óptico de San Francisco, y lo que Carbon escribe a mano."
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          {roles.map(r => (
            <div key={r.cls} className="flex flex-wrap items-baseline gap-4">
              <code className="w-32 shrink-0 font-mono text-meta text-ink-muted">{r.ls}</code>
              <span className={`${r.cls} text-ink`}>Hola, ¿cómo anduvo la entrega?</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Tres pesos"
        note="400 la interfaz, 500 lo accionable y los títulos de fila, 600 solo en portada. Se cambian en el @theme y no en los call sites, así que las utilidades siguen llamándose medium, semibold y bold: el nombre es del rol, no del número. Ese número se calibró mirando la pantalla a 12px y la base ahora es 14, así que hay que volver a mirarlo cuando se elija la familia."
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['font-medium', '400', 'la interfaz'],
            ['font-semibold', '500', 'lo accionable'],
            ['font-bold', '600', 'la portada'],
          ].map(([cls, n, role]) => (
            <div key={cls} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
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
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5">
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
        <div className="flex flex-wrap gap-10 rounded-2xl border border-line bg-surface p-5">
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
          'El piso del sistema es 12px y es un rol con nombre —`text-meta`— para que se note cuándo se está usando abajo de lo que corresponde. Debajo de eso no hay nada que elegir.',
          'Los tamaños van en `rem` y no en píxeles: quien agranda la letra en las preferencias de su navegador la ve agrandada. El zoom ya escalaba los píxeles y cubría WCAG 1.4.4; la preferencia de tamaño de fuente no, y esa es la que usa quien tiene baja visión.',
          'El escalón de lectura tiene 1.5 de interlineado, el número de WCAG 1.4.12, y las piezas que llevan texto encima usan `min-h` en vez de alto fijo, así que aguantan que alguien fuerce más espaciado sin que se corte nada.',
          'El tracking es positivo en los dos escalones más chicos. La letra apretada a 12px es la que más se empasta, y es la que peor le cae a quien lee con dificultad.',
          'La jerarquía nunca se apoya solo en el tamaño: un título lleva tamaño y peso, y lo que es accionable lleva además su propio rol semántico en el HTML.',
        ]}
      />
    </Page>
  )
}

function Comparador() {
  const [family, setFamily] = useState<Family>('instrument')
  const elegida = families.find(f => f.value === family)!

  // Se escribe en el <html> y no en un contenedor: la idea es ver el sistema
  // entero cambiar de letra, incluido el riel y lo que quedó arriba en pantalla.
  // Se limpia al salir de la vista o no te lo sacás más de encima.
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--font-sans', `${elegida.stack}, ui-sans-serif, system-ui, sans-serif`)
    return () => { root.style.removeProperty('--font-sans') }
  }, [elegida.stack])

  return (
    <Section
      title="El comparador"
      note="La calibración de arriba es agnóstica y sirve para cualquiera de las cinco, así que la familia se puede decidir sola y mirando — que es como se decide un cambio de identidad. Cambia el sitio entero, no este recuadro. Es andamio del kit: las candidatas se cargan solo acá y se van el día que haya una elegida."
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented
            label="Familia tipográfica"
            size="sm"
            value={family}
            onChange={setFamily}
            options={families.map(f => ({ value: f.value, label: f.label }))}
          />
          {family === 'instrument' && <Badge tone="neutral">la actual</Badge>}
        </div>

        <p className="max-w-[65ch] text-body text-ink-muted">{elegida.note}</p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-label font-semibold text-ink-muted">Lo que se lee · 16/24</span>
            <p className="mt-3 max-w-[65ch] text-reading text-ink">
              Para el martes tienen que entregar el informe del experimento. Va la hipótesis que
              escribieron en clase, qué midieron, y qué les pasó que no esperaban — esa última
              parte es la que más me interesa leer.
            </p>
            <p className="mt-3 max-w-[65ch] text-reading text-ink">
              Si algo no les salió, escríbanlo igual. Un experimento que falla y está bien contado
              vale más que uno que sale y no se entiende.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-label font-semibold text-ink-muted">Un panel denso · 14 y 13</span>
            <div className="mt-3">
              <Table minWidth={300}>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aprendiz</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ['Milagros Ibáñez', 'ok'],
                    ['Joaquín Ledesma', 'warn'],
                    ['Ailén Quiroga', 'bad'],
                  ].map(([n, t]) => (
                    <TableRow key={n}>
                      <TableCell>{n}</TableCell>
                      <TableCell><Badge tone={t as 'ok' | 'warn' | 'bad'}>{t === 'ok' ? 'Entregó' : t === 'warn' ? 'Tarde' : 'Falta'}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Chip color="green">Ciencias</Chip>
              <Chip color="blue">6.° B</Chip>
              <Chip color="orange">Trimestral</Chip>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-label font-semibold text-ink-muted">El test de confusión</span>
            <div className="mt-3 flex flex-col gap-2">
              {[
                ['1 l I |', 'uno, ele, i mayúscula, barra'],
                ['0 O o Ø', 'cero y o'],
                ['rn m cl d', 'los pares que se funden'],
                ['ñ Ñ ¿ ¡ «»', 'lo que el castellano necesita'],
                ['áéíóú ÁÉÍÓÚ ü', 'acentos, arriba y abajo'],
              ].map(([g, q]) => (
                <div key={g} className="flex flex-wrap items-baseline gap-4">
                  <span className="w-[14ch] shrink-0 text-title font-medium text-ink">{g}</span>
                  <span className="text-meta text-ink-muted">{q}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-[46ch] text-meta text-ink-muted">
              Acá se decide de verdad. Una familia que no distingue el uno de la ele es un problema
              en cualquier interfaz, y en una donde alguien está aprendiendo a leer es otra cosa.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <span className="text-label font-semibold text-ink-muted">Los números en columna</span>
            <div className="mt-3 flex flex-col items-start gap-1">
              {['11.111', '40.000', '18.914', '88.100', '90.007'].map(n => (
                <span key={n} className="tabular border-r border-line pr-1 text-title font-semibold text-ink">{n}</span>
              ))}
            </div>
            <p className="mt-4 max-w-[46ch] text-meta text-ink-muted">
              Con <code>.tabular</code> puesto. Si una familia no trae cifras tabulares de verdad, la
              columna de la derecha baila igual y se nota acá.
            </p>
            <p className="mt-4 text-display font-bold text-ink">Portada</p>
          </div>
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
          <div key={t} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
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
