import { useState } from 'react'
import { Button, Card, Chip, EmptyState, Icon, Skeleton, Spinner, Switch, TextField } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Los seis estados de algo que se toca, y con qué los dice este sistema. */
const interaccion = [
  { name: 'reposo', how: 'El relieve de la pieza y nada más.', why: 'El estado base también es un estado: si no se distingue de un hover, el hover no informa.' },
  { name: 'hover', how: 'Un paso de tinta en alpha sobre el fondo. Nunca un movimiento.', why: 'El hover dice «esto responde». No existe sin mouse, así que nunca es la única forma de enterarse de algo.' },
  { name: 'pressed', how: 'El relieve se da vuelta: la sombra entra desde abajo.', why: 'Es el único estado que el dedo confirma antes que el ojo, y por eso se dibuja con volumen y no con color.' },
  { name: 'focus', how: 'El anillo azul, el mismo en todo el sistema.', why: 'El único lugar donde el color es la señal. Va con `:focus-visible`: aparece con el teclado y no con el click, que es cuando estorba.' },
  { name: 'selected', how: 'Hundido o en el suave del azul, según la pieza.', why: '«Elegido» y «apretado» son cosas distintas y se confunden solas: lo apretado vuelve, lo elegido se queda.' },
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
        note="Cada estado tiene una forma además de un tono. Un cambio de color solo es una señal que no llega a quien no distingue colores, a quien mira de reojo, ni a quien está en una pantalla mal calibrada de un aula. La forma puede ser el relieve, la opacidad, un glifo o una palabra — pero alguna hay."
      >
        <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
          {interaccion.map(e => (
            <div key={e.name} className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-24 shrink-0 font-mono text-meta font-semibold text-ink">{e.name}</code>
              <span className="w-[34ch] shrink-0 text-body text-ink">{e.how}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{e.why}</span>
            </div>
          ))}
        </div>
      </Section>

      <Vivo />

      <Section
        title="Los cuatro estados de una pantalla que espera"
        note="Ninguno es el caso feliz y los cuatro pasan todos los días. Elegir mal entre ellos es lo que hace que alguien recargue una página que estaba bien."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Estado
            titulo="Cargando, y sabemos qué va a venir"
            tag="Skeleton"
            nota="El esqueleto ocupa el lugar exacto de lo que falta, así que cuando llega no se mueve nada. Solo va cuando la forma es previsible: una fila, una tarjeta, un avatar."
          >
            <div className="flex flex-col gap-3">
              {[0, 1].map(i => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-card">
                  <Skeleton className="size-10 shrink-0 rounded-full" />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </Estado>

          <Estado
            titulo="Cargando, y no sabemos qué"
            tag="Spinner"
            nota="Cuando no se puede dibujar la forma de lo que viene —una acción, un cálculo, una búsqueda sin resultados todavía— el esqueleto mentiría. El spinner no promete nada, solo dice que algo está pasando."
          >
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface p-8 shadow-card">
              <Spinner size={28} />
              <span className="text-body text-ink-muted">Corrigiendo 24 entregas…</span>
            </div>
          </Estado>

          <Estado
            titulo="Vacío porque todavía no empezó"
            tag="EmptyState"
            nota="El vacío más importante y el que se trata peor. No es un error: es la primera vez. Dice qué va a haber acá y ofrece la acción que lo llena — un vacío sin salida es una pantalla que no se puede usar."
          >
            <EmptyState
              icon="folder_open"
              title="Todavía no hay actividades"
              body="Cuando crees la primera, la vas a ver acá con sus entregas y su estado."
              action={<Button variant="solid" icon="add">Nueva actividad</Button>}
            />
          </Estado>

          <Estado
            titulo="Vacío porque el filtro no encontró nada"
            tag="EmptyState"
            nota="Distinto del anterior y se confunden siempre. Acá sí hay contenido: lo que no hay es contenido que cumpla lo que se pidió. La salida no es crear algo, es aflojar el filtro."
          >
            <EmptyState
              icon="search_off"
              title="Nada para «trimestral»"
              body="Probá con menos palabras, o sacá el filtro de espacio."
              action={<Button variant="raised" icon="filter_alt">Limpiar filtros</Button>}
            />
          </Estado>
        </div>
      </Section>

      <Section
        title="Cuando se rompe"
        note="Un error tiene que decir tres cosas: qué pasó, si se perdió algo, y qué se puede hacer ahora. La tercera es la que más se olvida, y sin ella el aviso solo informa que la persona no puede seguir."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="close" size={14} className="text-bad" />
              <span className="text-label font-semibold text-ink">Lo que no alcanza</span>
            </div>
            <p className="rounded-xl bg-bad-subtle p-4 text-body text-bad-ink">Error al cargar los datos.</p>
            <p className="mt-3 max-w-[42ch] text-meta text-ink-muted">
              No dice qué datos, no dice si lo que había sigue estando, y no ofrece nada. Quien lo
              lee solo se entera de que no puede seguir.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5">
            <div className="mb-3 flex items-center gap-2">
              <Icon name="check" size={14} className="text-ok" />
              <span className="text-label font-semibold text-ink">Lo que sí</span>
            </div>
            <div className="rounded-xl bg-bad-subtle p-4">
              <p className="text-body font-semibold text-bad-ink">No se pudieron traer las entregas</p>
              <p className="mt-1 text-body text-bad-ink">Puede ser la conexión. Lo que ya estaba corregido sigue estando.</p>
              <Button size="sm" variant="raised" icon="refresh" className="mt-3">Reintentar</Button>
            </div>
            <p className="mt-3 max-w-[42ch] text-meta text-ink-muted">
              Qué pasó, qué no se perdió, y la salida. Las tres.
            </p>
          </div>
        </div>
      </Section>

      <Note title="El estado que no se dibuja: el optimista">
        Cuando una acción casi siempre sale bien —marcar una entrega, archivar, poner una estrella—
        la pieza cambia en el momento y el pedido viaja atrás. El spinner de medio segundo que
        confirma lo obvio le cuesta a todo el mundo para cubrir el caso de uno. Lo que sí hace falta
        es la vuelta atrás: si el pedido falla, la pieza vuelve a como estaba y sale un{' '}
        <code>Toast</code> — que es exactamente lo que un <code>Toast</code> es, la consecuencia de
        algo que acabás de hacer.
      </Note>

      <A11y
        items={[
          'Ningún estado se dice solo con color: lo que no distingue tonos lo distingue por relieve, por opacidad, por un glifo o por la palabra.',
          'El foco va con `:focus-visible`, así que aparece con el teclado y no al hacer click — y cuando aparece, es el mismo anillo en todo el sistema.',
          'Lo que carga se anuncia: un `Skeleton` va `aria-hidden` y el contenedor lleva el estado, así que un lector de pantalla no lee cuatro cajas vacías.',
          'Un `EmptyState` es contenido de verdad y no una ilustración: el título y el cuerpo se leen, y la acción es un botón real.',
          'Algo deshabilitado se sigue leyendo —opacidad 45%, no gris sobre gris— porque tiene que poder explicar por qué lo está.',
        ]}
      />
    </Page>
  )
}

function Estado({ titulo, tag, nota, children }: { titulo: string; tag: string; nota: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-reading font-semibold text-ink">{titulo}</span>
        <Chip color="blue">{tag}</Chip>
      </div>
      <p className="max-w-[54ch] text-body text-ink-muted">{nota}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

function Vivo() {
  const [off, setOff] = useState(false)
  return (
    <Section
      title="Verlos"
      note="Pasá el mouse, hacé Tab, apretá. Los mismos tres controles con el interruptor puesto en deshabilitado."
    >
      <Card className="flex flex-col gap-5 p-6">
        <label className="flex w-fit items-center gap-2.5 text-body text-ink">
          <Switch checked={off} onChange={setOff} label="Deshabilitar todo" />
          <span>Deshabilitar todo</span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="solid" disabled={off}>Guardar</Button>
          <Button variant="brand" disabled={off}>Publicar</Button>
          <Button variant="raised" disabled={off}>Cancelar</Button>
          <Button variant="ghost" disabled={off}>Descartar</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TextField placeholder="Nombre de la actividad" disabled={off} />
          <Chip color="green" icon="check">Corregida</Chip>
          <Chip color="orange" dot>En curso</Chip>
        </div>
      </Card>
    </Section>
  )
}
