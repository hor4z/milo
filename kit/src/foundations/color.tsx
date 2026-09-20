import cls from './color.module.css'
import { Alert, AlertTitle } from '@milo/ui/alert'
import { Button } from '@milo/ui/button'
import { Chip } from '@milo/ui/chip'
import { Progress } from '@milo/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui/table'
import { Footnote, Note, Page, Ramp, Rich, Section, Stack, Swatch, useTokens } from '../kit'

const blue = ['--blue-050', '--blue-100', '--blue-200', '--blue-300', '--blue-400', '--blue-500', '--blue-600', '--blue-700', '--blue-800', '--blue-900'] as const
const yellow = ['--yellow-050', '--yellow-100', '--yellow-200', '--yellow-300', '--yellow-400', '--yellow-500', '--yellow-600', '--yellow-700', '--yellow-800', '--yellow-900'] as const
const gris = ['--shade-01', '--shade-02', '--shade-03', '--shade-04', '--shade-05', '--shade-06', '--shade-07', '--shade-08', '--shade-09'] as const
const amber = ['--accent-050', '--accent-500', '--accent-600'] as const

const marks = ['--mark-green', '--mark-purple', '--mark-orange', '--mark-blue', '--mark-pink'] as const
const labels = ['--label-green', '--label-teal', '--label-blue', '--label-purple', '--label-pink', '--label-orange'] as const
const tints = ['--tint-1', '--tint-2', '--tint-3', '--tint-4', '--tint-5', '--tint-6'] as const
const spaces = ['--space-green', '--space-purple', '--space-orange', '--space-blue', '--space-pink'] as const

const which = [
  ['La acción principal de una pantalla', '`--brand` o `--solid`', 'El botón que manda, y uno solo por pantalla'],
  ['Algo que el sistema quiere que mires', '`--accent`', 'El punto de "hay algo nuevo"'],
  ['Cómo salió algo que pasó', 'los cuatro de estado', 'Corregida, vence mañana, sin entregar'],
  ['A qué grupo pertenece algo', 'una familia de categoría', 'La materia de una actividad, el espacio de una carpeta'],
  ['Cuánto de algo está hecho', '`--chart-*` sobre `--track`', 'Una barra, una celda de una grilla'],
  ['Todo lo demás', 'la rampa neutra', 'Fondos, líneas, texto, iconos'],
]

