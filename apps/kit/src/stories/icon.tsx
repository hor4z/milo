import { Icon } from '@melu/ui'
import { Block, Demo, Props, Section } from '../kit'

export function IconStory() {
  return (
    <Section
      title="Icon"
      note="Set propio de contornos, grilla de 24, 20px y trazo 1. Es un set de contornos y no de glifos macizos, y eso tiene una contra que hay que compensar: un trazo fino encierra aire y se apaga al lado del texto."
    >
      <Block
        label="El peso"
        note="La prop `weight` sube a 1.5 donde el icono va en gris. Por lo mismo existe `--icon-muted`, más oscuro que el gris del texto. Si algún día el set pasa a glifos macizos, ese token vuelve a --shade-06 y el `weight` desaparece."
      >
        <Demo>
          <span className="flex items-center gap-2">
            <Icon name="search" size={20} />
            <span className="text-2xs text-ink-muted">weight 1 · en tinta</span>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="search" size={20} className="icon-muted" />
            <span className="text-2xs text-ink-muted">weight 1.5 · icon-muted</span>
          </span>
        </Demo>
      </Block>

      <Block label="SPIKE · Material Symbols" note="Temporal. Si estos tres se ven, el woff2 se resolvió desde packages/ui y el enfoque de fuente sigue.">
        <Demo>
          {[0xe8b6, 0xe88a, 0xe8b8].map(cp => (
            <span key={cp} className="ms-spike" style={{ fontSize: 32, width: 32, height: 32 }}>
              {String.fromCodePoint(cp)}
            </span>
          ))}
          <span className="ms-spike" style={{ fontSize: 32, width: 32, height: 32, ['--icon-wght' as string]: 700 }}>
            {String.fromCodePoint(0xe8b6)}
          </span>
          <span className="ms-spike" style={{ fontSize: 32, width: 32, height: 32, ['--icon-fill' as string]: 1 }}>
            {String.fromCodePoint(0xe88a)}
          </span>
        </Demo>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'name', type: 'IconName', note: 'obligatorio' },
          { name: 'size', type: 'number', def: '20', note: '16 para lo que va inline con texto' },
          { name: 'weight', type: 'number', def: '1', note: '1.5 cuando el icono va en gris' },
          { name: 'solid', type: 'boolean', note: 'pinta en vez de trazar; ya viene puesto en heart, bolt y sparkle' },
        ]} />
      </Block>
    </Section>
  )
}
