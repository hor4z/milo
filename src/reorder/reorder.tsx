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

const move = <T,>(list: T[], fromIndex: number, toIndex: number) => {
  const copy = [...list]
  const [x] = copy.splice(fromIndex, 1)
  copy.splice(toIndex, 0, x)
  return copy
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
  const [grabbed, setGrabbed] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  const slots = useRef<Record<string, HTMLLIElement | null>>({})
  const bodies = useRef<Record<string, HTMLDivElement | null>>({})
  const handles = useRef<Record<string, HTMLButtonElement | null>>({})

  const liveItems = useRef(items)
  liveItems.current = items

  const previousTops = useRef<Record<string, number>>({})
  const recordTops = () => {
    for (const [id, el] of Object.entries(slots.current)) {
      if (el) previousTops.current[id] = el.getBoundingClientRect().top
    }
  }

  const grabbedRef = useRef<string | null>(null)
  const pointerY = useRef(0)
  const grabOffset = useRef(0)
  const frame = useRef(0)

  /** Deja el papel exactamente donde está el dedo, mida lo que mida el layout. */
  const followPointer = (id: string) => {
    const slot = slots.current[id]
    const body = bodies.current[id]
    if (!slot || !body) return
    body.style.transition = 'none'
    body.style.transform = `translateY(${pointerY.current - grabOffset.current - slot.getBoundingClientRect().top}px)`
  }

  useLayoutEffect(() => {
    for (const [id, slot] of Object.entries(slots.current)) {
      const before = previousTops.current[id]
      const body = bodies.current[id]
      if (!slot || !body || before == null) continue
      if (id === grabbedRef.current) {
        followPointer(id)
        continue
      }
      const delta = before - slot.getBoundingClientRect().top
      if (!delta) continue
      body.style.transition = 'none'
      body.style.transform = `translateY(${delta}px)`
      requestAnimationFrame(() => {
        body.style.transition = ''
        body.style.transform = ''
      })
    }
    previousTops.current = {}
  }, [items])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 1200)
    return () => clearTimeout(t)
  }, [aviso])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const moveBy = (id: string, step: number) => {
    const fromIndex = items.findIndex(x => x.id === id)
    const toIndex = fromIndex + step
    if (fromIndex < 0 || toIndex < 0 || toIndex >= items.length) return
    recordTops()
    onReorder(move(items, fromIndex, toIndex))
    setAviso(`${items[fromIndex].label}, posición ${toIndex + 1} de ${items.length}`)
    requestAnimationFrame(() => handles.current[id]?.focus())
  }

  const onKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      moveBy(id, e.key === 'ArrowDown' ? 1 : -1)
    }
  }

  /** Con el puntero: la fila va pegada al dedo y las otras se corren solas. */
  const onGrab = (e: React.PointerEvent, id: string) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.preventDefault()
    const slot = slots.current[id]
    if (!slot) return

    grabbedRef.current = id
    setGrabbed(id)
    pointerY.current = e.clientY
    grabOffset.current = e.clientY - slot.getBoundingClientRect().top

    const follow = () => {
      const currentId = grabbedRef.current
      const slotEl = currentId ? slots.current[currentId] : null
      if (!currentId || !slotEl) return
      followPointer(currentId)

      const list = liveItems.current
      const fromIndex = list.findIndex(x => x.id === grabbedRef.current)
      const center = pointerY.current - grabOffset.current + slotEl.offsetHeight / 2
      for (let i = 0; i < list.length; i++) {
        if (i === fromIndex) continue
        const otherSlot = slots.current[list[i].id]
        if (!otherSlot) continue
        const box = otherSlot.getBoundingClientRect()
        const crossed = i < fromIndex ? center < box.top + box.height / 2 : center > box.top + box.height / 2
        if (crossed) {
          const next = move(list, fromIndex, i)
          liveItems.current = next
          recordTops()
          onReorder(next)
          break
        }
      }

      frame.current = requestAnimationFrame(follow)
    }

    const onPointerMove = (ev: PointerEvent) => { pointerY.current = ev.clientY }
    const onRelease = () => {
      cancelAnimationFrame(frame.current)
      const body = bodies.current[grabbedRef.current ?? '']
      if (body) {
        body.style.transition = ''
        body.style.transform = ''
      }
      grabbedRef.current = null
      setGrabbed(null)
      removeEventListener('pointermove', onPointerMove)
      removeEventListener('pointerup', onRelease)
      removeEventListener('pointercancel', onRelease)
    }

    addEventListener('pointermove', onPointerMove)
    addEventListener('pointerup', onRelease)
    addEventListener('pointercancel', onRelease)
    frame.current = requestAnimationFrame(follow)
  }

  return (
    <>
      <ul aria-label={label} className={cx(cls.root, className)}>
        {items.map((item, i) => (
          <li
            key={item.id}
            ref={el => { slots.current[item.id] = el }}
            className={cx(cls.slot, grabbed === item.id && cls.slotDragging)}
          >
          <div
            ref={el => { bodies.current[item.id] = el }}
            className={cx(
              `${cls.item} bg-surface`,
              cls.itemMotion,
              grabbed === item.id ? cls.itemLifted : cls.itemResting,
            )}
          >
            <button
              type="button"
              ref={el => { handles.current[item.id] = el }}
              aria-label={`Mover ${item.label}, posición ${i + 1} de ${items.length}`}
              aria-describedby="reorder-ayuda"
              onKeyDown={e => onKey(e, item.id)}
              onPointerDown={e => onGrab(e, item.id)}
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
