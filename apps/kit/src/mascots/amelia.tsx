import { Alert, AlertBody, AlertTitle, Button, Card, CardBody, Icon } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'
import { ReglasDeMascota, useQuieto } from './reglas'

export function AmeliaStory() {
  const quieto = useQuieto()

  return (
    <Page
      title="Amelia"
      kind="Mascotas"
      lead="La segunda mascota, y la primera con forma de persona. Es una chica de primaria: aparece donde la pantalla le habla a quien estudia, mientras que Otto sirve igual para cualquiera de los dos lados."
      imports="<img src='/mascotas/amelia.webp' alt='' />"
    >
      <Section
        title="Quién es"
        note="Anteojos redondos, dos rodetes con una cinta roja, remera menta y jardinero de jean. Está de pie, quieta, con una sonrisa corta: no señala ni festeja, está ahí."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface p-6">
          <img src="/mascotas/amelia.webp" alt="" height={240} className="h-60 w-auto shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[54ch] text-reading text-ink">
              Amelia tiene la edad de quien va a usar la pantalla, y eso es lo que hace y lo que
              cuesta: en una pantalla de estudiante alguien se reconoce, y en una de docente queda
              raro que la aplicación le hable con una nena.
            </p>
            <p className="max-w-[54ch] text-body text-ink-muted">
              Por eso no es intercambiable con Otto. Una nutria no tiene edad ni curso; una persona
              dibujada sí, y quien la mira lo lee en el primer segundo.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Una persona dibujada dice más de lo que uno quiso decir"
        note="Vale la pena tenerlo escrito acá y no descubrirlo en una revisión, seis pantallas después."
      >
        <Alert tone="info" icon="group">
          <AlertTitle>Amelia es una sola chica, y el sistema no es una sola persona</AlertTitle>
          <AlertBody>
            Elegirla fija una edad, un cuerpo y un pelo, y quien no se parezca a eso lo nota. Se
            banca mientras sea un acompañante y no el retrato de quien estudia: no va en un avatar
            por defecto, no va como ilustración de «una alumna» en una lista, y no se usa para
            representar a la persona que está del otro lado. El día que haya una segunda chica el
            problema cambia de forma — deja de ser «la nena» y pasa a ser un elenco.
          </AlertBody>
        </Alert>
      </Section>

      <Section
        title="En movimiento"
        note="Diez segundos, sin audio, y se queda respirando: no entra corriendo ni saluda. Un bucle discreto se puede dejar en pantalla sin que moleste, que es lo único que lo hace usable."
      >
        <div className="flex flex-wrap items-start gap-6">
          {quieto
            ? (
              <img
                src="/mascotas/amelia.webp"
                alt="Amelia, quieta: pediste menos movimiento"
                className="h-[280px] w-auto rounded-xl border border-line bg-sunken"
              />
            )
            : (
              <video
                src="/mascotas/amelia.mp4"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Amelia, de pie, respirando"
                className="h-[280px] w-auto rounded-xl border border-line"
              />
            )}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <p className="max-w-[52ch] text-body text-ink-muted">
              Como el de Otto, el video trae su propio fondo y no es transparente: va adentro de una
              caja con su borde. El retrato sí tiene alfa y se apoya donde sea.
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
        title="Al lado de Otto"
        note="Las dos se alinean por el alto y nunca por el ancho. Otto es casi el doble de ancho que Amelia, así que dos `width` iguales lo dejan a él enano y a ella estirada."
      >
        <div className="flex flex-wrap items-end justify-center gap-10 rounded-xl border border-line bg-sunken p-8">
          {[
            ['/mascotas/otto.webp', 'Otto', 'Cualquier pantalla'],
            ['/mascotas/amelia.webp', 'Amelia', 'Pantallas de estudiante'],
          ].map(([src, nombre, para]) => (
            <div key={nombre} className="flex flex-col items-center gap-2">
              <img src={src} alt="" className="h-56 w-auto" />
              <span className="text-body font-semibold text-ink">{nombre}</span>
              <span className="text-meta text-ink-muted">{para}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[64ch] text-body text-ink-muted">
          Juntas están acá para compararlas y en ningún otro lado: en una pantalla va una sola. Dos
          mascotas a la vez se leen como una escena y quien la mira se pone a buscar qué pasa entre
          las dos, que es justo la atención que la pantalla necesitaba para otra cosa.
        </p>
      </Section>

      <Section
        title="Donde sí va"
        note="El caso de todos los días: la primera vez que alguien entra a resolver algo. Después de esa vez, la misma pantalla va sin ella."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardBody>
              <div className="flex flex-wrap items-center gap-5">
                <img src="/mascotas/amelia.webp" alt="" className="h-32 w-auto shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <span className="text-reading font-semibold text-ink">Tu primera consigna te espera</span>
                  <p className="max-w-[32ch] text-body text-ink-muted">
                    Leela con calma y respondé con tus palabras. Podés volver atrás cuando quieras.
                  </p>
                  <div>
                    <Button variant="brand" icon="arrow_forward">Empezar</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="flex flex-col justify-center gap-3 rounded-xl border border-dashed border-line p-6">
            <span className="flex items-center gap-2 text-body font-semibold text-ink">
              <Icon name="close" size={16} className="shrink-0 text-bad" />
              Acá no
            </span>
            <p className="max-w-[46ch] text-body text-ink-muted">
              En la pantalla donde esa misma persona ya está escribiendo la respuesta. Ahí hay un
              texto que leer y un campo que llenar, y una figura al costado compite con los dos.
            </p>
            <p className="max-w-[46ch] text-meta text-ink-muted">
              La regla corta: si la pantalla es para trabajar, la mascota ya hizo lo suyo y se va.
            </p>
          </div>
        </div>
      </Section>

      <ReglasDeMascota />

      <Section title="Los archivos">
        <div className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface">
          {[
            ['/mascotas/amelia.webp', '354 × 1200 · 66 KB', 'El retrato, con alfa. Se apoya en cualquier superficie.'],
            ['/mascotas/amelia.mp4', '540 × 960 · 10 s · 103 KB', 'Sin audio y con su propio fondo. Va adentro de una caja.'],
          ].map(([ruta, peso, nota]) => (
            <div key={ruta} className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line px-5 py-4 first:border-t-0">
              <code className="w-56 shrink-0 font-mono text-meta font-semibold text-ink">{ruta}</code>
              <span className="w-56 shrink-0 tabular text-meta text-ink-muted">{peso}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
      </Section>

      <Note title="Se miden por el alto, no por el ancho">
        Los dos retratos están exportados a 1200 de alto y cada uno con el ancho que le toca. Por eso
        acá se dibujan con <code>h-*</code> y <code>w-auto</code>, y nunca con un ancho fijo: es la
        única forma de que Otto y Amelia se vean del mismo tamaño. Cuando haya una pieza de verdad
        —el día que aparezca la tercera mascota, o que alguien necesite elegir la pose— lo que va a
        recibir es la altura.
      </Note>

      <A11y
        items={[
          'El retrato va con `alt=""`: es decorativo, y lo que la pantalla quiere decir ya está en el texto de al lado. Describirlo obliga a escuchar «ilustración de una chica» antes de llegar al mensaje.',
          'El video lleva `aria-label` porque se mueve y quien no lo ve merece saber qué hay ahí, pero no es contenido: si se saca, la pantalla sigue diciendo lo mismo.',
          'Respeta `prefers-reduced-motion` como el resto del sistema: quien pidió menos movimiento ve el retrato quieto en vez del bucle.',
          'Amelia nunca representa a quien está del otro lado de la pantalla: no va de avatar por defecto ni de ilustración de «una alumna», porque quien no se parece a ella lo nota.',
          'Nunca es la única forma de entender algo: si desaparece, no se pierde ni una palabra.',
        ]}
      />
    </Page>
  )
}
