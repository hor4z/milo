import cls from './ways.module.css'
import { BarChart, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@milo/ui'
import { Cluster, Footnote, Page, Section, Stack } from '../kit'

const week = [
  { label: 'Lun', value: 12, total: 18 },
  { label: 'Mar', value: 5, total: 14 },
  { label: 'Mié', value: 17, total: 19 },
  { label: 'Jue', value: 9, total: 21 },
  { label: 'Vie', value: 11, total: 16 },
]

const pares = [
  {
    bad: 'Guardar que alguien es "visual" y mostrarle todo en imágenes.',
    good: 'Tener la consigna escrita y grabada, y que elija cuál abre.',
    by: 'Lo primero decide por la persona a partir de una etiqueta que no predice nada. Lo segundo le da las dos y no la clasifica.',
  },
  {
    bad: 'Un test de entrada que diga qué tipo de aprendiz es cada uno.',
    good: 'Una preferencia que se elige tocando, y se cambia igual de fácil.',
    by: 'Un test al principio congela a alguien en una categoría durante todo el año. Una preferencia se da vuelta el día que el contenido cambia.',
  },
  {
    bad: 'Ofrecer el audio solo a quien declaró que prefiere escuchar.',
    good: 'Ofrecer el audio a todos, y que quede elegido para quien lo usa.',
    by: 'Esconder una forma detrás de una etiqueta es negársela justo a quien no sabía que la necesitaba.',
  },
]

export function WaysSection() {
  return (
    <Page
      title="Más de una forma"
      lead="La misma cosa se puede recibir leyéndola, escuchándola, viéndola o volviendo sobre ella. El sistema garantiza que las formas estén y que la elección quede; no clasifica a quien aprende."
    >
      <Section
        title="Lo que no hacemos, y por qué"
        note="Es la decisión que más contradice a lo que se cree, así que va primero y con el motivo puesto."
      >
        <Stack gap="sm">
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimTitle}>El sistema no guarda ni deduce un "tipo de aprendiz"</span>
            <span className={cls.claimBody}>
              Que cada persona tenga un estilo (visual, auditivo, kinestésico) y que enseñarle en ese
              estilo la haga aprender más es una de las creencias más extendidas en educación y de las
              peor sostenidas: cuando se la pone a prueba, emparejar el formato con la preferencia que
              alguien declara no mejora los resultados. Lo que sí aparece una y otra vez es otra cosa,
              y es la que el sistema toma.
            </span>
          </div>
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimTitle}>Lo que sí está sostenido</span>
            <span className={cls.claimBody}>
              Que las preferencias existen y que vale respetarlas. Que el formato lo decide el
              contenido y no la persona: la geometría se ve porque es espacial, el tono de una
              devolución se escucha porque es tono, un procedimiento se mira porque pasa en el tiempo.
              Y que tener la misma cosa en más de una forma ayuda a cualquiera, sin emparejar a nadie
              con nada.
            </span>
          </div>
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimTitle}>Por qué esto es una regla de diseño y no una opinión</span>
            <span className={cls.claimBody}>
              Porque una etiqueta puesta en la interfaz vuelve: si una pantalla dice que alguien es
              visual, el que la lee le va a dar menos texto. Clasificar a un chico de once años por
              cómo se supone que aprende es una decisión con consecuencias, y el sistema no tiene con
              qué sostenerla.
            </span>
          </div>
        </Stack>
      </Section>

      <Section
        title="La regla"
        note="Toda cosa que el sistema muestre tiene que poder llegar de más de una forma, y la elección es de quien mira."
      >
        <div className={cls.ruleGrid}>
          {[
            ['Se ofrece, no se empareja', 'Las formas están todas disponibles para todos. Ninguna aparece o desaparece según un perfil.'],
            ['La elección se recuerda', 'Si alguien abrió la tabla en vez del gráfico, la próxima vez está la tabla. Se guarda lo que hizo, no lo que es.'],
            ['Y se cambia de a una', 'La preferencia se da vuelta donde se usa, no en una pantalla de ajustes a tres clics.'],
            ['Ninguna forma es la de segunda', 'La transcripción no va escondida en un acordeón que dice "accesibilidad": va al lado del audio.'],
          ].map(([t, d]) => (
            <div key={t} className={`${cls.specimen} bg-surface`}>
              <span className={cls.specimenLabel}>{t}</span>
              <span className={cls.specimenBody}>{d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El sistema ya lo hacía en dos lugares"
        note="Sin haberlo nombrado. Esta vista le pone el nombre a lo que Gráficos y Voz y sonido ya decidieron por su cuenta."
      >
        <Cluster gap="lg" align="start">
          <div className={cls.pairBox}>
            <BarChart data={week} title="Corregidas sobre entregadas por día" height={140} />
            <Footnote>El gráfico, para el que lo lee de un vistazo.</Footnote>
          </div>
          <div className={cls.pairBox}>
            <Table label="Corregidas sobre entregadas por día" minWidth={260}>
              <TableHeader>
                <TableRow>
                  <TableHead>Día</TableHead>
                  <TableHead align="right">Corregidas</TableHead>
                  <TableHead align="right">Entregas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {week.map(d => (
                  <TableRow key={d.label}>
                    <TableCell>{d.label}</TableCell>
                    <TableCell align="right">{d.value}</TableCell>
                    <TableCell align="right">{d.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Footnote>La tabla, que además se puede copiar, buscar y leer en voz alta.</Footnote>
          </div>
        </Cluster>
        <Footnote>
          Los mismos números, dos formas, y ninguna de las dos está atada a quién mira. La regla vieja
          decía que todo gráfico se tiene que poder leer sin verlo; esta dice lo mismo para todo lo demás.
        </Footnote>
      </Section>

      <Section
        title="Volver sobre algo es la otra forma"
        note="La repetición espaciada y el volver a intentar son de lo mejor sostenido que hay en aprendizaje, y no son un estilo de nadie: funcionan para cualquiera. Lo que le toca al sistema es que volver salga barato."
      >
        <div className={cls.ruleGrid}>
          {[
            ['Lo visto queda marcado', 'Para poder volver hace falta saber dónde se estuvo. Sin eso, volver es empezar de nuevo.'],
            ['Reintentar no es fracasar', 'Un segundo intento se ve igual que el primero. Si el sistema lo pinta de rojo, enseña a no intentar.'],
            ['Nada se borra al salir', 'Lo que alguien dejó a medias sigue a medias cuando vuelve, y no en blanco.'],
            ['Volver cuesta un toque', 'Si volver a la consigna pide tres pantallas, en la práctica nadie vuelve.'],
          ].map(([t, d]) => (
            <div key={t} className={`${cls.specimen} bg-surface`}>
              <span className={cls.specimenLabel}>{t}</span>
              <span className={cls.specimenBody}>{d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Con qué se confunde"
        note="Lo de la izquierda suena a lo mismo y no lo es. La diferencia siempre está en si el sistema decide por alguien o le da con qué decidir."
      >
        <Stack>
          {pares.map(p => (
            <div key={p.good} className={cls.comparison}>
              <div className={cls.comparisonBad}>
                <Icon name="close" size={16} className={cls.verdictIconBad} />
                <span className={cls.badText}>{p.bad}</span>
              </div>
              <div className={cls.comparisonGood}>
                <Icon name="check" size={16} className={cls.verdictIconGood} />
                <div className={cls.goodBlock}>
                  <span className={cls.goodText}>{p.good}</span>
                  <span className={cls.goodWhy}>{p.by}</span>
                </div>
              </div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section
        title="El acceso no es una preferencia"
        note="Y por eso no vive acá."
      >
        <Stack gap="sm">
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimBody}>
              Los subtítulos, el texto alternativo, el contraste y el movimiento reducido no son formas
              entre las que alguien elige por gusto: son la condición para que el contenido exista para
              esa persona. Están en Accesibilidad y en Medios, y no se negocian. Mezclarlos con
              las preferencias los vuelve opcionales, que es exactamente lo que no son.
            </span>
          </div>
        </Stack>
      </Section>
    </Page>
  )
}
