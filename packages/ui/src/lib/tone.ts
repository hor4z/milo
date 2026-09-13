import s from './tone.module.css'
import type { IconName } from '../icon/icon'

export type Tone = 'info' | 'ok' | 'warn' | 'bad'

export const toneIcon: Record<Tone, IconName> = {
  info: 'info',
  ok: 'check_circle',
  warn: 'warning',
  bad: 'error',
}

/** El papel de un aviso: su propio tono y su propio borde. Un aviso blanco sobre una tarjeta blanca no avisa nada. */
export const toneSurface: Record<Tone, string> = {
  info: s.info,
  ok: s.ok,
  warn: s.warn,
  bad: s.bad,
}

/** La tinta del tono, para el glifo y para lo que va encima del papel del aviso. */
export const toneInk: Record<Tone, string> = {
  info: s.info2,
  ok: s.ok2,
  warn: s.warn2,
  bad: s.bad2,
}

export const toneClass: Record<Tone, string> = {
  info: s.info3,
  ok: s.ok3,
  warn: s.warn3,
  bad: s.bad3,
}

