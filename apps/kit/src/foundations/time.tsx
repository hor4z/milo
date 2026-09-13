import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { clock, day, dayAndTime, duration, machineTime, timeAgo, zoneLabel } from '@milo/ui'
import { A11y, Note, Page, Panel, Rich, Section, Variant } from '../kit'

const AR = 'America/Argentina/Buenos_Aires'
const ahora = new Date('2026-03-09T15:00:00-03:00')
const hace = (ms: number) => new Date(ahora.getTime() - ms)

const cual = [
  ['Lo que acaba de pasar', 'relativo', '`hace 20 minutos`', 'Hasta una semana. Más lejos no ubica a nadie'],
  ['Lo que pasó hace más de una semana', 'la fecha', '`14 de febrero`', 'El año solo si no es este'],
  ['Una fecha de entrega', 'la fecha y la hora', '`9 de marzo a las 23:59`', 'Nunca en relativo: un vencimiento se anota'],
  ['Cuánto dura algo', 'reloj de duración', '`1:30`', 'No es una hora del día'],
  ['Una fecha que alguien copia o guarda', 'entera', '`lunes, 9 de marzo de 2026`', 'Con el día de la semana, que es como se busca en un calendario'],
]

export function TimeSection() {
  return (
    <Page
      title="Fecha y hora"
      kind="Fundamentos"
      imports="import { clock, day, dayAndTime, timeAgo } from '@milo/ui'"
      lead="Una fecha mal escrita hace perder una entrega. Todo lo que dice cuándo pasa por las mismas funciones: el reloj es de veinticuatro horas, la coma y el punto son los de acá, y la hora es la del curso y no la del navegador de quien mira."
    >
      <Section
        title="Cuál va"
        note="La pregunta es qué tiene que hacer quien lee con ese dato. Si tiene que anotarlo en algún lado, va absoluto."
      >
        <Table label="Qué formato usar según para qué se lee" minWidth={620}>
          <TableHeader>
            <TableRow>
              <TableHead>Qué se está diciendo</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Se ve</TableHead>
              <TableHead>La regla</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cual.map(([q, f, v, r]) => (
              <TableRow key={q}>
                <TableCell>{q}</TableCell>
                <TableCell>{f}</TableCell>
                <TableCell><Rich text={v} /></TableCell>
                <TableCell>{r}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        title="Vivo"
        note="Todo esto sale de las mismas funciones, con el ahora fijo en el 9 de marzo de 2026 a las 15:00 para que la vista no cambie sola."
      >
        <Panel>
          <Variant name="cuánto hace">
            <Muestra>{timeAgo(hace(20_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(60_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(20 * 60_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(2 * 3_600_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(24 * 3_600_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(3 * 24 * 3_600_000), { now: ahora })}</Muestra>
            <Muestra>{timeAgo(hace(23 * 24 * 3_600_000), { now: ahora, zone: AR })}</Muestra>
          </Variant>
          <Variant name="fecha y reloj">
            <Muestra>{clock('2026-03-09T23:59:00-03:00', { zone: AR })}</Muestra>
            <Muestra>{day('2026-03-09T12:00:00-03:00', { zone: AR })}</Muestra>
            <Muestra>{dayAndTime('2026-03-09T23:59:00-03:00', { zone: AR })}</Muestra>
            <Muestra>{day('2026-03-09T12:00:00-03:00', { zone: AR, full: true })}</Muestra>
          </Variant>
          <Variant name="duración">
            <Muestra>{duration(7)}</Muestra>
            <Muestra>{duration(90)}</Muestra>
            <Muestra>{duration(3661)}</Muestra>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="La zona es la del curso, no la del navegador"
        note="Es el error que cuesta una entrega. Una consigna que cierra a las 23:59 en el aula cierra a las 03:59 del día siguiente para quien está dos husos al este, y el navegador se lo va a mostrar en su hora local sin avisar."
      >
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-5">
          <Linea etiqueta="El mismo instante, en la zona del curso">
            {clock('2026-03-09T23:59:00-03:00', { zone: AR })} · {zoneLabel(AR, ahora)}
          </Linea>
          <Linea etiqueta="Y para alguien que lo mira desde Madrid">
            {clock('2026-03-09T23:59:00-03:00', { zone: 'Europe/Madrid' })} · {zoneLabel('Europe/Madrid', ahora)}
          </Linea>
        </div>
        <Note title="La regla, en dos partes">
          El dato se guarda en UTC y se muestra en la zona del curso. Y cuando la zona de quien mira
          no es esa, la zona se escribe al lado: sin eso, las dos horas son igual de creíbles y una
          de las dos está mal.
        </Note>
      </Section>

      <Section
        title="Lo que ve una máquina viaja con lo que ve una persona"
        note="Una fecha escrita va adentro de un `time` con su `dateTime`: ahí viaja el instante exacto en UTC, que es lo único que no depende de quién mire. Un lector de pantalla, un calendario y un buscador leen ese, no el texto."
      >
        <div className="rounded-xl border border-line bg-surface p-5">
          <p className="text-reading text-ink">
            La entrega cierra{' '}
            <time dateTime={machineTime('2026-03-09T23:59:00-03:00')} className="font-semibold">
              el {dayAndTime('2026-03-09T23:59:00-03:00', { zone: AR })}
            </time>.
          </p>
          <code className="mt-3 block font-mono text-meta text-ink-muted">
            dateTime=&quot;{machineTime('2026-03-09T23:59:00-03:00')}&quot;
          </code>
        </div>
      </Section>

      <Note title="Lo que no se hace">
        No se escribe una hora a mano en un componente, ni se arma una fecha con `new Date` de un
        texto sin zona: `new Date('2026-03-09')` se interpreta en UTC y acá es el 8 a las 21. Hay un
        test que busca relojes y relativos escritos a mano fuera de estas funciones.
      </Note>

      <A11y
        items={[
          'Cada fecha va adentro de un `time` con su `dateTime` en UTC, así que lo que lee una máquina no depende de cómo quedó el texto.',
          'El reloj es de veinticuatro horas y con dos cifras, así que un lector dice "cero cinco" y no "cinco" a las 00:05.',
          'Las unidades van enteras y no abreviadas: un lector lee "hace veinte minutos" y no "hace veinte eme i ene".',
          'Lo relativo se corta a la semana: pasada esa, la fecha ubica y "hace 23 días" no.',
        ]}
      />
    </Page>
  )
}

function Muestra({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-muted px-2 py-1 font-mono text-meta text-ink">{children}</code>
}

function Linea({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0">
      <span className="text-body text-ink-muted">{etiqueta}</span>
      <span className="tabular text-reading font-semibold text-ink">{children}</span>
    </div>
  )
}
