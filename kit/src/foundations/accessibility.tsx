import cls from './accessibility.module.css'
import { Button, Chip, Field, Icon, Kbd, TextField } from '@milo/ui'
import { A11y, Note, Page, Section, Stack } from '../kit'

/** Las reglas del sistema, no las de cada pieza: lo de cada pieza está en su vista. */
const rules = [
  {
    icon: 'contrast',
    title: 'El contraste se mide, no se estima',
    body: 'AA (4.5:1) para todo lo que sea texto, en los dos temas. No es una intención: hay cincuenta y un tests que leen los tokens y calculan el ratio, y fallan antes de que un tono roto llegue a una pantalla. AAA queda afuera a propósito, y abajo está la cuenta.',
  },
  {
    icon: 'keyboard',
    title: 'Todo se hace con el teclado',
    body: 'Cada cosa accionable se alcanza con Tab, se activa con Enter o espacio y se abandona con Escape. Donde hay una lista (un menú, un select, un segmented) las flechas la recorren y Home y End van a los extremos.',
  },
  {
    icon: 'visibility',
    title: 'El foco se ve siempre, y es uno solo',
    body: 'Un anillo azul, el mismo en todo el sistema. Es el único lugar donde el color es la señal y no el acompañante, y se defiende: los otros roles se leen, este tiene que reconocerse antes de leerse.',
  },
  {
    icon: 'palette',
    title: 'El color nunca viaja solo',
    body: 'Cada tono de estado trae su glifo y su texto. Un aviso rojo sin la palabra "error" y sin el símbolo no dice nada a quien no distingue colores, que es una de cada doce personas con visión masculina.',
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
        <div className={cls.specimenGrid}>
          {rules.map(r => (
            <div key={r.title} className={`${cls.specimen} bg-surface`}>
              <span className={`${cls.roleBadge} inset-relief`}>
                <Icon name={r.icon} size={18} />
              </span>
              <span className={cls.specimenLabel}>{r.title}</span>
              <p className={cls.specimenBody}>{r.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="El anillo de foco"
        note="Dos píxeles de superficie y después el azul. Los dos píxeles de papel en el medio son lo que lo deja ver también sobre un botón azul, donde un anillo pegado al borde se perdería contra el relleno. Probalo: hacé Tab acá adentro."
      >
        <div className={`${cls.ringCard} bg-surface`}>
          <Button variant="solid">Guardar</Button>
          <Button variant="brand">Publicar</Button>
          <Button variant="raised">Cancelar</Button>
          <span className={cls.ringNote}>
            Va con <code>:focus-visible</code> y no con <code>:focus</code>: el anillo aparece cuando
            se navega con el teclado y no cuando se clickea, que es cuando estorba y no informa.
          </span>
        </div>
      </Section>

      <Section
        title="El tamaño del objetivo, y dónde el sistema queda corto"
        note="Es la regla que este sistema cumple más justo, así que va escrita en vez de escondida. WCAG 2.2 pide 24×24 como mínimo. Apple tiene dos números y no uno: 44×44 es su tamaño **por defecto** y 28×28 su mínimo, y aclara que el aire entre controles importa tanto como el tamaño."
      >
        <Stack>
          {[
            ['sm', 32, 'ok', 'Pasa WCAG con holgura y está sobre el mínimo de Apple, debajo de su default. Es para una fila densa y con mouse.'],
            ['md', 36, 'ok', 'La acción dentro de un panel.'],
            ['lg', 40, 'ok', 'La acción principal. En táctil los tres suben a 40 y llevan un blanco de 44.'],
          ].map(([size, px, tone, nota]) => (
            <div key={size as string} className={`${cls.targetRow} bg-surface`}>
              <code className={cls.targetName}>{size}</code>
              <span className={`${cls.targetValue} tabular`}>{px}px</span>
              <Chip size="sm" color={tone as 'ok'}>≥ 24</Chip>
              <span className={cls.targetNote}>{nota}</span>
            </div>
          ))}
        </Stack>
        <Note title="Qué pasa en táctil">
          Con <code>pointer: coarse</code> los botones suben a 40 y llevan encima la clase global
          <code>touch-target</code>, que agranda el blanco de toque hasta 44 sin mover la caja; los
          campos suben la caja a 44 de verdad, porque ahí el tap tiene que llegar al input. En
          escritorio no cambia un píxel. Falta el resto de las piezas: el checkbox y el radio de 18,
          el switch de 22, el tachito de un chip de 24. Varias son compactas a propósito, así que
          subirlas es una decisión sobre cómo se siente el sistema en un teléfono, y no un arreglo.
          Y ojo con el aire: Apple dice que la separación entre controles pesa tanto como el tamaño,
          así que agrandar dos blancos vecinos sin mirar el gap los hace pisarse.
        </Note>
      </Section>

      <Section
        title="Lo obligatorio se dice con la palabra"
        note="Un asterisco es una convención que no significa nada para quien no la conoce, y un lector de pantalla lo lee como 'asterisco'. Va el asterisco para quien lo reconoce y la palabra para todos los demás."
      >
        <div className={`${cls.requiredCard} bg-surface`}>
          <Field label="Nombre de la actividad" required hint="Lo que van a ver los aprendices en su lista.">
            <TextField placeholder="Informe del experimento" />
          </Field>
          <p className={cls.requiredNote}>
            El asterisco va <code>aria-hidden</code> y al lado viaja un "(obligatorio)" que solo
            existe para el lector de pantalla. Quien ve la pantalla lee la convención que ya conoce;
            quien la escucha oye la palabra y no "asterisco".
          </p>
        </div>
      </Section>

      <Section
        title="Lo urgente interrumpe, lo demás espera"
        note="Un error va como role=alert y un lector lo anuncia cortando lo que esté leyendo; todo lo demás va como role=status y espera su turno. Elegir mal es lo que hace que una confirmación de guardado le pise a alguien la frase que estaba escuchando."
      >
        <div className={`${cls.liveCard} bg-surface`}>
          <div className={cls.alertRow}>
            <Icon name="error" size={16} className={cls.alertIcon} />
            <code className={cls.alertRole}>role="alert"</code>
            <span className={cls.alertExample}>el error de un campo</span>
          </div>
          <div className={cls.statusRow}>
            <Icon name="info" size={16} />
            <code className={cls.statusRole}>role="status"</code>
            <span className={cls.statusExample}>"Guardado", "3 resultados"</span>
          </div>
        </div>
      </Section>

      <Section
        title="Las salidas"
        note="Escape usa una pila global: cierra el overlay de arriba y no todos. Un menú abierto adentro de un modal se cierra solo él, y el modal queda. Sin la pila, un Escape de más te saca de la tarea entera."
      >
        <div className={`${cls.keyCard} bg-surface`}>
          <Kbd>Esc</Kbd>
          <span className={cls.escapeText}>cierra lo de más arriba</span>
          <span className={cls.firstBullet}>·</span>
          <Kbd>Tab</Kbd>
          <span className={cls.trapText}>no se escapa de un diálogo abierto</span>
          <span className={cls.secondBullet}>·</span>
          <Kbd>/</Kbd>
          <span className={cls.searchText}>busca, salvo que estés escribiendo</span>
        </div>
      </Section>

      <Note icon="check_circle" title="La deuda de contraste está saldada">
        El blanco sobre los dos rellenos saturados no llegaba a AA: el botón <code>brand</code> iba
        de 2.89:1 arriba del degradado a 3.75:1 abajo, y el <code>bad</code> daba 3.75:1. El texto
        de un botón es de 16/600, que para WCAG no es texto grande, así que el mínimo era 4.5 y no 3.
        Los dos rellenos ahora están <strong className={cls.emphasis}>anclados</strong>:
        son el escalón donde el blanco encima llega exactamente a 4.5:1, derivado por búsqueda en
        OKLCH y no elegido mirando. El degradado del azul va de 600 a 700, así que pasa de punta a
        punta y no solo en la mitad de abajo. Hay un test que lo mide en los dos temas.
      </Note>

      <Note title="Por qué el objetivo es AA y no AAA">
        El gris del texto secundario da 6,94:1 sobre el fondo del tema oscuro: le faltan seis
        centésimas para AAA. Subirlo parece gratis y no lo es: para llegar a 7:1 sobre las cuatro
        superficies oscuras hay que aclararlo hasta un punto donde queda a 1,84:1 del texto
        principal, y ahí deja de distinguirse el título del cuerpo. Se gana un número y se pierde la
        jerarquía, que es lo que el gris estaba haciendo. Medido, no estimado.
      </Note>

      <Note icon="warning" title="Los dos números que no llegan, con la cuenta">
        **El texto sugerido de un campo, en oscuro y con el mouse encima: 3,82:1.** Se mide contra
        los cuatro fondos de campo (sobre el escritorio y adentro de una pieza de papel, cada uno
        con y sin mouse) y llega a 4,5 en tres. Para pasar el cuarto hay que aclarar el gris hasta
        1,02:1 del texto escrito, y ahí un campo con sugerencia se lee como un campo lleno, que es
        lo que este paso de la rampa vino a evitar. Antes se medía contra dos de los cuatro: los
        otros dos daban 4,24 y 3,99 y ya están corregidos.
        {' '}
        **El borde de un campo contra el papel: 1,75:1 en claro y 2,57 en oscuro**, contra los 3:1
        que la WCAG pide para identificar un control. Subirlo a 3:1 convierte cada campo en una
        caja dibujada y cambia el aire de todas las pantallas. El campo no depende solo del borde
        (se hunde contra su superficie, tiene su propia altura y su etiqueta) pero el número es el
        número y queda acá escrito.
      </Note>


      <Note icon="warning" title="Lo único que axe marca y no se corrige">
        Con un menú abierto aparece <code>region</code>, que pide que todo el contenido esté adentro
        de una landmark. El panel se dibuja en un portal colgado del <code>body</code>, así que no
        lo está. Meterlo adentro de una landmark sería peor: una landmark por cada menú abierto
        llena la lista de saltos, que es el mismo error que ya se corrigió en los bloques
        destacados. Y moverlo adentro del contenido significa reescribir el sistema de overlays
        para ganar una regla de buena práctica que no es de la WCAG. El panel se enfoca, se cierra
        con Escape y se anuncia con nombre propio, que es lo que la persona necesita.
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
