import { Avatar, Divider, Icon, Kbd, Link } from '@melu/ui'
import { A11y, Canvas, Page, Panel, Props, Section, Variant } from '../kit'

export function DividerStory() {
  return (
    <Page
      title="Divider y Link"
      kind="Superficies"
      imports="import { Divider, Link } from '@melu/ui'"
      lead="Un píxel de --border, y nada más. Existe como pieza y no como una clase suelta por algo práctico: la línea estaba escrita a mano en varios lugares —border-t, border-b, un hr con el borde apagado— y no todas con el mismo gris. Cuál gris es la línea del sistema es una decisión, y una decisión escrita seis veces se desincroniza a la quinta."
    >
      <Section
        title="Las dos orientaciones"
        note="El vertical lleva `self-stretch` adentro: sin eso, en una fila con `items-center` mide cero y no se ve. Es el caso que rompe siempre, así que lo resuelve la pieza y no el call site."
      >
        <Panel>
          <Variant name="horizontal">
            <div className="w-full max-w-[420px]">
              <div className="pb-3 text-xs font-medium text-ink">Doce actividades en siete espacios</div>
              <Divider />
              <div className="pt-3 text-xs font-medium text-ink-muted">Cuatro esperan que alguien las mire</div>
            </div>
          </Variant>
          <Variant name="vertical">
            <div className="flex h-9 items-center gap-3">
              <span className="text-xs font-medium text-ink">Matemática</span>
              <Divider orientation="vertical" />
              <span className="text-xs font-medium text-ink">4.º A</span>
              <Divider orientation="vertical" />
              <span className="text-xs font-medium text-ink-muted">18 entregas</span>
            </div>
          </Variant>
        </Panel>
      </Section>

      <Section
        title="Entre piezas"
        note="Separar dos cosas que son del mismo tipo. Cuando lo que hay abajo es de otro tipo, el cambio de fondo dice más que una línea — el hueco apagado de un panel, la cabecera de una tabla."
      >
        <Panel>
          <Variant name="una barra">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3">
              <Icon name="search" size={18} className="icon-muted" />
              <span className="text-xs font-medium text-ink-muted">Buscar</span>
              <Divider orientation="vertical" className="mx-1" />
              <Kbd>⌘K</Kbd>
              <Divider orientation="vertical" className="mx-1" />
              <Avatar name="Horacio Rivero" size={24} />
            </div>
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Adentro de un contenedor con padding —un Menu, un panel— la línea se estira hasta los
          bordes, y esa cuenta la hace el contenedor: es el que conoce su propio padding. Por eso
          el Divider lleva <code className="font-mono">data-divider</code>, que es de lo único que
          se agarra el padre para hacerla.
        </p>
      </Section>

      <Section title="Props">
        <Props rows={[
          { name: 'orientation', type: "'horizontal' | 'vertical'", def: "'horizontal'" },
          { name: 'className', type: 'string', note: 'para el margen, que depende de dónde esté' },
        ]} />
      </Section>
    
      <Section
        title="Link"
        note="Un enlace lleva subrayado, siempre. Sin él, lo único que lo distingue del texto que lo rodea es el color, y en una interfaz monocroma no hay color que lo distinga. El de afuera avisa que se abre en otra pestaña —con el glifo y con texto para el lector— en vez de hacerlo en silencio."
      >
        <Canvas className="flex-col items-start gap-3">
          <p className="max-w-[60ch] text-xs font-medium text-ink-muted">
            Las entregas se cierran en la fecha que elijas. Podés cambiarla desde{' '}
            <Link href="#divider">los ajustes de la actividad</Link> mientras siga abierta.
          </p>
          <Link href="https://m3.material.io/styles/icons" external>Material Symbols</Link>
        </Canvas>
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'El Divider lleva role="separator" con su orientación, así que un lector anuncia el corte.',
          'Un Link externo dice «se abre en otra pestaña» además de mostrar el glifo.',
          'El subrayado no depende del color: se ve igual en monocromo y en alto contraste.',
        ]} />
      </Section>
    </Page>
  )
}
