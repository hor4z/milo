import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ComponentType } from 'react'
import { ToastProvider } from '@milo/ui/toast'

const modules = import.meta.glob('../{stories,foundations,mascots}/*.tsx', { eager: true }) as
  Record<string, Record<string, unknown>>

const views: [string, ComponentType][] = []
for (const [path, mod] of Object.entries(modules)) {
  for (const [name, value] of Object.entries(mod)) {
    if (typeof value !== 'function') continue
    if (!/(Story|Section)$/.test(name)) continue
    views.push([`${path.split('/').pop()} · ${name}`, value as ComponentType])
  }
}

describe('la prosa del sitio', () => {
  it('encuentra todas las vistas', () => {
    expect(views.length).toBeGreaterThan(60)
  })

  for (const [name, View] of views) {
    it(`${name} se dibuja y no deja marcas a la vista`, () => {
      const { container } = render(<ToastProvider><View /></ToastProvider>)
      const loose: string[] = []
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
      let n: Node | null
      while ((n = walker.nextNode())) {
        const text = n.nodeValue ?? ''
        const insideCode = (n.parentElement as HTMLElement | null)?.closest('pre, code')
        if (!insideCode && (text.includes('`') || text.includes('**') || /\]\(#/.test(text))) {
          loose.push(text.trim().slice(0, 60))
        }
        if (/\b(undefined|NaN|\[object Object\])\b/.test(text)) {
          loose.push(text.trim().slice(0, 60))
        }
      }
      expect(loose).toEqual([])
    })
  }
})
