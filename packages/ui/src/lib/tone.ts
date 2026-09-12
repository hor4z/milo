import { type IconName } from '../icon/icon'

export type Tone = 'info' | 'ok' | 'warn' | 'bad'

export const toneIcon: Record<Tone, IconName> = {
  info: 'info',
  ok: 'check_circle',
  warn: 'warning',
  bad: 'error',
}

export const toneClass: Record<Tone, string> = {
  info: 'bg-brand-subtle text-brand-ink',
  ok: 'bg-ok-subtle text-ok-ink',
  warn: 'bg-warn-subtle text-warn-ink',
  bad: 'bg-bad-subtle text-bad-ink',
}

export const badgeTone: Record<Tone | 'neutral', string> = {
  neutral: 'bg-muted text-ink',
  info: 'bg-brand-subtle text-brand-ink',
  ok: 'bg-ok-subtle text-ok-ink',
  warn: 'bg-warn-subtle text-warn-ink',
  bad: 'bg-bad-subtle text-bad-ink',
}
