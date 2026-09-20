import { Icon, IconButton, Indicator } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function IndicatorStory() {
  return (
    <Page
      title="Indicator"
      kind="Datos"
      lead="Una marca chica pegada a la esquina de otra cosa. No es una pieza en sí: envuelve a la que sí lo es (un botón, un avatar, una carpeta) y le agrega un punto, un contador o un glifo sin cambiarla."
      imports="import { Indicator } from '@milo/ui'"
    >
      <Section
        title="Tres formas de marcar"
        note="El punto dice 'hay algo' y nada más, que es lo que alcanza casi siempre. El contador dice cuánto, y solo vale la pena cuando el número cambia la decisión: entre 'hay avisos' y 'hay tres avisos' no cambia nada, entre 'hay 3' y 'hay 148' sí. El glifo dice qué pasó, y es el único que no necesita que vayas a mirar. La marca se apoya en el hombro del glifo y no en la esquina del botón, que es más grande."
      >
        <Panel>
          <Variant name="punto">
            <Indicator dot label="Hay avisos sin leer">
              <IconButton icon="notifications" label="Avisos" size="lg" />
            </Indicator>
          </Variant>
          <Variant name="contador">
            <Indicator count={3}  label="3 avisos sin leer">
              <IconButton icon="inbox" label="Entregas" size="lg" />
            </Indicator>
            <Indicator count={148}  label="148 sin leer">
              <IconButton icon="mail" label="Mensajes" size="lg" />
            </Indicator>
          </Variant>
          <Variant name="glifo">
            <Indicator icon="check" tone="ok" label="Corregida">
              <IconButton icon="inbox" label="Entregas" size="lg" />
            </Indicator>
            <Indicator icon="lock" tone="neutral" label="Cerrado">
              <IconButton icon="folder" label="Espacio" size="lg" />
            </Indicator>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Los tonos"
        note="El acento es el default y es el que dice 'mirá esto'. Los otros cuatro son los de estado y significan lo mismo que en un `Alert` o en un `Chip`, que es de lo que se trata tener un sistema."
      >
        <Panel>
          <Variant name="tonos">
            {(['accent', 'ok', 'warn', 'bad', 'neutral'] as const).map(t => (
              <Indicator key={t} dot  tone={t} label={t}>
                <IconButton icon="notifications" label={`Avisos ${t}`} size="lg" />
              </Indicator>
            ))}
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Un glifo suelto"
        note="Sin botón alrededor, la marca se apoya en la esquina del glifo y no hace falta correrla."
      >
        <Panel>
          <Variant name="sin botón">
            <Indicator dot tone="warn" inset={0} label="Vence mañana">
              <Icon name="calendar_month" size={24} />
            </Indicator>
          </Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="Indicator" />
      </Section>

      <A11y
        items={[
          'Con `label`, la marca se anuncia como `role="status"` y el texto va en `sr-only`: quien no la ve se entera igual, y una sola vez.',
          'Sin `label` la marca es decorativa y va `aria-hidden`, porque lo que significa ya está en el nombre de lo que envuelve.',
          'La marca no recibe el puntero: lo que se toca sigue siendo la pieza de abajo, con su mismo objetivo de siempre.',
          'El contador no es la única forma de enterarse: el número también está en el nombre accesible de lo que marca.',
          'Ningún tono se dice solo con color: el glifo es la forma, y el punto y el contador viven pegados a una pieza que ya se nombra sola.',
        ]}
      />
    </Page>
  )
}
