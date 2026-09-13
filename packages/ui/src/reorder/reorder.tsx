import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from '../icon/icon'
import { cx } from '../lib/cx'

export type ReorderItem = {
  /** Único en la lista: es lo que vuelve en el orden nuevo. */
  id: string
  /** Cómo se llama esta fila cuando se la anuncia al moverla. */
  label: string
}

const mover = <T,>(lista: T[], de: number, a: number) => {
  const copia = [...lista]
  const [x] = copia.splice(de, 1)
  copia.splice(a, 0, x)
  return copia
}

/** Una lista que se reordena: los bloques de una consigna, las etapas de una entrega. */
export function Reorder<T extends ReorderItem>({ items, onReorder, label, children, className }: {
  /** En el orden actual. */
  items: T[]
  /** Recibe la lista entera en el orden nuevo. */
  onReorder: (items: T[]) => void
  /** De qué es la lista. Sin esto un lector dice «lista» y nada más. */
  label: string
  /** Lo que va adentro de cada fila, a la derecha de la manija. */
  children: (item: T, i: number) => ReactNode
  className?: string
}) {
  const [agarrado, setAgarrado] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  // La `li` se queda quieta y es la que mide: es la ranura. Lo que se mueve es
  // el cuerpo de adentro, que es el papel.
  const filas = useRef<Record<string, HTMLLIElement | null>>({})
  const cuerpos = useRef<Record<string, HTMLDivElement | null>>({})
  const manijas = useRef<Record<string, HTMLButtonElement | null>>({})

  // El arrastre dura varios renders y cambia la lista en el medio: leerla del
  // cierre deja el orden viejo después del primer cambio, y el segundo se
  // calcula contra una lista que ya no existe.
  const vivo = useRef(items)
  vivo.current = items

  /* El movimiento se hace con la técnica de medir, invertir y soltar: antes de
     cambiar el orden se anota dónde estaba cada fila; después del render se las
     devuelve a su lugar viejo con un `transform` y sin transición, y al frame
     siguiente se les saca el `transform` con la transición puesta. El navegador
     anima entre las dos posiciones, que es lo único que hace esto barato: no
     hay una sola medición por frame ni un layout animado. */
  const previas = useRef<Record<string, number>>({})
  const anotar = () => {
    for (const [id, el] of Object.entries(filas.current)) {
      if (el) previas.current[id] = el.getBoundingClientRect().top
    }
  }

  const agarradoRef = useRef<string | null>(null)
  const punteroY = useRef(0)
  const agarre = useRef(0)
  const cuadro = useRef(0)

  /** Deja el papel exactamente donde está el dedo, mida lo que mida el layout. */
  const pegarAlDedo = (id: string) => {
    const ranura = filas.current[id]
    const cuerpo = cuerpos.current[id]
    if (!ranura || !cuerpo) return
    cuerpo.style.transition = 'none'
    cuerpo.style.transform = `translateY(${punteroY.current - agarre.current - ranura.getBoundingClientRect().top}px)`
  }

  useLayoutEffect(() => {
    for (const [id, ranura] of Object.entries(filas.current)) {
      const antes = previas.current[id]
      const cuerpo = cuerpos.current[id]
      if (!ranura || !cuerpo || antes == null) continue
      // El que está en la mano no se anima: se lo vuelve a pegar al dedo acá
      // mismo. Si se esperara al cuadro siguiente, el render que lo cambió de
      // lugar ya se pintó y se ve saltar una fila entera.
      if (id === agarradoRef.current) {
        pegarAlDedo(id)
        continue
      }
      const delta = antes - ranura.getBoundingClientRect().top
      if (!delta) continue
      cuerpo.style.transition = 'none'
      cuerpo.style.transform = `translateY(${delta}px)`
      requestAnimationFrame(() => {
        cuerpo.style.transition = ''
        cuerpo.style.transform = ''
      })
    }
    previas.current = {}
  }, [items])

  // El aviso se limpia solo: si se queda, un lector lo repite al volver a entrar.
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 1200)
    return () => clearTimeout(t)
  }, [aviso])

  useEffect(() => () => cancelAnimationFrame(cuadro.current), [])

  const llevar = (id: string, paso: number) => {
    const de = items.findIndex(x => x.id === id)
    const a = de + paso
    if (de < 0 || a < 0 || a >= items.length) return
    anotar()
    onReorder(mover(items, de, a))
    setAviso(`${items[de].label}, posición ${a + 1} de ${items.length}`)
    // El foco sigue a la fila que se movió, que es donde está mirando quien la movió.
    requestAnimationFrame(() => manijas.current[id]?.focus())
  }

  const teclas = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      llevar(id, e.key === 'ArrowDown' ? 1 : -1)
    }
  }

  /** Con el puntero: la fila va pegada al dedo y las otras se corren solas. */
  const arrastrar = (e: React.PointerEvent, id: string) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    const ranura = filas.current[id]
    if (!ranura) return

    agarradoRef.current = id
    setAgarrado(id)
    punteroY.current = e.clientY
    // Dónde agarró dentro de la fila: sin esto la fila salta y se pega al dedo
    // por su borde de arriba en vez de quedarse donde la agarraron.
    agarre.current = e.clientY - ranura.getBoundingClientRect().top

    const seguir = () => {
      const actual = agarradoRef.current
      const fila = actual ? filas.current[actual] : null
      if (!actual || !fila) return
      pegarAlDedo(actual)

      // El cambio de lugar se decide con el centro de la fila agarrada contra
      // el centro de las otras, y no con el dedo: si no, arrastrando desde el
      // borde de abajo el cambio llega tarde.
      const lista = vivo.current
      const de = lista.findIndex(x => x.id === agarradoRef.current)
      const centro = punteroY.current - agarre.current + fila.offsetHeight / 2
      for (let i = 0; i < lista.length; i++) {
        if (i === de) continue
        const otra = filas.current[lista[i].id]
        if (!otra) continue
        const caja = otra.getBoundingClientRect()
        const cruzo = i < de ? centro < caja.top + caja.height / 2 : centro > caja.top + caja.height / 2
        if (cruzo) {
          const nuevo = mover(lista, de, i)
          // El orden nuevo se adelanta al render: entre avisar y volver a
          // dibujar pasan uno o dos cuadros, y en esos el bucle leía el orden
          // viejo y calculaba el cambio siguiente contra una lista que ya no
          // era. De ahí salían permutaciones que nadie pidió.
          vivo.current = nuevo
          anotar()
          onReorder(nuevo)
          break
        }
      }

      cuadro.current = requestAnimationFrame(seguir)
    }

    const mueve = (ev: PointerEvent) => { punteroY.current = ev.clientY }
    const suelta = () => {
      cancelAnimationFrame(cuadro.current)
      const cuerpo = cuerpos.current[agarradoRef.current ?? '']
      if (cuerpo) {
        // Vuelve a su ranura con la transición puesta: soltar no es un corte.
        cuerpo.style.transition = ''
        cuerpo.style.transform = ''
      }
      agarradoRef.current = null
      setAgarrado(null)
      removeEventListener('pointermove', mueve)
      removeEventListener('pointerup', suelta)
      removeEventListener('pointercancel', suelta)
    }

    addEventListener('pointermove', mueve)
    addEventListener('pointerup', suelta)
    addEventListener('pointercancel', suelta)
    cuadro.current = requestAnimationFrame(seguir)
  }

  return (
    <>
      {/* `overflow-anchor: none`: al cambiar el orden cambian las alturas arriba
          del viewport y el navegador compensa moviendo el scroll solo. En medio
          de un arrastre eso se ve como que la página salta — medido, 120px. */}
      <ul aria-label={label} className={cx('flex flex-col gap-1 [overflow-anchor:none]', className)}>
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={el => { filas.current[item.id] = el }}
            // La ranura: se queda quieta y se tiñe mientras el papel está
            // levantado, así se ve dónde va a caer. Va en la pista y no en el
            // gris de superficie: tinta en alpha, así que es el mismo susurro
            // sobre papel blanco y sobre papel oscuro.
            className={cx('rounded-lg', agarrado === item.id && 'bg-track')}
          >
          <div
            ref={el => { cuerpos.current[item.id] = el }}
            className={cx(
              'flex items-center gap-2 rounded-lg border border-line bg-surface p-2',
              'transition-[transform,box-shadow] duration-normal ease-out',
              // El papel se levanta y queda por encima del resto.
              agarrado === item.id ? 'relative z-10 shadow-popover' : 'z-0',
            )}
          >
            {/* La manija es un botón y no un adorno: con el teclado, mover es
                enfocarla y usar las flechas. Sin eso, reordenar sería una
                interacción que solo existe con mouse — y eso es media aula.
                `touch-none` para que arrastrar con el dedo no scrollee la página. */}
            <button
              type="button"
              ref={el => { manijas.current[item.id] = el }}
              aria-label={`Mover ${item.label}, posición ${i + 1} de ${items.length}`}
              aria-describedby="reorder-ayuda"
              onKeyDown={e => teclas(e, item.id)}
              onPointerDown={e => arrastrar(e, item.id)}
              className="inline-flex size-8 shrink-0 cursor-grab touch-none items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-hover active:cursor-grabbing"
            >
              {/* Los puntitos van en el azul de marca y no en el gris de un
                  icono: es la única parte de la fila que se agarra, y la que
                  tiene que encontrarse sin buscarla. El peso se pone a mano
                  porque `icon-muted` era quien lo traía. */}
              <Icon name="drag_indicator" size={18} weight={400} className="text-brand" />
            </button>
            <div className="min-w-0 flex-1">{children(item, i)}</div>
          </div>
          </li>
        ))}
      </ul>
      <span id="reorder-ayuda" className="sr-only">Con las flechas arriba y abajo se mueve de lugar.</span>
      {/* Lo que cambió se dice, porque al moverse con el teclado la pantalla
          cambia sola y nadie avisó. */}
      <span aria-live="polite" className="sr-only">{aviso}</span>
    </>
  )
}
