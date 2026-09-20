import s from './tone.module.css'
import type { IconName } from '../icon/icon'

export type Tone = 'info' | 'ok' | 'warn' | 'bad'

export const toneIcon: Record<Tone, IconName> = {
  info: 'info',
  ok: 'check_circle',
  warn: 'warning',
  bad: 'error',
}

/** El papel de un aviso: su propio tono y sin borde, como el `Callout`. Un aviso blanco sobre una tarjeta blanca no avisa nada, y con el papel teñido el borde ya no suma. */
export const toneSurface: Record<Tone, string> = {
  info: s.surfaceInfo,
  ok: s.surfaceOk,
  warn: s.surfaceWarn,
  bad: s.surfaceBad,
}

/** La tinta del tono, para el glifo y para lo que va encima del papel del aviso. */
export const toneInk: Record<Tone, string> = {
  info: s.inkInfo,
  ok: s.inkOk,
  warn: s.inkWarn,
  bad: s.inkBad,
}

export const toneClass: Record<Tone, string> = {
  info: s.pillInfo,
  ok: s.pillOk,
  warn: s.pillWarn,
  bad: s.pillBad,
}

