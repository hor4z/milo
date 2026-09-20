import cls from './divider.module.css'
import { Avatar } from '@milo/ui/avatar'
import { Divider } from '@milo/ui/divider'
import { Icon } from '@milo/ui/icon'
import { Kbd } from '@milo/ui/kbd'
import { A11y, Example, Footnote, Frame, Page, Panel, Practices, Props, Section, Variant } from '../kit'

export function DividerStory() {
  return (
    <Page
      title="Divider"
      kind="Superficies"
      imports="import { Divider } from '@milo/ui/divider'"
      lead="Un píxel de `--border`, y nada más. Existe como pieza porque la línea estaba escrita a mano en varios lugares y no todas con el mismo gris: cuál es la línea del sistema es una decisión, y una decisión escrita seis veces se desincroniza a la quinta."
    >
      <Section
        title="Las dos orientaciones"
        note="El vertical lleva `self-stretch` adentro: sin eso, en una fila con `items-center` mide cero y no se ve. Es el caso que rompe siempre, así que lo resuelve la pieza y no el call site."
      >
        <Panel>
          <Variant name="horizontal">
            <Frame width="md">
              <div className={cls.aboveText}>Doce actividades en siete espacios</div>
              <Divider />
              <div className={cls.belowText}>Cuatro esperan que alguien las mire</div>
            </Frame>
          </Variant>
          <Variant name="vertical">
            <div className={cls.inlineStrip}>
              <span className={cls.inlineSubject}>Matemática</span>
              <Divider orientation="vertical" />
              <span className={cls.inlineGroup}>4.º A</span>
              <Divider orientation="vertical" />
              <span className={cls.inlineCount}>18 entregas</span>
            </div>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Entre piezas"
        note="Separar dos cosas que son del mismo tipo. Cuando lo que hay abajo es de otro tipo, el cambio de fondo dice más que una línea: el hueco apagado de un panel, la cabecera de una tabla."
      >
        <Panel>
          <Variant name="una barra">
            <div className={`${cls.fakeToolbar} bg-surface`}>
              <Icon name="search" size={18} className="icon-muted" />
              <span className={cls.toolbarLabel}>Buscar</span>
              <Divider orientation="vertical" className={cls.beforeShortcut} />
              <Kbd>⌘K</Kbd>
              <Divider orientation="vertical" className={cls.afterShortcut} />
              <Avatar name="Horacio Rivero" size={24} />
            </div>
          </Variant>
        </Panel>
        <Footnote>
          Adentro de un contenedor con padding (un Menu, un panel) la línea se estira hasta los
          bordes, y esa cuenta la hace el contenedor: es el que conoce su propio padding. Por eso
          el Divider lleva <code className={cls.attributeName}>data-divider</code>, que es de lo único que
          se agarra el padre para hacerla.
        </Footnote>
      </Section>

      <Section title="Cómo se escribe">
        <Example code={`<Divider />

<Divider orientation="vertical" />`} />
      </Section>

      <Section title="Props">
        <Props of="Divider" />
      </Section>

      <Section title="Cómo se usa bien">
        <Practices>
          <Practices.Do>Separá dos cosas que ya se distinguen; si no se distinguen, lo que falta es aire.</Practices.Do>
        </Practices>
      </Section>

      <Section title="Accesibilidad">
        <A11y>
          <A11y.Item>Lleva role="separator" con su orientación, así que un lector anuncia el corte en vez de saltearlo.</A11y.Item>
          <A11y.Item>No es tabulable ni tiene contenido: separa, y nada más.</A11y.Item>
          <A11y.Item>El gris sale de --border, el mismo de todas las líneas del sistema, así que sube y baja con el tema.</A11y.Item>
        </A11y>
      </Section>
    </Page>
  )
}
