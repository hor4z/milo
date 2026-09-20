import cls from './states.module.css'
import { useState } from 'react'
import { Button, Card, Chip, EmptyState, Icon, Skeleton, Spinner, Switch, TextField } from '@milo/ui'
import { A11y, Note, Page, Rich, Section, Stack } from '../kit'

/** Los seis estados de algo que se toca, y con qué los dice este sistema. */
const interaction = [
  { name: 'reposo', how: 'El relleno de la pieza y nada más.', why: 'El estado base también es un estado: si no se distingue de un hover, el hover no informa.' },
  { name: 'hover', how: 'Un paso de tinta en alpha sobre el fondo. Nunca un movimiento.', why: 'El hover dice "esto responde". No existe sin mouse, así que nunca es la única forma de enterarse de algo.' },
  { name: 'pressed', how: 'El relleno se oscurece un punto, y sin transición.', why: 'Es el único estado que el dedo confirma antes que el ojo, así que tiene que aparecer en el mismo momento del toque: uno que tarda no confirma nada.' },
  { name: 'focus', how: 'El anillo azul, el mismo en todo el sistema.', why: 'El único lugar donde el color es la señal. Va con `:focus-visible`: aparece con el teclado y no con el click, que es cuando estorba.' },
  { name: 'selected', how: 'Hundido o en el suave del azul, según la pieza.', why: '"Elegido" y "apretado" son cosas distintas y se confunden solas: lo apretado vuelve, lo elegido se queda.' },
  { name: 'disabled', how: 'Opacidad 45% y el puntero apagado.', why: 'Se sigue leyendo, que es el punto: algo deshabilitado tiene que poder explicar por qué lo está.' },
] as const

export function StatesSection() {
  return (
    <Page
      title="Estados"
      kind="Fundamentos"
      lead="Lo que una pieza hace cuando algo le pasa: se toca, se está cargando, se rompió, no tiene nada adentro. Es la mitad de la experiencia y la mitad que se documenta menos, porque la pantalla del caso feliz es la que se dibuja primero."
      imports="import { EmptyState, Skeleton, Spinner } from '@milo/ui'"
    >
      <Section
        title="La regla que ordena todo esto"
        note="Cada estado tiene una forma además de un tono. Un cambio de color solo es una señal que no llega a quien no distingue colores, a quien mira de reojo, ni a quien está en una pantalla mal calibrada de un aula. La forma puede ser el relieve, la opacidad, un glifo o una palabra, pero alguna hay."
      >
        <div className={`${cls.stateList} bg-surface`}>
          {interaction.map(e => (
            <div key={e.name} className={cls.stateRow}>
              <code className={cls.stateName}>{e.name}</code>
              <span className={cls.stateHow}>{e.how}</span>
              <span className={cls.stateWhy}><Rich text={e.why} /></span>
            </div>
          ))}
        </div>
      </Section>

      <Live />

      <Section
        title="Los cuatro estados de una pantalla que espera"
        note="Ninguno es el caso feliz y los cuatro pasan todos los días. Elegir mal entre ellos es lo que hace que alguien recargue una página que estaba bien."
      >
        <div className={cls.screenGrid}>
          <StateCard
            title="Cargando, y sabemos qué va a venir"
            tag="Skeleton"
            note="El esqueleto ocupa el lugar exacto de lo que falta, así que cuando llega no se mueve nada. Solo va cuando la forma es previsible: una fila, una tarjeta, un avatar."
          >
            <Stack>
              {[0, 1].map(i => (
                <div key={i} className={`${cls.loadingRow} bg-surface`}>
                  <Skeleton className={cls.avatarBone} />
                  <div className={cls.loadingLines}>
                    <Skeleton className={cls.titleBone} />
                    <Skeleton className={cls.metaBone} />
                  </div>
                </div>
              ))}
            </Stack>
          </StateCard>

          <StateCard
            title="Cargando, y no sabemos qué"
            tag="Spinner"
            note="Cuando no se puede dibujar la forma de lo que viene (una acción, un cálculo, una búsqueda sin resultados todavía) el esqueleto mentiría. El spinner no promete nada, solo dice que algo está pasando."
          >
            <div className={`${cls.workingCard} bg-surface`}>
              <Spinner size={28} />
              <span className={cls.workingText}>Corrigiendo 24 entregas…</span>
            </div>
          </StateCard>

          <StateCard
            title="Vacío porque todavía no empezó"
            tag="EmptyState"
            note="El vacío más importante y el que se trata peor. No es un error: es la primera vez. Dice qué va a haber acá y ofrece la acción que lo llena: un vacío sin salida es una pantalla que no se puede usar."
          >
            <EmptyState
              icon="folder_open"
              title="Todavía no hay actividades"
              body="Cuando crees la primera, la vas a ver acá con sus entregas y su estado."
              action={<Button variant="brand">Nueva actividad</Button>}
            />
          </StateCard>

          <StateCard
            title="Vacío porque el filtro no encontró nada"
            tag="EmptyState"
            note="Distinto del anterior y se confunden siempre. Acá sí hay contenido: lo que no hay es contenido que cumpla lo que se pidió. La salida no es crear algo, es aflojar el filtro."
          >
            <EmptyState
              icon="search_off"
              title="Nada para 'trimestral'"
              body="Probá con menos palabras, o sacá el filtro de espacio."
              action={<Button variant="muted" iconStart={<Icon name="filter_alt" />}>Limpiar filtros</Button>}
            />
          </StateCard>
        </div>
      </Section>

      <Section
        title="Cuando se rompe"
        note="Un error tiene que decir tres cosas: qué pasó, si se perdió algo, y qué se puede hacer ahora. La tercera es la que más se olvida, y sin ella el aviso solo informa que la persona no puede seguir."
      >
        <div className={cls.errorGrid}>
          <div className={`${cls.poorCard} bg-surface`}>
            <div className={cls.poorHead}>
              <Icon name="close" size={14} className={cls.verdictIconBad} />
              <span className={cls.poorLabel}>Lo que no alcanza</span>
            </div>
            <p className={cls.poorMessage}>Error al cargar los datos.</p>
            <p className={cls.poorWhy}>
              No dice qué datos, no dice si lo que había sigue estando, y no ofrece nada. Quien lo
              lee solo se entera de que no puede seguir.
            </p>
          </div>
          <div className={`${cls.goodCard} bg-surface`}>
            <div className={cls.goodHead}>
              <Icon name="check" size={14} className={cls.verdictIconGood} />
              <span className={cls.goodLabel}>Lo que sí</span>
            </div>
            <div className={cls.goodMessage}>
              <p className={cls.goodTitle}>No se pudieron traer las entregas</p>
              <p className={cls.goodBody}>Puede ser la conexión. Lo que ya estaba corregido sigue estando.</p>
              <Button size="sm" variant="muted" iconStart={<Icon name="refresh" />} className={cls.goodRetry}>Reintentar</Button>
            </div>
            <p className={cls.goodWhy}>
              Qué pasó, qué no se perdió, y la salida. Las tres.
            </p>
          </div>
        </div>
      </Section>

      <Note title="El estado que no se dibuja: el optimista">
        Cuando una acción casi siempre sale bien (marcar una entrega, archivar, poner una estrella)
        la pieza cambia en el momento y el pedido viaja atrás. El spinner de medio segundo que
        confirma lo obvio le cuesta a todo el mundo para cubrir el caso de uno. Lo que sí hace falta
        es la vuelta atrás: si el pedido falla, la pieza vuelve a como estaba y sale un{' '}
        <code>Toast</code>, que es exactamente lo que un <code>Toast</code> es, la consecuencia de
        algo que acabás de hacer.
      </Note>

      <A11y
        items={[
          'Ningún estado se dice solo con color: lo que no distingue tonos lo distingue por relieve, por opacidad, por un glifo o por la palabra.',
          'El foco va con `:focus-visible`, así que aparece con el teclado y no al hacer click, y cuando aparece, es el mismo anillo en todo el sistema.',
          'Lo que carga se anuncia: un `Skeleton` va `aria-hidden` y el contenedor lleva el estado, así que un lector de pantalla no lee cuatro cajas vacías.',
          'Un `EmptyState` es contenido de verdad y no una ilustración: el título y el cuerpo se leen, y la acción es un botón real.',
          'Algo deshabilitado se sigue leyendo (opacidad 45%, no gris sobre gris) porque tiene que poder explicar por qué lo está.',
        ]}
      />
    </Page>
  )
}

