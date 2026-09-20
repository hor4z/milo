import cls from './avatar.module.css'
import { useEffect, useState, type CSSProperties } from 'react'
import { colorForName, markFill } from '../lib/colors'
import { cx } from '../lib/cx'

/** La inicial de una persona o de un espacio: una letra, o dos si el nombre las tiene. */
function iniciales(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function Root({ name, src, size = 40, label, className }: {
  /** De acá salen la inicial y el tinte, así que la misma persona tiene siempre el mismo color. */
  name: string
  /** Si no carga, queda la inicial: un hueco gris en una fila de cinco se lee como una persona sin nombre. */
  src?: string
  /** El diámetro en px; la inicial y el anillo salen de acá. */
  size?: number
  /** Solo cuando el avatar está solo y nada al lado dice de quién es. Con el nombre escrito al lado sobra, y repetirlo hace que el lector lo diga dos veces. */
  label?: string
  className?: string
}) {
  const [rota, setRota] = useState(false)
  useEffect(() => { setRota(false) }, [src])

  const fill = markFill[colorForName(name)]
  const muestraFoto = Boolean(src) && !rota

  return (
    <span
      className={cx(`${cls.root} mark`, fill, className)}
      style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)), lineHeight: 1 }}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      {iniciales(name)}
      {muestraFoto && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setRota(true)}
          className={cls.photo}
        />
      )}
    </span>
  )
}

/** Varias personas en el lugar de una. */
function Group({
  people, max = 3, size = 28, ring = 'var(--surface)', label, className,
}: {
  /** Sin `src` cae a la inicial. */
  people: readonly { name: string; src?: string }[]
  /** Cuenta avatares, no personas: con un solo sobrante se muestra la cara en vez de un "+1". */
  max?: number
  /** El diámetro de cada uno; el monte sale de acá. */
  size?: number
  /** El color del anillo, que tiene que ser el del fondo de atrás. */
  ring?: string
  /** De quiénes es el grupo. Sin esto se anuncian los nombres, que es lo correcto casi siempre. */
  label?: string
  className?: string
}) {
  const shown = people.length === max + 1 ? people : people.slice(0, max)
  const rest = people.length - shown.length
  const overlap = Math.round(size / 3)
  return (
    <span
      className={cx(cls.stack, className)}
      style={{ '--overlap': `${overlap}px`, '--ring': ring } as CSSProperties}
    >
      {shown.map((p, i) => (
        <Root
          key={`${p.name}-${i}`}
          name={p.name}
          src={p.src}
          size={size}
          className={cx('mark-ring', i > 0 && cls.overlap)}
        />
      ))}
      {rest > 0 && (
        <span
          aria-hidden="true"
          className={cls.rest}
          style={{ width: size, height: size, fontSize: Math.max(10, Math.round(size * 0.3)), lineHeight: 1 }}
        >
          +{rest}
        </span>
      )}
      {/* va en sr-only y no en `hidden`: lo oculto con `hidden` no lo lee nadie */}
      <span className="sr-only">{label ?? people.map(p => p.name).join(', ')}</span>
    </span>
  )
}

/** Una persona en el lugar de un nombre: la foto si carga, y si no la inicial sobre su color. */
export const Avatar = Object.assign(Root, { Group })
