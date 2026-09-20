import type { ReactNode } from 'react'
import { clock, day, dayAndTime, duration, timeAgo, zoneLabel } from '@milo/ui/lib/time'
import { bytes, count, counted, decimals, delta, plural, share, span, withUnit } from '@milo/ui/lib/number'
import { colorForName } from '@milo/ui/lib/colors'
import { Table } from '@milo/ui/table'
import { A11y, Example, Mono, Page, Practices, Section } from '../kit'

const AHORA = new Date('2026-03-09T18:20:00-03:00')
const HACE_UN_RATO = new Date('2026-03-09T18:00:00-03:00')
const CIERRE = new Date('2026-03-09T23:59:00-03:00')

/** Cada fila es la llamada de verdad y su resultado de verdad: el valor sale de correr la función, no de un texto escrito al lado. */
function Fila({ call, out }: { call: string; out: string }) {
  return (
    <Table.Row>
      <Table.Cell><Mono>{call}</Mono></Table.Cell>
      <Table.Cell>{out}</Table.Cell>
    </Table.Row>
  )
}

function Tabla({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Table label={label} minWidth={520}>
      <Table.Header>
        <Table.Row>
          <Table.Head>Cómo se llama</Table.Head>
          <Table.Head>Qué devuelve</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>{children}</Table.Body>
    </Table>
  )
}

export function UtilidadesStory() {
  return (
    <Page
      title="Utilidades"
      kind="Fundamentos"
      imports="import { timeAgo } from '@milo/ui/lib/time'"
      lead="Las funciones que escriben una fecha, un número o un color. Acá está la API; cuándo usar cada formato está en [Fecha y hora](#time) y en [Números y valores](#numbers)."
    >
      <Section
        title="Fecha y hora"
        note="Todas escriben en es-AR y toman la zona del contenido, no la del navegador. Sin `zone` usan la de quien mira, que es lo correcto cuando el dato es suyo."
      >
        <Tabla label="Las funciones de fecha y hora">
          <Fila call="clock(cierre)" out={clock(CIERRE)} />
          <Fila call="day(cierre)" out={day(CIERRE)} />
          <Fila call="day(cierre, { full: true })" out={day(CIERRE, { full: true })} />
          <Fila call="dayAndTime(cierre)" out={dayAndTime(CIERRE)} />
          <Fila call="timeAgo(hace20min)" out={timeAgo(HACE_UN_RATO, { now: AHORA })} />
          <Fila call="duration(5430)" out={duration(5430)} />
          <Fila call="zoneLabel('Europe/Madrid')" out={zoneLabel('Europe/Madrid', AHORA)} />
        </Tabla>
      </Section>

      <Section
        title="Números y valores"
        note="Separador de miles con punto y decimal con coma, que es como se escribe acá. `plural` existe porque el castellano no se resuelve sumando una `s`."
      >
        <Tabla label="Las funciones de número">
          <Fila call="count(1250)" out={count(1250)} />
          <Fila call="decimals(9.84)" out={decimals(9.84)} />
          <Fila call="share(18, 24).count" out={share(18, 24).count} />
          <Fila call="share(18, 24).percent" out={share(18, 24).percent} />
          <Fila call="withUnit(45, 'min')" out={withUnit(45, 'min')} />
          <Fila call="span(3, 7, 'entregas')" out={span(3, 7, 'entregas')} />
          <Fila call="delta(12, { percent: true })" out={delta(12, { percent: true })} />
          <Fila call="bytes(2400000)" out={bytes(2400000)} />
          <Fila call="plural(1, ['actividad', 'actividades'])" out={plural(1, ['actividad', 'actividades'])} />
          <Fila call="counted(1250, ['entrega', 'entregas'])" out={counted(1250, ['entrega', 'entregas'])} />
        </Tabla>
      </Section>

      <Section
        title="Color"
        note="El color de una persona sale de su nombre, así que la misma persona tiene siempre el mismo tinte en toda la aplicación."
      >
        <Tabla label="Las funciones de color">
          <Fila call="colorForName('Ana Pérez')" out={colorForName('Ana Pérez')} />
          <Fila call="colorForName('Bruno Díaz')" out={colorForName('Bruno Díaz')} />
        </Tabla>
      </Section>

      <Section
        title="Hooks"
        note="Los siete que el paquete trae. Cada uno entra por su propio archivo, así que tocar uno no invalida a los demás."
      >
        <Tabla label="Los hooks">
          <Fila call="useDisclosure()" out="{ open, onOpen, onClose, onToggle }" />
          <Fila call="useAnnounce()" out="announce(texto, 'polite' | 'assertive')" />
          <Fila call="useTheme()" out="{ theme, resolved, setTheme, toggle }" />
          <Fila call="useMediaQuery(query)" out="true o false, y se entera al cambiar" />
          <Fila call="useReducedMotion()" out="quién pidió menos movimiento" />
          <Fila call="useClipboard()" out="{ copied, copy }" />
          <Fila call="useDebounce(valor, ms)" out="el valor, cuando dejó de cambiar" />
          <Fila call="useLocalStorage(clave, inicial)" out="[valor, setValor], y sincroniza entre pestañas" />
        </Tabla>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`import { timeAgo } from '@milo/ui/lib/time'
import { counted } from '@milo/ui/lib/number'
import { useDisclosure } from '@milo/ui/lib/use-disclosure'

<p>{counted(entregas.length, ['entrega', 'entregas'])} · {timeAgo(ultima)}</p>

const { open, onOpen, onClose } = useDisclosure()`} />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Un reloj, una fecha o un relativo se escriben con estas funciones y nunca a mano: hay un test que busca los escritos a mano.</Practices.Do>
          <Practices.Do>Un número con su palabra va con `counted`, que resuelve el plural.</Practices.Do>
          <Practices.Dont>No armes una fecha con `new Date('2026-03-09')`: eso se interpreta en UTC y acá es el 8 a las 21.</Practices.Dont>
        </Practices>
      </Section>

      <A11y>
        <A11y.Item>{'Una fecha escrita para una máquina viaja aparte con `machineTime`, adentro de un `<time dateTime>`: ahí va el instante en UTC, que no depende de quién mire.'}</A11y.Item>
        <A11y.Item>`useAnnounce` escribe en una sola región viva para todo el documento: dos regiones compitiendo se pisan y el lector anuncia una sola.</A11y.Item>
        <A11y.Item>`useReducedMotion` es para darle otra salida a lo que informa por moverse, no para congelarlo.</A11y.Item>
      </A11y>
    </Page>
  )
}
