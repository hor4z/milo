import cls from './chip.module.css'
import { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Chip, labelColors } from '@milo/ui'
import { A11y, Cluster, Demo, Note, Page, Panel, Props, Section, Variant } from '../kit'

export function ChipStory() {
  const [chips, setChips] = useState(['Indagación', 'Proyecto', 'Taller'])

  return (
    <Page
      title="Chip"
      kind="Datos"
      imports="import { Chip } from '@milo/ui'"
      lead="La marca chica de texto, y hay una sola. Dice en qué estado está una actividad, o nombra una categoría, un método o una persona. Siempre con texto: un punto de color no dice en qué estado está algo, y si lo dijera, no lo diría para quien no distingue colores."
    >
      <Section
        title="Dos tamaños, y el tamaño es la decisión"
        note="`sm` es la marca pegada a lo que describe: va al lado de un título, adentro de una celda, y por eso mide 20 y va en el escalón de metadato con peso. `md` es la etiqueta que vive en una fila de filtros, donde hay cinco y se tocan: mide 28, va en el escalón de interfaz y tiene lugar para una cruz. El default es `md`."
      >
        <Panel>
          <Variant name="sm">
            <Chip size="sm">Borrador</Chip>
            <Chip size="sm" color="ok" icon="check_circle">Corregida</Chip>
            <Chip size="sm" color="warn" icon="schedule">Vence mañana</Chip>
          </Variant>
          <Variant name="md">
            <Chip>Borrador</Chip>
            <Chip color="ok" icon="check_circle">Corregida</Chip>
            <Chip color="warn" icon="schedule">Vence mañana</Chip>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Diez colores, y son dos familias"
        note="Los cuatro de estado son los mismos de `Alert` y de `Toast` y significan lo mismo en las tres piezas, que es de lo que se trata tener un sistema. Los seis de categoría son la familia viva en su **par suave**: fondo apagado y tinta del mismo tono, anclada a 4.6:1. Un chip nunca viene solo, y seis rellenos vivos juntos compiten entre sí y con todo lo demás. Los diez nombres son distintos, así que entran por la misma prop y no hay que elegir cuál de dos usar."
      >
        <Panel>
          <Variant name="estado">
            <Chip color="info">En prueba</Chip>
            <Chip color="ok">Corregida</Chip>
            <Chip color="warn">Vence mañana</Chip>
            <Chip color="bad">Sin entregar</Chip>
          </Variant>
          <Variant name="categoría">
            {labelColors.map(c => <Chip key={c} color={c}>{c}</Chip>)}
          </Variant>
          <Variant name="sin color"><Chip>Indagación</Chip></Variant>
        </Panel>
      </Section>

      <Section
        title="Lo que le puede pasar adelante y atrás"
        note="El glifo nombra lo que el texto ya dice y sirve para reconocerlo de reojo. El punto es para cuando no hay glifo que sirva: clasifica sin nombrar. La cruz lo vuelve removible, y `onClick` lo vuelve accionable."
      >
        <Panel>
          <Variant name="con icono">
            <Chip color="green" icon="check">Corregida</Chip>
            <Chip color="orange" icon="schedule">Vence mañana</Chip>
            <Chip color="purple" icon="person">Nadia Britos</Chip>
          </Variant>
          <Variant name="con punto">
            <Chip color="blue" dot>En curso</Chip>
            <Chip color="pink" dot>Borrador</Chip>
          </Variant>
          <Variant name="activo"><Chip active>Elegido</Chip></Variant>
          <Variant name="clickeable"><Chip onClick={() => {}}>Se toca</Chip></Variant>
          <Variant name="removible">
            {chips.map(c => (
              <Chip key={c} onRemove={() => setChips(cs => cs.filter(x => x !== c))}>{c}</Chip>
            ))}
            {chips.length === 0 && <span className={cls.emptyNote}>se fueron todos: recargá para volver a verlos</span>}
          </Variant>
          <Variant name="las dos cosas">
            <Chip color="blue" onClick={() => {}} onRemove={() => {}}>Matemática</Chip>
            <Chip color="pink" onClick={() => {}} onRemove={() => {}}>Lengua</Chip>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Dónde va"
        note="Pegado a lo que describe, no suelto en una esquina: una marca lejos de su sujeto obliga a adivinar de qué está hablando. En una tarjeta va en la cabecera, al lado del título; en una fila de tabla, en su columna."
      >
        <Demo label="en la cabecera de una tarjeta">
          <Cluster gap="lg" align="start">
            <Card className={cls.correctedCard}>
              <CardHeader>
                <CardTitle>Fracciones equivalentes</CardTitle>
                <Chip size="sm" color="ok" icon="check_circle">Corregida</Chip>
              </CardHeader>
              <CardBody>
                <p className={cls.correctedMeta}>Matemática · 4.º A · 24 entregas</p>
              </CardBody>
            </Card>
            <Card className={cls.dueCard}>
              <CardHeader>
                <CardTitle>Mapa de América</CardTitle>
                <Chip size="sm" color="warn" icon="schedule">Vence mañana</Chip>
              </CardHeader>
              <CardBody>
                <p className={cls.dueMeta}>Sociales · 5.º A · 3 de 7</p>
              </CardBody>
            </Card>
          </Cluster>
        </Demo>
      </Section>

      <Note title="Acá había dos piezas y ahora hay una">
        Existía un `Badge` al lado de este chip, y las dos vistas necesitaban una nota para
        explicar en qué se diferenciaban. Cuando un sistema necesita dos notas para sostener una
        distinción, la distinción no existe: la regla escrita era sobre qué se escribe adentro, no
        sobre qué hace la pieza, y una pieza no puede hacerla cumplir. Las dos dibujaban lo mismo,
        una marca chica con texto y un glifo opcional, y lo que las separaba de verdad era el
        tamaño y la familia de color, que ahora son dos props. Quedó el nombre `Chip` y no `Badge`
        porque en este sistema el badge de todos los demás ya existe con otro nombre: es el
        `Indicator`, el punto o el contador pegado a la esquina de un botón.
      </Note>

      <Section title="Props">
        <Props of="Chip" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El estado está en el texto, no en el color: quien no distingue tonos lee lo mismo.',
          'Sin onClick ni onRemove es un <span>: no entra en el orden de tabulación algo que no hace nada.',
          'El glifo es decorativo y no se anuncia dos veces: lo que se lee es el texto.',
          'La cruz de quitar es un botón con su propio nombre, así que se puede usar con el teclado.',
          'Un chip que se toca y se saca son dos botones hermanos y no uno adentro del otro: anidados, tocar la cruz disparaba también el click del chip.',
          'El contraste de cada color contra su fondo está verificado en los dos temas, y hay tests que fallan si alguien lo rompe.',
        ]} />
      </Section>
    </Page>
  )
}
