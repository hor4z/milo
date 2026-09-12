import { Badge, Button, Field, Icon, Kbd, TextField } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Las reglas del sistema, no las de cada pieza: lo de cada pieza está en su vista. */
const reglas = [
  {
    icon: 'contrast',
    title: 'El contraste se mide, no se estima',
    body: 'AA —4.5:1— para todo lo que sea texto, en los dos temas. No es una intención: hay veintinueve tests que leen los tokens y calculan el ratio, y fallan antes de que un tono roto llegue a una pantalla.',
  },
  {
    icon: 'keyboard',
    title: 'Todo se hace con el teclado',
    body: 'Cada cosa accionable se alcanza con Tab, se activa con Enter o espacio y se abandona con Escape. Donde hay una lista —un menú, un select, un segmented— las flechas la recorren y Home y End van a los extremos.',
  },
  {
    icon: 'visibility',
    title: 'El foco se ve siempre, y es uno solo',
    body: 'Un anillo azul, el mismo en todo el sistema. Es el único lugar donde el color es la señal y no el acompañante, y se defiende: los otros roles se leen, este tiene que reconocerse antes de leerse.',
  },
  {
    icon: 'palette',
    title: 'El color nunca viaja solo',
    body: 'Cada tono de estado trae su glifo y su texto. Un aviso rojo sin la palabra «error» y sin el símbolo no dice nada a quien no distingue colores, que es una de cada doce personas con visión masculina.',
  },
  {
    icon: 'zoom_in',
    title: 'El texto se puede agrandar',
    body: 'La escala va en rem, así que la preferencia de tamaño de fuente del navegador se respeta además del zoom. Las piezas que llevan texto en una caja chica usan alto mínimo y no alto fijo, para que crecer no corte nada.',
  },
  {
    icon: 'schedule',
    title: 'El movimiento se puede apagar',
    body: 'Con prefers-reduced-motion todas las animaciones se van y las transiciones bajan a un milisegundo. Lo que informa por moverse no se congela: el spinner gira más lento en vez de quedarse quieto.',
  },
] as const

