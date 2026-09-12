import { Icon } from '@melu/ui'
import { Page, Section } from '../kit'

const pairs: { bad: string; good: string; by: string }[] = [
  {
    bad: 'Error: la operación no pudo ser completada.',
    good: 'No se pudieron traer las entregas.',
    by: 'Decí qué pasó, no que hubo un error. La palabra «error» no agrega información y asusta.',
  },
  {
    bad: '¿Está seguro de que desea eliminar este elemento?',
    good: '¿Borrar «Fracciones equivalentes»?',
    by: 'Nombrá lo que se va a borrar. «Este elemento» obliga a recordar qué estabas tocando.',
  },
  {
    bad: 'No hay datos disponibles.',
    good: 'Todavía no llegó ninguna entrega.',
    by: 'Un vacío es una etapa, no una falla. Decí qué falta para que deje de estar vacío.',
  },
  {
    bad: 'Se ha guardado exitosamente.',
    good: 'Guardado.',
    by: 'Lo que salió bien no necesita explicación. Una palabra alcanza.',
  },
  {
    bad: 'Campo requerido',
    good: 'Poné un nombre para la actividad',
    by: 'Un error de campo dice qué hacer, no qué categoría de error es.',
  },
]

export function Writing() {
  return (
    <Page
      title="Cómo se escribe"
      lead="La interfaz habla en segunda persona, en presente y en argentino. El texto es parte del diseño: una pantalla bien dibujada con un cartel que dice «ha ocurrido un error inesperado» está mal terminada."
    >
      <Section
        title="Las reglas"
        note="Cinco, y las cinco se pueden revisar leyendo en voz alta."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Vos, no usted', 'Escribí, elegí, mirá. Es como habla la gente con la que trabajamos.'],
            ['Presente', '«Se publicó» y no «ha sido publicado».'],
            ['Frases cortas', 'Si una oración tiene dos comas y un «mediante», va cortada en dos.'],
            ['Sin jerga de sistema', 'Nada de «token», «endpoint», «query» ni «elemento» en una pantalla de producto.'],
            ['Mayúscula solo al principio', 'Los títulos van como una oración: «Entregas de la semana», no «Entregas De La Semana».'],
            ['Números como números', '3 y no «tres», salvo al empezar una oración.'],
          ].map(([t, d]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4">
              <span className="text-xs font-semibold text-ink">{t}</span>
              <span className="text-2xs font-medium text-ink-muted">{d}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Antes y después"
        note="Los mismos mensajes escritos de las dos maneras. La diferencia nunca es de tono: es de información."
      >
        <div className="flex flex-col gap-3">
          {pairs.map(p => (
            <div key={p.good} className="overflow-hidden rounded-xl border border-line">
              <div className="flex items-start gap-3 border-b border-line bg-bad-subtle/40 px-4 py-3">
                <Icon name="close" size={16} className="mt-px shrink-0 text-bad" />
                <span className="text-xs font-medium text-ink line-through decoration-bad/40">{p.bad}</span>
              </div>
              <div className="flex items-start gap-3 px-4 py-3">
                <Icon name="check" size={16} className="mt-px shrink-0 text-ok" />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-xs font-semibold text-ink">{p.good}</span>
                  <span className="text-2xs font-medium text-ink-muted">{p.by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </Page>
  )
}
