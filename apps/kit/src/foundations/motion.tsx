import css from './motion.module.css'
import { useState } from 'react'
import { Button, Icon, Switch } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Dos duraciones de interfaz, una de contenido, y dos curvas. */
const duraciones = [
  { name: '--duration-fast', ms: 120, role: 'lo que acompaña al dedo: un hover, un color que cambia, un check que se marca. Tiene que sentirse instantáneo.' },
  { name: '--duration-normal', ms: 190, role: 'lo que aparece o se va: un panel, un modal, una hoja. Acá el ojo necesita ver de dónde vino.' },
  { name: '--duration-content', ms: 280, role: 'lo que no es interfaz: una carpeta que se abre, un libro que gira. No informa de un cambio de estado, muestra qué es la cosa, y eso pide más tiempo.' },
] as const

const curvas = [
  { name: '--ease-out', value: 'cubic-bezier(0.24, 1, 0.4, 1)', role: 'todo lo que entra. Arranca rápido y frena: la pieza ya está donde va antes de terminar de moverse.' },
  { name: '--ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', role: 'lo que se va. Arranca lento y acelera hacia afuera.' },
] as const

export function MotionSection() {
  return (
    <Page
      title="Movimiento"
      kind="Fundamentos"
      lead="Dos duraciones para la interfaz y una tercera para el contenido, y dos curvas. El movimiento de la interfaz no decora: dice de dónde vino algo y adónde se fue. Cuando no dice eso, no va, y lo que se mueve porque sí es contenido y se rige por la regla de abajo."
      imports="import { Popover } from '@milo/ui'"
    >
      <Section
        title="Dos duraciones"
        note="120, 190 y 280 milisegundos. El corte no es estético: por debajo de unos 100ms el ojo no llega a ver el movimiento y solo registra el salto; por encima de unos 250ms la interfaz empieza a hacerse esperar. Lo que pasa de ahí ya no es interfaz: es contenido que se está mostrando, y por eso tiene su propio paso. Las tres estuvieron escritas a mano con valores distintos (250, 280 y 340) hasta que se contaron."
      >
        <div className={css.div}>
          {duraciones.map(d => (
            <div key={d.name} className={`${css.div2} bg-surface`}>
              <code className={css.code}>{d.name}</code>
              <span className={`${css.span} tabular`}>{d.ms}ms</span>
              <span className={css.span2}>{d.role}</span>
            </div>
          ))}
        </div>
        <Note icon="build" title="Son tokens, y se leen como tokens">
          Una pieza escribe <code>transition-duration: var(--duration-fast)</code> en su módulo y
          nada más. No hay una capa de utilidades en el medio, así que no hay dos nombres para lo
          mismo ni un paso donde el token esté y la clase no se genere. Una app que quiera
          utilidades las arma sobre estos tokens, que es de dónde salen los tres valores.
        </Note>
      </Section>

      <Section
        title="Salir es más corto que entrar"
        note="Abrir se mira; cerrar estorba. Lo que entra usa ease-out (arranca rápido y frena, así que la pieza está donde va antes de terminar de moverse) y lo que sale usa ease-in y se va antes."
      >
        <div className={css.div3}>
          {curvas.map(c => (
            <div key={c.name} className={`${css.div4} bg-surface`}>
              <code className={css.code2}>{c.name}</code>
              <code className={css.code3}>{c.value}</code>
              <span className={css.span3}>{c.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Probador />

      <Section
        title="Lo que no se mueve"
        note="La lista más importante de esta vista, porque el movimiento que no está es el que nadie reclama y el que más molesta cuando aparece."
      >
        <div className={css.div5}>
          {[
            ['Las tarjetas en hover', 'Una grilla que salta hace temblar la vista entera, y el salto no informa nada: ya sabías dónde tenías el mouse.'],
            ['Las acciones que aparecen al pasar', 'Un botón que se revela con el mouse no se descubre sin mouse, y tapa justo lo que estabas mirando.'],
            ['El contenido al cargar', 'Nada entra desde abajo ni se desvanece. El esqueleto ocupa el lugar exacto de lo que viene, así que cuando llega no se mueve nada.'],
            ['El foco', 'El anillo aparece y desaparece sin transición: es un aviso, y un aviso que tarda 190ms en verse llega tarde.'],
          ].map(([t, b]) => (
            <div key={t} className={`${css.div6} bg-surface`}>
              <div className={css.div7}>
                <Icon name="close" size={14} className={css.icon} />
                <span className={css.span4}>{t}</span>
              </div>
              <p className={css.p}>{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Apagarlo no es congelarlo"
        note="Con prefers-reduced-motion todas las animaciones se van y las transiciones bajan a un milisegundo. Pero lo que informa por moverse necesita otra salida, no la misma."
      >
        <div className={css.div8}>
          {[
            ['El spinner', 'gira lento, 2.4s por vuelta', 'Es lo único que avisa que algo está pasando: quieto no dice nada, y quieto parece colgado.'],
            ['Las carpetas', 'las hojas quedan afuera, sin abanicar', 'La información (cuántas hay) se sigue viendo, que era el punto del abanico.'],
            ['El libro', 'no rota', 'La rotación era gusto y nada más, así que se va entera.'],
            ['Todo lo demás', 'aparece y desaparece', 'Un panel que llega en 1ms sigue llegando: lo que se pierde es el recorrido, no el estado.'],
          ].map(([q, comoQueda, porque]) => (
            <div key={q} className={`${css.div9} bg-surface`}>
              <span className={css.span5}>{q}</span>
              <span className={css.span6}>{comoQueda}</span>
              <span className={css.span7}>{porque}</span>
            </div>
          ))}
        </div>
      </Section>

      <Note icon="campaign" title="Lo que se mueve porque sí">
        La regla de arriba es para la interfaz. Una mascota que saluda, una ilustración que respira,
        una celebración cuando algo salió bien: eso es contenido, no interfaz, y ahí el movimiento
        no tiene que explicar nada: puede simplemente dar gusto. Es la parte del sistema que le
        habla a alguien de doce años.
        {' '}
        Lo que no cambia son tres cosas. <strong>Nunca al lado de una tarea</strong>: algo que se
        mueve mientras alguien lee o escribe se lleva la atención y no la devuelve.
        {' '}<strong>Nunca como única forma de entender algo</strong>: si se saca, la pantalla sigue
        diciendo lo mismo. Y <strong>siempre respeta a quien pidió menos movimiento</strong>: ahí no
        se atenúa, se reemplaza por la versión quieta.
      </Note>

      <A11y
        items={[
          'Todo respeta `prefers-reduced-motion`: las animaciones se apagan y las transiciones bajan a 1ms, con un `!important` que no deja que una pieza se olvide.',
          'Lo que informa por moverse no se congela, se ralentiza: un spinner quieto se lee como algo colgado, que es peor que el movimiento.',
          'Ninguna animación es la única forma de enterarse de algo. Lo que pasó siempre está además en el texto o en el estado de la pieza.',
          'Nada parpadea ni destella: por encima de tres destellos por segundo el movimiento deja de ser una molestia y pasa a ser un riesgo para quien tiene epilepsia fotosensible.',
        ]}
      />
    </Page>
  )
}

function Probador() {
  const [abierto, setAbierto] = useState(false)
  const [lento, setLento] = useState(false)

  return (
    <Section
      title="Verlo"
      note="El mismo panel con las dos duraciones. La diferencia entre 120 y 190 milisegundos parece nada escrita y se nota entera cuando algo entra en pantalla."
    >
      <div className={`${css.div10} bg-surface`}>
        <div className={css.div11}>
          <Button variant="raised" onClick={() => setAbierto(v => !v)}>
            {abierto ? 'Cerrar' : 'Abrir'}
          </Button>
          <span className={css.span8}>
            <Switch checked={lento} onChange={setLento} label="Usar la duración de panel" />
            <button type="button" onClick={() => setLento(v => !v)} className={css.box}>
              Usar <code className={css.code4}>--duration-normal</code>
            </button>
          </span>
        </div>
        <div className={css.div12}>
          <div
            className={[
              css.div13,
              lento ? css.box2 : css.box3,
              css.box4,
              abierto ? css.box5 : css.box6,
            ].join(' ')}
          >
            <span className={css.span9}>Entregas sin corregir</span>
            <p className={css.p2}>
              Entra con <code>ease-out</code>: arranca rápido y frena, así que llega antes de que el
              movimiento termine.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