export function AccessibilitySection() {
  return (
    <Page
      title="Accesibilidad"
      kind="Fundamentos"
      lead="No es una capa que se agrega al final: son las reglas que cada pieza ya cumple, y lo que se verifica con tests en vez de con buena voluntad. Esto se va a usar en educación, donde quien no puede leer la pantalla no puede hacer la tarea."
      imports="import { Field, Alert } from '@milo/ui'"
    >
      <Section title="Las seis reglas">
        <div className="grid gap-3 md:grid-cols-2">
          {reglas.map(r => (
            <div key={r.title} className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-5">
              <span className="inset-relief mb-1 inline-flex size-9 items-center justify-center rounded-lg">
                <Icon name={r.icon} size={18} />
              </span>
              <span className="text-reading font-semibold text-ink">{r.title}</span>
              <p className="max-w-[46ch] text-body text-ink-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El anillo de foco"
        note="Dos píxeles de superficie y después el azul. Los dos píxeles de papel en el medio son lo que lo deja ver también sobre un botón azul, donde un anillo pegado al borde se perdería contra el relleno. Probalo: hacé Tab acá adentro."
      >
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface p-5">
          <Button variant="solid">Guardar</Button>
          <Button variant="brand">Publicar</Button>
          <Button variant="raised">Cancelar</Button>
          <span className="max-w-[38ch] text-meta text-ink-muted">
            Va con <code>:focus-visible</code> y no con <code>:focus</code>: el anillo aparece cuando
            se navega con el teclado y no cuando se clickea, que es cuando estorba y no informa.
          </span>
        </div>
      </Section>

      <Section
        title="El tamaño del objetivo, y dónde el sistema queda corto"
        note="Es la regla que este sistema cumple más justo, así que va escrita en vez de escondida. WCAG 2.2 pide 24×24 como mínimo; Apple recomienda 44×44 para lo que se toca con el dedo."
      >
        <div className="flex flex-col gap-3">
          {[
            ['sm', 32, 'ok', 'Pasa WCAG con holgura y queda por debajo de lo que Apple recomienda. Es para una fila densa y con mouse.'],
            ['md', 36, 'ok', 'La acción dentro de un panel.'],
            ['lg', 40, 'ok', 'La acción principal. Es el que más se acerca a los 44 del dedo.'],
          ].map(([size, px, tone, nota]) => (
            <div key={size as string} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
              <code className="w-10 shrink-0 font-mono text-meta font-semibold text-ink">{size}</code>
              <span className="w-14 shrink-0 tabular text-body text-ink">{px}px</span>
              <Badge tone={tone as 'ok'}>≥ 24</Badge>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{nota}</span>
            </div>
          ))}
        </div>
        <Note icon="warning" title="La deuda, dicha en voz alta">
          Ninguna altura llega a los 44×44 que Apple recomienda para el dedo. En un panel docente con
          mouse eso está bien; en una tablet de aula, el <code>sm</code> de 32 es chico. La salida no
          es agrandar los tres —la densidad es real y hace falta— sino decidir que en táctil el piso
          es <code>lg</code>. No está hecho: hoy la elección del tamaño la hace cada call site sin
          saber con qué se va a tocar.
        </Note>
      </Section>

      <Section
        title="Lo obligatorio se dice con la palabra"
        note="Un asterisco es una convención que no significa nada para quien no la conoce, y un lector de pantalla lo lee como «asterisco». Va el asterisco para quien lo reconoce y la palabra para todos los demás."
      >
        <div className="flex max-w-[460px] flex-col gap-3 rounded-2xl border border-line bg-surface p-5">
          <Field label="Nombre de la actividad" required hint="Lo que van a ver los aprendices en su lista.">
            <TextField placeholder="Informe del experimento" />
          </Field>
          <p className="text-meta text-ink-muted">
            El asterisco va <code>aria-hidden</code> y al lado viaja un «(obligatorio)» que solo
            existe para el lector de pantalla. Quien ve la pantalla lee la convención que ya conoce;
            quien la escucha oye la palabra y no «asterisco».
          </p>
        </div>
      </Section>

      <Section
        title="Lo urgente interrumpe, lo demás espera"
        note="Un error va como role=alert y un lector lo anuncia cortando lo que esté leyendo; todo lo demás va como role=status y espera su turno. Elegir mal es lo que hace que una confirmación de guardado le pise a alguien la frase que estaba escuchando."
      >
        <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2">
            <Icon name="error" size={16} className="text-bad" />
            <code className="font-mono text-meta font-semibold text-ink">role="alert"</code>
            <span className="text-meta text-ink-muted">el error de un campo</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="info" size={16} />
            <code className="font-mono text-meta font-semibold text-ink">role="status"</code>
            <span className="text-meta text-ink-muted">«Guardado», «3 resultados»</span>
          </div>
        </div>
      </Section>

      <Section
        title="Las salidas"
        note="Escape usa una pila global: cierra el overlay de arriba y no todos. Un menú abierto adentro de un modal se cierra solo él, y el modal queda. Sin la pila, un Escape de más te saca de la tarea entera."
      >
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-5">
          <Kbd>Esc</Kbd>
          <span className="text-body text-ink-muted">cierra lo de más arriba</span>
          <span className="text-ink-disabled">·</span>
          <Kbd>Tab</Kbd>
          <span className="text-body text-ink-muted">no se escapa de un diálogo abierto</span>
          <span className="text-ink-disabled">·</span>
          <Kbd>/</Kbd>
          <span className="text-body text-ink-muted">busca, salvo que estés escribiendo</span>
        </div>
      </Section>

      <Note title="Lo que falta, sin maquillar">
        El blanco sobre los dos rellenos saturados no llega a AA: el botón <code>brand</code> va de
        2.89:1 arriba del degradado a 3.75:1 abajo, y el <code>bad</code> da 3.75:1. El texto es de
        16/600, que para WCAG no es texto grande, así que el mínimo sigue siendo 4.5. Son los dos
        únicos lugares del sistema que no pasan, y son justo los dos rellenos que llevan texto
        encima. La salida elegida es oscurecer el relleno acotado al botón; no se hizo porque cambia
        un color de identidad, y eso se decide mirando.
      </Note>

      <A11y
        items={[
          'Cada vista de una pieza cierra con lo que esa pieza resuelve: acá están las reglas del sistema, no las de cada una.',
          'Los tests de contraste corren sobre los tokens crudos en los dos temas, así que no dependen de que alguien se acuerde de mirar.',
          'El sitio declara `lang="es"`, que es lo que hace que un lector de pantalla lo pronuncie en castellano y no deletree.',
          'El riel es un `<nav>` con nombre y el item actual lleva `aria-current`, así que se puede saltear y se sabe dónde estás.',
        ]}
      />
    </Page>
  )
}
