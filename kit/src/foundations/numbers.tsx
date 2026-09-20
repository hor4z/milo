import cls from './numbers.module.css'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui/table'
import { bytes, count, decimals, delta, share, span, withUnit } from '@milo/ui/lib/number'
import { A11y, Note, Page, Panel, Rich, Section, Stack, Variant } from '../kit'

const which = [
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
      imports="import { count, decimals, share, withUnit } from '@milo/ui/lib/number'"
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
            {which.map(([q, v, r]) => (
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
            <Sample>{count(1250)}</Sample>
            <Sample>{decimals(9.84)}</Sample>
            <Sample>{decimals(1250.5)}</Sample>
          </Variant>
          <Variant name="una parte de un total">
            <Sample>{share(18, 24).count}</Sample>
            <Sample>{share(18, 24).percent}</Sample>
          </Variant>
          <Variant name="con unidad">
            <Sample>{withUnit(45, 'min')}</Sample>
            <Sample>{bytes(1024 ** 3 * 1.4)}</Sample>
            <Sample>{bytes(1024 ** 3 * 24)}</Sample>
          </Variant>
          <Variant name="rango y cambio">
            <Sample>{span(3, 7, 'entregas')}</Sample>
            <Sample>{delta(12, { percent: true })}</Sample>
            <Sample>{delta(-3)}</Sample>
            <Sample>{delta(0)}</Sample>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Un número que se compara va en columna, y los dígitos tienen que medir lo mismo"
        note="Sin la cifra tabular el 1 es más angosto que el 4 y una columna de números baila. Lo pone la utilidad `tabular`, y va en toda tabla, todo contador y todo reloj."
      >
        <div className={`${cls.tabularCompare} bg-surface`}>
          <Column title="sin tabular" variant="">
            {[1250, 918, 1111, 444].map(n => <span key={n}>{count(n)}</span>)}
          </Column>
          <Column title="con tabular" variant="tabular">
            {[1250, 918, 1111, 444].map(n => <span key={n}>{count(n)}</span>)}
          </Column>
        </div>
      </Section>

      <Section
        title="Un número solo casi nunca alcanza"
        note="Es la misma regla que Cómo se escribe: un contador informa y una frase orienta. El número va cuando cambia una decisión, y va con aquello contra lo que se mide."
      >
        <div className={cls.specimenGrid}>
          <Case bad="45%" good="11 de 24 corregidas" by="El porcentaje esconde el tamaño: 45% de 24 y 45% de 300 no son el mismo trabajo." />
          <Case bad="Quedan 3" good="Quedan 3 de 18 por corregir" by="Un número sin su total no dice si es mucho o poco." />
          <Case bad="9,80000" good="9,8" by="Los decimales que no se midieron son ruido que se lee como precisión." />
          <Case bad="1,2 k entregas" good="1.250 entregas" by="Lo abreviado sirve en el eje de un gráfico; sobre un número que se usa, no." />
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

function Sample({ children }: { children: React.ReactNode }) {
  return <code className={cls.monoSample}>{children}</code>
}

function Column({ title, variant, children }: { title: string; variant: string; children: React.ReactNode }) {
  return (
    <Stack gap="sm">
      <span className={cls.columnLabel}>{title}</span>
      <div className={`${cls.column} ${variant}`}>{children}</div>
    </Stack>
  )
}

function Case({ bad, good, by }: { bad: string; good: string; by: string }) {
  return (
    <div className={`${cls.specimen} bg-surface`}>
      <span className={cls.comparisonBad}>{bad}</span>
      <span className={cls.comparisonGood}>{good}</span>
      <span className={cls.specimenBody}>{by}</span>
    </div>
  )
}