export function ColorSection() {
  return (
    <Page
      title="Color"
      kind="Fundamentos"
      lead="Un primario, un acento y una rampa casi neutra. Todo lo que tiene color en el sistema sale de ahí o de una de las familias acotadas de abajo, y ninguna es decorativa: cada una contesta una pregunta distinta."
    >
      <Section
        title="Los tres"
        note="Si algo no entra en ninguno de los tres, no lleva color: lleva gris."
      >
        <div className={cls.headGrid}>
          <Lead
            title="Azul · el primario"
            token="--brand"
            note="Lo que manda y lo que dice dónde estás. Uno por pantalla."
          >
            <Button variant="brand">Nueva actividad</Button>
          </Lead>
          <Lead
            title="Naranja · el acento"
            token="--accent"
            note="Señala. No es un estado: no dice que algo salió mal, dice mirá esto."
          >
            <span className={cls.accentSample}>
              <span className={cls.accentDot} />
              Hay algo nuevo
            </span>
          </Lead>
          <Lead
            title="Gris · la rampa"
            token="--shade-06"
            note="Dibuja el resto: fondos, líneas, texto, iconos. Es casi todo lo que ves."
          >
            <span className={cls.accentText}>Matemática · 4.º A · 24 entregas</span>
          </Lead>
        </div>
      </Section>

      <Section
        title="Cuál va"
        note="La pregunta no es qué color queda bien: es qué está diciendo esto."
      >
        <Table label="Qué rol usar según qué se quiere decir" minWidth={560}>
          <TableHeader>
            <TableRow>
              <TableHead>Qué estás diciendo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Por ejemplo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {which.map(([q, r, e]) => (
              <TableRow key={q}>
                <TableCell>{q}</TableCell>
                <TableCell><Rich text={r} /></TableCell>
                <TableCell>{e}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        title="El azul, paso a paso"
        note="Diez pasos derivados y no elegidos. **El 600 está anclado**: es el escalón donde el blanco encima llega exactamente a 4,5:1, y de ahí sale `--brand`."
      >
        <Ramp tokens={blue} />
        <div className={cls.blueRamp}>
          <Swatch token="--brand" note="el relleno del botón que manda" />
          <Swatch token="--brand-hover" note="el mismo, un paso más" />
          <Swatch token="--brand-edge" note="el filo y el labio" />
          <Swatch token="--brand-soft" note="el fondo de lo elegido" />
          <Swatch token="--brand-ink" note="la tinta sobre el suave" />
          <Swatch token="--brand-border" note="la línea de una pieza de marca" />
          <Swatch token="--solid" note="el mismo botón, en tinta" />
          <Swatch token="--on-brand" note="lo que va encima del azul" />
        </div>
        <Note title="solid y brand son el mismo rol">
          Va uno o el otro, nunca los dos en la misma pantalla: dos botones que mandan es ninguno.
        </Note>

        <Note title="Dos roles pueden compartir valor; dos nombres para el mismo trabajo, no">
          El papel de una tarjeta y el fondo de un campo son blancos los dos y son roles distintos:
          el día que uno cambie, el otro se queda. Lo que no puede pasar es que el mismo trabajo
          tenga dos nombres. Pasó dos veces y las dos se resolvieron sacando uno: `--text-subtle`
          era `--text-muted`, y `--brand-subtle` era `--brand-soft`.
        </Note>
      </Section>

      <Section
        title="El naranja, y por qué es tan poco"
        note="Es el único acento y está acotado a propósito: un punto de aviso, una marca de que algo cambió. Si empieza a aparecer en botones y en fondos, deja de señalar."
      >
        <Ramp tokens={amber} />
        <div className={cls.orangeRamp}>
          <Swatch token="--accent" note="el punto que señala" />
          <Swatch token="--accent-hover" note="el mismo, un paso más" />
          <Swatch token="--accent-subtle" note="el fondo suave" />
        </div>
      </Section>

      <Section
        title="El amarillo, y por qué lleva tinta oscura"
        note="La segunda familia con escalera propia. Repite la curva de luminosidad del azul, para que un 100 signifique la misma altura en las dos, y toma de croma el 76% de lo que su tono aguanta en cada paso. **El 100 está anclado**: es el color elegido, y de ahí sale `--yellow`."
      >
        <Ramp tokens={yellow} />
        <div className={cls.blueRamp}>
          <Swatch token="--yellow" note="el relleno" />
          <Swatch token="--yellow-hover" note="el mismo, un paso más" />
          <Swatch token="--yellow-soft" note="el fondo suave" />
          <Swatch token="--yellow-border" note="la línea" />
          <Swatch token="--yellow-ink" note="la tinta sobre el suave" />
          <Swatch token="--on-yellow" note="lo que va encima del amarillo" />
        </div>
        <Note title="Acá el blanco no es una opción, y por eso la regla es al revés">
          Las otras familias de relleno llevan blanco encima porque están ancladas a un contraste
          contra blanco. El amarillo no puede: su mejor paso llega a 1,31:1 contra blanco, y no
          existe un amarillo vivo que llegue a 4,5. Así que la familia se ancla al revés, contra la
          tinta, y `--on-yellow` es oscuro en los dos temas. Los cinco pasos claros van de 4,94:1 a
          12,20:1 con esa tinta, y hay un test que lo verifica escalón por escalón y que además
          falla si alguno llegara a aguantar blanco, porque eso querría decir que el tono se fue.
        </Note>
        <Note title="En oscuro la escalera se da vuelta">
          Igual que la del azul: el 050 pasa a ser el más oscuro y el 900 el más claro. El relleno
          sube del 100 al 800, que es donde la tinta oscura vuelve a entrar con 9,28:1.
        </Note>
      </Section>

      <Section
        title="La rampa neutra, y lo que dibuja"
        note="Nueve pasos, y **casi** neutra: lleva C 0.0025 del tono del azul. Un gris exactamente neutro al lado de un azul saturado se ve de otro sistema; uno que se nota azul convierte una interfaz de dos colores en una de tres."
      >
        <Ramp tokens={gris} />
        <div className={cls.neutralRamp}>
          <Group title="Superficies">
            <Swatch token="--canvas" note="el escritorio: la página" />
            <Swatch token="--surface" note="el papel: una tarjeta" />
            <Swatch token="--surface-alt" note="la banda alterna de una tabla" />
            <Swatch token="--surface-muted" note="un hueco, una bandeja" />
            <Swatch token="--surface-sunken" note="el fondo de algo hundido" />
            <Swatch token="--popover" note="lo que flota" />
          </Group>
          <Group title="Líneas">
            <Swatch token="--border" note="el divisor de siempre" />
            <Swatch token="--border-strong" note="cuando hay que separar de verdad" />
            <Swatch token="--edge" note="el filo de algo que sobresale" />
            <Swatch token="--field-border" note="la línea de un campo" />
            <Swatch token="--focus-border" note="el campo enfocado" />
          </Group>
          <Group title="Texto e iconos">
            <Swatch token="--text" note="lo que se lee" />
            <Swatch token="--text-muted" note="lo que acompaña" />
            <Swatch token="--text-placeholder" note="lo que el campo sugiere" />
            <Swatch token="--icon-muted" note="un paso más oscuro que el texto" />
            <Swatch token="--text-inverted" note="sobre tinta" />
          </Group>
        </div>
        <Note title="El gris de un icono no es el del texto">
          Va un paso más oscuro: un contorno fino encierra aire y con el mismo gris se lee más
          apagado que el texto de al lado. Lo pone la utilidad `icon-muted`, que además sube el peso
          del glifo, porque el tono y el peso son la misma decisión.
        </Note>
      </Section>

      <Section
        title="Estado"
        note="Cuatro, y ninguno viaja solo: cada uno trae su glifo y su texto, porque un color de estado sin forma no dice nada a quien no distingue colores."
      >
        <div className={`${cls.stateCard} bg-surface`}>
          <div className={cls.stateRow}>
            <Chip size="sm" color="info" icon="info">En prueba</Chip>
            <Chip size="sm" color="ok" icon="check_circle">Corregida</Chip>
            <Chip size="sm" color="warn" icon="schedule">Vence mañana</Chip>
            <Chip size="sm" color="bad" icon="error">Sin entregar</Chip>
          </div>
          <Alert tone="warn">
            <AlertTitle>Tres entregas vencen mañana</AlertTitle>
          </Alert>
        </div>
        <Note title="El naranja del warn no llega a los 3:1 contra su pista, y está decidido así">
          Da 2,28 en claro. Es la segunda excepción escrita del sistema, después de la onda del
          `AudioPlayer`, y se acepta por lo mismo: **el valor nunca lo lleva solo el color**. La
          barra va con su rótulo y su número al lado, el gráfico trae su tabla escondida con todos
          los valores, y los dos declaran `aria-valuenow`. Lo que se pierde es el golpe de vista de
          quien mira de reojo una barra corta. Lo que se gana es que el estado se lea como un
          estado y no como un ocre. En oscuro no hay nada que discutir: ahí da 4,88.
        </Note>

        <Note title="Encima del verde y del naranja va tinta, no blanco, y en los dos temas">
          Es la misma decisión que `--on-label` y por el mismo motivo: el relleno es claro en
          claro y en oscuro, así que lo de encima no puede cambiar con el tema. El blanco se probó
          y no llega: da 3,78 sobre el verde y 2,65 sobre el naranja.
        </Note>

        <div className={cls.stateInkGrid}>
          <Swatch token="--ok" note="salió bien" />
          <Swatch token="--warn" note="cuidado" />
          <Swatch token="--bad" note="se rompió" />
          <Swatch token="--ok-subtle" note="su fondo" />
          <Swatch token="--warn-subtle" note="su fondo" />
          <Swatch token="--bad-subtle" note="su fondo" />
        </div>
        <Footnote>
          También hay un `--ok-border`, un `--warn-border` y un `--bad-border`, y **hoy los dos
          primeros no los usa nadie**. Eran la línea del `Alert`, que dejó de tener borde para
          parecerse al `Callout`: con el papel teñido, el borde no agregaba nada. Del tercero queda
          un solo uso, en el `AudioPlayer`.
        </Footnote>
      </Section>

      <Section
        title="Categoría"
        note="Cuatro familias, y no se mezclan. Lo que decide cuál va no es el gusto: es **de qué tamaño es la pieza y qué se apoya encima**."
      >
        <Stack>
          <Family
            name="mark"
            usedFor="La marca de 44 de una fila, la inicial de un avatar"
            note="Pastel con el glifo del mismo tono varios pasos más oscuro: tiene lugar para leerse entera sin gritarle al título de al lado."
            tokens={marks}
          />
          <Family
            name="label"
            usedFor="Lo chico: un chip, el cuadradito de icono de una tarjeta"
            note="Vivos, todos con el mismo texto blanco encima. En orden de rueda, porque quien los usa reparte por hash y desordenados dos nombres seguidos caían en dos tonos casi iguales."
            tokens={labels}
          />
          <Family
            name="tint"
            usedFor="Una superficie grande teñida. Hoy no la usa ninguna pieza"
            note="Apagados porque llevan un dibujo en tinta encima. Se quedan para cuando haga falta, y que no los use nadie conviene que esté a la vista."
            tokens={tints}
          />
          <Family
            name="space"
            usedFor="La carpeta de un espacio"
            note="El único color que se dibuja con SVG, porque la carpeta es bicolor y una fuente monocroma no puede."
            tokens={spaces}
          />
        </Stack>
        <Note title="Antes de teñir algo">
          Los roles vivieron un rato juntos bajo el mismo nombre y de ahí salieron dos bugs: los
          chips quedaron pastel cuando ya tenían que ser vivos, y al pasarlos a vivos se llevó
          puesta la marca de la lista, que tenía que quedar pastel.
        </Note>
      </Section>

      <Section
        title="Dato"
        note="La pista es lo que había para hacer y el relleno es lo hecho. **No son los tonos de estado aunque en claro coincidan**: un tono de estado está anclado donde el blanco encima se lee, y un relleno no lleva texto encima, así que lo que necesita es despegarse de su pista."
      >
        <div className={`${cls.dataCard} bg-surface`}>
          <Progress label="Corregidas" value={18} max={24} hint="18 de 24" />
          <Progress label="Espacio usado" value={22} max={24} tone="warn" hint="22 de 24 GB" />
        </div>
        <div className={cls.dataRamp}>
          <Swatch token="--track" note="lo que había para hacer" />
          <Swatch token="--chart-fill" note="lo hecho, el default" />
          <Swatch token="--chart-ok" note="lo terminado" />
          <Swatch token="--chart-warn" note="lo que está por llenarse" />
          <Swatch token="--chart-bad" note="lo que ya no entra" />
        </div>
      </Section>
    </Page>
  )
}

function Lead({ title, token, note, children }: { title: string; token: string; note: string; children: React.ReactNode }) {
  const vals = useTokens([token])
  return (
    <div className={`${cls.headCard} bg-surface`}>
      <span className={cls.headSwatch} style={{ background: `var(${token})` }} />
      <Stack gap="xs">
        <span className={cls.headTitle}>{title}</span>
        <code className={cls.headToken}>{token} · {vals[token]}</code>
      </Stack>
      <p className={cls.headNote}>{note}</p>
      <div className={cls.headSlot}>{children}</div>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Stack>
      <span className={cls.groupTitle}>{title}</span>
      <div className={cls.groupItems}>{children}</div>
    </Stack>
  )
}

function Family({ name, usedFor, note, tokens }: { name: string; usedFor: string; note: string; tokens: readonly string[] }) {
  return (
    <div className={`${cls.familyCard} bg-surface`}>
      <div className={cls.familyMeta}>
        <code className={cls.familyName}>{name}</code>
        <span className={cls.familyUse}>{usedFor}</span>
        <p className={cls.familyNote}>{note}</p>
      </div>
      <div className={cls.familySwatches}>
        {tokens.map(t => (
          <span key={t} className={cls.familySwatch} style={{ background: `var(${t})` }} title={t} />
        ))}
      </div>
    </div>
  )
}
