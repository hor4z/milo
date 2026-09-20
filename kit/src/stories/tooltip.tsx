import cls from './tooltip.module.css'
import { Button } from '@milo/ui/button'
import { IconButton } from '@milo/ui/icon-button'
import { Tooltip } from '@milo/ui/tooltip'
import { A11y, Cluster, Demo, Page, Props, Section } from '../kit'

export function TooltipStory() {
  return (
    <Page
      title="Tooltip"
      lead="La etiqueta que dice qué hace un control que no lo dice solo. No es un Popover chico: se abre solo (hover o foco de teclado), no recibe el mouse (o taparía justo el botón que explica) y no lleva nada interactivo adentro. Si tiene un link o un botón, es un Popover."
      kind="Avisos"
      imports="import { Tooltip } from '@milo/ui/tooltip'"
    >
      <Section
        title="El retraso se comparte"
        note="El primero tarda medio segundo, porque uno que aparece apenas el mouse pasa salta solo mientras cruzás la pantalla. Pero el de al lado abre al instante: con medio segundo cada uno, recorrer seis iconos son tres segundos de espera."
      >
        <Cluster gap="xs" align="center">
          <Tooltip label="Buscar"><IconButton icon="search" label="Buscar" /></Tooltip>
          <Tooltip label="Duplicar"><IconButton icon="content_copy" label="Duplicar" /></Tooltip>
          <Tooltip label="Compartir"><IconButton icon="share" label="Compartir" /></Tooltip>
          <Tooltip label="Archivar"><IconButton icon="inventory_2" label="Archivar" /></Tooltip>
          <Tooltip label="Ajustes"><IconButton icon="tune" label="Ajustes" /></Tooltip>
          <Tooltip label="Más"><IconButton icon="more_horiz" label="Más" /></Tooltip>
        </Cluster>
      </Section>

      <Section
        title="Con el teclado"
        note="Tabulá hasta el botón: el tooltip aparece igual. Pero solo cuando el foco es del teclado: con un onFocus pelado, clickear el botón deja el tooltip puesto encima de lo que acabás de tocar. Escape lo cierra, por la misma pila global que los otros overlays."
      >
        <Cluster align="center">
          <Demo label="en un botón con texto">
            <Tooltip label="Se publica para los siete espacios">
              <Button variant="brand">Publicar</Button>
            </Tooltip>
          </Demo>
          <Demo label="texto largo · se envuelve a 240">
            <Tooltip label="Una actividad archivada sale de la lista pero no se borra: queda en 'Archivadas' y se puede restaurar.">
              <IconButton icon="inventory_2" label="Archivar" variant="muted" />
            </Tooltip>
          </Demo>
          <Demo label="abajo">
            <Tooltip side="bottom" label="Va abajo si entra">
              <IconButton icon="keyboard_arrow_down" label="Abajo" variant="muted" />
            </Tooltip>
          </Demo>
        </Cluster>
      </Section>

      <Section
        title="Se da vuelta y no se sale"
        note="Contra el borde de arriba se va abajo, y contra el costado se pega a 8 del canto en vez de salirse. Un tooltip de un icono de la punta del sidebar se salía de la ventana."
      >
        <div className={cls.edgeRow}>
          <Tooltip label="Pegado al borde izquierdo de la ventana">
            <IconButton icon="chevron_left" label="Izquierda" variant="muted" />
          </Tooltip>
          <Tooltip label="Pegado al borde derecho de la ventana">
            <IconButton icon="chevron_right" label="Derecha" variant="muted" />
          </Tooltip>
        </div>
      </Section>

      <Section title="Props">
        <Props of="Tooltip" />
      </Section>

      <Section
        title="Lo que no hace"
        note="En touch no aparece: no hay hover que lo abra ni forma de cerrarlo sin tocar otra cosa. Por eso lo que diga tiene que estar también en el `aria-label` del control, y por eso nunca lleva información que no esté en otro lado."
      >
        <p className={cls.limitsText}>
          Queda un <code>title</code> nativo en el <code>Segmented</code> de solo iconos, que es la
          misma caja del sistema operativo que se le sacó al <code>IconButton</code>. Pasarlo a{' '}
          <code>Tooltip</code> ata <code>primitives</code> a <code>overlay</code>, que hoy importa
          al revés: es un movimiento de archivos, no una prop.
        </p>
      </Section>

      <Section title="Accesibilidad">
        <A11y items={[
          'Aparece con el foco de teclado y no solo con el mouse.',
          'Lleva role="tooltip" y el control que explica lo referencia con aria-describedby.',
          'No recibe el puntero, así que nunca se mete entre el mouse y lo que describe.',
          'En touch no aparece: lo que diga tiene que estar también en el aria-label del control.',
        ]} />
      </Section>
    </Page>
  )
}
