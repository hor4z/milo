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
  info: 'bg-brand-soft border-info-border',
  ok: 'bg-ok-subtle border-ok-border',
  warn: 'bg-warn-subtle border-warn-border',
  bad: 'bg-bad-subtle border-bad-border',
}

/** La tinta del tono, para el glifo y para lo que va encima del papel del aviso. */
export const toneInk: Record<Tone, string> = {
  info: 'text-brand-ink',
  ok: 'text-ok-ink',
  warn: 'text-warn-ink',
  bad: 'text-bad-ink',
}

export const toneClass: Record<Tone, string> = {
  info: 'bg-brand-soft text-brand-ink',
  ok: 'bg-ok-subtle text-ok-ink',
  warn: 'bg-warn-subtle text-warn-ink',
  bad: 'bg-bad-subtle text-bad-ink',
}

