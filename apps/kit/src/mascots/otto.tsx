import { Button, EmptyState } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'
import { ReglasDeMascota, useQuieto } from './reglas'

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
          <img src="/mascotas/otto.webp" alt="" className="h-60 w-auto shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[54ch] text-reading text-ink">
              Otto no habla, no señala y no explica: acompaña. Lo que hay que decir lo dice el
              texto de la pantalla, y él está para que esa pantalla no se sienta vacía.
            </p>
            <p className="max-w-[54ch] text-body text-ink-muted">
              Va siempre entero y siempre derecho, y se mide por el alto: el retrato está exportado a
              1200 de alto con el ancho que le toca, así que un ancho fijo lo deja de otro tamaño
              que Amelia.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="En movimiento"
        note="Diez segundos, sin audio y recortado: entra corriendo desde afuera de cuadro, frena y se queda. Va en las pantallas donde la persona está esperando o recién llega — nunca en una donde está haciendo algo, porque algo que se mueve al lado de lo que estás leyendo se lleva la atención y no la devuelve."
      >
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex justify-center rounded-xl bg-sunken p-4">
            {quieto
              ? <img src="/mascotas/otto.webp" alt="Otto, quieto: pediste menos movimiento" className="h-[280px] w-auto" />
              : <img src="/mascotas/otto-anima.webp" alt="" aria-hidden className="h-[280px] w-auto" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[52ch] text-body text-ink-muted">
              Tiene alfa, así que se apoya sobre cualquier superficie: acá está sobre el fondo
              hundido y no adentro de una caja con borde. El fondo gris del original se sacó por
              conectividad y no con un croma plano — un umbral de color le abría agujeros en la
              panza y en los ojos, que son casi tan claros como el fondo.
            </p>
            <p className="max-w-[52ch] text-body text-ink-muted">
              El costo de tener alfa es que es un <code>img</code> y no un <code>video</code>: pesa
              el doble que el mp4 que reemplazó y no se puede pausar. Por eso quien pidió menos
              movimiento no lo ve atenuado, lo ve reemplazado por el retrato.
            </p>
            <p className="max-w-[52ch] text-meta text-ink-muted">
              La receta está en <code>apps/kit/scripts/recortar-mascota.py</code>. Los clips de
              Amelia todavía no pasaron por ahí: siguen trayendo su fondo.
            </p>
          </div>
        </div>
      </Section>

      <ReglasDeMascota />

      <Section
        title="En un vacío, que es donde mejor funciona"
        note="El `EmptyState` ya trae un glifo para el caso de todos los días. Otto es para el vacío que alguien ve una sola vez —la primera— y ahí una cara hace más que un icono."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-4 rounded-xl border border-line bg-surface p-8">
            <img src="/mascotas/otto.webp" alt="" className="h-28 w-auto" />
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
            ['/mascotas/otto.webp', '686 × 1200 · 150 KB', 'El retrato, con alfa. Se apoya en cualquier superficie.'],
            ['/mascotas/otto-anima.webp', '162 × 240 · 10 s · 472 KB', 'El bucle, con alfa. 120 cuadros a 12 por segundo.'],
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
        Otto vive como archivo y no como componente, y con Amelia al lado ya son dos. Todavía se
        banca: son dos rutas y un puñado de usos. Lo que no se banca es el ancho — se dibujan con
        <code>h-*</code> y <code>w-auto</code>, porque los dos retratos comparten el alto y no el
        ancho. El día que aparezca la tercera, o que alguien necesite elegir la pose, ahí conviene
        una pieza que reciba el nombre y la altura, o cada pantalla va a escribir su propio
        <code>{'<img>'}</code> con su propia medida. Es exactamente lo que pasó con el buscador.
      </Note>

      <A11y
        items={[
          'El retrato va con `alt=""`: es decorativo, y lo que la pantalla quiere decir ya está en el texto de al lado. Describirlo obliga a escuchar «ilustración de una nutria» antes de llegar al mensaje.',
          'El bucle también va con `alt=""`: dice lo mismo que el retrato y no agrega información, así que anunciarlo es ruido.',
          'Respeta `prefers-reduced-motion`, y con un `img` animado eso no se negocia: no se puede pausar ni frenar desde el teclado, así que quien pidió menos movimiento ve el retrato quieto en su lugar.',
          'Nunca es la única forma de entender algo: si Otto desaparece, no se pierde ni una palabra de lo que la pantalla dice.',
        ]}
      />
    </Page>
  )
}
