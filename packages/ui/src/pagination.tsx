import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button, cx } from './primitives'

/**
 * La línea de abajo de una tabla: qué tramo se está viendo y cómo pasar al que
 * sigue.
 *
 * **No hay números de página, y eso es una decisión y no una versión reducida.**
 * Una fila de números promete dos cosas: que hay un total sabido y que se puede
 * saltar al séptimo. Un back que pagina por cursor no puede contestar ninguna de
 * las dos —entrega un tramo y dice si hay más—, así que los números serían un
 * control que a veces funciona. Lo que sí se puede contestar siempre es la
 * anterior y la siguiente, y eso es lo que hay acá.
 *
 * Va pegada al cuerpo de la tabla y con su propia línea arriba: es parte de la
 * tabla, no algo que flota abajo. Sin la línea, la última fila y esta franja se
 * leen como si la tabla tuviera una fila más con botones adentro.
 */
export function Pagination({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cx(
        'flex flex-wrap items-center gap-3 border-t border-line px-4 py-3',
        className,
      )}
      {...props}
    />
  )
}

type PaginationStatusProps = Omit<ComponentPropsWithoutRef<'p'>, 'children'> & {
  /** El último de la pantalla, contando desde uno. */
  to: number
  /** El primero de la pantalla. */
  from?: number
  /** Cuántos hay en total. Sin esto solo se dice el tramo. */
  total?: number
  /** Qué se está contando, en plural: «entregas». */
  noun?: string
  /** Reemplaza la frase entera cuando la pantalla tiene una mejor. */
  children?: ReactNode
}

/**
 * Qué tramo se está viendo.
 *
 * Es la misma frase en todos lados para que nadie escriba la suya, y **cuando el
 * tramo es todo deja de contar desde dónde**: «17 entregas» y no «1 a 17 de 17
 * entregas», que dice lo mismo tres veces. Una tabla que entra entera en una
 * pantalla no tiene tramo del que hablar.
 *
 * Lleva `role="status"` y no es adorno: quien pasa al tramo siguiente se queda
 * con el foco en el botón, y el cuerpo de la tabla cambia entero sin avisar
 * nada. Esta línea es lo único que puede contarlo, y como vive acá ninguna
 * pantalla se tiene que acordar.
 *
 * Y va con `tabular`: los números cambian en cada página, y sin ancho fijo la
 * frase se corre sola de un lado al otro mientras paginás.
 */
export function PaginationStatus({
  to, from = 1, total, noun, className, children, ...props
}: PaginationStatusProps) {
  const cola = noun ? ` ${noun}` : ''
  const frase = total !== undefined && from <= 1 && to >= total
    ? `${total}${cola}`
    : total !== undefined
      ? `${from} a ${to} de ${total}${cola}`
      : `${from} a ${to}${cola}`
  return (
    <p role="status" className={cx('tabular text-xs font-medium text-ink-muted', className)} {...props}>
      {children ?? frase}
    </p>
  )
}

type PaginationNavProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  children?: ReactNode
}

/**
 * Los dos viajan juntos y están siempre, apagados en las puntas.
 *
 * **Apagados y no ausentes**: un par que aparece y desaparece corre al otro
 * abajo del dedo que ya iba para ahí. En la primera página, «Anterior»
 * deshabilitado ocupa su lugar y «Siguiente» no se mueve.
 *
 * Son `ghost` y no botones con contorno: la franja ya tiene su línea arriba y el
 * contenedor alrededor, así que un tercer marco ahí adentro es uno de más.
 */
export function PaginationPrev({ className, children = 'Anterior', ...props }: PaginationNavProps) {
  return (
    /* `ml-auto` acá y no en el contenedor: así el par se va a la derecha
       cualquiera sea lo que haya a la izquierda —el status, nada, un selector de
       cuántas filas— sin que el call site acomode nada. */
    <Button type="button" variant="ghost" size="sm" icon="chevron_left" className={cx('ml-auto', className)} {...props}>
      {children}
    </Button>
  )
}

/** Su `disabled` es el «hay más» que contesta el back: mientras haya, hay siguiente. */
export function PaginationNext({ className, children = 'Siguiente', ...props }: PaginationNavProps) {
  return (
    <Button type="button" variant="ghost" size="sm" iconEnd="chevron_right" className={className} {...props}>
      {children}
    </Button>
  )
}
