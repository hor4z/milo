import s from './mention.module.css'
import { Avatar } from '../avatar/avatar'
import { Icon, type IconName } from '../icon/icon'
import { colorForName, markFill } from '../lib/colors'
import { cx } from '../lib/cx'

type MentionProps = {
  /** Lo que se lee: el nombre de la persona o del espacio. */
  name: string
  /** La foto, para una persona. Sin ella se dibuja la inicial sobre su color. */
  src?: string
  /** El glifo, para lo que no es una persona: un espacio, una actividad. Va en la misma marca redonda que el avatar, así que las dos formas de una mención pesan igual en el renglón. */
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
        s.root,
        s.tint,
        href
          ? s.linked
          : s.plain,
        className,
      )}
    >
      {icon
        ? (
            <span aria-hidden className={cx(`${s.icon} mark`, markFill[colorForName(name)])}>
              <Icon name={icon} size={12} />
            </span>
          )
        : <Avatar name={name} src={src} size={16} className={s.avatar} />}
      <span className={s.name}>{name}</span>
    </Tag>
  )
}
