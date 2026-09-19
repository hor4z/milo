import cls from './ai.module.css'
import { Button, Card, CardBody, Chip, Icon } from '@milo/ui'
import { Cluster, Footnote, Note, Page, Section, Stack } from '../kit'

const ejes = [
  {
    name: 'Crítica o complementaria',
    q: '¿La pantalla sirve si el modelo no contesta?',
    porque: 'Si sirve, el modelo es un extra y se le perdona equivocarse. Si no sirve, cada error es la pantalla entera rota. Cuanto más al centro esté, más exactitud hay que pedirle.',
  },
  {
    name: 'Pedida o espontánea',
    q: '¿Contesta porque alguien preguntó, o aparece sola?',
    porque: 'Con lo que aparece solo hay mucha menos paciencia, porque nadie lo pidió. Una sugerencia espontánea que se equivoca se siente como que el sistema hace lo que quiere.',
  },
  {
    name: 'A la vista o por detrás',
    q: '¿Se nota que hay un modelo, o está adentro del orden de una lista?',
    porque: 'Lo que está a la vista se puede juzgar y corregir. Lo que está por detrás no, y por eso no puede decidir nada que importe sin que se vea.',
  },
  {
    name: 'Con datos de alguien o sin ellos',
    q: '¿Toca el trabajo, el nombre o la nota de una persona?',
    porque: 'Acá son chicos, así que la respuesta casi siempre es sí y las reglas son más estrictas que en cualquier otro producto.',
  },
]

const reglas = [
  {
    title: 'Se ve que es la máquina',
    body: 'Nunca disfrazada de persona, ni en el texto ni en la voz. Y la trampa cercana: Otto y Amelia son mascotas, no hablantes. Si el modelo empieza a contestar por ellas, un chico de once años deja de distinguir quién le respondió.',
    icon: 'smart_toy' as const,
  },
  {
    title: 'Sugerir no es hacer',
    body: 'Una sugerencia se acepta o se descarta y hasta entonces no pasó nada. Algo hecho ya pasó y hay que poder volver atrás. Las dos cosas no se pueden ver igual, porque la diferencia es quién decidió.',
    icon: 'lightbulb' as const,
  },
  {
    title: 'Antes de algo que no se deshace, se pregunta',
    body: 'Nada que borre, mande o cierre se hace en nombre de alguien sin confirmación. Y lo que se puede deshacer se deshace desde al lado de lo que se hizo, no en un menú.',
    icon: 'undo' as const,
  },
  {
    title: 'Lo que tocó se ve',
    body: 'Si el modelo cambió el trabajo de alguien, esa persona ve qué cambió. Un texto que vuelve distinto y sin marcas es un texto que dejó de ser suyo sin que se entere.',
    icon: 'edit' as const,
  },
  {
    title: 'No dice más de lo que sabe',
    body: 'Un modelo inseguro no se calla: inventa con el mismo tono que usa para lo que sabe. Así que nada generado se muestra con la forma de un dato medido, y un número inventado nunca lleva la tipografía tabular de uno contado.',
    icon: 'help' as const,
  },
  {
    title: 'Siempre hay camino sin IA',
    body: 'Toda tarea que el modelo ayuda a hacer se puede hacer sin él. Si apagarlo deja a alguien sin poder entregar, entonces no era ayuda: era la única puerta.',
    icon: 'lock_open' as const,
  },
  {
    title: 'Mientras piensa, dice qué está haciendo',
    body: 'Un modelo tarda. "Procesando" no informa; "Buscando en las tres entregas anteriores" sí, y además hace que la espera se sienta corta. Es la misma regla que ya está escrita en Cómo se escribe.',
    icon: 'schedule' as const,
  },
  {
    title: 'El docente ve que hubo IA, y no es una acusación',
    body: 'Aparece como información de la entrega, del mismo modo que aparece la fecha. No es un detector, no da un puntaje de sospecha y no dice quién hizo trampa: dice qué pasó.',
    icon: 'group' as const,
  },
]

