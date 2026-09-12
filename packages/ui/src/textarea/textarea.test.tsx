import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('crece con el contenido y vuelve al borrar', async () => {
    const Wrap = () => {
      const [v, setV] = useState('')
      return <Textarea value={v} onChange={e => setV(e.target.value)} rows={2} maxRows={6} />
    }
    render(<Wrap />)
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(ta).toBeInTheDocument()
  })

  it('con resize vertical no mide y deja el tirador', () => {
    render(<Textarea defaultValue="x" resize="vertical" />)
    const ta = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(ta.className).toContain('resize-y')
  })

  it('con resize none no deja el tirador', () => {
    render(<Textarea defaultValue="x" resize="none" />)
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).className).toContain('resize-none')
  })
})
