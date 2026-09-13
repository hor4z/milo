import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  const filas = useRef<Record<string, HTMLLIElement | null>>({})
  const manijas = useRef<Record<string, HTMLButtonElement | null>>({})
  // El arrastre dura varios renders y cambia la lista en el medio: leerla del
  // cierre deja el orden viejo después del primer cambio, y el segundo se
  // calcula contra una lista que ya no existe.
  const vivo = useRef(items)
  vivo.current = items

  // El aviso se limpia solo: si se queda, un lector lo repite al volver a entrar.
  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 1200)
    return () => clearTimeout(t)
  }, [aviso])

  const llevar = (id: string, paso: number) => {
    const de = items.findIndex(x => x.id === id)
    const a = de + paso
    if (de < 0 || a < 0 || a >= items.length) return
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

  /** Con el puntero: al cruzar la mitad de la fila vecina, cambian de lugar. */
  const arrastrar = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    e.preventDefault()
    setAgarrado(id)
    const mueve = (ev: PointerEvent) => {
      const lista = vivo.current
      const de = lista.findIndex(x => x.id === id)
      for (let i = 0; i < lista.length; i++) {
        if (i === de) continue
        const caja = filas.current[lista[i].id]?.getBoundingClientRect()
        if (!caja) continue
        const cruzo = i < de ? ev.clientY < caja.top + caja.height / 2 : ev.clientY > caja.top + caja.height / 2
        if (cruzo) { onReorder(mover(lista, de, i)); break }
      }
    }
    const suelta = () => {
      setAgarrado(null)
      removeEventListener('pointermove', mueve)
      removeEventListener('pointerup', suelta)
      removeEventListener('pointercancel', suelta)
    }
    addEventListener('pointermove', mueve)
    addEventListener('pointerup', suelta)
    addEventListener('pointercancel', suelta)
  }

  return (
    <>
      <ul aria-label={label} className={cx('flex flex-col gap-1', className)}>
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={el => { filas.current[item.id] = el }}
            className={cx(
              'flex items-center gap-2 rounded-lg border border-line bg-surface p-2 transition-colors duration-fast ease-out',
              agarrado === item.id && 'bg-hover shadow-toolbar',
            )}
          >
            {/* La manija es un botón y no un adorno: con el teclado, mover es
                enfocarla y usar las flechas. Sin eso, reordenar sería una
                interacción que solo existe con mouse — y eso es media aula. */}
            <button
              type="button"
              ref={el => { manijas.current[item.id] = el }}
              aria-label={`Mover ${item.label}, posición ${i + 1} de ${items.length}`}
              aria-describedby="reorder-ayuda"
              onKeyDown={e => teclas(e, item.id)}
              onPointerDown={e => arrastrar(e, item.id)}
              className="inline-flex size-8 shrink-0 cursor-grab items-center justify-center rounded-md transition-colors duration-fast ease-out hover:bg-hover active:cursor-grabbing"
            >
              <Icon name="drag_indicator" size={18} className="icon-muted" />
            </button>
            <div className="min-w-0 flex-1">{children(item, i)}</div>
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
