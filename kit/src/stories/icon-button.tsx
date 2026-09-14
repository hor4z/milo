import cls from './icon-button.module.css'
import { IconButton } from '@milo/ui'
import { A11y, Page, Panel, Props, Section, Variant } from '../kit'

export function IconButtonStory() {
  return (
    <Page
      title="IconButton"
      kind="Acciones"
      imports="import { IconButton } from '@milo/ui'"
      lead="Cuadrado del alto de su paso, y los pasos son los del `Button`: un icono al lado de un botón en la misma fila apoya en la misma línea sin que nadie lo calcule. El radio es 10 y no el 12 del Button: sobre un cuadrado de 32, esos dos píxeles se comen tanto lado plano que la pieza se lee redonda."
    >
      <Section
        title="Los tres tamaños"
        note="32 · 36 · 40, los del Button, con el icono de cada paso: 16 · 18 · 20. El `md` medía 40 (el `lg` del Button) así que los dos `md` del sistema no coincidían."
      >
        <Panel>
          <Variant name="sm · md · lg">
            <IconButton icon="tune" label="Ajustes" size="sm" variant="raised" />
            <IconButton icon="tune" label="Ajustes" size="md" variant="raised" />
            <IconButton icon="tune" label="Ajustes" size="lg" variant="raised" />
          </Variant>
          <Variant name="al lado de su botón">
            <span className={cls.mdSample}>
              <IconButton icon="tune" label="Ajustes" size="md" variant="raised" />
              <span className={cls.mdCaption}>md · 36</span>
            </span>
            <span className={cls.lgSample}>
              <IconButton icon="tune" label="Ajustes" size="lg" variant="raised" />
              <span className={cls.lgCaption}>lg · 40</span>
            </span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Variantes" note="`label` es obligatorio: un botón que solo tiene un icono no dice nada sin él. Y en una barra va `muted` y no `raised`: el canto de un píxel que en un botón ancho es un remate, sobre un cuadrado de 32 pesa mucho más por área y se lee como de otra librería.">
        <Panel>
          <Variant name="ghost">
            <IconButton icon="tune" label="Ajustes" />
            <IconButton icon="tune" label="Ajustes" size="sm" />
          </Variant>
          <Variant name="raised">
            <IconButton icon="edit" label="Editar" variant="raised" />
            <IconButton icon="edit" label="Editar" variant="raised" size="sm" />
          </Variant>
          <Variant name="solid"><IconButton icon="check" label="Aceptar" variant="solid" /></Variant>
          <Variant name="muted"><IconButton icon="more_horiz" label="Más" variant="muted" /></Variant>
        </Panel>
      </Section>

      <Section title="Estados" note="`dot` es el puntito de 'hay algo nuevo', y es uno de los pocos usos del acento en toda la interfaz.">
        <Panel>
          <Variant name="active"><IconButton icon="filter_alt" label="Filtrar" active /></Variant>
          <Variant name="dot">
            <IconButton icon="notifications" label="Novedades" dot size="sm" />
            <IconButton icon="notifications" label="Novedades" dot />
            <IconButton icon="notifications" label="Novedades" dot size="lg" />
          </Variant>
          <Variant name="disabled"><IconButton icon="delete" label="Eliminar" disabled /></Variant>
        </Panel>
      </Section>

      <Section title="Props">
        <Props of="IconButton" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El `label` es obligatorio y se convierte en el nombre accesible: un icono solo no dice nada.',
          'No lleva `title` nativo, que era una segunda caja del sistema operativo diciendo lo mismo.',
          'Para la ayuda visual se envuelve en `Tooltip`, que aparece también con el teclado.',
        ]} />
      </Section>
    </Page>
  )
}
