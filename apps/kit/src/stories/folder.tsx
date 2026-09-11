import { Avatar, Folder, Icon } from '@melu/ui'
import { Block, Mono, Props, Section } from '../kit'

export function FolderStory() {
  return (
    <Section
      title="Folder"
      note="Una carpeta que se abre. Cerrada es una silueta limpia; al pasar por encima las hojas suben desde adentro y se abanican, y ahí se ve qué hay sin tener que entrar."
    >
      <Block
        label="Pasá el mouse"
        note="El sistema tiene escrito que las tarjetas no se mueven en hover, porque una grilla que salta hace temblar la vista. Esto no lo contradice: lo que se mueve no es la pieza, es el contenido de la pieza. La carpeta no cambia de tamaño ni de lugar, así que la grilla se queda quieta — y lo que se gana es información, cuántas hojas hay."
      >
        <div className="flex flex-wrap gap-4 rounded-xl border border-line bg-surface px-6 py-8">
          <Folder label="Onboarding" meta="15 archivos" onClick={() => {}} />
          <Folder label="Matemática · 4.º A" meta="8 actividades" onClick={() => {}} />
          <Folder label="Sin abrir" meta="2 archivos" sheets={2} onClick={() => {}} />
        </div>
      </Block>

      <Block
        label="Las tres capas"
        note="Contratapa, hojas, y solapa. La contratapa y la pestaña son UN solo path de SVG y no dos rectángulos: con dos, cada uno trae sus esquinas y en el doblez queda un corte a la vista. La pestaña y el canto van en el amarillo MÁS saturado y no en uno más oscuro — es lo que hace que se lea como una sola cartulina doblada. Las hojas suben entre la contratapa y la solapa, que es lo que hace que parezca que salen de adentro y no que aparecen encima."
      >
        <div className="flex flex-wrap items-end gap-8 rounded-xl border border-line bg-surface px-6 py-8">
          {[88, 128, 168, 220].map(s => (
            <div key={s} className="flex flex-col items-center gap-1">
              <Folder size={s} />
              <Mono>{s}</Mono>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Adentro no hay un px suelto: todo va en por ciento del ancho, como el <Mono>Book</Mono>,
          así que el mismo dibujo sirve a 88 y a 220.
        </p>
      </Block>

      <Block
        label="El amarillo sale de una regla"
        note="Va en H 89.6 de OKLCH, y es un tono nuevo del sistema. `--warn-500` está en 82.2 y a la misma luminosidad y croma sale dorado, no amarillo: medido contra la referencia, el tono de casa queda diez veces más lejos (0.031 contra 0.003 de distancia perceptual). Siete grados son poco para dos colores de estado y mucho para una pieza cuyo único trabajo es leerse como una carpeta. La croma va al 81% del techo en el cuerpo y al 89% en la pestaña, no al tope — el amarillo es el tono que más croma aguanta a luminosidad alta, y empujado al límite deja de ser una carpeta y pasa a ser un resaltador."
      >
        <div className="flex flex-wrap items-end gap-6 rounded-xl border border-line bg-surface px-6 py-8">
          <Folder label="Amarillo" meta="el default" />
          <Folder label="Verde" meta="color=var(--label-green)" color="var(--label-green)" />
          <Folder label="Azul" meta="color=var(--label-blue)" color="var(--label-blue)" />
        </div>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Con <Mono>color</Mono> cambia el tope del degradado; la contratapa y el pie se quedan en
          el amarillo. Sirve para distinguir una carpeta puntual, no para pintar una grilla entera —
          doce carpetas de doce colores es un arcoíris, que es lo mismo que dice la nota de los
          tintes.
        </p>
      </Block>

      <Block
        label="Con marcas"
        note="Abajo a la izquierda de la solapa va de dónde vino el contenido: quién lo subió, de qué servicio. Es el mismo lugar donde lo pone el original."
      >
        <div className="flex flex-wrap gap-4 rounded-xl border border-line bg-surface px-6 py-8">
          <Folder
            label="Compartida"
            meta="6 archivos · 3 personas"
            badges={
              <span className="flex items-center -space-x-1.5">
                <Avatar name="Ana Pérez" size={18} className="ring-2 ring-[var(--folder-top)]" />
                <Avatar name="Bruno Díaz" size={18} className="ring-2 ring-[var(--folder-top)]" />
              </span>
            }
          />
          <Folder
            label="Con adjuntos"
            meta="4 archivos"
            badges={<Icon name="attach_file" size={16} className="text-ink" />}
          />
        </div>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'label', type: 'string', note: 'el nombre, debajo' },
          { name: 'meta', type: 'string', note: 'la línea de apoyo: «15 archivos»' },
          { name: 'sheets', type: '2 | 3', def: '3', note: 'más de tres se pisan y dejan de contarse' },
          { name: 'size', type: 'number', def: '128', note: 'el ancho; todo lo demás sale de acá' },
          { name: 'color', type: 'string', note: 'un token, no un hex' },
          { name: 'badges', type: 'ReactNode', note: 'abajo a la izquierda de la solapa' },
          { name: 'onClick', type: '() => void', note: 'sin esto es un <div> y no se puede tabular' },
        ]} />
      </Block>

      <Block
        label="No reemplaza a FolderIcon"
        note="`FolderIcon` es el glifo de 20 que identifica un espacio en una lista de siete, y sigue siendo el único SVG dibujado a mano del sistema. Esto es la pieza grande: una carpeta que se mira, no una que se lee de reojo."
      >
        <div className="flex items-center gap-6 rounded-xl border border-line bg-surface px-6 py-6">
          <Folder size={88} />
          <span className="text-xs text-ink-muted">la pieza · el glifo</span>
        </div>
      </Block>
    </Section>
  )
}