export function AiSection() {
  return (
    <Page
      title="Cuando responde la IA"
      lead="Los chicos ya la usan, y eso los potencia y también los perjudica. Lo que el sistema puede decidir no es si la usan: es cómo se comporta una interfaz cuando una parte de ella es un modelo, para que nunca se pierda de vista quién hizo qué."
    >
      <Section
        title="Dónde termina el design system"
        note="Va primero porque es la parte que más se confunde."
      >
        <Stack gap="sm">
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimTitle}>Lo que no decide</span>
            <span className={cls.claimBody}>
              Si los chicos deberían usar IA, cuánto, para qué tarea y a partir de qué edad. Eso es
              pedagogía y política de escuela, y está por encima de un sistema de interfaz. Un botón no
              puede resolver esa discusión y no debería fingir que la resolvió.
            </span>
          </div>
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimTitle}>Lo que sí decide</span>
            <span className={cls.claimBody}>
              Cómo se ve un modelo cuando contesta, qué pasa cuando se equivoca, quién queda con la
              última palabra, y qué se puede deshacer. Eso es forma, y la forma es de acá.
            </span>
          </div>
        </Stack>
      </Section>

      <Section
        title="Antes de diseñar, ubicar la función en cuatro ejes"
        note="Dos funciones que usan el mismo modelo pueden pedir cosas opuestas. Lo que cambia no es el modelo: es dónde cae en estos cuatro."
      >
        <Stack gap="sm">
          {ejes.map(e => (
            <div key={e.name} className={cls.axisRow}>
              <span className={cls.axisName}>{e.name}</span>
              <div className={cls.axisBody}>
                <span className={cls.axisQuestion}>{e.q}</span>
                <span className={cls.axisWhy}>{e.porque}</span>
              </div>
            </div>
          ))}
        </Stack>
      </Section>

      <Section
        title="Las ocho reglas"
        note="Ninguna es sobre la calidad del modelo. Todas son sobre qué ve y qué puede hacer la persona del otro lado."
      >
        <div className={cls.specimenGrid}>
          {reglas.map(r => (
            <div key={r.title} className={`${cls.specimen} bg-surface`}>
              <span className={`${cls.roleBadge} inset-relief`}>
                <Icon name={r.icon} size={18} />
              </span>
              <span className={cls.specimenLabel}>{r.title}</span>
              <span className={cls.specimenBody}>{r.body}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Sugerir y haber hecho, uno al lado del otro"
        note="La misma corrección, en los dos estados. A la izquierda todavía no pasó nada y la decisión es de quien mira; a la derecha ya pasó y lo que queda es poder volver."
      >
        <Cluster gap="lg" align="start">
          <Card className={cls.demoCard}>
            <CardBody>
              <div className={cls.demoHead}>
                <Chip size="sm" icon="smart_toy">Sugerencia</Chip>
              </div>
              <p className={cls.demoText}>
                Propone una devolución para Ana: "Resolviste bien las dos primeras. En la tercera te falta
                justificar por qué la pendiente da la mitad."
              </p>
              <Cluster gap="sm">
                <Button size="sm" variant="muted">Usar esto</Button>
                <Button size="sm" variant="ghost">Descartar</Button>
              </Cluster>
            </CardBody>
          </Card>
          <Card className={cls.demoCard}>
            <CardBody>
              <div className={cls.demoHead}>
                <Chip size="sm" color="info" icon="edit">Lo escribió la IA</Chip>
              </div>
              <p className={cls.demoText}>
                Resolviste bien las dos primeras. En la tercera te falta justificar por qué la pendiente da
                la mitad.
              </p>
              <Cluster gap="sm">
                <Button size="sm" variant="muted" iconStart={<Icon name="undo" />}>Deshacer</Button>
                <Button size="sm" variant="ghost">Ver qué cambió</Button>
              </Cluster>
            </CardBody>
          </Card>
        </Cluster>
        <Footnote>
          Lo que las separa no es el color: es que una tiene dos salidas antes de que pase algo y la otra
          tiene dos salidas después. Un solo botón que diga "Aceptar" en las dos borra la diferencia.
        </Footnote>
      </Section>

      <Section
        title="La voz generada es las dos cosas a la vez"
        note="Es un medio y es un modelo, así que le corren las reglas de los dos lados."
      >
        <Stack gap="sm">
          <div className={`${cls.claimCard} bg-surface`}>
            <span className={cls.claimBody}>
              Voz y sonido ya tiene escrito cómo suena una devolución hablada: cálida antes que correcta,
              en el castellano de acá, más lenta que una charla y con las pausas puestas. Eso es
              exactamente lo que una voz sintetizada rompe primero. Una voz generada se anuncia como
              generada, y no se usa para una devolución personal: el tono es la mitad del mensaje y ahí el
              tono no es de nadie.
            </span>
          </div>
        </Stack>
      </Section>

      <Note title="De dónde sale esto">
        Las ocho reglas y los cuatro ejes siguen las Human Interface Guidelines de Apple, que en esto es
        de lo más completo que hay escrito: que nadie crea que habla con una persona cuando habla con un
        modelo, que la gente mantenga el control y pueda descartar o deshacer, que se pida confirmación
        antes de algo irreversible, que se avise que lo generado puede tener errores, que haya camino sin
        IA cuando se pueda, y que la espera diga qué está pasando en vez de "Procesando". Apple además
        marca que las apps para chicos tienen reglas más estrictas sobre qué datos se pueden usar, que es
        exactamente nuestro caso. Lo que no sale de ahí es lo de las mascotas y lo del docente, que son de
        este producto.
      </Note>
    </Page>
  )
}
