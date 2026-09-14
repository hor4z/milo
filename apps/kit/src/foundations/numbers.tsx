import cls from './numbers.module.css'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { bytes, count, decimals, delta, share, span, withUnit } from '@milo/ui'
import { A11y, Note, Page, Panel, Rich, Section, Stack, Variant } from '../kit'

const cual = [
  ['Una cantidad que alguien va a leer', '`18 de 24`', 'La cuenta dice cuánto falta; el porcentaje obliga a calcularlo'],
  ['Una medición', '`9,8`', 'Los decimales que se midieron y ni uno más'],
  ['Un total grande', '`1.250`', 'Nunca abreviado si hay que actuar sobre él'],
  ['Un tamaño', '`1,4 GB`', 'La unidad en la que el número se lee, y el espacio va'],
  ['Un rango', '`3 a 7`', 'Con la palabra: un guion entre números se lee como un menos'],
  ['Un cambio', '`+12%`', 'El signo pegado, y el cero sin signo'],
]

export function NumbersSection() {
  return (
    <Page
      title="Números y valores"
      kind="Fundamentos"
      imports="import { count, decimals, share, withUnit } from '@milo/ui'"
      lead="En un producto donde se corrige, se mide y se calcula, un número mal escrito se lee como otro número. La coma es el decimal y el punto separa los miles, que es como se escribe acá: un 1,250 escrito a mano se lee 1250 en media América y 1,25 en la otra."
    >
      <Section
        title="Cuál va"
        note="La pregunta es qué tiene que hacer quien lee con ese número. Casi siempre la respuesta es la cuenta y no el porcentaje."
      >
        <Table label="Qué forma usar según qué número es" minWidth={560}>
          <TableHeader>
            <TableRow>
              <TableHead>Qué es</TableHead>
              <TableHead>Se ve</TableHead>
              <TableHead>La regla</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cual.map(([q, v, r]) => (
              <TableRow key={q}>
                <TableCell>{q}</TableCell>
                <TableCell><Rich text={v} /></TableCell>
                <TableCell>{r}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Vivo" note="Todo esto sale de las mismas funciones.">
        <Panel>
          <Variant name="enteros y decimales">
            <Muestra>{count(1250)}</Muestra>
            <Muestra>{decimals(9.84)}</Muestra>
            <Muestra>{decimals(1250.5)}</Muestra>
          </Variant>
          <Variant name="una parte de un total">
            <Muestra>{share(18, 24).count}</Muestra>
            <Muestra>{share(18, 24).percent}</Muestra>
          </Variant>
          <Variant name="con unidad">
            <Muestra>{withUnit(45, 'min')}</Muestra>
            <Muestra>{bytes(1024 ** 3 * 1.4)}</Muestra>
            <Muestra>{bytes(1024 ** 3 * 24)}</Muestra>
          </Variant>
          <Variant name="rango y cambio">
            <Muestra>{span(3, 7, 'entregas')}</Muestra>
            <Muestra>{delta(12, { percent: true })}</Muestra>
            <Muestra>{delta(-3)}</Muestra>
            <Muestra>{delta(0)}</Muestra>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Un número que se compara va en columna, y los dígitos tienen que medir lo mismo"
        note="Sin la cifra tabular el 1 es más angosto que el 4 y una columna de números baila. Lo pone la utilidad `tabular`, y va en toda tabla, todo contador y todo reloj."
      >
        <div className={`${cls.tabularCompare} bg-surface`}>
          <Columna titulo="sin tabular" clase="">
            {[1250, 918, 1111, 444].map(n => <span key={n}>{count(n)}</span>)}
          </Columna>
          <Columna titulo="con tabular" clase="tabular">
            {[1250, 918, 1111, 444].map(n => <span key={n}>{count(n)}</span>)}
          </Columna>
        </div>
      </Section>

      <Section
        title="Un número solo casi nunca alcanza"
        note="Es la misma regla que Cómo se escribe: un contador informa y una frase orienta. El número va cuando cambia una decisión, y va con aquello contra lo que se mide."
      >
        <div className={cls.specimenGrid}>
          <Caso mal="45%" bien="11 de 24 corregidas" por="El porcentaje esconde el tamaño: 45% de 24 y 45% de 300 no son el mismo trabajo." />
          <Caso mal="Quedan 3" bien="Quedan 3 de 18 por corregir" por="Un número sin su total no dice si es mucho o poco." />
          <Caso mal="9,80000" bien="9,8" por="Los decimales que no se midieron son ruido que se lee como precisión." />
          <Caso mal="1,2 k entregas" bien="1.250 entregas" por="Lo abreviado sirve en el eje de un gráfico; sobre un número que se usa, no." />
        </div>
      </Section>

      <Note title="La matemática del contenido es otra cosa">
        Esto es cómo el sistema escribe un dato suyo. Una fracción, una ecuación o una unidad que
        son parte de lo que alguien está enseñando las escribe una persona y se rigen por cómo se
        lee la matemática, no por esta guía. La regla que sí cruza: una fracción adentro de un
        renglón va con barra, `3/4`, porque apilada cae abajo del piso de 12px del sistema.
      </Note>

      <A11y
        items={[
          'El número va con lo que mide en la misma frase: "18 de 24 corregidas" se escucha entero, "18" no.',
          'Las unidades van enteras en prosa: un lector lee "cuarenta y cinco minutos" y no "cuarenta y cinco eme i ene".',
          'Un cambio lleva su signo en el texto y no solo en el color: quien no distingue el verde del rojo lee el más y el menos.',
          'La cifra tabular no cambia lo que se anuncia, cambia que una columna se pueda comparar de un vistazo.',
        ]}
      />
    </Page>
  )
}

function Muestra({ children }: { children: React.ReactNode }) {
  return <code className={cls.monoSample}>{children}</code>
}

function Columna({ titulo, clase, children }: { titulo: string; clase: string; children: React.ReactNode }) {
  return (
    <Stack gap="sm">
      <span className={cls.columnLabel}>{titulo}</span>
      <div className={`${cls.column} ${clase}`}>{children}</div>
    </Stack>
  )
}

function Caso({ mal, bien, por }: { mal: string; bien: string; por: string }) {
  return (
    <div className={`${cls.specimen} bg-surface`}>
      <span className={cls.comparisonBad}>{mal}</span>
      <span className={cls.comparisonGood}>{bien}</span>
      <span className={cls.specimenBody}>{por}</span>
    </div>
  )
}
