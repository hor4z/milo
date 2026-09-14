import cls from './reorder.module.css'
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
  /** De qué es la lista. Sin esto un lector dice "lista" y nada más. */
  label: string
  /** Lo que va adentro de cada fila, a la derecha de la manija. */
  children: (item: T, i: number) => ReactNode
  className?: string
}) {
  const [agarrado, setAgarrado] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  const filas = useRef<Record<string, HTMLLIElement | null>>({})
  const cuerpos = useRef<Record<string, HTMLDivElement | null>>({})
  const manijas = useRef<Record<string, HTMLButtonElement | null>>({})

  const vivo = useRef(items)
  vivo.current = items

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
    agarre.current = e.clientY - ranura.getBoundingClientRect().top

    const seguir = () => {
      const actual = agarradoRef.current
      const fila = actual ? filas.current[actual] : null
      if (!actual || !fila) return
      pegarAlDedo(actual)

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
      <ul aria-label={label} className={cx(cls.root, className)}>
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={el => { filas.current[item.id] = el }}
            className={cx(cls.slot, agarrado === item.id && cls.slotDragging)}
          >
          <div
            ref={el => { cuerpos.current[item.id] = el }}
            className={cx(
              `${cls.item} bg-surface`,
              cls.itemMotion,
              agarrado === item.id ? cls.itemLifted : cls.itemResting,
            )}
          >
            <button
              type="button"
              ref={el => { manijas.current[item.id] = el }}
              aria-label={`Mover ${item.label}, posición ${i + 1} de ${items.length}`}
              aria-describedby="reorder-ayuda"
              onKeyDown={e => teclas(e, item.id)}
              onPointerDown={e => arrastrar(e, item.id)}
              className={cls.handle}
            >
              <Icon name="drag_indicator" size={18} weight={400} className={cls.icon} />
            </button>
            <div className={cls.body}>{children(item, i)}</div>
          </div>
          </li>
        ))}
      </ul>
      <span id="reorder-ayuda" className="sr-only">Con las flechas arriba y abajo se mueve de lugar.</span>
      <span aria-live="polite" className="sr-only">{aviso}</span>
    </>
  )
}
