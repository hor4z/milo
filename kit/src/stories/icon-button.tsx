import cls from './icon-button.module.css'
import { IconButton } from '@milo/ui/icon-button'
import { Indicator } from '@milo/ui/indicator'
import { A11y, Example, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function IconButtonStory() {
  return (
    <Page
      title="IconButton"
      kind="Acciones"
      imports="import { IconButton } from '@milo/ui/icon-button'
import { Indicator } from '@milo/ui/indicator'"
      lead="Cuadrado del alto de su paso, y los pasos son los del `Button`: un icono al lado de un botón en la misma fila apoya en la misma línea sin que nadie lo calcule. El radio es 10 y no el 12 del Button: sobre un cuadrado chico, esos dos píxeles se comen tanto lado plano que la pieza se lee redonda."
    >
      <Section
        title="Los tres tamaños"
        note="36 · 40 · 44, los del Button. `sm` en una barra o adentro de una fila, `md` suelto, `lg` donde se toca con el dedo."
      >
        <Panel>
          <Variant name="sm · md · lg">
            <IconButton icon="tune" label="Ajustes" size="sm" variant="muted" />
            <IconButton icon="tune" label="Ajustes" size="md" variant="muted" />
            <IconButton icon="tune" label="Ajustes" size="lg" variant="muted" />
          </Variant>
          <Variant name="al lado de su botón">
            <span className={cls.mdSample}>
              <IconButton icon="tune" label="Ajustes" size="md" variant="muted" />
              <span className={cls.mdCaption}>md · 36</span>
            </span>
            <span className={cls.lgSample}>
              <IconButton icon="tune" label="Ajustes" size="lg" variant="muted" />
              <span className={cls.lgCaption}>lg · 40</span>
            </span>
          </Variant>
        </Panel>
      </Section>

      <Section title="Variantes" note="`label` es obligatorio: sin él el botón no dice nada. `ghost` en una barra, `muted` cuando tiene que encontrarse solo, `brand` para la acción que manda.">
        <Panel>
          <Variant name="ghost">
            <IconButton icon="tune" label="Ajustes" />
            <IconButton icon="tune" label="Ajustes" size="sm" />
          </Variant>
          <Variant name="muted">
            <IconButton icon="edit" label="Editar" variant="muted" />
            <IconButton icon="edit" label="Editar" variant="muted" size="sm" />
          </Variant>
          <Variant name="solid"><IconButton icon="check" label="Aceptar" variant="solid" /></Variant>
          <Variant name="brand"><IconButton icon="add" label="Nueva actividad" variant="brand" /></Variant>
        </Panel>
      </Section>

      <Section
        title="Estados"
        note="`active` es para el botón cuyo panel está abierto, o el filtro que está puesto."
      >
        <Panel>
          <Variant name="active" note="El panel de filtros está abierto.">
            <IconButton icon="filter_alt" label="Filtrar" active />
          </Variant>
          <Variant name="disabled" note="No responde y se ve que no responde.">
            <IconButton icon="delete" label="Eliminar" disabled />
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Dónde aparece de verdad"
        note="Casi nunca va suelto: va en una fila, en una cabecera o en una barra."
      >
        <Panel>
          <Variant name="la acción de una fila" note="`ghost` y `sm`: la fila ya tiene su marco.">
            <span className={cls.rowSample}>
              <span className={cls.rowText}>Fracciones equivalentes</span>
              <IconButton icon="more_horiz" label="Más opciones de Fracciones equivalentes" size="sm" />
            </span>
          </Variant>
          <Variant name="con una marca encima" note="El puntito lo pone `Indicator`. Este botón no tiene una prop para eso.">
            <Indicator dot label="Hay avisos sin leer" inset={6}>
              <IconButton icon="notifications" label="Novedades" variant="muted" />
            </Indicator>
          </Variant>
          <Variant name="uno al lado del otro" note="En una barra van sin caja y separados por el aire. Si tienen que leerse como un grupo, va `ButtonGroup`.">
            <IconButton icon="undo" label="Deshacer" size="sm" />
            <IconButton icon="redo" label="Rehacer" size="sm" />
            <IconButton icon="content_copy" label="Duplicar" size="sm" />
            <IconButton icon="delete" label="Eliminar" size="sm" />
          </Variant>
        </Panel>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`
<IconButton icon="tune" label="Ajustes" />

<Tooltip label="Exportar a CSV">
  <IconButton icon="download" label="Exportar" variant="muted" />
</Tooltip>
`} />
      </Section>

      <Section title="Props">
        <Props of="IconButton" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>`label` siempre: adentro solo hay un glifo y sin eso el botón no dice nada.</Practices.Do>
          <Practices.Do>Elegí el glifo por lo que hace, no por lo que decora.</Practices.Do>
          <Practices.Dont>No lo uses para la acción principal de una pantalla: un icono solo se reconoce, no se lee.</Practices.Dont>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>El `label` es obligatorio y se convierte en el nombre accesible: un icono solo no dice nada.</A11y.Item>
          <A11y.Item>No lleva `title` nativo, que era una segunda caja del sistema operativo diciendo lo mismo.</A11y.Item>
          <A11y.Item>Para la ayuda visual se envuelve en `Tooltip`, que aparece también con el teclado.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
