import s from './mention.module.css'
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
        s.tag,
        s.box,
        href
          ? s.box2
          : s.box3,
        className,
      )}
    >
      {icon
        ? <Icon name={icon} size={14} className={s.icon} />
        : <Avatar name={name} src={src} size={16} className={s.avatar} />}
      {name}
    </Tag>
  )
}
