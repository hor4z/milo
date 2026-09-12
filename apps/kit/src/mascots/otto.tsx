import { useEffect, useState } from 'react'
import { Button, EmptyState, Icon } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Si alguien pidió menos movimiento, el video no arranca: se queda el retrato. */
function useQuieto() {
  const [quieto, setQuieto] = useState(false)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const leer = () => setQuieto(mq.matches)
    leer()
    mq.addEventListener('change', leer)
    return () => mq.removeEventListener('change', leer)
  }, [])
  return quieto
}

/** Dónde aparece y dónde no. La segunda columna es la que hace falta escribir. */
const donde = [
  { si: 'La primera vez que se abre algo', no: 'Una pantalla de trabajo, todos los días' },
  { si: 'Un vacío: todavía no hay actividades', no: 'Un error, una confirmación de borrado' },
  { si: 'Cuando algo salió bien y vale celebrarlo', no: 'Al lado del botón que manda' },
  { si: 'Una pantalla de bienvenida o de ayuda', no: 'Adentro de una tabla o de una lista' },
] as const

export function OttoStory() {
  const quieto = useQuieto()

  return (
    <Page
      title="Otto"
      kind="Mascotas"
      lead="La primera mascota del sistema. Aparece cuando una pantalla necesita una cara —un vacío, una bienvenida, algo que salió bien— y se va cuando la persona tiene trabajo que hacer."
      imports="<img src='/mascotas/otto.webp' alt='' />"
    >
      <Section
        title="Quién es"
        note="Una nutria de pie, con los ojos grandes y las manos juntas. Está mirando un poco hacia arriba y hacia afuera de cuadro, que es lo que lo hace ver curioso en vez de vigilante — una mascota que mira de frente a quien la usa incomoda a la tercera pantalla."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface p-6">
          <img src="/mascotas/otto.webp" alt="" width={200} className="shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[54ch] text-reading text-ink">
              Otto no habla, no señala y no explica: acompaña. Lo que hay que decir lo dice el
              texto de la pantalla, y él está para que esa pantalla no se sienta vacía.
            </p>
            <p className="max-w-[54ch] text-body text-ink-muted">
              Va siempre entero y siempre derecho. No se rota, no se recorta, no se tiñe y no se
              le cambia la escala en un eje. Una mascota deformada deja de ser la misma mascota, y
              es lo primero que alguien reconoce de un producto.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="En movimiento"
        note="Diez segundos, sin audio. Va en las pantallas donde la persona está esperando o recién llega — nunca en una donde está haciendo algo, porque algo que se mueve al lado de lo que estás leyendo se lleva la atención y no la devuelve."
      >
        <div className="flex flex-wrap items-start gap-6">
          {quieto
            ? (
              <img
                src="/mascotas/otto.webp"
                alt="Otto, quieto: pediste menos movimiento"
                width={220}
                className="rounded-xl border border-line bg-sunken"
              />
            )
            : (
              <video
                src="/mascotas/otto.mp4"
                width={220}
                autoPlay
                loop
                muted
                playsInline
                aria-label="Otto saluda y se acomoda"
                className="rounded-xl border border-line"
              />
            )}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[52ch] text-body text-ink-muted">
              El video trae su propio fondo y no es transparente, así que no se puede apoyar sobre
              cualquier superficie: va adentro de una caja con su borde, como acá. El retrato en
              cambio sí tiene alfa y se apoya en donde sea.
            </p>
            <p className="max-w-[52ch] text-body text-ink-muted">
              Va <code>muted</code>, <code>loop</code> y <code>playsInline</code>. Los tres hacen
              falta: sin el primero el navegador no lo deja arrancar solo, y sin el tercero iOS lo
              abre en pantalla completa.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Dónde va y dónde no"
        note="La segunda columna es la que importa. Una mascota sin un «acá no» termina en todas las pantallas, y una mascota que está en todas las pantallas deja de significar algo."
      >
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {donde.map(d => (
            <div key={d.si} className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line px-5 py-4 first:border-t-0">
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ok" />
                <span className="text-body text-ink">{d.si}</span>
              </span>
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <Icon name="close" size={16} className="mt-0.5 shrink-0 text-bad" />
                <span className="text-body text-ink-muted">{d.no}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="En un vacío, que es donde mejor funciona"
        note="El `EmptyState` ya trae un glifo para el caso de todos los días. Otto es para el vacío que alguien ve una sola vez —la primera— y ahí una cara hace más que un icono."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-surface p-8">
            <img src="/mascotas/otto.webp" alt="" width={120} />
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-reading font-semibold text-ink">Todavía no hay nada acá</span>
              <p className="max-w-[34ch] text-body text-ink-muted">
                Cuando crees tu primera actividad, la vas a ver acá con sus entregas.
              </p>
            </div>
            <Button variant="brand" icon="add">Nueva actividad</Button>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <EmptyState
              icon="search_off"
              title="Nada para «trimestral»"
              body="Probá con menos palabras, o sacá el filtro de espacio."
              action={<Button variant="raised" icon="filter_alt">Limpiar filtros</Button>}
            />
            <p className="max-w-[46ch] text-meta text-ink-muted">
              Acá no va: un filtro que no encontró nada es algo que pasa diez veces por día, y una
              mascota que aparece diez veces por día deja de dar gusto y empieza a estorbar.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/otto.webp', '948 × 1659 · 150 KB', 'El retrato, con alfa. Se apoya en cualquier superficie.'],
            ['/mascotas/otto.mp4', '540 × 960 · 10 s · 228 KB', 'Sin audio y con su propio fondo. Va adentro de una caja.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-56 shrink-0 font-mono text-meta font-semibold text-ink">{ruta}</code>
              <span className="w-56 shrink-0 tabular text-meta text-ink-muted">{peso}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
      </Section>

      <Note title="Todavía no es una pieza">
        Otto vive como archivo y no como componente, y eso está bien mientras haya una sola mascota
        y dos o tres usos. El día que aparezca la segunda —o que alguien necesite elegir la pose—
        ahí sí conviene una pieza que reciba el nombre y el tamaño, porque si no cada pantalla va a
        escribir su propio <code>{'<img>'}</code> con su propio ancho y vamos a terminar con cuatro
        Ottos de cuatro tamaños distintos. Es exactamente lo que pasó con el buscador.
      </Note>

      <A11y
        items={[
          'El retrato va con `alt=""`: es decorativo, y lo que la pantalla quiere decir ya está en el texto de al lado. Describirlo obliga a escuchar «ilustración de una nutria» antes de llegar al mensaje.',
          'El video lleva `aria-label` porque no es decorativo del todo —se mueve, y quien no lo ve merece saber qué hay ahí—, pero tampoco es contenido: si se saca, la pantalla sigue diciendo lo mismo.',
          'Va `muted` y `loop`, y respeta `prefers-reduced-motion` como el resto del sistema: quien pidió menos movimiento ve el retrato quieto en vez del video.',
          'Nunca es la única forma de entender algo: si Otto desaparece, no se pierde ni una palabra de lo que la pantalla dice.',
        ]}
      />
    </Page>
  )
}
