import { Avatar } from '../avatar/avatar'
import { Icon, type IconName } from '../icon/icon'
import { cx } from '../lib/cx'

type MentionProps = {
  /** Lo que se lee: el nombre de la persona o del espacio. */
  name: string
  /** La foto, para una persona. Sin ella se dibuja la inicial sobre su color. */
  src?: string
  /** El glifo, para lo que no es una persona: un espacio, una actividad. */
  icon?: IconName
  /** Adónde lleva. Sin esto es texto y no un enlace. */
  href?: string
  className?: string
}

/** Una referencia adentro del texto: quién o qué. Va en el renglón, no lo interrumpe. */
export function Mention({ name, src, icon, href, className }: MentionProps) {
  const Tag = href ? 'a' : 'span'
  return (
    <Tag
      href={href}
      className={cx(
        'inline-flex items-center gap-1 rounded-sm px-0.5 align-baseline',
        'bg-brand-subtle text-brand-ink',
        href
          ? 'underline decoration-current underline-offset-[3px] transition-colors duration-fast ease-out hover:bg-brand-soft hover:decoration-2'
          : 'no-underline',
        className,
      )}
    >
      {icon
        ? <Icon name={icon} size={14} className="shrink-0" />
        : <Avatar name={name} src={src} size={16} className="shrink-0" />}
      {name}
    </Tag>
  )
}