function StateCard({ title, tag, note, children }: { title: string; tag: string; note: string; children: React.ReactNode }) {
  return (
    <Stack>
      <div className={cls.optimisticHead}>
        <span className={cls.optimisticTitle}>{title}</span>
        <Chip color="blue">{tag}</Chip>
      </div>
      <p className={cls.optimisticNote}>{note}</p>
      <div className={cls.optimisticSlot}>{children}</div>
    </Stack>
  )
}

function Live() {
  const [off, setOff] = useState(false)
  return (
    <Section
      title="Verlos"
      note="Pasá el mouse, hacé Tab, apretá. Uno que manda, uno que acompaña y uno que casi no está, y los tres con el interruptor puesto en deshabilitado. `solid` no aparece acá porque es el mismo rol que `brand`: va uno o el otro, nunca los dos en la misma pantalla."
    >
      <Card className={cls.playground}>
        <span className={cls.playgroundLabel}>
          <Switch checked={off} onChange={setOff} label="Deshabilitar todo" />
          <button type="button" onClick={() => setOff(v => !v)} className={cls.playgroundToggle}>Deshabilitar todo</button>
        </span>
        <div className={cls.playgroundRow}>
          <Button variant="brand" disabled={off}>Publicar</Button>
          <Button variant="muted" disabled={off}>Cancelar</Button>
          <Button variant="ghost" disabled={off}>Descartar</Button>
        </div>
        <div className={cls.playgroundFieldRow}>
          <TextField placeholder="Nombre de la actividad" disabled={off} />
          <Chip color="green" icon="check">Corregida</Chip>
          <Chip color="orange" dot>En curso</Chip>
        </div>
      </Card>
    </Section>
  )
}
