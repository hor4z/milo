import { Avatar, AvatarGroup } from '@melu/ui'
import { Block, Demo, Mono, Panel, Props, Section, Variant } from '../kit'

/* Las caras son sintéticas y viven en `public/avatars`. El porqué de las dos
   cosas —generadas y no pedidas a un host— está en `public/avatars/LEEME.md`. */
const cara = (n: number) => `/avatars/${String(n).padStart(2, '0')}.webp`
const persona = (name: string, foto?: number) => ({ name, src: foto ? cara(foto) : undefined })

export function AvatarStory() {
  return (
    <Section
      title="Avatar · AvatarGroup"
      note="Una persona en el lugar de un nombre. Con foto o con la inicial sobre una etiqueta de color, y las dos tienen que pesar lo mismo: en una fila donde algunos subieron foto y otros no, el que no subió no puede leerse como un error."
    >
      <Block
        label="Sin foto"
        note="El tinte sale del nombre, no de un random: si saliera de un random, la misma persona cambiaría de color en cada render y el color dejaría de identificar a nadie. El reparto va sobre la familia de etiquetas en orden de rueda — con los tonos desordenados, dos nombres consecutivos caían en dos tonos casi iguales."
      >
        <Demo>
          <Avatar name="Horacio Rivero" size={24} />
          <Avatar name="Horacio Rivero" size={34} />
          <Avatar name="Horacio Rivero" size={44} />
          <Avatar name="Melina Duarte" size={44} />
          <Avatar name="Equipo Timonel" size={44} />
        </Demo>
      </Block>

      <Block
        label="Con foto"
        note="Con `src`, la etiqueta de color no se reemplaza: se queda de fondo. Es lo que se ve mientras la imagen carga y lo que queda si no carga nunca — un hueco gris en una fila de cinco se lee como una persona sin nombre, y una inicial sobre su color no."
      >
        <Demo>
          <Avatar name="Ana Pérez" src={cara(1)} size={24} />
          <Avatar name="Ana Pérez" src={cara(1)} size={34} />
          <Avatar name="Ana Pérez" src={cara(1)} size={44} />
          <Avatar name="Bruno Díaz" src={cara(2)} size={44} />
          <Avatar name="Carla Sosa" src={cara(3)} size={44} />
          <Avatar name="Damián Ruiz" src={cara(4)} size={44} />
        </Demo>
      </Block>

      <Block
        label="El grupo"
        note="Se montan un tercio de su tamaño y cada uno lleva un anillo del color del fondo de atrás: sin el anillo, dos vecinos de tonos parecidos se leen como una mancha sola en vez de como dos personas. Tres caras como máximo y el resto en un círculo neutro — un «+4» no identifica a nadie, así que no va en la familia viva de las etiquetas, que es la de identificar."
      >
        <Demo label="todos con foto">
          <AvatarGroup people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]} />
        </Demo>
        <Demo label="ninguno con foto">
          <AvatarGroup people={[persona('Irene Lopez'), persona('Julián Cruz'), persona('Karen Ortiz'), persona('Leo Nuñez')]} />
        </Demo>
        <Demo label="mezclados · el caso que importa mirar">
          <AvatarGroup people={[persona('Mora Tello', 6), persona('Nico Arce'), persona('Olivia Rey', 7)]} />
        </Demo>
        <Demo label="con un solo sobrante va la cuarta cara, no un «+1»">
          <AvatarGroup people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4)]} />
        </Demo>
      </Block>

      <Block
        label="Sobre otro fondo"
        note="El anillo es del color de lo que hay atrás y no blanco fijo, así que fuera del papel hay que pasarle `ring`. Es la única forma: un avatar no puede saber sobre qué lo pusieron."
      >
        <Demo label='ring="ring-muted" sobre bg-muted'>
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]}
              size={40}
              ring="ring-muted"
            />
          </span>
        </Demo>
        <Demo label="el mismo grupo con el anillo por default: se corta contra el fondo">
          <span className="flex items-center gap-4 rounded-xl bg-muted p-3">
            <AvatarGroup
              people={[persona('Ana Pérez', 1), persona('Bruno Díaz', 2), persona('Carla Sosa', 3), persona('Damián Ruiz', 4), persona('Elena Vega', 5)]}
              size={40}
            />
          </span>
        </Demo>
      </Block>

      <Block
        label="La prueba: ¿de qué familia sale el fondo?"
        note="El sistema tiene asignada la familia viva (`--label-*`, relleno saturado con la inicial en blanco) a lo chico, y la familia de marcas (`--mark-*`, pastel con relieve y el glifo del mismo tono más oscuro) a la marca de 44 de una fila de lista. El argumento escrito es el tamaño de la pieza: algo chico en pastel se confunde con el fondo apagado del que sale. Acá están las dos a los tamaños en que un avatar aparece de verdad, para poder mirarlo en vez de discutirlo."
      >
        <Panel>
          <Variant name="viva · label">
            {[18, 24, 28, 34, 40, 44].map(s => (
              <span key={s} className="flex flex-col items-center gap-1">
                <Avatar name="Ana Pérez" size={s} />
                <Mono>{s}</Mono>
              </span>
            ))}
          </Variant>
          <Variant name="marca · mark">
            {[18, 24, 28, 34, 40, 44].map(s => (
              <span key={s} className="flex flex-col items-center gap-1">
                <Avatar name="Ana Pérez" size={s} variant="mark" />
                <Mono>{s}</Mono>
              </span>
            ))}
          </Variant>
        </Panel>
        <p className="mt-3 max-w-[70ch] text-2xs text-ink-muted">
          Medido, y el resultado no es el que se esperaba. <strong className="font-semibold text-ink">
          La inicial de la variante marca se lee mejor</strong>, no peor: 4.51:1 contra su propio
          disco, contra 3.78:1 del blanco sobre el relleno vivo. Lo que pierde es el disco —
          1.91:1 contra el papel y 1.73:1 contra una superficie apagada, cuando la familia viva da
          3.68:1 y 3.34:1. La mitad de presencia.
        </p>
        <p className="mt-2 max-w-[70ch] text-2xs text-ink-muted">
          O sea: la regla escrita acierta, pero no por el motivo que dice. No es que la inicial no
          se lea en pastel; es que el disco deja de existir. Y eso importa justamente porque el
          trabajo de un avatar sin foto es identificar a alguien de un vistazo en una fila: lo que
          tiene que verse primero es el círculo, y la inicial después. A 40 y 44 la marca queda
          mejor —más suave, con cuerpo, sin gritar—; a 18 y 24 gana la viva.
        </p>
      </Block>

      <Block
        label="Las dos, sobre los dos fondos"
        note="La regla escrita dice que el pastel se confunde con el fondo apagado del que sale. Este es el caso: el mismo avatar sobre papel y sobre una superficie apagada."
      >
        <div className="flex flex-wrap gap-3">
          {(['label', 'mark'] as const).map(v => (
            <div key={v} className="flex flex-col gap-2">
              <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
                {['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz'].map(n => (
                  <Avatar key={n} name={n} size={28} variant={v} />
                ))}
                <Mono>{v} · sobre papel</Mono>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                {['Ana Pérez', 'Bruno Díaz', 'Carla Sosa', 'Damián Ruiz'].map(n => (
                  <Avatar key={n} name={n} size={28} variant={v} />
                ))}
                <Mono>{v} · sobre apagado</Mono>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block
        label="En un grupo montado"
        note="El caso real: apilados, con el anillo del fondo de atrás. Acá se ve si el pastel aguanta cuando además hay un anillo separándolos."
      >
        <Panel>
          <Variant name="viva">
            <AvatarGroup people={[persona('Irene Lopez'), persona('Julián Cruz'), persona('Karen Ortiz'), persona('Leo Nuñez')]} size={32} />
          </Variant>
          <Variant name="marca">
            <span className="flex items-center">
              {['Irene Lopez', 'Julián Cruz', 'Karen Ortiz'].map((n, i) => (
                <Avatar key={n} name={n} size={32} variant="mark" className={i > 0 ? 'ring-2 ring-surface -ml-2.5' : 'ring-2 ring-surface'} />
              ))}
            </span>
          </Variant>
        </Panel>
      </Block>

      <Block label="Props">
        <Props rows={[
          { name: 'Avatar · name', type: 'string', note: 'obligatorio: de acá salen la inicial y el tinte' },
          { name: 'Avatar · src', type: 'string', note: 'opcional; la etiqueta de color queda de fondo' },
          { name: 'Avatar · size', type: 'number', def: '40' },
          { name: 'Avatar · variant', type: "'label' | 'mark'", def: "'label'", note: 'de qué familia sale el fondo sin foto' },
          { name: 'AvatarGroup · people', type: '{ name, src? }[]', note: 'obligatorio; sin `src` cae a la inicial' },
          { name: 'AvatarGroup · max', type: 'number', def: '3', note: 'cuenta avatares, no personas' },
          { name: 'AvatarGroup · size', type: 'number', def: '28', note: 'el monte sale de acá' },
          { name: 'AvatarGroup · ring', type: 'string', def: "'ring-surface'", note: 'la utilidad del fondo de atrás' },
        ]} />
      </Block>
    </Section>
  )
}
