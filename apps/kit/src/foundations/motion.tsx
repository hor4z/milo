import { useState } from 'react'
import { Button, Icon, Switch } from '@milo/ui'
import { A11y, Note, Page, Section } from '../kit'

/** Las dos duraciones y las dos curvas. No hay una tercera de nada. */
const duraciones = [
  { cls: 'duration-fast', ms: 120, role: 'lo que acompaña al dedo: un hover, un color que cambia, un check que se marca. Tiene que sentirse instantáneo.' },
  { cls: 'duration-normal', ms: 190, role: 'lo que aparece o se va: un panel, un modal, una hoja. Acá el ojo necesita ver de dónde vino.' },
  { cls: 'duration-content', ms: 280, role: 'lo que no es interfaz: una carpeta que se abre, un libro que gira. No informa de un cambio de estado, muestra qué es la cosa, y eso pide más tiempo.' },
] as const

const curvas = [
  { cls: 'ease-out', value: 'cubic-bezier(0.24, 1, 0.4, 1)', role: 'todo lo que entra. Arranca rápido y frena: la pieza ya está donde va antes de terminar de moverse.' },
  { cls: 'ease-in', value: 'cubic-bezier(0.4, 0, 1, 1)', role: 'lo que se va. Arranca lento y acelera hacia afuera.' },
] as const

export function MotionSection() {
  return (
    <Page
      title="Movimiento"
      kind="Fundamentos"
      lead="Dos duraciones para la interfaz y una tercera para el contenido, y dos curvas. El movimiento de la interfaz no decora: dice de dónde vino algo y adónde se fue. Cuando no dice eso, no va — y lo que se mueve porque sí es contenido y se rige por la regla de abajo."
      imports="import { Popover } from '@milo/ui'"
    >
      <Section
        title="Dos duraciones"
        note="120, 190 y 280 milisegundos. El corte no es estético: por debajo de unos 100ms el ojo no llega a ver el movimiento y solo registra el salto; por encima de unos 250ms la interfaz empieza a hacerse esperar. Lo que pasa de ahí ya no es interfaz: es contenido que se está mostrando, y por eso tiene su propio paso. Las tres estuvieron escritas a mano con valores distintos —250, 280 y 340— hasta que se contaron."
      >
        <div className="flex flex-col gap-3">
          {duraciones.map(d => (
            <div key={d.cls} className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-surface px-5 py-4">
              <code className="w-40 shrink-0 font-mono text-meta font-semibold text-ink">{d.cls}</code>
              <span className="w-16 shrink-0 tabular text-body text-ink">{d.ms}ms</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{d.role}</span>
            </div>
          ))}
        </div>
        <Note icon="build" title="Por qué van con @utility y no en el @theme">
          <code>--duration-*</code> no es un namespace de Tailwind, así que declarar el token no
          genera ninguna utilidad: <code>duration-fast</code> no existiría por más que el token esté.
          Se declaran con <code>@utility</code>, que es el mismo mecanismo que ya usan{' '}
          <code>icon-muted</code> y <code>no-scrollbar</code>. La alternativa era escribir{' '}
          <code>duration-(--duration-fast)</code> en cada call site: dice lo mismo y se lee peor.
        </Note>
      </Section>

      <Section
        title="Salir es más corto que entrar"
        note="Abrir se mira; cerrar estorba. Lo que entra usa ease-out —arranca rápido y frena, así que la pieza está donde va antes de terminar de moverse— y lo que sale usa ease-in y se va antes."
      >
        <div className="flex flex-col gap-3">
          {curvas.map(c => (
            <div key={c.cls} className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-surface px-5 py-4">
              <code className="w-40 shrink-0 font-mono text-meta font-semibold text-ink">{c.cls}</code>
              <code className="w-64 shrink-0 font-mono text-meta text-ink-muted">{c.value}</code>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{c.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Probador />

      <Section
        title="Lo que no se mueve"
        note="La lista más importante de esta vista, porque el movimiento que no está es el que nadie reclama y el que más molesta cuando aparece."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Las tarjetas en hover', 'Una grilla que salta hace temblar la vista entera, y el salto no informa nada: ya sabías dónde tenías el mouse.'],
            ['Las acciones que aparecen al pasar', 'Un botón que se revela con el mouse no se descubre sin mouse, y tapa justo lo que estabas mirando.'],
            ['El contenido al cargar', 'Nada entra desde abajo ni se desvanece. El esqueleto ocupa el lugar exacto de lo que viene, así que cuando llega no se mueve nada.'],
            ['El foco', 'El anillo aparece y desaparece sin transición: es un aviso, y un aviso que tarda 190ms en verse llega tarde.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-5">
              <div className="flex items-center gap-2">
                <Icon name="close" size={14} className="text-bad" />
                <span className="text-label font-semibold text-ink">{t}</span>
              </div>
              <p className="max-w-[46ch] text-body text-ink-muted">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Apagarlo no es congelarlo"
        note="Con prefers-reduced-motion todas las animaciones se van y las transiciones bajan a un milisegundo. Pero lo que informa por moverse necesita otra salida, no la misma."
      >
        <div className="flex flex-col gap-3">
          {[
            ['El spinner', 'gira lento, 2.4s por vuelta', 'Es lo único que avisa que algo está pasando: quieto no dice nada, y quieto parece colgado.'],
            ['Las carpetas', 'las hojas quedan afuera, sin abanicar', 'La información —cuántas hay— se sigue viendo, que era el punto del abanico.'],
            ['El libro', 'no rota', 'La rotación era gusto y nada más, así que se va entera.'],
            ['Todo lo demás', 'aparece y desaparece', 'Un panel que llega en 1ms sigue llegando: lo que se pierde es el recorrido, no el estado.'],
          ].map(([q, comoQueda, porque]) => (
            <div key={q} className="flex flex-wrap items-baseline gap-x-5 gap-y-1 rounded-xl border border-line bg-surface px-5 py-4">
              <span className="w-36 shrink-0 text-body font-semibold text-ink">{q}</span>
              <span className="w-56 shrink-0 text-body text-ink">{comoQueda}</span>
              <span className="min-w-0 flex-1 text-meta text-ink-muted">{porque}</span>
            </div>
          ))}
        </div>
      </Section>

      <Note icon="campaign" title="Lo que se mueve porque sí">
        La regla de arriba es para la interfaz. Una mascota que saluda, una ilustración que respira,
        una celebración cuando algo salió bien: eso es contenido, no interfaz, y ahí el movimiento
        no tiene que explicar nada — puede simplemente dar gusto. Es la parte del sistema que le
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
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="raised" onClick={() => setAbierto(v => !v)}>
            {abierto ? 'Cerrar' : 'Abrir'}
          </Button>
          <span className="flex items-center gap-2 text-body text-ink">
            <Switch checked={lento} onChange={setLento} label="Usar duration-normal" />
            <button type="button" onClick={() => setLento(v => !v)} className="rounded-sm">
              Usar <code className="font-mono">duration-normal</code>
            </button>
          </span>
        </div>
        <div className="flex min-h-[120px] items-start">
          <div
            className={[
              'rounded-xl border border-line bg-muted px-5 py-4 ease-out',
              lento ? 'duration-normal' : 'duration-fast',
              'transition-[opacity,transform]',
              abierto ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
            ].join(' ')}
          >
            <span className="text-body font-semibold text-ink">Entregas sin corregir</span>
            <p className="mt-1 max-w-[38ch] text-meta text-ink-muted">
              Entra con <code>ease-out</code>: arranca rápido y frena, así que llega antes de que el
              movimiento termine.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
