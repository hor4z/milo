import { Avatar, Chip, Icon } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Pares de antes y después. El «by» es la regla que lo explica, no la corrección. */
const pares = [
  {
    bad: 'Estimado docente: su alumno no ha completado la tarea.',
    good: 'Juan todavía no entregó la actividad.',
    by: 'Ni «alumno» ni «su»: acá hay una persona con nombre. Y el usted pone distancia donde hace falta confianza.',
  },
  {
    bad: 'El profesor puede subir sus materiales cuando lo desee.',
    good: 'Podés subir tus materiales cuando quieras.',
    by: 'En segunda persona no hay que elegir género, y de paso el texto se acorta y se dirige a quien está leyendo.',
  },
  {
    bad: 'Los alumnos y las alumnas de la clase',
    good: 'Quienes cursan · el curso · las personas del curso',
    by: 'Desdoblar duplica el largo de cada frase y deja afuera a quien no está en ninguna de las dos. Casi siempre hay un colectivo que ya resuelve.',
  },
  {
    bad: 'Nombre y apellido *',
    good: 'Nombre — como querés que te llamen',
    by: 'Un solo campo, sin formato obligatorio y sin orden. Hay nombres de una palabra, de cinco, con dos apellidos, y hay quien usa un nombre distinto del de su documento.',
  },
  {
    bad: 'No se pudo validar su identidad.',
    good: 'No encontramos esa cuenta. Revisá el correo o pedile a tu escuela que te sume.',
    by: 'Un error tiene que decir qué hacer. Sin salida, el mensaje solo informa que la persona no puede seguir.',
  },
] as const

export function InclusionSection() {
  return (
    <Page
      title="Inclusión"
      kind="Fundamentos"
      lead="Quién se siente nombrado por esta interfaz y quién no. En un producto educativo lo usan chicas y chicos de diez años, docentes de sesenta y familias que entran una vez por trimestre — y ninguno de los tres eligió estar acá."
      imports="import { Avatar, Chip } from '@milo/ui'"
    >
      <Section
        title="A quién le hablamos"
        note="Tres personas distintas con el mismo producto, y la que menos margen tiene es la que más aparece en las decisiones de diseño."
      >
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ['school', 'Quien aprende', 'Puede tener diez años, puede estar aprendiendo a leer, puede entrar desde el celular de la casa. Es quien menos puede permitirse una interfaz que hay que descifrar.'],
            ['person', 'Quien enseña', 'Entra treinta veces por día y corrige de a cuarenta. Necesita densidad y atajos, y no tiene tiempo de aprender un patrón nuevo por pantalla.'],
            ['group', 'Quien acompaña', 'Una familia que entra una vez por trimestre. No conoce el producto y no lo va a aprender: cada pantalla tiene que explicarse sola.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
              <span className="inset-relief mb-1 inline-flex size-9 items-center justify-center rounded-sm">
                <Icon name={icon as 'school'} size={18} />
              </span>
              <span className="text-reading font-semibold text-ink">{title}</span>
              <p className="max-w-[42ch] text-body text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Cómo se nombra a alguien"
        note="Es la decisión que más veces aparece y la que más barato sale hacer bien. La regla corta: segunda persona, nombre propio, y ningún género que no haga falta elegir."
      >
        <div className="flex flex-col gap-3">
          {pares.map(par => (
            <div key={par.good} className="overflow-hidden rounded-xl border border-line bg-surface">
              <div className="flex items-start gap-3 bg-bad-subtle px-5 py-4">
                <Icon name="close" size={16} className="mt-0.5 shrink-0 text-bad-ink" />
                <span className="text-body text-bad-ink">{par.bad}</span>
              </div>
              <div className="flex items-start gap-3 px-5 py-4">
                <Icon name="check" size={16} className="mt-0.5 shrink-0 text-ok" />
                <span className="text-body font-semibold text-ink">{par.good}</span>
              </div>
              <p className="border-t border-line px-5 py-3 text-meta text-ink-muted">{par.by}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="La segunda persona resuelve el género casi siempre"
        note="No es una postura sobre el lenguaje: es que en castellano el «vos» y el «vas» no llevan marca de género, así que la frase sale más corta, más directa y sin tener que elegir. Donde no alcanza, hay un colectivo que sí: «el curso», «quienes entregaron», «la familia»."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Tercera persona', 'El docente debe revisar las entregas de sus alumnos.', 'obliga a elegir'],
            ['Desdoblado', 'Los y las docentes deben revisar las entregas de sus alumnos y alumnas.', 'el doble de largo'],
            ['Segunda persona', 'Revisá las entregas del curso.', 'ni género ni relleno'],
          ].map(([titulo, frase, veredicto], i) => (
            <div key={titulo} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
              <span className="text-label font-semibold text-ink-muted">{titulo}</span>
              <p className="min-h-[72px] text-body text-ink">{frase}</p>
              <Chip color={i === 2 ? 'green' : 'orange'} icon={i === 2 ? 'check' : 'warning'}>{veredicto}</Chip>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Las caras y los nombres del contenido de ejemplo"
        note="El contenido de muestra de un sistema de diseño es una decisión de producto disfrazada de relleno. Si las cinco personas de ejemplo se llaman Juan, Pedro y María y todas tienen la misma cara, eso es lo que el equipo va a dibujar después sin darse cuenta."
      >
        <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center gap-3">
            {[
              { name: 'Milagros Ibáñez', src: '/avatars/01.webp' },
              { name: 'Joaquín Ledesma', src: '/avatars/06.webp' },
              { name: 'Ailén Quiroga', src: '/avatars/03.webp' },
              { name: 'Thiago Nu' },
              { name: 'Sol Vega', src: '/avatars/05.webp' },
            ].map(a => (
              <span key={a.name} className="flex items-center gap-2">
                <Avatar name={a.name} src={a.src} size={34} />
                <span className="text-body text-ink">{a.name}</span>
              </span>
            ))}
          </div>
          <p className="max-w-[70ch] text-body text-ink-muted">
            Nombres de acá y no de un generador en inglés, apellidos que no son todos del mismo
            origen, y uno sin foto — porque un avatar sin imagen es el caso normal y no la
            excepción, y si solo se dibuja el caso con foto, el que no la tiene se rompe.
          </p>
        </div>
      </Section>

      <Note title="Lo que no se pide">
        Ningún campo pide género, ni fecha de nacimiento, ni documento, salvo que haya una razón
        concreta y escrita para necesitarlo. No es una postura: es que cada campo que se pide es un
        dato que hay que guardar, proteger y explicar, y la mitad de las veces que aparece en un
        formulario educativo no lo usa nadie. Un campo que no existe no se puede filtrar mal ni
        filtrar de más.
      </Note>

      <A11y
        items={[
          'La interfaz está en castellano rioplatense y el documento lo declara con `lang="es"`, que es lo que hace que un lector de pantalla lo pronuncie y no lo deletree.',
          'Los nombres de ejemplo llevan acentos y ñ a propósito: es la forma de que un problema de codificación aparezca en el kit y no en producción.',
          'Un avatar sin foto muestra la inicial sobre su color con contraste verificado, y el nombre completo viaja en texto para quien no ve la cara.',
          'Ningún mensaje depende de saber una convención: lo obligatorio se dice con la palabra además del asterisco, y un error dice qué hacer y no solo qué falló.',
        ]}
      />
    </Page>
  )
}
