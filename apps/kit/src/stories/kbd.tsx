import cls from './kbd.module.css'
import { Kbd } from '@milo/ui'
import { A11y, Note, Page, Panel, Props, Section, Variant } from '../kit'

export function KbdStory() {
  return (
    <Page
      title="Kbd"
      kind="Superficies"
      imports="import { Kbd } from '@milo/ui'"
      lead="La tecla dibujada. Es una marca hundida (la misma receta que la pista de un segmented) porque una tecla es algo que se aprieta: lleva canto, luz arriba y una sombra de caída corta."
    >
      <Section
        title="Cómo se ve"
        note="Radio 6, el más chico de la escala. Un radio grande en una caja de 20 de alto la convierte en una pastilla y deja de parecer una tecla."
      >
        <Panel>
          <Variant name="una tecla"><Kbd>K</Kbd></Variant>
          <Variant name="con modificador"><Kbd>⌘K</Kbd><Kbd>⌥</Kbd><Kbd>⇧</Kbd></Variant>
          <Variant name="con nombre"><Kbd>Esc</Kbd><Kbd>Enter</Kbd><Kbd>Tab</Kbd></Variant>
          <Variant name="una unidad"><Kbd>min</Kbd><Kbd>px</Kbd></Variant>
        </Panel>
      </Section>

      <Section
        title="Dónde aparece"
        note="En el buscador del riel, en la paleta de comandos y como sufijo de un campo cuando lo que sigue es una unidad. Son los tres lugares donde hace falta mostrar algo que se escribe."
      >
        <div className={`${cls.usageStrip} bg-surface`}>
          <span className={cls.searchHint}>
            Buscar una pieza <Kbd>/</Kbd>
          </span>
          <span className={cls.paletteHint}>
            Abrir la paleta <Kbd>⌘K</Kbd>
          </span>
          <span className={cls.closeHint}>
            Cerrar <Kbd>Esc</Kbd>
          </span>
        </div>
      </Section>

      <Note title="El símbolo antes que el nombre">
        <Kbd>⌘</Kbd> y no "Cmd", <Kbd>⇧</Kbd> y no "Shift": el símbolo es lo que está impreso en la
        tecla que hay que apretar. La excepción son las que no tienen símbolo (Esc, Tab, Enter) donde
        el nombre es lo que está impreso.
      </Note>

      <Section title="Props">
        <Props of="Kbd" />
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Usa el elemento <kbd>, que es lo que un lector de pantalla anuncia como una tecla.',
          'No es un botón: es texto que dice qué apretar, no algo que se toque.',
        ]} />
      </Section>
    </Page>
  )
}
